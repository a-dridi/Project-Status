import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
const router = express.Router();
const session = require('express-session');
const bcrypt = require('bcryptjs');
const passport = require("passport");
const mailer = require("nodemailer");
const fs = require('fs');
const path = require('path')

import AdminAccount from "./model/AdminAccount";
import Project from "./model/Project";
import ProjectStage from "./model/ProjectStage";

const DATABASE_CONNECTION = "mongodb://127.0.0.1/projectstatus";
//Email settings - Check the file credentials/emailCredentials.txt.template
let emailHost = "";
let emailPort = 465;
let emailSecure = true; //use port 465 if emailSecure is true
let emailUser = "";
let emailPassword = "";

loadCredentials();

const Nexmo = require('nexmo');
//SMS settings - Adjust these settings 
/*
const nexmo = new Nexmo({
apiKey: 'API_KEY',
apiSecret: 'API_SECRET',
applicationId: 'APP_ID',
privateKey: 'PRIVATE_KEY_PATH',
signatureSecret: 'SIGNATURE_SECRET',
signatureMethod: 'SIGNATURE_METHOD'
});
const nexmoVirtualNumber = 'YOUR_VIRTUAL_NUMBER';
*/

//app.use(cors());
//DOMAIN NAME (+ Port number if used) OF THE WEBSITE/WEB SERVER WHERE THIS APPLICATION IS RUNNING - Ex.: https://mydomain.tld
const thisDomainName = "http://localhost:4200"
const thisDomainNameOnly = "http://localhost"

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {    // allow requests with no origin 
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }

        return callback(null, true);
    }
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var allowedOrigins = [thisDomainNameOnly + ':3000', thisDomainNameOnly + ':4200', thisDomainNameOnly + ':4000', 'http://localhost:4000/login'];

mongoose.connect(DATABASE_CONNECTION);
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Mongoose (MongoDB) database connection was created successfully!");
});


// Session and authentication managment - Passport JS
require('./passport')(passport);
const MongoStore = require('connect-mongo')(session);
app.use(session({
    secret: 'sessionsecret392bx',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 36000000,
        httpOnly: false,
        secure: false
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());

/**
 * Load credentials and settings from the files "credentials/emailCredentials.txt" and "credentials/smsCredentials.txt".
 */
function loadCredentials() {
    const emailCredentialsFilePath = "credentials/emailCredentials.txt";
    const smsCredentialsFilePath = "credentials/smsCredentials.txt";

    const emailCredentialsFileStream = fs.createReadStream(emailCredentialsFilePath, { encoding: "utf-8" });
    emailCredentialsFileStream.on('data', data => {
        let emailCredentialsLines = data.split(/\n/);
        let emailCredentialsMap = new Map();
        for (let line in emailCredentialsLines) {
            let codeCrendentialsValue = emailCredentialsLines[line].split("==");
            if (codeCrendentialsValue.length === 2) {
                emailCredentialsMap.set(codeCrendentialsValue[0], codeCrendentialsValue[1]);
            }
        }
        if (emailCredentialsMap.size === 5) {
            emailHost = emailCredentialsMap.get("emailHost");
            emailPort = emailCredentialsMap.get("emailPort");
            if (emailCredentialsMap.get("emailSecure") === "true") {
                emailSecure = true;
            } else if (emailCredentialsMap.get("emailSecure") === "false") {
                emailSecure = false;
            }
            emailUser = emailCredentialsMap.get("emailUser");
            emailPassword = emailCredentialsMap.get("emailPassword");
        }
    });


}


// **** Admin authentication routes START ****

function isAdminUserAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        //res.status(200).json("Session still active");
        return true;
    } else {
        console.log("valided user fail");
        //res.status(400).json("You have to login to access this site");
        res.redirect('admin-login');
        return false;
    }
}

//Registration
router.route("/admin-registration").post((req, res, next) => {
    let registrationUser = req.body;

    if (registrationUser.email.indexOf("@") === -1 || registrationUser.email.indexOf(".") === -1 || registrationUser.email.length < 7) {
        res.status(400).send("Please enter a correct email address!");
        return;
    }

    if (registrationUser.password.length < 6) {
        res.status(400).send("Password must be at least 6 characters long!");
        return;
    }

    /*
    if (registrationUser.password !== registrationUser.password2) {
        res.status(400).send("Password and Password confirmation must be the same!");
        return;
    }
    */

    //Check if user does not exist and DO REGISTRATION
    AdminAccount.findOne({ email: registrationUser.email }).then(adminaccount => {
        if (adminaccount) {
            res.status(400).send("Admin account already exist! Please login with your email address and password.");
        } else {
            //Do registration
            let newAdminUser = new AdminAccount({
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                telephone: req.body.telephone,
                note: req.body.note
            });
            bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(newAdminUser.password, salt, (err, hash) => {
                    if (err) {
                        res.status(400).send(err);
                        return;
                    } else {
                        newAdminUser.password = hash;
                        newAdminUser.save()
                            .then(adminaccount => res.json("Admin account was successfully created."))
                            .catch(err => res.status(400).send(err));
                    }
                }));
        }
    });
});

//Unregistration
router.route("/admin-unregistration").post((req, res, next) => {
    let registeredUser = req.body;

    //Check if user does exist and dO unregistration
    AdminAccount.findOne({ email: registeredUser.email }).then(adminaccount => {
        if (adminaccount) {
            AdminAccount.findByIdAndRemove({ _id: req.params.id }, (err, adminccount) => {
                if (err) {
                    res.json(err);
                } else {
                    res.json("Admin account was removed successfully. You are now unregistered. ")
                }
            });
        } else {
            res.status(400).send("Admin account does not exist!");
        }
    });
});

// Login
router.route("/admin-login").post((req, res, next) => {

    //console.log("log email: " + req.body.email);
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        if (!user) {
            console.log(info);
            return res.status(420).json(info);
        }
        req.logIn(user, function (err) {
            if (err) {
                console.log(info);
                return res.status(410).json(err);
            }
            console.log("Login done");
            res.json("Login was successfully. ");
        });
    })(req, res, next);
});

// Logout
router.route('/admin-logout').get((req, res, next) => {
    if (isAdminUserAuthenticated(req, res, next)) {
        req.logout();
        res.json("Logout was successful.");
        //res.redirect('allappointments');
    }
});

//Get authenticated user - getAuthenticatedAdminAccount()
router.route('/get/authenticated-adminaccount').get((req, res, next) => {
    res.json(req.user);
});

// **** Admin authentication routes END ****

//Admin section
router.route("/admin").get((req, res, next) => {
    if (isAdminUserAuthenticated(req, res, next)) {
        return res.status(200).json(req.user);
    }
});

//getAllAdminAccounts:
router.route("/adminaccounts").get((req, res) => {
    AdminAccount.find((err, adminaccount) => {
        if (err) {
            console.log("DB error - getAllAdminAccounts: " + err);
        } else {
            res.json(adminaccount);
        }
    })
});

//getAllProjects()
router.route("/projects").get((req, res) => {
    Project.find((err, projects) => {
        if (err) {
            console.log(err);
        } else {
            res.json(projects);
        }
    });
});

//getProjectById(id)
router.route("/project/:id").get((req, res) => {
    Project.findById(req.params.id, (err, project) => {
        if (err) {
            console.log(err);
        } else {
            res.json(project);
        }
    });
});

//getProjectByEmailAndId(id, email)
router.route("/project/customer/:projectid/:email").get((req, res) => {
    console.log("* Checking: project id: ");
    console.log(req.params.projectid);
    console.log("* Checking: email ");
    console.log(req.params.email);

    Project.findById({ "_id": req.params.projectid, "client_email": req.params.email }, (err, project) => {
        if (err) {
            console.log(err);
            res.status(400).json("Project id or email is wrong!");
        } else {
            res.json(project);
        }
    });
});

//addProject() - Returns added Project object
router.route('/project/add').post((req, res) => {
    let newProject = new Project(req.body);
    newProject.save()
        .then(project => {
            res.status(200).json(project._id);
        })
        .catch(err => {
            res.status(400).json("Error! Project could not be saved.");
            console.log(err);
        });
});

//updateProject()
router.route('/project/update/:id').post((req, res) => {
    Project.findById(req.params.id, (err, project) => {
        if (!project)
            res.status(400).json("The project that should be updated was not found.");
        else {
            project.title = req.body.title;
            project.description = req.body.description;
            project.created_date = req.body.created_date;
            project.project_id = req.body.project_id;
            project.client_email = req.body.client_email;
            project.finished = req.body.finished;
            project.save().then(project => {
                res.status(200).json("Project was successfully updated.");
            }).catch(err => {
                res.status(400).json("Error! Project could not be updated.");
                console.log(err);
            });
        }
    });
});

//deleteAllProject()
router.route("/projects/deleteall").get((req, res) => {
    Project.remove({}, (err) => {
        if (err) {
            res.status(400).json("Error. Project could not be deleted.");
            console.log(err);
        } else {
            res.status(200).json("Projects were successfully deleted.");
        }
    });
});

//deleteProjectById(id)
router.route("/project/delete/:id").get((req, res) => {
    Project.findByIdAndRemove({ _id: req.params.id }, (err, project) => {
        if (err) {
            res.status(400).json("Error! Project could not be deleted.");
            console.log(err);
        } else {
            res.status(200).json("Project was successfully deleted.");
        }
    });
});

//getProjectStages()
router.route("/projectstages").get((req, res) => {
    ProjectStage.find((err, projectstages) => {
        if (err) {
            console.log(err);
        } else {
            res.json(projectstages);
        }
    });
});

//getProjectStageById()
router.route("/projectstage/:id").get((req, res) => {
    ProjectStage.findById(req.params.id, (err, projectstage) => {
        if (err) {
            console.log(err);
        } else {
            res.json(projectstage);
        }
    });
});

//getProjectStagesByProjectObjectId(objectid)
router.route("/projectstages/project_id/:objectId").get((req, res) => {
    ProjectStage.find({ "project_id": req.params.objectId }).sort({ stage_number: 1 }).exec((err, projectstages) => {
        if (err) {
            console.log(err);
        } else {
            res.json(projectstages);
        }
    });
});

//addProjectStage()
router.route('/projectstage/add').post((req, res) => {
    let newProjectStage = new ProjectStage(req.body);
    newProjectStage.save()
        .then(projectstage => {
            res.status(200).json("Project Stage was added.");
        })
        .catch(err => {
            res.status(400).json("Error! Project Stage could not be saved.");
            console.log(err);
        });
});

//updateProjectStageById(id)
router.route('/projectstage/update/:id').post((req, res) => {
    ProjectStage.findById(req.params.id, (err, projectstage) => {
        if (!projectstage)
            res.status(400).json("The project stage that should be updated was not found.");
        else {
            projectstage.stage_number = req.body.stage_number;
            projectstage.title = req.body.title;
            projectstage.description = req.body.description;
            projectstage.finished = req.body.finished;
            projectstage.project_id = req.body.project_id;
            projectstage.save().then(projectstage => {
                res.status(200).json("Project Stage was successfully updated.");
            }).catch(err => {
                res.status(400).json("Error! Project Stage could not be updated.");
                console.log(err);
            });
        }
    });
});

//deleteAllProjectStages()
router.route("/projectstages/deleteall").get((req, res) => {
    ProjectStage.remove({}, (err) => {
        if (err) {
            res.status(400).json("Error. Project Stages could not be deleted.");
            console.log(err);
        } else {
            res.status(200).json("Project Stages were successfully deleted.");
        }
    });
});

//deleteProjectStageById(id)
router.route("/projectstage/delete/:id").get((req, res) => {
    ProjectStage.findByIdAndRemove({ _id: req.params.id }, (err, projectstage) => {
        if (err) {
            res.status(400).json("Error! Project Stage could not be deleted.");
            console.log(err);
        } else {
            res.status(200).json("Project Stage was successfully deleted.");
        }
    });
});

//sendEmailNotificationClient()
router.route("/email/client/notification").post((req, res) => {
    let smtpEmail = mailer.createTransport({
        host: emailHost,
        port: emailPort,
        secure: emailSecure,
        auth: {
            user: emailUser,
            pass: emailPassword
        }
    });

    smtpEmail.sendMail({
        from: req.body.adminaccount_name + " <" + req.body.adminaccount_email + ">",
        to: req.body.client_email,
        subject: req.body.email_subject,
        text: req.body.email_text,
        html: "<p>" + req.body.email_text + "</p>"
    }).then(info => {
        console.log("Notification Email sent: %s", info.messageId)
    }).catch(err => {
        console.log(err);
    });

});

//sendSMSNotificationClient()
/*
router.route("/sms/client/notification").post((req, res) => {
   nexmo.message.sendSms(nexmoVirtualNumber, req.body.client_number, req.body.sms_text, {type: 'unicode'},
   (err, responseData) => {
    if(err){
        console.log(err);
    } else {
        console.log(responseData);
    }
   });
});
*/

app.use("/api", router);
app.listen(4000, () => console.log("Your Express server runs on the port 4000"));

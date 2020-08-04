const LocalStrategy = require('passport-local').Strategy;
import AdminAccount from "./model/AdminAccount";
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
            //Check entered email
            AdminAccount.findOne({ email: email })
                .then(adminaccount => {
                    if (!adminaccount) {
                        //Admin account does not exist
                        console.log("The entered email is not registered");
                        return done(null, false, { message: 'The entered email is not registered!' });
                    }
                    //Check entered password
                    if (bcrypt.compareSync(password, adminaccount.password)) {
                        return done(null, adminaccount);
                    }
                })
                .catch(err => console.log(err))
        })
    );

    //Save id in session
    passport.serializeUser(function (user, done) {
        done(null, user.id)
    });

    //Get id from session
    passport.deserializeUser(function (id, done) {
        AdminAccount.findById(id, function (err, user) {
            done(err, user);
        });
    });
};

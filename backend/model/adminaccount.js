import mongoose from "mongoose";
/**
 * Model for Admin user. Email and password used for authentication and web app settings
 */
const Schema = mongoose.Schema;

let AdminAccount = new Schema({

    email: {
        type: String,
        required: [true, "Please enter an email address"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"]
    },
    name: {
        type: String
    },
    telephone: {
        type: String
    },
    note: {
        type: String
    }
});

export default mongoose.model('AdminAccount', AdminAccount);
//module.exports = mongoose.models.AdminAccount || mongoose.model('AdminAccount', AdminAccount);
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Project = new Schema({
    title: {
        type: String,
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String
    },
    client_email: {
        type: String
    },
    client_telephone: {
        type: String
    },
    end_date: {
        type: Date
    },
    finished: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('Project', Project);
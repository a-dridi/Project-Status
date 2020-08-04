import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let ProjectStage = new Schema({
    stage_number: {
        type: Number
    },
    title: {
        type: String,
    },
    description: {
        type: String
    },
    finished: {
        type: Boolean,
        Default: false
    },
    project_id: {
        type: String
    }

});

export default mongoose.model('ProjectStage', ProjectStage);
const moongose = require('mongoose');

let consultaSchema = new moongose.Schema({
    date: {
        type: Date,
        required: true
    },
    physio: {
        type: moongose.Schema.Types.ObjectId,
        ref: 'physios',
        required: true
    },
    diagnosis: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 500
    },
    treatment: {
        type: String,
        required: true
    },
    observations: {
        type: String,
        maxlength: 500
    }
});

let recordSchema = new moongose.Schema({
    patient: {
        type: moongose.Schema.Types.ObjectId,
        ref: 'patients',
        required: true
    },
    medicalRecord: {
        type: String,
        maxlength: 1000
    },
    appointments: [consultaSchema]
});

let Record = moongose.model('records', recordSchema);
module.exports = Record;
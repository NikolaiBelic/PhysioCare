const moongose = require('mongoose');

let patientSchema = new moongose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    surname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    birthDate: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        maxlength: 100
    },
    insuranceNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^[A-za-z0-9]{9}$/
    }
});

let Patient = moongose.model('patients', patientSchema);
module.exports = Patient;
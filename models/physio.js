const moongose = require('mongoose');

let physioSchema = new moongose.Schema({
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
    speciality: {
        type: String,
        required: true,
        enum: ['Sports', 'Neurological', 'Pediatric', 'Geriatric', 'Oncological'],
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^[A-za-z0-9]{8}$/
    }
});

let Physio = mongoose.model('physios', physioSchema);
module.exports = Physio;
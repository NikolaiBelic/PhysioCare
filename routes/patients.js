const express = require('express');

let Patient = require(__dirname + '/../models/patient.js');
let router = express.Router();

router.get('/', (req, res) => {
    Patient.find(req.params.id).then(resultado => {
        if (resultado)
            res.status(200)
                .send({ ok: true, resultado: resultado });
        else
            res.status(404)
                .send({
                    ok: false,
                    error: "No hay pacientes en el sistema"
                });
    }).catch(error => {
        res.status(500)
            .send({
                ok: false,
                error: "Error interno del servidor"
            });
    });
});

router.get('/find', (req, res) => {
    if (req.query.surname === "") {
        Patient.find(req.params.id).then(resultado => {
            if (resultado)
                res.status(200)
                    .send({ ok: true, resultado: resultado });
            else
                res.status(404)
                    .send({
                        ok: false,
                        error: "No hay pacientes en el sistema"
                    });
        }).catch(error => {
            res.status(500)
                .send({
                    ok: false,
                    error: "Error interno del servidor"
                });
        });
    } else {
        Patient.find({ surname: { $regex: new RegExp(`^${req.query.surname}$`), $options: 'i' } }).then(resultado => {
            if (resultado.length > 0)
                res.status(200)
                    .send({ ok: true, resultado: resultado });
            else
                res.status(404)
                    .send({
                        ok: false,
                        error: "No se han encontrado pacientes con esos criterios"
                    });
        }).catch(error => {
            res.status(500)
                .send({
                    ok: false,
                    error: "Error interno del servidor"
                });
        });
    }
});


router.get('/:id', (req, res) => {
    Patient.findById(req.params.id).then(resultado => {
        if (resultado)
            res.status(200)
                .send({ ok: true, resultado: resultado });
        else
            res.status(404)
                .send({
                    ok: false,
                    error: "No se ha encontrado el paciente"
                });
    }).catch(error => {
        res.status(500)
            .send({
                ok: false,
                error: "Error interno del servidor"
            });
    });
});

router.post('/', (req, res) => {
    let newPatient = new Patient({
        name: req.body.name,
        surname: req.body.surname,
        birthDate: req.body.birthDate,
        address: req.body.address,
        insuranceNumber: req.body.insuranceNumber
    });
    newPatient.save().then(resultado => {
        res.status(201)
            .send({ ok: true, resultado: resultado });
    }).catch(error => {
        res.status(400)
            .send({
                ok: false,
                error: "Error añadiendo paciente"
            });
    });
});

router.put('/:id', (req, res) => {
    Patient.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            surname: req.body.surname,
            birthDate: req.body.birthDate,
            address: req.body.address,
            insuranceNumber: req.body.insuranceNumber
        }
    }, { new: true, runValidators: true }).then(resultado => {
        if (resultado) {
            res.status(200)
                .send({ ok: true, resultado: resultado });
        }
        else {
            res.status(400)
                .send({ ok: false, error: "Error actualizando los datos del paciente" })
        }
    }).catch(error => {
        res.status(500)
            .send({
                ok: false,
                error: "Error interno del servidor"
            });
    });
});

router.delete('/:id', (req, res) => {
    Patient.findByIdAndDelete(req.params.id)
        .then(resultado => {
            if (resultado) {
                res.status(200)
                    .send({ ok: true, resultado: resultado });
            }
            else {
                res.status(404)
                    .send({ ok: false, error: "No existe el paciente a eliminar" })
            }
        }).catch(error => {
            res.status(500)
                .send({
                    ok: false,
                    error: "Error interno del servidor"
                });
        });
});

module.exports = router;
const express = require('express');

let Record = require(__dirname + '/../models/record.js');
let Patient = require(__dirname + '/../models/patient.js');
let router = express.Router();

router.get('/', (req, res) => {
    Record.find(req.params.id).then(resultado => {
        if (resultado)
            res.status(200)
                .send({ ok: true, resultado: resultado });
        else
            res.status(404)
                .send({
                    ok: false,
                    error: "No hay expedientes en el sistema"
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
    Patient.find({ surname: { $regex: new RegExp(`^${req.query.surname}$`), $options: 'i' } }).then(resultadoSurname => {
        if (resultadoSurname) {
            Record.find({ patient: resultadoSurname }).then(resultado => {
                if (resultado.length > 0)
                    res.status(200)
                        .send({ ok: true, resultado: resultado });
                else
                    res.status(404)
                        .send({
                            ok: false,
                            error: "No se han encontrado expedientes con esos criterios"
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
});

router.get('/:id', (req, res) => {
    Record.findById(req.params.id).then(resultado => {
        if (resultado)
            res.status(200)
                .send({ ok: true, resultado: resultado });
        else
            res.status(404)
                .send({
                    ok: false,
                    error: "No se ha encontrado el expediente"
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
    let newRecord = new Record({
        patient: req.body.patient,
        medicalRecord: req.body.medicalRecord
    });
    newRecord.save().then(resultado => {
        res.status(201)
            .send({ ok: true, resultado: resultado });
    }).catch(error => {
        res.status(400)
            .send({
                ok: false,
                error: "Error añadiendo expediente"
            });
    });
});

router.post('/:id/appointments', (req, res) => {
    Record.findById(req.params.id).then(resultado => {
        if (resultado) {
            resultado.appointments.push({
                date: req.body.date,
                physio: req.body.physio,
                diagnosis: req.body.diagnosis,
                treatment: req.body.treatment,
                observations: req.body.observations
            });
            resultado.save().then(resultado => {
                res.status(201).send({ ok: true, resultado: resultado });
            }).catch(error => {
                res.status(500).send({
                    ok: false,
                    error: "Error interno del servidor"
                });
            });
        } else {
            res.status(404).send({
                ok: false,
                error: "Expediente no encontrado"
            });
        }
    }).catch(error => {
        res.status(500).send({
            ok: false,
            error: "Error interno del servidor"
        });
    });
});

router.delete('/:id', (req, res) => {
    Record.findByIdAndDelete(req.params.id)
        .then(resultado => {
            if (resultado) {
                res.status(200)
                    .send({ ok: true, resultado: resultado });
            }
            else {
                res.status(404)
                    .send({ ok: false, error: "No existe el expediente a eliminar" })
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
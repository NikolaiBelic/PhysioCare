const express = require('express');

const auth = require(__dirname + '/../auth/auth.js');
let Record = require(__dirname + '/../models/record.js');
let Patient = require(__dirname + '/../models/patient.js');
let router = express.Router();

router.get('/', auth.protegerRuta("admin", "physio"), (req, res) => {
    Record.find(req.params.id).then(resultado => {
        if (resultado)
            res.status(200)
                .send({ result: resultado });
        else
            res.status(404)
                .send({
                    error: "No hay expedientes en el sistema"
                });
    }).catch(error => {
        res.status(500)
            .send({
                error: "Error interno del servidor"
            });
    });
});

// ARREGLAR PARA BUSCAR TODOS LOS PACIENTES CON EL MISMO APELLIDO
router.get('/find', auth.protegerRuta("admin", "physio"), (req, res) => {
    Patient.find({ surname: { $regex: new RegExp(`^${req.query.surname}$`), $options: 'i' } }).then(resultadoSurname => {
        if (resultadoSurname) {
            Record.find({ patient: resultadoSurname[0]._id }, 'medicalRecord appointments -_id').then(resultado => {
                if (resultado.length > 0)
                    res.status(200)
                        .send({ result: resultado });
                else
                    res.status(404)
                        .send({
                            error: "No se han encontrado expedientes con esos criterios"
                        });
            }).catch(error => {
                res.status(500)
                    .send({
                        error: "Error interno del servidor"
                    });
            });
        }
    });
});

// POR ID DE PACIENTE
router.get('/:id', auth.protegerRuta("admin", "physio", "patient"), (req, res) => {
    Record.findOne({patient: req.params.id}).then(resultado => {
        if (resultado)
            if (req.user.rol === "patient" && req.user.id !== req.params.id)
                res.status(403)
                    .send({
                        error: "No tienes permiso para ver los datos de este paciente"
                    });
            else {
                res.status(200)
                    .send({ result: resultado });
            }
        else
            res.status(404)
                .send({
                    error: "No se ha encontrado el expediente"
                });
    }).catch(error => {
        res.status(500)
            .send({
                error: "Error interno del servidor"
            });
    });
});

router.post('/', auth.protegerRuta("admin", "physio"), (req, res) => {
    let newRecord = new Record({
        patient: req.body.patient,
        medicalRecord: req.body.medicalRecord
    });
    newRecord.save().then(resultado => {
        res.status(201)
            .send({ result: resultado });
    }).catch(error => {
        res.status(400)
            .send({
                error: "Error añadiendo expediente"
            });
    });
});

router.post('/:id/appointments', auth.protegerRuta("admin", "physio"), (req, res) => {
    Record.findOne({patient: req.params.id}).then(resultado => {
        console.log(resultado);
        if (resultado) {
            console.log(resultado.appointments);
            resultado.appointments.push({
                date: req.body.date,
                physio: req.body.physio,
                diagnosis: req.body.diagnosis,
                treatment: req.body.treatment,
                observations: req.body.observations
            });
            resultado.save().then(resultado => {
                console.log(resultado);
                res.status(201).send({ result: resultado });
            }).catch(error => {
                res.status(500).send({
                    error: "Error interno del servidor"
                });
            });
        } else {
            res.status(404).send({
                error: "Expediente no encontrado"
            });
        }
    }).catch(error => {
        res.status(500).send({
            error: "Error interno del servidor"
        });
    });
});

router.delete('/:id', auth.protegerRuta("admin", "physio"), (req, res) => {
    Record.findByIdAndDelete(req.params.id)
        .then(resultado => {
            if (resultado) {
                res.status(200)
                    .send({ result: resultado });
            }
            else {
                res.status(404)
                    .send({ error: "No existe el expediente a eliminar" })
            }
        }).catch(error => {
            res.status(500)
                .send({
                    error: "Error interno del servidor"
                });
        });
});

module.exports = router;
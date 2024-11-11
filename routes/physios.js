const express = require('express');

let Physio = require(__dirname + '/../models/physio.js');
let router = express.Router();

router.get('/', (req, res) => {
    Physio.find(req.params.id).then(resultado => {
        if (resultado)
            res.status(200)
                .send({ ok: true, resultado: resultado });
        else
            res.status(404)
                .send({
                    ok: false,
                    error: "No hay fisios en el sistema"
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
    if (req.query.specialty === "") {
        Physio.find(req.params.id).then(resultado => {
            if (resultado)
                res.status(200)
                    .send({ ok: true, resultado: resultado });
            else
                res.status(404)
                    .send({
                        ok: false,
                        error: "No hay fisios en el sistema"
                    });
        }).catch(error => {
            res.status(500)
                .send({
                    ok: false,
                    error: "Error interno del servidor"
                });
        });
    } else {
        Physio.find({ specialty: { $regex: new RegExp(`^${req.query.specialty}$`), $options: 'i' } }).then(resultado => {
            if (resultado.length > 0)
                res.status(200)
                    .send({ ok: true, resultado: resultado });
            else
                res.status(404)
                    .send({
                        ok: false,
                        error: "No se han encontrado fisios con esos criterios"
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
    Physio.findById(req.params.id).then(resultado => {
        if (resultado)
            res.status(200)
                .send({ ok: true, resultado: resultado });
        else
            res.status(404)
                .send({
                    ok: false,
                    error: "No se ha encontrado el fisio"
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
    let newPhysio = new Physio({
        name: req.body.name,
        surname: req.body.surname,
        specialty: req.body.specialty,
        licenseNumber: req.body.licenseNumber
    });
    newPhysio.save().then(resultado => {
        res.status(201)
            .send({ ok: true, resultado: resultado });
    }).catch(error => {
        res.status(400)
            .send({
                ok: false,
                error: "Error añadiendo fisio"
            });
    });
});

router.put('/:id', (req, res) => {
    Physio.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            surname: req.body.surname,
            specialty: req.body.specialty,
            licenseNumber: req.body.licenseNumber
        }
    }, { new: true, runValidators: true }).then(resultado => {
        if (resultado) {
            res.status(200)
                .send({ ok: true, resultado: resultado });
        }
        else {
            res.status(400)
                .send({ ok: false, error: "Error actualizando los datos del fisio" })
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
    Physio.findByIdAndDelete(req.params.id)
        .then(resultado => {
            if (resultado) {
                res.status(200)
                    .send({ ok: true, resultado: resultado });
            }
            else {
                res.status(404)
                    .send({ ok: false, error: "No existe el fisio a eliminar" })
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
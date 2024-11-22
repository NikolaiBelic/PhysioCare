const express = require('express');
const bcrypt = require('bcrypt');

const auth = require(__dirname + '/../auth/auth.js');
let Physio = require(__dirname + '/../models/physio.js');
let User = require(__dirname + '/../models/user.js');
let router = express.Router();

router.get('/', auth.protegerRuta("admin", "physio", "patient"), (req, res) => {
    Physio.find(req.params.id).then(resultado => {
        if (resultado)
            res.status(200)
                .send({ result: resultado });
        else
            res.status(404)
                .send({
                    error: "No hay fisios en el sistema"
                });
    }).catch(error => {
        res.status(500)
            .send({
                error: "Error interno del servidor"
            });
    });
});

router.get('/find', auth.protegerRuta("admin", "physio", "patient"), (req, res) => {
        Physio.find({ 
            specialty: { $regex: new RegExp(`^${req.query.specialty}$`), $options: 'i' } }).then(resultado => {
            if (resultado.length > 0)
                res.status(200)
                    .send({ result: resultado });
            else {
                    res.status(404).send({
                        error: "No se han encontrado fisios con esos criterios"
                    });
                }
        }).catch(error => {
            res.status(500)
                .send({
                    error: "Error interno del servidor"
                });
        });
});

router.get('/:id', auth.protegerRuta("admin", "physio", "patient"), (req, res) => {
    Physio.findById(req.params.id).then(resultado => {
        if (resultado)
            res.status(200)
                .send({ result: resultado });
        else
            res.status(404)
                .send({
                    error: "No se ha encontrado el fisio"
                });
    }).catch(error => {
        res.status(500)
            .send({
                error: "Error interno del servidor"
            });
    });
});

// contraseña, delete, posts, 

router.post('/', auth.protegerRuta("admin"), async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        let newUser = new User({
            login: req.body.login,
            password: hashedPassword,
            rol: 'physio'
        });

        const userResult = await newUser.save();

        let newPhysio = new Physio({
            _id: userResult._id,
            name: req.body.name,
            surname: req.body.surname,
            specialty: req.body.specialty,
            licenseNumber: req.body.licenseNumber
        });

        const physioResult = await newPhysio.save();
        res.status(201).send({ result: physioResult });
    } catch (error) {
        console.error("Error guardando el fisio:", error);
        res.status(500).send({
            error: "Error interno del servidor"
        });
    }
});

/* router.post('/', (req, res) => {
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
}); */

router.put('/:id', auth.protegerRuta("admin"), (req, res) => {
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
                .send({ result: resultado });
        }
        else {
            res.status(400)
                .send({ error: "Error actualizando los datos del fisio" })
        }
    }).catch(error => {
        res.status(500)
            .send({
                error: "Error interno del servidor"
            });
    });
});

router.delete('/:id', auth.protegerRuta("admin"), (req, res) => {
    Physio.findByIdAndDelete(req.params.id)
        .then(resultado => {
            if (resultado) {
                res.status(200)
                    .send({ result: resultado });
            }
            else {
                res.status(404)
                    .send({ error: "No existe el fisio a eliminar" })
            }
        }).catch(error => {
            res.status(500)
                .send({
                    error: "Error interno del servidor"
                });
        });
});

module.exports = router;
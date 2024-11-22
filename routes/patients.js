const express = require('express');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const auth = require(__dirname + '/../auth/auth.js');
let Patient = require(__dirname + '/../models/patient.js');
let User = require(__dirname + '/../models/user.js');

let router = express.Router();

router.get('/', auth.protegerRuta("admin", "physio"), (req, res) => {
    Patient.find(req.params.id).then(result => {
        if (result)
            res.status(200)
                .send({ result: result });
        else
            res.status(404)
                .send({
                    error: "No hay pacientes en el sistema"
                });
    }).catch(error => {
        res.status(500)
            .send({
                error: "Error interno del servidor"
            });
    });
});

router.get('/find', auth.protegerRuta("admin", "physio"), (req, res) => {
    if (req.query.surname === "") {
        Patient.find(req.params.id).then(result => {
            if (result)
                res.status(200)
                    .send({ result: result });
            else
                res.status(404)
                    .send({
                        error: "No hay pacientes en el sistema"
                    });
        }).catch(error => {
            res.status(500)
                .send({
                    error: "Error interno del servidor"
                });
        });
    } else {
        Patient.find({ surname: { $regex: req.query.surname /* new RegExp(`^${req.query.surname}$`) */, $options: 'i' } }).then(result => {
            if (result.length > 0)
                res.status(200)
                    .send({ result: result });
            else
                res.status(404)
                    .send({
                        error: "No se han encontrado pacientes con esos criterios"
                    });
        }).catch(error => {
            res.status(500)
                .send({
                    error: "Error interno del servidor"
                });
        });
    }
});


router.get('/:id', auth.protegerRuta("admin", "physio", "patient"), (req, res) => {
    let token = req.headers['authorization'];
    let user = auth.validarToken(token.substring(7));
    
    Patient.findById(req.params.id).then(result => {
        if (result)
            if (user.rol === "patient" && user.id !== req.params.id)
                res.status(403)
                    .send({
                        error: "No tienes permiso para ver los datos de este paciente"
                    });
            else {
                res.status(200)
                    .send({ result: result });
            }
        else {
            res.status(404)
                .send({
                    error: "No se ha encontrado el paciente"
                });
        }
    }).catch(error => {
        res.status(500)
            .send({
                error: "Error interno del servidor"
            });
    });
});

router.post('/', auth.protegerRuta("admin", "physio"), async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        let newUser = new User({
            login: req.body.login,
            password: hashedPassword,
            rol: 'patient'
        });

        const userResult = await newUser.save();

        let newPatient = new Patient({
            _id: userResult._id,
            name: req.body.name,
            surname: req.body.surname,
            birthDate: req.body.birthDate,
            address: req.body.address,
            insuranceNumber: req.body.insuranceNumber,
        });

        const patientResult = await newPatient.save();
        res.status(201).send({ result: patientResult });
    } catch (error) {
        console.error("Error guardando el usuario o el paciente:", error);
        res.status(500).send({
            error: "Error interno del servidor"
        });
    }
});

/* router.post('/', (req, res) => {
    // Crear un nuevo usuario
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    let newUser = new User({
        login: req.body.login,
        password: hashedPassword,
        role: 'patient'
    });

    newUser.save().then(userResult => {
        // Crear un nuevo paciente con el ID del usuario creado
        let newPatient = new Patient({
            _id: userResult._id,
            name: req.body.name,
            surname: req.body.surname,
            birthDate: req.body.birthDate,
            address: req.body.address,
            insuranceNumber: req.body.insuranceNumber,
        });

        newPatient.save().then(patientResult => {
            res.status(201).send({ ok: true, result: patientResult });
        }).catch(error => {
            console.error("Error guardando el paciente:", error);
            res.status(500).send({
                ok: false,
                error: "Error interno del servidor"
            });
        });
    }).catch(error => {
        console.error("Error guardando el usuario:", error);
        res.status(500).send({
            ok: false,
            error: "Error interno del servidor"
        });
    });
}); */

/* router.post('/', (req, res) => {
    let newPatient = new Patient({
        name: req.body.name,
        surname: req.body.surname,
        birthDate: req.body.birthDate,
        address: req.body.address,
        insuranceNumber: req.body.insuranceNumber
    });
    let newUser = new User({
        login: req.body.login,
        password: req.body.password,
        role: 'patient'
    });

    newUser.save().then(userResult => {
        let newPatient = new Patient({
            _id: userResult._id,
            name: req.body.name,
            surname: req.body.surname,
            birthDate: req.body.birthDate,
            address: req.body.address,
            insuranceNumber: req.body.insuranceNumber,
        });
        newPatient.save().then(result => {
            res.status(201)
                .send({ ok: true, result: result });
        }).catch(error => {
            res.status(400)
                .send({
                    ok: false,
                    error: "Error añadiendo paciente"
                });
        });
    }).catch(error => {
        res.status(400)
        .send({
            ok: false,
            error: "Error añadiendo usuario"
        });
    });
}); */

router.put('/:id', auth.protegerRuta("admin", "physio"), (req, res) => {
    Patient.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            surname: req.body.surname,
            birthDate: req.body.birthDate,
            address: req.body.address,
            insuranceNumber: req.body.insuranceNumber
        }
    }, { new: true, runValidators: true }).then(result => {
        if (result) {
            res.status(200)
                .send({ result: result });
        }
        else {
            res.status(400)
                .send({ error: "Error actualizando los datos del paciente" })
        }
    }).catch(error => {
        res.status(500)
            .send({
                error: "Error interno del servidor"
            });
    });
});

router.delete('/:id', auth.protegerRuta("admin", "physio"), (req, res) => {
    Patient.findByIdAndDelete(req.params.id)
        .then(result => {
            if (result) {
                res.status(200)
                    .send({ result: result });
            }
            else {
                res.status(404)
                    .send({ error: "No existe el paciente a eliminar" })
            }
        }).catch(error => {
            res.status(500)
                .send({
                    error: "Error interno del servidor"
                });
        });
});

module.exports = router;
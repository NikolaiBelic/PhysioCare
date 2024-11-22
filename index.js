const mongoose = require('mongoose');
const express = require('express');

mongoose.set('strictQuery', true);

const patients = require(__dirname + "/routes/patients");
const physios = require(__dirname + "/routes/physios");
const records = require(__dirname + "/routes/records");
const users = require(__dirname + "/routes/users");
const auth = require(__dirname + '/routes/auth');

mongoose.connect('mongodb://127.0.0.1:27017/physiocare');

let app = express();
app.use(express.json());
app.use('/patients', patients);
app.use('/physios', physios);
app.use('/records', records);
app.use('/users', users);
app.use('/auth', auth);
app.listen(8080);

// result en vez de result
// quitar todos los ok
// mismo servicio post de paciente y fisio se crea el usuario y se le añade al paciente el id de ese usuario
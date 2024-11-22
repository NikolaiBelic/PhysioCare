const express = require('express');
const bcrypt = require('bcrypt');
const auth = require(__dirname + '/../auth/auth');
let router = express.Router();

let User = require(__dirname + '/../models/user.js');

// Simulamos la base de datos así
/* const usuarios = [
    { usuario: 'nacho', password: '12345', rol: 'admin' },
    { usuario: 'alex', password: 'alex111', rol: 'normal' }
];
 */

router.post('/login', async (req, res) => {
    let login = req.body.login;
    let password = req.body.password;

    try {
        // Buscar el usuario por login
        const user = await User.findOne({ login: login });

        // Comparar la contraseña encriptada
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword || !user) {
            return res.status(401).send({
                error: "login incorrecto"
            });
        } else {
            res.status(200).send({
                result: auth.generarToken(user._id, user.login,
                    user.rol)
            });
        }
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).send({
            error: "Error interno del servidor"
        });
    }
});

module.exports = router;
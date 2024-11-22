const jwt = require('jsonwebtoken');

const secreto = "secretoNode";

let generarToken = (id, login, rol) => jwt.sign({ id: id, login: login, rol: rol }, secreto, { expiresIn: "2 hours" });

let validarToken = token => {
    try {
        let result = jwt.verify(token, secreto);
        return result;
    } catch (e) { }
}

let protegerRuta = (...rol) => {
    return (req, res, next) => {
        let token = req.headers['authorization'];
        if (token) {
            token = token.substring(7);
            let result = validarToken(token);
            if (result && rol.includes(result.rol))
                next();
            else
                res.status(403).send({ error: "Acceso no autorizado"});
        } else
            res.status(403)
                .send({ error: "Acceso no autorizado" });
    }
};

module.exports = {
    generarToken: generarToken,
    validarToken: validarToken,
    protegerRuta: protegerRuta
};
const jwt = require('jsonwebtoken');

const secreto = "secretoNode";

let generarToken = (id, login, rol) => jwt.sign({ id: id, login: login, rol: rol }, secreto, { expiresIn: "2 hours" });

let validarToken = token => {
    try {
        let resultado = jwt.verify(token, secreto);
        return resultado;
    } catch (e) { }
}

let protegerRuta = (...rol) => {
    return (req, res, next) => {
        let token = req.headers['authorization'];
        if (token) {
            token = token.substring(7);
            let resultado = validarToken(token);
            if (resultado && rol.includes(resultado.rol))
                next();
            else
                res.send({ error: "Acceso no autorizado" });
        } else
            res.send({ error: "Acceso no autorizado" });
    }
};

/* let protegerRuta =  => {
    return (req, res, next) => {
        let token = req.headers['authorization'];
        if (token) {
            token = token.substring(7);
            let resultado = validarToken(token);
            if (resultado && ( === "" || rol === resultado.rol))
                next();
            else
                res.send({ ok: false, error: "Acceso no autorizado" });
        } else
            res.send({ ok: false, error: "Acceso no autorizado" });
    }
}; */

module.exports = {
    generarToken: generarToken,
    validarToken: validarToken,
    protegerRuta: protegerRuta
};
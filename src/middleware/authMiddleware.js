const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Debes iniciar sesión para acceder a este recurso.'
        });
    }

    const token = authorization.slice('Bearer '.length).trim();

    try {
        req.usuario = jwt.verify(token, process.env.JWT_SECRET, {
            issuer: 'pos-api'
        });
        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token inválido o vencido. Inicia sesión nuevamente.'
        });
    }

};

module.exports = authMiddleware;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthModel = require('../model/authModel');

const login = async (req, res) => {

    const { usuario, password } = req.body;

    if (
        typeof usuario !== 'string' ||
        !usuario.trim() ||
        typeof password !== 'string' ||
        !password
    ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Debe enviar usuario y password'
        });
    }

    if (!process.env.JWT_SECRET) {
        console.error('Falta configurar JWT_SECRET.');
        return res.status(500).json({
            ok: false,
            mensaje: 'La autenticación no está configurada en el server.'
        });
    }

    try {

        const cuenta = await AuthModel.obtenerPorUsuario(usuario.trim());

        if (!cuenta) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Usuario o contraseña incorrectos.'
            });
        }

        const pareceBcrypt = /^\$2[aby]\$/.test(cuenta.password_hash);

        const passwordValida = pareceBcrypt
            ? await bcrypt.compare(password, cuenta.password_hash)
            : password === cuenta.password_hash;

        if (!passwordValida) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Usuario o contraseña incorrectos.'
            });
        }

        // ya tenemos las claves puestas, entonces en el primer login
        // hace la conversión a hash y no queden contraseñas planas en db
        if (!pareceBcrypt) {
            const hash = await bcrypt.hash(password, 12);
            await AuthModel.actualizarPasswordHash(cuenta.id_usuario, hash);
        }

        const token = jwt.sign(
            {
                rol: cuenta.rol,
                id_sucursal: cuenta.id_sucursal
            },
            process.env.JWT_SECRET,
            {
                subject: String(cuenta.id_usuario),
                expiresIn: '1h',
                issuer: 'pos-api'
            }
        );

        return res.json({
            ok: true,
            mensaje: 'Inicio de sesión exitoso.',
            token,
            expira_en: '1h',
            usuario: {
                id_usuario: cuenta.id_usuario,
                nombre: cuenta.nombre,
                usuario: cuenta.usuario,
                rol: cuenta.rol,
                id_sucursal: cuenta.id_sucursal
            }
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({
            ok: false,
            mensaje: 'Error interno al iniciar sesión.'
        });
    }

};

module.exports = { login };
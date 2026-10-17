const db = require('../config/db');

const AuthModel = {
    obtenerPorUsuario: async (usuario) => {
        const [rows] = await db.query(
            `SELECT id_usuario, nombre, usuario, password_hash, rol, id_sucursal
             FROM usuarios
             WHERE usuario = ?`,
            [usuario]
        );

        return rows[0];
    },

    actualizarPasswordHash: async (id, passwordHash) => {
        await db.query(
            `UPDATE usuarios SET password_hash = ? WHERE id_usuario = ?`,
            [passwordHash, id]
        );
    }

};

module.exports = AuthModel;
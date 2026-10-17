const db = require('../config/db');

const UsuarioModel = {
    obtenerTodos: async (nombre = '') => {
        const [rows] = nombre
            ? await db.query(
                `SELECT id_usuario, nombre, usuario, rol, id_sucursal
                 FROM usuarios WHERE nombre LIKE ?`,
                [`%${nombre.trim()}%`]
            )
            : await db.query(
                `SELECT id_usuario, nombre, usuario, rol, id_sucursal FROM usuarios`
            );

        return rows;
    },

    obtenerPorId: async (id) => {
        const [rows] = await db.query(
            `SELECT id_usuario, nombre, usuario, rol, id_sucursal
             FROM usuarios WHERE id_usuario = ?`,
            [id]
        );
        return rows[0];
    },

    crear: async ({ nombre, usuario, password_hash, rol, id_sucursal }) => {
        const [result] = await db.query(
            `INSERT INTO usuarios (nombre, usuario, password_hash, rol, id_sucursal)
             VALUES (?, ?, ?, ?, ?)`,
            [nombre, usuario, password_hash, rol, id_sucursal ?? null]
        );
        return result.insertId;
    },

    actualizar: async (id, { nombre, usuario, password_hash, rol, id_sucursal }) => {
        const [result] = await db.query(
            `UPDATE usuarios
             SET nombre = ?, usuario = ?, password_hash = ?, rol = ?, id_sucursal = ?
             WHERE id_usuario = ?`,
            [nombre, usuario, password_hash, rol, id_sucursal ?? null, id]
        );
        return result.affectedRows;
    },

    eliminar: async (id) => {
        const [result] = await db.query(
            'DELETE FROM usuarios WHERE id_usuario = ?',
            [id]
        );
        return result.affectedRows;
    }
};

module.exports = UsuarioModel;

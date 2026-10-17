const db = require('../config/db');

const SucursalModel = {
    obtenerTodos: async (nombre = '') => {
        const [rows] = nombre
            ? await db.query(
                'SELECT * FROM sucursales WHERE nombre LIKE ?',
                [`%${nombre.trim()}%`]
            )
            : await db.query('SELECT * FROM sucursales');

        return rows;
    },

    obtenerPorId: async (id) => {
        const [rows] = await db.query(
            'SELECT * FROM sucursales WHERE id_sucursal = ?',
            [id]
        );
        return rows[0];
    },

    crear: async ({ nombre, direccion, telefono }) => {
        const [result] = await db.query(
            'INSERT INTO sucursales (nombre, direccion, telefono) VALUES (?, ?, ?)',
            [nombre, direccion ?? null, telefono ?? null]
        );
        return result.insertId;
    },

    actualizar: async (id, { nombre, direccion, telefono }) => {
        const [result] = await db.query(
            `UPDATE sucursales
             SET nombre = ?, direccion = ?, telefono = ?
             WHERE id_sucursal = ?`,
            [nombre, direccion ?? null, telefono ?? null, id]
        );
        return result.affectedRows;
    },

    eliminar: async (id) => {
        const [result] = await db.query(
            'DELETE FROM sucursales WHERE id_sucursal = ?',
            [id]
        );
        return result.affectedRows;
    }
};

module.exports = SucursalModel;
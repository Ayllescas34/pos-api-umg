const db = require('../config/db');

const CategoriaModel = {
    obtenerTodos: async (nombre = '') => {
        if (nombre) {
            const parametro = `%${nombre.trim()}%`;
            const [rows] = await db.query(
                'SELECT * FROM categorias WHERE nombre LIKE ?',
                [parametro]
            );
            return rows;
        }

        const [rows] = await db.query('SELECT * FROM categorias');
        return rows;
    },

    obtenerPorId: async (id) => {
        const [rows] = await db.query(
            'SELECT * FROM categorias WHERE id_categoria = ?',
            [id]
        );
        return rows[0];
    },

    crear: async (datos) => {
        const { nombre, descripcion } = datos;
        const [result] = await db.query(
            'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion]
        );
        return result.insertId;
    },

    actualizar: async (id, datos) => {
        const { nombre, descripcion } = datos;
        const [result] = await db.query(
            'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?',
            [nombre, descripcion, id]
        );
        return result.affectedRows;
    },

    eliminar: async (id) => {
        const [result] = await db.query(
            'DELETE FROM categorias WHERE id_categoria = ?',
            [id]
        );
        return result.affectedRows;
    }
};

module.exports = CategoriaModel;
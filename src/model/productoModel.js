const db = require('../config/db');

const ProductoModel = {
    obtenerTodos: async (nombre = '') => {
        const [rows] = nombre
            ? await db.query(
                `SELECT p.*, c.nombre AS categoria
                 FROM productos p
                 LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
                 WHERE p.nombre LIKE ?`,
                [`%${nombre.trim()}%`]
            )
            : await db.query(
                `SELECT p.*, c.nombre AS categoria
                 FROM productos p
                 LEFT JOIN categorias c ON p.id_categoria = c.id_categoria`
            );

        return rows;
    },

    obtenerPorId: async (id) => {
        const [rows] = await db.query(
            `SELECT p.*, c.nombre AS categoria
             FROM productos p
             LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
             WHERE p.id_producto = ?`,
            [id]
        );
        return rows[0];
    },

    crear: async ({
        codigo_barras, nombre, descripcion, precio_venta,
        costo, stock, id_categoria
    }) => {
        const [result] = await db.query(
            `INSERT INTO productos
             (codigo_barras, nombre, descripcion, precio_venta, costo, stock, id_categoria)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                codigo_barras ?? null, nombre, descripcion ?? null,
                precio_venta, costo, stock ?? 0, id_categoria ?? null
            ]
        );
        return result.insertId;
    },

    actualizar: async (id, {
        codigo_barras, nombre, descripcion, precio_venta,
        costo, stock, id_categoria
    }) => {
        const [result] = await db.query(
            `UPDATE productos SET codigo_barras = ?, nombre = ?, descripcion = ?,
             precio_venta = ?, costo = ?, stock = ?, id_categoria = ?
             WHERE id_producto = ?`,
            [
                codigo_barras ?? null, nombre, descripcion ?? null,
                precio_venta, costo, stock, id_categoria ?? null, id
            ]
        );
        return result.affectedRows;
    },

    eliminar: async (id) => {
        const [result] = await db.query(
            'DELETE FROM productos WHERE id_producto = ?',
            [id]
        );
        return result.affectedRows;
    }
};

module.exports = ProductoModel;
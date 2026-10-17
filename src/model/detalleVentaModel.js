const db = require('../config/db');

const DetalleVentaModel = {
    obtenerPorVenta: async (idVenta) => {
        const [rows] = await db.query(
            `SELECT dv.*, p.nombre AS producto
             FROM detalle_ventas dv
             LEFT JOIN productos p ON dv.id_producto = p.id_producto
             WHERE dv.id_venta = ?`,
            [idVenta]
        );
        return rows;
    },

    crear: async ({ id_venta, id_producto, cantidad, precio_unitario }) => {
        const qty = Number(cantidad);
        const precio = Number(precio_unitario);

        if (!Number.isInteger(qty) || qty <= 0 ||
            !Number.isFinite(precio) || precio < 0) {
            throw new Error('Cantidad o precio_unitario inválido.');
        }

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [productoRows] = await connection.query(
                'SELECT stock FROM productos WHERE id_producto = ? FOR UPDATE',
                [id_producto]
            );

            if (!productoRows[0]) throw new Error('Producto no encontrado.');
            if (productoRows[0].stock < qty) throw new Error('Stock insuficiente.');

            const [ventaRows] = await connection.query(
                'SELECT total FROM ventas WHERE id_venta = ? FOR UPDATE',
                [id_venta]
            );

            if (!ventaRows[0]) throw new Error('Venta no encontrada.');

            const subtotal = Number((qty * precio).toFixed(2));

            const [result] = await connection.query(
                `INSERT INTO detalle_ventas
                 (id_venta, id_producto, cantidad, precio_unitario, subtotal)
                 VALUES (?, ?, ?, ?, ?)`,
                [id_venta, id_producto, qty, precio, subtotal]
            );

            await connection.query(
                'UPDATE productos SET stock = stock - ? WHERE id_producto = ?',
                [qty, id_producto]
            );

            await connection.query(
                'UPDATE ventas SET total = total + ? WHERE id_venta = ?',
                [subtotal, id_venta]
            );

            await connection.commit();
            return { id_ventadet: result.insertId, subtotal };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    eliminar: async (id) => {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [rows] = await connection.query(
                `SELECT id_venta, id_producto, cantidad, subtotal
                 FROM detalle_ventas WHERE id_ventadet = ? FOR UPDATE`,
                [id]
            );

            if (!rows[0]) {
                await connection.rollback();
                return 0;
            }

            const detalle = rows[0];

            await connection.query(
                'DELETE FROM detalle_ventas WHERE id_ventadet = ?',
                [id]
            );

            await connection.query(
                'UPDATE productos SET stock = stock + ? WHERE id_producto = ?',
                [detalle.cantidad, detalle.id_producto]
            );

            await connection.query(
                'UPDATE ventas SET total = total - ? WHERE id_venta = ?',
                [detalle.subtotal, detalle.id_venta]
            );

            await connection.commit();
            return 1;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};

module.exports = DetalleVentaModel;
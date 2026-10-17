const db = require('../config/db');

const VentaModel = {
    obtenerTodos: async () => {
        const [rows] = await db.query(
            `SELECT v.*, c.nombre AS cliente, uv.nombre AS vendedor, uc.nombre AS cajero,
                    s.nombre AS sucursal
             FROM ventas v
             LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
             LEFT JOIN usuarios uv ON v.id_vendedor = uv.id_usuario
             LEFT JOIN usuarios uc ON v.id_cajero = uc.id_usuario
             LEFT JOIN sucursales s ON v.id_sucursal = s.id_sucursal
             ORDER BY v.fecha_hora DESC`
        );
        return rows;
    },

    obtenerPorId: async (id) => {
        const [rows] = await db.query(
            `SELECT v.*, c.nombre AS cliente, uv.nombre AS vendedor, uc.nombre AS cajero,
                    s.nombre AS sucursal
             FROM ventas v
             LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
             LEFT JOIN usuarios uv ON v.id_vendedor = uv.id_usuario
             LEFT JOIN usuarios uc ON v.id_cajero = uc.id_usuario
             LEFT JOIN sucursales s ON v.id_sucursal = s.id_sucursal
             WHERE v.id_venta = ?`,
            [id]
        );

        if (!rows[0]) return undefined;

        const [detalles] = await db.query(
            `SELECT dv.*, p.nombre AS producto
             FROM detalle_ventas dv
             LEFT JOIN productos p ON dv.id_producto = p.id_producto
             WHERE dv.id_venta = ?`,
            [id]
        );

        return { ...rows[0], detalles };
    },

    crear: async ({
        metodo_pago, id_cliente, id_vendedor, id_cajero, id_sucursal, detalles
    }) => {
        if (!Array.isArray(detalles) || detalles.length === 0) {
            throw new Error('La venta requiere al menos un detalle.');
        }

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            let total = 0;
            const detallesCalculados = [];

            for (const item of detalles) {
                const cantidad = Number(item.cantidad);
                const precio = Number(item.precio_unitario);

                if (!Number.isInteger(cantidad) || cantidad <= 0 ||
                    !Number.isFinite(precio) || precio < 0) {
                    throw new Error('Cantidad o precio_unitario inválido.');
                }

                const [productoRows] = await connection.query(
                    'SELECT precio_venta, stock FROM productos WHERE id_producto = ? FOR UPDATE',
                    [item.id_producto]
                );

                if (!productoRows[0]) {
                    throw new Error(`No existe el producto ${item.id_producto}.`);
                }

                if (productoRows[0].stock < cantidad) {
                    throw new Error(`Stock insuficiente para producto ${item.id_producto}.`);
                }

                const subtotal = Number((cantidad * precio).toFixed(2));
                total += subtotal;
                detallesCalculados.push({
                    id_producto: item.id_producto,
                    cantidad,
                    precio_unitario: precio,
                    subtotal
                });
            }

            total = Number(total.toFixed(2));

            const [ventaResult] = await connection.query(
                `INSERT INTO ventas
                 (total, metodo_pago, id_cliente, id_vendedor, id_cajero, id_sucursal)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    total, metodo_pago, id_cliente ?? null, id_vendedor ?? null,
                    id_cajero ?? null, id_sucursal ?? null
                ]
            );

            for (const item of detallesCalculados) {
                await connection.query(
                    `INSERT INTO detalle_ventas
                     (id_venta, id_producto, cantidad, precio_unitario, subtotal)
                     VALUES (?, ?, ?, ?, ?)`,
                    [
                        ventaResult.insertId, item.id_producto, item.cantidad,
                        item.precio_unitario, item.subtotal
                    ]
                );

                await connection.query(
                    'UPDATE productos SET stock = stock - ? WHERE id_producto = ?',
                    [item.cantidad, item.id_producto]
                );
            }

            await connection.commit();
            return { id_venta: ventaResult.insertId, total };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    eliminar: async (id) => {
        const [result] = await db.query(
            'DELETE FROM ventas WHERE id_venta = ?',
            [id]
        );
        return result.affectedRows;
    }
};

module.exports = VentaModel;
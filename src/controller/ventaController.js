const VentaModel = require('../model/ventaModel');

const getVentas = async (req, res) => {
    try {
        const ventas = await VentaModel.obtenerTodos();
        res.json({ ok: true, total: ventas.length, data: ventas });
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al consultar ventas.' });
    }
};

const getVentaById = async (req, res) => {
    try {
        const venta = await VentaModel.obtenerPorId(req.params.id);
        if (!venta) {
            return res.status(404).json({ ok: false, mensaje: 'Venta no encontrada.' });
        }
        res.json({ ok: true, data: venta });
    } catch (error) {
        console.error('Error al obtener venta:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al consultar la venta.' });
    }
};

const createVenta = async (req, res) => {
    try {
        const venta = await VentaModel.crear(req.body);
        res.status(201).json({
            ok: true, mensaje: 'Venta creada.',
            data: venta
        });
    } catch (error) {
        console.error('Error al crear venta:', error);
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

const deleteVenta = async (req, res) => {
    try {
        const affected = await VentaModel.eliminar(req.params.id);
        if (!affected) {
            return res.status(404).json({ ok: false, mensaje: 'Venta no encontrada.' });
        }
        res.json({ ok: true, mensaje: 'Venta eliminada junto con su detalle.' });
    } catch (error) {
        console.error('Error al eliminar venta:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al eliminar la venta.' });
    }
};

module.exports = { getVentas, getVentaById, createVenta, deleteVenta };
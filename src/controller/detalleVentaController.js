const DetalleVentaModel = require('../model/detalleVentaModel');

const getDetallesPorVenta = async (req, res) => {
    try {
        const detalles = await DetalleVentaModel.obtenerPorVenta(req.params.idVenta);
        res.json({ ok: true, total: detalles.length, data: detalles });
    } catch (error) {
        console.error('Error al obtener detalles:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al consultar detalles.' });
    }
};

const createDetalleVenta = async (req, res) => {
    try {
        const detalle = await DetalleVentaModel.crear(req.body);
        res.status(201).json({
            ok: true, mensaje: 'Detalle agregado a la venta.', data: detalle
        });
    } catch (error) {
        console.error('Error al crear detalle:', error);
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

const deleteDetalleVenta = async (req, res) => {
    try {
        const affected = await DetalleVentaModel.eliminar(req.params.id);
        if (!affected) {
            return res.status(404).json({ ok: false, mensaje: 'Detalle no encontrado.' });
        }
        res.json({ ok: true, mensaje: 'Detalle eliminado y stock devuelto.' });
    } catch (error) {
        console.error('Error al eliminar detalle:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al eliminar el detalle.' });
    }
};

module.exports = { getDetallesPorVenta, createDetalleVenta, deleteDetalleVenta };
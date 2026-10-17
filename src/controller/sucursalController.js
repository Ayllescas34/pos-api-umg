const SucursalModel = require('../model/sucursalModel');

const getSucursales = async (req, res) => {
    try {
        const sucursales = await SucursalModel.obtenerTodos(req.query.nombre);
        res.json({ ok: true, total: sucursales.length, data: sucursales });
    } catch (error) {
        console.error('Error al obtener sucursales:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al consultar sucursales.' });
    }
};

const getSucursalById = async (req, res) => {
    try {
        const sucursal = await SucursalModel.obtenerPorId(req.params.id);
        if (!sucursal) {
            return res.status(404).json({ ok: false, mensaje: 'Sucursal no encontrada.' });
        }
        res.json({ ok: true, data: sucursal });
    } catch (error) {
        console.error('Error al obtener sucursal:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al consultar la sucursal.' });
    }
};

const createSucursal = async (req, res) => {
    try {
        const id = await SucursalModel.crear(req.body);
        res.status(201).json({
            ok: true,
            mensaje: 'Sucursal creada.',
            data: { id_sucursal: id, ...req.body }
        });
    } catch (error) {
        console.error('Error al crear sucursal:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al crear la sucursal.' });
    }
};

const updateSucursal = async (req, res) => {
    try {
        const affected = await SucursalModel.actualizar(req.params.id, req.body);
        if (!affected) {
            return res.status(404).json({ ok: false, mensaje: 'Sucursal no encontrada.' });
        }
        res.json({ ok: true, mensaje: 'Sucursal actualizada.' });
    } catch (error) {
        console.error('Error al actualizar sucursal:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al actualizar la sucursal.' });
    }
};

const deleteSucursal = async (req, res) => {
    try {
        const affected = await SucursalModel.eliminar(req.params.id);
        if (!affected) {
            return res.status(404).json({ ok: false, mensaje: 'Sucursal no encontrada.' });
        }
        res.json({ ok: true, mensaje: 'Sucursal eliminada.' });
    } catch (error) {
        console.error('Error al eliminar sucursal:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'No se pudo eliminar. Puede estar relacionada con ventas.'
        });
    }
};

module.exports = {
    getSucursales, getSucursalById, createSucursal, updateSucursal, deleteSucursal
};
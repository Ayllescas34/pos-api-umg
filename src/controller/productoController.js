const ProductoModel = require('../model/productoModel');

const getProductos = async (req, res) => {
    try {
        const productos = await ProductoModel.obtenerTodos(req.query.nombre);
        res.json({ ok: true, total: productos.length, data: productos });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al consultar productos.' });
    }
};

const getProductoById = async (req, res) => {
    try {
        const producto = await ProductoModel.obtenerPorId(req.params.id);
        if (!producto) {
            return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado.' });
        }
        res.json({ ok: true, data: producto });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al consultar el producto.' });
    }
};

const createProducto = async (req, res) => {
    try {
        const id = await ProductoModel.crear(req.body);
        res.status(201).json({
            ok: true, mensaje: 'Producto creado.',
            data: { id_producto: id, ...req.body }
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al crear el producto.' });
    }
};

const updateProducto = async (req, res) => {
    try {
        const affected = await ProductoModel.actualizar(req.params.id, req.body);
        if (!affected) {
            return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado.' });
        }
        res.json({ ok: true, mensaje: 'Producto actualizado.' });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al actualizar el producto.' });
    }
};

const deleteProducto = async (req, res) => {
    try {
        const affected = await ProductoModel.eliminar(req.params.id);
        if (!affected) {
            return res.status(404).json({ ok: false, mensaje: 'Producto no encontrado.' });
        }
        res.json({ ok: true, mensaje: 'Producto eliminado.' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'No se pudo eliminar. Puede estar relacionado con detalle de ventas.'
        });
    }
};

module.exports = {
    getProductos, getProductoById, createProducto, updateProducto, deleteProducto
};
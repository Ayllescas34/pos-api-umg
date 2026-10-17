const CategoriaModel = require('../model/categoriaModel');

const getCategorias = async (req, res) => {
    try {
        const { nombre } = req.query;
        const categorias = await CategoriaModel.obtenerTodos(nombre);

        res.json({
            ok: true,
            total: categorias.length,
            data: categorias
        });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor al consultar categorías.'
        });
    }
};

const getCategoriaById = async (req, res) => {
    try {
        const { id } = req.params;
        const categoria = await CategoriaModel.obtenerPorId(id);

        if (!categoria) {
            return res.status(404).json({
                ok: false,
                mensaje: `Categoría con ID ${id} no encontrada.`
            });
        }

        res.json({ ok: true, data: categoria });
    } catch (error) {
        console.error('Error al obtener categoría:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor al consultar la categoría.'
        });
    }
};

const createCategoria = async (req, res) => {
    try {
        const idGenerado = await CategoriaModel.crear(req.body);

        res.status(201).json({
            ok: true,
            mensaje: 'Categoría creada exitosamente.',
            data: {
                id_categoria: idGenerado,
                ...req.body
            }
        });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor al crear la categoría.'
        });
    }
};

const updateCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const filasAfectadas = await CategoriaModel.actualizar(id, req.body);

        if (filasAfectadas === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: `Categoría con ID ${id} no encontrada.`
            });
        }

        res.json({ ok: true, mensaje: 'Categoría actualizada exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor al actualizar la categoría.'
        });
    }
};

const deleteCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const filasAfectadas = await CategoriaModel.eliminar(id);

        if (filasAfectadas === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: `Categoría con ID ${id} no encontrada.`
            });
        }

        res.json({ ok: true, mensaje: 'Categoría eliminada exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor al eliminar la categoría.'
        });
    }
};

module.exports = {
    getCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria
};
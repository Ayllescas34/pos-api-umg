const ClienteModel = require('../model/clienteModel');

// GET /api/clientes
const getClientes = async (req, res) => {
    try {
        const { nombre } = req.query; // Captura los Query Params de la URL

        const clientes = await ClienteModel.obtenerTodos(nombre);
        res.json({
            ok: true,
            total: clientes.length,
            data: clientes
        });
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor al consultar clientes.'
        });
    }
};

// GET /api/clientes/:id
const getClienteById = async (req, res) => {
    try {
        const { id } = req.params; // Captura el parámetro de la URL
        const cliente = await ClienteModel.obtenerPorId(id);

        if (!cliente) {
            return res.status(404).json({
                ok: false,
                mensaje: `Cliente con ID ${id} no encontrado.`
            });
        }

        res.json({
            ok: true,
            data: cliente
        });
    } catch (error) {
        console.error(`Error al obtener cliente ${req.params.id}:`, error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor al consultar el cliente.'
        });
    }
};

// POST /api/clientes
const createCliente = async (req, res) => {
    try {
        const idGenerado = await ClienteModel.crear(req.body);
        res.status(201).json({
            ok: true,
            mensaje: 'Cliente creado exitosamente.',
            data: {
                id_cliente: idGenerado,
                ...req.body
            }
        });
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor al crear el cliente.'
        });
    }
};

// PUT /api/clientes/:id
const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const filasAfectadas = await ClienteModel.actualizar(id, req.body);

        if (filasAfectadas === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: `Cliente con ID ${id} no encontrado.`
            });
        }

        res.json({
            ok: true,
            mensaje: 'Cliente actualizado exitosamente.'
        });
    } catch (error) {
        console.error(`Error al actualizar cliente ${req.params.id}:`, error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor al actualizar el cliente.'
        });
    }
};

// DELETE /api/clientes/:id
const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const filasAfectadas = await ClienteModel.eliminar(id);

        if (filasAfectadas === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: `Cliente con ID ${id} no encontrado.`
            });
        }

        res.json({
            ok: true,
            mensaje: 'Cliente eliminado exitosamente.'
        });
    } catch (error) {
        console.error(`Error al eliminar cliente ${req.params.id}:`, error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor al eliminar el cliente.'
        });
    }
};

module.exports = {
    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente
};
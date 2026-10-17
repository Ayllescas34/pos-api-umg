const { Router } = require('express');
const { getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente } = require('../controller/clienteController');

const router = Router();

// Endpoint: GET /api/clientes/
router.get('/', getClientes);

// Endpoint: GET /api/clientes/:id
router.get('/:id', getClienteById);

// EndPoint: POST /api/clientes
router.post('/', createCliente);

// Endpoint: PUT api/
router.put('/:id', updateCliente);

// endpoint: DELETE /api/clientes/26
router.delete('/:id', deleteCliente);

module.exports = router;
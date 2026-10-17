const { Router } = require('express');
const {
    getVentas, getVentaById, createVenta, deleteVenta
} = require('../controller/ventaController');

const router = Router();

router.get('/', getVentas);
router.get('/:id', getVentaById);
router.post('/', createVenta);
router.delete('/:id', deleteVenta);

module.exports = router;
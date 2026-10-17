const { Router } = require('express');
const {
    getDetallesPorVenta, createDetalleVenta, deleteDetalleVenta
} = require('../controller/detalleVentaController');

const router = Router();

router.get('/venta/:idVenta', getDetallesPorVenta);
router.post('/', createDetalleVenta);
router.delete('/:id', deleteDetalleVenta);

module.exports = router;
const { Router } = require('express');
const {
    getSucursales, getSucursalById, createSucursal, updateSucursal, deleteSucursal
} = require('../controller/sucursalController');

const router = Router();

router.get('/', getSucursales);
router.get('/:id', getSucursalById);
router.post('/', createSucursal);
router.put('/:id', updateSucursal);
router.delete('/:id', deleteSucursal);

module.exports = router;
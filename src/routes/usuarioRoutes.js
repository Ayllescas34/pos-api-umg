const { Router } = require('express');
const {
    getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario
} = require('../controller/usuarioController');

const router = Router();

router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

module.exports = router;
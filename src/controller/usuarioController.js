const UsuarioModel = require('../model/usuarioModel');

const getUsuarios = async (req, res) => {
    try {
        const usuarios = await UsuarioModel.obtenerTodos(req.query.nombre);
        res.json({ ok: true, total: usuarios.length, data: usuarios });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al consultar usuarios.' });
    }
};

const getUsuarioById = async (req, res) => {
    try {
        const usuario = await UsuarioModel.obtenerPorId(req.params.id);
        if (!usuario) {
            return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });
        }
        res.json({ ok: true, data: usuario });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al consultar el usuario.' });
    }
};

const createUsuario = async (req, res) => {
    try {
        const id = await UsuarioModel.crear(req.body);
        const { password_hash, ...usuarioSeguro } = req.body;
        res.status(201).json({
            ok: true, mensaje: 'Usuario creado.',
            data: { id_usuario: id, ...usuarioSeguro }
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al crear el usuario.' });
    }
};

const updateUsuario = async (req, res) => {
    try {
        const affected = await UsuarioModel.actualizar(req.params.id, req.body);
        if (!affected) {
            return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });
        }
        res.json({ ok: true, mensaje: 'Usuario actualizado.' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ ok: false, mensaje: 'Error al actualizar el usuario.' });
    }
};

const deleteUsuario = async (req, res) => {
    try {
        const affected = await UsuarioModel.eliminar(req.params.id);
        if (!affected) {
            return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado.' });
        }
        res.json({ ok: true, mensaje: 'Usuario eliminado.' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'No se pudo eliminar. Puede estar relacionado con ventas.'
        });
    }
};

module.exports = {
    getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario
};
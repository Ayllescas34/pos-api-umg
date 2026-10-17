const db = require('../config/db');

const ClienteModel = {
    // Obtener todos los clientes
    /*obtenerTodos: async () => {
      const [rows] = await db.query('SELECT * FROM clientes');
      return rows;
    },*/
    obtenerTodos: async (nombre = '') => {
        if (nombre) {
            const parametro = `%${nombre.trim()}%`;
            console.log('SQL:', 'SELECT * FROM clientes WHERE nombre LIKE ?', 'Param:', parametro);

            const [rows] = await db.query(
                'SELECT * FROM clientes WHERE nombre LIKE ?',
                [parametro]
            );
            return rows;
        } else {
            const [rows] = await db.query('SELECT * FROM clientes');
            return rows;
        }
    },

    // Obtener un cliente por su ID
    obtenerPorId: async (id) => {
        const [rows] = await db.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
        return rows[0]; // Retorna el registro o undefined si no existe
    },

    // Crear cliente
    crear: async (datos) => {
        const { nit, nombre, direccion, email, telefono } = datos;
        const [result] = await db.query(
            'INSERT INTO clientes (nit, nombre, direccion, email, telefono) VALUES (?, ?, ?, ?, ?)',
            [nit, nombre, direccion, email, telefono]
        );
        return result.insertId; // Retorna el id_cliente generado por AUTO_INCREMENT
    },

    // Actualizar cliente
    actualizar: async (id, datos) => {
        const { nit, nombre, direccion, email, telefono } = datos;
        const [result] = await db.query(
            'UPDATE clientes SET nit = ?, nombre = ?, direccion = ?, email = ?, telefono = ? WHERE id_cliente = ?',
            [nit, nombre, direccion, email, telefono, id]
        );
        return result.affectedRows; // Retorna 1 si se actualizó, 0 si el ID no existía
    },

    // Eliminar cliente
    eliminar: async (id) => {
        const [result] = await db.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
        return result.affectedRows; // Retorna 1 si se eliminó, 0 si no existía
    }
};

module.exports = ClienteModel;
const http = require('http'); // para protocolos http
const app = require('./src/app'); //usa mi arbolde carpeas/archivos
//const { initSocket } = require('./src/config/socket');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
// Crear servidor HTTP para integrarlo con WebSockets
const server = http.createServer(app);
// Inicializar WebSockets
//initSocket(server);
// Arrancar servidor
server.listen(PORT, () => {
    console.log(`=================================`);
    console.log(` Servidor de proyecto POS ejecutándose en puerto: ${PORT}`);
    console.log(` URL de la API: http://localhost:${PORT}`);
    console.log(`=================================`);
});
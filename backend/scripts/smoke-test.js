const dotenv = require('dotenv');
dotenv.config();
const { initDb, closeDb } = require('../db');
const { Networks, Devices, Connections } = require('../models');

(async () => {
  try {
    await initDb();

    // Crear red temporal
    const { id: netId } = await Networks.createNetwork({ name: 'Prueba Modelo', type: 'wifi', description: 'smoke-test' });
    console.log('Network ID:', netId);

    // Crear dos dispositivos
    const d1 = await Devices.createDevice({ network_id: netId, name: 'AP-A', device_type: 'AP', ip_address: '10.0.0.10' });
    const d2 = await Devices.createDevice({ network_id: netId, name: 'AP-B', device_type: 'AP', ip_address: '10.0.0.11' });
    console.log('Devices:', d1.id, d2.id);

    // Conectar
    const c = await Connections.createConnection({ network_id: netId, from_device_id: d1.id, to_device_id: d2.id, link_type: 'wifi-backhaul' });
    console.log('Connection ID:', c.id);

    // Listar
    const devs = await Devices.listDevicesByNetwork(netId);
    const conns = await Connections.listConnectionsByNetwork(netId);
    console.log('Devs:', devs.length, 'Conns:', conns.length);

    // Limpieza
    await Networks.deleteNetwork(netId);

    console.log('OK');
  } catch (e) {
    console.error('Smoke test error:', e);
  } finally {
    await closeDb();
  }
})();
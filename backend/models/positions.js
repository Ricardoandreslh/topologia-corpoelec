const { withTransaction, query } = require('../db');

async function listPositionsByNetworkView(networkId, view) {
  return await query(
    'SELECT dp.id, dp.device_id, dp.view, dp.x, dp.y, dp.zoom, dp.pan_x, dp.pan_y, dp.updated_at ' +
      'FROM device_positions dp ' +
      'JOIN devices d ON d.id = dp.device_id ' +
      'WHERE d.network_id = ? AND dp.view = ?',
    [networkId, view]
  );
}

async function upsertPositionsBatch(payload) {
  const view = payload.view;
  const positions = payload.positions || [];
  const zoom = typeof payload.zoom === 'number' ? payload.zoom : null;

  var panX = null;
  var panY = null;
  if (payload && payload.pan) {
    if (typeof payload.pan.x === 'number') panX = payload.pan.x;
    if (typeof payload.pan.y === 'number') panY = payload.pan.y;
  }

  await withTransaction(async function (conn) {
    for (let i = 0; i < positions.length; i++) {
      const p = positions[i] || {};
      const deviceId = p.deviceId;
      const x = typeof p.x === 'number' ? p.x : 0;
      const y = typeof p.y === 'number' ? p.y : 0;

      await conn.execute(
        'INSERT INTO device_positions (device_id, view, x, y, zoom, pan_x, pan_y) ' +
          'VALUES (?,?,?,?,?,?,?) ' +
          'ON DUPLICATE KEY UPDATE x=VALUES(x), y=VALUES(y), zoom=VALUES(zoom), pan_x=VALUES(pan_x), pan_y=VALUES(pan_y)',
        [deviceId, view, x, y, zoom, panX, panY]
      );
    }
  });
}

module.exports = { listPositionsByNetworkView, upsertPositionsBatch };
// Aggregator para importar modelos desde un solo lugar
module.exports = {
    Roles: require('./roles'),
    Users: require('./users'),
    Networks: require('./networks'),
    Devices: require('./devices'),
    Connections: require('./connections'),
    Positions: require('./positions'),
    Images: require('./images'),
    ViewBackgrounds: require('./viewBackgrounds'),
    PingLogs: require('./pingLogs')
  };
-- 01_schema.sql
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

USE topologia;

-- Limpieza opcional para iteraciones de desarrollo
DROP TABLE IF EXISTS ping_logs;
DROP TABLE IF EXISTS view_backgrounds;
DROP TABLE IF EXISTS device_positions;
DROP TABLE IF EXISTS connections;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS networks;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

SET FOREIGN_KEY_CHECKS = 1;

-- Roles
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,               -- 'admin', 'normal'
  permissions JSON NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Usuarios
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  status ENUM('active','disabled') NOT NULL DEFAULT 'active',
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Redes
CREATE TABLE networks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  type ENUM('wifi','switch') NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Imágenes (fotos o fondos)
CREATE TABLE images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes BIGINT NOT NULL,
  path VARCHAR(500) NOT NULL,                     -- ruta local o URL pública
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dispositivos
CREATE TABLE devices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  network_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  ip_address VARCHAR(45) NULL,                    -- IPv4/IPv6
  mac_address VARCHAR(50) NULL,
  device_type VARCHAR(50) NOT NULL,               -- 'AP','Switch','Router','Client', etc.
  location VARCHAR(255) NULL,
  image_id INT NULL,                              -- foto del dispositivo
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_devices_network FOREIGN KEY (network_id) REFERENCES networks(id) ON DELETE CASCADE,
  CONSTRAINT fk_devices_image FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE SET NULL,
  INDEX idx_devices_network (network_id),
  INDEX idx_devices_type (device_type),
  INDEX idx_devices_ip (ip_address),
  INDEX idx_devices_mac (mac_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Conexiones entre dispositivos
CREATE TABLE connections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  network_id INT NOT NULL,
  from_device_id INT NOT NULL,
  to_device_id INT NOT NULL,
  link_type VARCHAR(50) NULL,                     -- 'ethernet','wifi-backhaul', etc.
  status VARCHAR(50) NULL,                        -- 'up','down','unknown'
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  -- Normalización para evitar duplicados A->B y B->A
  from_id_norm INT AS (LEAST(from_device_id, to_device_id)) STORED,
  to_id_norm   INT AS (GREATEST(from_device_id, to_device_id)) STORED,

  CONSTRAINT fk_conn_network FOREIGN KEY (network_id) REFERENCES networks(id) ON DELETE CASCADE,
  CONSTRAINT fk_conn_from    FOREIGN KEY (from_device_id) REFERENCES devices(id) ON DELETE CASCADE,
  CONSTRAINT fk_conn_to      FOREIGN KEY (to_device_id)   REFERENCES devices(id) ON DELETE CASCADE,

  UNIQUE KEY uq_conn_pair (network_id, from_id_norm, to_id_norm),
  INDEX idx_conn_network (network_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Posiciones/layout por vista
CREATE TABLE device_positions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_id INT NOT NULL,
  view ENUM('wifi','switch') NOT NULL,
  x DOUBLE NOT NULL,
  y DOUBLE NOT NULL,
  zoom DOUBLE NULL,
  pan_x DOUBLE NULL,
  pan_y DOUBLE NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_device_view (device_id, view),
  CONSTRAINT fk_pos_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Fondo por vista (imagen sobre la cual se dibuja)
CREATE TABLE view_backgrounds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  network_id INT NOT NULL,
  view ENUM('wifi','switch') NOT NULL,
  image_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_bg (network_id, view),
  CONSTRAINT fk_bg_network FOREIGN KEY (network_id) REFERENCES networks(id) ON DELETE CASCADE,
  CONSTRAINT fk_bg_image   FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Logs de ping (opcional)
CREATE TABLE ping_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  device_id INT NOT NULL,
  success TINYINT(1) NOT NULL,
  latency_ms INT NULL,
  ran_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ping_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
  INDEX idx_ping_device_time (device_id, ran_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
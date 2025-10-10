-- 02_seed.sql
USE topologia;

-- Roles
INSERT INTO roles (name) VALUES ('admin'), ('normal')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Redes de ejemplo (una por tipo)
INSERT INTO networks (name, type, description)
VALUES
  ('Red WiFi Principal', 'wifi', 'Cobertura WiFi'),
  ('Backbone de Switches', 'switch', 'Distribución cableada')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Usuario admin (reemplazar <HASH_BCRYPT> por el valor generado)
INSERT INTO users (username, email, password_hash, role_id, status)
VALUES ('admin', 'admin@local', '<$2b$10$oYPqlLKevM9MTn77OfsQf.0z7QFEfERPKZIHsiUJoXl9vX3lROznS>',
        (SELECT id FROM roles WHERE name='admin'), 'active')
ON DUPLICATE KEY UPDATE email = VALUES(email);
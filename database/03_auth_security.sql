USE topologia;

-- Intentos de login (auditoría)
CREATE TABLE IF NOT EXISTS login_attempts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  username VARCHAR(100) NULL,
  ip VARCHAR(64) NULL,
  success TINYINT(1) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_login_attempts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_login_user_time (user_id, created_at),
  INDEX idx_login_username_time (username, created_at),
  INDEX idx_login_ip_time (ip, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bloqueos temporales por usuario
CREATE TABLE IF NOT EXISTS user_locks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  until TIMESTAMP NOT NULL,
  reason VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_locks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_locks_user_until (user_id, until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
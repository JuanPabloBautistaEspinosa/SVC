-- Crear base de datos
CREATE DATABASE IF NOT EXISTS Ra3;
USE Ra3;

-- Tabla de votantes (registra quien voto, sin el voto)
CREATE TABLE IF NOT EXISTS votantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    fecha DATETIME NOT NULL,
    INDEX idx_cedula (cedula)
);

-- Tabla de votos encriptados (para auditoria)
CREATE TABLE IF NOT EXISTS votos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    voto VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de resultados (para conteo rapido)
CREATE TABLE IF NOT EXISTS resultados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidato INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_candidato (candidato)
);
ALTER TABLE votantes ADD COLUMN voto_hash VARCHAR(255);
ALTER TABLE votantes ADD COLUMN voto_anterior VARCHAR(10);
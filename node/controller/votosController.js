const pool = require('../db');
const bcrypt = require('bcrypt');

exports.emitirVoto = async (req, res) => {
    const { cedula, voto } = req.body;
    
    if (!cedula || !voto) {
        return res.status(400).json({ error: 'Cedula y voto son requeridos' });
    }

    try {
        // Verificar si ya voto
        const [rows] = await pool.query('SELECT * FROM votantes WHERE cedula = ?', [cedula]);
        
        if (rows.length > 0) {
            return res.status(400).json({ error: 'Esta cedula ya ha emitido un voto' });
        }

        // Encriptar el voto
        const votoHash = await bcrypt.hash(voto.toString(), 10);

        // Registrar votante
        await pool.query('INSERT INTO votantes (cedula, fecha) VALUES (?, NOW())', [cedula]);

        // Registrar voto encriptado
        await pool.query('INSERT INTO votos (voto) VALUES (?)', [votoHash]);

        // Registrar voto para resultados
        await pool.query('INSERT INTO resultados (candidato) VALUES (?)', [voto]);

        res.json({ message: 'Voto emitido correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.obtenerVotos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, cedula, fecha FROM votantes ORDER BY fecha DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener votantes' });
    }
};

exports.obtenerResultados = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT candidato, COUNT(*) as votos FROM resultados GROUP BY candidato ORDER BY votos DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener resultados' });
    }
};
const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.emitirVoto = async (req, res) => {
    const { cedula, voto } = req.body;
    
    if (!cedula || voto === undefined) {
        return res.status(400).json({ error: 'Cedula y voto son requeridos' });
    }

    try {
        const [rows] = await pool.query('SELECT * FROM votantes WHERE cedula = ?', [cedula]);
        
        if (rows.length > 0) {
            return res.status(409).json({ error: 'Esta cedula ya ha emitido un voto' });
        }

        const votoHash = await bcrypt.hash(voto.toString(), 10);

        await pool.query(
            'INSERT INTO votantes (cedula, voto_hash, fecha) VALUES (?, ?, NOW())',
            [cedula, votoHash]
        );

        await pool.query('INSERT INTO resultados (candidato) VALUES (?)', [voto]);

        res.json({ message: 'Voto emitido correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.actualizarVoto = async (req, res) => {
    const { cedula, voto } = req.body;

    try {
        // Obtener voto anterior
        const [rows] = await pool.query(
            'SELECT voto_anterior FROM votantes WHERE cedula = ?', [cedula]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cedula no encontrada' });
        }

        const votoAnterior = rows[0].voto_anterior;
        const votoHash = await bcrypt.hash(voto.toString(), 10);

        // Actualizar votante
        await pool.query(
            'UPDATE votantes SET voto_hash = ?, voto_anterior = ?, fecha = NOW() WHERE cedula = ?',
            [votoHash, voto, cedula]
        );

        // Restar voto anterior del conteo
        if (votoAnterior !== null) {
            await pool.query(
                'DELETE FROM resultados WHERE candidato = ? LIMIT 1', [votoAnterior]
            );
        }

        // Agregar nuevo voto al conteo
        await pool.query('INSERT INTO resultados (candidato) VALUES (?)', [voto]);

        res.json({ message: 'Voto actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el voto' });
    }
};

exports.obtenerVotos = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, cedula, voto_hash, fecha FROM votantes ORDER BY fecha DESC'
        );
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
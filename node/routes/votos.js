const express = require('express');
const router = express.Router();
const {
    emitirVoto,
    actualizarVoto,
    obtenerVotos,
    obtenerResultados
} = require('../controller/votosController');

router.post('/', emitirVoto);
router.put('/actualizar', actualizarVoto);
router.get('/usuarios', obtenerVotos);
router.get('/resultados', obtenerResultados);

module.exports = router;
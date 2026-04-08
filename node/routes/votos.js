const express = require('express');
const router = express.Router();
const votosController = require('../controller/votosController');

router.post('/', votosController.emitirVoto);
router.get('/usuarios', votosController.obtenerVotos);
router.get('/resultados', votosController.obtenerResultados);

module.exports = router;
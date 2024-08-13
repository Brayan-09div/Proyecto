import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validarJWT.js';
import { validarCampos } from '../middleware/validar-campos.js';
import { controllerApprentice } from '../controllers/apprentice.js'

const router = express.Router();

router.get('/', controllerApprentice.listtheapprentice)


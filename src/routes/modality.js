import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validarJWT.js';
import { validarCampos } from '../middleware/validar-campos.js';
import modalityController from '../controllers/modality.js'
import {modalityHelper} from '../helpers/modality.js'

const router = express.Router();

//-----------------------------------------------------------
router.get('/listallmodality', [

], modalityController.listModalities);


//-----------------------------------------------------------
router.get('/listmodalitybyid/:id', [

], modalityController.getModalityById);


//-----------------------------------------------------------
router.post('/addmodality', [

], modalityController.createModality);


//-----------------------------------------------------------
router.put('/updatemodalitybyid/:id', [

], modalityController.editModality);


//-----------------------------------------------------------
router.put('/togglemodalitystate/:id', [

], modalityController.toggleModalityState);



import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validarJWT.js';
import { validarCampos } from '../middleware/validar-campos.js';
import logController from '../controllers/logs.js'
import {logsHelper} from '../helpers/logs.js'

const router = express.Router();

//------------------------------------------------
router.get('/listlogs',[
    
],logController.listLogs)


//------------------------------------------------
router.get('/listlogs/:id',[

],logController.getLogById)


//------------------------------------------------
router.post('/addlog',[

],logController.createLog)

//------------------------------------------------

router.put('/toggleLogState/:id',[

],logController.toggleLogState)



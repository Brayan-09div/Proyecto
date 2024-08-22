import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validarJWT.js';
import { validarCampos } from '../middleware/validar-campos.js';
import logController from '../controllers/logs.js'
import {logsHelper} from '../helpers/logs.js'

const router = express.Router();

//------------------------------------------------
router.get('/listlogs',[
    validarJWT
],logController.listLogs)


//------------------------------------------------
router.get('/listlogs/:id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(logsHelper.existsLogID),
    validarCampos
],logController.getLogById)


//------------------------------------------------
router.post('/addlog',[
    validarJWT,
    check('users','El users es obligatorio').notEmpaty(),
    check('action','La action es obligatoria').notEmpty(),
    check('information','La information es obligatoria').notEmpaty(),
    check('data','La data es obligatoria').notEmpty(),
    check('hourInstructorProject','Las horas son olbigatorias').notEmpaty(),
],logController.createLog)

//------------------------------------------------

router.put('/enableAndDisablelogsbyid/:id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(logsHelper.existsLogID),
    validarCampos
],logController.enableAndDisablelogsbyid)



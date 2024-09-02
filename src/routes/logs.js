import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validateJWT.js';
import { validarCampos } from '../middleware/validate-fields.js';
import logController from '../controllers/logs.js';
import { logsHelper } from '../helpers/logs.js';

const router = express.Router();

//------------------------------------------------
router.get('/listlogs', [
    validarJWT
], logController.listLogs);

//------------------------------------------------

router.get('/listlogsId/:id', [
    validarJWT,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(logsHelper.existsLogID),
    validarCampos
], logController.getLogById);

//------------------------------------------------
router.post('/addlog', [
    validarJWT,
    check('users', 'El campo users es obligatorio').notEmpty(),
    check('email', 'El campo email es obligatorio').notEmpty().isEmail(), 
    check('email').custom(logsHelper.existEmail), 
    check('action', 'El campo action es obligatorio').notEmpty(),
    check('information', 'El campo information es obligatorio').notEmpty(),
    validarCampos
], logController.createLog);

//------------------------------------------------
router.put('/enableAndDisablelogsbyid/:id', [
    validarJWT,
    check('id', 'El ID no es válido').isMongoId(),
    check('id').custom(logsHelper.existsLogID),
    validarCampos
], logController.toggleLogState);

export default router;
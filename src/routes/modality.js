import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validateJWT.js';
import { validarCampos } from '../middleware/validate-fields.js';
import modalityController from '../controllers/modality.js'
import {modalityHelper} from '../helpers/modality.js'


const router = express.Router();

//-----------------------------------------------------------
router.get('/listallmodality', [
    validarJWT,
], modalityController.listModalities);


//-----------------------------------------------------------
router.get('/listmodalitybyid/:id', [
validarJWT,
check('id', 'El id es invalido').isMongoId(),
check('id').custom(modalityHelper.existsModalityID),
validarCampos
], modalityController.getModalityById);


//-----------------------------------------------------------
router.post('/addmodality', [
  // validarJWT,
  check('name', 'El campo name es obligatorio').notEmpty(),
  check('hourInstructorFollow')
    .optional()
    .isNumeric().withMessage('El campo hourInstructorFollow debe ser numérico'),
  check('hourInstructorTechnical')
    .optional()
    .isNumeric().withMessage('El campo hourInstructorTechnical debe ser numérico'),
  check('hourInstructorProject')
    .optional()
    .isNumeric().withMessage('El campo hourInstructorProject debe ser numérico'),
  validarCampos
], modalityController.createModality)

//-----------------------------------------------------------
router.put('/updatemodalitybyid/:id', [
validarJWT,
check('id', 'El id es invalido').isMongoId(),
check('name', ' El campo name es obligatorio').notEmpty(),
check('hourInstructorFollo','El campo hourInstructorFollow es obligatorio').notEmpty(),
check('hourInstructorTechnical','El campo hourInstructorTechnical es obligatorio').notEmpty(),
check('hourInstructorProject', 'El campo hourInstructorProject es obligatorio').notEmpty(),
validarCampos
], modalityController.editModality);

//-----------------------------------------------------------
router.put('/enablemodality/:id', [
    validarJWT,
    check('id', 'El id es inválido').isMongoId(),
    check('id').custom(modalityHelper.existsModalityID),
    validarCampos
  ], modalityController.enablemodalityStatus);
  
  //-----------------------------------------------------------
  router.put('/disablemodality/:id', [
    validarJWT,
    check('id', 'El id es inválido').isMongoId(),
    check('id').custom(modalityHelper.existsModalityID),
    validarCampos
  ], modalityController.createModality);



export default router;

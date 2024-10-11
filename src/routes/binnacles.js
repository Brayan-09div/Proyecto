import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validateJWT.js';
import { validarCampos } from '../middleware/validate-fields.js';
import controllerBinnacles from '../controllers/binnacles.js';
import {binnaclesHelper} from '../helpers/binnacles.js';
import {assignmentHelper} from '../helpers/assignment.js';
import { instructorHelper } from '../helpers/instructor.js'


const router = express.Router();

router.get('/listallbinnacles',[
    validarJWT,
],controllerBinnacles.listallbinnacles)


router.get('/listbinnaclesbyid/:id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(binnaclesHelper.existBinnacles),
    validarCampos
],controllerBinnacles.listbinnaclesbyid)


router.get('listbinnaclesbyassignment/:idassignment',[
    validarJWT,
    check('assignment', 'El id no es valido').isMongoId(),
    check('assignment').custom(assignmentHelper.existsAssignmentID),
    validarCampos
],controllerBinnacles.listbinnaclesbyassignment)


router.get('listbinnaclesbyinstructor/:idinstructor',[
    validarJWT,
    check('instructor').custom(instructorHelper.existsInstructorID),
    validarCampos
],controllerBinnacles.listbinnaclesbyinstructor)


router.post('/addbinnacles',[
    validarJWT,
    check('assignment','La assignment es obligatoria').notEmpty(),
    check('instructor','El instructor es obigatorio').notEmpty(),
    check('number','El number es obligatorio').notEmpty(),
    check('document','El document es obligatorio').notEmpty(),
    check('observations','El observations es obligatorio').notEmpty(),
    check('users','El users es obligatorio').notEmpty(),
    check('number').custom(binnaclesHelper.existNumber),
    check('number').custom(binnaclesHelper.verifyNumber),
    check('document').custom(binnaclesHelper.existDocument), 
    check('document').custom(binnaclesHelper.verifyDocument),
    check('number','El number es maximo de 10 caracteres').isLength({ max: 10 }),
    check('document','El document es maximo de 50 caracteres').isLength({ max: 50 }),
    check('observations','El observations es de maximo 50 caracteres').isLength({ max: 50 }),
    
    
    validarCampos
],controllerBinnacles.addbinnacles)

router.put('/updatebinnaclebyid/:id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(binnaclesHelper.existBinnacles),
    check('number').custom(binnaclesHelper.existNumber),
    check('document').custom(binnaclesHelper.existDocument),
    check('number','El number es maximo de 10 caracteres').isLength({ max: 10 }),
    check('document','El document es maximo de 50 caracteres').isLength({ max: 50 }),
    check('observations','El observations es de maximo 50 caracteres').isLength({ max: 50 }),
    validarCampos
],controllerBinnacles.updatebinnaclebyid)

router.put('/updatestatus/:id/:status',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(binnaclesHelper.existBinnacles),
    validarCampos
],controllerBinnacles.updatestatus)

export default router;

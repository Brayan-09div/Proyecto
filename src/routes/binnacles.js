import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validateJWT.js';
import { validarCampos } from '../middleware/validate-fields.js';
import controllerBinnacles from '../controllers/binnacles.js';
import {binnaclesHelper} from '../helpers/binnacles.js';
import {assignmentHelper} from '../helpers/assignment.js';
import { instructorHelper } from '../helpers/instructor.js'


const router = express.Router();

router.get('/listarbinnacles',[
    validarJWT,
],controllerBinnacles.listAllBinnacles)


router.get('/listbinnaclesbyid/:id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(binnaclesHelper.existBinnacles),
    validarCampos
],controllerBinnacles.listAssignmentsById)


router.get('listbinnaclesbyassignment/:idassignment',[
    validarJWT,
    check('assignment').custom(assignmentHelper.existsAssignmentID),
    validarCampos
],controllerBinnacles.listAssignmentsById)


router.get('listbinnaclesbyinstructor/:idinstructor',[
    validarJWT,
    check('instructor').custom(),
    validarCampos
],controllerBinnacles.listInstructorsById)


router.post('/addbinnacles',[
    validarJWT,
    check('assignment','La assignment es obligatoria').notEmpty(),
    check('number','El number es maximo de 10 caracteres').isLength({ max: 10 }),
    check('number','El number es obligatorio').notEmpty(),
    check('document','El document es maximo de 50 caracteres').isLength({ max: 50 }),
    check('document','El document es obligatorio').notEmpty(),
    check('observations','El observations es de maximo 50 caracteres').isLength({ max: 50 }),
    check('observations','El observations es obligatorio').notEmpty(),
    check('users','El users es obligatorio').notEmpty(),
    validarCampos
],controllerBinnacles.insertBinnacles)

router.put('/updatebinnaclebyid/:id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(binnaclesHelper.existBinnacles),
    check('number','El number es maximo de 10 caracteres').isLength({ max: 10 }),
    check('document','El document es maximo de 50 caracteres').isLength({ max: 50 }),
    check('observations','El observations es de maximo 50 caracteres').isLength({ max: 50 }),
    validarCampos
],controllerBinnacles.insertBinnacles)

router.put('enableAndDisablebinnacles/id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(binnaclesHelper.existBinnacles),
    validarCampos
],controllerBinnacles.toggleBinnacleStatus)

export default router;

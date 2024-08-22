import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validarJWT.js';
import { validarCampos } from '../middleware/validar-campos.js';
import controllerBinnacles from '../controllers/binnacles.js';
import {binnaclesHelper} from '../helpers/binnacles.js';
import {assignmentHelper} from '../helpers/assignment.js';
import { instructorHelper } from '../helpers/instructor.js'


const router = express.Router();

router.get('/listarbinnacles',[
    validarJWT,
    validarCampos
],controllerBinnacles.listthebinnacles)


router.get('/listbinnaclesbyid:id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(binnaclesHelper.existBinnacles),
    validarCampos
],controllerBinnacles.listthebinnaclesbyid)


router.get('listbinnaclesbyassignment/:idassignment',[
    validarJWT,
    check('assignment').custom(),
    validarCampos
],controllerBinnacles.listthebinnaclesbyassignment)


router.get('listbinnaclesbyinstructor/:idinstructor',[
    validarJWT,
    check('instructor').custom(),
    validarCampos
],controllerBinnacles.listthebinnaclesbyinstructor)


router.post('/addbinnacles',[
    validarJWT,
    check('assignment','La assignment es obligatoria').notEmpaty(),
    check('number','El number es maximo de 10 caracteres').isLength({ max: 10 }),
    check('number','El number es obligatorio').notEmpaty(),
    check('document','El document es maximo de 50 caracteres').isLength({ max: 50 }),
    check('document','El document es obligatorio').notEmpaty(),
    check('observations','El observations es de maximo 50 caracteres').isLength({ max: 50 }),
    check('observations','El observations es obligatorio').notEmpaty(),
    check('users','El users es obligatorio').notEmpaty(),
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
],controllerBinnacles.enablebinnacle)
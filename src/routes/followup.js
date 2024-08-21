import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validarJWT.js';
import { validarCampos } from '../middleware/validar-campos.js';
import controllerFollowup from '../controllers/followup.js'
import {followupHelper} from '../helpers/followup.js'
 
const router = express.Router();


//-------------------------------------------------------------
router.get('/listallfollowup',[
    validarJWT,
], controllerFollowup.listFollowups)



//-------------------------------------------------------------
router.get('/listfollowupbyid/:id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    validarCampos
], controllerFollowup.listFollowupById)



//-------------------------------------------------------------
router.get('/listfollowupbyassignment/:idassigment',[
    validarJWT,
    check('assignment').custom(),
    validarCampos
], controllerFollowup.listFollowupsByAssignment)



//-------------------------------------------------------------
router.get('/listfollowupbyinstructor/:idinstructor',[
    validarJWT,
    check('instructor').custom(),
    validarCampos
], controllerFollowup.listFollowupsByInstructor)



//-------------------------------------------------------------
router.post('/addfollowup',[
    validarJWT,
    check('assignment','La assignment es obligatoria').notEmpaty(),
    check('instructor','El instructor es obligatorio').notEmpaty(),
    check('number','El number es maximo de 10 caracteres').isLength({ max: 10 }),
    check('number','El number es obligatorio').notEmpaty(),
    check('month','El month es obligatorio').notEmpaty(),
    check('document','El document es maximo de 50 caracteres').isLength({ max: 50 }),
    check('document','El document es obligatorio').notEmpaty(),
    check('users','El users es obligatorio').notEmpaty(),
    check('observations','El observations es de maximo 50 caracteres').isLength({ max: 50 }),
    check('observations','El observations es obligatorio').notEmpaty(),
    validarCampos
],controllerFollowup.insertFollowup)



//-------------------------------------------------------------
router.put('/updatefollowupbyid/:id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('number','El number es maximo de 10 caracteres').isLength({ max: 10 }),
    check('document','El document es maximo de 50 caracteres').isLength({ max: 50 }),
    check('observations','El observations es de maximo 50 caracteres').isLength({ max: 50 }),
    validarCampos
],controllerFollowup.updateFollowup)



//-------------------------------------------------------------
router.put('enableAndDisableFollowup/id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    validarCampos
],controllerFollowup.enablefollowup)


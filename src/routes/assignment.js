import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validarJWT.js';
import { validarCampos } from '../middleware/validar-campos.js';
import controllerAssignments from '../controllers/assignment.js'
import {assignmentHelper} from '../helpers/assignment.js'
import { instructorHelper } from '../helpers/instructor.js'
import { registerHelper } from '../helpers/register.js'



const router = express.Router();
//------------------------------------------------------------------------
router.get('/listallassignment',[
    validarJWT
], controllerAssignments.listallassignments)


//------------------------------------------------------------------------
router.get('/listassignmentbyid/:id',[
    validarJWT,
    check('id', 'el id es invalido').isMongoId(),
    check('id').custom(assignmentHelper.existsAssignmentID),
    validarCampos
], controllerAssignments.listtheAssignmentById)


//------------------------------------------------------------------------
router.get('/listassignmentbyregister/:idregister',[
   validarJWT,
    check('register').custom(registerHelper),
   validarCampos
], controllerAssignments.listregisterassignment)


//------------------------------------------------------------------------
router.get('/listassigmentbyfollowupinstructor/:idinstructor',[
    validarJWT,
    
    validarCampos
], controllerAssignments.listfollowupinstructor)


//------------------------------------------------------------------------
router.get('/listassigmentbytechnicalinstructor:idinstructor',[
    validarJWT,

    validarCampos
], controllerAssignments.listtechnicalinstructor)


//------------------------------------------------------------------------
router.get('/listassigmentbyprojectinstructor/:idinstructo',[
    validarJWT,

    validarCampos
], controllerAssignments.listprojectinstructor)

//------------------------------------------------------------------------
router.post('/addassignment',[
    validarJWT,

    validarCampos
],controllerAssignments.addassignment)

//------------------------------------------------------------------------
router.put('/updateassignmentbyid/:id',[
    validarJWT,

    validarCampos
],controllerAssignments.updateassignmentbyid)

//------------------------------------------------------------------------
router.put('enableAndDisableAssignmets/id',[
    validarJWT,

    validarCampos
],controllerAssignments.enableassignment)



 














;
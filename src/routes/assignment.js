import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validateJWT.js';
import { validarCampos } from '../middleware/validate-fields.js';
import controllerAssignments from '../controllers/assignment.js'
import {assignmentHelper} from '../helpers/assignment.js'
import { instructorHelper } from '../helpers/instructor.js'
import { registerHelper } from '../helpers/register.js'
import {followupHelper} from '../helpers/followup.js'


const router = express.Router();
//------------------------------------------------------------------------
router.get('/listallassignment',[
    validarJWT,
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
    check('id', 'el id es invalido').isMongoId(),
    check('register').custom(registerHelper.existResgister),
   validarCampos
], controllerAssignments.listregisterassignment)


//------------------------------------------------------------------------
router.get('/listassigmentbyfollowupinstructor/:idinstructor',[
    validarJWT,
    check('instructor').custom(),
    validarCampos
], controllerAssignments.listfollowupinstructor)


//------------------------------------------------------------------------
router.get('/listassigmentbytechnicalinstructor:idinstructor',[
    validarJWT,

    validarCampos
], controllerAssignments.listtechnicalinstructor)


//------------------------------------------------------------------------
router.get('/listassigmentbyprojectinstructor/:idinstructor',[
    validarJWT,

    validarCampos
], controllerAssignments.listprojectinstructor)

//------------------------------------------------------------------------
router.post('/addassignment',[
    validarJWT,
    check('register').custom(registerHelper.existResgister),
    check(' instructorfollow').custom(),
    check(' instructortechnical').custom(),
    check(' instructorproject').custom(),
    check('certificationdoc','El campo certificationdoc es obligatorio').notEmpty(),
    check('judymentPhoto','El campo judymentPhoto es olbigatorio').notEmpty(),
    check('observation','El campo observation es obligatyorio').notEmpty(),
    validarCampos
],controllerAssignments.addassignment)

//------------------------------------------------------------------------
router.put('/updateassignmentbyid/:id',[
    validarJWT,
    check('register').custom(registerHelper.existResgister),
    check(' instructorfollow').custom(),
    check(' instructortechnical').custom(),
    check(' instructorproject').custom(),
    validarCampos
],controllerAssignments.updateassignmentbyid)

// ----------------------------------------------------------------------
router.put('enableAssignmet/id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(assignmentHelper.existsAssignmentID),
    validarCampos
],controllerAssignments.enableassignmentStatus)

//------------------------------------------------------------------------
router.put('disableAssignmet/id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(assignmentHelper.existsAssignmentID),
    validarCampos
],controllerAssignments.disableAssignmetStatus)

 
export default router;













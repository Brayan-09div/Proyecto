import express from 'express';
import { check } from 'express-validator';
import { validateAdmin } from '../middleware/valitate-admin.js';
import { validarCampos } from '../middleware/validate-fields.js';
import controllerAssignments from '../controllers/assignment.js'
import {assignmentHelper} from '../helpers/assignment.js'
import { instructorHelper } from '../helpers/instructor.js'
import { registerHelper } from '../helpers/register.js'
import {followupHelper} from '../helpers/followup.js'


const router = express.Router();
//------------------------------------------------------------------------
router.get('/listallassignment',[
    validateAdmin,
], controllerAssignments.listallassignment)


//------------------------------------------------------------------------
router.get('/listassignmentbyid/:id',[
    validateAdmin,
    check('id', 'el id es invalido').isMongoId(),
    check('id').custom(assignmentHelper.existsAssignmentID),
    validarCampos
], controllerAssignments.listassignmentbyid)


//------------------------------------------------------------------------
router.get('/listassignmentbyregister/:idregister',[
   validateAdmin,
    check('id', 'el id es invalido').isMongoId(),
    check('register').custom(registerHelper.existResgister),
   validarCampos
], controllerAssignments.listassignmentbyregister)


//------------------------------------------------------------------------
router.get('/listassigmentbyfollowupinstructor/:idinstructor',[
    validateAdmin,
    check('instructor').custom(),
    validarCampos
], controllerAssignments.listassigmentbyfollowupinstructor)


//------------------------------------------------------------------------
router.get('/listassigmentbytechnicalinstructor:idinstructor',[
    validateAdmin,
    validarCampos
], controllerAssignments.listassigmentbytechnicalinstructor)


//------------------------------------------------------------------------
router.get('/listassigmentbyprojectinstructor/:idinstructor',[
    validateAdmin,
    validarCampos
], controllerAssignments.listassigmentbyprojectinstructor)

//------------------------------------------------------------------------
router.post('/addassignment',[
    validateAdmin,
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
    validateAdmin,
    check('register').custom(registerHelper.existResgister),
    check(' instructorfollow').custom(),
    check(' instructortechnical').custom(),
    check(' instructorproject').custom(),
    validarCampos
],controllerAssignments.updateassignmentbyid)

// ----------------------------------------------------------------------
router.put('/enableassignmentbyid/id',[
    validateAdmin,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(assignmentHelper.existsAssignmentID),
    validarCampos
],controllerAssignments.enableassignmentbyid)

//------------------------------------------------------------------------
router.put('/disableassigmentbyid/id',[
    validateAdmin,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(assignmentHelper.existsAssignmentID),
    validarCampos
],controllerAssignments.disableassigmentbyid)

 
export default router;













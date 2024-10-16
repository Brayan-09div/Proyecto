import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validateJWT.js';
import { validarCampos } from '../middleware/validate-fields.js';
import controllerFollowup from '../controllers/followup.js'
import {followupHelper} from '../helpers/followup.js'
import {assignmentHelper } from '../helpers/assignment.js'
import { instructorHelper } from '../helpers/instructor.js'
 
const router = express.Router();


//-------------------------------------------------------------
router.get('/listallfollowup',[
    validarJWT,
], controllerFollowup.listallfollowup
)



//-------------------------------------------------------------
router.get('/listfollowupbyid/:id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(followupHelper.existsFollowupID),
    validarCampos
], controllerFollowup.listfollowupbyid)



//-------------------------------------------------------------
router.get('/listfollowupbyassignment/:idassigment',[
    validarJWT,
    check('assignment').custom(assignmentHelper.existsAssignmentID),
    validarCampos
], controllerFollowup.listfollowupbyassignment)



//-------------------------------------------------------------
router.get('/listfollowupbyinstructor/:idinstructor',[
    validarJWT,
    check('instructor').custom(instructorHelper.existsInstructorID),
    validarCampos
], controllerFollowup.listfollowupbyinstructor)



//-------------------------------------------------------------
router.post('/addfollowup',[
    validarJWT,
    check('assignment','La assignment es obligatoria').notEmpty(),
    check('instructor','El instructor es obligatorio').notEmpty(),
    check('number','El number es maximo de 10 caracteres').isLength({ max: 10 }),
    check('number','El number es obligatorio').notEmpty(),
    check('month','El month es obligatorio').notEmpty(),
    check('document','El document es maximo de 50 caracteres').isLength({ max: 50 }),
    check('document','El document es obligatorio').notEmpty(),
    check('users','El users es obligatorio').notEmpty(),
    check('observations','El observations es de maximo 50 caracteres').isLength({ max: 50 }),
    check('observations','El observations es obligatorio').notEmpty(),
    validarCampos
],controllerFollowup.addfollowup)



//-------------------------------------------------------------
router.put('/updatefollowupbyid/:id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('number','El number es maximo de 10 caracteres').isLength({ max: 10 }),
    check('document','El document es maximo de 50 caracteres').isLength({ max: 50 }),
    check('observations','El observations es de maximo 50 caracteres').isLength({ max: 50 }),
    validarCampos
],controllerFollowup.updatefollowupbyid)

// ----------------------------------------------------------------
router.put('/updatestatus/:id/:status',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(followupHelper.existsFollowupID),
    validarCampos
],controllerFollowup.updatestatus)


export default router;

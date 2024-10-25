import express from 'express';
import { check } from 'express-validator';
import { validateAdmin } from '../middleware/valitate-admin.js';
import { validarCampos } from '../middleware/validate-fields.js';
import controllerAssignments from '../controllers/assignment.js'



const router = express.Router();

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







 
export default router;













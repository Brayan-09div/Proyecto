import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validarJWT.js';
import { validarCampos } from '../middleware/validar-campos.js';
import controllerAssignments from '../controllers/assignment.js'
import {assignmentHelper} from '../helpers/assignment.js'


const router = express.Router();
//------------------------------------------------------------------------
router.get('/listallassignment',[

], controllerAssignments.listallassignments)


//------------------------------------------------------------------------
router.get('/listassignmentbyid/:id',[

], controllerAssignments.listtheAssignmentById)


//------------------------------------------------------------------------
router.get('/listassignmentbyregister/:idregister',[
    
], controllerAssignments.listregisterassignment)


//------------------------------------------------------------------------
router.get('/listassigmentbyfollowupinstructor/:idinstructor',[

], controllerAssignments.listfollowupinstructor)


//------------------------------------------------------------------------
router.get('/listassigmentbytechnicalinstructor:idinstructor',[

], controllerAssignments.listtechnicalinstructor)


//------------------------------------------------------------------------
router.get('/listassigmentbyprojectinstructor/:idinstructo',[

], controllerAssignments.listprojectinstructor)

//------------------------------------------------------------------------
router.post('/addassignment',[

],controllerAssignments.addassignment)

//------------------------------------------------------------------------
router.put('/updateassignmentbyid/:id',[

],controllerAssignments.updateassignmentbyid)

//------------------------------------------------------------------------
router.put('enableAndDisableAssignmets/id',[

],controllerAssignments.enableassignment)



 














;
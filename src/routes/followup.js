import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validarJWT.js';
import { validarCampos } from '../middleware/validar-campos.js';
import followupController from '../controllers/followup.js'
import {followupHelper} from '../helpers/followup.js'
 
const router = express.Router();


//-------------------------------------------------------------
router.get('/listallfollowup',[

], followupController.listFollowups)



//-------------------------------------------------------------
router.get('/listfollowupbyid/:id',[

], followupController.getFollowupById)



//-------------------------------------------------------------
router.get('/listfollowupbyassignment/:idassigment',[

], followupController.listFollowupsByAssignment)



//-------------------------------------------------------------
router.get('/listfollowupbyinstructor/:idinstructor',[
    
], followupController.listFollowupsByInstructor)



//-------------------------------------------------------------
router.post('/addfollowup',[

],followupController.insertFollowup)



//-------------------------------------------------------------
router.put('/updatefollowupbyid/:id',[

], followupController.updateFollowup)



//-------------------------------------------------------------
router.put('/toggleFollowupStatusbyid/:id',[

],followupController.toggleFollowupStatus)



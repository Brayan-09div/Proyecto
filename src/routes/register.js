import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validarJWT.js';
import { validarCampos } from '../middleware/validar-campos.js';
import { Router } from 'express';
import controllerRegister from '../controllers/register.js';
import { ficheHelper, registerHelper } from '../helpers/register.js';
import register from '../models/register.js';

 const router = Router()

// --------------------------------------------------------------------
 router.get('/listregister',[
   validarJWT
 ],controllerRegister.listtheregister )

// --------------------------------------------------------------------
 router.get('/listregisterbyid/:id',[
 validarJWT,
 check('id','El id no es valido').isMongoId(),
 check('id','El campo id es obligatorio').notEmpty(),
 validarCampos
 ], controllerRegister.listtheregisterbyid)

// --------------------------------------------------------------------
 router.get('/lisregisterbyapprentice/:apprentice',[
   validarJWT,
    check('apprentice').custom(ficheHelper),
    validarCampos
 ], controllerRegister.listtheapprenticebyid)

// --------------------------------------------------------------------
 router.get('/listregisterbymodality/:madality',[
   validarJWT,
    check('modality').custom(ficheHelper),
    check('modality','El campo modality es obigatorio').notEmpty(),
    validarCampos
 ],controllerRegister.listthemodalitybyid)

// --------------------------------------------------------------------
 router.get('/listregisterbystartdate',[
   validarJWT,
    check('startDate','El campo StartDate es obigatorio').notEmpty(),
    validarCampos
 ],controllerRegister.listregisterstardatebyid)

// --------------------------------------------------------------------
 router.get('/listregisterbyenddate',[
   validarJWT,
    check('endDate','El campo endDate es obigatorio').notEmpty(),
    validarCampos
 ], controllerRegister.listregisterenddatebyid)

// -------------------------------------------------------------------
 router.post('/addregister',[
   validarJWT,
    check('apprentice').custom(registerHelper),
    check('modality').custom(registerHelper),
    check('startDate','El campo startDate es obligatorio').notEmpty(),
    check('endDate', 'El campo endDate es obligatorio').notEmpty(),
    check('company','El campo company es obligatorio').notEmpty(),
    check('phoneCompany','El campo phoneCompany es obligatorio').notEmpty(),
    check('addresscompany', 'El campo adrrescompany es obligatorio').notEmpty(),
    check('owner', 'El campo owner es obligatorio').notEmpty(),
    check('docalternative', 'El campo docalternative').notEmpty(),
    check('hour','El campo hour es obligatorio').notEmpty(),
    check('adreessCompany').custom(registerHelper.existAddressCompany),
    check('phoneCompany').custom(registerHelper.existPhoneCompany),
    validarCampos
 ], controllerRegister.insertregister)
 
// -------------------------------------------------------------------------
 router.put('/updatemodalitybyid/:id',[
   validarJWT,
    check('apprentice').custom(registerHelper),
    check('modality').custom(registerHelper),
    check('adresscompany').custom(registerHelper.existAddressCompany),
    check('phoneCompany').custom(registerHelper.existPhoneCompany),
    validarCampos,
 ],controllerRegister.updateregisterbyid)

// ---------------------------------------------------------------------------
 router.put('/enableAndDisablebinnacles/:id',[
    validarJWT,
    check('id','El id no es valido').isMongoId(),
    validarCampos
 ],controllerRegister.activateAndDesactiveregister)




 
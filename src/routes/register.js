import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validateJWT.js';
import { validarCampos } from '../middleware/validate-fields.js';
import { Router } from 'express';
import controllerRegister from '../controllers/register.js';
import {registerHelper, } from '../helpers/register.js';
import { modalityHelper } from '../helpers/modality.js'
import { apprenticeHelper } from '../helpers/apprentice.js'

const router = Router()

// --------------------------------------------------------------------
router.get('/listallregister', [
  validarJWT
], controllerRegister.listallregister)

// --------------------------------------------------------------------
router.get('/listregisterbyid/:id', [
  validarJWT,
  check('id', 'El id no es valido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
 validarCampos
], controllerRegister.listregisterbyid)

// --------------------------------------------------------------------
router.get('/listregisterbyapprentice/:idapprentice', [
  validarJWT,
  check('apprentice').custom(apprenticeHelper.existApprentice),
  validarCampos
], controllerRegister.listtheapprenticebyid)

// --------------------------------------------------------------------
router.get('/listregisterbymodality/:idmodality', [
  validarJWT, 
  check('modality').custom(modalityHelper.existsModalityID),
  check('modality', 'El campo modality es obigatorio').notEmpty(),
  validarCampos
], controllerRegister.listregisterbymodality)

// --------------------------------------------------------------------
router.get('/listregisterbystartdate', [
  validarJWT,
  check('startDate', 'El campo StartDate es obigatorio').notEmpty(),
  validarCampos
], controllerRegister.listregisterbystartdate)

// --------------------------------------------------------------------
router.get('/listregisterbyenddate', [
  validarJWT,
  check('endDate', 'El campo endDate es obigatorio').notEmpty(),
  validarCampos
], controllerRegister.listregisterbyenddate)

// -------------------------------------------------------------------
router.post('/addregister', [
  validarJWT,
  check('idApprentice', 'El campo es obligatorio').notEmpty(),
  check('idApprentice').custom(apprenticeHelper.existApprentice),
  check('idModality', 'El campo es obligatorio').notEmpty(),
  check('idModality').custom(modalityHelper.existsModalityID),
  check('startDate', 'El campo startDate es obligatorio').notEmpty(),
  check('endDate', 'El campo endDate es obligatorio').notEmpty(),
  check('company', 'El campo company es obligatorio').notEmpty(),
  check('phoneCompany', 'El campo phoneCompany es obligatorio').notEmpty(),
  check('addressCompany', 'El campo addressCompany es obligatorio').notEmpty(), // Corregido
  check('owner', 'El campo owner es obligatorio').notEmpty(),
  check('docAlternative', 'El campo docAlternative es obligatorio').notEmpty(),
  check('hour', 'El campo hour es obligatorio').notEmpty(),
  check('addressCompany').custom(registerHelper.existAddressCompany),
  check('phoneCompany').custom(registerHelper.existPhoneCompany),
  validarCampos
], controllerRegister.addregister);

// -------------------------------------------------------------------------
router.put('/updateregisterbyid/:id', [
  validarJWT,
  check('apprentice').custom(apprenticeHelper.existApprentice),
  check('modality').custom(modalityHelper.existsModalityID),
  check('adresscompany').custom(registerHelper.existAddressCompany),
  check('phoneCompany').custom(registerHelper.existPhoneCompany),
  validarCampos,
], controllerRegister.updateregisterbyid)

// ----------------------------------------------------------------------------
router.put('/updatemodalityregister/:id',[

], controllerRegister.updatemodalityregister)


// ---------------------------------------------------------------------------
router.put('/enableregister/:id', [
  validarJWT,
  check('id', 'El id no es valido').isMongoId(),
  check('id').custom(registerHelper.existRegister),
  validarCampos
], controllerRegister.enableregister);



// -----------------------------------------------------------------------
router.put('/disableregister/:id', [
  validarJWT,
  check('id', 'El id no es valido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
  validarCampos
], controllerRegister.disableregister);



export default router;

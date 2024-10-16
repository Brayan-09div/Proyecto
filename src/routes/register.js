import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validateJWT.js';
import { validarCampos } from '../middleware/validate-fields.js';
import { Router } from 'express';
import controllerRegister from '../controllers/register.js';
import {registerHelper, } from '../helpers/register.js';
import { modalityHelper } from '../helpers/modality.js'
import { apprenticeHelper } from '../helpers/apprentice.js'
import ficheHelper from '../helpers/fiches.js';

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
router.get('/listregisterbyapprentice/:idApprentice', [
  validarJWT,
  check('idApprentice').custom(apprenticeHelper.existApprentice),
  validarCampos
], controllerRegister.listtheapprenticebyid)


// --------------------------------------------------------------------
router.get('/listregisterbymodality/:idModality', [
  validarJWT, 
  check('idModality').custom(modalityHelper.existsModalityID),
  check('idModality', 'El campo modality es obigatorio').notEmpty(),
  validarCampos
], controllerRegister.listregisterbymodality)

// --------------------------------------------------------------------
router.get('/listregisterbyfiche/:idFiche', [
  validarJWT, 
  check('idFiche').custom(async (idFiche, { req }) => {
    await ficheHelper.validateFicheID(idFiche, req.headers.token);
  }),
  validarCampos
], controllerRegister.listregistersbyfiche)


// --------------------------------------------------------------------
router.get('/listregisterbystartdate/:startDate', [
  validarJWT,
  check('startDate', 'El campo StartDate es obigatorio').notEmpty(),
  validarCampos
], controllerRegister.listregisterbystartdate)

// --------------------------------------------------------------------
router.get('/listregisterbyenddate/:endDate', [
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
  check('company', 'El campo company es obligatorio').notEmpty(),
  check('phoneCompany', 'El campo phoneCompany es obligatorio').notEmpty(),
  check('addressCompany', 'El campo addressCompany es obligatorio').notEmpty(), 
  check('owner', 'El campo owner es obligatorio').notEmpty(),
  check('hour', 'El campo hour es obligatorio').notEmpty(),
  check('addressCompany').custom(registerHelper.existAddressCompany),
  check('phoneCompany').custom(registerHelper.existPhoneCompany),
  validarCampos
], controllerRegister.addRegister);

// -------------------------------------------------------------------------
router.put('/updateregisterbyid/:id', [
  validarJWT,
  check('apprentice').optional().custom(apprenticeHelper.existApprentice),
  check('modality').optional().custom(modalityHelper.existsModalityID),
  check('addressCompany').optional().custom(registerHelper.existAddressCompany),
  check('phoneCompany').optional().custom(registerHelper.existPhoneCompany),
  check('startDate').optional().notEmpty().withMessage('El campo startDate es obligatorio si se proporciona'),
  check('endDate').optional().notEmpty().withMessage('El campo endDate es obligatorio si se proporciona'),
  check('company').optional().notEmpty().withMessage('El campo company es obligatorio si se proporciona'),
  check('owner').optional().notEmpty().withMessage('El campo owner es obligatorio si se proporciona'),
  check('docAlternative').optional().notEmpty().withMessage('El campo docAlternative es obligatorio si se proporciona'),
  check('hour').optional().notEmpty().withMessage('El campo hour es obligatorio si se proporciona'),
  validarCampos,
], controllerRegister.updateRegisterById);

// ----------------------------------------------------------------------------
router.put('/updatemodalityregister/:id', [
  validateRepfora,
  check('idModality', 'No es un ID válido').isMongoId().notEmpty(),
  check('idModality').custom(modalityHelper.existsModalityID),
  check('docAlternative', 'El documento alternativo es obligatorio').notEmpty(),
  check('docAlternative').custom(registerHelper.verifyDocAlternative),
  validarCampos
], controllerRegister.updateRegisterModality);

// ---------------------------------------------------------------------------
router.put('/enableregister/:id', [
  validarJWT,
  check('id', 'El id no es valido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
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

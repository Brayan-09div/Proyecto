import express from 'express';
import { check } from 'express-validator';
import { validateAdmin } from '../middleware/valitate-admin.js';
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
 validateAdmin
], controllerRegister.listallregister)

// --------------------------------------------------------------------
router.get('/listregisterbyid/:id', [
 validateAdmin,
  check('id', 'El id no es valido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
 validarCampos
], controllerRegister.listregisterbyid)

// --------------------------------------------------------------------
router.get('/listregisterbyapprentice/:idApprentice', [
 validateAdmin,
  check('idApprentice').custom(apprenticeHelper.existApprentice),
  validarCampos
], controllerRegister.listtheapprenticebyid)


// --------------------------------------------------------------------
router.get('/listregisterbymodality/:idModality', [
 validateAdmin, 
  check('idModality').custom(modalityHelper.existsModalityID),
  check('idModality', 'El campo modality es obigatorio').notEmpty(),
  validarCampos
], controllerRegister.listregisterbymodality)

// --------------------------------------------------------------------
router.get('/listregisterbyfiche/:idFiche', [
 validateAdmin, 
  check('idFiche').custom(async (idFiche, { req }) => {
    await ficheHelper.validateFicheID(idFiche, req.headers.token);
  }),
  validarCampos
], controllerRegister.listregistersbyfiche)


// --------------------------------------------------------------------
router.get('/listregisterbystartdate/:startDate', [
 validateAdmin,
  check('startDate', 'El campo StartDate es obigatorio').notEmpty(),
  validarCampos
], controllerRegister.listregisterbystartdate)

// --------------------------------------------------------------------
router.get('/listregisterbyenddate/:endDate', [
 validateAdmin,
  check('endDate', 'El campo endDate es obigatorio').notEmpty(),
  validarCampos
], controllerRegister.listregisterbyenddate)

// -------------------------------------------------------------------
router.post('/addregister', [
 validateAdmin,
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
 validateAdmin,
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
 validateAdmin,
  check('idModality', 'No es un ID válido').isMongoId().notEmpty(),
  check('idModality').custom(modalityHelper.existsModalityID),
  check('docAlternative', 'El documento alternativo es obligatorio').notEmpty(),
  check('docAlternative').custom(registerHelper.verifyDocAlternative),
  validarCampos
], controllerRegister.updateRegisterModality);

// ---------------------------------------------------------------------------
router.put('/enableregister/:id', [
 validateAdmin,
  check('id', 'El id no es valido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
  validarCampos
], controllerRegister.enableregister);



// -----------------------------------------------------------------------
router.put('/disableregister/:id', [
 validateAdmin,
  check('id', 'El id no es valido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
  validarCampos
], controllerRegister.disableregister);




// rutas assignments
router.get('/listallassignment', controllerRegister.listAllAssignments);

router.get('/listassigmentbyfollowupinstructor/:idinstructor', controllerRegister.listRegisterByFollowUpInstructor);


export default router;

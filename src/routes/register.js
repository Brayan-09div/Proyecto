import express from 'express';
import { check } from 'express-validator';


import { validateInstructors } from '../middleware/validate-instructor.js';
import { authenticateUser } from '../middleware/validateall.js';

import { validarCampos } from '../middleware/validate-fields.js';
import { Router } from 'express';
import controllerRegister from '../controllers/register.js';
import {registerHelper} from '../helpers/register.js';
import { modalityHelper } from '../helpers/modality.js'
import { apprenticeHelper } from '../helpers/apprentice.js'
import { instructorHelper } from '../helpers/instructor.js';
import  ficheHelper  from '../helpers/fiches.js';


const router = Router()


// --------------------------------------------------------------------
router.get('/listallregister', [
 authenticateUser
], controllerRegister.listallregister)

// --------------------------------------------------------------------
router.get('/listregisterbyid/:id', [
 authenticateUser,
  check('id', 'El id no es valido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
 validarCampos
], controllerRegister.listregisterbyid)

// --------------------------------------------------------------------
router.get('/listregisterbyapprentice/:idApprentice', [
 authenticateUser,
  check('idApprentice').custom(apprenticeHelper.existApprentice),
  validarCampos
], controllerRegister.listtheapprenticebyid)


// --------------------------------------------------------------------
router.get('/listregisterbymodality/:idModality', [
 authenticateUser, 
  check('idModality').custom(modalityHelper.existsModalityID),
  check('idModality', 'El campo modality es obigatorio').notEmpty(),
  validarCampos
], controllerRegister.listregisterbymodality)

// --------------------------------------------------------------------
router.get('/listregisterbyfiche/:idFiche', [
 authenticateUser, 
  check('idFiche').custom(async (idFiche, { req }) => {
    await ficheHelper.validateFicheID(idFiche, req.headers.token);
  }),
  validarCampos
], controllerRegister.listregistersbyfiche)


// --------------------------------------------------------------------
router.get('/listregisterbystartdate/:startDate', [
 authenticateUser,
  check('startDate', 'El campo StartDate es obigatorio').notEmpty(),
  validarCampos
], controllerRegister.listregisterbystartdate)

// --------------------------------------------------------------------
router.get('/listregisterbyenddate/:endDate', [
 authenticateUser,
  check('endDate', 'El campo endDate es obigatorio').notEmpty(),
  validarCampos
], controllerRegister.listregisterbyenddate)

router.post('/addregister', [
  authenticateUser,
  check('idApprentice', 'El campo es obligatorio').notEmpty(),
  check('idApprentice').custom(apprenticeHelper.existApprentice),
  check('idModality', 'El campo es obligatorio').notEmpty(),
  check('idModality').custom(modalityHelper.existsModalityID),
  check('startDate', 'El campo startDate es obligatorio').notEmpty(),
  check('company', 'El campo company es obligatorio').notEmpty(),
  check('phoneCompany', 'El campo phoneCompany es obligatorio').notEmpty(),
  check('addressCompany', 'El campo addressCompany es obligatorio').notEmpty(),
  check('owner', 'El campo owner es obligatorio').notEmpty(),
  check('assignment').optional(),
  check('assignment.followUpInstructor.idInstructor')
    .optional({ nullable: true })
    .custom(async (idInstructor, { req }) => {
      if (idInstructor) {
        await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
      }
    }),
  check('assignment.technicalInstructor.idInstructor')
    .optional({ nullable: true })
    .custom(async (idInstructor, { req }) => {
      if (idInstructor) {
        await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
      }
    }),
  check('assignment.projectInstructor.idInstructor')
    .optional({ nullable: true })
    .custom(async (idInstructor, { req }) => {
      if (idInstructor) {
        await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
      }
    }),

  check('addressCompany').custom(registerHelper.existAddressCompany),
  validarCampos
], controllerRegister.addRegister);




router.put('/updateregisterbyid/:id', [
  authenticateUser,
  check('id', 'El id no es válido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
  check('apprentice').optional().custom(apprenticeHelper.existApprentice), 
  check('modality').optional().custom(modalityHelper.existsModalityID), 
  check('addressCompany').optional(), 
  check('phoneCompany').optional(), 
  check('startDate').optional().notEmpty().withMessage('El campo startDate es obligatorio si se proporciona'), 
  check('endDate').optional().notEmpty().withMessage('El campo endDate es obligatorio si se proporciona'),
  check('company').optional().notEmpty().withMessage('El campo company es obligatorio si se proporciona'), 
  check('owner').optional().notEmpty().withMessage('El campo owner es obligatorio si se proporciona'),
  check('docAlternative').optional().notEmpty().withMessage('El campo docAlternative es obligatorio si se proporciona'),
  check('hour').optional().isNumeric().withMessage('El campo hour debe ser un número válido si se proporciona'), 
  check('businessProyectHour').optional().isNumeric().withMessage('El campo businessProyectHour debe ser un número válido si se proporciona'), 
  check('productiveProjectHour').optional().isNumeric().withMessage('El campo productiveProjectHour debe ser un número válido si se proporciona'), 
  check('mailCompany').optional().isEmail().withMessage('El campo mailCompany debe ser un email válido si se proporciona'), 
  validarCampos, 
], controllerRegister.updateRegisterById);



// ----------------------------------------------------------------------------
router.put('/updatemodalityregister/:id', [
 authenticateUser,
 check('id', 'El id no es valido').isMongoId(),
 check('id').custom(registerHelper.existResgister),
  check('idModality', 'No es un ID válido').isMongoId().notEmpty(),
  check('idModality').custom(modalityHelper.existsModalityID),
  check('docAlternative', 'El documento alternativo es obligatorio').notEmpty(),
  check('docAlternative').custom(registerHelper.verifyDocAlternative),
  validarCampos
], controllerRegister.updateRegisterModality);

// ---------------------------------------------------------------------------
router.put('/enableregister/:id', [
 authenticateUser,
  check('id', 'El id no es valido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
  validarCampos
], controllerRegister.enableregister);

// -----------------------------------------------------------------------
router.put('/disableregister/:id', [
 authenticateUser,
  check('id', 'El id no es valido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
  validarCampos
], controllerRegister.disableregister);




// rutas assignments

router.get('/listallassignment', [
  authenticateUser
],controllerRegister.listAllAssignments);

//------------------------------------------------------------------
router.get('/listassigmentbyfollowupinstructor/:idinstructor',[
  authenticateUser
], controllerRegister.listRegisterByFollowUpInstructor);


//----------------------------------------------------------------------
router.get('/listassigmentbytechnicalinstructor/:idinstructor',[
  authenticateUser
], controllerRegister.listRegisterByTechnicalInstructor);

//------------------------------------------------------------------------
router.get('/listassigmentbyprojectinstructor/:idinstructor',[
  authenticateUser
], controllerRegister.listRegisterByProjectInstructor);

//------------------------------------------------------------------------
router.get('/listRegisterByInstructorInAssignment/:idinstructor',[
  authenticateUser
], controllerRegister.listRegisterByInstructorInAssignment);

//------------------------------------------------------------------------
router.get('/listRegisterByAssignmentId/:id',[
  authenticateUser
], controllerRegister.listRegisterByAssignmentId);




router.put('/addassignment/:id', [
  authenticateUser,  
  check('id', 'El id no es válido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
  check('assignment', 'El campo assignment es obligatorio').isArray().notEmpty(),
  

  check('assignment.*.followUpInstructor', 'El campo followUpInstructor es obligatorio').optional().isArray().notEmpty(),
  check('assignment.*.followUpInstructor.*.idInstructor', 'ID de instructor de seguimiento es obligatorio').optional().custom(async (idInstructor, { req }) => {
    await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
  }),

  check('assignment.*.technicalInstructor').optional().isArray(),
  check('assignment.*.technicalInstructor.*.idInstructor').optional().custom(async (idInstructor, { req }) => {
    await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
  }),

  check('assignment.*.projectInstructor').optional().isArray(),
  check('assignment.*.projectInstructor.*.idInstructor').optional().custom(async (idInstructor, { req }) => {
    await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
  }),

  validarCampos  
], controllerRegister.addAssignment);

//----------------------------------------------------------------
router.put('/updateassignment/:id', [
  authenticateUser,
  check('id', 'El id no es válido').isMongoId(),
  check('id').custom(registerHelper.existResgister),
  check('assignment', 'El campo assignment es obligatorio').notEmpty(),
  check('assignment.followUpInstructor.idInstructor')
    .optional()
    .custom(async (idInstructor, { req }) => {
      if (idInstructor) {
        await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
      }
    }),
  check('assignment.technicalInstructor.idInstructor')
    .optional()
    .custom(async (idInstructor, { req }) => {
      if (idInstructor) {
        await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
      }
    }),
  check('assignment.projectInstructor.idInstructor')
    .optional()
    .custom(async (idInstructor, { req }) => {
      if (idInstructor) {
        await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
      }
    }),
  validarCampos
], controllerRegister.updateAssignment);

export default router;

import express from 'express';
import { check } from 'express-validator';

import { validateAdmin } from '../middleware/valitate-admin.js';
import { validateInstructors } from '../middleware/validate-instructor.js';
import { validateApprentice } from '../middleware/validate-apprentice.js';
import { authenticateUser } from '../middleware/validateall.js';

import { validarCampos } from '../middleware/validate-fields.js';
import controllerApprentice from '../controllers/apprentice.js';
import  ficheHelper  from '../helpers/fiches.js';
import { apprenticeHelper } from '../helpers/apprentice.js';
import {modalityHelper} from '../helpers/modality.js'

const router = express.Router();

//---------------------------------------------------------
router.post('/loguinApprentice', [
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email').custom(apprenticeHelper.notExistEmail),
    check('numDocument', 'El documento es obligatorio').not().isEmpty(),
    check('numDocument').custom(apprenticeHelper.notExistNumDocument),
    validarCampos,
], controllerApprentice.loginApprentice);

//-------------------------------------------------------------
router.get('/listallapprentice', [
    validateAdmin,
], controllerApprentice.listallapprentice);


router.get('/listallapprenticeByInstructors', [
    validateInstructors,
], controllerApprentice.listallapprentice);


router.get('/listallapprenticeByApprentice', [
    validateApprentice,
], controllerApprentice.listallapprentice);


router.get('/listallapprenticeBy', [
    authenticateUser,
], controllerApprentice.listallapprentice);
//-------------------------------------------------------------



//-------------------------------------------------------------
router.get('/listapprenticebyid/:id', [
    validateAdmin,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(apprenticeHelper.existApprentice),
    validarCampos
], controllerApprentice.listapprenticebyid);

//-------------------------------------------------------------
router.get('/listapprenticebyfiche/:idfiche', [
    validateAdmin,
    check('fiche', 'El ID de la ficha es obligatorio').notEmpty(),
    check('fiche').custom(async (fiche, { req }) => {
        await ficheHelper.validateFicheID(fiche, req.headers.token);
    }),
    validarCampos,
], controllerApprentice.listapprenticebyfiche);

//-------------------------------------------------------------
router.get('/listapprenticebystatus/:status', [
    validateAdmin,
    validarCampos
], controllerApprentice.listapprenticebystatus);

//-------------------------------------------------------------
router.post('/addapprentice', [
    validateAdmin,
    check('fiche', 'El campo ficha es obligatorio').notEmpty(),
    check('fiche.idFiche', 'El ID no es valido').isMongoId(),
    check('fiche.idFiche').custom(async (idFiche, { req }) => {
        await ficheHelper.validateFicheID(idFiche, req.headers.token);
    }),
    check('fiche.number', 'El codigo de la ficha es obligatorio').notEmpty(),
    check('fiche.name', 'El nombre de la ficha es obligatorio').notEmpty(),
    check('tpDocument', 'el documento es obligatorio').not().isEmpty(),
    check('numDocument', 'el documento es obligatorio').not().isEmpty(),
    check('numDocument').custom(apprenticeHelper.existNumDocument), 
    check('firstName', 'el nombre es obligatorio').not().isEmpty(),
    check('lastName', 'el apellido es obligatorio').not().isEmpty(),
    check('phone', 'el telefono es obligatorio').not().isEmpty(),
    check('email', 'el email es obligatorio').not().isEmpty(),
    check('email').custom(apprenticeHelper.esEmailValido),
    check ('modality').custom(modalityHelper.existsModalityID),
    validarCampos
], controllerApprentice.addapprentice);



//-------------------------------------------------------------
router.put('/updateapprenticebyid/:id', [
    validateAdmin,
    check('id', 'El id no es válido').isMongoId(),
    check('fiche.idFiche', 'El ID de la ficha no es válido').optional().isMongoId(),
    check('fiche.idFiche').optional().custom(async (idFiche, { req }) => {
        await ficheHelper.validateFicheID(idFiche, req.headers.token);
    }),
    check('fiche.number', 'El código de la ficha es obligatorio').optional().notEmpty(),
    check('fiche.name', 'El nombre de la ficha es obligatorio').optional().notEmpty(),
    check('tpDocument', 'El tipo de documento es obligatorio').optional().notEmpty(),
    check('numDocument', 'El número de documento es obligatorio').optional().notEmpty(),
    check('numDocument').optional().custom(apprenticeHelper.esNumDocumentoValido),
    check('firstName', 'El nombre es obligatorio').optional().notEmpty(),
    check('lastName', 'El apellido es obligatorio').optional().notEmpty(),
    check('phone', 'El teléfono es obligatorio').optional().notEmpty(),
    check('email', 'El email es obligatorio').optional().isEmail(),
    check('email').optional().custom(apprenticeHelper.esEmailValido),
    check('modality').optional().custom(modalityHelper.existsModalityID),
    validarCampos
], controllerApprentice.updateapprenticebyid);


// -----------------------------------------------------------
router.put('/enableapprentice/:id', [
    validateAdmin,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(apprenticeHelper.existApprentice),
    validarCampos
], controllerApprentice.enableapprentice);

//-------------------------------------------------------------
router.put('/disableapprentice/:id', [
    validateAdmin,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(apprenticeHelper.existApprentice),
    validarCampos
], controllerApprentice.disableapprentice);

export default router;
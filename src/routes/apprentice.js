import express from 'express';
import { check } from 'express-validator';

import { validateAdmin } from '../middleware/valitate-admin.js';
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

//-------------------------------------------------------------rs
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
    check('idModality').custom(modalityHelper.existsModalityID),
    validarCampos
], controllerApprentice.listapprenticebystatus);


//-------------------------------------------------------------
router.get('/listapprenticebymodality/:idModality', [
    validateAdmin,

    validarCampos
], controllerApprentice.listapprenticebystatus);



//-------------------------------------------------------------
router.post('/addapprentice', [
    validateAdmin,
    check('fiche', 'El campo ficha es obligatorio').notEmpty(),
    check('fiche.idFiche', 'El ID no es válido').isMongoId(),
    check('fiche.idFiche').custom(async (idFiche, { req }) => {
        await ficheHelper.validateFicheID(idFiche, req.headers.token);
    }),
    check('fiche.number', 'El código de la ficha es obligatorio').notEmpty(),
    check('fiche.name', 'El nombre de la ficha es obligatorio').notEmpty(),
    check('idModality', 'la idModality es obligatorio').notEmpty(),
    check('idModality').custom(modalityHelper.existsModalityID),
    check('tpDocument', 'El tipo de documento es obligatorio').notEmpty(),
    check('numDocument', 'El número de documento es obligatorio').notEmpty(),
    check('numDocument').custom(apprenticeHelper.existNumDocument), 
    check('firstName', 'El nombre es obligatorio').notEmpty(),
    check('lastName', 'El apellido es obligatorio').notEmpty(),
    check('phone', 'El teléfono es obligatorio').notEmpty(),
    check('email', 'El email es obligatorio').notEmpty(),
    check('email').custom(apprenticeHelper.esEmailValido),
    validarCampos
], controllerApprentice.addapprentice);




//-------------------------------------------------------------
router.put('/updateapprenticebyid/:id', [
    validateAdmin,
    check('id', 'El ID no es válido').isMongoId(),
    check('fiche.idFiche', 'El ID de la ficha no es válido').optional().isMongoId(),
    check('fiche.idFiche').optional().custom(async (idFiche, { req }) => {
        await ficheHelper.validateFicheID(idFiche, req.headers.token);
    }),
    check('fiche.number', 'El código de la ficha es obligatorio').optional().notEmpty(),
    check('fiche.name', 'El nombre de la ficha es obligatorio').optional().notEmpty(),
    check('idModality').optional().custom(modalityHelper.existsModalityID),
    check('tpDocument', 'El tipo de documento es obligatorio').optional().notEmpty(),
    check('numDocument', 'El número de documento es obligatorio').optional().notEmpty(),
    check('numDocument').optional().custom(apprenticeHelper.esNumDocumentoValido),
    check('firstName', 'El nombre es obligatorio').optional().notEmpty(),
    check('lastName', 'El apellido es obligatorio').optional().notEmpty(),
    check('phone', 'El teléfono es obligatorio').optional().notEmpty(),
    check('email', 'El email es obligatorio').optional().isEmail(),
    check('email').optional().custom(apprenticeHelper.esEmailValido),
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
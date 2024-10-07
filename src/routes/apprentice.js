import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validateJWT.js';
import { validarCampos } from '../middleware/validate-fields.js';
import controllerApprentice from '../controllers/apprentice.js';
import  ficheHelper  from '../helpers/fiches.js';
import { apprenticeHelper } from '../helpers/apprentice.js';

const router = express.Router();

//-------------------------------------------------------------
router.get('/listapprentice', [
    // validarJWT,
], controllerApprentice.listtheapprentice);

//-------------------------------------------------------------
router.get('/listapprenticebyid/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(apprenticeHelper.existApprentice),
    validarCampos
], controllerApprentice.listtheapprenticebyid);

//-------------------------------------------------------------
router.get('/listapprenticebyfiche/:fiche', [
    validarJWT,
    // check('fiche', 'El ID de la ficha es obligatorio').notEmpty(),
    // check('fiche').custom(async (fiche, { req }) => {
    //     await ficheHelper.validateFicheID(fiche, req.headers.token);
    // }),
    validarCampos,
], controllerApprentice.listtheapprenticebyficheid);

//-------------------------------------------------------------
router.get('/listapprenticebystatus/:status', [
    validarJWT,
    validarCampos
], controllerApprentice.listApprenticeByStatus);

//-------------------------------------------------------------
router.post('/addapprentice', [
    validarJWT,
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
    validarCampos
], controllerApprentice.inserttheapprentice);



//-------------------------------------------------------------
router.put('/updateapprenticebyid/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(apprenticeHelper.existApprentice),
    // check('fiche').custom(ficheHelper.verifyFiche),
    check('firname', 'El campo firname es maximo de 50 caracteres').isLength({ max: 50 }),
    check('lasname', 'El campo lasname es de maximo de 50 caracteres').isLength({ max: 50 }),
    check('phone', 'El campo phone es de maximo 10 caracteres').isLength({ max: 10 }),
    validarCampos,
], controllerApprentice.updateapprenticebyid);

// -----------------------------------------------------------
router.put('/enableApprentice/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(apprenticeHelper.existApprentice),
    validarCampos
], controllerApprentice.enableapprenticeStatus);

//-------------------------------------------------------------
router.put('/disableApprentice/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(apprenticeHelper.existApprentice),
    validarCampos
], controllerApprentice.disableapprenticeStatus);

export default router;
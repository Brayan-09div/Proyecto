import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validateJWT.js';
import { validarCampos } from '../middleware/validate-fields.js';
import controllerApprentice from '../controllers/apprentice.js';
import { ficheHelper } from '../helpers/fiches.js';
import { apprenticeHelper } from '../helpers/apprentice.js';

const router = express.Router();

//-------------------------------------------------------------
router.get('/listapprentice', [
    validarJWT,
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
    // validarJWT,
    check('fiche').custom(ficheHelper.existsFicheID),
    check('fiche', 'El campo fiche es obligatorio').notEmpty(),
    validarCampos,
], controllerApprentice.listtheapprenticebyficheid);

//-------------------------------------------------------------
router.get('/listapprenticebystatus/:status', [
    validarJWT,
    validarCampos
], controllerApprentice.listApprenticeByStatus);

//-------------------------------------------------------------
router.post('/addapprentice', [
    // verificar JWT si es necesario
    check('fiche', 'El campo fiche es obligatorio').notEmpty(),
    check('fiche').custom(ficheHelper.existsFicheID),
    check('tpDocument', 'El campo tpDocument es obligatorio').notEmpty(),
    check('numdocument', 'El campo numdocument es obligatorio').notEmpty(),
    check('numdocument').custom(apprenticeHelper.existNumDocument),
    check('firname', 'El campo firname es obligatorio').notEmpty(),
    check('lasname', 'El campo lasname es obligatorio').notEmpty(),
    check('phone', 'El campo phone es obligatorio').notEmpty(),
    check('email', 'El campo email es obligatorio').notEmpty(),
    check('email').custom(apprenticeHelper.existEmail),
    check('firname', 'El campo firname es maximo de 50 caracteres').isLength({ max: 50 }),
    check('lasname', 'El campo lasname es de maximo de 50 caracteres').isLength({ max: 50 }),
    check('phone', 'El campo phone es de maximo 10 caracteres').isLength({ max: 10 }),
    validarCampos,
], controllerApprentice.inserttheapprentice);


//-------------------------------------------------------------
router.put('/updateapprenticebyid/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(apprenticeHelper.existApprentice),
    check('fiche').custom(ficheHelper.verifyFiche),
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
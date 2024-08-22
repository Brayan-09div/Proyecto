import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validarJWT.js';
import { validarCampos } from '../middleware/validar-campos.js';
import controllerApprentice from '../controllers/apprentice.js';
import { registerHelper } from '../helpers/register.js';
import {fichesHelper} from '../helpers/fiches.js'

const router = express.Router();

//-------------------------------------------------------------
router.get('/listapprentice', [
    validarJWT,
    validarCampos
], controllerApprentice.listtheapprentice)

//-------------------------------------------------------------
router.get('/listapprenticebyid/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(apprenticeHelper.existApprentice),
    validarCampos
], controllerApprentice.listtheapprenticebyid)

//-------------------------------------------------------------
router.get('/listapprenticebyfiche/:fiche', [
    validarJWT,
    check('fiche').custom(fichesHelper.existsFicheID),
    check('fiche', 'El campo fiche es obligaorio').notEmpaty(),
    validarCampos,
], controllerApprentice.listtheapprenticebyficheid)

//-------------------------------------------------------------
router.get('/listapprenticebystatus/:status', [
    validarJWT,
    validarCampos
], controllerApprentice.listApprenticeByStatus)

//-------------------------------------------------------------
router.post('/addapprentice', [
    validarJWT,
    check('fiche').custom(fichesHelper.existsFicheID),
    check('tpDocument', 'El campo tpdocument es obligatorio').notEmpaty(),
    check('numdocument', 'El campo numdocument es obligatorio').notEmpaty(),
    check('firname', 'El campo firname es obligatorio').notEmpaty(),
    check('lasname', 'El campo lastname es obligatorio').notEmpaty(),
    check('phone', 'El campo phone es obligatorio').notEmpaty(),
    check('email', 'El campo email es obligatorio').notEmpaty(),
    check('numdocument').custom(registerHelper.exisNu),
    check('email').custom(),
    check('firname', 'El campo firname es maximo de 50 caracteres').isLength({ max: 50 }),
    check('lasname', 'El campo lasname es de maximo de 50 caracteres').isLength({ max: 50 }),
    check('phone', 'El campo phone es de maximo 10 caracteres').isLength({ max: 10 }),
    validarCampos,
], controllerApprentice.inserttheapprentice)

//-------------------------------------------------------------
router.put('/updateapprenticebyid/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(apprenticeHelper.existApprentice),
    check('fiche').custom(fichesHelper.existsFicheID),
    check('firname', 'El campo firname es maximo de 50 caracteres').isLength({ max: 50 }),
    check('lasname', 'El campo lasname es de maximo de 50 caracteres').isLength({ max: 50 }),
    check('phone', 'El campo phone es de maximo 10 caracteres').isLength({ max: 10 }),
    validarCampos,
], controllerApprentice.updateapprenticebyid)

//-------------------------------------------------------------
router.put('/enableAndDisablebinnacles/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(apprenticeHelper.existApprentice),
    validarCampos
], controllerApprentice.activateAndDesactiveapprentice)
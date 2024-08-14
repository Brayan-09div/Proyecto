import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validarJWT.js';
import { validarCampos } from '../middleware/validar-campos.js';
import controllerApprentice from '../controllers/apprentice.js';


const router = express.Router();

router.get('/listapprentice',[
    validarCampos,
    validarJWT
],controllerApprentice.listtheapprentice)

router.get('/listapprenticebyid/:id',[
check('id','El id no es valido').isMongoId(),
validarCampos,
validarJWT
],controllerApprentice.listtheapprenticebyid)

router.get('/listapprenticebyfiche/:fiche',[
check('fiche').custom(),
check('fiche','El campo fiche es obligaorio').notEmpaty(),
validarCampos,
validarJWT
],controllerApprentice.listtheapprenticebyfiche)

router.get('/listapprenticebystatus/:status',[
validarCampos,
validarJWT
],controllerApprentice.listApprenticeByStatus)

router.post('/addapprentice',[
check('tpdocument','El campo tpdocument es obligatorio').notEmpaty(),
check('numdocument','El campo numdocument es obligatorio').notEmpaty(),
check('firname','El campo firname es obligatorio').notEmpaty(),
check('lasname','El campo lastname es obligatorio').notEmpaty(),
check('phone','El campo phone es obligatorio').notEmpaty(),
check('email','El campo email es obligatorio').notEmpaty(),
check('numdocument').custom(),
check('email').custom(),
check('firname','El campo firname es maximo de 50 caracteres').isLength({ max: 50 }),
check('lasname','El campo lasname es de maximo de 50 caracteres').isLength({max:50}),
check('phone','El campo phone es de maximo 10 caracteres').isLength({max:10}),
validarCampos,
validarJWT
],controllerApprentice.inserttheapprentice)

router.put('/updateapprenticebyid/:id',[
    check('id','El id no es valido').isMongoId(),
    check('firname','El campo firname es maximo de 50 caracteres').isLength({ max: 50 }),
    check('lasname','El campo lasname es de maximo de 50 caracteres').isLength({max:50}),
    check('phone','El campo phone es de maximo 10 caracteres').isLength({max:10}),
    validarCampos,
    validarJWT
],controllerApprentice.updateapprenticebyid)

router.put('/activateanddeactivatebyapprentice/:id',[
check('id','El id no es valido').isMongoId(),
validarCampos,
validarJWT
],controllerApprentice.activateAndDesactiveapprentice)
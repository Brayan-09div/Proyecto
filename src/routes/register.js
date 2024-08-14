import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validarJWT.js';
import { validarCampos } from '../middleware/validar-campos.js';
import { Router } from 'express';
import controllerRegister from '../controllers/register.js';

 const router = Router()

 router.get('/listregister',[
validarCampos,
validarJWT
 ],controllerRegister.listtheregister )

 router.get('/listregisterbyid/:id',[
 check('id','El id no es valido').isMongoId(),
 check('id','El campo id es obligatorio').notEmpty(),
 validarCampos,
 validarJWT
 ], controllerRegister.listtheregisterbyid)

 router.get('/lisregisterbyapprentice/:apprentice',[
    check('apprentice').custom(),
    check('apprentice','El campo apprentice es obigatorio')
 ], controllerRegister.listtheapprenticebyid)

 router.get('/listregisterbyfiche/:fiche',[
    check('fiche').custom(),
    check('fiche','El campo fiche es obigatorio')
 ], controllerRegister.listhefichebyid)

 router.get('/listregisterbymodality/:madality',[
    check('modality').custom(),
    check('modality','El campo modality es obigatorio')
 ],controllerRegister.listthemodalitybyid)


 router.get('/listregisterbystartdate',[
    check('startDate','El campo StartDate es obigatorio')
 ],controllerRegister.listregisterstardatebyid)

 router.get('/listregisterbyenddate',[
    check('endDate','El campo endDate es obigatorio')
 ], controllerRegister.listregisterenddatebyid)

 router.post('/addregister',[
    check('apprentice').custom(),
    check('modality').custom(),
    check('startDate','El campo startDate es obligatorio').notEmpty(),
    check('endDate', 'El campo endDate es obligatorio').notEmpty(),
    check('company','El campo company es obligatorio').notEmpty(),
    check('phoneCompany','El campo phoneCompany es obligatorio').notEmpty(),
    check('addresscompany', 'El campo adrrescompany es obligatorio').notEmpty(),
    check('owner', 'El campo owner es obligatorio').notEmpty(),
    check('docalternative', 'El campo docalternative').notEmpty(),
    check('hour','El campo hour es obligatorio').notEmpty(),
    check('adreesscompany').custom(),
    validarCampos,
    validarJWT
 ], controllerRegister.insertregister)

 router.put('/updatemodalitybyid/:id',[
    check('apprentice').custom(),
    check('modality').custom(),
    check('adresscompany').custom(),
    validarCampos,
    validarJWT
 ],controllerRegister.updateregisterbyid)

 router.put('/activateanddeactivateregisterbyid/:id',[
    validarCampos,
    validarCampos
 ],controllerRegister.activateAndDesactiveregister)




 
import express from 'express';
import { check } from 'express-validator';
import { validateAdmin } from '../middleware/valitate-admin.js';
import { validarCampos } from '../middleware/validate-fields.js';
import controllerBinnacles from '../controllers/binnacles.js';
import {binnaclesHelper} from '../helpers/binnacles.js';
import {registerHelper} from '../helpers/register.js';
import { instructorHelper } from '../helpers/instructor.js'


const router = express.Router();

router.get('/listallbinnacles',[
   validateAdmin,
],controllerBinnacles.listallbinnacles)


router.get('/listbinnaclesbyid/:id',[
   validateAdmin,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(binnaclesHelper.existBinnacles),
    validarCampos
],controllerBinnacles.listbinnaclesbyid)

router.get('listbinnaclesbyinstructor/:idinstructor',[
   validateAdmin,
    check('instructor').custom(instructorHelper.existsInstructorID),
    validarCampos
],controllerBinnacles.listbinnaclesbyinstructor)


router.post('/addbinnacles', [
   check('register').custom(registerHelper.existResgister),
   check('instructor', 'El instructor es obligatorio').notEmpty(),
   check('instructor.idinstructor', 'El id no es válido').isMongoId(),
   check('idinstructor').custom(async (idInstructor, { req }) => {
     if (idInstructor) {
       await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
     }
   }),
   check('number', 'El number es obligatorio').notEmpty(),
   check('document', 'El document es obligatorio').notEmpty(),
   check('number').custom(binnaclesHelper.existNumber),
   check('document').custom(binnaclesHelper.existDocument),
   validarCampos
], controllerBinnacles.addbinnacles);


router.put('/updatebinnaclebyid/:id',[
   validateAdmin,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(binnaclesHelper.existBinnacles),
    check('number').custom(binnaclesHelper.existNumber),
    check('document').custom(binnaclesHelper.existDocument),
    check('number','El number es maximo de 10 caracteres').isLength({ max: 10 }),
    check('document','El document es maximo de 50 caracteres').isLength({ max: 50 }),
    check('observations','El observations es de maximo 50 caracteres').isLength({ max: 50 }),
    validarCampos
],controllerBinnacles.updatebinnaclebyid)

router.put('/updatestatus/:id/:status',[
   validateAdmin,
    check('id','El id no es valido').isMongoId(),
    check('id').custom(binnaclesHelper.existBinnacles),
    validarCampos
],controllerBinnacles.updatestatus)


router.put('/updateCheckProjectInstructor/:id', [
   validateAdmin,
   check('id', 'El id no es válido').isMongoId(),
   check('id').custom(binnaclesHelper.existBinnacles),
   validarCampos
],controllerBinnacles.updateCheckProjectInstructor);


router.put('/updateCheckTechnicalInstructor/:id', [
   validateAdmin,
   check('id', 'El id no es válido').isMongoId(),
   check('id').custom(binnaclesHelper.existBinnacles),
   validarCampos
],controllerBinnacles.updateCheckTechnicalInstructor);


router.put('/validateHoursTechnical/:id', [
   validateAdmin,
   check('id', 'El id no es válido').isMongoId(),
   check('id').custom(binnaclesHelper.existBinnacles),
   validarCampos
],controllerBinnacles.validateHoursTechnical);

router.put('/validateHoursProject/:id', [
   validateAdmin,
   check('id', 'El id no es válido').isMongoId(),
   check('id').custom(binnaclesHelper.existBinnacles),
   validarCampos
],controllerBinnacles.validateHoursProject);

export default router;

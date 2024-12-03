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

router.get('/listBinnaclesByRegister/:register',[
   validateAdmin,
   check('register', "no es valido").isMongoId(),
   check('register').custom(registerHelper.existResgister),
    validarCampos
],controllerBinnacles.listBinnaclesByRegister)




router.get('/listbinnaclesbyinstructor/:idinstructor', [
   validateAdmin,
   check('idinstructor').custom(async (idinstructor, { req }) => {
      await instructorHelper.existsInstructorsID(idinstructor, req.headers.token);
    }),
   validarCampos
], controllerBinnacles.listbinnaclesbyinstructor)


router.get('/listbinnaclesbyinstructoremail/:email', [
   validateAdmin,
   check('email').isEmail().withMessage('Debe ser un correo electrónico válido'),
   validarCampos 
 ], controllerBinnacles.listBinnaclesByInstructorEmail);
 



 router.post('/addbinnacles', [
   check('register', 'El registro es obligatorio y debe ser un ID válido').isMongoId(),
   check('instructor', 'El instructor es obligatorio').notEmpty(),
   check('instructor.idinstructor', 'El id no es válido').isMongoId(),
   check('idinstructor').custom(async (idInstructor, { req }) => {
     if (idInstructor) {
       await instructorHelper.existsInstructorsID(idInstructor, req.headers.token);
     }
   }),
   check('number', 'El número es obligatorio').isInt({ min: 1 }),
   check('document', 'El documento es obligatorio').notEmpty(),
   validarCampos
 ], controllerBinnacles.addbinnacles);
 


 router.put('/updatebinnaclebyid/:id', [
   validateAdmin, 
   check('id', 'El id no es válido').isMongoId(), 
   check('number').optional().isNumeric(), 
   check('document').optional().isLength({ max: 50 }), 
   validarCampos 
], controllerBinnacles.updatebinnaclebyid);



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



router.put('/addobservation/:id', [
   validateAdmin,
   check('id', 'El id de la bitácora no es válido').isMongoId(),
   check('observation', 'La observación es obligatoria').not().isEmpty(), 
   validarCampos, 
], controllerBinnacles.addObservation);


router.get('/getobservations/:id', [
   check('id', 'El id de la bitácora no es válido').isMongoId(), 
   validarCampos, 
], controllerBinnacles.getObservations); 


export default router;

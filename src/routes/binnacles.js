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




router.post('/addbinnacles', [
   check('register', 'El registro es obligatorio').isMongoId(),
   check('instructor.idinstructor', 'El id del instructor es obligatorio y debe ser un ID válido').isMongoId(),
   check('number', 'El número es obligatorio y debe estar entre 1 y 12').isIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
   check('document', 'El documento es obligatorio').notEmpty(),
   validarCampos
 ], (req, res) => {
     // Reestructurar el campo `idinstructor` al subdocumento `instructor` si llega al nivel raíz
     if (req.body.idinstructor) {
         req.body.instructor = {
             idinstructor: req.body.idinstructor,
             name: req.body.name || '' // Si no envían el nombre del instructor, dejarlo vacío
         };
         delete req.body.idinstructor;
         delete req.body.name;
     }
 
     controllerBinnacles.addbinnacles(req, res);
 });
 


router.put('/updatebinnaclebyid/:id', [
   validateAdmin,
   check('id', 'El id no es válido').isMongoId(), 
   check('id').custom(binnaclesHelper.existBinnacles), 
   check('number').optional().isNumeric(), 
   check('number').optional().custom(async (number, { req }) => {
       if (number) {
           await binnaclesHelper.existNumber(number, req.params.id);
       }
   }),
   check('document').optional().isLength({ max: 50 }),
   check('document').optional().custom(async (document, { req }) => {
       if (document) {
           await binnaclesHelper.existDocument(document, req.params.id);
       }
   }),
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

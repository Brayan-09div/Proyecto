import express from 'express';
import authController from '../controllers/repfora.js'; 

const router = express.Router();


router.post('/login', authController.login);


router.get('/instructors', authController.listAllInstructors);

// router.get('/fiches', authController.); 


// router.post('/validar', authController.validar); 

export default router;

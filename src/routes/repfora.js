// routes.js
import express from 'express';
import { authController } from '../controllers/repfora.js';

const router = express.Router();

router.post('/login', authController.login); 
router.get('/instructors', authController.getInstructors); 
router.get('/fiches', authController.getFiches); 
router.get('/instructors/:id', authController.getInstructorById);
router.get('/fiches/:id', authController.getFichesById)

export default router;

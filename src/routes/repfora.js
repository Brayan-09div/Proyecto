import express from 'express';
import { authController } from '../controllers/repfora.js';
import AuthService from '../servis/AuthService.js';

const router = express.Router();

// // Middleware para verificar el token
// const verifyToken = async (req, res, next) => {
//   const token = req.headers['authorization'];
//   if (!token) {
//     return res.status(403).json({ message: 'No token provided' });
//   }
//   try {
//     await AuthService.verifyToken(token);
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
// };

router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const token = await AuthService.login(email, password, role);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

router.get('/instructors',  authController.getInstructors);
router.get('/fiches',  authController.getFiches);
router.get('/instructors/:id',  authController.getInstructorById);
router.get('/fiches/:id',  authController.getFichesById);

export default router;
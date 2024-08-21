import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validateJWT.js';
import { validarCampos } from '../middleware/validar-campos.js';
import userController from '../controllers/user.js';
import { userHelper } from '../helpers/Users.js';

const router = express.Router();

// Create a new user (only admins)
router.post('/', [
    validarJWT,
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('email').custom(userHelper.emailExists),
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
    validarCampos
], userController.createUser);

// Login (accessible to everyone)
router.post('/login', [
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
    validarCampos
], userController.login);

// List all users (accessible to everyone)
router.get('/list', userController.listUsers);

// Edit a user by their ID (users can edit only their own information, admins can edit any user)
router.put('/edit/:id', [
    validarJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    validarCampos
], userController.editUser);

// Change a user's password by their ID (users can change only their own password, admins can change any password)
router.put('/changePassword/:id', [
    validarJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
    validarCampos
], userController.changePassword);

// Activate or deactivate a user by their ID (only admins)
router.put('/toggleStatus/:id', [
    validarJWT,
    check('id', 'Invalid ID').isMongoId(),
    validarCampos
], userController.toggleUserStatus);

// Delete a user by their ID (only admins)
router.delete('/delete/:id', [
    validarJWT,
    check('id', 'Invalid ID').isMongoId(),
    validarCampos
], userController.deleteUser);

export default router;

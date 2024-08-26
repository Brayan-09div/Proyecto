import express from 'express';
import { check } from 'express-validator';
import { validarJWT } from '../middleware/validateJWT.js';
import { validarCampos } from '../middleware/validate-fields.js';
import userController from '../controllers/userEP.js';
import { userHelper } from '../helpers/userEP.js';

const router = express.Router();


router.post('/', [
    validarJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('name', 'Name cannot be longer than 60 characters').isLength({ max: 60 }),
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('email').custom(userHelper.emailExists),
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
    validarCampos
], userController.createUser);


router.post('/login', [
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
    validarCampos
], userController.login);

router.get('/list', [
    validarJWT
],userController.listUsers);

router.get('/listid/:id', [
    validarJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(userHelper.userExistsByID),
    validarCampos
], userController.listUserByID);


router.put('/edit/:id', [
    validarJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(userHelper.userExistsByID),
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    validarCampos
], userController.editUser);

router.put('/changePassword/:id', [
    validarJWT,
    check('id', 'Invalid ID').isMongoId(),
    check('oldpassword', 'Current password is required').not().isEmpty(),
    check('oldpassword', 'Password must be at least 8 characters long').isLength({ min: 8 }),
    check('password', 'New password must be at least 8 characters long').isLength({ min: 8 }),
    validarCampos
], userController.changePassword);

router.put('/toggleStatus/:id', [
    validarJWT,
    check('id', 'Invalid ID').isMongoId(),
    validarCampos
], userController.toggleUserStatus);


router.delete('/delete/:id', [
    validarJWT,
    check('id', 'Invalid ID').isMongoId(),
    validarCampos
], userController.deleteUser);

export default router;

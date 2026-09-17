import { Router} from 'express';
import { changePassword, createUser, getUserById, updateUserProfile } from '../controller/user-controller.js';
import authenticateToken from '../../../middlewares/authentication.js';

const router = Router();

router.post('/register', createUser);
router.patch('/users/me', authenticateToken, updateUserProfile);
router.put('/users/me/password', authenticateToken, changePassword);
router.get('/users', authenticateToken, getUserById);

export default router;

import { Router} from 'express';
import { createUser, getUserById, updateUserProfile } from '../controller/user-controller.js';
import authenticateToken from '../../../middlewares/authentication.js';

const router = Router();

router.post('/register', createUser);
router.patch('/users/me', authenticateToken, updateUserProfile);
router.get('/users', authenticateToken, getUserById);

export default router;

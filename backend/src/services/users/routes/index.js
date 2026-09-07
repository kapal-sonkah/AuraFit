import { Router} from 'express';
import { createUser, getUserById } from '../controller/user-controller.js';
import authenticateToken from '../../../middlewares/authentication.js';

const router = Router();

router.post('/register', createUser);
router.get('/users', authenticateToken, getUserById);

export default router;
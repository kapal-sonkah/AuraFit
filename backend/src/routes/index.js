import { Router } from 'express';
import users from '../services/users/routes/index.js';
import authentications from '../services/authentication/routes/index.js';
import progress from '../services/progress/route.js';
import recommendations from '../services/recommendations/route.js';
import maintenance from '../services/maintenance/route.js';

const router = Router();

router.use('/', users);
router.use('/', authentications);
router.use('/', progress);
router.use('/', recommendations);
router.use('/', maintenance);

export default router;

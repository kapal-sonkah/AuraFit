import { Router } from 'express';
import authenticateCron from '../../middlewares/cron-authentication.js';
import { backfillPasswordHashes } from './maintenance-controller.js';

const router = Router();

router.get('/cron/password-hash-backfill', authenticateCron, backfillPasswordHashes);

export default router;

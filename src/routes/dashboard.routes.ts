import { Router } from 'express';
import { getSummary, getTrends, getCategories, getRecentTransactions } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

// All roles can access summary and recent
router.get('/summary', getSummary);
router.get('/recent', getRecentTransactions);

// Only ANALYST and ADMIN can access detailed analytics
router.get('/trends', requireRole('ANALYST'), getTrends);
router.get('/categories', requireRole('ANALYST'), getCategories);

export default router;

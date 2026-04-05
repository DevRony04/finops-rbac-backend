import { Router } from 'express';
import { getSummary, getTrends, getCategories, getRecentTransactions } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authenticate);

// All roles can access summary and recent
/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get financial summary
 *     description: Get high-level financial totals (accessible to all roles)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Financial summary data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardSummary'
 */
router.get('/summary', getSummary);

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Get recent transactions
 *     description: Get 5 most recent financial records
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recent transactions
 */
router.get('/recent', getRecentTransactions);

// Only ANALYST and ADMIN can access detailed analytics
/**
 * @swagger
 * /api/dashboard/trends:
 *   get:
 *     summary: Get monthly trends
 *     description: Get monthly income/expense trends (Analyst/Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly trend data
 *       403:
 *         description: Forbidden - Analyst or Admin access required
 */
router.get('/trends', requireRole('ANALYST'), getTrends);

/**
 * @swagger
 * /api/dashboard/categories:
 *   get:
 *     summary: Get spending by category
 *     description: Get breakdown of expenses by category (Analyst/Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category breakdown data
 *       403:
 *         description: Forbidden - Analyst or Admin access required
 */
router.get('/categories', requireRole('ANALYST'), getCategories);

export default router;

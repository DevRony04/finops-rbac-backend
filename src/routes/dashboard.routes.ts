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
 *     summary: Retrieve aggregate financial summary
 *     description: |
 *       Returns high-level financial metrics including total income, expenses, and net balance.
 *       - **Access Level**: `VIEWER`, `ANALYST`, `ADMIN`
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved financial summary.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardSummary'
 *       401:
 *         description: Unauthorized.
 */
router.get('/summary', getSummary);

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Fetch latest transactions
 *     description: |
 *       Returns the 5 most recent financial records for a quick overview.
 *       - **Access Level**: `VIEWER`, `ANALYST`, `ADMIN`
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of 5 most recent transactions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean', example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FinancialRecord'
 */
router.get('/recent', getRecentTransactions);

/**
 * @swagger
 * /api/dashboard/trends:
 *   get:
 *     summary: Analyze monthly financial trends
 *     description: |
 *       Returns month-over-month income and expense comparisons.
 *       - **Access Level**: `ANALYST`, `ADMIN`
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly trend analysis data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean', example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TrendData'
 *       403:
 *         description: Forbidden - Analyst or Admin access required.
 */
router.get('/trends', requireRole('ANALYST'), getTrends);

/**
 * @swagger
 * /api/dashboard/categories:
 *   get:
 *     summary: Breakdown spending by category
 *     description: |
 *       Provides a percentage-based breakdown of expenses grouped by category.
 *       - **Access Level**: `ANALYST`, `ADMIN`
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category spending distribution.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean', example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CategoryData'
 *       403:
 *         description: Forbidden - Analyst or Admin access required.
 */
router.get('/categories', requireRole('ANALYST'), getCategories);

export default router;

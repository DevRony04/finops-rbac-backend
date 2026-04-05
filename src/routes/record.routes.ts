import { Router } from 'express';
import { createRecord, getRecords, getRecordById, updateRecord, deleteRecord } from '../controllers/record.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createRecordSchema, updateRecordSchema, getRecordsSchema } from '../validators/record.validator';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get all financial records
 *     description: Retrieve financial records (filtered by user role)
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of financial records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FinancialRecord'
 */
router.get('/', validate(getRecordsSchema), getRecords);

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     summary: Get a single financial record
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Financial record details
 *       404:
 *         description: Record not found
 */
router.get('/:id', getRecordById);

// Admin only routes for mutating records
/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create new financial record
 *     description: Create a new financial record (Admin only)
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRecordRequest'
 *     responses:
 *       201:
 *         description: Record created successfully
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post('/', requireRole('ADMIN'), validate(createRecordSchema), createRecord);

/**
 * @swagger
 * /api/records/{id}:
 *   patch:
 *     summary: Update financial record
 *     description: Update an existing financial record (Admin only)
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRecordRequest'
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       403:
 *         description: Forbidden - Admin access required
 */
router.patch('/:id', requireRole('ADMIN'), validate(updateRecordSchema), updateRecord);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Delete financial record
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete('/:id', requireRole('ADMIN'), deleteRecord);

export default router;

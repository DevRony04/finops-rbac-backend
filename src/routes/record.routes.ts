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
 *     summary: List all financial records
 *     description: |
 *       Retrieves a paginated list of financial records.
 *       - **Access Level**: `VIEWER`, `ANALYST`, `ADMIN`
 *       - **Filtering**: Supports filtering by type (INCOME/EXPENSE) and category.
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         description: Filter records by transaction type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *       - in: query
 *         name: category
 *         description: Filter records by specific category (e.g., Salary, Rent)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A successful list of financial records.
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
 *       401:
 *         description: Unauthorized - Invalid or missing Bearer token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', validate(getRecordsSchema), getRecords);

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     summary: Retrieve a specific financial record
 *     description: |
 *       Fetches the details of a single financial record by its unique identifier.
 *       - **Access Level**: `VIEWER`, `ANALYST`, `ADMIN`
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique UUID of the financial record
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Detailed information about the requested record.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean', example: true }
 *                 data:
 *                   $ref: '#/components/schemas/FinancialRecord'
 *       404:
 *         description: Record not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getRecordById);

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a new financial record
 *     description: |
 *       Adds a new transaction to the system.
 *       - **Access Level**: `ADMIN` only.
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Details of the financial record to be created.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRecordRequest'
 *     responses:
 *       201:
 *         description: Record successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean', example: true }
 *                 data:
 *                   $ref: '#/components/schemas/FinancialRecord'
 *       400:
 *         description: Validation failed or missing required fields.
 *       403:
 *         description: Forbidden - Requires ADMIN privileges.
 */
router.post('/', requireRole('ADMIN'), validate(createRecordSchema), createRecord);

/**
 * @swagger
 * /api/records/{id}:
 *   patch:
 *     summary: Update an existing financial record
 *     description: |
 *       Modifies specific fields of an existing financial record.
 *       - **Access Level**: `ADMIN` only.
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the record to update
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       description: Partial record data to update.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRecordRequest'
 *     responses:
 *       200:
 *         description: Record updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean', example: true }
 *                 data:
 *                   $ref: '#/components/schemas/FinancialRecord'
 *       403:
 *         description: Forbidden - Requires ADMIN privileges.
 *       404:
 *         description: Record not found.
 */
router.patch('/:id', requireRole('ADMIN'), validate(updateRecordSchema), updateRecord);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Permanently delete a financial record
 *     description: |
 *       Removes a financial record from the database. This action is irreversible.
 *       - **Access Level**: `ADMIN` only.
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the record to delete
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Record deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean', example: true }
 *                 message: { type: 'string', example: 'Record deleted successfully' }
 *       403:
 *         description: Forbidden - Requires ADMIN privileges.
 *       404:
 *         description: Record not found.
 */
router.delete('/:id', requireRole('ADMIN'), deleteRecord);

export default router;

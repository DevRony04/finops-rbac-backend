import { Router } from 'express';
import { createRecord, getRecords, getRecordById, updateRecord, deleteRecord } from '../controllers/record.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createRecordSchema, updateRecordSchema, getRecordsSchema } from '../validators/record.validator';

const router = Router();

router.use(authenticate);

router.get('/', validate(getRecordsSchema), getRecords);
router.get('/:id', getRecordById);

// Admin only routes for mutating records
router.post('/', requireRole('ADMIN'), validate(createRecordSchema), createRecord);
router.patch('/:id', requireRole('ADMIN'), validate(updateRecordSchema), updateRecord);
router.delete('/:id', requireRole('ADMIN'), deleteRecord);

export default router;

import { Router } from 'express';
import { ServiceRecordController } from '../controllers/serviceRecordController';

const router = Router();
const controller = new ServiceRecordController();

// Service Record Routes
router.post('/mint', controller.mintServiceRecord.bind(controller));
router.get('/:tokenId', controller.getServiceRecord.bind(controller));
router.post('/:tokenId/verify', controller.verifyServiceRecord.bind(controller));

export default router; 
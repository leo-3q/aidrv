import { Router } from 'express';
import { PointsController } from '../controllers/pointsController';

const router = Router();
const controller = new PointsController();

// Points System Routes
router.get('/balance/:address', controller.getPointsBalance.bind(controller));
router.post('/transfer', controller.transferPoints.bind(controller));
router.get('/multiplier/:serviceType', controller.getServiceTypeMultiplier.bind(controller));
router.post('/multiplier', controller.setServiceTypeMultiplier.bind(controller));

export default router; 
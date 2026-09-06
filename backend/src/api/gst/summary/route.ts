import { Router } from 'express';
import { handleGSTSummary } from '../../services/gst.service';

const router = Router();

router.get('/summary', handleGSTSummary);

export default router;

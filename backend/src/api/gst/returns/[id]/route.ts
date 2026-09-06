import { Router } from 'express';
import { handleGetGSTReturn } from '../../../services/gst.service';

const router = Router();

router.get('/', handleGetGSTReturn);

export default router;

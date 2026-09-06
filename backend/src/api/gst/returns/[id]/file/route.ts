import { Router } from 'express';
import { handleFileGSTReturn } from '../../../services/gst.service';

const router = Router();

router.post('/file', handleFileGSTReturn);

export default router;

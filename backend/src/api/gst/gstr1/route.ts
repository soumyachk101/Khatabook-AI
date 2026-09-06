import { Router } from 'express';
import { handleGenerateGSTR1 } from '../../services/gst.service';

const router = Router();

router.post('/', handleGenerateGSTR1);

export default router;

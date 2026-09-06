import { Router } from 'express';
import { handleGenerateGSTR3B } from '../../services/gst.service';

const router = Router();

router.post('/', handleGenerateGSTR3B);

export default router;

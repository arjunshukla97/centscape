import { Router } from 'express';
import { previewHandler } from '../controllers/preview.controller';

const router = Router();

router.post('/', previewHandler);

export default router;

import { Router } from 'express';
import { analyzeDocument, getFindings } from '../controllers/analysis.controller';

const router = Router();

router.post('/', analyzeDocument);
router.get('/:messageId/findings', getFindings);

export const analysisRoutes = router;
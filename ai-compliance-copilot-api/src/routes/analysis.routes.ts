import { Router } from 'express';
import { analyzeText, getFindings } from '../controllers/analysis.controller';

const router = Router();

router.post('/', analyzeText);
router.get('/:messageId/findings', getFindings);

export const analysisRoutes = router;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analysisRoutes = void 0;
const express_1 = require("express");
const analysis_controller_1 = require("../controllers/analysis.controller");
const router = (0, express_1.Router)();
router.post('/', analysis_controller_1.analyzeDocument);
router.get('/:messageId/findings', analysis_controller_1.getFindings);
exports.analysisRoutes = router;

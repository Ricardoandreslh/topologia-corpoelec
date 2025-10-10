import express from 'express';
const router = express.Router();

router.get('/ping', (_req, res) => res.json({ implemented: false }));

export default router;
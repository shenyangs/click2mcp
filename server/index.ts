import express from 'express';
const app = express(); app.use(express.json({limit:'512kb'}));
app.get('/api/health', (_req,res) => res.json({ ok: true, project: 'click2mcp' }));
app.listen(5208, '127.0.0.1', () => console.log('[click2mcp] api ready on 5208'));

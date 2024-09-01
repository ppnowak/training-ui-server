import { Router, Request, Response } from 'express';
import { getPages, renderLayout } from '../commons';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    renderLayout(req, res, 'indexPage', { pages: getPages() });
});

export default router;

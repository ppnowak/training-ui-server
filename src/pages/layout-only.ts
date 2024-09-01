import { Router, Request, Response } from 'express';
import { renderLayout } from '../commons';

export const createLayoutOnlyRouter = (layoutName: string) => {
    const router = Router();
    router.get('/', (req: Request, res: Response) => {
        renderLayout(req, res, layoutName, {});
    });
    return router;
}
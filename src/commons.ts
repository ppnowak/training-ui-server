import { Request, Response } from "express";
import { routes } from "./pages";

export const getPages = () => {
    return routes.map(({ path, name }) => ({ name, url: path }));
}

const getCurrentPage = (req: Request) => routes.find(({ path }) => path === req.baseUrl)

const layoutCustomFunctions = {
    formatPrice: (amount: number) => {
        return `$${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    }
}

const createLayoutParams = (req: Request, params?: any) => ({
    title: params?.title || getCurrentPage(req)?.name,
    headless: req?.query?.headless === 'true',
    activePage: req.baseUrl,
    error: false,
    isLoggedIn: req?.session?.isLoggedIn || false,
    discount: req?.session?.discount || 0,
    discountCode: req?.session?.discountCode || '',
    ...layoutCustomFunctions,
    ...(params || {}),
});

const saveSession = (req: Request, res: Response, callback: Function) => {
    if (req.session) {
        req.session.save((err) => {
            if (err) {
                const body = `Error while saving session: ${err}`;
                return res.status(500).render('layout', createLayoutParams(req, { title: 'Internal Error', body }));
            }
            callback();
        });
    } else {
        callback();
    }
}

export const renderLayout = (req: Request, res: Response, layoutName: string, params?: any) => saveSession(req, res, () => {
    res.render(layoutName, createLayoutParams(req, params), (err, body) => {
        if (err) {
            console.log(err);
            const body = `Error rendering layout ${layoutName}`;
            return res.status(500).render('layout', createLayoutParams(req, { title: 'Internal Error', body }));
        }
        res.render('layout', createLayoutParams(req, { body }))
    });
});

export const redirect = (req: Request, res: Response, path: string) => saveSession(req, res, () => {
    res.redirect(path);
});

export const sleep = async (ms: number) => await new Promise(resolve => setTimeout(resolve, ms));
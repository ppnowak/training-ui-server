import { Router, Request, Response } from 'express';
import { redirect, renderLayout } from '../commons';
import { getCart, getShopCoupons, getShopProducts } from '../shopCommons';
import { validateLogin } from '../users';
import { getOrder } from '../orders';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    renderLayout(req, res, 'shop-main', { 
        products: getShopProducts(),
    });
});

router.get('/checkout', (req: Request, res: Response) => {
    renderLayout(req, res, 'shop-checkout', getCart(req));
});

router.get('/login', (req: Request, res: Response) => {
    renderLayout(req, res, 'shop-login', { error: null });
});

router.post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (validateLogin(username, password)) {
        req.session.isLoggedIn = true;
        redirect(req, res, '/shop/checkout');
    } else {
        renderLayout(req, res, 'shop-login', { error: 'Invalid credentials' });
    }
});

router.get('/register', (req: Request, res: Response) => {
    renderLayout(req, res, 'shop-register');
});

router.get('/summary', (req: Request, res: Response) => { // TODO: remove
    const { cart, discount, total } = getCart(req);
    const shippingInfo = req.session.shippingInfo || {};
    renderLayout(req, res, 'shop-summary', { cart, shippingInfo, total });
});

router.get('/summary/:orderId', (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = getOrder(orderId);

    // const { cart, discount, total } = getCart(req);
    // const shippingInfo = req.session.shippingInfo || {};
    renderLayout(req, res, 'shop-summary', order);
});

export default router;
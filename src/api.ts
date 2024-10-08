import { Router, Request, Response, json, urlencoded } from 'express';
import { redirect, renderLayout, sleep } from './commons';
import { applyDiscount, getShopCoupon, getShopCoupons, getShopProducts, ShippingInfo } from './shopCommons';
import { addUser, validateLogin } from './users';
import { saveOrder } from './orders';

const apiRouter = Router();

apiRouter.use(json());
apiRouter.use(urlencoded({ extended: true }));

apiRouter.get('/time', (req: Request, res: Response) => {
    const time = new Date().toISOString();
    res.json({ time });
});

const BROWSERS = [
    { name: "Chrome", share: 69.28 },
    { name: "Edge", share: 7.75 },
    { name: "Firefox", share: 7.48 },
    { name: "IE", share: 5.21 },
    { name: "Safari", share: 3.73 },
];

apiRouter.get('/browser-share', async (req: Request, res: Response) => {
    await sleep(2000);
    res.json(BROWSERS);
});

apiRouter.post('/shop/add', (req: Request, res: Response) => {
    const { productId } = req.body;
    const product = getShopProducts().find(p => p.id === productId);

    if (!product) {
        return res.status(500).json({ error: 'Product not found!' });
    }

    if (!req?.session?.cart) req.session.cart = [];

    const cartItem = req.session.cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        req.session.cart.push({ ...product, quantity: 1 });
    }

    res.json({ cart: req.session.cart });
});

apiRouter.post('/shop/clear', (req: Request, res: Response) => {
    req.session.cart = []
    res.json({ cart: req.session.cart });
});


apiRouter.get('/shop/cart', (req: Request, res: Response) => {
    const cart = req?.session?.cart || [];
    res.json({ cart });
});

apiRouter.post('/shop/summary', (req: Request, res: Response) => {
    const cart = req.session.cart || [];
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = applyDiscount(req, total);
    const totalWithDiscount = total - discount;

    const orderId = saveOrder({
        cart,
        discount,
        total: totalWithDiscount,
        shippingInfo: req.body as ShippingInfo
    });
    req.session.cart = [];
    req.session.discount = 0;
    req.session.discountCode = '';
    req.session.total = 0;
    req.session.shippingInfo = undefined;
    redirect(req, res, `/shop/summary/${orderId}`);
});

apiRouter.post('/shop/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    console.log(req.body);
    if (validateLogin(username, password)) {
        req.session.isLoggedIn = true;
        redirect(req, res, '/shop/checkout');
    } else {
        renderLayout(req, res, 'shop-login', { error: 'Invalid credentials' });
    }
});

apiRouter.post('/shop/register', (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        addUser(username, password);
        req.session.isLoggedIn = true;
        redirect(req, res, '/shop/checkout');
    } catch (error) {
        renderLayout(req, res, 'shop-register', {
            error: `Registration failed due to: ${(error as Error).message}`
        });
    }
});

apiRouter.get('/uptime', (req: Request, res: Response) => {
    const uptimeInSeconds = process.uptime();
    const days = Math.floor(uptimeInSeconds / (3600 * 24));
    const hours = Math.floor((uptimeInSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeInSeconds % 60);
    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    res.json({ uptime: uptimeString });
});

apiRouter.get('/download/sample', (req: Request, res: Response) => {
    const fileContent = 'This is example file';
    const fileName = 'sample.txt';
    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
    res.setHeader('Content-type', 'text/plain');
    res.send(fileContent);
});

export default apiRouter;
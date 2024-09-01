import { Request } from "express";

export type ShippingInfo = {
    firstName: string, 
    lastName: string,
    username: string, 
    email?: string, 
    address: string, 
    address2?: string, 
    country: string, 
    state: string, 
    zip: string,
    cc_number: string, 
    cc_name: string, 
    cc_expiration: string, 
    cc_cvv: string
}

export const getShopProducts = () => ([
    { id: 'tv', name: 'TV 50" OLED', image: 'tv.jpg', price: 5499 },
    { id: 'laptop', name: 'Laptop 15.6" IPS', image: 'laptop.jpg', price: 4999 },
    { id: 'smartphone', name: 'Smartphone 6.43"', image: 'smartphone.jpg', price: 1599 },
    { id: 'vacuum', name: 'Vacuum Cleaner', image: 'vacuum.jpg', price: 3449 },
    { id: 'smartwatch', name: 'Smartwatch', image: 'smartwatch.jpg', price: 249 },
    { id: 'tablet', name: 'Tablet 10.3"', image: 'tablet.jpg', price: 899 },
]);

type Coupon = {
    code: string,
    discount: number,
    minTotal: number
}

export const getShopCoupons = ():  Coupon[] => ([
    { code: '500_OFF', discount: 500, minTotal: 2000 },
    { code: '1000_OFF', discount: 1000, minTotal: 5000 },
]);

const NO_DISCOUNT: Coupon = { code: '', discount: 0, minTotal: 0 };

export const getShopCoupon = (code: string): Coupon => getShopCoupons().find(it => it.code === code) || NO_DISCOUNT;

type CartSummary = {
    cart: Array<{ id: string, name: string, price: number, quantity: number }>,
    discount: number,
    total: number,
}

export const applyDiscount = (req: Request, totalValue: number): number => {
    let discountCode = '';
    const queryDiscount = req?.query?.discountCode as string;
    const sessionDiscount = req?.session?.discountCode as string;
    if (queryDiscount !== undefined && queryDiscount !== sessionDiscount) {
        discountCode = queryDiscount;
    } else if (sessionDiscount) {
        discountCode = sessionDiscount;
    } else {
        discountCode = '';
    }
    let discount = getShopCoupon(discountCode);
    if (totalValue < discount.minTotal) {
        discount = NO_DISCOUNT;
    }

    req.session.discountCode = discount.code;
    req.session.discount = discount.discount;
    return discount.discount;
}

export const getCart = (req: Request): CartSummary => {
    const cart = req.session.cart || [];
    const value = cart.reduce((sum: number, item: { price: number, quantity: number }) => 
        sum + item.price * item.quantity, 
    0);
    const discount = applyDiscount(req, value);
    const total = value - discount;
    return { cart, discount, total };
}
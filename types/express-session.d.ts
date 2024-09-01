import session from 'express-session';
import { ShippingInfo } from '../src/shopCommons';

declare module 'express-session' {
    interface SessionData {
        isLoggedIn?: boolean;
        cart?: Array<{ id: string, name: string, price: number, quantity: number }>;
        discount?: number;
        discountCode?: string;
        shippingInfo?: ShippingInfo;
        total?: number;
    }
}

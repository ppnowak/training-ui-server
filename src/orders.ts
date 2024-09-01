import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';
import { ShippingInfo } from './shopCommons';

interface Order {
    id?: string,
    total: number,
    discount: number,
    cart: Array<{ id: string, name: string, price: number, quantity: number }>,
    shippingInfo: ShippingInfo,
}

const getOrdersFilePath = () => join(__dirname, '..', 'sessions', 'orders.json');

const loadOrders = (): Order[] => {
    const filePath = getOrdersFilePath();
    if (existsSync(filePath)) {
        const data = readFileSync(filePath, 'utf-8');
        return JSON.parse(data) as Order[];
    }
    return [];
}

let orders: Order[] = loadOrders();


const saveOrders = (): void => {
    writeFileSync(getOrdersFilePath(), JSON.stringify(orders, null, 2));
}

export const getOrder = (id: string): Order | undefined => orders.find(o => o.id === id);

const createOrderId = () => {
    let orderId = '';
    do {
        const rand = Math.random() * 50000;
        orderId = crypto.createHash('md5').update(rand + '').digest('hex');
    } while (getOrder(orderId));
    return orderId;
}

export const saveOrder = (order: Order): string => {
    order.id = createOrderId();
    orders.push(order);
    saveOrders();
    return order.id;
}
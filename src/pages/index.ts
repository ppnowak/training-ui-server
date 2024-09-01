import { Router } from "express"
import indexPageRouter from './indexPage';
import booksPageRouter from './books';
import shopRouter from './shop';
import { createLayoutOnlyRouter } from "./layout-only";

type Route = {
    path: string,
    name: string,
    router: Router,
}

export const routes: Route[] = [
    { path: '/',                name: 'Index',              router: indexPageRouter },
    { path: '/books',           name: 'Books',              router: booksPageRouter },
    { path: '/form-elements',   name: 'HTML Form Elements', router: createLayoutOnlyRouter('html-elements') },
    { path: '/delayed-content', name: 'Disappearing DIVs',  router: createLayoutOnlyRouter('delayed-content') },
    { path: '/upload',          name: 'File Upload',        router: createLayoutOnlyRouter('upload') },
    { path: '/time',            name: 'Current Time',       router: createLayoutOnlyRouter('time') },
    { path: '/cookies',         name: 'Cookies',            router: createLayoutOnlyRouter('cookies') },
    { path: '/local-storage',   name: 'Local Storage',      router: createLayoutOnlyRouter('local-storage') },
    { path: '/session-storage', name: 'Session Storage',    router: createLayoutOnlyRouter('session-storage') },
    { path: '/iframe',          name: 'IFrame',             router: createLayoutOnlyRouter('iframe') },
    { path: '/alerts',          name: 'Dialog Boxes',       router: createLayoutOnlyRouter('alerts') },
    { path: '/table',           name: 'Table',              router: createLayoutOnlyRouter('table') },
    { path: '/shop',            name: 'Shop',               router: shopRouter },
]
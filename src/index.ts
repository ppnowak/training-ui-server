import express from 'express';
import path from 'path';
import { getPages } from './commons';
import { routes } from './pages';
import apiRouter from './api';
import session from 'express-session';
import FileStore from 'session-file-store';

const app = express();

app.locals.pages = getPages();
console.log(app.locals.pages);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));


const fileStore = FileStore(session);
app.use(session({
    secret: 'fghjklkjmnsfhajd;GHKDSi;ladjg',
    resave: false,
    saveUninitialized: false,
    store: new fileStore({ path: './sessions' }),
    cookie: { secure: false, maxAge: 7 * 24 * 60 * 1000 },
}));

app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/v1', apiRouter);

routes.forEach(({ path, router }) => {
    app.use(path, router);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

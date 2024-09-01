import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { renderLayout } from '../commons';

const router = Router();

type Book = {
    genre: string,
    title: string,
    author: string,
    id?: string
}

const books: Book[] = [
    { genre: 'fiction', title: 'A Children’s Bible', author: 'Lydia Millet' },
    { genre: 'fiction', title: 'Deacon King Kong', author: 'James McBride' },
    { genre: 'fiction', title: 'Hamnet', author: 'Maggie O’Farrell' },
    { genre: 'fiction', title: 'Homeland Elegies', author: 'Ayad Akhtar' },
    { genre: 'fiction', title: 'Vanishing Half', author: 'Brit Bennett' },
    { genre: 'nonfiction', title: 'Hidden Valley Road', author: 'Robert Kolker' },
    { genre: 'nonfiction', title: 'A Promised Land', author: 'Barack Obama' },
    { genre: 'nonfiction', title: 'Shakespeare in a Divided America', author: 'James Shapiro' },
    { genre: 'nonfiction', title: 'Uncanny Valley', author: 'Anna Wiener' },
    { genre: 'nonfiction', title: 'War', author: 'Margaret MacMillan' },
].map((book: Book) => {
    book.id = crypto.createHash('md5').update(book.genre + book.title + book.author).digest('hex').substr(0, 5);
    return book;
});

router.get('/', (req: Request, res: Response) => {
    const isRandom = req.query.randomize === 'true';
    const response = [...books];
    if (isRandom) {
        response.sort(() => Math.random() - 0.5);
    }
    renderLayout(req, res, 'books', { 
        books: response, 
        isRandom: isRandom 
    });
});

export default router;

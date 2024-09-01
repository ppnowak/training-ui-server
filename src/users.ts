import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';

interface User {
    username: string;
    passwordHash: string;
}

const getUsersFilePath = () => join(__dirname, '..', 'sessions', 'users.json');

const loadUsers = (): User[] => {
    const filePath = getUsersFilePath();
    if (existsSync(filePath)) {
        const data = readFileSync(filePath, 'utf-8');
        return JSON.parse(data) as User[];
    }
    return [];
}

let users: User[] = loadUsers();


const saveUsers = (): void => {
    const filePath = join(__dirname, '..', 'sessions', 'users.json');
    writeFileSync(filePath, JSON.stringify(users, null, 2));
}

export const getUsers = (): string[] => users.map(({ username }) => username);

export const addUser = (username: string, password: string): void => {
    if (!username || !password) {
        throw new Error("Incorrect username or password!");
    }
    if (getUsers().find(user => user.toLowerCase() === username.toLowerCase())) {
        throw new Error("User with this name already exists!");
    }
    const passwordHash = crypto.createHash('md5').update(password).digest('hex');
    users.push({ username, passwordHash });
    saveUsers();
}

export const validateLogin = (username: string, password: string): boolean => {
    const passwordHash = crypto.createHash('md5').update(password).digest('hex');
    return users.some(user => user.username === username && user.passwordHash === passwordHash);
}

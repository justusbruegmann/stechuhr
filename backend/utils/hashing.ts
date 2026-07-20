import * as bcrypt from 'bcrypt';

const saltRounds = 10;
const password = 'mySecurePassword';

export async function hashPassword(password: string) {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        throw error;
    }
}

export async function verifyPassword(password: string, hash: string) {
    try {
        const isValid = await bcrypt.compare(password, hash);
        return isValid;
    } catch (error) {
        throw error;
    }
}


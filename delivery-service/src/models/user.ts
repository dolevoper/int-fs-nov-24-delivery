import { createHash, randomUUID } from "crypto";
import { dbClient } from "./db";

export async function isEmailTaken(email: string) {
    if (!email) {
        throw new Error("Email is required");
    }
    if (typeof email !== "string") {
        throw new Error("Email must be a string");
    }
    if (email.length < 5 || email.length > 255) {
        throw new Error("Email must be between 5 and 255 characters");
    }
    try {
        const res = await dbClient.execute(`SELECT * FROM users WHERE email = ?`, [email]);
        return !!res.rows.length;
    }catch (error) {
        console.error("Error checking if email is taken:", error);
        throw new Error("Failed to check email");
    }
    
}

export async function createUser(email: string, password: string, fullName: string) {
    const id = randomUUID();
    const createdAt = new Date();
    const passwordHash = hashPasswordWithSalt(password, createdAt);

    try {
        await dbClient.execute(`INSERT INTO users (id, email, passwordHash, fullName, createdAt)
                            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
                            [id, email, passwordHash, fullName]);

        return id;
    }catch(error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
    }
    
}

export async function getByCredentials(email: string, password: string) {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    try{
        const res = await dbClient.execute(`SELECT * FROM users WHERE email = ?`, [email]);

        if (res.rows.length !== 1) {
            throw new Error();
        }

        const { id, passwordHash, fullName, createdAt } = res.rows[0];
        
        if (passwordHash !== hashPasswordWithSalt(password, new Date(createdAt as string))) {
            throw new Error();
        }

        return { id, email, fullName, createdAt };
    } catch (error) {
        console.error("Error getting user by credentials:", error);
        throw new Error("Error getting user by credentials");
    }
}

function hashPasswordWithSalt(password: string, salt: Date) {
    const hash = createHash("sha512");

    hash.update(password);
    hash.update(salt.valueOf().toString());

    return hash.digest("base64");
}

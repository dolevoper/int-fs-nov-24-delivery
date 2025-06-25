import { Application, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import { createUser, getByCredentials, isEmailTaken } from "./models/user";

export function useAuth(app: Application) {
    app.post("/register", register);
    app.post("/login", login);
    app.use(expressjwt({
        algorithms: ["HS256"],
        secret: process.env.SESSION_SECRET!,
    }));
}

function createToken(userId: string, userName: string ) {
    return jwt.sign({ sub: userId, userName }, process.env.SESSION_SECRET!, { expiresIn: 60 * 60 * 24 });
}

const register: RequestHandler = async (req, res) => {
    try {
        const { email, fullName, password } = req.body;

        if (!email) {
            res.status(400);
            res.send("email is required");
            return;
        }

        if (await isEmailTaken(email)) {
            res.status(409);
            res.send(`User with email ${email} already exists`);
            return;
        }

        // TODO: validate password

        const id = await createUser(email, password, fullName);

        res.json({
            token: createToken(id, fullName),
        });
    } catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
};

const login: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            res.status(400);
            res.send("email is required");
            return;
        }

        if (!password) {
            res.status(400);
            res.send("password is required");
            return;
        }

        const user = await getByCredentials(email, password);

        res.json({
            token: createToken(user.id as string, user.fullName as string),
        });
    } catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
};

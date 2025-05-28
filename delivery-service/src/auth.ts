import { Application, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import { User } from "./models/user";
import { randomUUID } from "crypto";

const refreshTokens = new Map<string, string>();

export function useAuth(app: Application) {
    app.post("/register", register);
    app.post("/login", login);
    app.post("/refresh-token", refreshToken);
    app.use(expressjwt({
        algorithms: ["HS256"],
        secret: process.env.SESSION_SECRET!,
    }));
}

function createToken(userId: string, userName: string ) {
    // return jwt.sign({ sub: userId, userName }, process.env.SESSION_SECRET!, { expiresIn: 60 * 10 });
    return jwt.sign({ sub: userId, userName }, process.env.SESSION_SECRET!, { expiresIn: 5 });
}

const register: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            res.status(400);
            res.send("email is required");
            return;
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.status(409);
            res.send(`User with email ${email} already exists`);
            return;
        }

        // TODO: validate password
        const newUser = await User.create({ email, password });
        const refreshToken = randomUUID();

        refreshTokens.set(refreshToken, newUser.id);

        res.json({
            accessToken: createToken(newUser.id, newUser.fullName),
            refreshToken,
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

        const user = await User.findOne({ email, password });

        if (!user) {
            res.status(401);
            res.end();
            return;
        }

        const refreshToken = randomUUID();

        refreshTokens.set(refreshToken, user.id);

        res.json({
            accessToken: createToken(user.id, user.fullName),
            refreshToken,
        });
    } catch (err) {
        console.error(err);
        res.status(500);
        res.end();
    }
};

const refreshToken: RequestHandler = async (req, res) => {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader) {
        res.status(401);
        res.end();
        return;
    }

    const [, refreshToken] = authorizationHeader.split(" ");

    if (!refreshTokens.has(refreshToken)) {
        res.status(401);
        res.end();
        return;
    }

    const user = await User.findById(refreshTokens.get(refreshToken));

    if (!user) {
        res.status(401);
        res.end();
        return;
    }

    res.json({
        accessToken: createToken(user.id, user.fullName),
    });
};

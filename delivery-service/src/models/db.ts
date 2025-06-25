import { createClient } from "@libsql/client";

export const dbClient = createClient({
    url: process.env.SQL_CONNECTION_STRING!,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

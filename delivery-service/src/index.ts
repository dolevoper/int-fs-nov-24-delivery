import "dotenv/config";

import { createServer } from "http";
import { app } from "./app";

const server = createServer(app);
const port = process.env.PORT || 5000;

async function init() {
    server.listen(port, () => console.log(`Server listening on port ${port}`));
}

init();

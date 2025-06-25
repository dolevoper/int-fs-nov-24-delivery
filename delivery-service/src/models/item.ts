import { dbClient } from "./db";

type Item = {
    id: string,
    name: string,
    description: string,
    previewImageUrl: string,
    priceInAgorot: number,
};

export async function getAll() {
    const res = await dbClient.execute("SELECT * FROM items");

    return res.rows as unknown as Item[];
}

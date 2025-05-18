export type Item = {
    _id: string,
    name: string,
    description: string,
    previewImageUrl: string,
    priceInAgorot: number,
};

export async function getItems(): Promise<Item[]> {
    const res = await fetch("http://localhost:5000/items");
    const items = await res.json();

    return items;
}

import { apiClient } from "./apiClient";

export type Item = {
    id: string,
    name: string,
    description: string,
    previewImageUrl: string,
    priceInAgorot: number,
};

export async function getItems(): Promise<Item[]> {
    const res = await apiClient.get("/items");
    
    return res.data;
}

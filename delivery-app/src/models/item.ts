// import burgerImg from "../assets/burger.jpg";
// import frenchFriesImg from "../assets/french fries.jpg";
// import sodaImg from "../assets/soda.jpg";
// import mayoImg from "../assets/mayo.jpg";

export type Item = {
    _id: string,
    name: string,
    description: string,
    imgSrc: string,
    priceInAgorot: number,
};

export async function getItems(): Promise<Item[]> {
    const res = await fetch("http://localhost:5000/items");
    const items = await res.json();

    return items;
}

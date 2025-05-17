import burgerImg from "../assets/burger.jpg";
import frenchFriesImg from "../assets/french fries.jpg";
import sodaImg from "../assets/soda.jpg";
import mayoImg from "../assets/mayo.jpg";

export type Item = {
    id: string,
    name: string,
    description: string,
    imgSrc: string,
    priceInAgorot: number,
};

export async function getItems(): Promise<Item[]> {
    await randomDelay();
    
    return [
        { id: "1111", name: "Burger", description: "A yummy burger", imgSrc: burgerImg, priceInAgorot: 4000 },
        { id: "2222", name: "French fries", description: "Crispy, delicious, french frize", imgSrc: frenchFriesImg, priceInAgorot: 2500 },
        { id: "3333", name: "Soda", description: "Fizzling soda", imgSrc: sodaImg, priceInAgorot: 1000 },
        { id: "4444", name: "Mayo", description: "Our home-made mayo sauce", imgSrc: mayoImg, priceInAgorot: 200 },
    ];
}

const randomDelay = () => new Promise<void>((resolve) => {
    const delay = (Math.random() * 2000) + 700;

    return setTimeout(
        () => {
            resolve();
        },
        delay
    );
});


CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    passwordHash VARCHAR(100) NOT NULL,
    fullName VARCHAR(100) NOT NULL,
    createdAt INT NOT NULL
);

CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    orderingUserId VARCHAR(36) NOT NULL,
    phase VARCHAR(15) NOT NULL,
    restaurant VARCHAR(50) NOT NULL,
    createdAt DATETIME NOT NULL,
    lastUpdatedAt DATETIME NOT NULL,
    FOREIGN KEY(orderingUserId) REFERENCES users(id)
);

CREATE TABLE items (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    previewImageUrl VARCHAR(500),
    priceInAgorot INT
);

CREATE TABLE orderItems (
    orderId VARCHAR(36),
    itemId VARCHAR(36),
    quantity INT,
    PRIMARY KEY (orderId, itemId),
    FOREIGN KEY(orderId) REFERENCES orders(id),
    FOREIGN KEY(itemId) REFERENCES items(id)
);

INSERT INTO items
(id, name, description, priceInAgorot, previewImageUrl)
VALUES
("ab9385cf-2ee9-431c-8a7b-1111c3e41b4e", "Burger", "A yummy burger", 4000, "http://localhost:5000/burger.jpg"),
("6521de3c-d0e3-4947-86a1-787205179f5b", "French fries", "Crispy, delicious, french frize", 2500, "http://localhost:5000/french fries.jpg"),
("2f6050f0-8eb6-4bec-85be-d424667ce6aa", "Soda", "Fizzling soda", 1000, "http://localhost:5000/soda.jpg"),
("249433b0-b483-4904-9ba2-e7846c62b0b9", "Mayo", "Our home-made mayo sauce", 200, "http://localhost:5000/mayo.jpg");

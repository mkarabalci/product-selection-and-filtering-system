-- Müşteriler
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);


-- Tedarikçiler 
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,  -- 'Migros', 'A101'
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
-- Tedarikçiler
INSERT INTO suppliers (company_name, email, password) VALUES
('Migros', 'migros@migros.com', 'migros123'),
('A101', 'a101@a101.com', 'a101123'),
('BIM', 'bim@bim.com', 'bim123'),
('SOK', 'sok@sok.com', 'sok123');

--Şubeler
CREATE TABLE branches (
    id SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES suppliers(id),
    name VARCHAR(100) NOT NULL,   
    address VARCHAR(200)
);
ALTER TABLE branches 
ADD COLUMN latitude DECIMAL(9,6),
ADD COLUMN longitude DECIMAL(9,6);

--Her market için 2 şube 
INSERT INTO branches (supplier_id, name, address, latitude, longitude) VALUES
(1, 'Migros Kadıköy', 'Kadıköy, İstanbul', 40.989500, 29.028700),
(1, 'Migros Beşiktaş', 'Beşiktaş, İstanbul', 41.043100, 29.007500),
(2, 'A101 Üsküdar', 'Üsküdar, İstanbul', 41.023400, 29.015600),
(2, 'A101 Şişli', 'Şişli, İstanbul', 41.060200, 28.987300),
(3, 'BIM Ataşehir', 'Ataşehir, İstanbul', 40.992300, 29.124500),
(3, 'BIM Bakırköy', 'Bakırköy, İstanbul', 40.981200, 28.872300),
(4, 'SOK Beyoğlu', 'Beyoğlu, İstanbul', 41.033400, 28.977600),
(4, 'SOK Maltepe', 'Maltepe, İstanbul', 40.935600, 29.131200);


CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL  
);

-- Kategori ekleme
INSERT INTO categories (name) VALUES ('Snacks');


CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL  
);

-- Markalar ekleme
INSERT INTO brands (name) VALUES  ('Ülker'), ('Eti'), ('Lays'), ('Züber'), ('Nestle'), ('Tadım');


CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category_id INT REFERENCES categories(id),
    brand_id INT REFERENCES brands(id)
);

CREATE TABLE branch_products (
    id SERIAL PRIMARY KEY,
    branch_id INT REFERENCES branches(id),
    product_id INT REFERENCES products(id),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0
);


CREATE TABLE snack_details (
    product_id      INT PRIMARY KEY REFERENCES products(id),
    snacks_type     VARCHAR(50),
    energy_kcal     INT,
    protein_g       DECIMAL(5,2),
    sugar_g         DECIMAL(5,2),
    oil_type        TEXT[],
    packaging       VARCHAR(30),
    allergens       TEXT[],
    is_dark_chocolate   BOOLEAN DEFAULT FALSE,
    is_locally_produced BOOLEAN DEFAULT FALSE,
    is_imported         BOOLEAN DEFAULT FALSE
);


--Eti burçak 
INSERT INTO products (name, category_id, brand_id) VALUES ('Eti Burçak', 1, 2);

INSERT INTO snack_details (product_id, snacks_type, energy_kcal, protein_g, sugar_g, oil_type, packaging, allergens, is_dark_chocolate, is_locally_produced, is_imported)
VALUES (
    1,
    'Biscuit',
    550,
    '6.00',
    '38.00',
    ARRAY['Sunflower Oil', 'Canola Oil', 'Palm Oil', 'Cotton Oil'],
    'Single Product',
    ARRAY['Gluten', 'Sulfide', 'Halal','Milk product','Egg','Soy product', 'Sesame','Nut'], 
    FALSE,
    TRUE,
    FALSE
);

--Eti Benimo 
INSERT INTO products (name, category_id, brand_id) VALUES ('Eti Benimo', 1, 2);

INSERT INTO snack_details (product_id, snacks_type, energy_kcal, protein_g, sugar_g, oil_type, packaging, allergens, is_dark_chocolate, is_locally_produced, is_imported)
VALUES (
    2,
    'Biscuit',
    450,
    '6.00',
    '38.00',
    ARRAY['Sunflower Oil','Canola Oil', 'Palm Oil' , 'Cotton Oil'],
    'Single Product',
    ARRAY['Gluten', 'Sulfide', 'Halal','Milk product','Egg','Soy product', 'Sesame', 'Nut'],
    FALSE,
    TRUE,
    FALSE
);

--Eti Karam
INSERT INTO products (name, category_id, brand_id) VALUES ('Eti Karam', 1, 2);

INSERT INTO snack_details (product_id, snacks_type, energy_kcal, protein_g, sugar_g, oil_type, packaging, allergens, is_dark_chocolate, is_locally_produced, is_imported)
VALUES (
    3,
    'Chocolate',
    517,
    '5.50',
    '35.00',
    ARRAY['Sunflower Oil', 'Palm Oil' , 'Cotton Oil'],
    'Single Product',
    ARRAY['Gluten', 'Halal','Milk product','Soy product', 'Sesame', 'Nut', 'Peanut'],
    TRUE,
    TRUE,
    FALSE
);

--Dido 
INSERT INTO products (name, category_id, brand_id) VALUES ('Dido', 1, 1);

INSERT INTO snack_details (product_id, snacks_type, energy_kcal, protein_g, sugar_g, oil_type, packaging, allergens, is_dark_chocolate, is_locally_produced, is_imported)
VALUES (
    4,
    'Chocolate',
    530,
    '7.00',
    '51.00',
    ARRAY['Cocoa Oil', 'Palm Oil'],
    'Single Product',
    ARRAY['Gluten', 'Halal','Milk product','Egg','Soy product', 'Nut'],
    FALSE,
    TRUE,
    FALSE
);



--Laviva
INSERT INTO products (name, category_id, brand_id) VALUES ('Laviva', 1, 1);

INSERT INTO snack_details (product_id, snacks_type, energy_kcal, protein_g, sugar_g, oil_type, packaging, allergens, is_dark_chocolate, is_locally_produced, is_imported)
VALUES (
    5,
    'Chocolate',
    540,
    '7.00',
    '46.00',
    ARRAY['Cocoa Oil', 'Palm Oil'],
    'Single Product',
    ARRAY['Gluten', 'Halal','Milk product','Egg', 'Peanut', 'Soy product', 'Hazelnut'],
    FALSE,
    TRUE,
    FALSE
);

--Lays klasik 
INSERT INTO products (name, category_id, brand_id) VALUES ('Lays Klasik', 1, 3);

INSERT INTO snack_details (product_id, snacks_type, energy_kcal, protein_g, sugar_g, oil_type, packaging, allergens, is_dark_chocolate, is_locally_produced, is_imported)
VALUES (
    6,
    'Chips',
    560,
    '5.00',
    '0.70',
    ARRAY['Corn Oil', 'Sunflower Oil', 'Canola Oil'],
    'Single Product',
    ARRAY[ 'Halal' ],
    FALSE,
    TRUE,
    FALSE
);

--Lays Baharatlı 
INSERT INTO products (name, category_id, brand_id) VALUES ('Lays Baharatlı', 1, 3);

INSERT INTO snack_details (product_id, snacks_type, energy_kcal, protein_g, sugar_g, oil_type, packaging, allergens, is_dark_chocolate, is_locally_produced, is_imported)
VALUES (
    7,
    'Chips',
    510,
    '6.00',
    '2.40',
    ARRAY['Corn Oil', 'Sunflower Oil', 'Canola Oil'],
    'Single Product',
    ARRAY[ 'Halal' ],
    FALSE,
    TRUE,
    FALSE
);


select*from products
select*from snack_details
SELECT id, name FROM branches;
SELECT id, name FROM products;

select*from branch_products

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

--Şubelere ürün ekleme
INSERT INTO branch_products (branch_id, product_id, price, stock_quantity) VALUES
-- Eti Burçak id=1  fiyat 25TL
(1, 1, 27.00, 50),  -- Migros Kadıköy
(2, 1, 27.00, 40),  -- Migros Beşiktaş
(3, 1, 25.00, 0),  -- A101 Üsküdar
(4, 1, 25.00, 35),  -- A101 Şişli
(5, 1, 24.00, 0),  -- BIM Ataşehir
(6, 1, 24.00, 40),  -- BIM Bakırköy
(7, 1, 26.00, 25),  -- SOK Beyoğlu
(8, 1, 26.00, 30),  -- SOK Maltepe

-- Eti Benimo id=2 fiyat 30TL
(1, 2, 31.00, 45),  -- Migros Kadıköy
(2, 2, 31.00, 40),  -- Migros Beşiktaş
(3, 2, 30.00, 30),  -- A101 Üsküdar
(4, 2, 30.00, 0),  -- A101 Şişli
(5, 2, 29.00, 0),  -- BIM Ataşehir
(6, 2, 29.00, 45),  -- BIM Bakırköy
(7, 2, 30.00, 25),  -- SOK Beyoğlu
(8, 2, 30.00, 30),  -- SOK Maltepe

-- Eti Karam id=3 fiyat 23TL
(1, 3, 24.50, 20),  -- Migros Kadıköy
(2, 3, 24.50, 15),  -- Migros Beşiktaş
(3, 3, 23.00, 25),  -- A101 Üsküdar
(4, 3, 23.00, 20),  -- A101 Şişli
(5, 3, 22.50, 0),  -- BIM Ataşehir
(6, 3, 22.50, 25),  -- BIM Bakırköy
(7, 3, 23.00, 15),  -- SOK Beyoğlu
(8, 3, 23.00, 0),  -- SOK Maltepe

-- Dido id=4 fiyat 25TL
(1, 4, 26.50, 40),  -- Migros Kadıköy
(2, 4, 26.50, 35),  -- Migros Beşiktaş
(3, 4, 25.00, 40),  -- A101 Üsküdar
(4, 4, 25.00, 60),  -- A101 Şişli
(5, 4, 24.50, 30),  -- BIM Ataşehir
(6, 4, 24.50, 10),  -- BIM Bakırköy
(7, 4, 25.00, 0),  -- SOK Beyoğlu
(8, 4, 25.00, 30),  -- SOK Maltepe

-- Laviva id=5 fiyat 25TL
(1, 5, 26.50, 30),  -- Migros Kadıköy
(2, 5, 26.50, 25),  -- Migros Beşiktaş
(3, 5, 25.00, 35),  -- A101 Üsküdar
(4, 5, 25.00, 30),  -- A101 Şişli
(5, 5, 24.50, 70),  -- BIM Ataşehir
(6, 5, 24.50, 80),  -- BIM Bakırköy
(7, 5, 25.00, 20),  -- SOK Beyoğlu
(8, 5, 25.00, 25),  -- SOK Maltepe

-- Lays Klasik id=6 fiyat 55TL
(1, 6, 57.00, 60),  -- Migros Kadıköy
(2, 6, 57.00, 70),  -- Migros Beşiktaş
(3, 6, 55.00, 50),  -- A101 Üsküdar
(4, 6, 55.00, 40),  -- A101 Şişli
(5, 6, 54.00, 30),  -- BIM Ataşehir
(6, 6, 54.00, 25),  -- BIM Bakırköy
(7, 6, 56.00, 0),  -- SOK Beyoğlu
(8, 6, 56.00, 0),  -- SOK Maltepe

-- Lays Baharatlı id=7 fiyat 50TL
(1, 7, 52.00, 20),  -- Migros Kadıköy
(2, 7, 52.00, 25),  -- Migros Beşiktaş
(3, 7, 50.00, 45),  -- A101 Üsküdar
(4, 7, 50.00, 45),  -- A101 Şişli
(5, 7, 49.00, 60),  -- BIM Ataşehir
(6, 7, 49.00, 55),  -- BIM Bakırköy
(7, 7, 51.00, 25),  -- SOK Beyoğlu
(8, 7, 51.00, 30);  -- SOK Maltepe


SELECT 
    p.name AS urun, 
    b.name AS sube, 
    bp.price AS fiyat,
    bp.stock_quantity AS stok,
    sd.snacks_type AS tur,
    sd.energy_kcal AS kalori,
    sd.allergens AS allerjenler
FROM products p JOIN branch_products bp ON p.id = bp.product_id
JOIN branches b ON bp.branch_id = b.id JOIN snack_details sd ON p.id = sd.product_id
ORDER BY p.name, b.name;  

select*from products

ALTER TABLE products ADD COLUMN image_url VARCHAR(500);
UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/07010112/07010112-3c6818-1650x1650.jpg' WHERE name = 'Eti Burçak';
UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/7017799/7017799-4e443c-1650x1650.jpg' WHERE name = 'Eti Benimo';
UPDATE products SET image_url = 'https://images.migrosone.com/hemen/product/07160817/7160817-b58034-1650x1650.jpg' WHERE name = 'Eti Karam';
UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/07163049/07163049-69adf4-1650x1650.jpg' WHERE name = 'Dido';
UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/07012376/07012376_1-e21024-1650x1650.jpg' WHERE name = 'Laviva';
UPDATE products SET image_url = 'https://cdn.dsmcdn.com/ty1659/prod/QC/20250408/15/1a25c5e4-3c49-366a-8c58-240701b59ed2/1_org_zoom.jpg' WHERE name = 'Lays Klasik';
UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/05080147/05080147_1-bd8bce-1650x1650.jpg' WHERE name = 'Lays Baharatlı';

-- İçecek kategorisi
INSERT INTO categories (name) VALUES ('Beverages');

-- İçecekler detay tablosu
CREATE TABLE beverages_details (
    product_id          INT PRIMARY KEY REFERENCES products(id),
    beverage_type       VARCHAR(50),
    energy_kcal         INT,
    pH                  DECIMAL(3,1),
    sugar_g             DECIMAL(5,2),
    volume              DECIMAL(5,2),
    packaging           INT,
    package_type        TEXT[],
    allergens           TEXT[],
    is_locally_produced BOOLEAN DEFAULT FALSE
);


--içecekler marka 
INSERT INTO brands (name) VALUES 
('Beypazarı'), 
('Kızılay'), 
('Sırma'), 
('Sprite'), 
('Dimes'), 
('Tamek'), 
('Sütaş'), 
('Coca-Cola'), 
('Erikli'), 
('Red Bull'), 
('Pepsi'), 
('Fanta'),
('İçim')


--Beypazarı limonlu maden suyu 
INSERT INTO products (name, category_id, brand_id) VALUES ('Beypazarı Limonlu Maden Suyu', 2, 7);

INSERT INTO beverages_details (product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    8,
    'Mineral Water',
    32,
    '6.50',
    '8.00',
    '0.20',
    1,
	ARRAY['Glass'],
	ARRAY['Halal'],
    TRUE 
);


--Beypazarı Çilekli maden suyu 
INSERT INTO products (name, category_id, brand_id) VALUES ('Beypazarı Çilekli Maden Suyu', 2, 7);

INSERT INTO beverages_details (product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    9,
    'Mineral Water',
    24,
    '6.50',
    '6.00',
    '0.20',
    1,
	ARRAY['Glass'],
	ARRAY['Halal'],
    TRUE 
);

--Coca cola 
INSERT INTO products (name, category_id, brand_id) VALUES ('Coca-Cola', 2, 14);
INSERT INTO beverages_details (product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    10,
    'Soda',
    180,
    '2.50',
    '10.60',
    '0.25',
    1,
	ARRAY['Can'],
	ARRAY['Halal','Caffeine'],
    TRUE 
);


--Sprite
INSERT INTO products (name, category_id, brand_id) VALUES ('Sprite', 2, 10);
INSERT INTO beverages_details (product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    11,
    'Soda',
    13,
    '3.40',
    '3.10',
    '0.33',
    1,
	ARRAY['Can'],
	ARRAY['Halal'],
    TRUE 
);

--Fanta
INSERT INTO products (name, category_id, brand_id) VALUES ('Fanta', 2, 18);
INSERT INTO beverages_details (product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    12,
    'Soda',
    13,
    '3.40',
    '3.10',
    '0.33',
    1,
	ARRAY['Can'],
	ARRAY['Halal'],
    TRUE 
);

--new beverages
-- Pepsi
INSERT INTO products (name, category_id, brand_id) VALUES ('Pepsi', 2, 17);
INSERT INTO beverages_details 
	(product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Pepsi' AND brand_id=17),
    'Soda', 28, 2.5, 7.00, 0.33, 1,
    ARRAY['Can'],
    ARRAY['Halal', 'Caffeine'],
    TRUE
);

-- İçim Whole Milk
INSERT INTO products (name, category_id, brand_id) VALUES ('Whole Milk', 2, 19);
INSERT INTO beverages_details 
(product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Whole Milk' AND brand_id=19),
    'Milk', 57, 6.7, 4.70, 1.00, 1,
    ARRAY['Carton'],
    ARRAY['Halal', 'Lactose'],
    TRUE
);

-- Sütaş Whole Milk
INSERT INTO products (name, category_id, brand_id) VALUES ('Whole Milk', 2, 13);
INSERT INTO beverages_details 
(product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Whole Milk' AND brand_id=13),
    'Milk', 60, 6.7, 5.00, 1.00, 1,
    ARRAY['Carton'],
    ARRAY['Halal', 'Lactose'],
    TRUE
);

-- Tamek Peach Juice
INSERT INTO products (name, category_id, brand_id) VALUES ('Peach Juice', 2, 12);
INSERT INTO beverages_details 
(product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Peach Juice' AND brand_id=12),
    'Juice', 32, 3.7, 8.00, 1.00, 1,
    ARRAY['Carton'],
    ARRAY['Halal'],
    TRUE
);

-- Dimes Peach Juice
INSERT INTO products (name, category_id, brand_id) VALUES ('Peach Juice', 2, 11);
INSERT INTO beverages_details 
(product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Peach Juice' AND brand_id=11),
    'Juice', 43, 3.7, 10.00, 1.00, 1,
    ARRAY['Carton'],
    ARRAY['Halal'],
    TRUE
);

-- Red Bull
INSERT INTO products (name, category_id, brand_id) VALUES ('Red Bull', 2, 16);
INSERT INTO beverages_details 
(product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Red Bull' AND brand_id=16),
    'Energy Drink', 46, 3.3, 11.00, 0.25, 1,
    ARRAY['Can'],
    ARRAY['Halal', 'Caffeine'],
    FALSE
);

-- Sırma Spring Water
INSERT INTO products (name, category_id, brand_id) VALUES ('Spring Water', 2, 9);
INSERT INTO beverages_details 
(product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Spring Water' AND brand_id=9),
    'Water', 0, 6.7, 0.00, 0.50, 1,
    ARRAY['Plastic'],
    ARRAY['Halal'],
    TRUE
);

-- Erikli Spring Water 
INSERT INTO products (name, category_id, brand_id) VALUES ('Spring Water', 2, 15);
INSERT INTO beverages_details 
(product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Spring Water' AND brand_id=15),
    'Water', 0, 6.7, 0.00, 0.50, 24,
    ARRAY['Plastic'],
    ARRAY['Halal'],
    TRUE
);

-- Coca-Cola Zero
INSERT INTO products (name, category_id, brand_id) VALUES ('Coca-Cola Zero', 2, 14);
INSERT INTO beverages_details 
(product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Coca-Cola Zero' AND brand_id=14),
    'Soda', 0, 2.7, 0.00, 0.33, 1,
    ARRAY['Can'],
    ARRAY['Halal', 'Caffeine'],
    TRUE
);

-- Pepsi Zero
INSERT INTO products (name, category_id, brand_id) VALUES ('Pepsi Zero', 2, 17);
INSERT INTO beverages_details 
(product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Pepsi Zero' AND brand_id=17),
    'Soda', 0, 2.53, 0.00, 0.33, 1,
    ARRAY['Can'],
    ARRAY['Halal', 'Caffeine'],
    TRUE
);

-- Dimes Mixed Fruit Juice
INSERT INTO products (name, category_id, brand_id) VALUES ('Mixed Fruit Juice', 2, 11);
INSERT INTO beverages_details 
(product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Mixed Fruit Juice' AND brand_id=11),
    'Juice', 50, 3.75, 11.00, 1.00, 1,
    ARRAY['Carton'],
    ARRAY['Halal'],
    TRUE
);

-- Tamek Mixed Fruit Juice
INSERT INTO products (name, category_id, brand_id) VALUES ('Mixed Fruit Juice', 2, 12);
INSERT INTO beverages_details 
(product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Mixed Fruit Juice' AND brand_id=12),
    'Juice', 48, 3.7, 11.70, 1.00, 1,
    ARRAY['Carton'],
    ARRAY['Halal'],
    TRUE
);

-- Sprite Zero
INSERT INTO products (name, category_id, brand_id) VALUES ('Sprite Zero', 2, 10);
INSERT INTO beverages_details 
(product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Sprite Zero' AND brand_id=10),
    'Soda', 2, 3.4, 0.00, 1.00, 1,
    ARRAY['Plastic'],
    ARRAY['Halal'],
    TRUE
);

-- Red Bull Zero
INSERT INTO products (name, category_id, brand_id) VALUES ('Red Bull Zero', 2, 16);
INSERT INTO beverages_details 
(product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Red Bull Zero' AND brand_id=16),
    'Energy Drink', 2, 3.3, 0.00, 0.25, 1,
    ARRAY['Can'],
    ARRAY['Halal', 'Caffeine'],
    FALSE
);

-- Fanta Zero
INSERT INTO products (name, category_id, brand_id) VALUES ('Fanta Zero', 2, 18);
INSERT INTO beverages_details 
(product_id, beverage_type, energy_kcal, pH, sugar_g, volume, packaging, package_type, allergens, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Fanta Zero' AND brand_id=18),
    'Soda', 6, 2.9, 0.80, 1.00, 1,
    ARRAY['Plastic'],
    ARRAY['Halal'],
    TRUE
);

UPDATE products SET name = 'Lemon Mineral Water' WHERE name = 'Beypazarı Limonlu Maden Suyu';
UPDATE products SET name = 'Strawberry Mineral Water' WHERE name = 'Beypazarı Çilekli Maden Suyu';
UPDATE products SET name = 'Spring Water' WHERE name = 'Su' AND brand_id = 21;  -- Pınar Su;

-- Kontrol
SELECT p.name, b.name AS brand FROM products p 
JOIN brands b ON p.brand_id = b.id 
WHERE p.category_id = 2 ORDER BY p.id;

UPDATE beverages_details SET beverage_type = 'Water' WHERE product_id = 16;

SELECT p.id, p.name, b.name AS brand, bd.beverage_type, bd.volume, bd.packaging
FROM products p
JOIN brands b ON p.brand_id = b.id
JOIN beverages_details bd ON p.id = bd.product_id
WHERE p.category_id = 2
ORDER BY p.id;


-- yeni içecekleri şubelere ekleme

INSERT INTO branch_products (branch_id, product_id, price, stock_quantity)
SELECT 
    branch_id, 
    (SELECT id FROM products WHERE name=product_name AND brand_id=brand_id_val),
    price,
    stock
FROM (VALUES
    -- 1) Pepsi (Pepsi, brand_id=17)
    (1, 'Pepsi', 17, 45.00, 50),
    (2, 'Pepsi', 17, 45.00, 40),
    (3, 'Pepsi', 17, 42.00, 60),
    (4, 'Pepsi', 17, 42.00, 0),
    (5, 'Pepsi', 17, 40.00, 70),
    (6, 'Pepsi', 17, 40.00, 55),
    (7, 'Pepsi', 17, 43.00, 30),
    (8, 'Pepsi', 17, 43.00, 25),

    -- 2) İçim Whole Milk (brand_id=19)
    (1, 'Whole Milk', 19, 38.00, 40),
    (2, 'Whole Milk', 19, 38.00, 35),
    (3, 'Whole Milk', 19, 35.00, 0),
    (4, 'Whole Milk', 19, 35.00, 25),
    (5, 'Whole Milk', 19, 33.00, 50),
    (6, 'Whole Milk', 19, 33.00, 45),
    (7, 'Whole Milk', 19, 36.00, 20),
    (8, 'Whole Milk', 19, 36.00, 30),

    -- 3) Sütaş Whole Milk (brand_id=13)
    (1, 'Whole Milk', 13, 40.00, 35),
    (2, 'Whole Milk', 13, 40.00, 30),
    (3, 'Whole Milk', 13, 37.00, 45),
    (4, 'Whole Milk', 13, 37.00, 0),
    (5, 'Whole Milk', 13, 35.00, 55),
    (6, 'Whole Milk', 13, 35.00, 40),
    (7, 'Whole Milk', 13, 38.00, 25),
    (8, 'Whole Milk', 13, 38.00, 35),

    -- 4) Tamek Peach Juice (brand_id=12)
    (1, 'Peach Juice', 12, 52.00, 30),
    (2, 'Peach Juice', 12, 52.00, 28),
    (3, 'Peach Juice', 12, 48.00, 40),
    (4, 'Peach Juice', 12, 48.00, 35),
    (5, 'Peach Juice', 12, 46.00, 0),
    (6, 'Peach Juice', 12, 46.00, 50),
    (7, 'Peach Juice', 12, 50.00, 20),
    (8, 'Peach Juice', 12, 50.00, 0),

    -- 5) Dimes Peach Juice (brand_id=11)
    (1, 'Peach Juice', 11, 55.00, 25),
    (2, 'Peach Juice', 11, 55.00, 30),
    (3, 'Peach Juice', 11, 51.00, 0),
    (4, 'Peach Juice', 11, 51.00, 40),
    (5, 'Peach Juice', 11, 49.00, 45),
    (6, 'Peach Juice', 11, 49.00, 35),
    (7, 'Peach Juice', 11, 53.00, 25),
    (8, 'Peach Juice', 11, 53.00, 30),

    -- 6) Red Bull (brand_id=16)
    (1, 'Red Bull', 16, 75.00, 30),
    (2, 'Red Bull', 16, 75.00, 25),
    (3, 'Red Bull', 16, 72.00, 0),
    (4, 'Red Bull', 16, 72.00, 35),
    (5, 'Red Bull', 16, 70.00, 40),
    (6, 'Red Bull', 16, 70.00, 30),
    (7, 'Red Bull', 16, 73.00, 20),
    (8, 'Red Bull', 16, 73.00, 25),

    -- 7) Sırma Spring Water (brand_id=9)
    (1, 'Spring Water', 9, 8.00, 100),
    (2, 'Spring Water', 9, 8.00, 90),
    (3, 'Spring Water', 9, 7.00, 120),
    (4, 'Spring Water', 9, 7.00, 0),
    (5, 'Spring Water', 9, 6.50, 150),
    (6, 'Spring Water', 9, 6.50, 130),
    (7, 'Spring Water', 9, 7.50, 80),
    (8, 'Spring Water', 9, 7.50, 70),

    -- 8) Erikli Spring Water — 24'lü paket (brand_id=15)
    (1, 'Spring Water', 15, 165.00, 20),
    (2, 'Spring Water', 15, 165.00, 18),
    (3, 'Spring Water', 15, 155.00, 25),
    (4, 'Spring Water', 15, 155.00, 22),
    (5, 'Spring Water', 15, 145.00, 0),
    (6, 'Spring Water', 15, 145.00, 30),
    (7, 'Spring Water', 15, 158.00, 15),
    (8, 'Spring Water', 15, 158.00, 12),

    -- 9) Coca-Cola Zero (brand_id=14)
    (1, 'Coca-Cola Zero', 14, 48.00, 40),
    (2, 'Coca-Cola Zero', 14, 48.00, 0),
    (3, 'Coca-Cola Zero', 14, 52.00, 60),
    (4, 'Coca-Cola Zero', 14, 52.00, 20),
    (5, 'Coca-Cola Zero', 14, 50.00, 45),
    (6, 'Coca-Cola Zero', 14, 50.00, 0),
    (7, 'Coca-Cola Zero', 14, 54.00, 25),
    (8, 'Coca-Cola Zero', 14, 54.00, 60),

    -- 10) Pepsi Zero (brand_id=17)
    (1, 'Pepsi Zero', 17, 45.00, 35),
    (2, 'Pepsi Zero', 17, 45.00, 40),
    (3, 'Pepsi Zero', 17, 42.00, 55),
    (4, 'Pepsi Zero', 17, 42.00, 0),
    (5, 'Pepsi Zero', 17, 40.00, 60),
    (6, 'Pepsi Zero', 17, 40.00, 50),
    (7, 'Pepsi Zero', 17, 43.00, 25),
    (8, 'Pepsi Zero', 17, 43.00, 20),

    -- 11) Dimes Mixed Fruit Juice (brand_id=11)
    (1, 'Mixed Fruit Juice', 11, 58.00, 25),
    (2, 'Mixed Fruit Juice', 11, 58.00, 22),
    (3, 'Mixed Fruit Juice', 11, 54.00, 35),
    (4, 'Mixed Fruit Juice', 11, 54.00, 30),
    (5, 'Mixed Fruit Juice', 11, 52.00, 0),
    (6, 'Mixed Fruit Juice', 11, 52.00, 40),
    (7, 'Mixed Fruit Juice', 11, 56.00, 20),
    (8, 'Mixed Fruit Juice', 11, 56.00, 0),

    -- 12) Tamek Mixed Fruit Juice (brand_id=12)
    (1, 'Mixed Fruit Juice', 12, 55.00, 30),
    (2, 'Mixed Fruit Juice', 12, 55.00, 28),
    (3, 'Mixed Fruit Juice', 12, 51.00, 40),
    (4, 'Mixed Fruit Juice', 12, 51.00, 0),
    (5, 'Mixed Fruit Juice', 12, 49.00, 50),
    (6, 'Mixed Fruit Juice', 12, 49.00, 35),
    (7, 'Mixed Fruit Juice', 12, 53.00, 25),
    (8, 'Mixed Fruit Juice', 12, 53.00, 30),

    -- 13) Sprite Zero (brand_id=10)
    (1, 'Sprite Zero', 10, 48.00, 30),
    (2, 'Sprite Zero', 10, 48.00, 25),
    (3, 'Sprite Zero', 10, 50.00, 45),
    (4, 'Sprite Zero', 10, 50.00, 0),
    (5, 'Sprite Zero', 10, 52.00, 50),
    (6, 'Sprite Zero', 10, 52.00, 40),
    (7, 'Sprite Zero', 10, 54.00, 20),
    (8, 'Sprite Zero', 10, 54.00, 25),

    -- 14) Red Bull Zero (brand_id=16)
    (1, 'Red Bull Zero', 16, 75.00, 20),
    (2, 'Red Bull Zero', 16, 75.00, 18),
    (3, 'Red Bull Zero', 16, 72.00, 25),
    (4, 'Red Bull Zero', 16, 72.00, 0),
    (5, 'Red Bull Zero', 16, 70.00, 30),
    (6, 'Red Bull Zero', 16, 70.00, 22),
    (7, 'Red Bull Zero', 16, 73.00, 15),
    (8, 'Red Bull Zero', 16, 73.00, 20),

    -- 15) Fanta Zero (brand_id=18)
    (1, 'Fanta Zero', 18, 50.00, 35),
    (2, 'Fanta Zero', 18, 50.00, 30),
    (3, 'Fanta Zero', 18, 48.00, 45),
    (4, 'Fanta Zero', 18, 48.00, 0),
    (5, 'Fanta Zero', 18, 49.00, 50),
    (6, 'Fanta Zero', 18, 49.00, 35),
    (7, 'Fanta Zero', 18, 52.00, 25),
    (8, 'Fanta Zero', 18, 52.00, 30)
) AS data(branch_id, product_name, brand_id_val, price, stock);

-- Yeni 15 ürünün 8 şubede olduğunu kontrol et
SELECT p.name, b.name AS brand, COUNT(*) AS branch_count
FROM branch_products bp
JOIN products p ON bp.product_id = p.id
JOIN brands b ON p.brand_id = b.id
WHERE p.category_id = 2 AND p.id BETWEEN 40 AND 54
GROUP BY p.name, b.name
ORDER BY p.name, b.name;

-- Toplam beverage satırı sayısı
SELECT COUNT(*) AS total_beverage_rows
FROM branch_products bp
JOIN products p ON bp.product_id = p.id
WHERE p.category_id = 2;


--Su ürünlerinin tümünü gör
SELECT p.name, b.name AS brand, bp.price, br.name AS branch, bp.stock_quantity
FROM products p
JOIN brands b ON p.brand_id = b.id
JOIN beverages_details bd ON p.id = bd.product_id
JOIN branch_products bp ON p.id = bp.product_id
JOIN branches br ON bp.branch_id = br.id
WHERE bd.beverage_type IN ('Water', 'Mineral Water')
  AND bp.stock_quantity > 0
ORDER BY p.name, b.name;


-- BEVERAGE PRODUCTS IMAGE URLS

-- Beypazarı (brand_id=7)
UPDATE products SET image_url = 'https://static.ticimax.cloud/35703/uploads/urunresimleri/buyuk/beypazari-soda-cilek-200-ml-3fa7.jpg' 
WHERE name = 'Strawberry Mineral Water' AND brand_id = 7;

UPDATE products SET image_url = 'https://ardenmarket.com.tr/media/catalog/product/cache/ce320e98947e5c83f08a8e256dc8423e/1/_/1_org_zoom_75_.png' 
WHERE name = 'Lemon Mineral Water' AND brand_id = 7;

-- Coca-Cola (brand_id=14) 
UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/08011001/8011001_yan-7eca8d-1650x1650.jpg' 
WHERE name = 'Coca-Cola' AND brand_id = 14;

UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/08010202/08010202_1-493823-1650x1650.jpg' 
WHERE name = 'Coca-Cola Zero' AND brand_id = 14;

-- Sprite (brand_id=10)
UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/08030000/08030000_1-881eaf-1650x1650.png' 
WHERE name = 'Sprite' AND brand_id = 10;

UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/08010013/08010013_1-d4888a-1650x1650.jpg' 
WHERE name = 'Sprite Zero' AND brand_id = 10;

-- Fanta (brand_id=18)
UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/08020000/08020000_1-c20362-1650x1650.jpg' 
WHERE name = 'Fanta' AND brand_id = 18;

UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/08030049/08030049-186a48-1650x1650.jpg' 
WHERE name = 'Fanta Zero' AND brand_id = 18;

-- Pepsi (brand_id=17)
UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/08010023/08010023_1-ae16d1-1650x1650.jpg' 
WHERE name = 'Pepsi' AND brand_id = 17;

UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/08010026/08010026_1-78ca39-1650x1650.jpg' 
WHERE name = 'Pepsi Zero' AND brand_id = 17;

-- Whole Milk — iki farklı marka, iki ayrı UPDATE
UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/11013025/11013025_1-195cf0.jpg' 
WHERE name = 'Whole Milk' AND brand_id = 19;  -- İçim

UPDATE products SET image_url = 'https://prod-cdn-r2.sutas.market/SM_URUN_GORSELLERI(SUT_ve_KREMA)_Y_Sut-1L-19.jpg' 
WHERE name = 'Whole Milk' AND brand_id = 13;  -- Sütaş

-- Peach Juice — iki farklı marka, iki ayrı UPDATE
UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/08059113/08059113-9e2ea1-1650x1650.jpg' 
WHERE name = 'Peach Juice' AND brand_id = 12;  -- Tamek

UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/08054807/8054807_1-be4a32-1650x1650.jpg' 
WHERE name = 'Peach Juice' AND brand_id = 11;  -- Dimes

-- Red Bull (brand_id=16)
UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/08110030/08110030-a4b666-1650x1650.png' 
WHERE name = 'Red Bull' AND brand_id = 16;

UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/08110316/08110316_1-f43eb6-1650x1650.jpg' 
WHERE name = 'Red Bull Zero' AND brand_id = 16;

-- Spring Water — üç farklı marka
UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/08061029/08061029_1-221119-1650x1650.jpg' 
WHERE name = 'Spring Water' AND brand_id = 9;  -- Sırma

UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/08062201/08062201_1-debf8e-1650x1650.jpg' 
WHERE name = 'Spring Water' AND brand_id = 15;  -- Erikli

-- Mixed Fruit Juice — iki farklı marka
UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/08054914/8054914_1-99696f-1650x1650.jpg' 
WHERE name = 'Mixed Fruit Juice' AND brand_id = 11;  -- Dimes

UPDATE products SET image_url = 'https://images.migrosone.com/sanalmarket/product/08059121/08059121-7842b6-1650x1650.jpg' 
WHERE name = 'Mixed Fruit Juice' AND brand_id = 12;  -- Tamek

SELECT p.id, p.name, b.name AS brand, 
       CASE WHEN p.image_url IS NULL THEN '❌ EKSİK' ELSE '✅ Var' END AS gorsel_durum
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE p.category_id = 2
ORDER BY p.id;

SELECT p.id, p.name, bd.beverage_type, bd.energy_kcal, bd.sugar_g
FROM products p
JOIN beverages_details bd ON p.id = bd.product_id
ORDER BY p.id;

-- Beypazarı Limonlu id=8
INSERT INTO branch_products (branch_id, product_id, price, stock_quantity) VALUES
(1, 8, 15.00, 50),  -- Migros Kadıköy
(2, 8, 15.00, 0),  -- Migros Beşiktaş
(3, 8, 13.00, 30),  -- A101 Üsküdar
(4, 8, 13.00, 10),  -- A101 Şişli
(5, 8, 12.00, 60),  -- BIM Ataşehir
(6, 8, 12.00, 20),  -- BIM Bakırköy
(7, 8, 14.00, 25),  -- SOK Beyoğlu
(8, 8, 14.00, 0),  -- SOK Maltepe

-- Beypazarı Çilekli id=9
(1, 9, 15.00, 40),
(2, 9, 15.00, 35),
(3, 9, 13.00, 0),
(4, 9, 13.00, 30),
(5, 9, 12.00, 0),
(6, 9, 12.00, 40),
(7, 9, 14.00, 10),
(8, 9, 14.00, 100),

-- Coca-Cola id=10
(1, 10, 48.00, 0),
(2, 10, 48.00, 55),
(3, 10, 52.00, 70),
(4, 10, 52.00, 25),
(5, 10, 50.00, 40),
(6, 10, 50.00, 0),
(7, 10, 54.00, 30),
(8, 10, 54.00, 70),

-- Sprite id=11
(1, 11, 48.00, 0),
(2, 11, 48.00, 35),
(3, 11, 50.00, 50),
(4, 11, 50.00, 0),
(5, 11, 52.00, 60),
(6, 11, 52.00, 55),
(7, 11, 54.00, 30),
(8, 11, 54.00, 35),

-- Fanta id=12
(1, 12, 50.00, 40),
(2, 12, 50.00, 35),
(3, 12, 48.00, 50),
(4, 12, 48.00, 0),
(5, 12, 49.00, 50),
(6, 12, 49.00, 40),
(7, 12, 52.00, 90),
(8, 12, 52.00, 0);

SELECT * FROM suppliers;
SELECT * FROM customers;
SELECT * FROM branches;
SELECT * FROM brands ORDER BY id;
SELECT id, name, supplier_id FROM branches;
SELECT * FROM brands;
SELECT * FROM products;
SELECT * FROM beverages_details WHERE product_id = 16;
SELECT * FROM snack_details WHERE product_id = 1; --eti cin limonlu ekledim, pınar su ekledim
SELECT * FROM branch_products WHERE product_id = 16;
SELECT * FROM products ORDER BY id DESC LIMIT 5;

--ürünü silmek istersen bu sırayla sil
--DELETE FROM branch_products WHERE product_id = ?;
--DELETE FROM snack_details WHERE product_id = ?;
--DELETE FROM products WHERE id = ?;
--Sıra önemli — foreign keyler yüzünden önce branch_products ve snack_details, sonra products.

SELECT * FROM products WHERE name = 'Eti Burçak';
SELECT sd.* FROM snack_details sd 
JOIN products p ON p.id = sd.product_id 
WHERE p.name = 'Eti Burçak';

BEGIN;

-- 1. Önce productsa ekle, yeni id'yi geçici değişkende sakla
WITH new_product AS (
    INSERT INTO products (name, category_id, brand_id) 
    VALUES ('Eti Burçak', 1, 2)
    RETURNING id
)
-- 2. snack_details'a ekle yeni id'yi otomatik kullan
INSERT INTO snack_details (
    product_id, snacks_type, energy_kcal, protein_g, sugar_g, 
    oil_type, packaging, allergens, 
    is_dark_chocolate, is_locally_produced, is_imported
)
SELECT 
    id, 'Biscuit', 550, 6.00, 38.00,
    ARRAY['Sunflower Oil', 'Canola Oil', 'Palm Oil', 'Cotton Oil'],
    'Single Product',
    ARRAY['Gluten', 'Sulfide', 'Halal', 'Milk product', 'Egg', 'Soy product', 'Sesame', 'Nut'],
    FALSE, TRUE, FALSE
FROM new_product;

-- 3. branch_products için yeni id'yi öğren
INSERT INTO branch_products (branch_id, product_id, price, stock_quantity)
SELECT branch_id, p.id, price, stock_quantity
FROM (VALUES
    (1, 27.00, 50),
    (2, 27.00, 40),
    (3, 25.00, 0),
    (4, 25.00, 35),
    (5, 24.00, 0),
    (6, 24.00, 40),
    (7, 26.00, 25),
    (8, 26.00, 30)
) AS data(branch_id, price, stock_quantity)
CROSS JOIN products p
WHERE p.name = 'Eti Burçak';

COMMIT;

SELECT id, name FROM products WHERE name = 'Eti Burçak';
SELECT * FROM snack_details WHERE product_id = (SELECT id FROM products WHERE name = 'Eti Burçak');
SELECT * FROM branch_products WHERE product_id = (SELECT id FROM products WHERE name = 'Eti Burçak');


SELECT b.id, b.name 
FROM brands b
JOIN products p ON p.brand_id = b.id
JOIN categories c ON p.category_id = c.id
WHERE c.name = 'Beverages';
SELECT id, name FROM brands WHERE name = 'Pınar';


SELECT * FROM branch_products
SELECT * FROM snack_details;

SELECT * FROM suppliers;
SELECT * FROM customers;
SELECT * FROM branches;
SELECT * FROM brands ORDER BY id;
SELECT id, name, supplier_id FROM branches;
SELECT * FROM brands;
SELECT * FROM products;
Select*from categories;


INSERT INTO categories (name) VALUES ('Personal Care');

INSERT INTO brands (name) VALUES 
('Nivea'),
('Dove'),
('Axe'),
('Gillette'),
('Palmolive'),
('Elidor'),
('Colgate'),
('L''Oreal'),
('Garnier'),
('Rexona');
INSERT INTO brands (name) VALUES ('Signal');

SELECT id, name FROM brands ORDER BY id;

CREATE TABLE personal_care_details (
    product_id          INT PRIMARY KEY REFERENCES products(id),
    cosmetics_type      VARCHAR(50),        
    skin_type           TEXT[],             
    targets             TEXT[],             
    active_ingredients  TEXT[],             
    allergens           TEXT[],              
    spf                 VARCHAR(20),        
    product_form        VARCHAR(30),        
    volume_ml           INT,                
    is_locally_produced BOOLEAN DEFAULT FALSE
);
ALTER TABLE personal_care_details 
ADD COLUMN product_subtype VARCHAR(50);

SELECT * FROM personal_care_details;
SELECT id, name FROM brands WHERE name IN ('Nivea','Dove','Axe','Gillette','Palmolive','Elidor','Colgate','L''Oreal','Garnier','Rexona');
SELECT MAX(id) FROM products;
SELECT id, name FROM brands ORDER BY id;



-- PERSONAL CARE ÜRÜNLERİ (20 ürün, 10 subtype × 2 marka)

--SKIN CARE - FACE CREAM

-- 1) Nivea Soft Krem (Face Cream)
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Soft Face Cream', 3, 23, 'https://images.migrosone.com/sanalmarket/product/04302510/04302510-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Soft Face Cream' AND brand_id=23),
    'Skin Care', 'Face Cream',
    ARRAY['Dry', 'Sensitive'],
    ARRAY['Hydrating / Moisturizing'],
    ARRAY['Hyaluronic Acid'],
    ARRAY['Paraben-Free'],
    NULL, 'Cream / Balm', 100, FALSE
);

-- 2) Garnier Vitamin C Yüz Kremi (Face Cream)
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Vitamin C Face Cream', 3, 31, 'https://images.migrosone.com/sanalmarket/product/04047090/04047090-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Vitamin C Face Cream' AND brand_id=31),
    'Skin Care', 'Face Cream',
    ARRAY['Combination', 'Oily', 'Acne-Prone'],
    ARRAY['Anti-Dark Spot / Brightening', 'Anti-Wrinkle'],
    ARRAY['C vitamin', 'Niacinamide'],
    ARRAY['Paraben-Free', 'Silicone-Free'],
    NULL, 'Cream / Balm', 50, FALSE
);

--SKIN CARE - HAND CREAM

-- 3) Nivea Hand Cream
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Nourishing Hand Cream', 3, 23, 'https://images.migrosone.com/sanalmarket/product/04302520/04302520-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Nourishing Hand Cream' AND brand_id=23),
    'Skin Care', 'Hand Cream',
    ARRAY['Dry', 'Sensitive'],
    ARRAY['Hydrating / Moisturizing'],
    ARRAY['Hyaluronic Acid'],
    ARRAY['Paraben-Free'],
    NULL, 'Cream / Balm', 75, FALSE
);

-- 4) Dove Hand Cream
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Pro Age Hand Cream', 3, 24, 'https://images.migrosone.com/sanalmarket/product/04046290/04046290-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Pro Age Hand Cream' AND brand_id=24),
    'Skin Care', 'Hand Cream',
    ARRAY['Dry', 'Sensitive', 'Combination'],
    ARRAY['Hydrating / Moisturizing', 'Anti-Wrinkle'],
    ARRAY['Niacinamide'],
    ARRAY['Paraben-Free'],
    NULL, 'Cream / Balm', 75, FALSE
);

--HAIR CARE - SHAMPOO

-- 5) Elidor Shampoo
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Onarıcı Bakım Şampuanı', 3, 28, 'https://images.migrosone.com/sanalmarket/product/04035130/04035130-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Onarıcı Bakım Şampuanı' AND brand_id=28),
    'Hair Care', 'Shampoo',
    ARRAY['Dry'],
    ARRAY['Hydrating / Moisturizing'],
    ARRAY['Collagen'],
    ARRAY['Sulfate-Free (SLS/SLES-Free)'],
    NULL, 'Gel / Foam', 500, TRUE
);

-- 6) L'Oreal Shampoo
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Elseve Color Vive Şampuan', 3, 30, 'https://images.migrosone.com/sanalmarket/product/04031450/04031450-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Elseve Color Vive Şampuan' AND brand_id=30),
    'Hair Care', 'Shampoo',
    ARRAY['Dry', 'Combination'],
    ARRAY['Hydrating / Moisturizing'],
    ARRAY['Niacinamide'],
    ARRAY['Paraben-Free'],
    NULL, 'Gel / Foam', 400, FALSE
);

-- HAIR CARE - CONDITIONER 

-- 7) Elidor Conditioner
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Onarıcı Bakım Saç Kremi', 3, 28, 'https://images.migrosone.com/sanalmarket/product/04035140/04035140-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Onarıcı Bakım Saç Kremi' AND brand_id=28),
    'Hair Care', 'Conditioner',
    ARRAY['Dry'],
    ARRAY['Hydrating / Moisturizing'],
    ARRAY['Collagen'],
    ARRAY['Paraben-Free'],
    NULL, 'Cream / Balm', 200, TRUE
);

-- 8) L'Oreal Conditioner
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Elseve Color Vive Saç Kremi', 3, 30, 'https://images.migrosone.com/sanalmarket/product/04031460/04031460-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Elseve Color Vive Saç Kremi' AND brand_id=30),
    'Hair Care', 'Conditioner',
    ARRAY['Dry', 'Combination'],
    ARRAY['Hydrating / Moisturizing'],
    ARRAY['Niacinamide'],
    ARRAY['Paraben-Free', 'Silicone-Free'],
    NULL, 'Cream / Balm', 200, FALSE
);

-- BODY CARE - BODY LOTION

-- 9) Palmolive Body Lotion
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Naturals Body Lotion', 3, 27, 'https://images.migrosone.com/sanalmarket/product/04031900/04031900-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Naturals Body Lotion' AND brand_id=27),
    'Body Care', 'Body Lotion',
    ARRAY['Dry', 'Sensitive'],
    ARRAY['Hydrating / Moisturizing'],
    ARRAY[]::TEXT[],
    ARRAY['Paraben-Free'],
    NULL, 'Cream / Balm', 250, FALSE
);

-- 10) Nivea Body Lotion
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Nourishing Body Lotion', 3, 23, 'https://images.migrosone.com/sanalmarket/product/04302530/04302530-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Nourishing Body Lotion' AND brand_id=23),
    'Body Care', 'Body Lotion',
    ARRAY['Dry', 'Sensitive'],
    ARRAY['Hydrating / Moisturizing'],
    ARRAY['Hyaluronic Acid'],
    ARRAY['Paraben-Free'],
    NULL, 'Cream / Balm', 400, FALSE
);

-- BODY CARE - SOAP 

-- 11) Dove Soap
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Beauty Cream Bar', 3, 24, 'https://images.migrosone.com/sanalmarket/product/04046270/04046270-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Beauty Cream Bar' AND brand_id=24),
    'Body Care', 'Soap',
    ARRAY['Sensitive', 'Dry'],
    ARRAY['Hydrating / Moisturizing'],
    ARRAY[]::TEXT[],
    ARRAY['Paraben-Free', 'Phthalate-Free'],
    NULL, 'Powder / Stick', NULL, FALSE
);

-- 12) Palmolive Soap
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Naturals Olive Soap', 3, 27, 'https://images.migrosone.com/sanalmarket/product/04031910/04031910-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Naturals Olive Soap' AND brand_id=27),
    'Body Care', 'Soap',
    ARRAY['Sensitive', 'Dry', 'Combination'],
    ARRAY['Hydrating / Moisturizing'],
    ARRAY[]::TEXT[],
    ARRAY['Paraben-Free'],
    NULL, 'Powder / Stick', NULL, FALSE
);

-- ROLLON & DEODORANT - DEODORANT 

-- 13) Axe Deodorant
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Dark Temptation Deodorant', 3, 25, 'https://images.migrosone.com/sanalmarket/product/04035021/04035021-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Dark Temptation Deodorant' AND brand_id=25),
    'Rollon & Deodorant', 'Deodorant',
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    ARRAY['Alcohol-Free (Drying Alcohol)'],
    NULL, 'Powder / Stick', 150, FALSE
);

-- 14) Rexona Deodorant
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Cool Wave Deodorant', 3, 32, 'https://images.migrosone.com/sanalmarket/product/04039088/04039088-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Cool Wave Deodorant' AND brand_id=32),
    'Rollon & Deodorant', 'Deodorant',
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    ARRAY['Paraben-Free'],
    NULL, 'Powder / Stick', 150, FALSE
);

-- ROLLON & DEODORANT - ROLLON

-- 15) Rexona Rollon
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Cotton Dry Rollon', 3, 32, 'https://images.migrosone.com/sanalmarket/product/04039090/04039090-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Cotton Dry Rollon' AND brand_id=32),
    'Rollon & Deodorant', 'Rollon',
    ARRAY['Sensitive'],
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    ARRAY['Alcohol-Free (Drying Alcohol)', 'Paraben-Free'],
    NULL, 'Serum / Liquid', 50, FALSE
);

-- 16) Dove Rollon
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Original Care Rollon', 3, 24, 'https://images.migrosone.com/sanalmarket/product/04046280/04046280-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Original Care Rollon' AND brand_id=24),
    'Rollon & Deodorant', 'Rollon',
    ARRAY['Sensitive', 'Dry'],
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    ARRAY['Alcohol-Free (Drying Alcohol)', 'Paraben-Free'],
    NULL, 'Serum / Liquid', 50, FALSE
);

-- SUN CARE - SUNSCREEN

-- 17) Nivea Sunscreen
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Sun Protect SPF 50+', 3, 23, 'https://images.migrosone.com/sanalmarket/product/04014530/04014530-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Sun Protect SPF 50+' AND brand_id=23),
    'Sun Care', 'Sunscreen',
    ARRAY['Sensitive', 'Oily', 'Dry', 'Combination'],
    ARRAY['Hydrating / Moisturizing'],
    ARRAY['Hyaluronic Acid'],
    ARRAY['Paraben-Free', 'Fragrance-Free'],
    'SPF 50+', 'Cream / Balm', 200, FALSE
);

-- 18) Garnier Sunscreen
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Ambre Solaire SPF 30', 3, 31, 'https://images.migrosone.com/sanalmarket/product/04039780/04039780-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Ambre Solaire SPF 30' AND brand_id=31),
    'Sun Care', 'Sunscreen',
    ARRAY['Oily', 'Combination', 'Sensitive'],
    ARRAY['Hydrating / Moisturizing'],
    ARRAY['C vitamin'],
    ARRAY['Paraben-Free', 'Alcohol-Free (Drying Alcohol)'],
    'SPF 30', 'Cream / Balm', 200, FALSE
);

--  HYGIENE PRODUCTS - TOOTHPASTE

-- 19) Colgate Toothpaste
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Total Diş Macunu', 3, 29, 'https://images.migrosone.com/sanalmarket/product/04003250/04003250-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Total Diş Macunu' AND brand_id=29),
    'Hygiene products', 'Toothpaste',
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    ARRAY['Paraben-Free'],
    NULL, 'Gel / Foam', 100, FALSE
);

-- 20) Signal Toothpaste
INSERT INTO products (name, category_id, brand_id, image_url) VALUES 
('Cavity Protection Diş Macunu', 3, 33, 'https://images.migrosone.com/sanalmarket/product/04003260/04003260-1-1650x1650.jpg');

INSERT INTO personal_care_details 
(product_id, cosmetics_type, product_subtype, skin_type, targets, active_ingredients, allergens, spf, product_form, volume_ml, is_locally_produced)
VALUES (
    (SELECT id FROM products WHERE name='Cavity Protection Diş Macunu' AND brand_id=33),
    'Hygiene products', 'Toothpaste',
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    ARRAY['Paraben-Free'],
    NULL, 'Gel / Foam', 100, FALSE
);


-- PERSONAL CARE - ŞUBELERE DAĞITIM 

INSERT INTO branch_products (branch_id, product_id, price, stock_quantity)
SELECT 
    branch_id, 
    (SELECT id FROM products WHERE name=product_name AND brand_id=brand_id_val),
    price,
    stock
FROM (VALUES
    -- 1) Soft Face Cream (Nivea, brand_id=23)
    (1, 'Soft Face Cream', 23, 145.00, 30),
    (2, 'Soft Face Cream', 23, 145.00, 25),
    (3, 'Soft Face Cream', 23, 139.00, 40),
    (4, 'Soft Face Cream', 23, 139.00, 0),
    (5, 'Soft Face Cream', 23, 135.00, 50),
    (6, 'Soft Face Cream', 23, 135.00, 35),
    (7, 'Soft Face Cream', 23, 142.00, 20),
    (8, 'Soft Face Cream', 23, 142.00, 15),

    -- 2) Vitamin C Face Cream (Garnier, brand_id=31)
    (1, 'Vitamin C Face Cream', 31, 320.00, 10),
    (2, 'Vitamin C Face Cream', 31, 320.00, 12),
    (3, 'Vitamin C Face Cream', 31, 305.00, 0),
    (4, 'Vitamin C Face Cream', 31, 305.00, 15),
    (5, 'Vitamin C Face Cream', 31, 295.00, 20),
    (6, 'Vitamin C Face Cream', 31, 295.00, 0),
    (7, 'Vitamin C Face Cream', 31, 310.00, 8),
    (8, 'Vitamin C Face Cream', 31, 310.00, 10),

    -- 3) Nourishing Hand Cream (Nivea, brand_id=23)
    (1, 'Nourishing Hand Cream', 23, 89.00, 40),
    (2, 'Nourishing Hand Cream', 23, 89.00, 35),
    (3, 'Nourishing Hand Cream', 23, 85.00, 50),
    (4, 'Nourishing Hand Cream', 23, 85.00, 0),
    (5, 'Nourishing Hand Cream', 23, 82.00, 60),
    (6, 'Nourishing Hand Cream', 23, 82.00, 45),
    (7, 'Nourishing Hand Cream', 23, 87.00, 25),
    (8, 'Nourishing Hand Cream', 23, 87.00, 30),

    -- 4) Pro Age Hand Cream (Dove, brand_id=24)
    (1, 'Pro Age Hand Cream', 24, 95.00, 25),
    (2, 'Pro Age Hand Cream', 24, 95.00, 20),
    (3, 'Pro Age Hand Cream', 24, 90.00, 0),
    (4, 'Pro Age Hand Cream', 24, 90.00, 30),
    (5, 'Pro Age Hand Cream', 24, 88.00, 35),
    (6, 'Pro Age Hand Cream', 24, 88.00, 25),
    (7, 'Pro Age Hand Cream', 24, 92.00, 0),
    (8, 'Pro Age Hand Cream', 24, 92.00, 15),

    -- 5) Onarıcı Bakım Şampuanı (Elidor, brand_id=28)
    (1, 'Onarıcı Bakım Şampuanı', 28, 145.00, 40),
    (2, 'Onarıcı Bakım Şampuanı', 28, 145.00, 30),
    (3, 'Onarıcı Bakım Şampuanı', 28, 139.00, 25),
    (4, 'Onarıcı Bakım Şampuanı', 28, 139.00, 20),
    (5, 'Onarıcı Bakım Şampuanı', 28, 135.00, 0),
    (6, 'Onarıcı Bakım Şampuanı', 28, 135.00, 50),
    (7, 'Onarıcı Bakım Şampuanı', 28, 142.00, 30),
    (8, 'Onarıcı Bakım Şampuanı', 28, 142.00, 35),

    -- 6) Elseve Color Vive Şampuan (L'Oreal, brand_id=30)
    (1, 'Elseve Color Vive Şampuan', 30, 175.00, 25),
    (2, 'Elseve Color Vive Şampuan', 30, 175.00, 20),
    (3, 'Elseve Color Vive Şampuan', 30, 165.00, 30),
    (4, 'Elseve Color Vive Şampuan', 30, 165.00, 0),
    (5, 'Elseve Color Vive Şampuan', 30, 160.00, 35),
    (6, 'Elseve Color Vive Şampuan', 30, 160.00, 25),
    (7, 'Elseve Color Vive Şampuan', 30, 170.00, 0),
    (8, 'Elseve Color Vive Şampuan', 30, 170.00, 15),

    -- 7) Onarıcı Bakım Saç Kremi (Elidor, brand_id=28)
    (1, 'Onarıcı Bakım Saç Kremi', 28, 125.00, 35),
    (2, 'Onarıcı Bakım Saç Kremi', 28, 125.00, 30),
    (3, 'Onarıcı Bakım Saç Kremi', 28, 119.00, 0),
    (4, 'Onarıcı Bakım Saç Kremi', 28, 119.00, 25),
    (5, 'Onarıcı Bakım Saç Kremi', 28, 115.00, 40),
    (6, 'Onarıcı Bakım Saç Kremi', 28, 115.00, 30),
    (7, 'Onarıcı Bakım Saç Kremi', 28, 122.00, 20),
    (8, 'Onarıcı Bakım Saç Kremi', 28, 122.00, 25),

    -- 8) Elseve Color Vive Saç Kremi (L'Oreal, brand_id=30)
    (1, 'Elseve Color Vive Saç Kremi', 30, 165.00, 20),
    (2, 'Elseve Color Vive Saç Kremi', 30, 165.00, 18),
    (3, 'Elseve Color Vive Saç Kremi', 30, 155.00, 25),
    (4, 'Elseve Color Vive Saç Kremi', 30, 155.00, 0),
    (5, 'Elseve Color Vive Saç Kremi', 30, 150.00, 30),
    (6, 'Elseve Color Vive Saç Kremi', 30, 150.00, 22),
    (7, 'Elseve Color Vive Saç Kremi', 30, 160.00, 0),
    (8, 'Elseve Color Vive Saç Kremi', 30, 160.00, 12),

    -- 9) Naturals Body Lotion (Palmolive, brand_id=27)
    (1, 'Naturals Body Lotion', 27, 75.00, 35),
    (2, 'Naturals Body Lotion', 27, 75.00, 30),
    (3, 'Naturals Body Lotion', 27, 70.00, 0),
    (4, 'Naturals Body Lotion', 27, 70.00, 25),
    (5, 'Naturals Body Lotion', 27, 68.00, 40),
    (6, 'Naturals Body Lotion', 27, 68.00, 35),
    (7, 'Naturals Body Lotion', 27, 72.00, 20),
    (8, 'Naturals Body Lotion', 27, 72.00, 0),

    -- 10) Nourishing Body Lotion (Nivea, brand_id=23)
    (1, 'Nourishing Body Lotion', 23, 110.00, 25),
    (2, 'Nourishing Body Lotion', 23, 110.00, 30),
    (3, 'Nourishing Body Lotion', 23, 105.00, 40),
    (4, 'Nourishing Body Lotion', 23, 105.00, 35),
    (5, 'Nourishing Body Lotion', 23, 100.00, 0),
    (6, 'Nourishing Body Lotion', 23, 100.00, 50),
    (7, 'Nourishing Body Lotion', 23, 108.00, 20),
    (8, 'Nourishing Body Lotion', 23, 108.00, 25),

    -- 11) Beauty Cream Bar (Dove, brand_id=24)
    (1, 'Beauty Cream Bar', 24, 35.00, 60),
    (2, 'Beauty Cream Bar', 24, 35.00, 55),
    (3, 'Beauty Cream Bar', 24, 32.00, 70),
    (4, 'Beauty Cream Bar', 24, 32.00, 0),
    (5, 'Beauty Cream Bar', 24, 30.00, 80),
    (6, 'Beauty Cream Bar', 24, 30.00, 75),
    (7, 'Beauty Cream Bar', 24, 33.00, 40),
    (8, 'Beauty Cream Bar', 24, 33.00, 45),

    -- 12) Naturals Olive Soap (Palmolive, brand_id=27)
    (1, 'Naturals Olive Soap', 27, 28.00, 50),
    (2, 'Naturals Olive Soap', 27, 28.00, 45),
    (3, 'Naturals Olive Soap', 27, 25.00, 60),
    (4, 'Naturals Olive Soap', 27, 25.00, 55),
    (5, 'Naturals Olive Soap', 27, 24.00, 0),
    (6, 'Naturals Olive Soap', 27, 24.00, 70),
    (7, 'Naturals Olive Soap', 27, 26.00, 30),
    (8, 'Naturals Olive Soap', 27, 26.00, 0),

    -- 13) Dark Temptation Deodorant (Axe, brand_id=25)
    (1, 'Dark Temptation Deodorant', 25, 95.00, 25),
    (2, 'Dark Temptation Deodorant', 25, 95.00, 30),
    (3, 'Dark Temptation Deodorant', 25, 90.00, 35),
    (4, 'Dark Temptation Deodorant', 25, 90.00, 0),
    (5, 'Dark Temptation Deodorant', 25, 88.00, 40),
    (6, 'Dark Temptation Deodorant', 25, 88.00, 30),
    (7, 'Dark Temptation Deodorant', 25, 92.00, 25),
    (8, 'Dark Temptation Deodorant', 25, 92.00, 20),

    -- 14) Cool Wave Deodorant (Rexona, brand_id=32)
    (1, 'Cool Wave Deodorant', 32, 85.00, 30),
    (2, 'Cool Wave Deodorant', 32, 85.00, 25),
    (3, 'Cool Wave Deodorant', 32, 80.00, 40),
    (4, 'Cool Wave Deodorant', 32, 80.00, 35),
    (5, 'Cool Wave Deodorant', 32, 78.00, 0),
    (6, 'Cool Wave Deodorant', 32, 78.00, 45),
    (7, 'Cool Wave Deodorant', 32, 82.00, 25),
    (8, 'Cool Wave Deodorant', 32, 82.00, 30),

    -- 15) Cotton Dry Rollon (Rexona, brand_id=32)
    (1, 'Cotton Dry Rollon', 32, 65.00, 40),
    (2, 'Cotton Dry Rollon', 32, 65.00, 35),
    (3, 'Cotton Dry Rollon', 32, 60.00, 0),
    (4, 'Cotton Dry Rollon', 32, 60.00, 45),
    (5, 'Cotton Dry Rollon', 32, 58.00, 50),
    (6, 'Cotton Dry Rollon', 32, 58.00, 40),
    (7, 'Cotton Dry Rollon', 32, 62.00, 25),
    (8, 'Cotton Dry Rollon', 32, 62.00, 30),

    -- 16) Original Care Rollon (Dove, brand_id=24)
    (1, 'Original Care Rollon', 24, 72.00, 30),
    (2, 'Original Care Rollon', 24, 72.00, 28),
    (3, 'Original Care Rollon', 24, 68.00, 35),
    (4, 'Original Care Rollon', 24, 68.00, 0),
    (5, 'Original Care Rollon', 24, 65.00, 40),
    (6, 'Original Care Rollon', 24, 65.00, 35),
    (7, 'Original Care Rollon', 24, 70.00, 20),
    (8, 'Original Care Rollon', 24, 70.00, 25),

    -- 17) Sun Protect SPF 50+ (Nivea, brand_id=23)
    (1, 'Sun Protect SPF 50+', 23, 285.00, 15),
    (2, 'Sun Protect SPF 50+', 23, 285.00, 20),
    (3, 'Sun Protect SPF 50+', 23, 270.00, 0),
    (4, 'Sun Protect SPF 50+', 23, 270.00, 25),
    (5, 'Sun Protect SPF 50+', 23, 265.00, 30),
    (6, 'Sun Protect SPF 50+', 23, 265.00, 20),
    (7, 'Sun Protect SPF 50+', 23, 275.00, 15),
    (8, 'Sun Protect SPF 50+', 23, 275.00, 0),

    -- 18) Ambre Solaire SPF 30 (Garnier, brand_id=31)
    (1, 'Ambre Solaire SPF 30', 31, 245.00, 20),
    (2, 'Ambre Solaire SPF 30', 31, 245.00, 18),
    (3, 'Ambre Solaire SPF 30', 31, 230.00, 25),
    (4, 'Ambre Solaire SPF 30', 31, 230.00, 0),
    (5, 'Ambre Solaire SPF 30', 31, 225.00, 30),
    (6, 'Ambre Solaire SPF 30', 31, 225.00, 25),
    (7, 'Ambre Solaire SPF 30', 31, 235.00, 15),
    (8, 'Ambre Solaire SPF 30', 31, 235.00, 20),

    -- 19) Total Diş Macunu (Colgate, brand_id=29)
    (1, 'Total Diş Macunu', 29, 65.00, 50),
    (2, 'Total Diş Macunu', 29, 65.00, 45),
    (3, 'Total Diş Macunu', 29, 60.00, 60),
    (4, 'Total Diş Macunu', 29, 60.00, 0),
    (5, 'Total Diş Macunu', 29, 58.00, 70),
    (6, 'Total Diş Macunu', 29, 58.00, 65),
    (7, 'Total Diş Macunu', 29, 62.00, 35),
    (8, 'Total Diş Macunu', 29, 62.00, 40),

    -- 20) Cavity Protection Diş Macunu (Signal, brand_id=33)
    (1, 'Cavity Protection Diş Macunu', 33, 58.00, 55),
    (2, 'Cavity Protection Diş Macunu', 33, 58.00, 50),
    (3, 'Cavity Protection Diş Macunu', 33, 54.00, 65),
    (4, 'Cavity Protection Diş Macunu', 33, 54.00, 60),
    (5, 'Cavity Protection Diş Macunu', 33, 52.00, 0),
    (6, 'Cavity Protection Diş Macunu', 33, 52.00, 75),
    (7, 'Cavity Protection Diş Macunu', 33, 56.00, 40),
    (8, 'Cavity Protection Diş Macunu', 33, 56.00, 45)
) AS data(branch_id, product_name, brand_id_val, price, stock);

SELECT COUNT(*) AS toplam_satir
FROM branch_products bp
JOIN products p ON bp.product_id = p.id
WHERE p.category_id = 3;

SELECT p.name, COUNT(*) AS sube_sayisi
FROM branch_products bp
JOIN products p ON bp.product_id = p.id
WHERE p.category_id = 3
GROUP BY p.name
ORDER BY p.name;

SELECT p.name, b.name AS marka, bp.price, br.name AS sube, bp.stock_quantity
FROM products p
JOIN brands b ON p.brand_id = b.id
JOIN personal_care_details pcd ON p.id = pcd.product_id
JOIN branch_products bp ON p.id = bp.product_id
JOIN branches br ON bp.branch_id = br.id
WHERE pcd.cosmetics_type = 'Skin Care' 
  AND pcd.product_subtype = 'Hand Cream'
  AND bp.stock_quantity > 0
ORDER BY p.name, bp.price;

Select * from customers;
select*from beverages_details;

-- Test ürününü ve ilişkili kayıtları sil
DELETE FROM branch_products WHERE product_id = 18;
DELETE FROM beverages_details WHERE product_id = 18;
DELETE FROM products WHERE id = 18;

-- Test markasını sil
DELETE FROM brands WHERE name = 'Test';

-- Doğrulama
SELECT * FROM products WHERE name LIKE '%Test%';

-- 1) Önce şubedeki kaydı sil (foreign key bağlantısı yüzünden önce bu)
DELETE FROM branch_products WHERE product_id = 17;

-- 2) Sonra snack detayı
DELETE FROM snack_details WHERE product_id = 17;

-- 3) En son ürünün kendisini
DELETE FROM products WHERE id = 17;



DELETE FROM brands WHERE name = 'Test';


-- Pınar Su detayları
SELECT p.id, p.name, b.name AS marka, c.name AS kategori
FROM products p
JOIN brands b ON p.brand_id = b.id
JOIN categories c ON p.category_id = c.id
WHERE p.id = 16;

-- Şubelerde var mı?
SELECT COUNT(*) AS sube_kaydi_sayisi
FROM branch_products WHERE product_id = 16;

DELETE FROM branch_products WHERE product_id = 17;

DELETE FROM snack_details WHERE product_id = 17;

DELETE FROM products WHERE id = 17;

SELECT COUNT(*) AS test_marka_kullanan_urun_sayisi
FROM products 
WHERE brand_id = (SELECT id FROM brands WHERE name = 'Test');

DELETE FROM brands WHERE name = 'Test';

SELECT * FROM products WHERE name LIKE '%Test%';
SELECT * FROM brands WHERE name = 'Test';

SELECT * FROM products;
SELECT * FROM branch_products;
SELECT * FROM beverage_details;
SELECT * FROM branches;
SELECT * FROM brands;
SELECT * FROM categories;
SELECT * FROM suppliers;
SELECT * FROM customers;
SELECT * FROM personal_care_details;
SELECT * FROM snack_details;
Select*from favorites;


-- Favoriler Tablosu

CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id),
    branch_product_id INT REFERENCES branch_products(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (customer_id, branch_product_id)
);

-- Supplier Mail destek tablosu
CREATE TABLE support_messages (
    id          SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES suppliers(id),
    subject     VARCHAR(150) NOT NULL,
    category    VARCHAR(50),
    message     TEXT NOT NULL,
    status      VARCHAR(20) DEFAULT 'open',
    created_at  TIMESTAMP DEFAULT NOW()
);

-- customer mail destek tablosu
CREATE TABLE customer_messages (
    id          SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id),
    subject     VARCHAR(150) NOT NULL,
    category    VARCHAR(50),
    message     TEXT NOT NULL,
    status      VARCHAR(20) DEFAULT 'open',
    created_at  TIMESTAMP DEFAULT NOW()
);

select*from products;
-- SKIN CARE - FACE CREAM
UPDATE products SET image_url='https://images.migrosone.com/macrocenter/product/35300407/35300407-286592.jpg' WHERE name='Soft Face Cream' AND brand_id=23;
UPDATE products SET image_url='https://images.migrosone.com/sanalmarket/product/35406502/35406502_1-406c9a-1650x1650.jpg' WHERE name='Vitamin C Face Cream' AND brand_id=31;
-- SKIN CARE - HAND CREAM
UPDATE products SET image_url='https://assets.beiersdorf.com/-/media/images/7/8/9/a/0025c9bfa75c4e5aa3ef311d1c98d1ac-web_1010x1180_transparent_png.png?ctx=ca&mw=768&hash=e77a647debf657ced9e8603b57372121' WHERE name='Nourishing Hand Cream' AND brand_id=23;
UPDATE products SET image_url='https://m.media-amazon.com/images/I/716jDkgNCHL.jpg' WHERE name='Pro Age Hand Cream' AND brand_id=24;
-- HAIR CARE - SHAMPOO
UPDATE products SET image_url='https://cdn.dsmcdn.com/mnresize/420/620/ty1677/prod/QC/20250515/14/757698bc-0043-3faf-8b2a-55a0332ed917/1_org_zoom.jpg' WHERE name='Elseve Color Vive Şampuan' AND brand_id=30;
UPDATE products SET image_url='https://images.migrosone.com/sanalmarket/product/34266101/34266101_1-7a046f-1650x1650.jpg' WHERE name='Onarıcı Bakım Şampuanı' AND brand_id=28;
-- HAIR CARE - CONDITIONER
UPDATE products SET image_url='https://images.migrosone.com/macrocenter/product/34346326/34346326-f2a91a.jpg' WHERE name='Onarıcı Bakım Saç Kremi' AND brand_id=28;
UPDATE products SET image_url='https://images.migrosone.com/sanalmarket/product/34340922/34340922-06c3bc-1650x1650.jpg' WHERE name='Elseve Color Vive Saç Kremi' AND brand_id=30;
-- BODY CARE - BODY LOTION
UPDATE products SET image_url='https://cdn-image.getir.com/market/product/54739abf-f9e5-4863-8d1b-74a48a0d8d26.jpg' WHERE name='Naturals Body Lotion' AND brand_id=27;
UPDATE products SET image_url='https://cd3c14-whites.akinoncloudcdn.com/products/2026/05/18/14090/cbdef642-32ae-4f28-8b26-a71ed5d2dcfe_size3840x3840_cropCenter.jpg' WHERE name='Nourishing Body Lotion' AND brand_id=23;
-- BODY CARE - SOAP
UPDATE products SET image_url='https://images.migrosone.com/sanalmarket/product/29818741/29818741_1-35e2bf-1650x1650.jpg' WHERE name='Beauty Cream Bar' AND brand_id=24;
UPDATE products SET image_url='https://cdn.dsmcdn.com/ty1853/prod/QC_PREP/20260406/17/48ba51a6-6714-3afb-82d0-6b5ab7e93508/1_org_zoom.jpg' WHERE name='Naturals Olive Soap' AND brand_id=27;
-- ROLLON & DEODORANT - DEODORANT
UPDATE products SET image_url='https://images.migrosone.com/sanalmarket/product/35032237/35032237-e6aefc-1650x1650.jpg' WHERE name='Dark Temptation Deodorant' AND brand_id=25;
UPDATE products SET image_url='https://assets.unileversolutions.com/v1/132709093.png' WHERE name='Cool Wave Deodorant' AND brand_id=32;
-- ROLLON & DEODORANT - ROLLON
UPDATE products SET image_url='https://cdn.rossmann.com.tr/media/catalog/product/3/6/363ca45b86659ec63c25295f6f50eadf0db080d0843160d5f58a6ff77808317c.jpeg' WHERE name='Cotton Dry Rollon' AND brand_id=32;
UPDATE products SET image_url='https://cdn.rossmann.com.tr/media/catalog/product/6/d/6d18efb2ad6327d95a4641ab826338681b396d3016ecd33c53a8503cc692fd67.jpeg' WHERE name='Original Care Rollon' AND brand_id=24;
-- SUN CARE - SUNSCREEN
UPDATE products SET image_url='https://images.migrosone.com/sanalmarket/product/35526009/35526009-f2a011-1650x1650.jpg' WHERE name='Sun Protect SPF 50+' AND brand_id=23;
UPDATE products SET image_url='https://images.migrosone.com/sanalmarket/product/35406345/35406345_1-98efe0-1650x1650.jpg' WHERE name='Ambre Solaire SPF 30' AND brand_id=31;
-- HYGIENE - TOOTHPASTE
UPDATE products SET image_url='https://images.migrosone.com/macrocenter/product/34013423/34013423-3325fd.jpg' WHERE name='Total Diş Macunu' AND brand_id=29;
UPDATE products SET image_url='https://static.ticimax.cloud/cdn-cgi/image/width=-,quality=85/31032/uploads/urunresimleri/buyuk/signal-dis-macunu-curuklere-karsi-yesi-f4-35a.jpg' WHERE name='Cavity Protection Diş Macunu' AND brand_id=33;


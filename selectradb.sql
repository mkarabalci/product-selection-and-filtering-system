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

SELECT id, name FROM categories;

SELECT id, name FROM products;

SELECT column_name FROM information_schema.columns WHERE table_name = 'beverage_details';

SELECT * FROM beverages_details

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

SELECT id, name FROM brands;

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

SELECT * FROM branch_products
SELECT * FROM snack_details;

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

SELECT * FROM personal_care_details;
SELECT id, name FROM brands WHERE name IN ('Nivea','Dove','Axe','Gillette','Palmolive','Elidor','Colgate','L''Oreal','Garnier','Rexona');
SELECT MAX(id) FROM products;

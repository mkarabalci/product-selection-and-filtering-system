-- Müşteriler
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Tedarikçiler (Marketler)
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,  -- 'Migros', 'A101'
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
-- Tedarikçiler ekle
INSERT INTO suppliers (company_name, email, password) VALUES
('Migros', 'migros@migros.com', 'migros123'),
('A101', 'a101@a101.com', 'a101123'),
('BIM', 'bim@bim.com', 'bim123'),
('SOK', 'sok@sok.com', 'sok123');

--Şubeler
CREATE TABLE branches (
    id SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES suppliers(id),
    name VARCHAR(100) NOT NULL,    -- 'Migros Kadıköy', 'A101 Şişli'
    address VARCHAR(200)
);
ALTER TABLE branches 
ADD COLUMN latitude DECIMAL(9,6),
ADD COLUMN longitude DECIMAL(9,6);

--Her market için 2 şube ekle
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
    name VARCHAR(50) NOT NULL   -- 'Snacks', 'Beverages', 'Personal Care'
);

-- Kategori ekle
INSERT INTO categories (name) VALUES ('Snacks');


CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL  
);

-- Markalar ekle
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


--Eti burçak ekle
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

--Eti Benimo ekle
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

--Eti Karam ekle
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

--Dido ekle
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



--Laviva ekle
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

--Lays klasik ekle
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

--Lays Baharatlı ekle
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
-- Eti Burçak (id=1) baz fiyat 25TL
(1, 1, 27.00, 50),  -- Migros Kadıköy
(2, 1, 27.00, 40),  -- Migros Beşiktaş
(3, 1, 25.00, 0),  -- A101 Üsküdar
(4, 1, 25.00, 35),  -- A101 Şişli
(5, 1, 24.00, 0),  -- BIM Ataşehir
(6, 1, 24.00, 40),  -- BIM Bakırköy
(7, 1, 26.00, 25),  -- SOK Beyoğlu
(8, 1, 26.00, 30),  -- SOK Maltepe

-- Eti Benimo (id=2) baz fiyat 30TL
(1, 2, 31.00, 45),  -- Migros Kadıköy
(2, 2, 31.00, 40),  -- Migros Beşiktaş
(3, 2, 30.00, 30),  -- A101 Üsküdar
(4, 2, 30.00, 0),  -- A101 Şişli
(5, 2, 29.00, 0),  -- BIM Ataşehir
(6, 2, 29.00, 45),  -- BIM Bakırköy
(7, 2, 30.00, 25),  -- SOK Beyoğlu
(8, 2, 30.00, 30),  -- SOK Maltepe

-- Eti Karam (id=3) baz fiyat 23TL
(1, 3, 24.50, 20),  -- Migros Kadıköy
(2, 3, 24.50, 15),  -- Migros Beşiktaş
(3, 3, 23.00, 25),  -- A101 Üsküdar
(4, 3, 23.00, 20),  -- A101 Şişli
(5, 3, 22.50, 0),  -- BIM Ataşehir
(6, 3, 22.50, 25),  -- BIM Bakırköy
(7, 3, 23.00, 15),  -- SOK Beyoğlu
(8, 3, 23.00, 0),  -- SOK Maltepe

-- Dido (id=4) baz fiyat 25TL
(1, 4, 26.50, 40),  -- Migros Kadıköy
(2, 4, 26.50, 35),  -- Migros Beşiktaş
(3, 4, 25.00, 40),  -- A101 Üsküdar
(4, 4, 25.00, 60),  -- A101 Şişli
(5, 4, 24.50, 30),  -- BIM Ataşehir
(6, 4, 24.50, 10),  -- BIM Bakırköy
(7, 4, 25.00, 0),  -- SOK Beyoğlu
(8, 4, 25.00, 30),  -- SOK Maltepe

-- Laviva (id=5) baz fiyat 25TL
(1, 5, 26.50, 30),  -- Migros Kadıköy
(2, 5, 26.50, 25),  -- Migros Beşiktaş
(3, 5, 25.00, 35),  -- A101 Üsküdar
(4, 5, 25.00, 30),  -- A101 Şişli
(5, 5, 24.50, 70),  -- BIM Ataşehir
(6, 5, 24.50, 80),  -- BIM Bakırköy
(7, 5, 25.00, 20),  -- SOK Beyoğlu
(8, 5, 25.00, 25),  -- SOK Maltepe

-- Lays Klasik (id=6) baz fiyat 55TL
(1, 6, 57.00, 60),  -- Migros Kadıköy
(2, 6, 57.00, 70),  -- Migros Beşiktaş
(3, 6, 55.00, 50),  -- A101 Üsküdar
(4, 6, 55.00, 40),  -- A101 Şişli
(5, 6, 54.00, 30),  -- BIM Ataşehir
(6, 6, 54.00, 25),  -- BIM Bakırköy
(7, 6, 56.00, 0),  -- SOK Beyoğlu
(8, 6, 56.00, 0),  -- SOK Maltepe

-- Lays Baharatlı (id=7) baz fiyat 50TL
(1, 7, 52.00, 20),  -- Migros Kadıköy
(2, 7, 52.00, 25),  -- Migros Beşiktaş
(3, 7, 50.00, 45),  -- A101 Üsküdar
(4, 7, 50.00, 45),  -- A101 Şişli
(5, 7, 49.00, 60),  -- BIM Ataşehir
(6, 7, 49.00, 55),  -- BIM Bakırköy
(7, 7, 51.00, 25),  -- SOK Beyoğlu
(8, 7, 51.00, 30);  -- SOK Maltepe


SELECT 
    p.name AS urun, --products tablosundaki name kolonunu urun adında getir
    b.name AS sube, -- branch tablosundaki name kolonunu sube adında getir
    bp.price AS fiyat,
    bp.stock_quantity AS stok,
    sd.snacks_type AS tur,
    sd.energy_kcal AS kalori,
    sd.allergens AS allerjenler
FROM products p
JOIN branch_products bp ON p.id = bp.product_id
JOIN branches b ON bp.branch_id = b.id
JOIN snack_details sd ON p.id = sd.product_id
ORDER BY p.name, b.name;  --alfabetik sırala 
















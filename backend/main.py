from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from backend.database import get_connection
from typing import Optional, List

app = FastAPI()

# React frontend'in API'a erişebilmesi için CORS ayarı
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Genel Endpointler ────────────────────────────────────────────────────────

@app.get("/")
def home():
    return {"message": "Selectra backend calisiyor!"}

@app.get("/test-db")
def test_db():
    # Veritabanı bağlantısını test eder
    conn = get_connection()
    conn.close()
    return {"message": "Veritabani baglantisi basarili!"}

# ── Ürün Endpointleri ────────────────────────────────────────────────────────

@app.get("/snacks")
def get_snacks():
    # Stokta olan tüm atıştırmalıkları şube, fiyat ve besin detaylarıyla getirir
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT
                p.id, p.name, b.name AS brand, bp.price, bp.stock_quantity,
                br.name AS branch, sd.snacks_type, sd.energy_kcal,
                sd.protein_g, sd.sugar_g, sd.allergens
            FROM products p
            JOIN brands b ON p.brand_id = b.id
            JOIN branch_products bp ON p.id = bp.product_id
            JOIN branches br ON bp.branch_id = br.id
            JOIN snack_details sd ON p.id = sd.product_id
            WHERE bp.stock_quantity > 0
            ORDER BY p.name
        """)
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

    return JSONResponse(content=[{
        "id": row[0], "name": row[1], "brand": row[2],
        "price": float(row[3]), "stock": row[4], "branch": row[5],
        "type": row[6], "energy_kcal": row[7],
        "protein_g": float(row[8]), "sugar_g": float(row[9]),
        "allergens": row[10]
    } for row in rows], media_type="application/json; charset=utf-8")


@app.get("/snacks/filter")
def filter_snacks(
    # Ürün özellikleri
    type: Optional[List[str]] = Query(default=None),
    # Besin değerleri
    min_calories: Optional[int] = None,
    max_calories: Optional[int] = None,
    min_protein: Optional[float] = None,
    max_protein: Optional[float] = None,
    max_sugar: Optional[float] = None,
    # İçerik filtreleri
    oil_type: Optional[List[str]] = Query(default=None),
    allergen_free: Optional[List[str]] = Query(default=None),
    halal: Optional[bool] = None,
    packaging: Optional[str] = None,
    # Marka ve tedarikçi
    brand: Optional[List[str]] = Query(default=None),
    supplier: Optional[List[str]] = Query(default=None),
    # Fiyat aralığı
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
):
    # Kullanıcının seçtiği filtrelere göre dinamik SQL sorgusu oluşturur
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        SELECT 
            p.id, p.name, b.name AS brand, bp.price, bp.stock_quantity,
            br.name AS branch, s.company_name AS supplier,
            sd.snacks_type, sd.energy_kcal, sd.protein_g, sd.sugar_g,
            sd.oil_type, sd.packaging, sd.allergens, p.image_url
        FROM products p
        JOIN brands b ON p.brand_id = b.id
        JOIN branch_products bp ON p.id = bp.product_id
        JOIN branches br ON bp.branch_id = br.id
        JOIN suppliers s ON br.supplier_id = s.id
        JOIN snack_details sd ON p.id = sd.product_id
        WHERE bp.stock_quantity > 0
    """
    params = []

    # Filtreler dinamik olarak eklenir
    if type:
        placeholders = ",".join(["%s"] * len(type))
        query += f" AND sd.snacks_type IN ({placeholders})"
        params.extend(type)
    if min_calories is not None:
        query += " AND sd.energy_kcal >= %s"
        params.append(min_calories)
    if max_calories is not None:
        query += " AND sd.energy_kcal <= %s"
        params.append(max_calories)
    if min_protein is not None:
        query += " AND sd.protein_g >= %s"
        params.append(min_protein)
    if max_protein:
        query += " AND sd.protein_g <= %s"
        params.append(max_protein)
    if max_sugar is not None:
        query += " AND sd.sugar_g <= %s"
        params.append(max_sugar)
    if oil_type:
        # Seçilen tüm yağ tiplerini içeren ürünleri getirir
        for o in oil_type:
            query += " AND %s = ANY(sd.oil_type)"
            params.append(o)
    if packaging:
        query += " AND sd.packaging = %s"
        params.append(packaging)
    if allergen_free:
        # Seçilen allerjenleri içermeyen ürünleri getirir
        for a in allergen_free:
            query += " AND NOT (%s = ANY(sd.allergens))"
            params.append(a)
    if halal is True:
        query += " AND 'Halal' = ANY(sd.allergens)"
    elif halal is False:
        query += " AND NOT ('Halal' = ANY(sd.allergens))"
    if brand:
        placeholders = ",".join(["%s"] * len(brand))
        query += f" AND b.name IN ({placeholders})"
        params.extend(brand)

    if supplier:
        placeholders = ",".join(["%s"] * len(supplier))
        query += f" AND s.company_name IN ({placeholders})"
        params.extend(supplier)
    if min_price is not None:
        query += " AND bp.price >= %s"
        params.append(min_price)
    if max_price is not None:
        query += " AND bp.price <= %s"
        params.append(max_price)

    query += " ORDER BY p.name"

    try:
        cursor.execute(query, params)
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

    return JSONResponse(content=[{
        "id": row[0], "name": row[1], "brand": row[2],
        "price": float(row[3]), "stock": row[4], "branch": row[5],
        "supplier": row[6], "type": row[7], "energy_kcal": row[8],
        "protein_g": float(row[9]), "sugar_g": float(row[10]),
        "oil_type": row[11], "packaging": row[12], "allergens": row[13], 
        "image_url": row[14]
    } for row in rows], media_type="application/json; charset=utf-8")

# ── Filtre Seçenekleri Endpointleri ─────────────────────────────────────────
# Bu endpointler frontend'deki filtre kartlarını veritabanından doldurur
# Yeni veri eklendiğinde frontend otomatik güncellenir

@app.get("/brands")
def get_brands():
    # Tüm markaları alfabetik sırayla getirir
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT name FROM brands ORDER BY name")
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()
    return [row[0] for row in rows]

@app.get("/suppliers")
def get_suppliers():
    # Tüm tedarikçileri alfabetik sırayla getirir
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT company_name FROM suppliers ORDER BY company_name")
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()
    return [row[0] for row in rows]

@app.get("/snack-types")
def get_snack_types():
    # Veritabanındaki benzersiz atıştırmalık tiplerini getirir
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT DISTINCT snacks_type FROM snack_details ORDER BY snacks_type")
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()
    return [row[0] for row in rows]

@app.get("/allergens")
def get_allergens():
    # snack_details tablosundaki tüm allerjen array'lerini açıp benzersiz olanları getirir
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT DISTINCT unnest(allergens) FROM snack_details ORDER BY 1")
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()
    return [row[0] for row in rows]

@app.get("/oil-types")
def get_oil_types():
    # snack_details tablosundaki tüm yağ tipi array'lerini açıp benzersiz olanları getirir
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT DISTINCT unnest(oil_type) FROM snack_details ORDER BY 1")
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()
    return [row[0] for row in rows]

@app.get("/packaging-types")
def get_packaging_types():
    # Veritabanındaki benzersiz ambalaj tiplerini getirir
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT DISTINCT packaging FROM snack_details ORDER BY 1")
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()
    return [row[0] for row in rows]


# ── İçecek Endpointleri ──────────────────────────────────────────────────────

@app.get("/beverages")
def get_beverages():
    # Stokta olan tüm içecekleri şube, fiyat ve detaylarıyla getirir
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT
                p.id, p.name, b.name AS brand, bp.price, bp.stock_quantity,
                br.name AS branch, bd.beverage_type, bd.energy_kcal,
                bd.sugar_g, bd.volume, bd.pH, bd.package_type, bd.allergens,
                p.image_url
            FROM products p
            JOIN brands b ON p.brand_id = b.id
            JOIN branch_products bp ON p.id = bp.product_id
            JOIN branches br ON bp.branch_id = br.id
            JOIN beverages_details bd ON p.id = bd.product_id
            WHERE bp.stock_quantity > 0
            ORDER BY p.name
        """)
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

    return JSONResponse(content=[{
        "id": row[0], "name": row[1], "brand": row[2],
        "price": float(row[3]), "stock": row[4], "branch": row[5],
        "type": row[6], "energy_kcal": row[7],
        "sugar_g": float(row[8]), "volume": float(row[9]),
        "ph": float(row[10]), "package_type": row[11],
        "allergens": row[12], "image_url": row[13]
    } for row in rows], media_type="application/json; charset=utf-8")


@app.get("/beverages/filter")
def filter_beverages(
    # Ürün özellikleri
    beverage_type: Optional[List[str]] = Query(default=None),
    # Besin değerleri
    min_calories: Optional[int] = None,
    max_calories: Optional[int] = None,
    max_sugar: Optional[float] = None,
    # Hacim
    volume_ml: Optional[int] = None,
    # pH
    min_ph: Optional[float] = None,
    max_ph: Optional[float] = None,
    # Paket
    package_type: Optional[List[str]] = Query(default=None),
    packaging: Optional[int] = None,
    # Allerjenler
    allergen_free: Optional[List[str]] = Query(default=None),
    # Marka ve tedarikçi
    brand: Optional[List[str]] = Query(default=None),
    supplier: Optional[List[str]] = Query(default=None),
    # Fiyat aralığı
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
):
    # Kullanıcının seçtiği filtrelere göre dinamik SQL sorgusu oluşturur
    conn = get_connection()
    cursor = conn.cursor()

    query = """
        SELECT
            p.id, p.name, b.name AS brand, bp.price, bp.stock_quantity,
            br.name AS branch, s.company_name AS supplier,
            bd.beverage_type, bd.energy_kcal, bd.sugar_g, bd.volume,
            bd.pH, bd.package_type, bd.allergens, p.image_url
        FROM products p
        JOIN brands b ON p.brand_id = b.id
        JOIN branch_products bp ON p.id = bp.product_id
        JOIN branches br ON bp.branch_id = br.id
        JOIN suppliers s ON br.supplier_id = s.id
        JOIN beverages_details bd ON p.id = bd.product_id
        WHERE bp.stock_quantity > 0
    """
    params = []

    # Filtreler dinamik olarak eklenir
    if beverage_type:
        placeholders = ",".join(["%s"] * len(beverage_type))
        query += f" AND bd.beverage_type IN ({placeholders})"
        params.extend(beverage_type)
    if min_calories is not None:
        query += " AND bd.energy_kcal >= %s"
        params.append(min_calories)
    if max_calories is not None:
        query += " AND bd.energy_kcal <= %s"
        params.append(max_calories)
    if max_sugar is not None:
        query += " AND bd.sugar_g <= %s"
        params.append(max_sugar)
    if volume_ml is not None:
        query += " AND bd.volume = %s"
        params.append(volume_ml)
    if min_ph is not None:
        query += " AND bd.pH >= %s"
        params.append(min_ph)
    if max_ph is not None:
        query += " AND bd.pH <= %s"
        params.append(max_ph)
    if package_type:
        for pt in package_type:
            query += " AND %s = ANY(bd.package_type)"
            params.append(pt)
    if allergen_free:
        # Seçilen allerjenleri içermeyen ürünleri getirir
        for a in allergen_free:
            query += " AND NOT (%s = ANY(bd.allergens))"
            params.append(a)
    if brand:
        placeholders = ",".join(["%s"] * len(brand))
        query += f" AND b.name IN ({placeholders})"
        params.extend(brand)
    if supplier:
        placeholders = ",".join(["%s"] * len(supplier))
        query += f" AND s.company_name IN ({placeholders})"
        params.extend(supplier)
    if min_price is not None:
        query += " AND bp.price >= %s"
        params.append(min_price)
    if max_price is not None:
        query += " AND bp.price <= %s"
        params.append(max_price)

    query += " ORDER BY p.name"

    try:
        cursor.execute(query, params)
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

    return JSONResponse(content=[{
        "id": row[0], "name": row[1], "brand": row[2],
        "price": float(row[3]), "stock": row[4], "branch": row[5],
        "supplier": row[6], "type": row[7], "energy_kcal": row[8],
        "sugar_g": float(row[9]), "volume": float(row[10]),
        "ph": float(row[11]), "package_type": row[12],
        "allergens": row[13], "image_url": row[14]
    } for row in rows], media_type="application/json; charset=utf-8")


# ── İçecek Filtre Seçenekleri ────────────────────────────────────────────────

@app.get("/beverage-types")
def get_beverage_types():
    # Veritabanındaki benzersiz içecek tiplerini getirir
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT DISTINCT beverage_type FROM beverages_details ORDER BY beverage_type")
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()
    return [row[0] for row in rows]

@app.get("/beverage-allergens")
def get_beverage_allergens():
    # beverages_details tablosundaki tüm allerjen array'lerini açıp benzersiz olanları getirir
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT DISTINCT unnest(allergens) FROM beverages_details ORDER BY 1")
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()
    return [row[0] for row in rows]

@app.get("/beverage-package-types")
def get_beverage_package_types():
    # Veritabanındaki benzersiz paket tiplerini getirir
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT DISTINCT unnest(package_type) FROM beverages_details ORDER BY 1")
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()
    return [row[0] for row in rows]

@app.get("/beverage-brands")
def get_beverage_brands():
    # Sadece içecek ürünlerinde kullanılan markaları getirir
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT DISTINCT b.name 
            FROM brands b
            JOIN products p ON p.brand_id = b.id
            JOIN categories c ON p.category_id = c.id
            WHERE c.name = 'Beverages'
            ORDER BY b.name
        """)
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()
    return [row[0] for row in rows]

@app.get("/snack-brands")
def get_snack_brands():
    # Sadece snack ürünlerinde kullanılan markaları getirir
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT DISTINCT b.name 
            FROM brands b
            JOIN products p ON p.brand_id = b.id
            JOIN categories c ON p.category_id = c.id
            WHERE c.name = 'Snacks'
            ORDER BY b.name
        """)
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()
    return [row[0] for row in rows]

# ── Tedarikçi Login ──────────────────────────────────────────────────────────

from fastapi import HTTPException
from pydantic import BaseModel

# Login için gelen veri modeli
class SupplierLogin(BaseModel):
    email: str
    password: str

@app.post("/supplier/login")
def supplier_login(data: SupplierLogin):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Email ile tedarikçiyi bul
        cursor.execute(
            "SELECT id, company_name, password FROM suppliers WHERE email = %s",
            (data.email,)
        )
        supplier = cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

    # Tedarikçi bulunamadıysa hata ver
    if not supplier:
        raise HTTPException(status_code=401, detail="Email bulunamadı")

    # Şifre yanlışsa hata ver
    if supplier[2] != data.password:
        raise HTTPException(status_code=401, detail="Şifre yanlış")

    # Başarılı girişte tedarikçi bilgilerini döndür
    return {
        "message": "Giriş başarılı",
        "supplier_id": supplier[0],
        "company_name": supplier[1]
    }

# Kayıt için gelen veri modeli
class SupplierRegister(BaseModel):
    company_name: str
    email: str
    password: str

@app.post("/supplier/register")
def supplier_register(data: SupplierRegister):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Email daha önce kayıtlı mı kontrol et
        cursor.execute(
            "SELECT id FROM suppliers WHERE email = %s",
            (data.email,)
        )
        existing = cursor.fetchone()

        if existing:
            raise HTTPException(status_code=400, detail="Bu email zaten kayıtlı")

        # Yeni tedarikçiyi ekle
        cursor.execute(
            "INSERT INTO suppliers (company_name, email, password) VALUES (%s, %s, %s) RETURNING id",
            (data.company_name, data.email, data.password)
        )
        new_id = cursor.fetchone()[0]
        conn.commit()
    finally:
        cursor.close()
        conn.close()

    return {
        "message": "Kayıt başarılı",
        "supplier_id": new_id,
        "company_name": data.company_name
    }

@app.get("/supplier/{supplier_id}/branches")
def get_supplier_branches(supplier_id: int):
    # Tedarikçinin şubelerini getirir
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT id, name, address FROM branches WHERE supplier_id = %s",
            (supplier_id,)
        )
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()
    return [{"id": row[0], "name": row[1], "address": row[2]} for row in rows]

@app.get("/supplier/{supplier_id}/products")
def get_supplier_products(supplier_id: int):
    # Tedarikçinin tüm şubelerindeki ürünleri getirir
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT 
                p.name, c.name AS category, bp.price, bp.stock_quantity, br.name AS branch
            FROM branch_products bp
            JOIN products p ON bp.product_id = p.id
            JOIN branches br ON bp.branch_id = br.id
            JOIN suppliers s ON br.supplier_id = s.id
            JOIN categories c ON p.category_id = c.id
            WHERE s.id = %s
            ORDER BY p.name, br.name
        """, (supplier_id,))
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()
    return [{"name": row[0], "category": row[1], "price": float(row[2]), "stock": row[3], "branch": row[4]} for row in rows]

# ── Kullanıcı Login ve Register ──────────────────────────────────────────────

class CustomerLogin(BaseModel):
    username: str
    email: str
    password: str

class CustomerRegister(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str

@app.post("/customer/login")
def customer_login(data: CustomerLogin):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT id, username, password FROM customers WHERE email = %s",
            (data.email,)
        )
        customer = cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

    if not customer:
        raise HTTPException(status_code=401, detail="Email bulunamadı")
    
    if customer[1] != data.username:
        raise HTTPException(status_code=401, detail="Ad soyad yanlış")

    if customer[2] != data.password:
        raise HTTPException(status_code=401, detail="Şifre yanlış")

    return {
        "message": "Giriş başarılı",
        "customer_id": customer[0],
        "username": customer[1]
    }

@app.post("/customer/register")
def customer_register(data: CustomerRegister):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT id FROM customers WHERE email = %s",
            (data.email,)
        )
        existing = cursor.fetchone()

        if existing:
            raise HTTPException(status_code=400, detail="Bu email zaten kayıtlı")
        
        # Ad ve soyadı birleştirerek username olarak kaydet
        username = f"{data.first_name} {data.last_name}"
        cursor.execute(
            "INSERT INTO customers (username, email, password) VALUES (%s, %s, %s) RETURNING id",
            (username, data.email, data.password)
        )
        new_id = cursor.fetchone()[0]
        conn.commit()
    finally:
        cursor.close()
        conn.close()

    return {
        "message": "Kayıt başarılı",
        "customer_id": new_id,
        "username": username
    }
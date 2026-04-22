from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from backend.database import get_connection
from typing import Optional, List

app = FastAPI()

# React frontend'in API'a erişebilmesi için CORS ayarı
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
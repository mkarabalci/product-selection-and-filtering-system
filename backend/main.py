from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from backend.database import get_connection
from typing import Optional, List
from fastapi import Body

app = FastAPI()

# React frontend'in API'a erişebilmesi için CORS ayarı
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def home():
    return {"message": "Selectra backend calisiyor!"}

@app.get("/test-db")
def test_db():
    conn = get_connection()
    conn.close()
    return {"message": "Veritabani baglantisi basarili!"}

#  Ürün Endpointleri

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
        for o in oil_type:
            query += " AND %s = ANY(sd.oil_type)"
            params.append(o)
    if packaging:
        query += " AND sd.packaging = %s"
        params.append(packaging)
    if allergen_free:
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



@app.get("/brands")
def get_brands():
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
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT DISTINCT packaging FROM snack_details ORDER BY 1")
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()
    return [row[0] for row in rows]



@app.get("/beverages")
def get_beverages():
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
    beverage_type: Optional[List[str]] = Query(default=None),
    min_calories: Optional[int] = None,
    max_calories: Optional[int] = None,
    max_sugar: Optional[float] = None,
    volume_ml: Optional[int] = None,
    min_ph: Optional[float] = None,
    max_ph: Optional[float] = None,
    package_type: Optional[List[str]] = Query(default=None),
    packaging: Optional[int] = None,
    allergen_free: Optional[List[str]] = Query(default=None),
    brand: Optional[List[str]] = Query(default=None),
    supplier: Optional[List[str]] = Query(default=None),
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
):
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



@app.get("/beverage-types")
def get_beverage_types():
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


# Tedarikçi Login 

from fastapi import HTTPException
from pydantic import BaseModel


class SupplierLogin(BaseModel):
    email: str
    password: str

@app.post("/supplier/login")
def supplier_login(data: SupplierLogin):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT id, company_name, password FROM suppliers WHERE email = %s",
            (data.email,)
        )
        supplier = cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

    if not supplier:
        raise HTTPException(status_code=401, detail="Email bulunamadı")

    if supplier[2] != data.password:
        raise HTTPException(status_code=401, detail="Şifre yanlış")

    return {
        "message": "Giriş başarılı",
        "supplier_id": supplier[0],
        "company_name": supplier[1]
    }

class SupplierRegister(BaseModel):
    company_name: str
    email: str
    password: str

@app.post("/supplier/register")
def supplier_register(data: SupplierRegister):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT id FROM suppliers WHERE email = %s",
            (data.email,)
        )
        existing = cursor.fetchone()

        if existing:
            raise HTTPException(status_code=400, detail="Bu email zaten kayıtlı")

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
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT 
                bp.id, bp.branch_id, bp.product_id,
                p.name, c.name AS category, 
                bp.price, bp.stock_quantity, br.name AS branch,
                br.name AS branch, br.address AS branch_address
            FROM branch_products bp
            JOIN products p ON bp.product_id = p.id
            JOIN branches br ON bp.branch_id = br.id
            JOIN suppliers s ON br.supplier_id = s.id
            JOIN categories c ON p.category_id = c.id
            WHERE s.id = %s
            ORDER BY br.name, p.name
        """, (supplier_id,))
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()
    return [{
        "id": row[0],
        "branch_id": row[1],
        "product_id": row[2],
        "name": row[3],
        "category": row[4],
        "price": float(row[5]),
        "stock": row[6],
        "branch": row[7],
        "branch_address": row[8]
    } for row in rows]


#  Kullanıcı Login ve Register
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

# Tedarikçi Ürün Düzenleme ve Silme 


class BranchProductUpdate(BaseModel):
    price: float
    stock_quantity: int

@app.put("/supplier/{supplier_id}/products/{branch_product_id}")
def update_supplier_product(
    supplier_id: int,
    branch_product_id: int,
    data: BranchProductUpdate
):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT bp.id
            FROM branch_products bp
            JOIN branches br ON bp.branch_id = br.id
            WHERE bp.id = %s AND br.supplier_id = %s
        """, (branch_product_id, supplier_id))
        
        result = cursor.fetchone()
        if not result:
            raise HTTPException(
                status_code=403,
                detail="Bu ürünü düzenleme yetkiniz yok"
            )

        cursor.execute("""
            UPDATE branch_products
            SET price = %s, stock_quantity = %s
            WHERE id = %s
        """, (data.price, data.stock_quantity, branch_product_id))
        
        conn.commit()
    finally:
        cursor.close()
        conn.close()

    return {
        "message": "Ürün güncellendi",
        "id": branch_product_id,
        "price": data.price,
        "stock_quantity": data.stock_quantity
    }


@app.delete("/supplier/{supplier_id}/products/{branch_product_id}")
def delete_supplier_product(supplier_id: int, branch_product_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT bp.id
            FROM branch_products bp
            JOIN branches br ON bp.branch_id = br.id
            WHERE bp.id = %s AND br.supplier_id = %s
        """, (branch_product_id, supplier_id))
        
        result = cursor.fetchone()
        if not result:
            raise HTTPException(
                status_code=403,
                detail="Bu ürünü silme yetkiniz yok"
            )

        cursor.execute(
            "DELETE FROM branch_products WHERE id = %s",
            (branch_product_id,)
        )
        conn.commit()
    finally:
        cursor.close()
        conn.close()

    return {
        "message": "Ürün şubeden kaldırıldı",
        "id": branch_product_id
    }



@app.get("/products/search")
def search_products(q: str = ""):

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT p.id, p.name, c.name AS category, b.name AS brand
            FROM products p
            JOIN categories c ON p.category_id = c.id
            JOIN brands b ON p.brand_id = b.id
            WHERE LOWER(p.name) LIKE LOWER(%s)
            ORDER BY p.name
            LIMIT 50
        """, (f"%{q}%",))
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

    return [{
        "id": row[0],
        "name": row[1],
        "category": row[2],
        "brand": row[3]
    } for row in rows]



class BranchProductCreate(BaseModel):
    product_id: int
    price: float
    stock_quantity: int

@app.post("/supplier/{supplier_id}/branches/{branch_id}/products")
def add_product_to_branch(
    supplier_id: int,
    branch_id: int,
    data: BranchProductCreate
):

    conn = get_connection()
    cursor = conn.cursor()
    try:

        cursor.execute(
            "SELECT id FROM branches WHERE id = %s AND supplier_id = %s",
            (branch_id, supplier_id)
        )
        if not cursor.fetchone():
            raise HTTPException(
                status_code=403,
                detail="Bu şubeye ürün ekleme yetkiniz yok"
            )


        cursor.execute("SELECT id FROM products WHERE id = %s", (data.product_id,))
        if not cursor.fetchone():
            raise HTTPException(
                status_code=404,
                detail="Ürün sistemde bulunamadı"
            )


        cursor.execute(
            "SELECT id FROM branch_products WHERE branch_id = %s AND product_id = %s",
            (branch_id, data.product_id)
        )
        existing = cursor.fetchone()
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Bu ürün zaten bu şubenizde mevcut. Düzenlemek için 'My Products' sayfasını kullanın."
            )

        # Ekle
        cursor.execute("""
            INSERT INTO branch_products (branch_id, product_id, price, stock_quantity)
            VALUES (%s, %s, %s, %s)
            RETURNING id
        """, (branch_id, data.product_id, data.price, data.stock_quantity))
        
        new_id = cursor.fetchone()[0]
        conn.commit()
    finally:
        cursor.close()
        conn.close()

    return {
        "message": "Ürün şubenize eklendi",
        "id": new_id,
        "branch_id": branch_id,
        "product_id": data.product_id,
        "price": data.price,
        "stock_quantity": data.stock_quantity
    }

##marka varsa mevcut id'yi döndürür yoksa ekleyip yeni id'yi döndürür 
@app.post("/brands")
def create_or_get_brand(payload: dict = Body(...)):
    # Marka adını al, baştaki/sondaki boşlukları temizle
    name = payload.get("name", "").strip()
    

    if not name:
        raise HTTPException(status_code=400, detail="Marka adı boş olamaz")
    
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT id, name FROM brands WHERE LOWER(name) = LOWER(%s)",
            (name,)
        )
        existing = cursor.fetchone()
        

        if existing:
            return {"id": existing[0], "name": existing[1], "created": False}
        

        cursor.execute(
            "INSERT INTO brands (name) VALUES (%s) RETURNING id, name",
            (name,)
        )
        new_brand = cursor.fetchone()
        conn.commit()  
        
        return {"id": new_brand[0], "name": new_brand[1], "created": True}
    
    finally:
        cursor.close()
        conn.close()


## Tamamen yeni bir snack ürünü sisteme tanıtmak
@app.post("/supplier/{supplier_id}/branches/{branch_id}/snacks")
def add_new_snack_product(
    supplier_id: int,
    branch_id: int,
    payload: dict = Body(...)
):
    # Gerekli alanları al
    name = payload.get("name", "").strip()
    brand_id = payload.get("brand_id")
    image_url = payload.get("image_url")
    snacks_type = payload.get("snacks_type")
    energy_kcal = payload.get("energy_kcal")
    protein_g = payload.get("protein_g")
    sugar_g = payload.get("sugar_g")
    allergens = payload.get("allergens", [])     
    oil_type = payload.get("oil_type", [])
    packaging = payload.get("packaging")
    price = payload.get("price")
    stock_quantity = payload.get("stock_quantity")

    if not name or not brand_id or price is None or stock_quantity is None:
        raise HTTPException(status_code=400, detail="Eksik zorunlu alan")

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "SELECT supplier_id FROM branches WHERE id = %s",
            (branch_id,)
        )
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Şube bulunamadı")
        if row[0] != supplier_id:
            raise HTTPException(status_code=403, detail="Bu şube size ait değil")

        cursor.execute(
            """
            INSERT INTO products (name, category_id, brand_id, image_url)
            VALUES (%s, 1, %s, %s)
            RETURNING id
            """,
            (name, brand_id, image_url)
        )
        product_id = cursor.fetchone()[0]

        cursor.execute(
            """
            INSERT INTO snack_details
                (product_id, snacks_type, energy_kcal, protein_g, sugar_g,
                 allergens, oil_type, packaging)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (product_id, snacks_type, energy_kcal, protein_g, sugar_g,
             allergens, oil_type, packaging)
        )

        cursor.execute(
            """
            INSERT INTO branch_products (branch_id, product_id, price, stock_quantity)
            VALUES (%s, %s, %s, %s)
            """,
            (branch_id, product_id, price, stock_quantity)
        )

        conn.commit()

        return {
            "success": True,
            "product_id": product_id,
            "message": f"'{name}' başarıyla eklendi"
        }

    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Hata: {str(e)}")
    finally:
        cursor.close()
        conn.close()


## Yeni bir beverage ürünü sisteme tanıtmak
@app.post("/supplier/{supplier_id}/branches/{branch_id}/beverages")
def add_new_beverage_product(
    supplier_id: int,
    branch_id: int,
    payload: dict = Body(...)
):

    name = payload.get("name", "").strip()
    brand_id = payload.get("brand_id")
    image_url = payload.get("image_url")
    beverage_type = payload.get("beverage_type")
    energy_kcal = payload.get("energy_kcal")
    ph = payload.get("pH")
    sugar_g = payload.get("sugar_g")
    volume = payload.get("volume")
    packaging = payload.get("packaging")
    package_type = payload.get("package_type", [])   
    allergens = payload.get("allergens", [])         
    is_locally_produced = payload.get("is_locally_produced", False)
    price = payload.get("price")
    stock_quantity = payload.get("stock_quantity")


    if not name or not brand_id or price is None or stock_quantity is None:
        raise HTTPException(status_code=400, detail="Eksik zorunlu alan")

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "SELECT supplier_id FROM branches WHERE id = %s",
            (branch_id,)
        )
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Şube bulunamadı")
        if row[0] != supplier_id:
            raise HTTPException(status_code=403, detail="Bu şube size ait değil")

        cursor.execute(
            """
            INSERT INTO products (name, category_id, brand_id, image_url)
            VALUES (%s, 2, %s, %s)
            RETURNING id
            """,
            (name, brand_id, image_url)
        )
        product_id = cursor.fetchone()[0]

        cursor.execute(
            """
            INSERT INTO beverages_details
                (product_id, beverage_type, energy_kcal, pH, sugar_g, volume,
                 packaging, package_type, allergens, is_locally_produced)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (product_id, beverage_type, energy_kcal, ph, sugar_g, volume,
             packaging, package_type, allergens, is_locally_produced)
        )

        cursor.execute(
            """
            INSERT INTO branch_products (branch_id, product_id, price, stock_quantity)
            VALUES (%s, %s, %s, %s)
            """,
            (branch_id, product_id, price, stock_quantity)
        )

        conn.commit()

        return {
            "success": True,
            "product_id": product_id,
            "message": f"'{name}' başarıyla eklendi"
        }

    except HTTPException:
        conn.rollback()
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Hata: {str(e)}")
    finally:
        cursor.close()
        conn.close()


@app.get("/beverage-types")
def get_beverage_types():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT DISTINCT beverage_type FROM beverages_details "
            "WHERE beverage_type IS NOT NULL ORDER BY beverage_type"
        )
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()
    return [row[0] for row in rows]


@app.get("/package-types")
def get_package_types():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "SELECT DISTINCT unnest(package_type) FROM beverages_details ORDER BY 1"
        )
        rows = cursor.fetchall()
    finally:
        cursor.close()
        conn.close()
    return [row[0] for row in rows]
import { useState, useEffect } from "react"
import "./App.css"
import Sidebar from "./Sidebar"

const API = "http://127.0.0.1:8000"

function Beverages() {

  // State tanımları
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [beverageTypes, setBeverageTypes] = useState([])
  const [brands, setBrands] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [allergens, setAllergens] = useState([])
  const [packageTypes, setPackageTypes] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [filters, setFilters] = useState({
    beverage_type: [],
    brand: [],
    supplier: [],
    min_price: "",
    max_price: "",
    min_calories: "",
    max_calories: "",
    max_sugar: "",
    min_ph: "",
    max_ph: "",
    package_type: [],
    allergen_free: [],
  })

  // API'dan filtre seçeneklerini çek
  useEffect(() => {
    fetch(`${API}/beverage-types`).then(r => r.json()).then(setBeverageTypes)
    fetch(`${API}/beverage-allergens`).then(r => r.json()).then(setAllergens)
    fetch(`${API}/beverage-package-types`).then(r => r.json()).then(setPackageTypes)
    fetch(`${API}/beverage-brands`).then(r => r.json()).then(setBrands)
    fetch(`${API}/suppliers`).then(r => r.json()).then(setSuppliers)
  }, [])

  // Ürünleri filtreli çek
  const fetchProducts = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    filters.beverage_type.forEach(t => params.append("beverage_type", t))
    filters.brand.forEach(b => params.append("brand", b))
    filters.supplier.forEach(s => params.append("supplier", s))
    filters.package_type.forEach(pt => params.append("package_type", pt))
    filters.allergen_free.forEach(a => params.append("allergen_free", a))
    if (filters.min_price) params.append("min_price", filters.min_price)
    if (filters.max_price) params.append("max_price", filters.max_price)
    if (filters.min_calories) params.append("min_calories", filters.min_calories)
    if (filters.max_calories) params.append("max_calories", filters.max_calories)
    if (filters.max_sugar) params.append("max_sugar", filters.max_sugar)
    if (filters.min_ph) params.append("min_ph", filters.min_ph)
    if (filters.max_ph) params.append("max_ph", filters.max_ph)

    const res = await fetch(`${API}/beverages/filter?${params.toString()}`)
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  // Checkbox yardımcı fonksiyonu
  const toggleArray = (field, value) => {
    const current = filters[field]
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    setFilters({ ...filters, [field]: updated })
  }

  // Buton fonksiyonları
  const handleApply = () => {
    fetchProducts()
    setShowResults(true)
  }

  const handleReset = () => {
    setFilters({
      beverage_type: [],
      brand: [],
      supplier: [],
      min_price: "",
      max_price: "",
      min_calories: "",
      max_calories: "",
      max_sugar: "",
      min_ph: "",
      max_ph: "",
      package_type: [],
      allergen_free: [],
    })
    setShowResults(false)
    setProducts([])
  }

  return (
    <div className="home-page">
      {/* Sidebar component'i */}
      <Sidebar />

      {/* Beverages sayfasının ana içeriği */}
      <div className="page">

        <header className="header">
          <p>Choose your preferred drinks options and browse the available products.</p>
        </header>

        <div className="filter-section">
          <div className="filter-grid">

            {/* İçecek tipi filtresi */}
            <div className="filter-card">
              <h3>Drink Type</h3>
              {beverageTypes.map((t) => (
                <label key={t} className="check-item">
                  <input type="checkbox"
                    checked={filters.beverage_type.includes(t)}
                    onChange={() => toggleArray("beverage_type", t)}
                  /> {t}
                </label>
              ))}
            </div>

            {/* Kalori filtresi */}
            <div className="filter-card">
              <h3>Energy (kcal)</h3>
              <input type="number" placeholder="Min" value={filters.min_calories}
                onChange={(e) => setFilters({ ...filters, min_calories: e.target.value })} />
              <input type="number" placeholder="Max" value={filters.max_calories}
                onChange={(e) => setFilters({ ...filters, max_calories: e.target.value })} />
            </div>

            {/* Şeker filtresi */}
            <div className="filter-card">
              <h3>Sugar (g)</h3>
              <input type="number" placeholder="Max" value={filters.max_sugar}
                onChange={(e) => setFilters({ ...filters, max_sugar: e.target.value })} />
            </div>

            {/* pH filtresi */}
            <div className="filter-card">
              <h3>pH</h3>
              <input type="number" placeholder="Min" value={filters.min_ph}
                onChange={(e) => setFilters({ ...filters, min_ph: e.target.value })} />
              <input type="number" placeholder="Max" value={filters.max_ph}
                onChange={(e) => setFilters({ ...filters, max_ph: e.target.value })} />
            </div>

            {/* Paket tipi filtresi */}
            <div className="filter-card">
              <h3>Package Type</h3>
              {packageTypes.map((pt) => (
                <label key={pt} className="check-item">
                  <input type="checkbox"
                    checked={filters.package_type.includes(pt)}
                    onChange={() => toggleArray("package_type", pt)}
                  /> {pt}
                </label>
              ))}
            </div>

            {/* Tedarikçi filtresi */}
            <div className="filter-card">
              <h3>Suppliers</h3>
              {suppliers.map((s) => (
                <label key={s} className="check-item">
                  <input type="checkbox"
                    checked={filters.supplier.includes(s)}
                    onChange={() => toggleArray("supplier", s)}
                  /> {s}
                </label>
              ))}
            </div>

            {/* Marka filtresi */}
            <div className="filter-card">
              <h3>Brands</h3>
              {brands.map((b) => (
                <label key={b} className="check-item">
                  <input type="checkbox"
                    checked={filters.brand.includes(b)}
                    onChange={() => toggleArray("brand", b)}
                  /> {b}
                </label>
              ))}
            </div>

            {/* Fiyat filtresi */}
            <div className="filter-card">
              <h3>Price (₺)</h3>
              <input type="number" placeholder="Min" value={filters.min_price}
                onChange={(e) => setFilters({ ...filters, min_price: e.target.value })} />
              <input type="number" placeholder="Max" value={filters.max_price}
                onChange={(e) => setFilters({ ...filters, max_price: e.target.value })} />
            </div>

            {/* Allerjen filtresi */}
            <div className="filter-card">
              <h3>Allergens</h3>
              {allergens.map((a) => (
                <label key={a} className="check-item">
                  <input type="checkbox"
                    checked={filters.allergen_free.includes(a)}
                    onChange={() => toggleArray("allergen_free", a)}
                  /> {a}-Free
                </label>
              ))}
            </div>

            {/* Butonlar */}
            <div className="filter-actions">
              <button className="btn-apply" onClick={handleApply}>Apply Filtering</button>
              <button className="btn-reset" onClick={handleReset}>Reset</button>
            </div>

          </div>
        </div>

        {/* Ürün kartları */}
        {showResults && (
          <div className="product-grid">
            {loading && <p className="info-text">Yükleniyor...</p>}
            {!loading && products.length === 0 && <p className="info-text">Ürün bulunamadı.</p>}
            {!loading && products.map((p, i) => (
              <div key={i} className="product-card">
                {p.image_url && (
                  <img src={p.image_url} alt={p.name} className="product-image" />
                )}
                <div className="product-name">{p.name}</div>
                <div className="product-brand">{p.brand}</div>
                <div className="product-details">
                  <span>{p.energy_kcal} kcal</span>
                  <span>Sugar: {p.sugar_g}g</span>
                  <span>Volume: {p.volume}L</span>
                  <span>pH: {p.ph}</span>
                </div>
                <div className="product-footer">
                  <span className="product-price">₺{p.price}</span>
                  <span className="product-branch">{p.branch}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Beverages
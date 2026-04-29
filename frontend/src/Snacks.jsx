import { useState, useEffect } from "react"
import "./App.css"
import Sidebar from "./Sidebar"

const API = "http://127.0.0.1:8000"

function Snacks() {

  //  State tanımları 
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [snackTypes, setSnackTypes] = useState([])
  const [allergens, setAllergens] = useState([])
  const [oilTypes, setOilTypes] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [filters, setFilters] = useState({
    type: [],
    brand: [],
    supplier: [],
    min_price: "",
    max_price: "",
    min_calories: "",
    max_calories: "",
    min_protein: "",
    max_protein: "",
    max_sugar: "",
    oil_type: [],
    allergen_free: [],
    halal: null,
  })

  // API'dan filtre seçeneklerini çek
  useEffect(() => {
    fetch(`${API}/snack-brands`).then(r => r.json()).then(setBrands)
    fetch(`${API}/suppliers`).then(r => r.json()).then(setSuppliers)
    fetch(`${API}/snack-types`).then(r => r.json()).then(setSnackTypes)
    fetch(`${API}/allergens`).then(r => r.json()).then(setAllergens)
    fetch(`${API}/oil-types`).then(r => r.json()).then(setOilTypes)
  }, [])

  // Ürünleri filtreli çek
  const fetchProducts = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000)) // gecikmeyi görebilmek için ekledik
    const params = new URLSearchParams()
    filters.type.forEach(t => params.append("type", t))
    filters.brand.forEach(b => params.append("brand", b))
    filters.supplier.forEach(s => params.append("supplier", s))
    if (filters.min_price) params.append("min_price", filters.min_price)
    if (filters.max_price) params.append("max_price", filters.max_price)
    if (filters.min_calories) params.append("min_calories", filters.min_calories)
    if (filters.max_calories) params.append("max_calories", filters.max_calories)
    if (filters.min_protein) params.append("min_protein", filters.min_protein)
    if (filters.max_protein) params.append("max_protein", filters.max_protein)
    if (filters.max_sugar) params.append("max_sugar", filters.max_sugar)
    if (filters.halal !== null) params.append("halal", filters.halal)
    filters.oil_type.forEach(o => params.append("oil_type", o))
    filters.allergen_free.forEach(a => params.append("allergen_free", a))

    const res = await fetch(`${API}/snacks/filter?${params.toString()}`)
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  // Buton fonksiyonları
  const handleApply = () => {
    fetchProducts()
    setShowResults(true)
  }

  const handleReset = () => {
    setFilters({
      type: [],
      brand: [],
      supplier: [],
      min_price: "",
      max_price: "",
      min_calories: "",
      max_calories: "",
      min_protein: "",
      max_protein: "",
      max_sugar: "",
      oil_type: [],
      allergen_free: [],
      halal: null,
    })
    setShowResults(false)
    setProducts([])
  }

  // Checkbox yardımcı fonksiyonu 
  const toggleArray = (field, value) => {
    const current = filters[field]
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    setFilters({ ...filters, [field]: updated })
  }

  //  Render
  return (
    <div className="home-page">
    <Sidebar />

    
    <div className="page">

      <header className="header">
        <p>Choose your preferred snacks options and browse the available products.</p>
      </header>

      <div className="filter-section">
        <div className="filter-grid">

          <div className="filter-card">
            <h3>Snacks Type</h3>
            {snackTypes.map((t) => (
              <label key={t} className="check-item">
                <input type="checkbox"
                  checked={filters.type.includes(t)}
                  onChange={() => toggleArray("type", t)}
                /> {t}
              </label>
            ))}
          </div>

          <div className="filter-card">
            <h3>Energy (kcal)</h3>
            <input type="number" placeholder="Min" value={filters.min_calories}
              onChange={(e) => setFilters({ ...filters, min_calories: e.target.value })} />
            <input type="number" placeholder="Max" value={filters.max_calories}
              onChange={(e) => setFilters({ ...filters, max_calories: e.target.value })} />
          </div>

          <div className="filter-card">
            <h3>Protein (g)</h3>
            <input type="number" placeholder="Min" value={filters.min_protein}
              onChange={(e) => setFilters({ ...filters, min_protein: e.target.value })} />
            <input type="number" placeholder="Max" value={filters.max_protein}
              onChange={(e) => setFilters({ ...filters, max_protein: e.target.value })} />
          </div>

          <div className="filter-card">
            <h3>Sugar (g)</h3>
            <input type="number" placeholder="Max" value={filters.max_sugar}
              onChange={(e) => setFilters({ ...filters, max_sugar: e.target.value })} />
          </div>

          <div className="filter-card">
            <h3>Oil Type</h3>
            {oilTypes.map((o) => (
              <label key={o} className="check-item">
                <input type="checkbox"
                  checked={filters.oil_type.includes(o)}
                  onChange={() => toggleArray("oil_type", o)}
                /> {o}
              </label>
            ))}
          </div>

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

          <div className="filter-card">
            <h3>Price (₺)</h3>
            <input type="number" placeholder="Min" value={filters.min_price}
              onChange={(e) => setFilters({ ...filters, min_price: e.target.value })} />
            <input type="number" placeholder="Max" value={filters.max_price}
              onChange={(e) => setFilters({ ...filters, max_price: e.target.value })} />
          </div>

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

          <div className="filter-card">
            <h3>Halal</h3>
            <label className="check-item">
              <input type="radio" name="halal"
                checked={filters.halal === null}
                onChange={() => setFilters({ ...filters, halal: null })}
              /> All
            </label>
            <label className="check-item">
              <input type="radio" name="halal"
                checked={filters.halal === true}
                onChange={() => setFilters({ ...filters, halal: true })}
              /> Halal
            </label>
            <label className="check-item">
              <input type="radio" name="halal"
                checked={filters.halal === false}
                onChange={() => setFilters({ ...filters, halal: false })}
              /> Non-Halal
            </label>
          </div>

          <div className="filter-actions">
            <button className="btn-apply" onClick={handleApply}>Apply Filtering</button>
            <button className="btn-reset" onClick={handleReset}>Reset</button>
          </div>

        </div>
      </div>

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
                <span>Protein: {p.protein_g}g</span>
                <span>Sugar: {p.sugar_g}g</span>
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
export default Snacks
import { useState, useEffect } from "react"
import "./App.css"
import "./PersonalCare.css"
import Sidebar from "./Sidebar"

const API = "http://127.0.0.1:8000"

function PersonalCare() {

  //  State Tanımları
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [showResults, setShowResults] = useState(false)

  // Filtre seçenekleri 
  const [cosmeticsTypes, setCosmeticsTypes] = useState([])
  const [allSubtypes, setAllSubtypes] = useState([])          
  const [skinTypes, setSkinTypes] = useState([])
  const [targets, setTargets] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [allergens, setAllergens] = useState([])
  const [spfList, setSpfList] = useState([])
  const [productForms, setProductForms] = useState([])
  const [brands, setBrands] = useState([])
  const [suppliers, setSuppliers] = useState([])

  const customer = JSON.parse(localStorage.getItem("customer"))
  const [favoriteIds, setFavoriteIds] = useState([])

  // Kullanıcının seçtiği filtreler
  const [filters, setFilters] = useState({
    cosmetics_type: [],
    product_subtype: [],
    skin_type: [],
    targets: [],
    active_ingredients: [],
    allergens: [],
    spf: [],
    product_form: [],
    brand: [],
    supplier: [],
    min_price: "",
    max_price: "",
  })

  // ─── Sayfa Başlığı ───────────────────────────────────────────────────────
  useEffect(() => {
    document.title = "Selectra - Personal Care"
  }, [])

  // ─── Filtre Seçeneklerini Backend'den Çek ────────────────────────────────
  useEffect(() => {
    fetch(`${API}/personal-care-types`).then(r => r.json()).then(setCosmeticsTypes)
    fetch(`${API}/personal-care-subtypes`).then(r => r.json()).then(setAllSubtypes)
    fetch(`${API}/personal-care-skin-types`).then(r => r.json()).then(setSkinTypes)
    fetch(`${API}/personal-care-targets`).then(r => r.json()).then(setTargets)
    fetch(`${API}/personal-care-ingredients`).then(r => r.json()).then(setIngredients)
    fetch(`${API}/personal-care-allergens`).then(r => r.json()).then(setAllergens)
    fetch(`${API}/personal-care-spf`).then(r => r.json()).then(setSpfList)
    fetch(`${API}/personal-care-product-forms`).then(r => r.json()).then(setProductForms)
    fetch(`${API}/personal-care-brands`).then(r => r.json()).then(setBrands)
    fetch(`${API}/suppliers`).then(r => r.json()).then(setSuppliers)
  }, [])

  useEffect(() => {
  if (!customer?.customer_id) return
  fetch(`${API}/customer/${customer.customer_id}/favorites/ids`)
    .then(r => r.json())
    .then(setFavoriteIds)
  }, [])

  // DİNAMİK SUBTYPE LİSTESİ
  // Eğer kullanıcı cosmetics_type seçmemişse → tüm subtype'ları göster
  // Seçtiyse → sadece o üst kategorinin subtype'larını göster
  // Ayrıca: KULLANICININ SEÇTİĞİ subtype'lar en üste alınır (sıralama)
  const visibleSubtypes = (() => {
    let list = allSubtypes
    
    // Önce cosmetics_type'a göre filtrele
    if (filters.cosmetics_type.length > 0) {
      list = list.filter(s => filters.cosmetics_type.includes(s.cosmetics_type))
    }
    
    // Sonra seçili olanları en üste taşı (sort)
    return [...list].sort((a, b) => {
      const aSelected = filters.product_subtype.includes(a.subtype)
      const bSelected = filters.product_subtype.includes(b.subtype)
      if (aSelected && !bSelected) return -1
      if (!aSelected && bSelected) return 1
      return 0
    })
  })()

  // ─── Checkbox Yardımcı Fonksiyonu ────────────────────────────────────────
  const toggleArray = (field, value) => {
    const current = filters[field]
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    setFilters({ ...filters, [field]: updated })
  }

  // ─── Cosmetics Type Değişince Subtype Seçimini Temizle ───────────────────
  // Eğer kullanıcı bir üst kategoriyi geri açtıysa,
  // o kategoriye ait OLMAYAN subtype'ları seçim listesinden çıkar
  const toggleCosmeticsType = (value) => {
    const newCosmeticsTypes = filters.cosmetics_type.includes(value)
      ? filters.cosmetics_type.filter(v => v !== value)
      : [...filters.cosmetics_type, value]

    // Yeni seçili kategoriler ile uyumlu subtype'ları belirle
    let newSubtypeSelection = filters.product_subtype
    if (newCosmeticsTypes.length > 0) {
      const validSubtypes = allSubtypes
        .filter(s => newCosmeticsTypes.includes(s.cosmetics_type))
        .map(s => s.subtype)
      // Kullanıcının önceden seçtiği subtype'lardan sadece geçerli olanları tut
      newSubtypeSelection = filters.product_subtype.filter(st => validSubtypes.includes(st))
    }

    setFilters({
      ...filters,
      cosmetics_type: newCosmeticsTypes,
      product_subtype: newSubtypeSelection
    })
  }

  // ─── Ürünleri Filtreli Çek ───────────────────────────────────────────────
  const fetchProducts = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))  // loading'i görebilmek için
    
    const params = new URLSearchParams()
    filters.cosmetics_type.forEach(v => params.append("cosmetics_type", v))
    filters.product_subtype.forEach(v => params.append("product_subtype", v))
    filters.skin_type.forEach(v => params.append("skin_type", v))
    filters.targets.forEach(v => params.append("targets", v))
    filters.active_ingredients.forEach(v => params.append("active_ingredients", v))
    filters.allergens.forEach(v => params.append("allergens", v))
    filters.spf.forEach(v => params.append("spf", v))
    filters.product_form.forEach(v => params.append("product_form", v))
    filters.brand.forEach(v => params.append("brand", v))
    filters.supplier.forEach(v => params.append("supplier", v))
    if (filters.min_price) params.append("min_price", filters.min_price)
    if (filters.max_price) params.append("max_price", filters.max_price)

    const res = await fetch(`${API}/personal-care/filter?${params.toString()}`)
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  // ─── Butonlar ────────────────────────────────────────────────────────────
  const handleApply = () => {
    fetchProducts()
    setShowResults(true)
  }

  const handleReset = () => {
    setFilters({
      cosmetics_type: [],
      product_subtype: [],
      skin_type: [],
      targets: [],
      active_ingredients: [],
      allergens: [],
      spf: [],
      product_form: [],
      brand: [],
      supplier: [],
      min_price: "",
      max_price: "",
    })
    setShowResults(false)
    setProducts([])
  }

  const toggleFavorite = async (branchProductId) => {
  if (!customer?.customer_id) {
    alert("You must be logged in to add favorites.")
    return
  }
  const isFav = favoriteIds.includes(branchProductId)
  if (isFav) {
    await fetch(`${API}/customer/${customer.customer_id}/favorites/${branchProductId}`, {
      method: "DELETE"
    })
    setFavoriteIds(favoriteIds.filter(id => id !== branchProductId))
  } else {
    await fetch(`${API}/customer/${customer.customer_id}/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branch_product_id: branchProductId })
    })
    setFavoriteIds([...favoriteIds, branchProductId])
  }
}

  return (
    <div className="home-page">
      <Sidebar />

      <div className="page">

        <header className="header">
          <p>Choose your preferred cosmetics options and browse the available products.</p>
        </header>

        {/* 5x2 GRID — toplam 10 filtre kartı */}
        <div className="pc-filter-section">
          <div className="pc-filter-grid">

            {/* 1. Cosmetics Type */}
            <div className="filter-card">
              <h3>Cosmetics Type</h3>
              {cosmeticsTypes.map((t) => (
                <label key={t} className="check-item">
                  <input type="checkbox"
                    checked={filters.cosmetics_type.includes(t)}
                    onChange={() => toggleCosmeticsType(t)}
                  /> {t}
                </label>
              ))}
            </div>

            {/* 2. Product Subtype (DİNAMİK) */}
            <div className="filter-card">
              <h3>Product Subtype</h3>
              {visibleSubtypes.length === 0 && filters.cosmetics_type.length > 0 ? (
                <p style={{fontSize: "12px", color: "#999"}}>Bu kategoride alt tür yok.</p>
              ) : visibleSubtypes.length === 0 ? (
                <p style={{fontSize: "12px", color: "#999"}}>Önce kategori seçin (veya tümünü görmek için boş bırakın).</p>
              ) : (
                visibleSubtypes.map((s) => (
                  <label key={s.subtype} className="check-item">
                    <input type="checkbox"
                      checked={filters.product_subtype.includes(s.subtype)}
                      onChange={() => toggleArray("product_subtype", s.subtype)}
                    /> {s.subtype}
                  </label>
                ))
              )}
            </div>

            {/* 3. Skin Type */}
            <div className="filter-card">
              <h3>Skin Type</h3>
              {skinTypes.map((st) => (
                <label key={st} className="check-item">
                  <input type="checkbox"
                    checked={filters.skin_type.includes(st)}
                    onChange={() => toggleArray("skin_type", st)}
                  /> {st}
                </label>
              ))}
            </div>

            {/* 4. Targets */}
            <div className="filter-card">
              <h3>Targets</h3>
              {targets.map((t) => (
                <label key={t} className="check-item">
                  <input type="checkbox"
                    checked={filters.targets.includes(t)}
                    onChange={() => toggleArray("targets", t)}
                  /> {t}
                </label>
              ))}
            </div>

            {/* 5. Active Ingredients */}
            <div className="filter-card">
              <h3>Active Ingredients</h3>
              {ingredients.map((i) => (
                <label key={i} className="check-item">
                  <input type="checkbox"
                    checked={filters.active_ingredients.includes(i)}
                    onChange={() => toggleArray("active_ingredients", i)}
                  /> {i}
                </label>
              ))}
            </div>

            {/* 6. Allergens (Free From) */}
            <div className="filter-card">
              <h3>Allergens (Free From)</h3>
              {allergens.map((a) => (
                <label key={a} className="check-item">
                  <input type="checkbox"
                    checked={filters.allergens.includes(a)}
                    onChange={() => toggleArray("allergens", a)}
                  /> {a}
                </label>
              ))}
            </div>

            {/* 7. SPF */}
            <div className="filter-card">
              <h3>Sun Protection Factor (SPF)</h3>
              {spfList.length === 0 ? (
                <p style={{fontSize: "12px", color: "#999"}}>No SPF data available.</p>
              ) : (
                spfList.map((s) => (
                  <label key={s} className="check-item">
                    <input type="checkbox"
                      checked={filters.spf.includes(s)}
                      onChange={() => toggleArray("spf", s)}
                    /> {s}
                  </label>
                ))
              )}
            </div>

            {/* 8. Product Form */}
            <div className="filter-card">
              <h3>Product Form</h3>
              {productForms.map((pf) => (
                <label key={pf} className="check-item">
                  <input type="checkbox"
                    checked={filters.product_form.includes(pf)}
                    onChange={() => toggleArray("product_form", pf)}
                  /> {pf}
                </label>
              ))}
            </div>

            {/* 9. Suppliers */}
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

            {/* 10. Brands */}
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

            {/* 11. Price (görselinizde 11. kart) */}
            <div className="filter-card">
              <h3>Price (₺)</h3>
              <input type="number" placeholder="Min" value={filters.min_price}
                onChange={(e) => setFilters({ ...filters, min_price: e.target.value })} />
              <input type="number" placeholder="Max" value={filters.max_price}
                onChange={(e) => setFilters({ ...filters, max_price: e.target.value })} />
            </div>

            {/* Apply / Reset butonları */}
            <div className="filter-actions">
              <button className="btn-apply" onClick={handleApply}>Apply Filtering</button>
              <button className="btn-reset" onClick={handleReset}>Reset</button>
            </div>

          </div>
        </div>

        {/* Ürün kartları */}
        {showResults && (
          <div className="product-grid">
            {loading && <p className="info-text"> Loading...</p>}
            {!loading && products.length === 0 && <p className="info-text">No products found.</p>}
            {!loading && products.map((p, i) => (
              <div key={i} className="product-card">
                <button
                className={`fav-btn ${favoriteIds.includes(p.branch_product_id) ? "fav-active" : ""}`}
                onClick={() => toggleFavorite(p.branch_product_id)}
                title="Add/Remove from Favorites"
              >
                {favoriteIds.includes(p.branch_product_id) ? "♥" : "♡"}
              </button>
                {p.image_url && (
                  <img src={p.image_url} alt={p.name} className="product-image" />
                )}
                <div className="product-name">{p.name}</div>
                <div className="product-brand">{p.brand}</div>
                <div className="product-stock">Stock: {p.stock}</div>
                <div className="product-details">
                  <span>{p.cosmetics_type} → {p.product_subtype}</span>
                  {p.spf && <span>SPF: {p.spf}</span>}
                  {p.volume_ml && <span>{p.volume_ml} ml</span>}
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

export default PersonalCare
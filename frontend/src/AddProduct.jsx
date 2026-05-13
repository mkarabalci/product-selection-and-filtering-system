import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./App.css"
import "./Dashboard.css"

function AddProduct() {
  const navigate = useNavigate()
  const supplier = JSON.parse(localStorage.getItem("supplier"))

  // Şubeler
  const [branches, setBranches] = useState([])
  const [selectedBranchId, setSelectedBranchId] = useState("")

  // Arama
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [hasSearched, setHasSearched] = useState(false)  // arama yapıldı mı (sonuç boşsa "bulunamadı" göstermek için)

  // Seçilen ürün
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Fiyat ve stok
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")

  // Mesajlar
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Yeni ürün tanımlama modu (Senaryo B)
  const [mode, setMode] = useState("search")  // "search" veya "create"
  const [category, setCategory] = useState("snack")  // "snack" veya "beverage"

  // Dropdown verileri (backend'den çekilecek)
  const [brandsList, setBrandsList] = useState([])
  const [snackTypesList, setSnackTypesList] = useState([])
  const [allergensList, setAllergensList] = useState([])
  const [oilTypesList, setOilTypesList] = useState([])
  const [packagingList, setPackagingList] = useState([])

  // Yeni ürün form alanları (ortak)
  const [newProductName, setNewProductName] = useState("")
  const [newBrandName, setNewBrandName] = useState("")  // combobox: dropdown VEYA yazılan değer
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [newStock, setNewStock] = useState("")

  // Snack'e özel form alanları
  const [snacksType, setSnacksType] = useState("")
  const [energyKcal, setEnergyKcal] = useState("")
  const [proteinG, setProteinG] = useState("")
  const [sugarG, setSugarG] = useState("")
  const [selectedAllergens, setSelectedAllergens] = useState([])  // multi-select
  const [selectedOilTypes, setSelectedOilTypes] = useState([])    // multi-select
  const [packaging, setPackaging] = useState("")

  // Beverage'a özel state'ler
  const [beverageType, setBeverageType] = useState("")
  const [pH, setPH] = useState("")
  const [volume, setVolume] = useState("")
  const [bevPackaging, setBevPackaging] = useState("")  // INT (1, 6, 12...)
  const [selectedPackageTypes, setSelectedPackageTypes] = useState([])  // multi-select
  const [isLocallyProduced, setIsLocallyProduced] = useState(false)

  // Beverage için dropdown verileri
  const [beverageBrandsList, setBeverageBrandsList] = useState([])
  const [beverageTypesList, setBeverageTypesList] = useState([])
  const [packageTypesList, setPackageTypesList] = useState([])

  // Submit sırasındaki loading durumu
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Login kontrolü + şubeleri çek
  useEffect(() => {
    if (!supplier) {
      navigate("/supplier/login")
      return
    }
    fetch(`http://127.0.0.1:8000/supplier/${supplier.supplier_id}/branches`)
      .then(r => r.json())
      .then(data => {
        setBranches(data)
        // İlk şubeyi otomatik seç
        if (data.length > 0) setSelectedBranchId(data[0].id)
      })
  }, [])

  // Yeni ürün formu için gerekli dropdown verilerini çek (sayfa açıldığında bir kez)
  useEffect(() => {
   fetch("http://127.0.0.1:8000/snack-brands")
    .then(r => r.json())
    .then(setBrandsList)

   fetch("http://127.0.0.1:8000/snack-types")
    .then(r => r.json())
    .then(setSnackTypesList)

   fetch("http://127.0.0.1:8000/allergens")
    .then(r => r.json())
    .then(setAllergensList)

   fetch("http://127.0.0.1:8000/oil-types")
    .then(r => r.json())
    .then(setOilTypesList)

   fetch("http://127.0.0.1:8000/packaging-types")
    .then(r => r.json())
    .then(setPackagingList)

   fetch("http://127.0.0.1:8000/beverage-brands")
    .then(r => r.json())
    .then(setBeverageBrandsList)

   fetch("http://127.0.0.1:8000/beverage-types")
    .then(r => r.json())
    .then(setBeverageTypesList)

   fetch("http://127.0.0.1:8000/package-types")
    .then(r => r.json())
    .then(setPackageTypesList)
  }, [])

  // Arama kutusuna yazıldığında otomatik arama yapar (debounce ile)
  useEffect(() => {
    // Arama kutusu boşsa sonuçları temizle
    if (searchQuery.trim() === "") {
      setSearchResults([])
      setHasSearched(false)
      return
    }

    // 300ms bekle, kullanıcı yazmaya devam ediyorsa boşuna istek atma
    const timer = setTimeout(() => {
      fetch(`http://127.0.0.1:8000/products/search?q=${encodeURIComponent(searchQuery)}`)
        .then(r => r.json())
        .then(data => {
          setSearchResults(data)
          setHasSearched(true)
        })
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Ürün seçilince
  const handleSelectProduct = (product) => {
    setSelectedProduct(product)
    setErrorMessage("")
    setSuccessMessage("")
  }

  // Seçimi iptal et
  const handleClearSelection = () => {
    setSelectedProduct(null)
    setPrice("")
    setStock("")
    setErrorMessage("")
  }

  // Şubeye ekle
  const handleAddToBranch = async () => {
    setErrorMessage("")
    setSuccessMessage("")

    // Doğrulama
    if (!selectedBranchId) {
      setErrorMessage("Lütfen bir şube seçin")
      return
    }
    if (!selectedProduct) {
      setErrorMessage("Lütfen bir ürün seçin")
      return
    }
    const priceNum = parseFloat(price)
    const stockNum = parseInt(stock)
    if (isNaN(priceNum) || priceNum < 0) {
      setErrorMessage("Geçerli bir fiyat girin")
      return
    }
    if (isNaN(stockNum) || stockNum < 0) {
      setErrorMessage("Geçerli bir stok değeri girin")
      return
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/supplier/${supplier.supplier_id}/branches/${selectedBranchId}/products`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: selectedProduct.id,
            price: priceNum,
            stock_quantity: stockNum
          })
        }
      )

      if (!response.ok) {
        const err = await response.json()
        setErrorMessage(err.detail || "Ekleme başarısız")
        return
      }

      // Başarılı — formu sıfırla
      const branchName = branches.find(b => b.id === parseInt(selectedBranchId))?.name
      setSuccessMessage(`✅ "${selectedProduct.name}" başarıyla "${branchName}" şubesine eklendi`)
      setSelectedProduct(null)
      setSearchQuery("")
      setSearchResults([])
      setPrice("")
      setStock("")
      setHasSearched(false)
    } catch (err) {
      setErrorMessage("Sunucuya bağlanılamadı")
    }
  }

  // Yeni ürün tanımlama submit (Senaryo B)
const handleCreateNewProduct = async () => {
  setErrorMessage("")
  setSuccessMessage("")

  // Doğrulama
  if (!selectedBranchId) {
    setErrorMessage("Lütfen bir şube seçin")
    return
  }
  if (!newProductName.trim()) {
    setErrorMessage("Ürün adı boş olamaz")
    return
  }
  if (!newBrandName.trim()) {
    setErrorMessage("Marka adı boş olamaz")
    return
  }
  const priceNum = parseFloat(newPrice)
  const stockNum = parseInt(newStock)
  if (isNaN(priceNum) || priceNum < 0) {
    setErrorMessage("Geçerli bir fiyat girin")
    return
  }
  if (isNaN(stockNum) || stockNum < 0) {
    setErrorMessage("Geçerli bir stok değeri girin")
    return
  }

  setIsSubmitting(true)

  try {
    // 1. Önce markayı oluştur/getir
    const brandResp = await fetch("http://127.0.0.1:8000/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newBrandName.trim() })
    })
    if (!brandResp.ok) {
      const err = await brandResp.json()
      setErrorMessage(err.detail || "Marka eklenemedi")
      setIsSubmitting(false)
      return
    }
    const brandData = await brandResp.json()
    const brandId = brandData.id

   // Kategoriye göre endpoint ve body'yi belirle
let endpoint, body
if (category === "snack") {
  endpoint = `http://127.0.0.1:8000/supplier/${supplier.supplier_id}/branches/${selectedBranchId}/snacks`
  body = {
    name: newProductName.trim(),
    brand_id: brandId,
    image_url: newImageUrl.trim() || null,
    snacks_type: snacksType || null,
    energy_kcal: energyKcal ? parseInt(energyKcal) : null,
    protein_g: proteinG ? parseFloat(proteinG) : null,
    sugar_g: sugarG ? parseFloat(sugarG) : null,
    allergens: selectedAllergens,
    oil_type: selectedOilTypes,
    packaging: packaging || null,
    price: priceNum,
    stock_quantity: stockNum
  }
} else {
  // beverage
  endpoint = `http://127.0.0.1:8000/supplier/${supplier.supplier_id}/branches/${selectedBranchId}/beverages`
  body = {
    name: newProductName.trim(),
    brand_id: brandId,
    image_url: newImageUrl.trim() || null,
    beverage_type: beverageType || null,
    energy_kcal: energyKcal ? parseInt(energyKcal) : null,
    pH: pH ? parseFloat(pH) : null,
    sugar_g: sugarG ? parseFloat(sugarG) : null,
    volume: volume ? parseFloat(volume) : null,
    packaging: bevPackaging ? parseInt(bevPackaging) : null,
    package_type: selectedPackageTypes,
    allergens: selectedAllergens,
    is_locally_produced: isLocallyProduced,
    price: priceNum,
    stock_quantity: stockNum
  }
}

const productResp = await fetch(endpoint, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body)
})

    if (!productResp.ok) {
      const err = await productResp.json()
      setErrorMessage(err.detail || "Ürün eklenemedi")
      setIsSubmitting(false)
      return
    }

    // Başarılı — formu sıfırla, search moduna dön
    const branchName = branches.find(b => b.id === parseInt(selectedBranchId))?.name
    setSuccessMessage(`✅ "${newProductName}" başarıyla "${branchName}" şubesine eklendi`)

    // Tüm form alanlarını temizle
    setMode("search")
    setSearchQuery("")
    setHasSearched(false)
    setNewProductName("")
    setNewBrandName("")
    setNewImageUrl("")
    setSnacksType("")
    setEnergyKcal("")
    setProteinG("")
    setSugarG("")
    setSelectedAllergens([])
    setSelectedOilTypes([])
    setPackaging("")
    setNewPrice("")
    setNewStock("")
    setBeverageType("")
    setPH("")
    setVolume("")
    setBevPackaging("")
    setSelectedPackageTypes([])
    setIsLocallyProduced(false)
  } catch (err) {
    setErrorMessage("Sunucuya bağlanılamadı")
  } finally {
    setIsSubmitting(false)
  }
}

// Form input'ları için ortak stil
const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "14px",
  boxSizing: "border-box"
}

// Çoklu seçim checkbox grid'i
const checkboxGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: "8px",
  padding: "10px",
  backgroundColor: "white",
  borderRadius: "6px",
  border: "1px solid #ddd"
}


  // Sayfa başlığını ayarla
useEffect(() => {
  document.title = "Selectra - Add Product"
}, [])

  return (
    <div className="home-page">
      {/* Sol sidebar */}
      <aside className="sidebar">
        <h2>SELECTRA</h2>
        <nav>
          <a style={{cursor: "pointer"}} onClick={() => navigate("/supplier/dashboard")}>Supplier's Dashboard</a>
          <a style={{cursor: "pointer"}} onClick={() => navigate("/supplier/products")}>My Products</a>
          <a href="#" style={{fontWeight: "bold"}}>Add New Product</a>
          <a href="#">Live Support</a>
          <a style={{cursor: "pointer"}} onClick={() => {
            localStorage.removeItem("supplier")
            navigate("/supplier/login")
          }}>Exit</a>
        </nav>
      </aside>

      {/* Ana içerik */}
      <main className="home-main">
        <h2>Add New Product</h2>
        <p style={{color: "#666", marginBottom: "20px"}}>
          Mevcut bir ürünü şubenize ekleyin
        </p>

        {/* Başarı mesajı */}
        {successMessage && (
          <div style={{
            backgroundColor: "#e8f5e9",
            color: "#2e7d32",
            padding: "12px 18px",
            borderRadius: "8px",
            marginBottom: "15px",
            border: "1px solid #a5d6a7"
          }}>
            {successMessage}
          </div>
        )}

        {/* Hata mesajı */}
        {errorMessage && (
          <div style={{
            backgroundColor: "#fee",
            color: "#c00",
            padding: "12px 18px",
            borderRadius: "8px",
            marginBottom: "15px",
            border: "1px solid #fcc"
          }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Form kartı */}
        <div style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          maxWidth: "700px"
        }}>

          {/* Şube seçici */}
          <div style={{marginBottom: "20px"}}>
            <label style={{display: "block", marginBottom: "8px", fontWeight: "600"}}>
              Şube
            </label>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                fontSize: "14px"
              }}
            >
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Ürün arama */}
          <div style={{marginBottom: "20px"}}>
            <label style={{display: "block", marginBottom: "8px", fontWeight: "600"}}>
              Ürün ara
            </label>
            <input
              type="text"
              placeholder="Ürün adı yazın (örn: dido, coca-cola...)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setSelectedProduct(null)  // arama değişince seçim sıfırlansın
              }}
              disabled={selectedProduct !== null}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                fontSize: "14px",
                backgroundColor: selectedProduct ? "#f5f5f5" : "white"
              }}
            />
          </div>

          {/* Arama sonuçları — sadece ürün seçilmemişse göster */}
          {mode === "search" && !selectedProduct && searchQuery.trim() !== "" && (
            <div style={{marginBottom: "20px"}}>
              {searchResults.length > 0 ? (
                <div style={{
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  maxHeight: "200px",
                  overflowY: "auto"
                }}>
                  {searchResults.map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectProduct(p)}
                      style={{
                        padding: "10px 15px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
                    >
                      <span><strong>{p.name}</strong> — {p.brand}</span>
                      <span style={{color: "#666", fontSize: "13px"}}>{p.category}</span>
                    </div>
                  ))}
                </div>
              ) : hasSearched ? (
                // Arama yapıldı ama sonuç yok — B senaryosuna yönlendir
                <div style={{
                  padding: "15px",
                  backgroundColor: "#fff8e1",
                  borderRadius: "6px",
                  border: "1px solid #ffe082"
                }}>
                  <p style={{margin: "0 0 10px 0"}}>
                    ⚠️ "<strong>{searchQuery}</strong>" sistemde bulunamadı.
                  </p>
                  <button
                    onClick={() => {
                      setMode("create")
                      setSelectedProduct(null)
                    }}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#1976d2",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Yeni Ürün Tanımla 
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {/* Ürün seçilmişse — fiyat/stok formu */}
          {selectedProduct && (
            <>
              <div style={{
                padding: "15px",
                backgroundColor: "#e3f2fd",
                borderRadius: "6px",
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  ✅ Seçilen ürün: <strong>{selectedProduct.name}</strong> ({selectedProduct.brand}, {selectedProduct.category})
                </div>
                <button
                  onClick={handleClearSelection}
                  style={{
                    padding: "4px 10px",
                    backgroundColor: "transparent",
                    color: "#1976d2",
                    border: "1px solid #1976d2",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Değiştir
                </button>
              </div>

              <div style={{display: "flex", gap: "15px", marginBottom: "20px"}}>
                <div style={{flex: 1}}>
                  <label style={{display: "block", marginBottom: "8px", fontWeight: "600"}}>
                    Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                      fontSize: "14px"
                    }}
                  />
                </div>
                <div style={{flex: 1}}>
                  <label style={{display: "block", marginBottom: "8px", fontWeight: "600"}}>
                    Stok adedi
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                      fontSize: "14px"
                    }}
                  />
                </div>
              </div>

              <button
                onClick={handleAddToBranch}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#4caf50",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  width: "100%"
                }}
              >
                Şubeme Ekle
              </button>
            </>
          )}
          {/* Senaryo B: Yeni ürün tanımlama formu */}
          {mode === "create" && !selectedProduct && (
            <div style={{
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              border: "1px solid #e0e0e0"
         }}>
             <div style={{
             display: "flex",
             justifyContent: "space-between",
             alignItems: "center",
             marginBottom: "20px"
          }}>
            <h3 style={{margin: 0}}>Yeni Ürün Tanımla</h3>
            <button
              onClick={() => {
               setMode("search")
               setSearchQuery("")
               setHasSearched(false)
            }}
           style={{
             padding: "4px 10px",
             backgroundColor: "transparent",
             color: "#666",
             border: "1px solid #ccc",
             borderRadius: "4px",
             cursor: "pointer"
           }}
      >
        İptal
      </button>
    </div>

    {/* Kategori seçimi */}
    <div style={{marginBottom: "20px"}}>
      <label style={{display: "block", marginBottom: "8px", fontWeight: "600"}}>
        Kategori
      </label>
      <div style={{display: "flex", gap: "20px"}}>
        <label style={{cursor: "pointer"}}>
          <input
            type="radio"
            name="category"
            value="snack"
            checked={category === "snack"}
            onChange={(e) => setCategory(e.target.value)}
          />
          {" "}Snack
        </label>
        <label style={{cursor: "pointer"}}>
          <input
            type="radio"
            name="category"
            value="beverage"
            checked={category === "beverage"}
            onChange={(e) => setCategory(e.target.value)}
          />
          {" "}Beverage
        </label>
      </div>
    </div>

    {/* Snack formu */}
{category === "snack" && (
  <>
    {/* Ürün adı */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Ürün adı *
      </label>
      <input
        type="text"
        placeholder="Örn: Eti Cin Limonlu"
        value={newProductName}
        onChange={(e) => setNewProductName(e.target.value)}
        style={inputStyle}
      />
    </div>

    {/* Marka (combobox) */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Marka *
      </label>
      <input
        type="text"
        list="brands-list"
        placeholder="Mevcut markadan seç veya yeni yaz"
        value={newBrandName}
        onChange={(e) => setNewBrandName(e.target.value)}
        style={inputStyle}
      />
      <datalist id="brands-list">
        {brandsList.map(b => <option key={b} value={b} />)}
      </datalist>
    </div>

    {/* Görsel URL */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Görsel URL (opsiyonel)
      </label>
      <input
        type="text"
        placeholder="https://..."
        value={newImageUrl}
        onChange={(e) => setNewImageUrl(e.target.value)}
        style={inputStyle}
      />
    </div>

    {/* Snack tipi */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Snack tipi
      </label>
      <select
        value={snacksType}
        onChange={(e) => setSnacksType(e.target.value)}
        style={inputStyle}
      >
        <option value="">Seçiniz...</option>
        {snackTypesList.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>

    {/* Packaging */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Packaging
      </label>
      <select
        value={packaging}
        onChange={(e) => setPackaging(e.target.value)}
        style={inputStyle}
      >
        <option value="">Seçiniz...</option>
        {packagingList.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
    </div>

    {/* Besin değerleri (3'lü grid) */}
    <div style={{display: "flex", gap: "10px", marginBottom: "15px"}}>
      <div style={{flex: 1}}>
        <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
          Kalori (kcal)
        </label>
        <input
          type="number"
          value={energyKcal}
          onChange={(e) => setEnergyKcal(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{flex: 1}}>
        <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
          Protein (g)
        </label>
        <input
          type="number"
          step="0.01"
          value={proteinG}
          onChange={(e) => setProteinG(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{flex: 1}}>
        <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
          Şeker (g)
        </label>
        <input
          type="number"
          step="0.01"
          value={sugarG}
          onChange={(e) => setSugarG(e.target.value)}
          style={inputStyle}
        />
      </div>
    </div>

    {/* Allerjenler (multi-checkbox) */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Allerjenler
      </label>
      <div style={checkboxGridStyle}>
        {allergensList.map(a => (
          <label key={a} style={{cursor: "pointer", fontSize: "14px"}}>
            <input
              type="checkbox"
              checked={selectedAllergens.includes(a)}
              onChange={() => {
                setSelectedAllergens(
                  selectedAllergens.includes(a)
                    ? selectedAllergens.filter(x => x !== a)
                    : [...selectedAllergens, a]
                )
              }}
            />
            {" "}{a}
          </label>
        ))}
      </div>
    </div>

    {/* Oil Types (multi-checkbox) */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Oil Types
      </label>
      <div style={checkboxGridStyle}>
        {oilTypesList.map(o => (
          <label key={o} style={{cursor: "pointer", fontSize: "14px"}}>
            <input
              type="checkbox"
              checked={selectedOilTypes.includes(o)}
              onChange={() => {
                setSelectedOilTypes(
                  selectedOilTypes.includes(o)
                    ? selectedOilTypes.filter(x => x !== o)
                    : [...selectedOilTypes, o]
                )
              }}
            />
            {" "}{o}
          </label>
        ))}
      </div>
    </div>

    {/* Fiyat ve Stok */}
    <div style={{display: "flex", gap: "10px", marginBottom: "20px"}}>
      <div style={{flex: 1}}>
        <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
          Fiyat (₺) *
        </label>
        <input
          type="number"
          step="0.01"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{flex: 1}}>
        <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
          Stok adedi *
        </label>
        <input
          type="number"
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
          style={inputStyle}
        />
      </div>
    </div>

    {/* Submit butonu */}
    <button
      onClick={handleCreateNewProduct}
      disabled={isSubmitting}
      style={{
        padding: "12px 24px",
        backgroundColor: isSubmitting ? "#9e9e9e" : "#4caf50",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: isSubmitting ? "not-allowed" : "pointer",
        width: "100%"
      }}
    >
      {isSubmitting ? "Ekleniyor..." : "Ürünü Ekle"}
    </button>
  </>
)}

{/* Beverage formu */}
{category === "beverage" && (
  <>
    {/* Ürün adı */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Ürün adı *
      </label>
      <input
        type="text"
        placeholder="Örn: Pınar Su 1L"
        value={newProductName}
        onChange={(e) => setNewProductName(e.target.value)}
        style={inputStyle}
      />
    </div>

    {/* Marka (combobox) — beverage-brands kullanıyor */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Marka *
      </label>
      <input
        type="text"
        list="beverage-brands-list"
        placeholder="Mevcut markadan seç veya yeni yaz"
        value={newBrandName}
        onChange={(e) => setNewBrandName(e.target.value)}
        style={inputStyle}
      />
      <datalist id="beverage-brands-list">
        {beverageBrandsList.map(b => <option key={b} value={b} />)}
      </datalist>
    </div>

    {/* Görsel URL */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Görsel URL (opsiyonel)
      </label>
      <input
        type="text"
        placeholder="https://..."
        value={newImageUrl}
        onChange={(e) => setNewImageUrl(e.target.value)}
        style={inputStyle}
      />
    </div>

    {/* Beverage tipi (combobox — yeni tip de yazılabilsin) */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        İçecek tipi
      </label>
      <input
        type="text"
        list="beverage-types-list"
        placeholder="Mevcut tipten seç veya yeni yaz"
        value={beverageType}
        onChange={(e) => setBeverageType(e.target.value)}
        style={inputStyle}
      />
      <datalist id="beverage-types-list">
        {beverageTypesList.map(t => <option key={t} value={t} />)}
      </datalist>
    </div>

    {/* Besin değerleri */}
    <div style={{display: "flex", gap: "10px", marginBottom: "15px"}}>
      <div style={{flex: 1}}>
        <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
          Kalori (kcal)
        </label>
        <input
          type="number"
          value={energyKcal}
          onChange={(e) => setEnergyKcal(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{flex: 1}}>
        <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
          Şeker (g)
        </label>
        <input
          type="number"
          step="0.01"
          value={sugarG}
          onChange={(e) => setSugarG(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{flex: 1}}>
        <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
          pH
        </label>
        <input
          type="number"
          step="0.1"
          value={pH}
          onChange={(e) => setPH(e.target.value)}
          style={inputStyle}
        />
      </div>
    </div>

    {/* Hacim ve packaging */}
    <div style={{display: "flex", gap: "10px", marginBottom: "15px"}}>
      <div style={{flex: 1}}>
        <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
          Hacim (litre)
        </label>
        <input
          type="number"
          step="0.01"
          placeholder="Örn: 0.5, 1.0, 2.0"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{flex: 1}}>
        <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
          Packaging (adet)
        </label>
        <input
          type="number"
          placeholder="1=Single, 6=6'lı..."
          value={bevPackaging}
          onChange={(e) => setBevPackaging(e.target.value)}
          style={inputStyle}
        />
      </div>
    </div>

    {/* Package Type (multi-checkbox) */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Package Type
      </label>
      <div style={checkboxGridStyle}>
        {packageTypesList.map(p => (
          <label key={p} style={{cursor: "pointer", fontSize: "14px"}}>
            <input
              type="checkbox"
              checked={selectedPackageTypes.includes(p)}
              onChange={() => {
                setSelectedPackageTypes(
                  selectedPackageTypes.includes(p)
                    ? selectedPackageTypes.filter(x => x !== p)
                    : [...selectedPackageTypes, p]
                )
              }}
            />
            {" "}{p}
          </label>
        ))}
      </div>
    </div>

    {/* Allerjenler (multi-checkbox) */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Allerjenler
      </label>
      <div style={checkboxGridStyle}>
        {allergensList.map(a => (
          <label key={a} style={{cursor: "pointer", fontSize: "14px"}}>
            <input
              type="checkbox"
              checked={selectedAllergens.includes(a)}
              onChange={() => {
                setSelectedAllergens(
                  selectedAllergens.includes(a)
                    ? selectedAllergens.filter(x => x !== a)
                    : [...selectedAllergens, a]
                )
              }}
            />
            {" "}{a}
          </label>
        ))}
      </div>
    </div>

    {/* Yerli üretim checkbox */}
    <div style={{marginBottom: "15px"}}>
      <label style={{cursor: "pointer", fontSize: "14px"}}>
        <input
          type="checkbox"
          checked={isLocallyProduced}
          onChange={(e) => setIsLocallyProduced(e.target.checked)}
        />
        {" "}Yerli üretim
      </label>
    </div>

    {/* Fiyat ve Stok */}
    <div style={{display: "flex", gap: "10px", marginBottom: "20px"}}>
      <div style={{flex: 1}}>
        <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
          Fiyat (₺) *
        </label>
        <input
          type="number"
          step="0.01"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{flex: 1}}>
        <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
          Stok adedi *
        </label>
        <input
          type="number"
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
          style={inputStyle}
        />
      </div>
    </div>

    {/* Submit butonu */}
    <button
      onClick={handleCreateNewProduct}
      disabled={isSubmitting}
      style={{
        padding: "12px 24px",
        backgroundColor: isSubmitting ? "#9e9e9e" : "#4caf50",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "15px",
        fontWeight: "600",
        cursor: isSubmitting ? "not-allowed" : "pointer",
        width: "100%"
      }}
    >
      {isSubmitting ? "Ekleniyor..." : "Ürünü Ekle"}
    </button>
  </>
)}
  </div>
)}
        </div>

      </main>
    </div>
  )
}

export default AddProduct
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
  const [hasSearched, setHasSearched] = useState(false)  

  // Seçilen ürün
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Fiyat ve stok
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")

  // Mesajlar
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Yeni ürün tanımlama modu
  const [mode, setMode] = useState("search")  
  const [category, setCategory] = useState("snack")  

  // Dropdown verileri 
  const [brandsList, setBrandsList] = useState([])
  const [snackTypesList, setSnackTypesList] = useState([])
  const [allergensList, setAllergensList] = useState([])
  const [oilTypesList, setOilTypesList] = useState([])
  const [packagingList, setPackagingList] = useState([])

  // Yeni ürün form alanları ortak
  const [newProductName, setNewProductName] = useState("")
  const [newBrandName, setNewBrandName] = useState("")  
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [newStock, setNewStock] = useState("")

  // Snack'e özel form alanları
  const [snacksType, setSnacksType] = useState("")
  const [energyKcal, setEnergyKcal] = useState("")
  const [proteinG, setProteinG] = useState("")
  const [sugarG, setSugarG] = useState("")
  const [selectedAllergens, setSelectedAllergens] = useState([]) 
  const [selectedOilTypes, setSelectedOilTypes] = useState([])   
  const [packaging, setPackaging] = useState("")

  // Beverage stateler
  const [beverageType, setBeverageType] = useState("")
  const [pH, setPH] = useState("")
  const [volume, setVolume] = useState("")
  const [bevPackaging, setBevPackaging] = useState("") 
  const [selectedPackageTypes, setSelectedPackageTypes] = useState([])  
  const [isLocallyProduced, setIsLocallyProduced] = useState(false)

  // Beverage için dropdown verileri
  const [beverageBrandsList, setBeverageBrandsList] = useState([])
  const [beverageTypesList, setBeverageTypesList] = useState([])
  const [packageTypesList, setPackageTypesList] = useState([])

    // Personal Care'e özel state'ler
  const [pcCosmeticsType, setPcCosmeticsType] = useState("")
  const [pcProductSubtype, setPcProductSubtype] = useState("")
  const [pcSelectedSkinTypes, setPcSelectedSkinTypes] = useState([])
  const [pcSelectedTargets, setPcSelectedTargets] = useState([])
  const [pcSelectedIngredients, setPcSelectedIngredients] = useState([])
  const [pcSelectedAllergens, setPcSelectedAllergens] = useState([])
  const [pcSpf, setPcSpf] = useState("")
  const [pcProductForm, setPcProductForm] = useState("")
  const [pcVolumeMl, setPcVolumeMl] = useState("")

  // Personal Care dropdown verileri
  const [pcCosmeticsTypesList, setPcCosmeticsTypesList] = useState([])
  const [pcSubtypesList, setPcSubtypesList] = useState([])           // tüm subtype'lar
  const [pcSkinTypesList, setPcSkinTypesList] = useState([])
  const [pcTargetsList, setPcTargetsList] = useState([])
  const [pcIngredientsList, setPcIngredientsList] = useState([])
  const [pcAllergensList, setPcAllergensList] = useState([])
  const [pcSpfList, setPcSpfList] = useState([])
  const [pcProductFormsList, setPcProductFormsList] = useState([])
  const [pcBrandsList, setPcBrandsList] = useState([])

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
        if (data.length > 0) setSelectedBranchId(data[0].id)
      })
  }, [])

  // Yeni ürün formu için gerekli dropdown verilerini çek sayfa açıldığında bir kez
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

    fetch("http://127.0.0.1:8000/personal-care-types")
    .then(r => r.json())
    .then(setPcCosmeticsTypesList)

   fetch("http://127.0.0.1:8000/personal-care-subtypes")
    .then(r => r.json())
    .then(setPcSubtypesList)

   fetch("http://127.0.0.1:8000/personal-care-skin-types")
    .then(r => r.json())
    .then(setPcSkinTypesList)

   fetch("http://127.0.0.1:8000/personal-care-targets")
    .then(r => r.json())
    .then(setPcTargetsList)

   fetch("http://127.0.0.1:8000/personal-care-ingredients")
    .then(r => r.json())
    .then(setPcIngredientsList)

   fetch("http://127.0.0.1:8000/personal-care-allergens")
    .then(r => r.json())
    .then(setPcAllergensList)

   fetch("http://127.0.0.1:8000/personal-care-spf")
    .then(r => r.json())
    .then(setPcSpfList)

   fetch("http://127.0.0.1:8000/personal-care-product-forms")
    .then(r => r.json())
    .then(setPcProductFormsList)

   fetch("http://127.0.0.1:8000/personal-care-brands")
    .then(r => r.json())
    .then(setPcBrandsList)
  }, [])

  // Arama kutusuna yazıldığında otomatik arama yapar 
  useEffect(() => { // Arama kutusu boşsa sonuçları temizle
    if (searchQuery.trim() === "") {
      setSearchResults([])
      setHasSearched(false)
      return
    }

    // 300ms bekle kullanıcı yazmaya devam ediyorsa boşuna istek atma
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
      setErrorMessage("Please select a branch")
      return
    }
    if (!selectedProduct) {
      setErrorMessage("Please select a product")
      return
    }
    const priceNum = parseFloat(price)
    const stockNum = parseInt(stock)
    if (isNaN(priceNum) || priceNum < 0) {
      setErrorMessage("Please enter a valid price")
      return
    }
    if (isNaN(stockNum) || stockNum < 0) {
      setErrorMessage("Please enter a valid stock quantity")
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
        setErrorMessage(err.detail || "Addition failed")
        return
      }

      // Başarılı — formu sıfırla
      const branchName = branches.find(b => b.id === parseInt(selectedBranchId))?.name
      setSuccessMessage(`✅ "${selectedProduct.name}" successfully added to "${branchName}" branch`)
      setSelectedProduct(null)
      setSearchQuery("")
      setSearchResults([])
      setPrice("")
      setStock("")
      setHasSearched(false)
    } catch (err) {
      setErrorMessage("Failed to connect to server")
    }
  }

  // Yeni ürün tanımlama submit 
const handleCreateNewProduct = async () => {
  setErrorMessage("")
  setSuccessMessage("")

  // Doğrulama
  if (!selectedBranchId) {
    setErrorMessage("Please select a branch")
    return
  }
  if (!newProductName.trim()) {
    setErrorMessage("Product name cannot be empty")
    return
  }
  if (!newBrandName.trim()) {
    setErrorMessage("Brand name cannot be empty")
    return
  }
  const priceNum = parseFloat(newPrice)
  const stockNum = parseInt(newStock)
  if (isNaN(priceNum) || priceNum < 0) {
    setErrorMessage("Please enter a valid price")
    return
  }
  if (isNaN(stockNum) || stockNum < 0) {
    setErrorMessage("Please enter a valid stock quantity")
    return
  }

  setIsSubmitting(true)

  try {
    const brandResp = await fetch("http://127.0.0.1:8000/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newBrandName.trim() })
    })
    if (!brandResp.ok) {
      const err = await brandResp.json()
      setErrorMessage(err.detail || "Failed to add brand")
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
} else if (category === "beverage") {
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
} else {
  // personal care
  endpoint = `http://127.0.0.1:8000/supplier/${supplier.supplier_id}/branches/${selectedBranchId}/personal-care`
  body = {
    name: newProductName.trim(),
    brand_id: brandId,
    image_url: newImageUrl.trim() || null,
    cosmetics_type: pcCosmeticsType || null,
    product_subtype: pcProductSubtype || null,
    skin_type: pcSelectedSkinTypes,
    targets: pcSelectedTargets,
    active_ingredients: pcSelectedIngredients,
    allergens: pcSelectedAllergens,
    spf: pcSpf || null,
    product_form: pcProductForm || null,
    volume_ml: pcVolumeMl ? parseInt(pcVolumeMl) : null,
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
      setErrorMessage(err.detail || "Failed to add product")
      setIsSubmitting(false)
      return
    }

    // Başarılı — formu sıfırla search moduna dön
    const branchName = branches.find(b => b.id === parseInt(selectedBranchId))?.name
    setSuccessMessage(`✅ "${newProductName}" successfully added to "${branchName}" branch`)

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
    setPcCosmeticsType("")
    setPcProductSubtype("")
    setPcSelectedSkinTypes([])
    setPcSelectedTargets([])
    setPcSelectedIngredients([])
    setPcSelectedAllergens([])
    setPcSpf("")
    setPcProductForm("")
    setPcVolumeMl("")
  } catch (err) {
    setErrorMessage("Failed to connect to server")
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
        <h2 style={{cursor: "pointer"}} onClick={() => navigate("/")}>SELECTRA</h2>
        <nav>
          <a style={{cursor: "pointer"}} onClick={() => navigate("/supplier/dashboard")}>Supplier's Dashboard</a>
          <a style={{cursor: "pointer"}} onClick={() => navigate("/supplier/products")}>My Products</a>
          <a href="#" style={{fontWeight: "bold"}}>Add New Product</a>
          <a style={{cursor: "pointer"}} onClick={() => navigate("/supplier/support")}>Live Support</a>
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
          Add an existing product to your branch
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
              Search Product
            </label>
            <input
              type="text"
              placeholder="Enter product name (e.g., dido, coca-cola...)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setSelectedProduct(null)  
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
                <div style={{
                  padding: "15px",
                  backgroundColor: "#fff8e1",
                  borderRadius: "6px",
                  border: "1px solid #ffe082"
                }}>
                  <p style={{margin: "0 0 10px 0"}}>
                    ⚠️ "<strong>{searchQuery}</strong>" not found in the system.
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
                    Add New Product 
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
                  ✅ Selected Product: <strong>{selectedProduct.name}</strong> ({selectedProduct.brand}, {selectedProduct.category})
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
                  Change
                </button>
              </div>

              <div style={{display: "flex", gap: "15px", marginBottom: "20px"}}>
                <div style={{flex: 1}}>
                  <label style={{display: "block", marginBottom: "8px", fontWeight: "600"}}>
                    Price (₺)
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
                    Stock Quantity
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
                Add to Branch
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
            <h3 style={{margin: 0}}>Add New Product</h3>
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
        Cancel
      </button>
    </div>

    {/* Kategori seçimi */}
    <div style={{marginBottom: "20px"}}>
      <label style={{display: "block", marginBottom: "8px", fontWeight: "600"}}>
        Category
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
        <label style={{cursor: "pointer"}}>
          <input type="radio" name="category" value="personalcare"
            checked={category === "personalcare"} onChange={(e) => setCategory(e.target.value)} />
            {" "}Personal Care
        </label>
      </div>
    </div>

    {/* Snack formu */}
{category === "snack" && (
  <>
    {/* Ürün adı */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Product Name *
      </label>
      <input
        type="text"
        placeholder="e.g., "
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
        placeholder="Select from existing brands or enter a new one"
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
        Image URL (optional)
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
        Snack Type
      </label>
      <select
        value={snacksType}
        onChange={(e) => setSnacksType(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select...</option>
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
        <option value="">Select...</option>
        {packagingList.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
    </div>

    {/* Besin değerleri (3'lü grid) */}
    <div style={{display: "flex", gap: "10px", marginBottom: "15px"}}>
      <div style={{flex: 1}}>
        <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
          Calorie (kcal)
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
          Sugar (g)
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
        Allergens
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
          Price (₺) *
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
          Stock Quantity *
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
      {isSubmitting ? "Adding..." : "Add Product"}
    </button>
  </>
)}

{/* Beverage formu */}
{category === "beverage" && (
  <>
    {/* Ürün adı */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Product Name *
      </label>
      <input
        type="text"
        placeholder="e.g., "
        value={newProductName}
        onChange={(e) => setNewProductName(e.target.value)}
        style={inputStyle}
      />
    </div>

    {/* Marka (combobox) — beverage-brands kullanıyor */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Brand *
      </label>
      <input
        type="text"
        list="beverage-brands-list"
        placeholder="Select from existing brands or enter a new one"
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
        Image URL (optional)
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
        Beverage Type
      </label>
      <input
        type="text"
        list="beverage-types-list"
        placeholder="Select from existing types or enter a new one"
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
          Calorie (kcal)
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
          Sugar (g)
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
          Volume (L)
        </label>
        <input
          type="number"
          step="0.01"
          placeholder="e.g., 0.5, 1.0, 2.0"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{flex: 1}}>
        <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
          Packaging (units)
        </label>
        <input
          type="number"
          placeholder="e.g., 1=Single, 6=6-pack"
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
        {" "} Locally Produced
      </label>
    </div>

    {/* Fiyat ve Stok */}
    <div style={{display: "flex", gap: "10px", marginBottom: "20px"}}>
      <div style={{flex: 1}}>
        <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
          Price (₺) *
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
          Stock Quantity *
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
      {isSubmitting ? "Adding..." : "Add Product"}
    </button>
  </>
)}

{/* Personal Care formu */}
{category === "personalcare" && (
  <>
    {/* Ürün adı */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Ürün adı *
      </label>
      <input
        type="text"
        placeholder="e.g., Soft Face Cream, Vitamin C Serum..."
        value={newProductName}
        onChange={(e) => setNewProductName(e.target.value)}
        style={inputStyle}
      />
    </div>

    {/* Marka (combobox) — personal-care-brands kullanıyor */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Marka *
      </label>
      <input
        type="text"
        list="pc-brands-list"
        placeholder="Select from existing brands or enter a new one"
        value={newBrandName}
        onChange={(e) => setNewBrandName(e.target.value)}
        style={inputStyle}
      />
      <datalist id="pc-brands-list">
        {pcBrandsList.map(b => <option key={b} value={b} />)}
      </datalist>
    </div>

    {/* Image URL */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Image URL (optional)
      </label>
      <input
        type="text"
        placeholder="https://..."
        value={newImageUrl}
        onChange={(e) => setNewImageUrl(e.target.value)}
        style={inputStyle}
      />
    </div>

    {/* Cosmetics Type */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Cosmetics Type *
      </label>
      <select
        value={pcCosmeticsType}
        onChange={(e) => {
          setPcCosmeticsType(e.target.value)
          // Üst kategori değişince subtype'ı sıfırla
          setPcProductSubtype("")
        }}
        style={inputStyle}
      >
        <option value="">Select...</option>
        {pcCosmeticsTypesList.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>

    {/* Product Subtype (DİNAMİK — sadece seçili cosmetics_type'a uygun olanları göster) */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Product Subtype *
      </label>
      <select
        value={pcProductSubtype}
        onChange={(e) => setPcProductSubtype(e.target.value)}
        style={inputStyle}
        disabled={!pcCosmeticsType}
      >
        <option value="">
          {pcCosmeticsType ? "Select..." : "First select Cosmetics Type"}
        </option>
        {pcSubtypesList
          .filter(s => !pcCosmeticsType || s.cosmetics_type === pcCosmeticsType)
          .map(s => <option key={s.subtype} value={s.subtype}>{s.subtype}</option>)
        }
      </select>
    </div>

    {/* Skin Type (multi-checkbox) */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Skin Type
      </label>
      <div style={checkboxGridStyle}>
        {pcSkinTypesList.map(st => (
          <label key={st} style={{cursor: "pointer", fontSize: "14px"}}>
            <input
              type="checkbox"
              checked={pcSelectedSkinTypes.includes(st)}
              onChange={() => {
                setPcSelectedSkinTypes(
                  pcSelectedSkinTypes.includes(st)
                    ? pcSelectedSkinTypes.filter(x => x !== st)
                    : [...pcSelectedSkinTypes, st]
                )
              }}
            />
            {" "}{st}
          </label>
        ))}
      </div>
    </div>

    {/* Targets (multi-checkbox) */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Targets
      </label>
      <div style={checkboxGridStyle}>
        {pcTargetsList.map(t => (
          <label key={t} style={{cursor: "pointer", fontSize: "14px"}}>
            <input
              type="checkbox"
              checked={pcSelectedTargets.includes(t)}
              onChange={() => {
                setPcSelectedTargets(
                  pcSelectedTargets.includes(t)
                    ? pcSelectedTargets.filter(x => x !== t)
                    : [...pcSelectedTargets, t]
                )
              }}
            />
            {" "}{t}
          </label>
        ))}
      </div>
    </div>

    {/* Active Ingredients (multi-checkbox) */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Active Ingredients
      </label>
      <div style={checkboxGridStyle}>
        {pcIngredientsList.map(i => (
          <label key={i} style={{cursor: "pointer", fontSize: "14px"}}>
            <input
              type="checkbox"
              checked={pcSelectedIngredients.includes(i)}
              onChange={() => {
                setPcSelectedIngredients(
                  pcSelectedIngredients.includes(i)
                    ? pcSelectedIngredients.filter(x => x !== i)
                    : [...pcSelectedIngredients, i]
                )
              }}
            />
            {" "}{i}
          </label>
        ))}
      </div>
    </div>

    {/* Allergens / Free From (multi-checkbox) */}
    <div style={{marginBottom: "15px"}}>
      <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
        Allergens (Free From)
      </label>
      <div style={checkboxGridStyle}>
        {pcAllergensList.map(a => (
          <label key={a} style={{cursor: "pointer", fontSize: "14px"}}>
            <input
              type="checkbox"
              checked={pcSelectedAllergens.includes(a)}
              onChange={() => {
                setPcSelectedAllergens(
                  pcSelectedAllergens.includes(a)
                    ? pcSelectedAllergens.filter(x => x !== a)
                    : [...pcSelectedAllergens, a]
                )
              }}
            />
            {" "}{a}
          </label>
        ))}
      </div>
    </div>

    {/* SPF ve Product Form (yan yana) */}
    <div style={{display: "flex", gap: "10px", marginBottom: "15px"}}>
      <div style={{flex: 1}}>
        <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
          SPF (Sun Protection Factor)
        </label>
        <input
          type="text"
          list="pc-spf-list"
          placeholder="e.g., SPF 30, SPF 50+"
          value={pcSpf}
          onChange={(e) => setPcSpf(e.target.value)}
          style={inputStyle}
        />
        <datalist id="pc-spf-list">
          {pcSpfList.map(s => <option key={s} value={s} />)}
        </datalist>
      </div>
      <div style={{flex: 1}}>
        <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
          Product Form
        </label>
        <select
          value={pcProductForm}
          onChange={(e) => setPcProductForm(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select...</option>
          {pcProductFormsList.map(pf => <option key={pf} value={pf}>{pf}</option>)}
        </select>
      </div>
    </div>

    {/* Volume (ml) ve Yerli üretim */}
    <div style={{display: "flex", gap: "10px", marginBottom: "15px", alignItems: "center"}}>
      <div style={{flex: 1}}>
        <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
          Volume (ml)
        </label>
        <input
          type="number"
          placeholder="e.g., 100, 200, 500"
          value={pcVolumeMl}
          onChange={(e) => setPcVolumeMl(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={{flex: 1, paddingTop: "20px"}}>
        <label style={{cursor: "pointer", fontSize: "14px"}}>
          <input
            type="checkbox"
            checked={isLocallyProduced}
            onChange={(e) => setIsLocallyProduced(e.target.checked)}
          />
          {" "}Locally Produced
        </label>
      </div>
    </div>

    {/* Price and Stock */}
    <div style={{display: "flex", gap: "10px", marginBottom: "20px"}}>
      <div style={{flex: 1}}>
        <label style={{display: "block", marginBottom: "6px", fontWeight: "600"}}>
          Price (₺) *
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
          Stock Quantity *
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
      {isSubmitting ? "Adding..." : "Add Product"}
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
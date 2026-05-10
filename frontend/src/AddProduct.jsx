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
          {!selectedProduct && searchQuery.trim() !== "" && (
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
                    disabled
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#ccc",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "not-allowed"
                    }}
                  >
                    Yeni Ürün Tanımla (yakında aktif)
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
        </div>

      </main>
    </div>
  )
}

export default AddProduct
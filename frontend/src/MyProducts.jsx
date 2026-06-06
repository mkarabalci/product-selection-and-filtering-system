import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./App.css"
import "./Dashboard.css"

function MyProducts() {
  const navigate = useNavigate()
  const supplier = JSON.parse(localStorage.getItem("supplier"))

  const [products, setProducts] = useState([])

  const [searchQuery, setSearchQuery] = useState("")

  const [selectedBranch, setSelectedBranch] = useState("")


  // Düzenleme state'leri
  const [editingId, setEditingId] = useState(null)
  const [editPrice, setEditPrice] = useState("")
  const [editStock, setEditStock] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Ürünleri çek
  const fetchProducts = () => {
    fetch(`http://127.0.0.1:8000/supplier/${supplier.supplier_id}/products`)
      .then(r => r.json())
      .then(setProducts)
  }

  useEffect(() => {
    document.title = "Selectra — My Products"
    if (!supplier) {
      navigate("/supplier/login")
      return
    }
    fetchProducts()
  }, [])

  // Düzenle
  const handleEdit = (product) => {
    setEditingId(product.id)
    setEditPrice(product.price)
    setEditStock(product.stock)
    setErrorMessage("")
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditPrice("")
    setEditStock("")
    setErrorMessage("")
  }

  const handleSave = async (branchProductId) => {
    setErrorMessage("")
    const priceNum = parseFloat(editPrice)
    const stockNum = parseInt(editStock)
    if (isNaN(priceNum) || priceNum < 0) {
      setErrorMessage("Please enter a valid price")
      return
    }
    if (isNaN(stockNum) || stockNum < 0) {
      setErrorMessage("Please enter a valid stock value")
      return
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/supplier/${supplier.supplier_id}/products/${branchProductId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price: priceNum, stock_quantity: stockNum })
        }
      )
      if (!response.ok) {
        const err = await response.json()
        setErrorMessage(err.detail || "Update failed")
        return
      }
      handleCancel()
      fetchProducts()
    } catch (err) {
      setErrorMessage("Could not connect to server")
    }
  }

  const handleDelete = async (branchProductId, productName, branchName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}" from "${branchName}"?`
    )
    if (!confirmed) return

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/supplier/${supplier.supplier_id}/products/${branchProductId}`,
        { method: "DELETE" }
      )
      if (!response.ok) {
        const err = await response.json()
        setErrorMessage(err.detail || "Delete failed")
        return
      }
      fetchProducts()
    } catch (err) {
      setErrorMessage("Could not connect to server")
    }
  }

  const openInMaps = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    window.open(url, "_blank")
  }


  const branchOptions = [...new Set(products.map(p => p.branch))].sort()

  
  const filteredProducts = products
    // 1) Branch filter
    .filter(p => {
      if (!selectedBranch) return true  
      return p.branch === selectedBranch
    })
    // 2) Search filter (product name OR category)
    .filter(p => {
      const q = searchQuery.toLowerCase().trim()
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    })

  return (
    <div className="home-page">
      {/* Sol sidebar */}
      <aside className="sidebar">
        <h2>SELECTRA</h2>
        <nav>
          <a style={{cursor: "pointer"}} onClick={() => navigate("/supplier/dashboard")}>Supplier's Dashboard</a>
          <a style={{cursor: "pointer"}} onClick={() => navigate("/supplier/products/new")}>Add New Product</a>
          <a href="#">Live Support</a>
          <a href="#" style={{fontWeight: "bold", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "4px", padding: "5px 8px"}}>My Products</a>
          <a style={{cursor: "pointer"}} onClick={() => {
            localStorage.removeItem("supplier")
            navigate("/supplier/login")
          }}>Exit</a>
        </nav>
      </aside>

      {/* Ana içerik */}
      <main className="home-main">

        {/* Arama kutusu */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "15px 20px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}>
          <span style={{fontSize: "20px", marginRight: "10px"}}>🔍</span>
          <input
            type="text"
            placeholder="Search by product name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "16px",
              backgroundColor: "transparent"
            }}
          />
        </div>

        {/* Hata mesajı */}
        {errorMessage && (
          <div style={{
            backgroundColor: "#fee",
            color: "#c00",
            padding: "10px 15px",
            borderRadius: "8px",
            marginBottom: "15px",
            border: "1px solid #fcc"
          }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Tablo */}
        <div className="dashboard-table-section">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock Quantity</th>
                <th>
                  <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                    <span>Branch</span>
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        fontSize: "13px",
                        backgroundColor: "white",
                        cursor: "pointer",
                        fontWeight: "normal"
                      }}
                    >
                      <option value="">All Branches</option>
                      {branchOptions.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" style={{textAlign: "center", padding: "30px", color: "#999"}}>
                    {searchQuery 
                    ? "No products match your search."
                      : selectedBranch
                      ? `No products in "${selectedBranch}".`
                      : "No products added yet."}
                  </td>
                </tr>
              )}
              {filteredProducts.map((p) => {
                const isEditing = editingId === p.id
                const isAnotherRowEditing = editingId !== null && editingId !== p.id

                return (
                  <tr key={p.id}>
                    <td>{p.name}</td>

                    {/* Price */}
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          style={{ width: "80px", padding: "4px" }}
                        />
                      ) : (
                        `₺${p.price}`
                      )}
                    </td>

                    {/* Stock */}
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(e.target.value)}
                          style={{ width: "70px", padding: "4px" }}
                        />
                      ) : (
                        p.stock
                      )}
                    </td>

                    {/* Market */}
                     <td>{selectedBranch ? "" : p.branch}</td>

                    {/* Location — Google Maps */}
                    <td>
                      <span
                        onClick={() => openInMaps(p.branch_address || p.branch)}
                        title={`${p.branch_address || p.branch} — Open in Maps`}
                        style={{
                          cursor: "pointer",
                          fontSize: "20px"
                        }}
                      >
                        📍
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSave(p.id)}
                            style={{
                              marginRight: "5px",
                              padding: "4px 10px",
                              backgroundColor: "#4caf50",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer"
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            style={{
                              padding: "4px 10px",
                              backgroundColor: "#999",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer"
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(p)}
                            disabled={isAnotherRowEditing}
                            style={{
                              marginRight: "5px",
                              padding: "4px 10px",
                              backgroundColor: isAnotherRowEditing ? "#ccc" : "#2196f3",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: isAnotherRowEditing ? "not-allowed" : "pointer"
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name, p.branch)}
                            disabled={isAnotherRowEditing}
                            style={{
                              padding: "4px 10px",
                              backgroundColor: isAnotherRowEditing ? "#ccc" : "#f44336",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: isAnotherRowEditing ? "not-allowed" : "pointer"
                            }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default MyProducts
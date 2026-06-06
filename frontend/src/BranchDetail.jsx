import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "./App.css"
import "./Dashboard.css"

const API = "http://127.0.0.1:8000"

function BranchDetail() {
  const navigate = useNavigate()
  const { branchId } = useParams()  // URL'den şube id'sini al
  const supplier = JSON.parse(localStorage.getItem("supplier"))

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!supplier) {
      navigate("/supplier/login")
      return
    }

    fetch(`${API}/supplier/${supplier.supplier_id}/branches/${branchId}/details`)
      .then(r => {
        if (!r.ok) throw new Error("Branch not found")
        return r.json()
      })
      .then(result => {
        setData(result)
        setLoading(false)
        document.title = `Selectra — ${result.branch.name}`
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [branchId])

  // Google Maps'te şubeyi aç
  const openInMaps = () => {
    if (!data) return
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.branch.address)}`
    window.open(url, "_blank")
  }

  // Yükleniyor durumu
  if (loading) {
    return (
      <div className="home-page">
        <aside className="sidebar">
          <h2>SELECTRA</h2>
          <nav>
            <a style={{cursor: "pointer"}} onClick={() => navigate("/supplier/dashboard")}>Supplier's Dashboard</a>
            <a style={{cursor: "pointer"}} onClick={() => navigate("/supplier/products/new")}>Add New Product</a>
            <a href="#">Live Support</a>
            <a style={{cursor: "pointer"}} onClick={() => navigate("/supplier/products")}>My Products</a>
          </nav>
        </aside>
        <main className="home-main">
          <p style={{padding: "40px"}}>Loading...</p>
        </main>
      </div>
    )
  }

  // Hata durumu (örn: şube bulunamadı veya yetki yok)
  if (error || !data) {
    return (
      <div className="home-page">
        <aside className="sidebar">
          <h2>SELECTRA</h2>
          <nav>
            <a style={{cursor: "pointer"}} onClick={() => navigate("/supplier/dashboard")}>Supplier's Dashboard</a>
          </nav>
        </aside>
        <main className="home-main">
          <div style={{padding: "40px"}}>
            <h2 style={{color: "#c62828"}}>⚠️ Branch not found</h2>
            <p>This branch doesn't exist or doesn't belong to you.</p>
            <button
              onClick={() => navigate("/supplier/dashboard")}
              style={{
                padding: "10px 24px",
                backgroundColor: "#1a3a6b",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: "pointer",
                marginTop: "20px"
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    )
  }

  // Normal görüntüleme
  return (
    <div className="home-page">
      {/* Sol sidebar */}
      <aside className="sidebar">
        <h2>SELECTRA</h2>
        <nav>
          <a style={{cursor: "pointer"}} onClick={() => navigate("/supplier/dashboard")}>Supplier's Dashboard</a>
          <a style={{cursor: "pointer"}} onClick={() => navigate("/supplier/products/new")}>Add New Product</a>
          <a href="#">Live Support</a>
          <a style={{cursor: "pointer"}} onClick={() => navigate("/supplier/products")}>My Products</a>
          <a style={{cursor: "pointer"}} onClick={() => {
            localStorage.removeItem("supplier")
            navigate("/supplier/login")
          }}>Exit</a>
        </nav>
      </aside>

      {/* Ana içerik */}
      <main className="home-main">


        {/* Şube başlık ve adres */}
        <div style={{marginBottom: "30px"}}>
          <h2 style={{margin: 0}}>📍 {data.branch.name}</h2>
          <p style={{color: "#666", margin: "8px 0"}}>{data.branch.address}</p>
          <button
            onClick={openInMaps}
            style={{
              padding: "8px 16px",
              backgroundColor: "white",
              color: "#1976d2",
              border: "1px solid #1976d2",
              borderRadius: "6px",
              fontSize: "13px",
              cursor: "pointer"
            }}
          >
            📍 Open in Maps
          </button>
        </div>

        {/* İstatistik kartları */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "40px"
        }}>
          {/* Total Products */}
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{fontSize: "14px", fontWeight: "600", color: "#1a3a6b", marginBottom: "10px"}}>
              Total Products
            </h3>
            <p style={{fontSize: "32px", fontWeight: "700", color: "#1a3a6b", margin: 0}}>
              {data.stats.total_products}
            </p>
          </div>

          {/* Out of Stock */}
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: data.stats.out_of_stock > 0 ? "1px solid #c62828" : "1px solid #e0e0e0"
          }}>
            <h3 style={{
              fontSize: "14px",
              fontWeight: "600",
              color: data.stats.out_of_stock > 0 ? "#c62828" : "#1a3a6b",
              marginBottom: "10px"
            }}>
              {data.stats.out_of_stock > 0 ? "❌ Out of Stock" : "Out of Stock"}
            </h3>
            <p style={{
              fontSize: "32px",
              fontWeight: "700",
              color: data.stats.out_of_stock > 0 ? "#c62828" : "#1a3a6b",
              margin: 0
            }}>
              {data.stats.out_of_stock}
            </p>
          </div>

          {/* Low Stock */}
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: data.stats.low_stock > 0 ? "1px solid #f57c00" : "1px solid #e0e0e0"
          }}>
            <h3 style={{
              fontSize: "14px",
              fontWeight: "600",
              color: data.stats.low_stock > 0 ? "#f57c00" : "#1a3a6b",
              marginBottom: "10px"
            }}>
              {data.stats.low_stock > 0 ? "⚠️ Low Stock" : "Low Stock"}
            </h3>
            <p style={{
              fontSize: "32px",
              fontWeight: "700",
              color: data.stats.low_stock > 0 ? "#f57c00" : "#1a3a6b",
              margin: 0
            }}>
              {data.stats.low_stock}
            </p>
          </div>

          {/* Total Inventory Value */}
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{fontSize: "14px", fontWeight: "600", color: "#1a3a6b", marginBottom: "10px"}}>
              Inventory Value
            </h3>
            <p style={{fontSize: "32px", fontWeight: "700", color: "#1a3a6b", margin: 0}}>
              ₺{data.stats.total_inventory_value.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </p>
          </div>
        </div>

        {/* Ürün listesi */}
        <h3 style={{color: "#1a3a6b", marginBottom: "16px"}}>Products in This Branch</h3>

        <div className="dashboard-table-section">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {data.products.length === 0 && (
                <tr>
                  <td colSpan="4" style={{textAlign: "center", padding: "30px", color: "#999"}}>
                    No products in this branch yet.
                  </td>
                </tr>
              )}
              {data.products.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>₺{p.price.toFixed(2)}</td>
                  <td>
                    {p.stock === 0 ? (
                      <span style={{color: "#c62828", fontWeight: "600"}}>
                        ❌ Out of Stock
                      </span>
                    ) : p.stock <= 40 ? (
                      <span style={{color: "#c62828", fontWeight: "600"}}>
                        ⚠️ {p.stock}
                      </span>
                    ) : (
                      <span>{p.stock}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  )
}

export default BranchDetail
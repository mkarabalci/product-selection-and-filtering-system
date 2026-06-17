import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./App.css"
import "./Dashboard.css"

const API = "http://127.0.0.1:8000"

function SupplierDashboard() {
  const navigate = useNavigate()
  const supplier = JSON.parse(localStorage.getItem("supplier"))

  const [branches, setBranches] = useState([])
  const [stats, setStats] = useState({
    total_products: 0,
    out_of_stock: 0,
    low_stock: 0
  })
  const [branchStats, setBranchStats] = useState({})  // branchId → {total, outOfStock, lowStock}

  useEffect(() => {
    document.title = "Selectra — Supplier Dashboard"
    if (!supplier) {
      navigate("/supplier/login")
      return
    }

    // 1) Genel istatistikleri çek
    fetch(`${API}/supplier/${supplier.supplier_id}/dashboard-stats`)
      .then(r => r.json())
      .then(setStats)

    // 2) Şubeleri çek
    fetch(`${API}/supplier/${supplier.supplier_id}/branches`)
      .then(r => r.json())
      .then(async (branchList) => {
        setBranches(branchList)

        // 3) Her şube için detayları (özellikle ürün sayısı) çek
        // Promise.all ile paralel istek yapıyoruz — daha hızlı
        const detailsPromises = branchList.map(b =>
          fetch(`${API}/supplier/${supplier.supplier_id}/branches/${b.id}/details`)
            .then(r => r.json())
            .then(data => ({ branchId: b.id, stats: data.stats }))
        )
        const allDetails = await Promise.all(detailsPromises)
        
        // Branch id'sine göre map'e koy
        const statsMap = {}
        allDetails.forEach(d => {
          statsMap[d.branchId] = d.stats
        })
        setBranchStats(statsMap)
      })
  }, [])

  return (
    <div className="home-page">
      {/* Sol sidebar */}
      <aside className="sidebar">
        <h2 style={{cursor: "pointer"}} onClick={() => navigate("/")}>SELECTRA</h2>
        <nav>
          <a href="#" style={{fontWeight: "bold", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "4px", padding: "5px 8px"}}>Supplier's Dashboard</a>
          <a style={{cursor: "pointer"}} onClick={() => navigate("/supplier/products/new")}>Add New Product</a>
          <a style={{cursor: "pointer"}} onClick={() => navigate("/supplier/support")}>Live Support</a>
          <a style={{cursor: "pointer"}} onClick={() => navigate("/supplier/products")}>My Products</a>
          <a style={{cursor: "pointer"}} onClick={() => {
            localStorage.removeItem("supplier")
            navigate("/supplier/login")
          }}>Exit</a>
        </nav>
      </aside>

      {/* Ana içerik */}
      <main className="home-main">
        <h2>Welcome, {supplier?.company_name}! 👋</h2>

        {/* ─── 3 İstatistik Kartı ─── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          marginTop: "24px",
          marginBottom: "40px"
        }}>
          {/* Total Products */}
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{fontSize: "16px", fontWeight: "600", color: "#1a3a6b", marginBottom: "12px"}}>
              Total Products
            </h3>
            <p style={{fontSize: "36px", fontWeight: "700", color: "#1a3a6b", marginBottom: "8px"}}>
              {stats.total_products}
            </p>
            <p style={{fontSize: "13px", color: "#888"}}>
              Products across all your branches
            </p>
          </div>

          {/* Out of Stock */}
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: stats.out_of_stock > 0 ? "1px solid #c62828" : "1px solid #e0e0e0"
          }}>
            <h3 style={{
              fontSize: "16px",
              fontWeight: "600",
              color: stats.out_of_stock > 0 ? "#c62828" : "#1a3a6b",
              marginBottom: "12px"
            }}>
              {stats.out_of_stock > 0 ? "❌ Out of Stock" : "Out of Stock"}
            </h3>
            <p style={{
              fontSize: "36px",
              fontWeight: "700",
              color: stats.out_of_stock > 0 ? "#c62828" : "#1a3a6b",
              marginBottom: "8px"
            }}>
              {stats.out_of_stock}
            </p>
            <p style={{fontSize: "13px", color: "#888"}}>
              Products that need immediate restocking
            </p>
          </div>

          {/* Low Stock */}
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: stats.low_stock > 0 ? "1px solid #f57c00" : "1px solid #e0e0e0"
          }}>
            <h3 style={{
              fontSize: "16px",
              fontWeight: "600",
              color: stats.low_stock > 0 ? "#f57c00" : "#1a3a6b",
              marginBottom: "12px"
            }}>
              {stats.low_stock > 0 ? "⚠️ Low Stock" : "Low Stock"}
            </h3>
            <p style={{
              fontSize: "36px",
              fontWeight: "700",
              color: stats.low_stock > 0 ? "#f57c00" : "#1a3a6b",
              marginBottom: "8px"
            }}>
              {stats.low_stock}
            </p>
            <p style={{fontSize: "13px", color: "#888"}}>
              Products below 40 units
            </p>
          </div>
        </div>

        {/* ─── Şube Kartları ─── */}
        <h3 style={{color: "#1a3a6b", marginBottom: "16px"}}>My Branches</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px"
        }}>
          {branches.map(branch => {
            const bStats = branchStats[branch.id] || {}
            return (
              <div
                key={branch.id}
                onClick={() => navigate(`/supplier/branches/${branch.id}`)}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "20px",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  border: "1px solid #e0e0e0"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"
                }}
              >
                <div style={{fontSize: "18px", fontWeight: "700", color: "#1a3a6b", marginBottom: "6px"}}>
                  📍 {branch.name}
                </div>
                <div style={{fontSize: "13px", color: "#888", marginBottom: "16px"}}>
                  {branch.address}
                </div>

                <div style={{display: "flex", justifyContent: "space-between", fontSize: "14px"}}>
                  <span style={{color: "#666"}}>Products:</span>
                  <span style={{fontWeight: "600"}}>{bStats.total_products ?? "..."}</span>
                </div>
                {bStats.out_of_stock > 0 && (
                  <div style={{display: "flex", justifyContent: "space-between", fontSize: "14px", marginTop: "4px"}}>
                    <span style={{color: "#c62828"}}>❌ Out of stock:</span>
                    <span style={{color: "#c62828", fontWeight: "600"}}>{bStats.out_of_stock}</span>
                  </div>
                )}
                {bStats.low_stock > 0 && (
                  <div style={{display: "flex", justifyContent: "space-between", fontSize: "14px", marginTop: "4px"}}>
                    <span style={{color: "#f57c00"}}>⚠️ Low stock:</span>
                    <span style={{color: "#f57c00", fontWeight: "600"}}>{bStats.low_stock}</span>
                  </div>
                )}

                <div style={{
                  marginTop: "16px",
                  paddingTop: "12px",
                  borderTop: "1px solid #f0f0f0",
                  textAlign: "right",
                  color: "#1976d2",
                  fontSize: "13px",
                  fontWeight: "600"
                }}>
                  View Details →
                </div>
              </div>
            )
          })}
        </div>

        {/* Hızlı erişim butonları */}
        <div style={{marginTop: "40px", display: "flex", gap: "15px", flexWrap: "wrap"}}>
          <button
            onClick={() => navigate("/supplier/products")}
            style={{
              padding: "15px 30px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            📋 View All Products
          </button>
          <button
            onClick={() => navigate("/supplier/products/new")}
            style={{
              padding: "15px 30px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            ➕ Add New Product
          </button>
        </div>

      </main>
    </div>
  )
}

export default SupplierDashboard
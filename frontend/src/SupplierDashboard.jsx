import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./App.css"
import "./Dashboard.css"

function SupplierDashboard() {
  const navigate = useNavigate()
  const supplier = JSON.parse(localStorage.getItem("supplier"))

  const [branches, setBranches] = useState([])
  const [productCount, setProductCount] = useState(0)

  useEffect(() => {
    document.title = "Selectra — Supplier Dashboard"
    if (!supplier) {
      navigate("/supplier/login")
      return
    }
    fetch(`http://127.0.0.1:8000/supplier/${supplier.supplier_id}/branches`)
      .then(r => r.json())
      .then(setBranches)

    // Ürün sayısını çek özet bilgisi için
    fetch(`http://127.0.0.1:8000/supplier/${supplier.supplier_id}/products`)
      .then(r => r.json())
      .then(data => setProductCount(data.length))
  }, [])

  return (
    <div className="home-page">
      {/* Sol sidebar */}
      <aside className="sidebar">
        <h2>SELECTRA</h2>
        <nav>
          <a href="#" style={{fontWeight: "bold", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "4px", padding: "5px 8px"}}>Supplier's Dashboard</a>
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
        <h2>Welcome, {supplier?.company_name}! 👋</h2>

        {/* Üst kartlar */}
        <div className="dashboard-cards">

          <div className="dashboard-card">
            <h3>Total Views</h3>
            <p className="dashboard-number">+38 ⬆️</p>
            <p className="dashboard-sub">Views from the last week</p>
          </div>

          <div className="dashboard-card">
            <h3>Total Products</h3>
            <p className="dashboard-number">{productCount}</p>
            <p className="dashboard-sub">Total products in your branches</p>
          </div>

          <div className="dashboard-card">
            <h3>Analysis</h3>
            <p style={{fontSize: "48px"}}>📊</p>
            <p className="dashboard-sub">Click here for detailed analysis.</p>
          </div>

          {/* Tedarikçinin şubeleri */}
          <div className="dashboard-card">
            <h3>My Markets</h3>
            {branches.map((b) => (
              <p key={b.id} className="dashboard-branch">📍 {b.name}</p>
            ))}
          </div>

        </div>

        {/* Hızlı erişim kartları */}
        <div style={{marginTop: "30px", display: "flex", gap: "15px", flexWrap: "wrap"}}>
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
            📋 View My Products
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
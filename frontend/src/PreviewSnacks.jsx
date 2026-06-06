import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./App.css"

const API = "http://127.0.0.1:8000"

function PreviewSnacks() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch all snack products on page load (no filters, no login needed)
  useEffect(() => {
    document.title = "Selectra - Snacks Preview"
    fetch(`${API}/snacks`)
      .then(r => r.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="home-page">
      {/* Simple top bar with logo and back-to-landing link */}
      <aside className="sidebar">
         <h2 onClick={() => navigate("/")} style={{cursor: "pointer"}}>SELECTRA</h2>
        <nav>
          <a style={{
            fontWeight: "bold",
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: "4px",
            padding: "5px 8px"
          }}>Snacks</a>
          <a onClick={() => navigate("/preview/drinks")} style={{cursor: "pointer"}}>Drinks</a>
          <a onClick={() => navigate("/preview/personal-care")} style={{cursor: "pointer"}}>Personal Care</a>
        </nav>
      </aside>

      <div className="page">

        <header className="header">
          <p>Browse all snack products available in Selectra.</p>
        </header>

        {/* Login prompt — large, prominent */}
        <div style={{
          backgroundColor: "#fff3cd",
          border: "1px solid #ffc107",
          borderRadius: "12px",
          padding: "20px 28px",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div style={{flex: 1, minWidth: "300px"}}>
            <h3 style={{color: "#856404", margin: "0 0 6px 0", fontSize: "18px"}}>
              🔒 Want to filter products?
            </h3>
            <p style={{color: "#856404", margin: 0, fontSize: "14px"}}>
              Login or create an account to use advanced filtering and find products that match your needs.
            </p>
          </div>
          <div style={{display: "flex", gap: "10px"}}>
            <button
              onClick={() => navigate("/customer/login")}
              style={{
                padding: "10px 24px",
                backgroundColor: "#1a3a6b",
                color: "white",
                border: "none",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/customer/register")}
              style={{
                padding: "10px 24px",
                backgroundColor: "white",
                color: "#1a3a6b",
                border: "2px solid #1a3a6b",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Product list */}
        {loading && <p className="info-text">Loading...</p>}
        {!loading && products.length === 0 && <p className="info-text">No products found.</p>}
        {!loading && products.length > 0 && (
          <div className="product-grid">
            {products.map((p, i) => (
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

export default PreviewSnacks
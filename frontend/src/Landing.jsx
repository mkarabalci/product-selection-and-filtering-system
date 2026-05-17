import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./Landing.css"

function Landing() {
  const navigate = useNavigate()


useEffect(() => {
  document.title = "Selectra"
}, [])

  return (
    <div className="landing-page">

      {/* Üst bar */}
      <header className="landing-header">
        <h1 className="landing-logo">SELECTRA</h1>
        <div className="landing-buttons">
          <button className="btn-supplier" onClick={() => navigate("/supplier/login")}>
            Supplier's Login
          </button>
          <button className="btn-customer" onClick={() => navigate("/customer/login")}>
            Customer's Login
          </button>
        </div>
      </header>

      {/* Hero alanı */}
      <div className="landing-hero">
        <h2>Find the right products faster</h2>
        <p>Search by product, category or supplier — get quick access to the items that best fit your needs.</p>
        <div className="landing-search">
          <input type="text" placeholder="Search products, categories or suppliers" />
          <span>🔍</span>
        </div>
      </div>

      {/* Kategori kartları */}
      <div className="landing-categories">
        <h3>EXPLORE CATEGORIES</h3>
        <div className="landing-grid">
          <div className="landing-card" onClick={() => navigate("/drinks")}>
            <p>Drinks</p>
            <span>🥤</span>
          </div>
          <div className="landing-card" onClick={() => navigate("/snacks")}>
            <p>Snacks</p>
            <span>🍫</span>
          </div>
          <div className="landing-card" onClick={() => navigate("/personal-care")}>
            <p>Personal Care</p>
            <span>🧴</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <p>@2025 Selectra</p>
        <p>Smart Product Selection Platform</p>
      </footer>

    </div>
  )
}

export default Landing
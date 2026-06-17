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
        <h2>Choose the right products with confidence</h2>
        <p>
          Selectra is a product selection and filtering platform that brings supermarket products together in one place. 
          Browse categories such as snacks, drinks and personal care, then filter by brand, price and detailed attributes to quickly
          find what fits you best — and compare the same product across different branches and suppliers, all in a single view.
        </p>
        
      </div>

      {/* Kategori kartları */}
      <div className="landing-categories">
        <h3>EXPLORE CATEGORIES</h3>
        <div className="landing-grid">
          <div className="landing-card" onClick={() => navigate("/preview/drinks")}>
            <p>Drinks</p>
            <span>🥤</span>
          </div>
          <div className="landing-card" onClick={() => navigate("/preview/snacks")}>
            <p>Snacks</p>
            <span>🍫</span>
          </div>
          <div className="landing-card" onClick={() => navigate("/preview/personal-care")}>
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
import { useState, useEffect } from "react"
import "./App.css"
import Sidebar from "./Sidebar"

const API = "http://127.0.0.1:8000"

function Favorites() {
  const customer = JSON.parse(localStorage.getItem("customer"))
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = "Selectra - Favorites"
  }, [])

  useEffect(() => {
    if (!customer?.customer_id) {
      setLoading(false)
      return
    }
    fetch(`${API}/customer/${customer.customer_id}/favorites`)
      .then(r => r.json())
      .then(data => {
        setFavorites(data)
        setLoading(false)
      })
  }, [])

  const removeFavorite = async (branchProductId) => {
    await fetch(`${API}/customer/${customer.customer_id}/favorites/${branchProductId}`, {
      method: "DELETE"
    })
    setFavorites(favorites.filter(f => f.branch_product_id !== branchProductId))
  }

  return (
    <div className="home-page">
      <Sidebar />
      <div className="page">
        <header className="header">
          <p>Your favorite products</p>
        </header>

        {loading && <p className="info-text">Loading...</p>}
        {!loading && favorites.length === 0 && (
          <p className="info-text">You don't have any favorites yet.</p>
        )}

        <div className="product-grid">
          {favorites.map((f) => (
            <div key={f.branch_product_id} className="product-card">
              <button
                className="fav-btn fav-active"
                onClick={() => removeFavorite(f.branch_product_id)}
                title="Favorilerden çıkar"
              >
                ♥
              </button>

              {f.image_url && (
                <img src={f.image_url} alt={f.name} className="product-image" />
              )}
              <div className="product-name">{f.name}</div>
              <div className="product-brand">{f.brand}</div>
              <div className="product-stock">Stock: {f.stock}</div>

              <div className="product-details">
                {f.category === "Snacks" && (
                  <>
                    <span>{f.energy_kcal} kcal</span>
                    <span>Protein: {f.protein_g}g</span>
                    <span>Sugar: {f.sugar_g}g</span>
                  </>
                )}
                {f.category === "Beverages" && (
                  <>
                    <span>{f.energy_kcal} kcal</span>
                    <span>Sugar: {f.sugar_g}g</span>
                    <span>Volume: {f.volume}L</span>
                    <span>pH: {f.ph}</span>
                  </>
                )}
                {f.category === "Personal Care" && (
                  <>
                    <span>{f.cosmetics_type}{f.product_subtype ? ` → ${f.product_subtype}` : ""}</span>
                    {f.spf && <span>SPF: {f.spf}</span>}
                    {f.volume_ml && <span>{f.volume_ml} ml</span>}
                  </>
                )}
              </div>

              <div className="product-footer">
                <span className="product-price">₺{f.price}</span>
                <span className="product-branch">{f.branch}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Favorites
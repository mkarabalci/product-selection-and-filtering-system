import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./App.css"
import "./Dashboard.css"

function SupplierDashboard() {
  const navigate = useNavigate()

  // localStorage'dan tedarikçi bilgilerini al
  const supplier = JSON.parse(localStorage.getItem("supplier"))

  // Şubeler için state
  const [branches, setBranches] = useState([])

  const [products, setProducts] = useState([])

  // Login kontrolü — login olmamışsa login sayfasına yönlendir
  useEffect(() => {
    if (!supplier) {
      navigate("/supplier/login")
      return
    }
    // Tedarikçinin şubelerini çek
    fetch(`http://127.0.0.1:8000/supplier/${supplier.supplier_id}/branches`)
      .then(r => r.json())
      .then(setBranches)

    // Tedarikçinin ürünlerini çek
    fetch(`http://127.0.0.1:8000/supplier/${supplier.supplier_id}/products`)
      .then(r => r.json())
      .then(setProducts)
  }, [])

  return (
    <div className="home-page">

      {/* Sol sidebar */}
      <aside className="sidebar">
        <h2>SELECTRA</h2>
        <nav>
          <a href="#">Supplier's Dashboard</a>
          <a href="#">My Products</a>
          <a href="#">Add New Product</a>
          <a href="#">Live Support</a>
          <a style={{cursor: "pointer"}} onClick={() => {
            localStorage.removeItem("supplier")
            navigate("/supplier/login")
          }}>Exit</a>
        </nav>
      </aside>

      {/* Ana içerik */}
      <main className="home-main">

        {/* Hoşgeldin mesajı */}
        <h2>Welcome, {supplier?.company_name}! 👋</h2>

        {/* Üst kartlar */}
        <div className="dashboard-cards">

          <div className="dashboard-card">
            <h3>Total Views</h3>
            <p className="dashboard-number">+38 ⬆️</p>
            <p className="dashboard-sub">Views from the last week</p>
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

        {/* Ürün tablosu */}
        <div className="dashboard-table-section">
          <h3>My Products</h3>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
             {products.length === 0 && (
              <tr><td colSpan="4">Ürün bulunamadı.</td></tr>
           )}
           {products.map((p, i) => (
             <tr key={i}>
               <td>{p.name}</td>
               <td>{p.category}</td>
               <td>₺{p.price}</td>
               <td>{p.stock}</td>
              </tr>
            ))}
           </tbody>
          </table>
        </div>

      </main>
    </div>
  )
}

export default SupplierDashboard
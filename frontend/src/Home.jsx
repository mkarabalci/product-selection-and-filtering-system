import { useNavigate } from "react-router-dom"
import "./Home.css"
import Sidebar from "./Sidebar"

function Home() {
  const navigate = useNavigate()

  // localStorage'dan kullanıcı bilgilerini al
  const customer = JSON.parse(localStorage.getItem("customer"))

  return (
  <div className="home-page">
    
   {/* Sidebar component'i */}
<Sidebar />

    <main className="home-main">
      <h2>Welcome, {customer?.username}! 👋</h2>
      <h3>Explore categories</h3>
<div className="categories-grid">

  <div className="category-card" onClick={() => navigate("/snacks")}>
    <p>Snacks</p>
    <span>🍫</span>
  </div>

  <div className="category-card" onClick={() => navigate("/drinks")}>
    <p>Drinks</p>
    <span>🥤</span>
  </div>

  <div className="category-card" onClick={() => navigate("/personal-care")}>
    <p>Personal Care</p>
    <span>🧴</span>
  </div>

</div>
    </main>

  </div>
)
}

export default Home
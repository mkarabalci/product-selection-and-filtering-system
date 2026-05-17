import { useNavigate } from "react-router-dom"
import "./Home.css"

function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="sidebar">
      
      {/* Logo - tıklayınca ana sayfaya döner */}
      <h2 onClick={() => navigate("/")} style={{cursor: "pointer"}}>
        SELECTRA
      </h2>

      {/* Navigasyon menüsü */}
      <nav>
        <a href="#">Profile</a>
        <a href="#">Help</a>
        <a href="#">Çıkış yap</a>
      </nav>

    </aside>
  )
}

export default Sidebar
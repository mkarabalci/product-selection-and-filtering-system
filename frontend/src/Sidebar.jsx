import { useNavigate } from "react-router-dom"
import "./Home.css"

function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("customer")
    navigate("/customer/login")
  }

  return (
    <aside className="sidebar">
      <h2 onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
        SELECTRA
      </h2>

      <nav>
        <a style={{ cursor: "pointer" }} onClick={() => navigate("/customer/help")}>Help</a>
        <a style={{ cursor: "pointer" }} onClick={handleLogout}>Logout</a>
      </nav>
    </aside>
  )
}

export default Sidebar
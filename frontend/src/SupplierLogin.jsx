import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Login.css"

const API = "http://127.0.0.1:8000"

function SupplierLogin() {
  const navigate = useNavigate()

  // Form state'leri
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // Login işlemi — API'a email ve şifre gönderir
  const handleLogin = async () => {
    const res = await fetch(`${API}/supplier/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    if (res.ok) {
      const data = await res.json()
      // Tedarikçi bilgilerini localStorage'a kaydet
      localStorage.setItem("supplier", JSON.stringify(data))
      // Tedarikçi paneline yönlendir
      navigate("/supplier/dashboard")
    } else {
      setError("Email veya şifre yanlış")
    }
  }

  return (
    <div className="login-page">
      
      <h1 className="login-logo">SELECTRA</h1>

      <div className="login-box">
        
        <div className="login-tabs">
          <button className="tab-active">LOGIN</button>
          <button onClick={() => navigate("/supplier/register")}>SIGN UP</button>
        </div>

        <div className="login-form">
          
          <label>EMAIL</label>
          <input type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} />

          <label>PASSWORD</label>
          <input type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} />

          {error && <p className="login-error">{error}</p>}

          <button className="login-btn" onClick={handleLogin}>LOGIN</button>

          <p className="login-signup-link">
            Hesabın yok mu? <span onClick={() => navigate("/supplier/register")}>Sign Up</span>
          </p>

        </div>
      </div>

      <footer className="login-footer">
        <p>@2025 Selectra</p>
        <p>Smart Product Selection Platform</p>
      </footer>

    </div>
  )
}

export default SupplierLogin
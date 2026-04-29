import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Login.css"

const API = "http://127.0.0.1:8000"

function CustomerLogin() {
  const navigate = useNavigate()

  // Form state'leri
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // Login işlemi — API'a email ve şifre gönderir
  const handleLogin = async () => {
    const res = await fetch(`${API}/customer/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: fullName, email, password })
    })

    if (res.ok) {
      const data = await res.json()
      // Kullanıcı bilgilerini localStorage'a kaydet
      localStorage.setItem("customer", JSON.stringify(data))
      // Ana sayfaya yönlendir
      navigate("/")
    } else {
      setError("Email veya şifre yanlış")
    }
  }

  return (
    <div className="login-page">

      <h1 className="login-logo">SELECTRA</h1>

      <p style={{color: "white", marginBottom: "16px", fontStyle: "italic"}}>
        Are you a supplier? <span 
          onClick={() => navigate("/supplier/login")} 
          style={{cursor: "pointer", fontWeight: "700", textDecoration: "underline"}}>
          Login here
        </span>
      </p>

      <div className="login-box">

        <div className="login-tabs">
          <button className="tab-active">LOGIN</button>
          <button onClick={() => navigate("/customer/register")}>SIGN UP</button>
        </div>

        <div className="login-form">

          <label>AD SOYAD</label>
          <input type="text" value={fullName}
            onChange={(e) => setFullName(e.target.value)} />

          <label>EMAIL</label>
          <input type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} />

          <label>PASSWORD</label>
          <input type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} />

          {error && <p className="login-error">{error}</p>}

          <button className="login-btn" onClick={handleLogin}>LOGIN</button>

          <p className="login-signup-link">
            Hesabın yok mu? <span onClick={() => navigate("/customer/register")}>Sign Up</span>
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

export default CustomerLogin
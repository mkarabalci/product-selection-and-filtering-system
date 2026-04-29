import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Login.css"

const API = "http://127.0.0.1:8000"

function SupplierRegister() {
  const navigate = useNavigate()

  // Form state'leri
  const [companyName, setCompanyName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Kayıt işlemi — API'a şirket adı, email ve şifre gönderir
  const handleRegister = async () => {
    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalı")
      return
    }

    const res = await fetch(`${API}/supplier/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_name: companyName, email, password })
    })

    if (res.ok) {
      setSuccess("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...")
      setTimeout(() => navigate("/supplier/login"), 2000)
    } else {
      const data = await res.json()
      setError(data.detail)
    }
  }

  return (
    <div className="login-page">

      <h1 className="login-logo">SELECTRA</h1>

      <div className="login-box">

        <div className="login-tabs">
          <button onClick={() => navigate("/supplier/login")}>LOGIN</button>
          <button className="tab-active">SIGN UP</button>
        </div>

        <div className="login-form">

          <label>BRAND NAME</label>
          <input type="text" value={companyName}
            onChange={(e) => setCompanyName(e.target.value)} />

          <label>EMAIL</label>
          <input type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} />

          <label>PASSWORD</label>
          <input type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <p style={{fontSize: "12px", color: "#555"}}>Password: Min. 8 characters</p>

          {error && <p className="login-error">{error}</p>}
          {success && <p style={{color: "green", fontSize: "13px"}}>{success}</p>}

          <button className="login-btn" onClick={handleRegister}>SIGN UP</button>

          <p className="login-signup-link">
            Hesabın var mı? <span onClick={() => navigate("/supplier/login")}>Login</span>
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

export default SupplierRegister
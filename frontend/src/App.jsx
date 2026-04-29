import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Home"
import Snacks from "./Snacks"
import Beverages from "./Beverages"
import SupplierLogin from "./SupplierLogin"
import SupplierRegister from "./SupplierRegister"
import SupplierDashboard from "./SupplierDashboard"
import CustomerLogin from "./CustomerLogin"
import CustomerRegister from "./CustomerRegister"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/snacks" element={<Snacks />} />
        <Route path="/drinks" element={<Beverages />} />
        <Route path="/supplier/login" element={<SupplierLogin />} />
        <Route path="/supplier/register" element={<SupplierRegister />} />
        <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
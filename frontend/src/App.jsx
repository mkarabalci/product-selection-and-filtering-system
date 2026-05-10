import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Home"
import Snacks from "./Snacks"
import Beverages from "./Beverages"
import SupplierLogin from "./SupplierLogin"
import SupplierRegister from "./SupplierRegister"
import SupplierDashboard from "./SupplierDashboard"
import MyProducts from "./MyProducts"
import AddProduct from "./AddProduct"
import CustomerLogin from "./CustomerLogin"
import CustomerRegister from "./CustomerRegister"
import Landing from "./Landing"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/snacks" element={<Snacks />} />
        <Route path="/drinks" element={<Beverages />} />
        <Route path="/supplier/login" element={<SupplierLogin />} />
        <Route path="/supplier/register" element={<SupplierRegister />} />
        <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
        <Route path="/supplier/products" element={<MyProducts />} />
        <Route path="/supplier/products/new" element={<AddProduct />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
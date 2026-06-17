import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Home"
import Snacks from "./Snacks"
import Beverages from "./Beverages"
import SupplierLogin from "./SupplierLogin"
import SupplierRegister from "./SupplierRegister"
import SupplierDashboard from "./SupplierDashboard"
import SupplierSupport from "./SupplierSupport"
import BranchDetail from "./BranchDetail"
import MyProducts from "./MyProducts"
import AddProduct from "./AddProduct"
import CustomerLogin from "./CustomerLogin"
import CustomerRegister from "./CustomerRegister"
import Landing from "./Landing"
import PreviewSnacks from "./PreviewSnacks"
import PreviewBeverages from "./PreviewBeverages"
import PreviewPersonalCare from "./PreviewPersonalCare"
import PersonalCare from "./PersonalCare"
import Favorites from "./Favorites"
import CustomerHelp from "./CustomerHelp"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/snacks" element={<Snacks />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/preview/snacks" element={<PreviewSnacks />} />
        <Route path="/preview/drinks" element={<PreviewBeverages />} />
        <Route path="/preview/personal-care" element={<PreviewPersonalCare />} />
        <Route path="/drinks" element={<Beverages />} />
        <Route path="/personal-care" element={<PersonalCare />} /> 
        <Route path="/supplier/login" element={<SupplierLogin />} />
        <Route path="/supplier/register" element={<SupplierRegister />} />
        <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
        <Route path="/supplier/support" element={<SupplierSupport />} />
        <Route path="/supplier/branches/:branchId" element={<BranchDetail />} />
        <Route path="/supplier/products" element={<MyProducts />} />
        <Route path="/supplier/products/new" element={<AddProduct />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/customer/help" element={<CustomerHelp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./App.css"
import "./Dashboard.css"
import "./Support.css"

const API = "http://127.0.0.1:8000"

const FAQ = [
  {
    q: "I can't see my products",
    a: "First, refresh the page, then log out and log back in. If your product's stock is 0, it won't be listed on the customer side — add stock. If the issue persists, submit a support request using the form below.",
  },
  {
    q: "How do I add new products?",
    a: "Navigate to the 'Add New Product' page via the menu on the left and fill in the product information along with branch / stock / price fields to add them.",
  },
  {
    q: "How do I manage stock alerts?",
    a: "On the dashboard, products with less than 40 units are marked as 'Low Stock', and those with 0 units are marked as 'Out of Stock'. You can update stock levels from the 'My Products' page.",
  },
  {
    q: "Can I add a new branch?",
    a: "Branch definitions are tied to your account. You can submit a request for a new branch using the support form below.",
  },
]

function SupplierSupport() {
  const navigate = useNavigate()
  const supplier = JSON.parse(localStorage.getItem("supplier"))

  const [subject, setSubject] = useState("")
  const [category, setCategory] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [openFaq, setOpenFaq] = useState(null)
  const [messages, setMessages] = useState([])

  useEffect(() => {
   document.title = "Selectra — Live Support"
   if (!supplier) {
     navigate("/supplier/login")
     return
   }
   loadMessages()
  }, [])

  const loadMessages = () => {
    fetch(`${API}/supplier/${supplier.supplier_id}/support`)
     .then(r => r.json())
     .then(setMessages)
  }

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return
    await fetch(`${API}/supplier/${supplier.supplier_id}/support/${id}`, {
      method: "DELETE"
    })
   setMessages(messages.filter(m => m.id !== id))
  }

  const handleSubmit = async () => {
    setError("")
    if (!subject.trim() || !message.trim()) {
      setError("Please fill in both subject and message fields.")
      return
    }
    setSending(true)
    try {
      const res = await fetch(`${API}/supplier/${supplier.supplier_id}/support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, category, message }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
      setSubject(""); setCategory(""); setMessage("")
      loadMessages() 
    } catch {
      setError("Message could not be sent. Please try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="home-page">
      <aside className="sidebar">
        <h2 style={{cursor: "pointer"}} onClick={() => navigate("/")}>SELECTRA</h2>
        <nav>
          <a style={{cursor:"pointer"}} onClick={() => navigate("/supplier/dashboard")}>Supplier's Dashboard</a>
          <a style={{cursor:"pointer"}} onClick={() => navigate("/supplier/products/new")}>Add New Product</a>
          <a href="#" style={{fontWeight:"bold", backgroundColor:"rgba(255,255,255,0.15)", borderRadius:"4px", padding:"5px 8px"}}>Live Support</a>
          <a style={{cursor:"pointer"}} onClick={() => navigate("/supplier/products")}>My Products</a>
          <a style={{cursor:"pointer"}} onClick={() => {localStorage.removeItem("supplier"); navigate("/supplier/login")}}>Exit</a>
        </nav>
      </aside>

      <main className="home-main">
        <h2>Live Support</h2>
        <p className="support-intro">Are you facing any issues? First, check the frequently asked questions; if the problem persists, send us a message.</p>

        <h3 className="support-heading">Frequently Asked Questions</h3>
        <div className="faq-list">
          {FAQ.map((item, i) => (
            <div key={i} className="faq-item">
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{item.q}</span>
                <span>{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && <div className="faq-a">{item.a}</div>}
            </div>
          ))}
        </div>

        <h3 className="support-heading">Send us a message</h3>
        <div className="support-form">
          {sent && <div className="form-success">✓ Your message has been sent. We will get back to you as soon as possible.</div>}
          {error && <div className="form-error">{error}</div>}

          <label>Subject</label>
          <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="A short title" />

          <label>Category (optional)</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Choose...</option>
            <option value="Add Product">Add Product</option>
            <option value="Stock Issue">Stock Issue</option>
            <option value="Account">Account</option>
            <option value="Other">Other</option>
          </select>

          <label>Message</label>
          <textarea rows="5" value={message} onChange={e => setMessage(e.target.value)} placeholder="Detail your issue" />

          <button className="support-submit" onClick={handleSubmit} disabled={sending}>
            {sending ? "Sending..." : "Send"}
          </button>
        </div>

        <h3 className="support-heading">Live Support & Contact</h3>
        <div className="contact-box">
          <p>📧 support@selectra.com</p>
          <p>📞 +90 212 000 00 00</p>
          <p>🕘 Weekdays 09:00 – 18:00</p>
        </div>

        <h3 className="support-heading">Data Protection Notice (KVKK) </h3>
        <div className="kvkk-box">
          <p>The personal data you submit through this form (company information, contact details, and message content) is processed solely to evaluate your support request and respond to you. 
            Your data is not shared with third parties and is retained for the period required by law after your request is resolved.
            For your rights under Law No. 6698 (KVKK), you can reach us at support@selectra.com.</p>
        </div>
        <h3 className="support-heading">My Requests</h3>
        {messages.length === 0 ? (
          <p className="support-intro">You haven't sent any requests yet.</p>
        ) : (
          <div className="request-list">
            {messages.map(m => (
              <div key={m.id} className="request-item">
                <div className="request-top">
                  <span className="request-subject">{m.subject}</span>
                  <div className="request-actions">
                    <span className={`request-status status-${m.status}`}>{m.status}</span>
                    <button className="request-delete" onClick={() => deleteMessage(m.id)} title="Delete request">🗑</button>
                    </div>
                </div>
                {m.category && <div className="request-category">{m.category}</div>}
                <div className="request-message">{m.message}</div>
                <div className="request-date">{new Date(m.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default SupplierSupport
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./App.css"
import "./Home.css"
import "./Support.css"
import Sidebar from "./Sidebar"

const API = "http://127.0.0.1:8000"

const FAQ = [
  {
    q: "How do I filter products?",
    a: "Open any category from the home page, then use the filters on the left to narrow products by brand, price, and category-specific attributes such as calories or SPF.",
  },
  {
    q: "How do I add a product to my favorites?",
    a: "On any product card, click the heart icon at the top-right corner. The product is saved to your Favorites page, which you can open from the home page.",
  },
  {
    q: "Why do prices differ between branches?",
    a: "Each supplier sets its own price and stock per branch, so the same product may have different prices at different stores. The card shows the branch the listing belongs to.",
  },
  {
    q: "I can't find a product",
    a: "A product is only listed when it is in stock at a branch. If a product is out of stock everywhere, it won't appear. Try adjusting or clearing your filters.",
  },
  {
    q: "How do I create an account?",
    a: "On the login page, choose 'Sign Up' and fill in your details. Once registered, you can log in to favorite products and contact support.",
  },
]

function CustomerHelp() {
  const navigate = useNavigate()
  const customer = JSON.parse(localStorage.getItem("customer"))

  const [subject, setSubject] = useState("")
  const [category, setCategory] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [openFaq, setOpenFaq] = useState(null)
  const [messages, setMessages] = useState([])

  useEffect(() => {
    document.title = "Selectra — Help"
    if (!customer) {
      navigate("/customer/login")
      return
    }
    loadMessages()
  }, [])

  const loadMessages = () => {
    fetch(`${API}/customer/${customer.customer_id}/support`)
      .then(r => r.json())
      .then(setMessages)
  }

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return
    await fetch(`${API}/customer/${customer.customer_id}/support/${id}`, {
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
      const res = await fetch(`${API}/customer/${customer.customer_id}/support`, {
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
      <Sidebar />

      <main className="home-main">
        <h2>Help</h2>
        <p className="support-intro">Need a hand? Check the frequently asked questions first; if you still need help, send us a message.</p>

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
            <option value="Filtering">Filtering</option>
            <option value="Favorites">Favorites</option>
            <option value="Account">Account</option>
            <option value="Other">Other</option>
          </select>

          <label>Message</label>
          <textarea rows="5" value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your issue" />

          <button className="support-submit" onClick={handleSubmit} disabled={sending}>
            {sending ? "Sending..." : "Send"}
          </button>
        </div>

        <h3 className="support-heading">Contact</h3>
        <div className="contact-box">
          <p>📧 support@selectra.com</p>
          <p>📞 +90 212 000 00 00</p>
          <p>🕘 Weekdays 09:00 – 18:00</p>
        </div>

        <h3 className="support-heading">Data Protection Notice (KVKK)</h3>
        <div className="kvkk-box">
          <p>The personal data you submit through this form (contact details and message content) is processed solely to evaluate your request and respond to you. Your data is not shared with third parties and is retained for the period required by law after your request is resolved. For your rights under Law No. 6698 (KVKK), you can reach us at support@selectra.com.</p>
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

export default CustomerHelp
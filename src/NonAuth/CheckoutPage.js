import React, { useState } from 'react';
import { CheckCircle, CreditCard, Truck, User, ShoppingCart, ChevronRight, Search, Filter, Star, MapPin, Zap, TrendingUp, Award, Settings, LogOut, Key, Bell as BellIcon, Edit, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
  { label: 'Your Cart', icon: <ShoppingCart size={20} /> },
  { label: 'Details', icon: <User size={20} /> },
  { label: 'Shipping', icon: <Truck size={20} /> },
  { label: 'Payment', icon: <CreditCard size={20} /> },
  { label: 'Complete', icon: <CheckCircle size={20} /> },
];

const paypalLogo = (
  <img src="/assets/paypal-logo.png" alt="PayPal" style={{ width: 28, height: 28, marginRight: 6, verticalAlign: 'middle' }} />
);

const creditCardLogo = (
  <img src="https://cdn-icons-png.flaticon.com/512/633/633611.png" alt="Credit Card" style={{ width: 28, height: 28, marginRight: 6, verticalAlign: 'middle' }} />
);

const googlePayLogo = (
  <img src="/assets/google-pay.png" alt="Google Pay" style={{ width: 28, height: 28, marginRight: 6, verticalAlign: 'middle' }} />
);

const expressCheckout = [
  { label: 'Credit Card', color: '#5A31F4', logo: creditCardLogo },
  { label: 'PayPal', color: '#FFC439', logo: paypalLogo },
  { label: 'Google Pay', color: '#000', logo: googlePayLogo },
];
// Cart items from Home.js
const cartItems = [
  {
    name: 'iPhone 13 Pro Max',
    price: '12,999 DH',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop'
  },
  {
    name: 'iPhone 16',
    price: '18,999 DH',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop'
  },
  {
    name: 'MacBook Pro 16"',
    price: '28,999 DH',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop'
  },
  {
    name: 'iPhone 15',
    price: '15,499 DH',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop'
  }
];

// Helper to parse price string and sum
function getTotal(items) {
  return items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
    return sum + price;
  }, 0);
}

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [shipping, setShipping] = useState({
    country: 'United States',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: 'Arizona',
    zip: '',
  });
  const navigate = useNavigate();
  const subtotal = getTotal(cartItems);
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar from Home.js */}
      <header style={{ background: 'linear-gradient(90deg, #6366f1, #10b981)', padding: '1rem 0', color: 'white', marginBottom: 0 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Zap size={28} color="white" />
            <span style={{ fontWeight: 700, fontSize: '1.5rem', letterSpacing: 1, marginLeft: 12 }}>MarketPlace</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <BellIcon size={22} />
            <Settings size={22} />
            <Menu size={22} />
            <button style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              marginLeft: 10,
              padding: '4px 12px',
              borderRadius: 8,
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.target.style.background = '#ef4444'}
            onMouseLeave={e => e.target.style.background = 'none'}
            >Déconnexion</button>
          </div>
        </div>
      </header>
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Left: Form */}
        <div style={{ flex: 1, padding: '2rem 3rem', background: 'white' }}>
          <div style={{ marginBottom: 32 }}>
            {/* Progress steps only, no dermalogica title */}
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 24 }}>
              {steps.map((s, idx) => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ color: step === idx + 1 ? '#6366f1' : '#94a3b8' }}>{s.icon}</div>
                  <span style={{ fontWeight: step === idx + 1 ? 600 : 400, color: step === idx + 1 ? '#6366f1' : '#94a3b8', fontSize: '0.95rem' }}>{s.label}</span>
                  {idx < steps.length - 1 && <ChevronRight size={16} color="#94a3b8" />}
                </div>
              ))}
            </div>
          </div>
        {/* Express Checkout */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          {expressCheckout.map((btn) => (
            <button key={btn.label} style={{ display: 'flex', alignItems: 'center', gap: 8, background: btn.color, color: 'white', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>
              {btn.logo}
              {btn.label}
            </button>
          ))}
        </div>
        <div style={{ textAlign: 'center', margin: '16px 0', color: '#94a3b8' }}>OR</div>
        {/* Contact Info */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>Contact information</h3>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 8, fontSize: '1rem' }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.95rem', color: '#64748b' }}>
            <input type="checkbox" style={{ accentColor: '#6366f1' }} />
            Email me with news and offers
          </label>
        </div>
        {/* Shipping Address */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>Shipping address</h3>
          <select value={shipping.country} onChange={e => setShipping({ ...shipping, country: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 8, fontSize: '1rem' }}>
            <option>United States</option>
            <option>Morocco</option>
            <option>France</option>
            <option>UK</option>
          </select>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input type="text" placeholder="First name" value={shipping.firstName} onChange={e => setShipping({ ...shipping, firstName: e.target.value })} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '1rem' }} />
            <input type="text" placeholder="Last name" value={shipping.lastName} onChange={e => setShipping({ ...shipping, lastName: e.target.value })} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '1rem' }} />
          </div>
          <input type="text" placeholder="Address" value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 8, fontSize: '1rem' }} />
          <input type="text" placeholder="Apartment, suite, etc. (optional)" value={shipping.apartment} onChange={e => setShipping({ ...shipping, apartment: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 8, fontSize: '1rem' }} />
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input type="text" placeholder="City" value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })} style={{ flex: 2, padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '1rem' }} />
            <select value={shipping.state} onChange={e => setShipping({ ...shipping, state: e.target.value })} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '1rem' }}>
              <option>Arizona</option>
              <option>California</option>
              <option>New York</option>
              <option>Texas</option>
            </select>
            <input type="text" placeholder="ZIP code" value={shipping.zip} onChange={e => setShipping({ ...shipping, zip: e.target.value })} style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '1rem' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <button style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: 500, cursor: 'pointer' }}>&lt; Return to cart</button>
            <button style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}>Continue to shipping</button>
          </div>
        </div>
      </div>
      {/* Right: Cart Summary */}
      <div style={{ width: 400, background: '#f1f5f9', padding: '2rem 1.5rem', borderLeft: '1px solid #e2e8f0' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: 24 }}>
          {cartItems.map((item, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <img src={item.image} alt={item.name} style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', background: '#f3f4f6' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, color: '#1e293b', fontSize: '1rem' }}>{item.name}</div>
                <div style={{ color: '#64748b', fontSize: '0.95rem' }}>{item.price}</div>
              </div>
              {/* Optionally show price as number */}
            </li>
          ))}
        </ul>
        <div style={{ marginBottom: 16 }}>
          <input type="text" placeholder="Gift card or offer code" style={{ width: '70%', padding: '8px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '1rem', marginRight: 8 }} />
          <button style={{ background: '#e2e8f0', color: '#64748b', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 500, fontSize: '1rem', cursor: 'pointer' }}>Apply</button>
        </div>
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#64748b' }}>Subtotal</span>
            <span style={{ fontWeight: 500, color: '#1e293b' }}>{subtotal.toLocaleString()} DH</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#64748b' }}>Shipping <span style={{ fontSize: '0.9em', cursor: 'pointer' }}>?</span></span>
            <span style={{ color: '#64748b' }}>Calculated at next step</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', marginTop: 16 }}>
            <span>Total</span>
            <span style={{ color: '#1e293b' }}>DH <span style={{ fontWeight: 700 }}>{subtotal.toLocaleString()}</span></span>
          </div>
        </div>
      </div>
      </div>
      {/* Footer from Home.js */}
      <footer style={{ background: '#1e293b', color: 'white', padding: '2rem 0', marginTop: 'auto' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 32, marginBottom: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Zap size={20} color="white" />
                <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>MarketPlace</span>
              </div>
              <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
                La marketplace ultime pour acheter et vendre tout ce dont vous avez besoin.
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: 10 }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li><button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Browse All</button></li>
                <li><button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Sell Item</button></li>
                <li><button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>My Account</button></li>
                <li><button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Favorites</button></li>
                <li><button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>iPhone 13 Pro Max</button></li>
                <li><button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Nike Air Max 2025</button></li>
                <li><button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>MacBook Pro 16"</button></li>
                <li><button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Canon EOS Camera</button></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: 10 }}>Support</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li><button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Help Center</button></li>
                <li><button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Contact Us</button></li>
                <li><button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Safety Tips</button></li>
                <li><button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Community</button></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: 10 }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li><button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Privacy Policy</button></li>
                <li><button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Terms of Service</button></li>
                <li><button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Cookie Policy</button></li>
                <li><button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Accessibility</button></li>
              </ul>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155', paddingTop: 16 }}>
            <p style={{ color: '#94a3b8' }}>© 2025 MarketPlace. Tous droits réservés.</p>
            <div style={{ display: 'flex', gap: 16 }}>
              <button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Facebook</button>
              <button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Twitter</button>
              <button type="button" style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Instagram</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

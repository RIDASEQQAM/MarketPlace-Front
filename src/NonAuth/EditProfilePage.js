import React, { useState } from 'react';
import { Search, Heart, Bell, ShoppingCart, Menu, Zap, Settings, LogOut, Key, Bell as BellIcon, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '4rem'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  logoIcon: {
    width: '2.5rem',
    height: '2.5rem',
    background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  navButton: {
    padding: '0.5rem',
    color: '#64748b',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '0.5rem',
    transition: 'color 0.2s'
  },
  signInButton: {
    background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
    color: 'white',
    padding: '0.5rem 1.5rem',
    borderRadius: '0.75rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  userGreeting: {
    color: '#64748b',
    fontSize: '0.875rem',
    marginRight: '0.5rem'
  },
  signOutButton: {
    background: '#ef4444',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  formContainer: {
    maxWidth: '400px',
    margin: '3rem auto',
    background: 'white',
    borderRadius: '1rem',
    boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1e1b4b',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  label: {
    fontWeight: '500',
    color: '#64748b'
  },
  input: {
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border 0.2s'
  },
  buttonRow: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  },
  editButton: {
    background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
    color: 'white',
    padding: '0.75rem 2rem',
    borderRadius: '0.75rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '1rem',
    transition: 'all 0.2s'
  },
  cancelButton: {
    background: '#ef4444',
    color: 'white',
    padding: '0.75rem 2rem',
    borderRadius: '0.75rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '1rem',
    transition: 'all 0.2s'
  },
  footer: {
    background: '#0f172a',
    color: 'white',
    padding: '3rem 0',
    marginTop: '3rem'
  },
  sectionContainer: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem'
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem'
  },
  footerTitle: {
    fontWeight: '600',
    marginBottom: '1rem'
  },
  footerList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  footerListItem: {
    marginBottom: '0.5rem'
  },
  footerLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    transition: 'color 0.2s'
  },
  footerBottom: {
    borderTop: '1px solid #374151',
    marginTop: '2rem',
    paddingTop: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  copyright: {
    color: '#94a3b8',
    fontSize: '0.875rem'
  },
  socialLinks: {
    display: 'flex',
    gap: '1.5rem'
  }
};



// Navbar/footer state and handlers (minimal for Edit Profile page)
const getUserFromLocalStorage = () => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem('user');
    }
  }
  return null;
};



const EditProfilePage = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    // Try to load cart from localStorage, fallback to empty array
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'message', text: "You got a message from client 'Ahmed' on WhatsApp.", unread: true, color: '#25D366', icon: '💬' },
    { id: 2, type: 'sold', text: "Your item 'iPhone 13' was sold!", unread: true, color: '#F59E0B', icon: '🛒' },
    { id: 3, type: 'offer', text: "Your item 'MacBook Pro' received a new offer.", unread: true, color: '#3B82F6', icon: '💰' },
    { id: 4, type: 'shipped', text: "Order #12345 has been shipped.", unread: false, color: '#10B981', icon: '🚚' },
    { id: 5, type: 'payment', text: "Your payment was successful.", unread: false, color: '#8B5CF6', icon: '✅' },
    { id: 6, type: 'reply', text: "Seller 'Sara' replied to your question.", unread: true, color: '#EC4899', icon: '📩' }
  ]);
  const [user, setUser] = useState(getUserFromLocalStorage());
  const unreadCount = notifications.filter(n => n.unread).length;

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setNotifications(notifications.map(n => ({ ...n, unread: false })));
    }
  };
  const handleLogin = () => {
    window.location.href = '/login';
  };
  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };
  const handleCartClick = () => {
    setShowCart((v) => !v);
  };

  // Form state and handlers

  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Profile updated!');
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <Zap size={24} color="white" />
            </div>
            <span style={styles.logoText}>MarketPlace</span>
          </div>
          <div style={styles.navContainer}>
            {/* Notification Bell */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button style={styles.navButton} onClick={handleBellClick}>
                <Bell size={24} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    width: 10,
                    height: 10,
                    background: 'red',
                    borderRadius: '50%',
                    display: 'inline-block',
                    border: '2px solid white',
                  }}></span>
                )}
              </button>
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: 32,
                  right: 0,
                  width: 320,
                  background: 'white',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  borderRadius: 12,
                  zIndex: 100,
                  padding: 16,
                }}>
                  <h4 style={{ margin: '0 0 12px 0', fontWeight: 'bold', fontSize: '1.1rem', color: '#1e1b4b' }}>Notifications</h4>
                  {notifications.length === 0 ? (
                    <div style={{ color: '#888' }}>No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 0',
                        borderBottom: '1px solid #eee',
                        background: n.unread ? `${n.color}22` : 'transparent',
                        color: n.unread ? n.color : '#888',
                        fontWeight: n.unread ? 'bold' : 'normal',
                        borderRadius: 8,
                        transition: 'background 0.2s',
                      }}>
                        <span style={{ fontSize: 22 }}>{n.icon}</span>
                        <span style={{ flex: 1 }}>{n.text}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            {/* Settings Icon */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button style={styles.navButton} onClick={() => setShowSettings(!showSettings)}>
                <Settings size={24} />
              </button>
              {showSettings && (
                <div style={{
                  position: 'absolute',
                  top: 32,
                  right: 0,
                  width: 220,
                  background: 'white',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  borderRadius: 12,
                  zIndex: 100,
                  padding: 12,
                }}>
                  <h4 style={{ margin: '0 0 10px 0', fontWeight: 'bold', fontSize: '1.05rem', color: '#1e1b4b' }}>Settings</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: '#F3F4F6', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: '1rem', color: '#1e1b4b', fontWeight: 500
                      }}
                      onClick={() => {
                        setShowSettings(false);
                        navigate('/edit-profile');
                      }}
                    >
                      <Edit size={18} /> Edit Profile
                    </button>
                    <button style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: '#F3F4F6', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: '1rem', color: '#1e1b4b', fontWeight: 500
                    }}>
                      <Key size={18} /> Change Password
                    </button>
                    <button style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: '#F3F4F6', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: '1rem', color: '#1e1b4b', fontWeight: 500
                    }}>
                      <BellIcon size={18} /> Notification Preferences
                    </button>
                    <button style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      background: '#F3F4F6', border: 'none', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: '1rem', color: '#EF4444', fontWeight: 500
                    }} onClick={handleSignOut}>
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button style={styles.navButton}>
              <Heart size={24} />
            </button>
            {/* Cart Icon with popup */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button style={styles.navButton} onClick={handleCartClick}>
                <ShoppingCart size={24} />
                {cartItems.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    width: 10,
                    height: 10,
                    background: '#8B5CF6',
                    borderRadius: '50%',
                    display: 'inline-block',
                    border: '2px solid white',
                  }}></span>
                )}
              </button>
              {showCart && (
                <div style={{
                  position: 'absolute',
                  top: 32,
                  right: 0,
                  width: 320,
                  background: 'white',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  borderRadius: 12,
                  zIndex: 100,
                  padding: 16,
                }}>
                  <h4 style={{ margin: '0 0 12px 0', fontWeight: 'bold', fontSize: '1.1rem', color: '#1e1b4b' }}>Cart</h4>
                  {cartItems.length === 0 ? (
                    <div style={{ color: '#888' }}>Your cart is empty</div>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {cartItems.map((item, idx) => (
                        <li key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '8px 0',
                          borderBottom: '1px solid #eee',
                        }}>
                          <span style={{ fontWeight: 500 }}>{item.name || item.title || 'Item'}</span>
                          <span style={{ marginLeft: 'auto', color: '#8B5CF6', fontWeight: 600 }}>{item.price ? item.price + ' DH' : ''}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            {user ? (
              <>
                <span style={styles.userGreeting}>
                  Hello, {user.prenom}!
                </span>
                <button onClick={handleSignOut} style={styles.signOutButton}>
                  Sign Out
                </button>
              </>
            ) : (
              <button onClick={handleLogin} style={styles.signInButton}>
                Sign In
              </button>
            )}
            <button style={styles.navButton}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Edit Profile Form */}

      <form style={styles.formContainer} onSubmit={handleEdit}>
        <div style={styles.formTitle}>Edit Profile</div>
        <div style={styles.formField}>
          <label style={styles.label} htmlFor="prenom">First Name</label>
          <input style={styles.input} type="text" name="prenom" id="prenom" value={form.prenom} onChange={handleChange} required />
        </div>
        <div style={styles.formField}>
          <label style={styles.label} htmlFor="nom">Last Name</label>
          <input style={styles.input} type="text" name="nom" id="nom" value={form.nom} onChange={handleChange} required />
        </div>
        <div style={styles.formField}>
          <label style={styles.label} htmlFor="email">Email</label>
          <input style={styles.input} type="email" name="email" id="email" value={form.email} onChange={handleChange} required />
        </div>
        <div style={styles.formField}>
          <label style={styles.label} htmlFor="password">Password</label>
          <div style={{ position: 'relative' }}>
            <input
              style={{ ...styles.input, paddingRight: '2.5rem' }}
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="22" height="22" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-5.05 0-9.27-3.11-11-8 1.21-3.06 3.62-5.44 6.61-6.61"/><path d="M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c1.93 0 3.5-1.57 3.5-3.5 0-.47-.09-.92-.26-1.33"/></svg>
              ) : (
                <svg width="22" height="22" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="7"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
        </div>
        <div style={styles.formField}>
          <label style={styles.label} htmlFor="confirmPassword">Confirm Password</label>
          <div style={{ position: 'relative' }}>
            <input
              style={{ ...styles.input, paddingRight: '2.5rem' }}
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
              tabIndex={-1}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
                <svg width="22" height="22" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20c-5.05 0-9.27-3.11-11-8 1.21-3.06 3.62-5.44 6.61-6.61"/><path d="M1 1l22 22"/><path d="M9.53 9.53A3.5 3.5 0 0 0 12 15.5c1.93 0 3.5-1.57 3.5-3.5 0-.47-.09-.92-.26-1.33"/></svg>
              ) : (
                <svg width="22" height="22" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="7"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
        </div>
        <div style={styles.formField}>
          <label style={styles.label} htmlFor="phone">Phone</label>
          <input style={styles.input} type="tel" name="phone" id="phone" value={form.phone} onChange={handleChange} required />
        </div>
        <div style={styles.buttonRow}>
          <button type="submit" style={styles.editButton}>Edit</button>
          <button type="button" style={styles.cancelButton} onClick={handleCancel}>Cancel</button>
        </div>
      </form>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.sectionContainer}>
          <div style={styles.footerGrid}>
            <div>
              <div style={styles.logo}>
                <div style={{...styles.logoIcon, width: '2rem', height: '2rem'}}>
                  <Zap size={20} color="white" />
                </div>
                <span style={{...styles.logoText, color: 'white', WebkitTextFillColor: 'white'}}>MarketPlace</span>
              </div>
              <p style={{color: '#94a3b8', marginTop: '1rem'}}>
                La marketplace ultime pour acheter et vendre tout ce dont vous avez besoin.
              </p>
            </div>
            <div>
              <h4 style={styles.footerTitle}>Quick Links</h4>
              <ul style={styles.footerList}>
                <li style={styles.footerListItem}>
                  <a href="#" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Browse All</a>
                </li>
                <li style={styles.footerListItem}>
                  <a href="#" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Sell Item</a>
                </li>
                <li style={styles.footerListItem}>
                  <a href="#" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>My Account</a>
                </li>
                <li style={styles.footerListItem}>
                  <a href="#" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Favorites</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 style={styles.footerTitle}>Support</h4>
              <ul style={styles.footerList}>
                <li style={styles.footerListItem}>
                  <a href="#" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Help Center</a>
                </li>
                <li style={styles.footerListItem}>
                  <a href="#" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Contact Us</a>
                </li>
                <li style={styles.footerListItem}>
                  <a href="#" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Safety Tips</a>
                </li>
                <li style={styles.footerListItem}>
                  <a href="#" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Community</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 style={styles.footerTitle}>Legal</h4>
              <ul style={styles.footerList}>
                <li style={styles.footerListItem}>
                  <a href="#" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Privacy Policy</a>
                </li>
                <li style={styles.footerListItem}>
                  <a href="#" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Terms of Service</a>
                </li>
                <li style={styles.footerListItem}>
                  <a href="#" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Cookie Policy</a>
                </li>
                <li style={styles.footerListItem}>
                  <a href="#" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Accessibility</a>
                </li>
              </ul>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <p style={styles.copyright}>
              © 2025 MarketPlace. Tous droits réservés.
            </p>
            <div style={styles.socialLinks}>
              <a href="#" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Facebook</a>
              <a href="#" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Twitter</a>
              <a href="#" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EditProfilePage;

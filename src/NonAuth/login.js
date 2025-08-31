import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Zap, Facebook, Chrome, Apple, Search, Bell, Heart, ShoppingCart, Menu, AlertCircle, CheckCircle } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        
        // Store user data in session storage (more secure than localStorage for session data)
      const userData = {
  ...data.user,
  loginTime: new Date().toISOString()
};

localStorage.setItem('user', JSON.stringify(userData));
localStorage.setItem('isAuthenticated', 'true');

if (rememberMe) {
  localStorage.setItem('rememberMe', JSON.stringify({
    email: data.user.email,
    rememberMe: true
  }));
}

        // Log the user data
        console.log('Login successful:', data.user);
        console.log('User role:', data.user.role);
        
        // Role-based redirection
        setTimeout(() => {
          // Check the user's role and redirect accordingly
          if (data.user.role === 'Utilisateur' || data.user.role === 'UTILISATEUR') {
            // Redirect to user home page
            window.location.href = '/User/home';
          } else if (data.user.role === 'Admin' || data.user.role === 'ADMIN') {
            // Redirect to admin dashboard (you can add this route later)
            window.location.href = '/admin/home';
          } else if (data.user.role === 'Vendeur' || data.user.role === 'VENDEUR') {
            // Redirect to vendor dashboard (you can add this route later)
            window.location.href = '/vendor/dashboard';
          } else {
            // Default redirection if role is not recognized
            window.location.href = '/Admin/Home';
          }
        }, 1500);
        
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },

    // Header styles (same as homepage)
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
      gap: '0.75rem',
      textDecoration: 'none',
      cursor: 'pointer'
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
    searchContainer: {
      display: 'flex',
      flex: 1,
      maxWidth: '32rem',
      margin: '0 2rem'
    },
    searchWrapper: {
      position: 'relative',
      width: '100%'
    },
    searchInput: {
      width: '100%',
      paddingLeft: '3rem',
      paddingRight: '1rem',
      paddingTop: '0.75rem',
      paddingBottom: '0.75rem',
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '1rem',
      outline: 'none',
      transition: 'all 0.2s',
      fontSize: '0.875rem'
    },
    searchIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8'
    },
    searchButton: {
      position: 'absolute',
      right: '0.5rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
      color: 'white',
      padding: '0.5rem 1.5rem',
      borderRadius: '0.75rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.2s'
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
    signUpButton: {
      background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
      color: 'white',
      padding: '0.5rem 1.5rem',
      borderRadius: '0.75rem',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s'
    },

    // Main content container
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1rem',
      minHeight: 'calc(100vh - 4rem)',
      position: 'relative'
    },
    
    // Background decorations
    backgroundDecoration: {
      position: 'fixed',
      inset: 0,
      overflow: 'hidden',
      zIndex: 1,
      pointerEvents: 'none'
    },
    circle1: {
      position: 'absolute',
      top: '10%',
      left: '10%',
      width: '300px',
      height: '300px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))',
      animation: 'float 6s ease-in-out infinite'
    },
    circle2: {
      position: 'absolute',
      bottom: '10%',
      right: '10%',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0.03))',
      animation: 'float 8s ease-in-out infinite reverse'
    },
    circle3: {
      position: 'absolute',
      top: '60%',
      left: '5%',
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.06), rgba(139, 92, 246, 0.02))',
      animation: 'float 7s ease-in-out infinite'
    },

    // Main login card
    loginCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '2rem',
      padding: '3rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      width: '100%',
      maxWidth: '440px',
      position: 'relative',
      zIndex: 10
    },

    // Header
    loginHeader: {
      textAlign: 'center',
      marginBottom: '2.5rem'
    },
    loginLogo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      marginBottom: '1.5rem'
    },
    loginLogoIcon: {
      width: '3rem',
      height: '3rem',
      background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
      borderRadius: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    loginLogoText: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '1rem'
    },

    // Alert messages
    alert: {
      padding: '1rem',
      borderRadius: '0.75rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    errorAlert: {
      background: '#fef2f2',
      color: '#dc2626',
      border: '1px solid #fecaca'
    },
    successAlert: {
      background: '#f0fdf4',
      color: '#16a34a',
      border: '1px solid #bbf7d0'
    },

    // Form styles
    form: {
      width: '100%'
    },
    inputGroup: {
      marginBottom: '1.5rem',
      position: 'relative'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    inputContainer: {
      position: 'relative'
    },
    input: {
      width: '100%',
      padding: '0.875rem 1rem 0.875rem 3rem',
      border: '2px solid #e5e7eb',
      borderRadius: '0.75rem',
      fontSize: '1rem',
      transition: 'all 0.2s',
      outline: 'none',
      background: '#f9fafb',
      boxSizing: 'border-box'
    },
    inputError: {
      borderColor: '#ef4444'
    },
    inputIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      zIndex: 2
    },
    passwordToggle: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#9ca3af',
      padding: '0.25rem',
      zIndex: 2
    },

    // Checkbox and forgot password
    formOptions: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '2rem'
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    checkbox: {
      width: '1rem',
      height: '1rem',
      accentColor: '#8B5CF6'
    },
    checkboxLabel: {
      fontSize: '0.875rem',
      color: '#6b7280',
      cursor: 'pointer'
    },
    forgotPassword: {
      fontSize: '0.875rem',
      color: '#8B5CF6',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'color 0.2s'
    },

    // Submit button
    submitButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
      color: 'white',
      border: 'none',
      padding: '1rem 1.5rem',
      borderRadius: '0.75rem',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginBottom: '2rem'
    },
    submitButtonLoading: {
      opacity: 0.8,
      cursor: 'not-allowed'
    },

    // Divider
    divider: {
      position: 'relative',
      textAlign: 'center',
      marginBottom: '2rem'
    },
    dividerLine: {
      borderTop: '1px solid #e5e7eb',
      margin: '0'
    },
    dividerText: {
      background: 'rgba(255, 255, 255, 0.95)',
      color: '#6b7280',
      padding: '0 1rem',
      fontSize: '0.875rem',
      position: 'relative',
      top: '-0.6rem'
    },

    // Social login
    socialButtons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '0.75rem',
      marginBottom: '2rem'
    },
    socialButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem',
      border: '2px solid #e5e7eb',
      borderRadius: '0.75rem',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },

    // Footer
    footer: {
      textAlign: 'center',
      color: '#6b7280',
      fontSize: '0.875rem'
    },
    signupLink: {
      color: '#8B5CF6',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'color 0.2s'
    },

    // Loading spinner
    spinner: {
      width: '20px',
      height: '20px',
      border: '2px solid transparent',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  // Add keyframes to document head
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={styles.pageContainer}>
      {/* Header - Same as Homepage */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          {/* Logo */}
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <Zap size={24} color="white" />
            </div>
            <span style={styles.logoText}>MarketPlace</span>
          </div>

          {/* Search Bar */}
          <div style={styles.searchContainer}>
            <div style={styles.searchWrapper}>
              <Search style={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Search for anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 2px #8B5CF6';
                  e.target.style.borderColor = 'transparent';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = '#e2e8f0';
                }}
              />
              <button style={styles.searchButton}>Search</button>
            </div>
          </div>

          {/* Navigation */}
          <div style={styles.navContainer}>
            <button style={styles.navButton}>
              <Bell size={24} />
            </button>
            <button style={styles.navButton}>
              <Heart size={24} />
            </button>
            <button style={styles.navButton}>
              <ShoppingCart size={24} />
            </button>
            <button style={styles.signUpButton}>Sign Up</button>
            <button style={styles.navButton}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Background Decorations */}
      <div style={styles.backgroundDecoration}>
        <div style={styles.circle1}></div>
        <div style={styles.circle2}></div>
        <div style={styles.circle3}></div>
      </div>

      {/* Main Content Container */}
      <div style={styles.container}>
        {/* Login Card */}
        <div style={styles.loginCard}>
          {/* Header */}
          <div style={styles.loginHeader}>
            <div style={styles.loginLogo}>
              <div style={styles.loginLogoIcon}>
                <Zap size={32} color="white" />
              </div>
              <span style={styles.loginLogoText}>MarketPlace</span>
            </div>
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>Sign in to your account to continue</p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div style={{...styles.alert, ...styles.errorAlert}}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          
          {success && (
            <div style={{...styles.alert, ...styles.successAlert}}>
              <CheckCircle size={16} />
              {success}
            </div>
          )}

          {/* Login Form */}
          <div style={styles.form}>
            {/* Email Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label} htmlFor="email">Email Address</label>
              <div style={styles.inputContainer}>
                <Mail style={styles.inputIcon} size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    ...styles.input,
                    ...(error && !formData.email ? styles.inputError : {})
                  }}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#8B5CF6';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = '#f9fafb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label} htmlFor="password">Password</label>
              <div style={styles.inputContainer}>
                <Lock style={styles.inputIcon} size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{
                    ...styles.input,
                    ...(error && !formData.password ? styles.inputError : {})
                  }}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#8B5CF6';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = '#f9fafb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Form Options */}
            <div style={styles.formOptions}>
              <div style={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={styles.checkbox}
                  disabled={isLoading}
                />
                <label htmlFor="remember" style={styles.checkboxLabel}>
                  Remember me
                </label>
              </div>
              <a 
                href="#" 
                style={styles.forgotPassword}
                onMouseEnter={(e) => e.target.style.color = '#7C3AED'}
                onMouseLeave={(e) => e.target.style.color = '#8B5CF6'}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              style={{
                ...styles.submitButton,
                ...(isLoading ? styles.submitButtonLoading : {})
              }}
              disabled={isLoading}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(139, 92, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {isLoading ? (
                <>
                  <div style={styles.spinner}></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div style={styles.divider}>
            <hr style={styles.dividerLine} />
            <span style={styles.dividerText}>Or continue with</span>
          </div>

          {/* Social Login Buttons */}
          <div style={styles.socialButtons}>
            <button
              style={styles.socialButton}
              disabled={isLoading}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.borderColor = '#8B5CF6';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              <Chrome size={20} color="#4285f4" />
            </button>
            <button
              style={styles.socialButton}
              disabled={isLoading}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.borderColor = '#8B5CF6';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              <Facebook size={20} color="#1877f2" />
            </button>
            <button
              style={styles.socialButton}
              disabled={isLoading}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.borderColor = '#8B5CF6';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              <Apple size={20} color="#000000" />
            </button>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            Don't have an account?{' '}
            <a 
              href="/signup" 
              style={styles.signupLink}
              onMouseEnter={(e) => e.target.style.color = '#7C3AED'}
              onMouseLeave={(e) => e.target.style.color = '#8B5CF6'}
            >
              Sign up here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
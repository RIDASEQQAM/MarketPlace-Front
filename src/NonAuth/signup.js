import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Zap, Facebook, Chrome, Apple, Search, Bell, Heart, ShoppingCart, Menu, AlertCircle, CheckCircle, MapPin } from 'lucide-react';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [receiveNewsletter, setReceiveNewsletter] = useState(true);
  const [accountType, setAccountType] = useState('buyer');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    if (apiError) setApiError('');

    // Calculate password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }

    // Validate confirm password
    if (name === 'confirmPassword' || (name === 'password' && formData.confirmPassword)) {
      const password = name === 'password' ? value : formData.password;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      
      if (confirmPassword && password !== confirmPassword) {
        setErrors({
          ...errors,
          confirmPassword: 'Passwords do not match'
        });
      } else {
        setErrors({
          ...errors,
          confirmPassword: ''
        });
      }
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return '#ef4444';
    if (passwordStrength <= 3) return '#f59e0b';
    return '#10b981';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.prenom.trim()) newErrors.prenom = 'First name is required';
    if (!formData.nom.trim()) newErrors.nom = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.adresse.trim()) newErrors.adresse = 'Address is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (optional but validate if provided)
    if (formData.telephone && !/^[+]?[0-9]{10,15}$/.test(formData.telephone.replace(/\s/g, ''))) {
      newErrors.telephone = 'Please enter a valid phone number';
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms acceptance
    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  setIsLoading(true);
  setApiError('');
  setSuccess('');
  
  try {
    console.log('Sending registration request...'); // Debug log
    console.log('Form data:', {
      prenom: formData.prenom,
      nom: formData.nom,
      email: formData.email,
      telephone: formData.telephone,
      adresse: formData.adresse
    }); // Debug log (without password)
    
    const response = await fetch('http://localhost:8080/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        prenom: formData.prenom.trim(),
        nom: formData.nom.trim(),
        email: formData.email.trim(),
        telephone: formData.telephone.trim() || null,
        adresse: formData.adresse.trim(),
        password: formData.password
      }),
    });

    console.log('Response status:', response.status); // Debug log
    console.log('Response headers:', response.headers); // Debug log
    
    // Check if response is ok
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.log('Could not parse error response as JSON');
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Response data:', data); // Debug log

    if (data.success) {
      setSuccess(data.message || 'Inscription réussie! Bienvenue sur MarketPlace.');
      
      // Store user data in localStorage
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Registration successful:', data.user);
      }
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
      
    } else {
      setApiError(data.message || 'Échec de l\'inscription');
    }
  } catch (error) {
    console.error('Registration error:', error);
    
    // More specific error messages based on error type
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      setApiError('Impossible de se connecter au serveur. Vérifiez que le backend fonctionne sur http://localhost:8080');
    } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      setApiError('Erreur de réseau. Vérifiez votre connexion internet et que le serveur backend est démarré.');
    } else if (error.message.includes('CORS')) {
      setApiError('Erreur CORS. Problème de configuration du backend.');
    } else if (error.message.includes('400')) {
      setApiError('Données invalides. Vérifiez vos informations.');
    } else if (error.message.includes('409')) {
      setApiError('Un utilisateur avec cet email existe déjà.');
    } else if (error.message.includes('500')) {
      setApiError('Erreur interne du serveur. Réessayez plus tard.');
    } else {
      setApiError(`Erreur lors de l'inscription: ${error.message}`);
    }
  } finally {
    setIsLoading(false);
  }
};

  const handleSignIn = () => {
    window.location.href = '/login'; // or use React Router
  };

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },

    // Header styles
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
    signinButton: {
      background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
      color: 'white',
      padding: '0.5rem 1.5rem',
      borderRadius: '0.75rem',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s'
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

    // Main container
    mainContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem 4rem',
      minHeight: 'calc(100vh - 4rem)',
      position: 'relative'
    },

    // Signup card
    signupCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '2rem',
      padding: '3rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      width: '100%',
      maxWidth: '600px',
      position: 'relative',
      zIndex: 10
    },

    // Header
    signupHeader: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    signupLogo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      marginBottom: '1.5rem'
    },
    signupLogoIcon: {
      width: '3rem',
      height: '3rem',
      background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
      borderRadius: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    signupLogoText: {
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

    // Account type
    accountTypeContainer: {
      marginBottom: '2rem'
    },
    accountTypeLabel: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '1rem'
    },
    accountTypeButtons: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem'
    },
    accountTypeButton: {
      padding: '1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '0.75rem',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'center'
    },
    accountTypeButtonActive: {
      borderColor: '#8B5CF6',
      background: 'rgba(139, 92, 246, 0.05)'
    },
    accountTypeTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '0.25rem'
    },
    accountTypeDescription: {
      fontSize: '0.75rem',
      color: '#6b7280'
    },

    // Form styles
    signupForm: {
      width: '100%'
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginBottom: '1.5rem'
    },
    inputGroup: {
      marginBottom: '1.5rem'
    },
    inputLabel: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    inputContainer: {
      position: 'relative'
    },
    inputField: {
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
    inputFieldError: {
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
    errorMessage: {
      color: '#ef4444',
      fontSize: '0.75rem',
      marginTop: '0.25rem',
      display: 'block'
    },

    // Password strength
    passwordStrength: {
      marginTop: '0.5rem'
    },
    strengthBar: {
      width: '100%',
      height: '4px',
      background: '#e5e7eb',
      borderRadius: '2px',
      overflow: 'hidden',
      marginBottom: '0.25rem'
    },
    strengthFill: {
      height: '100%',
      transition: 'all 0.3s ease',
      borderRadius: '2px'
    },
    strengthText: {
      fontSize: '0.75rem',
      fontWeight: '500'
    },

    // Checkboxes
    checkboxSection: {
      marginBottom: '2rem'
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    checkbox: {
      width: '1rem',
      height: '1rem',
      accentColor: '#8B5CF6',
      marginTop: '0.125rem'
    },
    checkboxLabel: {
      fontSize: '0.875rem',
      color: '#6b7280',
      cursor: 'pointer',
      lineHeight: '1.4'
    },
    termsLink: {
      color: '#8B5CF6',
      background: 'none',
      border: 'none',
      textDecoration: 'underline',
      cursor: 'pointer',
      fontSize: 'inherit',
      fontWeight: '500'
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
    submitButtonDisabled: {
      opacity: 0.5,
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

    // Social buttons
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
    signupFooter: {
      textAlign: 'center',
      color: '#6b7280',
      fontSize: '0.875rem'
    },
    signinLink: {
      color: '#8B5CF6',
      background: 'none',
      border: 'none',
      textDecoration: 'underline',
      cursor: 'pointer',
      fontSize: 'inherit',
      fontWeight: '500'
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

  // Add keyframes
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
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <Zap size={24} color="white" />
            </div>
            <span style={styles.logoText}>MarketPlace</span>
          </div>

          <div style={styles.searchContainer}>
            <div style={styles.searchWrapper}>
              <Search style={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Search for anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
              <button style={styles.searchButton}>Search</button>
            </div>
          </div>

          <div style={styles.navContainer}>
            <button style={styles.navButton}><Bell size={24} /></button>
            <button style={styles.navButton}><Heart size={24} /></button>
            <button style={styles.navButton}><ShoppingCart size={24} /></button>
            <button style={styles.signinButton} onClick={handleSignIn}>Sign In</button>
            <button style={styles.navButton}><Menu size={24} /></button>
          </div>
        </div>
      </header>

      {/* Background Decorations */}
      <div style={styles.backgroundDecoration}>
        <div style={styles.circle1}></div>
        <div style={styles.circle2}></div>
        <div style={styles.circle3}></div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContainer}>
        <div style={styles.signupCard}>
          {/* Header */}
          <div style={styles.signupHeader}>
            <div style={styles.signupLogo}>
              <div style={styles.signupLogoIcon}>
                <Zap size={32} color="white" />
              </div>
              <span style={styles.signupLogoText}>MarketPlace</span>
            </div>
            <h1 style={styles.title}>Join MarketPlace</h1>
            <p style={styles.subtitle}>Create your account and start buying or selling</p>
          </div>

          {/* Alert Messages */}
          {apiError && (
            <div style={{...styles.alert, ...styles.errorAlert}}>
              <AlertCircle size={16} />
              {apiError}
            </div>
          )}
          
          {success && (
            <div style={{...styles.alert, ...styles.successAlert}}>
              <CheckCircle size={16} />
              {success}
            </div>
          )}

          {/* Account Type Selector */}
          <div style={styles.accountTypeContainer}>
            <label style={styles.accountTypeLabel}>I want to:</label>
            <div style={styles.accountTypeButtons}>
              <div
                style={{
                  ...styles.accountTypeButton,
                  ...(accountType === 'buyer' ? styles.accountTypeButtonActive : {})
                }}
                onClick={() => setAccountType('buyer')}
              >
                <div style={styles.accountTypeTitle}>🛍️ Buy Items</div>
                <div style={styles.accountTypeDescription}>Browse and purchase products</div>
              </div>
              <div
                style={{
                  ...styles.accountTypeButton,
                  ...(accountType === 'seller' ? styles.accountTypeButtonActive : {})
                }}
                onClick={() => setAccountType('seller')}
              >
                <div style={styles.accountTypeTitle}>💼 Sell Items</div>
                <div style={styles.accountTypeDescription}>List and sell your products</div>
              </div>
            </div>
          </div>

          {/* Signup Form */}
          <div style={styles.signupForm}>
            {/* Name Fields */}
            <div style={styles.formRow}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel} htmlFor="prenom">First Name</label>
                <div style={styles.inputContainer}>
                  <User style={styles.inputIcon} size={20} />
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    style={{
                      ...styles.inputField,
                      ...(errors.prenom ? styles.inputFieldError : {})
                    }}
                    placeholder="Enter first name"
                    required
                    disabled={isLoading}
                  />
                </div>
                {errors.prenom && <span style={styles.errorMessage}>{errors.prenom}</span>}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel} htmlFor="nom">Last Name</label>
                <div style={styles.inputContainer}>
                  <User style={styles.inputIcon} size={20} />
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    style={{
                      ...styles.inputField,
                      ...(errors.nom ? styles.inputFieldError : {})
                    }}
                    placeholder="Enter last name"
                    required
                    disabled={isLoading}
                  />
                </div>
                {errors.nom && <span style={styles.errorMessage}>{errors.nom}</span>}
              </div>
            </div>

            {/* Email Input */}
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel} htmlFor="email">Email Address</label>
              <div style={styles.inputContainer}>
                <Mail style={styles.inputIcon} size={20} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    ...styles.inputField,
                    ...(errors.email ? styles.inputFieldError : {})
                  }}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
              {errors.email && <span style={styles.errorMessage}>{errors.email}</span>}
            </div>

            {/* Phone Input */}
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel} htmlFor="telephone">Phone Number</label>
              <div style={styles.inputContainer}>
                <Phone style={styles.inputIcon} size={20} />
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  style={{
                    ...styles.inputField,
                    ...(errors.telephone ? styles.inputFieldError : {})
                  }}
                  placeholder="Enter your phone number"
                  disabled={isLoading}
                />
              </div>
              {errors.telephone && <span style={styles.errorMessage}>{errors.telephone}</span>}
            </div>

            {/* Address Input */}
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel} htmlFor="adresse">Address</label>
              <div style={styles.inputContainer}>
                <MapPin style={styles.inputIcon} size={20} />
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  style={{
                    ...styles.inputField,
                    ...(errors.adresse ? styles.inputFieldError : {})
                  }}
                  placeholder="Enter your address"
                  required
                  disabled={isLoading}
                />
              </div>
              {errors.adresse && <span style={styles.errorMessage}>{errors.adresse}</span>}
            </div>

            {/* Password Input */}
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel} htmlFor="password">Password</label>
              <div style={styles.inputContainer}>
                <Lock style={styles.inputIcon} size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{
                    ...styles.inputField,
                    ...(errors.password ? styles.inputFieldError : {})
                  }}
                  placeholder="Create a password"
                  required
                  disabled={isLoading}
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
              {errors.password && <span style={styles.errorMessage}>{errors.password}</span>}
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div style={styles.passwordStrength}>
                  <div style={styles.strengthBar}>
                    <div
                      style={{
                        ...styles.strengthFill,
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor()
                      }}
                    ></div>
                  </div>
                  <div
                    style={{
                      ...styles.strengthText,
                      color: getPasswordStrengthColor()
                    }}
                  >
                    Password strength: {getPasswordStrengthText()}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel} htmlFor="confirmPassword">Confirm Password</label>
              <div style={styles.inputContainer}>
                <Lock style={styles.inputIcon} size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  style={{
                    ...styles.inputField,
                    ...(errors.confirmPassword ? styles.inputFieldError : {})
                  }}
                  placeholder="Confirm your password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <span style={styles.errorMessage}>{errors.confirmPassword}</span>}
            </div>

            {/* Terms and Newsletter */}
            <div style={styles.checkboxSection}>
              <div style={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  style={styles.checkbox}
                  required
                  disabled={isLoading}
                />
                <label htmlFor="acceptTerms" style={styles.checkboxLabel}>
                  I agree to the{' '}
                  <button 
                    type="button"
                    style={styles.termsLink}
                    onClick={() => console.log('Open Terms of Service')}
                  >
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button 
                    type="button"
                    style={styles.termsLink}
                    onClick={() => console.log('Open Privacy Policy')}
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
              {errors.terms && <span style={styles.errorMessage}>{errors.terms}</span>}

              <div style={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="receiveNewsletter"
                  checked={receiveNewsletter}
                  onChange={(e) => setReceiveNewsletter(e.target.checked)}
                  style={styles.checkbox}
                  disabled={isLoading}
                />
                <label htmlFor="receiveNewsletter" style={styles.checkboxLabel}>
                  Send me updates about new features, deals, and marketplace news
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(isLoading ? styles.submitButtonLoading : {}),
                ...(!acceptTerms ? styles.submitButtonDisabled : {})
              }}
              disabled={isLoading || !acceptTerms}
              onClick={handleSubmit}
              onMouseEnter={(e) => {
                if (!isLoading && acceptTerms) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(139, 92, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && acceptTerms) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {isLoading ? (
                <>
                  <div style={styles.spinner}></div>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div style={styles.divider}>
            <hr style={styles.dividerLine} />
            <span style={styles.dividerText}>Or sign up with</span>
          </div>

          {/* Social Signup Buttons */}
          <div style={styles.socialButtons}>
            <button
              style={styles.socialButton}
              onClick={() => console.log('Sign up with Google')}
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
              onClick={() => console.log('Sign up with Facebook')}
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
              onClick={() => console.log('Sign up with Apple')}
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
          <div style={styles.signupFooter}>
            Already have an account?{' '}
            <button 
              type="button"
              style={styles.signinLink}
              onClick={handleSignIn}
              onMouseEnter={(e) => e.target.style.color = '#7C3AED'}
              onMouseLeave={(e) => e.target.style.color = '#8B5CF6'}
            >
              Sign in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
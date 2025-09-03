import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, Star, MapPin, User, Bell, ShoppingCart, Menu, Zap, TrendingUp, Award, Settings, LogOut, Key, Bell as BellIcon, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MarketplaceHomepage = () => {
  // Cart popup state and fake items (single declaration)
  const [showCart, setShowCart] = React.useState(false);
  const [cartItems] = React.useState([
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
  ]);

  // Close cart popup when clicking outside
  React.useEffect(() => {
    if (!showCart) return;
    const handleClick = (e) => {
      if (!e.target.closest('.cart-popup')) {
        setShowCart(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showCart]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [categories, setCategories] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({
    totalUsers: '2.5M+',
    totalListings: '500K+',
    activeListings: '98%',
    support: '24/7'
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
      { id: 1, type: 'message', text: "You got a message from client 'Ahmed' on WhatsApp.", unread: true, color: '#25D366', icon: '💬' },
      { id: 2, type: 'sold', text: "Your item 'iPhone 13' was sold!", unread: true, color: '#F59E0B', icon: '🛒' },
      { id: 3, type: 'offer', text: "Your item 'MacBook Pro' received a new offer.", unread: true, color: '#3B82F6', icon: '💰' },
      { id: 4, type: 'shipped', text: "Order #12345 has been shipped.", unread: false, color: '#10B981', icon: '🚚' },
      { id: 5, type: 'payment', text: "Your payment was successful.", unread: false, color: '#8B5CF6', icon: '✅' },
      { id: 6, type: 'reply', text: "Seller 'Sara' replied to your question.", unread: true, color: '#EC4899', icon: '📩' }
    ]);
  const [showSettings, setShowSettings] = useState(false);
  const unreadCount = notifications.filter(n => n.unread).length;
  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    // Mark all as read when opened
    if (!showNotifications) {
      setNotifications(notifications.map(n => ({ ...n, unread: false })));
    }
  };



  // API Base URL - adjust according to your backend port
  const API_BASE_URL = 'http://localhost:8080';

  // Load user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch user favorites when user changes
  useEffect(() => {
    if (user && user.id) {
      fetchUserFavorites();
    }
  }, [user]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchCategories(),
        fetchFeaturedListings(),
        fetchStatistics()
      ]);
    } catch (err) {
      setError('Error loading data');
      console.error('Error fetching initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      // Fetch real statistics from admin endpoints
      const [usersResponse, annoncesResponse, categoriesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/users/count`),
        fetch(`${API_BASE_URL}/admin/annonces/count`),
        fetch(`${API_BASE_URL}/admin/categories/count`)
      ]);

      let stats = {
        totalUsers: '2.5M+',
        totalListings: '500K+',
        activeListings: '98%',
        support: '24/7'
      };

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        if (usersData.success && usersData.data) {
          const total = usersData.data.total;
          stats.totalUsers = formatNumber(total);
        }
      }

      if (annoncesResponse.ok) {
        const annoncesData = await annoncesResponse.json();
        if (annoncesData.success && annoncesData.data) {
          const total = annoncesData.data.total;
          const active = annoncesData.data.active;
          stats.totalListings = formatNumber(total);
          if (total > 0) {
            stats.activeListings = Math.round((active / total) * 100) + '%';
          }
        }
      }

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.success && categoriesData.data) {
          // You can use this data if needed
        }
      }

      setStatistics(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Keep default values if API fails
      setStatistics({
        totalUsers: '2.5M+',
        totalListings: '500K+',
        activeListings: '98%',
        support: '24/7'
      });
    }
  };

  const handleCategoryClick = async (categoryId) => {
    try {
      setLoading(true);
      const userId = user?.id || '';
      const response = await fetch(
        `${API_BASE_URL}/api/user/annonces/feed?categoryId=${categoryId}&page=0&size=6${userId ? `&userId=${userId}` : ''}`
      );
      
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success && responseData.data && responseData.data.content) {
          const transformedResults = responseData.data.content.map((annonce, index) => ({
            id: annonce.id,
            title: annonce.titre,
            price: `${annonce.prix} DH`,
            originalPrice: annonce.prix ? `${(annonce.prix * 1.2).toFixed(0)} DH` : null,
            image: annonce.imageUrl || getPlaceholderImage(annonce.categorieNom),
            seller: annonce.vendeur ? `${annonce.vendeur.prenom} ${annonce.vendeur.nom}` : 'Vendeur',
            rating: annonce.rating || (4.5 + Math.random() * 0.4).toFixed(1),
            reviews: annonce.reviewCount || Math.floor(Math.random() * 200) + 20,
            location: annonce.vendeur?.adresse || 'Morocco',
            badge: getBadgeForListing(index),
            discount: calculateDiscount(annonce.prix, annonce.prix * 1.2),
            isPremium: index % 3 === 0,
            category: annonce.categorieNom,
            vendeurId: annonce.vendeur?.id,
            description: annonce.description
          }));
          setFeaturedListings(transformedResults);
        }
      }
    } catch (error) {
      console.error('Error fetching category listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return Math.floor(num / 100000) / 10 + 'M+';
    } else if (num >= 1000) {
      return Math.floor(num / 100) / 10 + 'K+';
    }
    return num.toString();
  };

  const fetchCategories = async () => {
    try {
      // Using the correct endpoint from your controllers
      const response = await fetch(`${API_BASE_URL}/api/user/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const responseData = await response.json();
      const categoriesData = responseData.success ? responseData.data : [];
      
      // Transform categories data to match frontend expectations
      const transformedCategories = await Promise.all(
        categoriesData.map(async (cat, index) => ({
          name: cat.nom,
          icon: getCategoryIcon(cat.nom),
          count: await getCategoryCount(cat.id), // Get real count
          color: getCategoryColor(index),
          id: cat.id
        }))
      );
      
      setCategories(transformedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories if API fails
      setCategories([
        { name: 'Electronics', icon: '📱', count: '2.5k+', color: '#8B5CF6' },
        { name: 'Fashion', icon: '👗', count: '1.8k+', color: '#EC4899' },
        { name: 'Home & Garden', icon: '🏠', count: '3.2k+', color: '#10B981' },
        { name: 'Vehicles', icon: '🚗', count: '950+', color: '#3B82F6' },
        { name: 'Sports', icon: '⚽', count: '1.2k+', color: '#F59E0B' },
        { name: 'Books', icon: '📚', count: '800+', color: '#8B5CF6' }
      ]);
    }
  };

  const getCategoryCount = async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/annonces/feed?categoryId=${categoryId}&size=1&page=0`);
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success && responseData.data) {
          const totalElements = responseData.data.totalElements || 0;
          return totalElements > 1000 ? `${Math.floor(totalElements/1000)}k+` : `${totalElements}+`;
        }
      }
      return `${Math.floor(Math.random() * 3000) + 500}+`; // Fallback
    } catch (error) {
      return `${Math.floor(Math.random() * 3000) + 500}+`; // Fallback
    }
  };

  const fetchFeaturedListings = async () => {
    try {
      // Using the correct endpoint from your controllers
      const userId = user?.id || '';
      const response = await fetch(`${API_BASE_URL}/api/user/annonces/feed?page=0&size=6${userId ? `&userId=${userId}` : ''}`);
      if (!response.ok) throw new Error('Failed to fetch listings');
      
      const responseData = await response.json();
      
      if (!responseData.success || !responseData.data) {
        throw new Error('Invalid response format');
      }
      
      const data = responseData.data;
      
      // Transform annonces data to match frontend expectations
      const transformedListings = data.content.map((annonce, index) => ({
        id: annonce.id,
        title: annonce.titre,
        price: `${annonce.prix} DH`,
        originalPrice: annonce.prix ? `${(annonce.prix * 1.2).toFixed(0)} DH` : null,
        image: annonce.imageUrl || getPlaceholderImage(annonce.categorieNom),
        seller: annonce.vendeur ? `${annonce.vendeur.prenom} ${annonce.vendeur.nom}` : 'Vendeur',
        rating: annonce.rating || (4.5 + Math.random() * 0.4).toFixed(1),
        reviews: annonce.reviewCount || Math.floor(Math.random() * 200) + 20,
        location: annonce.vendeur?.adresse || 'Morocco',
        badge: getBadgeForListing(index),
        discount: calculateDiscount(annonce.prix, annonce.prix * 1.2),
        isPremium: index % 3 === 0, // Make every 3rd item premium
        category: annonce.categorieNom,
        vendeurId: annonce.vendeur?.id,
        description: annonce.description,
        views: annonce.views || 0,
        statut: annonce.statut
      }));
      
      setFeaturedListings(transformedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      // Keep existing static data as fallback if no real data available
      setFeaturedListings([
        {
          id: 1,
          title: 'Exemple d\'annonce',
          price: '1,199 DH',
          originalPrice: '1,299 DH',
          image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop',
          seller: 'Vendeur Example',
          rating: 4.9,
          reviews: 127,
          location: 'Morocco',
          badge: 'Featured',
          discount: '8% off',
          isPremium: true
        }
      ]);
    }
  };

  const fetchUserFavorites = async () => {
    if (!user || !user.id) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/favorites/${user.id}`);
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success && responseData.data) {
          setFavorites(new Set(responseData.data));
        }
      }
    } catch (error) {
      console.error('Error fetching user favorites:', error);
    }
  };

  const toggleFavorite = async (id) => {
    if (!user || !user.id) {
      alert('Please sign in to add to favorites');
      return;
    }

    try {
      const isFavorite = favorites.has(id);
      const method = isFavorite ? 'DELETE' : 'POST';
      const url = `${API_BASE_URL}/api/user/favorites/${user.id}/${id}`;
      
      const response = await fetch(url, { method });
      
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (isFavorite) {
              newFavorites.delete(id);
            } else {
              newFavorites.add(id);
            }
            return newFavorites;
          });
        }
      } else {
        throw new Error('Failed to toggle favorite');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Error adding/removing from favorites');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/user/annonces/feed?search=${encodeURIComponent(searchQuery)}&page=0&size=10`
      );
      
      if (response.ok) {
        const responseData = await response.json();
        if (responseData.success) {
          // Handle search results - you might want to navigate to a search results page
          console.log('Search results:', responseData.data);
          // For now, update the featured listings with search results
          if (responseData.data && responseData.data.content) {
            const transformedResults = responseData.data.content.map((annonce, index) => ({
              id: annonce.id,
              title: annonce.titre,
              price: `${annonce.prix} DH`,
              originalPrice: annonce.prix ? `${(annonce.prix * 1.2).toFixed(0)} DH` : null,
              image: annonce.imageUrl || getPlaceholderImage(annonce.categorieNom),
              seller: annonce.vendeur ? `${annonce.vendeur.prenom} ${annonce.vendeur.nom}` : 'Vendeur',
              rating: annonce.rating || (4.5 + Math.random() * 0.4).toFixed(1),
              reviews: annonce.reviewCount || Math.floor(Math.random() * 200) + 20,
              location: annonce.vendeur?.adresse || 'Morocco',
              badge: getBadgeForListing(index),
              discount: calculateDiscount(annonce.prix, annonce.prix * 1.2),
              isPremium: index % 3 === 0,
              category: annonce.categorieNom,
              vendeurId: annonce.vendeur?.id,
              description: annonce.description
            }));
            setFeaturedListings(transformedResults);
          }
        }
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleLogin = () => {
    // Navigate to login page
    window.location.href = '/login';
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setUser(null);
    setFavorites(new Set());
  };

  // Helper functions
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Electronics': '📱',
      'Fashion': '👗',
      'Home': '🏠',
      'Vehicles': '🚗',
      'Sports': '⚽',
      'Books': '📚',
      'Immobilier': '🏠',
      'Véhicules': '🚗',
      'Mode': '👗',
      'Électronique': '📱',
      'Sport': '⚽',
      'Livres': '📚'
    };
    return iconMap[categoryName] || '📦';
  };

  const getCategoryColor = (index) => {
    const colors = ['#8B5CF6', '#EC4899', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'];
    return colors[index % colors.length];
  };

  const getPlaceholderImage = (category) => {
    const imageMap = {
      'Electronics': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop',
      'Fashion': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=200&fit=crop',
      'Home': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
      'Vehicles': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      'Sports': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
      'Books': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop'
    };
    return imageMap[category] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop';
  };

  const getBadgeForListing = (index) => {
    const badges = ['Verified', 'Trending', 'Hot Deal', 'Featured', 'Premium', 'Rare Find'];
    return badges[index % badges.length];
  };

  const calculateDiscount = (currentPrice, originalPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return null;
    const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    return `${discount}% off`;
  };

  const getBadgeStyle = (badge) => {
    const styles = {
      'Verified': { backgroundColor: '#3B82F6', color: 'white' },
      'Trending': { backgroundColor: '#EF4444', color: 'white' },
      'Hot Deal': { backgroundColor: '#F97316', color: 'white' },
      'Featured': { backgroundColor: '#10B981', color: 'white' },
      'Premium': { backgroundColor: '#8B5CF6', color: 'white' },
      'Rare Find': { backgroundColor: '#F59E0B', color: 'white' }
    };
    return styles[badge] || { backgroundColor: '#6B7280', color: 'white' };
  };

  // Rest of your styles object remains the same
  const styles = {
    // ... (keeping all the existing styles as they are)
    '*': {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    },
    container: {
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
    
    // Search styles
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
    
    // Navigation styles
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
    
    // Hero styles
    hero: {
      position: 'relative',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #7c3aed 50%, #3730a3 100%)',
      padding: '5rem 0',
      overflow: 'hidden',
      textAlign: 'center'
    },
    heroOverlay: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.2)'
    },
    heroContent: {
      position: 'relative',
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1rem'
    },
    heroTitle: {
      fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '1.5rem',
      lineHeight: 1.1
    },
    heroSubtitle: {
      background: 'linear-gradient(135deg, #fbbf24, #f97316)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      display: 'block'
    },
    heroDescription: {
      fontSize: '1.25rem',
      color: '#c4b5fd',
      marginBottom: '2rem',
      maxWidth: '32rem',
      margin: '0 auto 2rem auto'
    },
    heroButtons: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      justifyContent: 'center',
      alignItems: 'center'
    },
    heroButtonPrimary: {
      background: 'white',
      color: '#1e1b4b',
      padding: '1rem 2rem',
      borderRadius: '1rem',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s'
    },
    heroButtonSecondary: {
      border: '2px solid white',
      color: 'white',
      background: 'transparent',
      padding: '1rem 2rem',
      borderRadius: '1rem',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '1rem',
      transition: 'all 0.2s'
    },
    
    // Section styles
    section: {
      padding: '4rem 0'
    },
    sectionWhite: {
      background: 'white'
    },
    sectionGray: {
      background: '#f8fafc'
    },
    sectionContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1rem'
    },
    sectionHeader: {
      textAlign: 'center',
      marginBottom: '3rem'
    },
    sectionTitle: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#0f172a',
      marginBottom: '1rem'
    },
    sectionDescription: {
      color: '#64748b',
      maxWidth: '32rem',
      margin: '0 auto'
    },
    
    // Categories styles
    categoriesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '1.5rem'
    },
    categoryCard: {
      background: 'white',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f1f5f9',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s',
      position: 'relative',
      overflow: 'hidden'
    },
    categoryIcon: {
      fontSize: '2.5rem',
      marginBottom: '0.75rem'
    },
    categoryName: {
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: '0.25rem'
    },
    categoryCount: {
      color: '#64748b',
      fontSize: '0.875rem'
    },
    
    // Listings styles
    listingsHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '3rem'
    },
    listingsHeaderButtons: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    filterButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      border: '1px solid #cbd5e1',
      borderRadius: '0.75rem',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    viewAllButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      background: '#8B5CF6',
      color: 'white',
      borderRadius: '0.75rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    listingsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '2rem'
    },
    listingCard: {
      background: 'white',
      borderRadius: '1rem',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s',
      cursor: 'pointer'
    },
    premiumCard: {
      border: '1px solid #fbbf24'
    },
    
    // Listing image styles
    listingImageContainer: {
      position: 'relative',
      overflow: 'hidden'
    },
    listingImage: {
      width: '100%',
      height: '12rem',
      objectFit: 'cover',
      transition: 'transform 0.5s'
    },
    premiumBadge: {
      position: 'absolute',
      top: '0.75rem',
      left: '0.75rem',
      background: 'linear-gradient(135deg, #fbbf24, #f97316)',
      color: 'white',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    favoriteButton: {
      position: 'absolute',
      top: '0.75rem',
      right: '0.75rem',
      padding: '0.5rem',
      borderRadius: '9999px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    badge: {
      position: 'absolute',
      bottom: '0.75rem',
      left: '0.75rem',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '600'
    },
    discount: {
      position: 'absolute',
      bottom: '0.75rem',
      right: '0.75rem',
      background: '#ef4444',
      color: 'white',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.5rem',
      fontSize: '0.75rem',
      fontWeight: '600'
    },
    
    // Listing content styles
    listingContent: {
      padding: '1.5rem'
    },
    listingTitle: {
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: '0.5rem',
      fontSize: '1rem',
      lineHeight: 1.4,
      transition: 'color 0.2s'
    },
    priceContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.75rem'
    },
    price: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#0f172a'
    },
    originalPrice: {
      color: '#64748b',
      textDecoration: 'line-through',
      fontSize: '0.875rem'
    },
    ratingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    ratingStars: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    ratingText: {
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    reviews: {
      fontSize: '0.875rem',
      color: '#64748b'
    },
    sellerInfo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    seller: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    sellerName: {
      fontSize: '0.875rem',
      color: '#64748b'
    },
    location: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      color: '#64748b'
    },
    locationText: {
      fontSize: '0.75rem'
    },
    viewButton: {
      width: '100%',
      marginTop: '1rem',
      background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
      color: 'white',
      padding: '0.75rem',
      borderRadius: '0.75rem',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s'
    },
    
    // Stats styles
    statsSection: {
      background: 'linear-gradient(135deg, #1e1b4b, #3730a3)',
      padding: '4rem 0'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '0.5rem'
    },
    statLabel: {
      color: '#c4b5fd'
    },
    
    // Footer styles
    footer: {
      background: '#0f172a',
      color: 'white',
      padding: '3rem 0'
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
    },
    
    // Loading and error styles
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      fontSize: '1.2rem',
      color: '#64748b'
    },
    errorContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      fontSize: '1.2rem',
      color: '#ef4444',
      textAlign: 'center'
    },
    
    // Responsive styles
    '@media (max-width: 768px)': {
      searchContainer: {
        display: 'none'
      },
      heroButtons: {
        flexDirection: 'column'
      },
      listingsHeader: {
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'stretch'
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
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
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
              <button style={styles.searchButton} onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>

          {/* Navigation */}
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
            {/* Cart Icon and Popup */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button style={styles.navButton} onClick={() => setShowCart((prev) => !prev)}>
                <ShoppingCart size={24} />
                {cartItems && cartItems.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    minWidth: 16,
                    height: 16,
                    background: '#8B5CF6',
                    color: 'white',
                    borderRadius: '50%',
                    fontSize: 11,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white',
                    fontWeight: 600
                  }}>{cartItems.length}</span>
                )}
              </button>
              {showCart && (
                <div className="cart-popup" style={{
                  position: 'absolute',
                  top: 32,
                  right: 0,
                  width: 320,
                  background: 'white',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  borderRadius: 12,
                  zIndex: 100,
                  padding: 16,
                  minHeight: 120
                }}>
                  <h4 style={{ margin: '0 0 12px 0', fontWeight: 'bold', fontSize: '1.1rem', color: '#1e1b4b' }}>Cart</h4>
                  {cartItems.length === 0 ? (
                    <div style={{ color: '#888' }}>Your cart is empty</div>
                  ) : (
                    <>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {cartItems.map((item, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #eee' }}>
                            <img src={item.image} alt={item.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', background: '#f3f4f6' }} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 500, color: '#1e1b4b' }}>{item.name}</div>
                              <div style={{ color: '#8B5CF6', fontWeight: 600 }}>{item.price}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <button style={{
                        width: '100%',
                        marginTop: 16,
                        background: 'linear-gradient(135deg, #10B981, #3B82F6)',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '0.75rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10
                        }} onClick={() => navigate('/checkout')}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.79-4 4m8 0c0-2.21-1.79-4-4-4m0 8c2.21 0 4-1.79 4-4m-8 0c0 2.21 1.79 4 4 4m0-8V4m0 16v-4" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><text x="7" y="16" fontSize="8" fill="currentColor" fontFamily="Arial">$</text></svg>
                          Checkout
                        </button>
                    </>
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

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Discover Amazing
            <span style={styles.heroSubtitle}>Deals Today</span>
          </h1>
          <p style={styles.heroDescription}>
            Join millions of buyers and sellers in the ultimate marketplace experience. 
            Find unique items, incredible deals, and connect with trusted sellers.
          </p>
          <div style={styles.heroButtons}>
            <button 
              style={styles.heroButtonPrimary}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
            >
              Start Shopping
            </button>
            <button 
              style={styles.heroButtonSecondary}
              onMouseEnter={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#1e1b4b';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'white';
              }}
            >
              Sell Your Items
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{...styles.section, ...styles.sectionWhite}}>
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Browse Categories</h2>
            <p style={styles.sectionDescription}>
              Explore our diverse range of categories and find exactly what you're looking for
            </p>
          </div>
          <div style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <div
                key={category.id || index}
                style={styles.categoryCard}
                onClick={() => handleCategoryClick(category.id)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-8px)';
                  e.target.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={styles.categoryIcon}>{category.icon}</div>
                <h3 style={styles.categoryName}>{category.name}</h3>
                <p style={styles.categoryCount}>{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section style={{...styles.section, ...styles.sectionGray}}>
        <div style={styles.sectionContainer}>
          <div style={styles.listingsHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Featured Listings</h2>
              <p style={styles.sectionDescription}>Hand-picked deals from trusted sellers</p>
            </div>
            <div style={styles.listingsHeaderButtons}>
              <button style={styles.filterButton}>
                <Filter size={16} />
                <span>Filtrer</span>
              </button>
              <button style={styles.viewAllButton}>
                <TrendingUp size={16} />
                <span>Voir tout</span>
              </button>
            </div>
          </div>

          <div style={styles.listingsGrid}>
            {featuredListings.map((item) => (
              <div
                key={item.id}
                style={{
                  ...styles.listingCard,
                  ...(item.isPremium ? styles.premiumCard : {})
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1.1)';
                  const title = e.currentTarget.querySelector('h3');
                  if (title) title.style.color = '#8B5CF6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                  const title = e.currentTarget.querySelector('h3');
                  if (title) title.style.color = '#0f172a';
                }}
              >
                {/* Image Container */}
                <div style={styles.listingImageContainer}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={styles.listingImage}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop';
                    }}
                  />
                  {item.isPremium && (
                    <div style={styles.premiumBadge}>
                      <Award size={12} />
                      <span>Premium</span>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    style={{
                      ...styles.favoriteButton,
                      background: favorites.has(item.id) ? '#ef4444' : 'rgba(255, 255, 255, 0.9)',
                      color: favorites.has(item.id) ? 'white' : '#64748b'
                    }}
                  >
                    <Heart size={16} fill={favorites.has(item.id) ? 'currentColor' : 'none'} />
                  </button>
                  <div style={{...styles.badge, ...getBadgeStyle(item.badge)}}>
                    {item.badge}
                  </div>
                  
                </div>

                {/* Content */}
                <div style={styles.listingContent}>
                  <h3 style={styles.listingTitle}>{item.title}</h3>
                  
                  <div style={styles.priceContainer}>
                    <span style={styles.price}>{item.price}</span>
                    
                  </div>

                  <div style={styles.ratingContainer}>
                    <div style={styles.rating}>
                      <div style={styles.ratingStars}>
                        <Star size={16} color="#fbbf24" fill="#fbbf24" />
                        <span style={styles.ratingText}>{item.rating}</span>
                      </div>
                      
                    </div>
                  </div>

                  <div style={styles.sellerInfo}>
                    <div style={styles.seller}>
                      <User size={16} color="#94a3b8" />
                      <span style={styles.sellerName}>{item.seller}</span>
                    </div>
                    <div style={styles.location}>
                      <MapPin size={12} />
                      <span style={styles.locationText}>{item.location}</span>
                    </div>
                  </div>

                  <button 
                    style={styles.viewButton}
                    onClick={() => {
                      // Navigate to product detail page
                      window.location.href = `/annonce/${item.id}`;
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

  {/* Stats Section */}
  <section style={styles.statsSection}>
        <div style={styles.sectionContainer}>
          <div style={styles.statsGrid}>
            <div>
              <div style={styles.statNumber}>{statistics.totalUsers}</div>
              <div style={styles.statLabel}>Active Users</div>
            </div>
            <div>
              <div style={styles.statNumber}>{statistics.totalListings}</div>
              <div style={styles.statLabel}>Items Sold</div>
            </div>
            <div>
              <div style={styles.statNumber}>{statistics.activeListings}</div>
              <div style={styles.statLabel}>Satisfaction Rate</div>
            </div>
            <div>
              <div style={styles.statNumber}>{statistics.support}</div>
              <div style={styles.statLabel}>Support Available</div>
            </div>
          </div>
        </div>
      </section>

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
                  <button type="button" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Browse All</button>
                </li>
                <li style={styles.footerListItem}>
                  <button type="button" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Sell Item</button>
                </li>
                <li style={styles.footerListItem}>
                  <button type="button" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>My Account</button>
                </li>
                <li style={styles.footerListItem}>
                  <button type="button" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Favorites</button>
                </li>
                {/* Fake items for demonstration */}
                <li style={styles.footerListItem}>
                  <button type="button" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>iPhone 13 Pro Max</button>
                </li>
                <li style={styles.footerListItem}>
                  <button type="button" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Nike Air Max 2025</button>
                </li>
                <li style={styles.footerListItem}>
                  <button type="button" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>MacBook Pro 16"</button>
                </li>
                <li style={styles.footerListItem}>
                  <button type="button" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Canon EOS Camera</button>
                </li>
              </ul>
            </div>
            <div>
              <h4 style={styles.footerTitle}>Support</h4>
              <ul style={styles.footerList}>
                <li style={styles.footerListItem}>
                  <button type="button" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Help Center</button>
                </li>
                <li style={styles.footerListItem}>
                  <button type="button" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Contact Us</button>
                </li>
                <li style={styles.footerListItem}>
                  <button type="button" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Safety Tips</button>
                </li>
                <li style={styles.footerListItem}>
                  <button type="button" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Community</button>
                </li>
              </ul>
            </div>
            <div>
              <h4 style={styles.footerTitle}>Legal</h4>
              <ul style={styles.footerList}>
                <li style={styles.footerListItem}>
                  <button type="button" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Privacy Policy</button>
                </li>
                <li style={styles.footerListItem}>
                  <button type="button" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Terms of Service</button>
                </li>
                <li style={styles.footerListItem}>
                  <button type="button" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Cookie Policy</button>
                </li>
                <li style={styles.footerListItem}>
                  <button type="button" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Accessibility</button>
                </li>
              </ul>
            </div>
          </div>
          <div style={styles.footerBottom}>
            <p style={styles.copyright}>
              © 2025 MarketPlace. Tous droits réservés.
            </p>
            <div style={styles.socialLinks}>
              <button type="button" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Facebook</button>
              <button type="button" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Twitter</button>
              <button type="button" style={styles.footerLink} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>Instagram</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketplaceHomepage;
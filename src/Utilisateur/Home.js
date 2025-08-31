import React, { useState, useEffect , useRef} from 'react';
import { 
  Search, Filter, Heart, Star, MapPin, User, Bell, ShoppingCart, Menu, Zap, 
  TrendingUp, Award, Eye, MessageCircle, Plus, Edit3, BarChart3, Clock,
  CheckCircle, Package, DollarSign, ChevronDown, LogOut, Settings, AlertCircle,
  X, Save, Trash2, StarIcon
} from 'lucide-react';


const ConnectedUserHomepage = () => {
const [showProfileModal, setShowProfileModal] = useState(false);
const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(new Set());
  const [showNotifications, setShowNotifications] = useState(false);
 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');




  // Modal states
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAnnonceDetailsModalOpen, setIsAnnonceDetailsModalOpen] = useState(false);
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  // Form state for new product
  const [newProductData, setNewProductData] = useState({
    titre: '',
    description: '',
    prix: '',
    categorieId: '',
    imageUrl: ''
  });

  // API data states
  const [userData, setUserData] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [recommendedListings, setRecommendedListings] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userStats, setUserStats] = useState([]);

  // Get current user from localStorage
  const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };

  // API base URL
  const API_BASE_URL = 'http://localhost:8080/api';

  // Fetch user favorites
  const fetchUserFavorites = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/favorites/${userId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setFavorites(new Set(data.data));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  // Fetch user statistics
  const fetchUserStats = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/stats/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        const stats = data.data;
        setUserStats([
          { 
            title: 'Annonces Actives', 
            value: stats.activeListings?.toString() || '0', 
            change: `+${stats.activeListings || 0}`, 
            icon: Package, 
            color: '#3B82F6' 
          },
          { 
            title: 'Vues Totales', 
            value: stats.totalViews > 1000 ? `${(stats.totalViews/1000).toFixed(1)}k` : (stats.totalViews?.toString() || '0'), 
            change: '+15%', 
            icon: Eye, 
            color: '#F59E0B' 
          },
          { 
            title: 'Total Likes', 
            value: stats.totalLikes?.toString() || '0', 
            change: `+${stats.totalLikes || 0}%`, 
            icon: Heart, 
            color: '#EF4444' 
          }
         
        ]);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  // Fetch user's own listings
 const fetchMyListings = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/annonces/my-listings/${userId}?page=0&size=5`);
    const data = await response.json();
    
    if (data.success) {
      const formattedListings = data.data.map(annonce => ({
        id: annonce.id,
        title: annonce.titre,
        description: annonce.description,
        price: `${annonce.prix} DH`,
        views: annonce.totalViews || 0, // Vraie valeur des vues depuis le backend
        likes: annonce.totalLikes || 0, // Vraie valeur des likes depuis le backend
        messages: annonce.totalMessages || 0, // Vraie valeur des messages depuis le backend
        status: annonce.statut?.toLowerCase() || 'active',
        image: annonce.imageUrl || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=150&fit=crop',
        postedTime: formatPostedTime(annonce.dateCreation),
        quantiteStock: annonce.quantiteStock,
        vendeur: annonce.vendeur,
        categorie: annonce.categorie,
        dateCreation: annonce.dateCreation
      }));
      setMyListings(formattedListings);
    }
  } catch (error) {
    console.error('Error fetching my listings:', error);
  }
};
const handleEditListing = (listing) => {
  setNewProductData({
    titre: listing.title,
    description: listing.description,
    prix: listing.price.replace(' DH', ''),
    categorieId: listing.categorie?.id?.toString() || '',
    imageUrl: listing.image
  });
  setSelectedAnnonce(listing);
  setIsAddProductModalOpen(true);
};

// Handle delete listing
const handleDeleteListing = async (listingId) => {
  if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user/annonces/${listingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (data.success) {
      const currentUser = getCurrentUser();
      // Refresh the listings
      await fetchMyListings(currentUser.id);
      await fetchUserStats(currentUser.id);
      alert('Annonce supprimée avec succès!');
    } else {
      setError(data.message || 'Erreur lors de la suppression');
    }
  } catch (error) {
    console.error('Error deleting listing:', error);
    setError('Erreur de réseau lors de la suppression');
  }
};

// Handle toggle listing status
const handleToggleListingStatus = async (listingId, currentStatus) => {
  const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
  
  try {
    const response = await fetch(`${API_BASE_URL}/user/annonces/${listingId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ statut: newStatus })
    });

    const data = await response.json();

    if (data.success) {
      const currentUser = getCurrentUser();
      await fetchMyListings(currentUser.id);
      await fetchUserStats(currentUser.id);
    } else {
      setError(data.message || 'Erreur lors de la modification du statut');
    }
  } catch (error) {
    console.error('Error toggling status:', error);
    setError('Erreur de réseau lors de la modification du statut');
  }
};

  // Fetch recommended products
  const fetchRecommendedProducts = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/annonces/recommended/${userId}?limit=6`);
      const data = await response.json();
      
      if (data.success) {
        const formattedProducts = data.data.map(annonce => ({
          id: annonce.id,
          title: annonce.titre,
          description: annonce.description,
          price: `${annonce.prix} DH`,
          originalPrice: annonce.prix > 100 ? `${(annonce.prix * 1.2).toFixed(0)} DH` : null,
          image: annonce.imageUrl || 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop',
          seller: `${annonce.vendeur.prenom} ${annonce.vendeur.nom}`,
          rating: annonce.rating || (4.0 + Math.random() * 1.0),
          location: annonce.vendeur.adresse || 'Maroc',
          badge: 'Recommandé',
          postedTime: formatPostedTime(annonce.dateCreation),
          quantiteStock: annonce.quantiteStock,
          vendeur: annonce.vendeur,
          categorie: annonce.categorie,
          contact: {
            whatsapp: annonce.vendeur.telephone || '+212 6 00 00 00 00',
            instagram: `@${annonce.vendeur.prenom?.toLowerCase() || 'user'}`,
            facebook: `${annonce.vendeur.prenom} ${annonce.vendeur.nom}`
          }
        }));
        setRecommendedListings(formattedProducts);
      }
    } catch (error) {
      console.error('Error fetching recommended products:', error);
    }
  };

  // Fetch all products (feed)
  const fetchAllProducts = async () => {
    try {
      const currentUser = getCurrentUser();
      const userIdParam = currentUser ? `&userId=${currentUser.id}` : '';
      const response = await fetch(`${API_BASE_URL}/user/annonces/feed?page=0&size=9&sortBy=dateCreation&sortDir=desc${userIdParam}`);
      const data = await response.json();
      
      if (data.success) {
        const formattedProducts = data.data.content.map(annonce => ({
          id: annonce.id,
          title: annonce.titre,
          description: annonce.description,
          price: `${annonce.prix} DH`,
          originalPrice: annonce.prix > 1000 ? `${(annonce.prix * 1.15).toFixed(0)} DH` : null,
          image: annonce.imageUrl || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
          seller: `${annonce.vendeur.prenom} ${annonce.vendeur.nom}`,
          rating: annonce.rating || (4.0 + Math.random() * 1.0),
          location: annonce.vendeur.adresse || 'Maroc',
          badge: getBadgeForProduct(annonce),
          postedTime: formatPostedTime(annonce.dateCreation),
          quantiteStock: annonce.quantiteStock,
          vendeur: annonce.vendeur,
          categorie: annonce.categorie,
          contact: {
            whatsapp: annonce.vendeur.telephone || '+212 6 00 00 00 00',
            instagram: `@${annonce.vendeur.prenom?.toLowerCase() || 'user'}`,
            facebook: `${annonce.vendeur.prenom} ${annonce.vendeur.nom}`
          }
        }));
        setAllListings(formattedProducts);
      }
    } catch (error) {
      console.error('Error fetching all products:', error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/categories`);
      const data = await response.json();
      
      if (data.success) {
        const formattedCategories = data.data.map(category => ({
          id: category.id,
          name: category.nom,
          description: category.description,
          icon: getCategoryIcon(category.nom),
          count: `${Math.floor(Math.random() * 3000) + 500}+`
        }));
        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Helper functions
  const formatPostedTime = (dateString) => {
    if (!dateString) return 'Il y a quelques heures';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a quelques minutes';
    if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `Il y a ${diffInWeeks} semaine${diffInWeeks > 1 ? 's' : ''}`;
  };

  const getBadgeForProduct = (annonce) => {
    if (!annonce.dateCreation) return 'Nouveau';
    
    const date = new Date(annonce.dateCreation);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 1) return 'Nouveau';
    if (annonce.prix < 100) return 'Bonne Affaire';
    if (Math.random() > 0.7) return 'En Vedette';
    return 'Premium';
  };
  const handleProfileMenuToggle = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setShowProfileMenu(!showProfileMenu);
};

// Profile menu handlers
const handleViewProfile = () => {
  console.log('View Profile clicked');
  setShowProfileMenu(false);
  setShowProfileModal(true);
};

const handleViewMyListings = () => {
  console.log('My Listings clicked');
  setShowProfileMenu(false);
  // Scroll to "Mes Annonces" section
  const myListingsSection = document.querySelector('[data-section="my-listings"]');
  if (myListingsSection) {
    myListingsSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const handleViewSettings = () => {
  console.log('Settings clicked');
  setShowProfileMenu(false);
  setShowSettingsModal(true);
};
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Électronique': '📱',
      'Mode': '👗',
      'Maison': '🏠',
      'Véhicules': '🚗',
      'Sports': '⚽',
      'Livres': '📚',
      'Informatique': '💻',
      'Mobilier': '🪑',
      'Jardinage': '🌱'
    };
    return iconMap[categoryName] || '📦';
  };

  // Modal handlers
  const handleOpenAddProductModal = () => {
    setIsAddProductModalOpen(true);
  };

 

  const handleCreateProduct = async () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  try {
    const annonceData = {
      titre: newProductData.titre,
      description: newProductData.description,
      prix: parseFloat(newProductData.prix),
      imageUrl: newProductData.imageUrl,
      vendeur: { id: currentUser.id },
      categorie: { id: parseInt(newProductData.categorieId) }
    };

    let response;
    if (selectedAnnonce && selectedAnnonce.id) {
      // Edit existing listing
      response = await fetch(`${API_BASE_URL}/user/annonces/${selectedAnnonce.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(annonceData),
      });
    } else {
      // Create new listing
      response = await fetch(`${API_BASE_URL}/user/annonces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(annonceData),
      });
    }
    
    const data = await response.json();

    if (data.success) {
      console.log('Annonce saved:', data.data);
      handleCloseAddProductModal();
      // Refresh data
      fetchMyListings(currentUser.id);
      fetchAllProducts();
      fetchUserStats(currentUser.id);
      alert(selectedAnnonce ? 'Annonce modifiée avec succès!' : 'Annonce créée avec succès!');
    } else {
      console.error('Error saving annonce:', data.message);
      setError(data.message);
    }
  } catch (error) {
    console.error('Network error saving annonce:', error);
    setError('Erreur de réseau lors de la sauvegarde de l\'annonce');
  }
};
const handleCloseAddProductModal = () => {
  setIsAddProductModalOpen(false);
  setSelectedAnnonce(null);
  setNewProductData({ titre: '', description: '', prix: '', categorieId: '', imageUrl: '' });
};

  // View annonce details
const handleViewAnnonceDetails = async (annonceId) => {
  try {
    // Enregistrer la vue d'abord
    await handleViewProduct(annonceId);
    
    const currentUser = getCurrentUser();
    const userIdParam = currentUser ? `?userId=${currentUser.id}` : '';
    const response = await fetch(`${API_BASE_URL}/user/annonces/${annonceId}${userIdParam}`);
    const data = await response.json();
    
    if (data.success) {
      setSelectedAnnonce(data.data);
      setIsAnnonceDetailsModalOpen(true);
    }
  } catch (error) {
    console.error('Error fetching annonce details:', error);
  }
};
const handleProductTitleClick = async (productId) => {
  await handleViewProduct(productId);
  await handleViewAnnonceDetails(productId);
};

  // Handle rating
  const handleOpenRatingModal = (annonce) => {
    setSelectedAnnonce(annonce);
    setIsRatingModalOpen(true);
    setCurrentRating(0);
    setRatingComment('');
  };

  const handleSubmitRating = async () => {
    // Note: You'll need to implement a rating endpoint in your backend
    // For now, this is a placeholder
    console.log('Rating submitted:', { annonceId: selectedAnnonce.id, rating: currentRating, comment: ratingComment });
    setIsRatingModalOpen(false);
    setCurrentRating(0);
    setRatingComment('');
  };

 const handleSearch = async () => {
  if (!searchQuery.trim()) {
    // If search is empty, reload all products
    await fetchAllProducts();
    return;
  }
  
  setLoading(true);
  setError('');
  
  try {
    const currentUser = getCurrentUser();
    const userIdParam = currentUser ? `&userId=${currentUser.id}` : '';
    const response = await fetch(`${API_BASE_URL}/user/annonces/feed?search=${encodeURIComponent(searchQuery.trim())}&page=0&size=12${userIdParam}`);
    const data = await response.json();
    
    if (data.success) {
      const formattedProducts = data.data.content.map(annonce => ({
        id: annonce.id,
        title: annonce.titre,
        description: annonce.description,
        price: `${annonce.prix} DH`,
        originalPrice: annonce.prix > 1000 ? `${(annonce.prix * 1.15).toFixed(0)} DH` : null,
        image: annonce.imageUrl || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
        seller: `${annonce.vendeur.prenom} ${annonce.vendeur.nom}`,
        rating: annonce.rating || (4.0 + Math.random() * 1.0),
        location: annonce.vendeur.adresse || 'Maroc',
        badge: getBadgeForProduct(annonce),
        postedTime: formatPostedTime(annonce.dateCreation),
        vendeur: annonce.vendeur,
        categorie: annonce.categorie,
        contact: {
          whatsapp: annonce.vendeur.telephone || '+212 6 00 00 00 00',
          instagram: `@${annonce.vendeur.prenom?.toLowerCase() || 'user'}`,
          facebook: `${annonce.vendeur.prenom} ${annonce.vendeur.nom}`
        }
      }));
      
      setAllListings(formattedProducts);
      
      // Show search results info
      if (formattedProducts.length === 0) {
        setError(`Aucun résultat trouvé pour "${searchQuery}"`);
      } else {
        // Scroll to results section
        const resultsSection = document.querySelector('[data-section="search-results"]');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      setError(data.message || 'Erreur lors de la recherche');
    }
  } catch (error) {
    console.error('Error searching products:', error);
    setError('Erreur de réseau lors de la recherche');
  } finally {
    setLoading(false);
  }
};
const handleClearSearch = async () => {
  setSearchQuery('');
  setError('');
  await fetchAllProducts();
};

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const toggleFavorite = async (id) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  try {
    if (favorites.has(id)) {
      const response = await fetch(`${API_BASE_URL}/user/favorites/${currentUser.id}/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(id);
          return newFavorites;
        });
        
        // Mettre à jour les stats localement (décrémenter le like)
        setAllListings(prev => prev.map(product => 
          product.id === id 
            ? { ...product, likes: (product.likes || 0) - 1 }
            : product
        ));
        setRecommendedListings(prev => prev.map(product => 
          product.id === id 
            ? { ...product, likes: (product.likes || 0) - 1 }
            : product
        ));
      }
    } else {
      const response = await fetch(`${API_BASE_URL}/user/favorites/${currentUser.id}/${id}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        setFavorites(prev => new Set([...prev, id]));
        
        // Mettre à jour les stats localement (incrémenter le like)
        setAllListings(prev => prev.map(product => 
          product.id === id 
            ? { ...product, likes: (product.likes || 0) + 1 }
            : product
        ));
        setRecommendedListings(prev => prev.map(product => 
          product.id === id 
            ? { ...product, likes: (product.likes || 0) + 1 }
            : product
        ));
        
        // Rafraîchir les stats de l'utilisateur si c'est son produit
        const currentUserStats = await refreshUserStats();
      }
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
  }
};
const handleViewProduct = async (productId) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  try {
    // Enregistrer la vue dans le backend
    const response = await fetch(`${API_BASE_URL}/user/annonces/${productId}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: currentUser.id })
    });

    if (response.ok) {
      // Mettre à jour les stats localement (incrémenter la vue)
      setAllListings(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, views: (product.views || 0) + 1 }
          : product
      ));
      setRecommendedListings(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, views: (product.views || 0) + 1 }
          : product
      ));
      setMyListings(prev => prev.map(listing => 
        listing.id === productId 
          ? { ...listing, views: (listing.views || 0) + 1 }
          : listing
      ));
    }
  } catch (error) {
    console.error('Error tracking view:', error);
  }
};
  // Handle contact seller
  const handleContactSeller = (contactMethod, contactInfo, sellerName, itemTitle) => {
    switch (contactMethod) {
      case 'whatsapp':
        const message = `Bonjour ${sellerName}, je suis intéressé(e) par "${itemTitle}".`;
        const whatsappUrl = `https://wa.me/${contactInfo.replace(/\s+/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        break;
      case 'instagram':
        window.open(`https://instagram.com/${contactInfo.replace('@', '')}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/search/top?q=${encodeURIComponent(contactInfo)}`, '_blank');
        break;
    }
  };
const refreshUserStats = async () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  
  try {
    await fetchUserStats(currentUser.id);
    await fetchMyListings(currentUser.id);
  } catch (error) {
    console.error('Error refreshing user stats:', error);
  }
};
  // Load data on component mount
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
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-5px); }
      60% { transform: translateY(-3px); }
    }
  `;
  document.head.appendChild(style);
  return () => document.head.removeChild(style);
}, []);
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const currentUser = getCurrentUser();
      
      if (!currentUser) {
        window.location.href = '/login';
        return;
      }

      try {
        setUserData(currentUser);

        // Fetch all data
        await Promise.all([
          fetchMyListings(currentUser.id),
          fetchRecommendedProducts(currentUser.id),
          fetchAllProducts(),
          fetchCategories(),
          fetchUserFavorites(currentUser.id),
          fetchUserStats(currentUser.id)
        ]);

      } catch (error) {
        console.error('Error loading data:', error);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <AlertCircle size={48} color="#ef4444" />
        <p style={{ color: '#ef4444', fontSize: '18px' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!userData) {
    return null;
  }
 
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4rem'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <Zap size={24} color="white" />
            </div>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              MarketPlace
            </span>
          </div>

          {/* Search Bar */}
          <div style={{ display: 'flex', flex: 1, maxWidth: '32rem', margin: '0 2rem' }}>
  <div style={{ position: 'relative', width: '100%' }}>
    <Search style={{
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8'
    }} size={20} />
    <input
      type="text"
      placeholder="Rechercher des produits..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSearch();
        }
      }}
      style={{
        width: '100%',
        paddingLeft: '3rem',
        paddingRight: searchQuery ? '8rem' : '1rem',
        paddingTop: '0.75rem',
        paddingBottom: '0.75rem',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '1rem',
        outline: 'none',
        transition: 'all 0.2s',
        fontSize: '0.875rem'
      }}
    />
    
    {/* Clear button */}
    {searchQuery && (
      <button 
        onClick={handleClearSearch}
        style={{
          position: 'absolute',
          right: '5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#e2e8f0',
          color: '#6b7280',
          padding: '0.25rem',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1.5rem',
          height: '1.5rem'
        }}
        title="Effacer la recherche"
      >
        <X size={12} />
      </button>
    )}
    
    {/* Search button */}
    <button 
      onClick={handleSearch}
      disabled={loading}
      style={{
        position: 'absolute',
        right: '0.5rem',
        top: '50%',
        transform: 'translateY(-50%)',
        background: loading ? '#9ca3af' : 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
        color: 'white',
        padding: '0.5rem 1.5rem',
        borderRadius: '0.75rem',
        border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: '0.875rem',
        fontWeight: '500',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem'
      }}
    >
      {loading ? (
        <>
          <div style={{
            width: '12px',
            height: '12px',
            border: '2px solid transparent',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          Recherche...
        </>
      ) : (
        'Rechercher'
      )}
    </button>
  </div>
</div>

          {/* User Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Add New Listing */}
            <button 
              onClick={handleOpenAddProductModal}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              <Plus size={20} />
              <span>Nouvelle Annonce</span>
            </button>

            {/* Profile Menu */}
           <div ref={profileMenuRef} style={{ position: 'relative' }}>
  <button 
    onClick={handleProfileMenuToggle}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem',
      border: 'none',
      background: showProfileMenu ? '#f1f5f9' : 'transparent',
      cursor: 'pointer',
      borderRadius: '0.5rem',
      transition: 'background-color 0.2s'
    }}
  >
    <div style={{
      width: '2rem',
      height: '2rem',
      borderRadius: '50%',
      backgroundColor: '#8B5CF6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold'
    }}>
      {userData.prenom ? userData.prenom[0].toUpperCase() : 'U'}
    </div>
    <div style={{ textAlign: 'left' }}>
      <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
        {userData.prenom} {userData.nom}
      </div>
    </div>
    <ChevronDown 
      size={16} 
      style={{
        transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s'
      }}
    />
  </button>
  
  {showProfileMenu && (
    <div style={{
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: '0.5rem',
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb',
      minWidth: '220px',
      zIndex: 60,
      overflow: 'hidden'
    }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
          {userData.prenom} {userData.nom}
        </h4>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
          {userData.email}
        </p>
      </div>
      <div style={{ padding: '0.5rem' }}>
        <button 
  onClick={handleViewProfile}
  style={{
    width: '100%',
    padding: '0.75rem 1rem',
    border: 'none',
    background: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'background-color 0.2s',
    fontSize: '0.875rem'
  }}
  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
>
  <User size={16} />
  Mon Profil
</button>

<button 
  onClick={handleViewMyListings}
  style={{
    width: '100%',
    padding: '0.75rem 1rem',
    border: 'none',
    background: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'background-color 0.2s',
    fontSize: '0.875rem'
  }}
  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
>
  <Package size={16} />
  Mes Annonces
</button>

<button 
  onClick={handleViewSettings}
  style={{
    width: '100%',
    padding: '0.75rem 1rem',
    border: 'none',
    background: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'background-color 0.2s',
    fontSize: '0.875rem'
  }}
  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
>
  <Settings size={16} />
  Paramètres
</button>
        <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
        <button 
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: 'none',
            background: 'none',
            textAlign: 'left',
            cursor: 'pointer',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#ef4444',
            transition: 'background-color 0.2s',
            fontSize: '0.875rem'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </div>
  )}
</div>
            
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Stats Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Tableau de Bord</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {userStats.map((stat, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{stat.title}</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>{stat.value}</p>
                  <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>{stat.change}</p>
                </div>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: `${stat.color}20`,
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <stat.icon size={24} color={stat.color} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Listings Section */}
{myListings.length > 0 && (
  <section data-section="my-listings" style={{ marginBottom: '3rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Mes Annonces</h2>
      <button style={{
        color: '#3B82F6',
        fontSize: '0.875rem',
        fontWeight: '500',
        background: 'none',
        border: 'none',
        cursor: 'pointer'
      }}>
        Voir tout →
      </button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
      {myListings.slice(0, 5).map((listing) => (
        <div key={listing.id} style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s',
          border: listing.status === 'inactive' ? '2px solid #f59e0b' : '1px solid #e5e7eb'
        }}>
          <div style={{ position: 'relative', height: '150px', backgroundColor: '#f3f4f6' }}>
            <img 
              src={listing.image} 
              alt={listing.title}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                opacity: listing.status === 'inactive' ? 0.6 : 1
              }}
            />
            <div style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              display: 'flex',
              gap: '0.5rem'
            }}>
              <span style={{
                backgroundColor: listing.status === 'active' ? '#10b981' : '#f59e0b',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                {listing.status === 'active' ? 'Actif' : 'Inactif'}
              </span>
            </div>
            
            {/* Status toggle button */}
            <button
              onClick={() => handleToggleListingStatus(listing.id, listing.status)}
              style={{
                position: 'absolute',
                top: '0.5rem',
                left: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '2rem',
                height: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '0.75rem'
              }}
              title={listing.status === 'active' ? 'Désactiver' : 'Activer'}
            >
              {listing.status === 'active' ? '⏸️' : '▶️'}
            </button>
          </div>
          
          <div style={{ padding: '1rem' }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              marginBottom: '0.5rem',
              color: listing.status === 'inactive' ? '#6b7280' : '#1f2937'
            }}>
              {listing.title}
            </h3>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3B82F6', marginBottom: '0.75rem' }}>
              {listing.price}
            </p>
            
            {/* Real Statistics */}
           <div style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(3, 1fr)', 
  gap: '0.5rem', 
  marginBottom: '1rem',
  padding: '0.75rem',
  backgroundColor: '#f8fafc',
  borderRadius: '0.5rem'
}}>
  <div style={{ textAlign: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
      <Eye size={14} color="#6b7280" />
      <span style={{ 
        fontSize: '0.875rem', 
        fontWeight: '600', 
        color: '#1f2937',
        transition: 'all 0.3s ease',
        // Animation pour les nouvelles vues
        ...(listing.views > 0 && { 
          animation: 'pulse 0.5s ease-in-out',
          color: '#3B82F6' 
        })
      }}>
        {listing.views}
      </span>
    </div>
    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Vues</span>
  </div>
  
  <div style={{ textAlign: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
      <Heart size={14} color="#6b7280" />
      <span style={{ 
        fontSize: '0.875rem', 
        fontWeight: '600', 
        color: '#1f2937',
        transition: 'all 0.3s ease',
        // Animation pour les nouveaux likes
        ...(listing.likes > 0 && { 
          animation: 'bounce 0.5s ease-in-out',
          color: '#ef4444' 
        })
      }}>
        {listing.likes}
      </span>
    </div>
    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Likes</span>
  </div>
  
  <div style={{ textAlign: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
      <MessageCircle size={14} color="#6b7280" />
      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
        {listing.messages}
      </span>
    </div>
    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Messages</span>
  </div>
</div>
            {/* Posted time */}
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem' }}>
              Publié {listing.postedTime}
            </p>
            
            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => handleEditListing(listing)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem'
                }}
              >
                <Edit3 size={14} />
                Modifier
              </button>
              
              <button 
                onClick={() => handleViewAnnonceDetails(listing.id)}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Voir les détails"
              >
                <Eye size={16} />
              </button>
              
              <button 
                onClick={() => handleDeleteListing(listing.id)}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#fef2f2',
                  color: '#ef4444',
                  border: '1px solid #fecaca',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Supprimer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
)}

        {/* Recommended Products */}
        {recommendedListings.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Recommandé pour vous</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {recommendedListings.map((product) => (
                <div key={product.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}>
                  <div style={{ position: 'relative', height: '200px' }}>
                    <img 
                      src={product.image} 
                      alt={product.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '2rem',
                        height: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <Heart 
                        size={18} 
                        fill={favorites.has(product.id) ? '#ef4444' : 'none'}
                        color={favorites.has(product.id) ? '#ef4444' : '#6b7280'}
                      />
                    </button>
                    {product.badge && (
                      <span style={{
                        position: 'absolute',
                        top: '0.5rem',
                        left: '0.5rem',
                        background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h3 
  onClick={() => handleProductTitleClick(product.id)}
  style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', cursor: 'pointer' }}
>
  {product.title}
</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3B82F6' }}>{product.price}</span>
                      
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Star size={16} fill="#f59e0b" color="#f59e0b" />
                        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{product.rating.toFixed(1)}</span>
                      </div>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>• {product.seller}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6b7280', fontSize: '0.75rem' }}>
                      <MapPin size={14} />
                      <span>{product.location}</span>
                      <span>• {product.postedTime}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactSeller('whatsapp', product.contact.whatsapp, product.seller, product.title);
                      }}
                      style={{
                        width: '100%',
                        marginTop: '0.75rem',
                        padding: '0.5rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '0.875rem'
                      }}
                    >
                      Contacter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Products Feed */}
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Découvrir</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {allListings.map((product) => (
              <div key={product.id} style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}>
                <div style={{ position: 'relative', height: '200px' }}>
                  <img 
                    src={product.image} 
                    alt={product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '2rem',
                      height: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <Heart 
                      size={18} 
                      fill={favorites.has(product.id) ? '#ef4444' : 'none'}
                      color={favorites.has(product.id) ? '#ef4444' : '#6b7280'}
                    />
                  </button>
                  {product.badge && (
                    <span style={{
                      position: 'absolute',
                      top: '0.5rem',
                      left: '0.5rem',
                      backgroundColor: product.badge === 'Nouveau' ? '#10b981' : 
                                       product.badge === 'En Vedette' ? '#f59e0b' : '#8B5CF6',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {product.badge}
                    </span>
                  )}
                </div>
                <div style={{ padding: '1rem' }}>
                 <h3 
  onClick={() => handleProductTitleClick(product.id)}
  style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', cursor: 'pointer' }}
>
  {product.title}
</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem', 
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {product.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3B82F6' }}>{product.price}</span>
                   
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Star size={16} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{product.rating.toFixed(1)}</span>
                    </div>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>• {product.seller}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6b7280', fontSize: '0.75rem' }}>
                    <MapPin size={14} />
                    <span>{product.location}</span>
                    <span>• {product.postedTime}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactSeller('whatsapp', product.contact.whatsapp, product.seller, product.title);
                      }}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '0.875rem'
                      }}
                    >
                      WhatsApp
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenRatingModal(product);
                      }}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#f3f4f6',
                        color: '#6b7280',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Star size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Add Product Modal */}
      {isAddProductModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Nouvelle Annonce</h2>
              <button 
                onClick={handleCloseAddProductModal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Titre
                </label>
                <input
                  type="text"
                  value={newProductData.titre}
                  onChange={(e) => setNewProductData({...newProductData, titre: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  placeholder="Ex: iPhone 13 Pro Max"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Description
                </label>
                <textarea
                  value={newProductData.description}
                  onChange={(e) => setNewProductData({...newProductData, description: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                  placeholder="Décrivez votre produit..."
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Prix (DH)
                </label>
                <input
                  type="number"
                  value={newProductData.prix}
                  onChange={(e) => setNewProductData({...newProductData, prix: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  placeholder="0"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Catégorie
                </label>
                <select
                  value={newProductData.categorieId}
                  onChange={(e) => setNewProductData({...newProductData, categorieId: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  URL de l'image
                </label>
                <input
                  type="text"
                  value={newProductData.imageUrl}
                  onChange={(e) => setNewProductData({...newProductData, imageUrl: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={handleCloseAddProductModal}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Annuler
                </button>
               <button
  onClick={handleCreateProduct}
  style={{
    flex: 1,
    padding: '0.75rem',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '500'
  }}
>
  <Save size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
  {selectedAnnonce ? 'Modifier l\'annonce' : 'Créer l\'annonce'}
</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Annonce Details Modal */}
      {isAnnonceDetailsModalOpen && selectedAnnonce && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Détails de l'annonce</h2>
              <button 
                onClick={() => setIsAnnonceDetailsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                <X size={24} />
              </button>
            </div>
            
            <img 
              src={selectedAnnonce.imageUrl || 'https://via.placeholder.com/400x300'} 
              alt={selectedAnnonce.titre}
              style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1rem' }}
            />
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{selectedAnnonce.titre}</h3>
            <p style={{ fontSize: '1.5rem', color: '#3B82F6', fontWeight: 'bold', marginBottom: '1rem' }}>
              {selectedAnnonce.prix} DH
            </p>
            
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Description</h4>
              <p style={{ color: '#6b7280', lineHeight: '1.5' }}>{selectedAnnonce.description}</p>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Vendeur</h4>
              <p style={{ color: '#6b7280' }}>
                {selectedAnnonce.vendeur.prenom} {selectedAnnonce.vendeur.nom}
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                {selectedAnnonce.vendeur.email}
              </p>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Catégorie</h4>
              <span style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}>
                {selectedAnnonce.categorie?.nom || 'Non catégorisé'}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => {
                  handleContactSeller(
                    'whatsapp', 
                    selectedAnnonce.vendeur.telephone || '+212 6 00 00 00 00',
                    `${selectedAnnonce.vendeur.prenom} ${selectedAnnonce.vendeur.nom}`,
                    selectedAnnonce.titre
                  );
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Contacter sur WhatsApp
              </button>
              <button
                onClick={() => setIsAnnonceDetailsModalOpen(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {isRatingModalOpen && selectedAnnonce && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Noter ce produit</h2>
              <button 
                onClick={() => setIsRatingModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <p style={{ marginBottom: '1rem', color: '#6b7280' }}>{selectedAnnonce.title}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setCurrentRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.25rem'
                    }}
                  >
                    <Star 
                      size={32} 
                      fill={star <= currentRating ? '#f59e0b' : 'none'}
                      color={star <= currentRating ? '#f59e0b' : '#d1d5db'}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Commentaire (optionnel)
              </label>
              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
                placeholder="Partagez votre expérience..."
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setIsRatingModalOpen(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={currentRating === 0}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: currentRating === 0 ? '#d1d5db' : '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: currentRating === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: '500'
                }}
              >
                Soumettre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb',
        marginTop: '4rem',
        padding: '3rem 0'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Zap size={20} color="white" />
                </div>
                <span style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  MarketPlace
                </span>
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.5' }}>
                La meilleure plateforme pour acheter et vendre en ligne au Maroc.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Liens Rapides</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>
                    À propos
                  </a>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>
                    Comment ça marche
                  </a>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>
                    FAQ
                  </a>
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Catégories</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {categories.slice(0, 4).map(cat => (
                  <li key={cat.id} style={{ marginBottom: '0.5rem' }}>
                    <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>
                      {cat.icon} {cat.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Newsletter</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Recevez les meilleures offres directement dans votre boîte mail
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  placeholder="Votre email"
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                <button style={{
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  S'abonner
                </button>
              </div>
            </div>
          </div>
          
          <div style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              © 2025 MarketPlace. Tous droits réservés.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>
                Conditions d'utilisation
              </a>
              <a href="#" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </footer>
      {showProfileModal && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100
  }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Mon Profil</h2>
        <button 
          onClick={() => setShowProfileModal(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          <X size={24} />
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Profile Picture */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#8B5CF6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '0 auto 1rem'
          }}>
            {userData.prenom ? userData.prenom[0].toUpperCase() : 'U'}
          </div>
          <button style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}>
            Changer la photo
          </button>
        </div>

        {/* User Information */}
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Prénom
            </label>
            <input
              type="text"
              value={userData.prenom || ''}
              readOnly
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                backgroundColor: '#f9fafb',
                fontSize: '0.875rem'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Nom
            </label>
            <input
              type="text"
              value={userData.nom || ''}
              readOnly
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                backgroundColor: '#f9fafb',
                fontSize: '0.875rem'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Email
            </label>
            <input
              type="email"
              value={userData.email || ''}
              readOnly
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                backgroundColor: '#f9fafb',
                fontSize: '0.875rem'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Téléphone
            </label>
            <input
              type="tel"
              value={userData.telephone || 'Non renseigné'}
              readOnly
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                backgroundColor: '#f9fafb',
                fontSize: '0.875rem'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
              Adresse
            </label>
            <input
              type="text"
              value={userData.adresse || 'Non renseignée'}
              readOnly
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                backgroundColor: '#f9fafb',
                fontSize: '0.875rem'
              }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            onClick={() => setShowProfileModal(false)}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Fermer
          </button>
          <button
            onClick={() => {
              alert('Fonctionnalité de modification en développement');
            }}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Modifier
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{/* Settings Modal */}
{showSettingsModal && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100
  }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Paramètres</h2>
        <button 
          onClick={() => setShowSettingsModal(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          <X size={24} />
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Notifications */}
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Notifications</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: '#8B5CF6' }} />
              <span style={{ fontSize: '0.875rem' }}>Notifications par email</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: '#8B5CF6' }} />
              <span style={{ fontSize: '0.875rem' }}>Notifications push</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: '#8B5CF6' }} />
              <span style={{ fontSize: '0.875rem' }}>Offres promotionnelles</span>
            </label>
          </div>
        </div>

        {/* Privacy */}
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Confidentialité</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: '#8B5CF6' }} />
              <span style={{ fontSize: '0.875rem' }}>Profil public</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: '#8B5CF6' }} />
              <span style={{ fontSize: '0.875rem' }}>Montrer mes annonces</span>
            </label>
          </div>
        </div>

        {/* Language */}
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Langue</h3>
          <select style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: 'white'
          }}>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Danger Zone */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#ef4444' }}>Zone de danger</h3>
          <button style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#fef2f2',
            color: '#ef4444',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            Supprimer mon compte
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            onClick={() => setShowSettingsModal(false)}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Annuler
          </button>
          <button
            onClick={() => {
              alert('Paramètres sauvegardés!');
              setShowSettingsModal(false);
            }}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
    
  );
};

export default ConnectedUserHomepage;
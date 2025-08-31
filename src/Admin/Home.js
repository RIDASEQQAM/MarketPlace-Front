import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Package, ShoppingBag, TrendingUp, Search, Filter,
  Eye, Edit3, Trash2, CheckCircle, XCircle, Plus, Download, Settings,
  Bell, LogOut, Menu, X, Save, Star, MessageCircle, MapPin, Clock,
  AlertTriangle, Activity, DollarSign, Calendar, ChevronDown, ChevronRight
} from 'lucide-react';

const AdminDashboard = () => {
  // États pour les données
  const [dashboardStats, setDashboardStats] = useState({});
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingListings, setPendingListings] = useState([]);
  
  // États pour l'interface
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  
  // États pour les modales
  const [showUserModal, setShowUserModal] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [newCategory, setNewCategory] = useState({ nom: '', description: '' });

  const API_BASE_URL = 'http://localhost:8080/admin';

  // Chargement des données
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchUsers(),
        fetchListings(),
        fetchCategories(),
        fetchRecentActivity(),
        fetchPendingListings()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // API calls
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
      const data = await response.json();
      if (data.success) {
        setDashboardStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users?page=${pagination.page}&size=${pagination.size}&search=${searchQuery}`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.content || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchListings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/annonces?page=${pagination.page}&size=${pagination.size}&search=${searchQuery}`);
      const data = await response.json();
      if (data.success) {
        setListings(data.data.content || []);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/activity/recent?limit=10`);
      const data = await response.json();
      if (data.success) {
        setRecentActivity(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const fetchPendingListings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/annonces/pending?limit=5`);
      const data = await response.json();
      if (data.success) {
        setPendingListings(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching pending listings:', error);
    }
  };

  // Actions
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
        fetchDashboardStats();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/annonces/${listingId}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        fetchListings();
        fetchDashboardStats();
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const handleApproveListing = async (listingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/annonces/${listingId}/approve`, { method: 'PUT' });
      const data = await response.json();
      if (data.success) {
        fetchPendingListings();
        fetchListings();
        fetchDashboardStats();
      }
    } catch (error) {
      console.error('Error approving listing:', error);
    }
  };

  const handleCreateCategory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      });
      const data = await response.json();
      if (data.success) {
        fetchCategories();
        setShowCategoryModal(false);
        setNewCategory({ nom: '', description: '' });
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleExportUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/export`);
      const data = await response.json();
      if (data.success) {
        const dataStr = JSON.stringify(data.data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'users_export.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      }
    } catch (error) {
      console.error('Error exporting users:', error);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Chargement du tableau de bord...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 2rem',
        height: '4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            background: 'linear-gradient(135deg, #dc2626, #ef4444)',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart3 size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
            Admin Dashboard
          </h1>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button style={{
            padding: '0.5rem',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}>
            <Bell size={20} />
          </button>
          <button style={{
            padding: '0.5rem',
            backgroundColor: '#f3f4f6',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}>
            <Settings size={20} />
          </button>
          <button style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <aside style={{
          width: '16rem',
          backgroundColor: 'white',
          borderRight: '1px solid #e5e7eb',
          minHeight: 'calc(100vh - 4rem)',
          padding: '1.5rem'
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
              { id: 'users', label: 'Utilisateurs', icon: Users },
              { id: 'listings', label: 'Annonces', icon: Package },
              { id: 'categories', label: 'Catégories', icon: ShoppingBag },
              { id: 'analytics', label: 'Analytiques', icon: TrendingUp }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: activeTab === item.id ? '#dbeafe' : 'transparent',
                  color: activeTab === item.id ? '#1d4ed8' : '#6b7280',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2rem' }}>
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                Tableau de bord
              </h2>

              {/* Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
              }}>
                {[
                  { title: 'Total Utilisateurs', value: dashboardStats.totalUsers || 0, change: dashboardStats.usersGrowth || '+0%', icon: Users, color: '#3b82f6' },
                  { title: 'Total Annonces', value: dashboardStats.totalListings || 0, change: dashboardStats.listingsGrowth || '+0%', icon: Package, color: '#10b981' },
                  { title: 'Annonces Actives', value: dashboardStats.activeListings || 0, change: '+5%', icon: Activity, color: '#f59e0b' },
                  { title: 'Catégories', value: dashboardStats.totalCategories || 0, change: dashboardStats.categoriesGrowth || '+0', icon: ShoppingBag, color: '#8b5cf6' }
                ].map((stat, index) => (
                  <div key={index} style={{
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        {stat.title}
                      </p>
                      <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
                        {stat.value}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#10b981' }}>
                        {stat.change}
                      </p>
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

              {/* Recent Activity & Pending Listings */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* Recent Activity */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    Activité Récente
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {recentActivity.slice(0, 5).map((activity, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '0.5rem'
                      }}>
                        <div style={{
                          width: '2rem',
                          height: '2rem',
                          backgroundColor: activity.type === 'user' ? '#3b82f6' : '#10b981',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {activity.type === 'user' ? <Users size={16} color="white" /> : <Package size={16} color="white" />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                            {activity.description}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Listings */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    Annonces en Attente
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {pendingListings.slice(0, 5).map((listing, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem',
                        backgroundColor: '#fef3c7',
                        borderRadius: '0.5rem'
                      }}>
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                            {listing.titre}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {listing.prix} DH
                          </p>
                        </div>
                        <button
                          onClick={() => handleApproveListing(listing.id)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
                          }}
                        >
                          <CheckCircle size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Gestion des Utilisateurs</h2>
                <button
                  onClick={handleExportUsers}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Download size={16} />
                  Exporter
                </button>
              </div>

              {/* Search Bar */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative', maxWidth: '400px' }}>
                  <Search style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280'
                  }} size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher des utilisateurs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '3rem',
                      paddingRight: '1rem',
                      paddingTop: '0.75rem',
                      paddingBottom: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Users Table */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Utilisateur</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Email</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Téléphone</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Annonces</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.id} style={{ borderTop: index > 0 ? '1px solid #e5e7eb' : 'none' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '2.5rem',
                              height: '2.5rem',
                              backgroundColor: '#3b82f6',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold'
                            }}>
                              {user.prenom ? user.prenom[0] : 'U'}
                            </div>
                            <div>
                              <p style={{ fontWeight: '500' }}>{user.prenom} {user.nom}</p>
                              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                {new Date(user.dateCreation).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', color: '#6b7280' }}>{user.email}</td>
                        <td style={{ padding: '1rem', color: '#6b7280' }}>{user.telephone || 'N/A'}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#dbeafe',
                            color: '#1d4ed8',
                            borderRadius: '1rem',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}>
                            {user.nombreAnnonces}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                              style={{
                                padding: '0.5rem',
                                backgroundColor: '#f3f4f6',
                                border: 'none',
                                borderRadius: '0.25rem',
                                cursor: 'pointer'
                              }}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              style={{
                                padding: '0.5rem',
                                backgroundColor: '#fef2f2',
                                color: '#ef4444',
                                border: '1px solid #fecaca',
                                borderRadius: '0.25rem',
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Listings Tab */}
          {activeTab === 'listings' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Gestion des Annonces</h2>
              </div>

              {/* Listings Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {listings.map((listing) => (
                  <div key={listing.id} style={{
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ position: 'relative', height: '200px', backgroundColor: '#f3f4f6' }}>
                      <img 
                        src={listing.imageUrl || 'https://via.placeholder.com/300x200'}
                        alt={listing.titre}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: listing.statut === 'ACTIVE' ? '#10b981' : '#f59e0b',
                        color: 'white',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {listing.statut}
                      </span>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        {listing.titre}
                      </h3>
                      <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
                        {listing.prix} DH
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                        {listing.vendeur && `${listing.vendeur.prenom} ${listing.vendeur.nom}`}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem' }}>
                        {new Date(listing.dateCreation).toLocaleDateString()}
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => {
                            setSelectedListing(listing);
                            setShowListingModal(true);
                          }}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}
                        >
                          Voir
                        </button>
                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#fef2f2',
                            color: '#ef4444',
                            border: '1px solid #fecaca',
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Gestion des Catégories</h2>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Plus size={16} />
                  Nouvelle Catégorie
                </button>
              </div>

              {/* Categories Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {categories.map((category) => (
                  <div key={category.id} style={{
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                          {category.nom}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                          {category.description}
                        </p>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: '#dbeafe',
                          color: '#1d4ed8',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: '500'
                        }}>
                          {category.nombreAnnonces} annonces
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: '#fef2f2',
                          color: '#ef4444',
                          border: '1px solid #fecaca',
                          borderRadius: '0.5rem',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                Analytiques
              </h2>
              
              {/* Analytics Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    Croissance des Utilisateurs
                  </h3>
                  <div style={{ height: '200px', backgroundColor: '#f8fafc', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={48} color="#6b7280" />
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    Annonces par Catégorie
                  </h3>
                  <div style={{ height: '200px', backgroundColor: '#f8fafc', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BarChart3 size={48} color="#6b7280" />
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    Revenus Mensuels
                  </h3>
                  <div style={{ height: '200px', backgroundColor: '#f8fafc', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign size={48} color="#6b7280" />
                  </div>
                </div>
              </div>
              
              <div style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Graphiques Détaillés
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  Les graphiques détaillés seront disponibles prochainement
                </p>
                <button style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}>
                  Générer Rapport
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
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
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Détails de l'utilisateur</h2>
              <button 
                onClick={() => setShowUserModal(false)}
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
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  margin: '0 auto'
                }}>
                  {selectedUser.prenom ? selectedUser.prenom[0] : 'U'}
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Nom complet
                </label>
                <p style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                  {selectedUser.prenom} {selectedUser.nom}
                </p>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Email
                </label>
                <p style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                  {selectedUser.email}
                </p>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Téléphone
                </label>
                <p style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                  {selectedUser.telephone || 'Non renseigné'}
                </p>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Adresse
                </label>
                <p style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                  {selectedUser.adresse || 'Non renseignée'}
                </p>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Nombre d'annonces
                </label>
                <p style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                  {selectedUser.nombreAnnonces}
                </p>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Date d'inscription
                </label>
                <p style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                  {new Date(selectedUser.dateCreation).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setShowUserModal(false)}
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
                  handleDeleteUser(selectedUser.id);
                  setShowUserModal(false);
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Listing Details Modal */}
      {showListingModal && selectedListing && (
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
                onClick={() => setShowListingModal(false)}
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
              src={selectedListing.imageUrl || 'https://via.placeholder.com/400x300'}
              alt={selectedListing.titre}
              style={{ 
                width: '100%', 
                height: '300px', 
                objectFit: 'cover', 
                borderRadius: '0.5rem', 
                marginBottom: '1rem' 
              }}
            />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {selectedListing.titre}
                </h3>
                <p style={{ fontSize: '1.5rem', color: '#3b82f6', fontWeight: 'bold' }}>
                  {selectedListing.prix} DH
                </p>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Description
                </label>
                <p style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', lineHeight: '1.5' }}>
                  {selectedListing.description}
                </p>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Vendeur
                </label>
                <p style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                  {selectedListing.vendeur && `${selectedListing.vendeur.prenom} ${selectedListing.vendeur.nom}`}
                </p>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Catégorie
                </label>
                <p style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                  {selectedListing.categorie?.nom || 'Non catégorisé'}
                </p>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Statut
                </label>
                <span style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  backgroundColor: selectedListing.statut === 'ACTIVE' ? '#dcfce7' : '#fef3c7',
                  color: selectedListing.statut === 'ACTIVE' ? '#16a34a' : '#d97706',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  {selectedListing.statut}
                </span>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Date de création
                </label>
                <p style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem' }}>
                  {new Date(selectedListing.dateCreation).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setShowListingModal(false)}
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
              {selectedListing.statut !== 'ACTIVE' && (
                <button
                  onClick={() => {
                    handleApproveListing(selectedListing.id);
                    setShowListingModal(false);
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
                  Approuver
                </button>
              )}
              <button
                onClick={() => {
                  handleDeleteListing(selectedListing.id);
                  setShowListingModal(false);
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Category Modal */}
      {showCategoryModal && (
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
            width: '90%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Nouvelle Catégorie</h2>
              <button 
                onClick={() => setShowCategoryModal(false)}
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
                  Nom de la catégorie
                </label>
                <input
                  type="text"
                  value={newCategory.nom}
                  onChange={(e) => setNewCategory({...newCategory, nom: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                  placeholder="Ex: Électronique"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                  Description
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
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
                  placeholder="Description de la catégorie..."
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setShowCategoryModal(false)}
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
                onClick={handleCreateCategory}
                disabled={!newCategory.nom.trim()}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: !newCategory.nom.trim() ? '#d1d5db' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: !newCategory.nom.trim() ? 'not-allowed' : 'pointer',
                  fontWeight: '500'
                }}
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
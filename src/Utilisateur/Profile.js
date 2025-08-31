import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Save, Mail, Phone, MapPin, User, AlertCircle } from 'lucide-react'; // Import icons

const UserProfilePage = () => {
  const API_BASE_URL = 'http://localhost:8080/api'; // Ensure this matches your backend URL

  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // State for form inputs
  const [profileData, setProfileData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: ''
  });

  // Function to get current user ID (replace with your actual logic)
  const getCurrentUserId = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : null;
  };

  // Fetch user profile data
  const fetchUserProfile = useCallback(async (userId) => {
    if (!userId) {
      setError('Utilisateur non connecté.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile/${userId}`);
      const data = await response.json();

      if (data.success && data.data) {
        setUserData(data.data);
        // Initialize profileData state with fetched data
        setProfileData({
          prenom: data.data.prenom || '',
          nom: data.data.nom || '',
          email: data.data.email || '',
          telephone: data.data.telephone || '',
          adresse: data.data.adresse || ''
        });
      } else {
        setError(data.message || 'Erreur lors de la récupération du profil.');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Erreur réseau lors de la récupération du profil.');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]); // Dependency array includes API_BASE_URL

  // Effect to load data when the component mounts or userId changes
  useEffect(() => {
    const userId = getCurrentUserId();
    fetchUserProfile(userId);
  }, [fetchUserProfile]); // Depend on fetchUserProfile

  // Handle input changes for editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle saving profile changes
  const handleSaveProfile = async () => {
    const userId = getCurrentUserId();
    if (!userId) return;

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/user/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prenom: profileData.prenom,
          nom: profileData.nom,
          telephone: profileData.telephone,
          adresse: profileData.adresse,
        }),
      });
      const data = await response.json();

      if (data.success && data.data) {
        setUserData(data.data); // Update the displayed user data
        setEditing(false);
        setSuccessMessage('Profil mis à jour avec succès !');
      } else {
        setError(data.message || 'Impossible de mettre à jour le profil.');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Erreur réseau lors de la sauvegarde du profil.');
    } finally {
      setLoading(false);
    }
  };

  // Styles (can be moved to a separate CSS file or styled-components)
  const styles = {
    container: {
      maxWidth: '700px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '1rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #e5e7eb',
      paddingBottom: '1rem',
      marginBottom: '1.5rem',
    },
    profileInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      marginBottom: '1.5rem',
    },
    avatar: {
      width: '6rem',
      height: '6rem',
      borderRadius: '50%',
      backgroundColor: '#8B5CF6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      color: 'white',
      fontWeight: 'bold',
    },
    nameAndEmail: {
      display: 'flex',
      flexDirection: 'column',
    },
    userName: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      color: '#1f2937',
    },
    userEmail: {
      fontSize: '1rem',
      color: '#6b7280',
    },
    detailItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '1rem',
      fontSize: '1rem',
      color: '#374151',
    },
    label: {
      fontWeight: '500',
      color: '#6b7280',
      minWidth: '100px', // To align values
    },
    value: {
      flexGrow: 1,
    },
    editButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#3B82F6',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s',
    },
    saveButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s',
    },
    input: {
      width: 'calc(100% - 2rem)', // Account for padding
      padding: '0.75rem',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'all 0.2s',
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 'calc(100vh - 10rem)', // Adjust based on header height
      fontSize: '1.125rem',
      color: '#6b7280',
    },
    error: {
      color: '#ef4444',
      fontSize: '0.875rem',
      marginTop: '0.5rem',
    },
    success: {
      color: '#10b981',
      fontSize: '0.875rem',
      marginTop: '0.5rem',
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.75rem',
      marginTop: '1.5rem',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Mon Profil</h1>
        <div>
          {!editing ? (
            <button onClick={() => setEditing(true)} style={styles.editButton}>
              <Pencil size={16} /> Modifier
            </button>
          ) : (
            <div style={styles.actions}>
              <button onClick={() => { setEditing(false); fetchUserProfile(getCurrentUserId()); }} style={{ ...styles.editButton, backgroundColor: '#f3f4f6', color: '#6b7280' }}>
                Annuler
              </button>
              <button onClick={handleSaveProfile} style={styles.saveButton} disabled={loading}>
                <Save size={16} /> {loading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          )}
        </div>
      </div>

      {loading && <div style={styles.loading}>Chargement du profil...</div>}
      {error && <div style={{ ...styles.error, textAlign: 'center' }}>{error}</div>}
      {successMessage && <div style={{ ...styles.success, textAlign: 'center' }}>{successMessage}</div>}

      {!loading && !error && userData && (
        <>
          <div style={styles.profileInfo}>
            <div style={styles.avatar}>
              {profileData.prenom ? profileData.prenom[0].toUpperCase() : (userData.prenom ? userData.prenom[0].toUpperCase() : 'U')}
            </div>
            <div style={styles.nameAndEmail}>
              <h2 style={styles.userName}>{profileData.prenom || userData.prenom} {profileData.nom || userData.nom}</h2>
              <p style={styles.userEmail}>{profileData.email || userData.email}</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
            {editing ? (
              // Editable fields
              <>
                <div style={styles.detailItem}>
                  <label htmlFor="prenom" style={styles.label}>Prénom:</label>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    value={profileData.prenom}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.detailItem}>
                  <label htmlFor="nom" style={styles.label}>Nom:</label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    value={profileData.nom}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.detailItem}>
                  <label htmlFor="email" style={styles.label}>Email:</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    style={{ ...styles.input, backgroundColor: '#f9fafb', color: '#6b7280' }}
                    readOnly // Email is typically not editable from the profile page
                  />
                </div>
                <div style={styles.detailItem}>
                  <label htmlFor="telephone" style={styles.label}>Téléphone:</label>
                  <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    value={profileData.telephone}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.detailItem}>
                  <label htmlFor="adresse" style={styles.label}>Adresse:</label>
                  <input
                    id="adresse"
                    name="adresse"
                    type="text"
                    value={profileData.adresse}
                    onChange={handleInputChange}
                    style={styles.input}
                  />
                </div>
              </>
            ) : (
              // Display only fields
              <>
                <div style={styles.detailItem}>
                  <User size={20} color="#3B82F6" />
                  <span style={styles.label}>Nom Complet:</span>
                  <span style={styles.value}>{userData.prenom} {userData.nom}</span>
                </div>
                <div style={styles.detailItem}>
                  <Mail size={20} color="#3B82F6" />
                  <span style={styles.label}>Email:</span>
                  <span style={styles.value}>{userData.email}</span>
                </div>
                <div style={styles.detailItem}>
                  <Phone size={20} color="#3B82F6" />
                  <span style={styles.label}>Téléphone:</span>
                  <span style={styles.value}>{userData.telephone || 'Non spécifié'}</span>
                </div>
                <div style={styles.detailItem}>
                  <MapPin size={20} color="#3B82F6" />
                  <span style={styles.label}>Adresse:</span>
                  <span style={styles.value}>{userData.adresse || 'Non spécifiée'}</span>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfilePage;
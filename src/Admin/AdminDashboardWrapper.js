// AdminDashboardWrapper.js
import React, { useEffect } from 'react';
import AdminDashboard from './AdminDashboard';

const AdminDashboardWrapper = () => {
    useEffect(() => {
        // Charger le contenu HTML dans ce composant
        const adminDashboard = new AdminDashboard();
        window.adminDashboard = adminDashboard;
        
        return () => {
            // Cleanup
            if (window.adminDashboard) {
                window.adminDashboard.componentWillUnmount();
            }
        };
    }, []);

    return (
        <div dangerouslySetInnerHTML={{
            __html: `
                <!-- Copiez tout le contenu du body de votre Home.html ici -->
                <header class="header">
                    <!-- ... votre HTML existant ... -->
                </header>
                <!-- etc... -->
            `
        }} />
    );
};

export default AdminDashboardWrapper;
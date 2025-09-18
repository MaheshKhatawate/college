import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './footer';

function Layout() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
            <Header />
            <main className="pt-20"> {/* Add padding-top to account for fixed header */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;
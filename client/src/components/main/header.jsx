import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-amber-500/20">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span className="text-3xl animate-spin-slow">🕉️</span>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                        AyurDiet Pro
                    </h2>
                </div>
                
                <div className="flex gap-4">
                    <button 
                        className="group cursor-pointer relative px-6 py-3 border-2 border-amber-500 text-amber-500 rounded-full font-semibold transition-all duration-300 hover:bg-amber-500 hover:text-black hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/30 overflow-hidden"
                        onClick={() => navigate('/admin/dashboard')}
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>
                        <span className="relative flex items-center gap-2">
                            <span className="text-xl">👨‍⚕️</span>
                            Doctor
                        </span>
                    </button>
                    
                    <button 
                        className="group relative cursor-pointer px-6 py-3 border-2 border-amber-500 text-amber-500 rounded-full font-semibold transition-all duration-300 hover:bg-amber-500 hover:text-black hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/30 overflow-hidden"
                        onClick={() => navigate('/patient/dashboard')}
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>
                        <span className="relative flex items-center gap-2">
                            <span className="text-xl">🤱</span>
                            Patient
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Header;
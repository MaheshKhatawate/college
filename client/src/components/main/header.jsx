import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Stethoscope, UserRound } from 'lucide-react';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [hoveredTab, setHoveredTab] = useState(null); // 'doctor' | 'patient' | null

    // Determine active tab from current route
    const isDoctor = location.pathname.startsWith('/admin');
    const isPatient = location.pathname.startsWith('/patient');

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-amber-500/10 bg-gradient-to-b from-[#0b0b0d]/70 to-[#0f172a]/60 supports-[backdrop-filter]:backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Brand */}
                <button
                    onClick={() => navigate('/')}
                    className="group inline-flex items-center gap-3 cursor-pointer"
                    aria-label="Go to home"
                >
                    {/* Brand logo */}
                    <img
                        src="/assets/photos/logo-nobg.webp"
                        alt=""
                        aria-hidden="true"
                        className="h-15 w-15 sm:h-9 sm:w-9 object-contain drop-shadow"
                        decoding="async"
                        draggable="false"
                    />
                    <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent group-hover:from-amber-300 group-hover:to-amber-500 transition-colors">
                        AyurDiet Pro
                    </h1>
                </button>

                {/* Tabs-like Navigation */}
                <div className="relative w-full max-w-md hidden sm:block" role="tablist" aria-label="Primary">
                    <div className="relative p-1 rounded-full border border-amber-500/20 bg-white/[0.03] shadow-[inset_0_0_0_1px_rgba(255,191,0,0.06)]">
                        {/* Animated indicator */}
                        <span
                            className={`absolute top-1 bottom-1 left-1 w-1/2 rounded-full bg-gradient-to-br from-amber-400/25 to-amber-300/10 border border-amber-400/40 shadow-[0_0_0_1px_rgba(255,193,7,0.15),0_8px_30px_rgba(255,193,7,0.08)] backdrop-blur-md transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                (hoveredTab ? hoveredTab === 'patient' : isPatient) ? 'translate-x-full' : 'translate-x-0'
                            }`}
                            aria-hidden="true"
                        />

                        <div className="relative grid grid-cols-2 gap-1">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/admin/dashboard');
                                }}
                                onMouseEnter={() => setHoveredTab('doctor')}
                                onMouseLeave={() => setHoveredTab(null)}
                                className={`relative z-10 flex items-center justify-center gap-2 rounded-full px-6 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                                    (hoveredTab ? hoveredTab === 'doctor' : isDoctor) ? 'text-black' : 'text-amber-300 hover:text-amber-200'
                                }`}
                                aria-selected={isDoctor}
                                role="tab"
                            >
                                <Stethoscope size={18} className="hidden sm:inline-block" aria-hidden="true" />
                                Doctor
                            </button>

                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/patient/dashboard');
                                }}
                                onMouseEnter={() => setHoveredTab('patient')}
                                onMouseLeave={() => setHoveredTab(null)}
                                className={`relative z-10 flex items-center justify-center gap-2 rounded-full px-6 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                                    (hoveredTab ? hoveredTab === 'patient' : isPatient) ? 'text-black' : 'text-amber-300 hover:text-amber-200'
                                }`}
                                aria-selected={isPatient}
                                role="tab"
                            >
                                <UserRound size={18} className="hidden sm:inline-block" aria-hidden="true" />
                                Patient
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile actions */}
                <div className="flex sm:hidden items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/admin/dashboard');
                        }}
                        className="cursor-pointer rounded-full border border-amber-500/30 px-4 py-2 text-amber-300 text-sm font-semibold hover:bg-amber-500 hover:text-black transition-colors"
                    >
                        Doctor
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/patient/dashboard');
                        }}
                        className="cursor-pointer rounded-full border border-amber-500/30 px-4 py-2 text-amber-300 text-sm font-semibold hover:bg-amber-500 hover:text-black transition-colors"
                    >
                        Patient
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Header;
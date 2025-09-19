import React from 'react';

function Footer() {
    return (
        <footer className="relative z-10 bg-gradient-to-r from-black/95 via-slate-900/95 to-black/95 backdrop-blur-xl border-t border-amber-500/30 py-16 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-emerald-500 flex items-center justify-center shadow-lg animate-pulse">
                            <span className="text-2xl">🕉️</span>
                        </div>
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            AyurDiet Pro
                        </h3>
                    </div>
                    <p className="text-gray-300 text-xl leading-relaxed max-w-md">
                        Transforming Ayurvedic practice management with modern technology and ancient wisdom
                    </p>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                </div>
                
                <div className="space-y-6 text-gray-300">
                    <div className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🏛️</span>
                                <div>
                                    <span className="text-amber-400 font-semibold text-lg">Organization:</span>
                                    <p className="text-white font-medium">Ministry of Ayush</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🎓</span>
                                <div>
                                    <span className="text-emerald-400 font-semibold text-lg">Department:</span>
                                    <p className="text-white font-medium">All India Institute of Ayurveda (AIIA)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">💡</span>
                                <div>
                                    <span className="text-teal-400 font-semibold text-lg">Category:</span>
                                    <p className="text-white font-medium">MedTech / BioTech / HealthTech</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Copyright Section */}
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-amber-500/20 text-center">
                <p className="text-gray-400 text-lg">
                    © 2025 AyurDiet Pro. Bridging Ancient Wisdom with Modern Technology.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
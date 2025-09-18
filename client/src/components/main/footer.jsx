import React from 'react';

function Footer() {
    return (
        <footer className="bg-black/90 border-t border-amber-500/20 py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🕉️</span>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                            AyurDiet Pro
                        </h3>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed">
                        Transforming Ayurvedic practice management with modern technology
                    </p>
                </div>
                
                <div className="space-y-3 text-gray-300">
                    <p>
                        <span className="text-amber-400 font-semibold">Organization:</span> Ministry of Ayush
                    </p>
                    <p>
                        <span className="text-amber-400 font-semibold">Department:</span> All India Institute of Ayurveda (AIIA)
                    </p>
                    <p>
                        <span className="text-amber-400 font-semibold">Category:</span> MedTech / BioTech / HealthTech
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
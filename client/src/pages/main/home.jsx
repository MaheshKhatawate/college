import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const [currentFeature, setCurrentFeature] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const features = [
        {
            title: "8,000+ Food Database",
            description: "Comprehensive database covering Indian, multicultural, and international cuisines",
            icon: "🍽️"
        },
        {
            title: "Ayurvedic Principles",
            description: "Integrates six tastes (Rasa) and food properties (Hot/Cold, Easy/Difficult to digest)",
            icon: "🌿"
        },
        {
            title: "Automated Diet Charts",
            description: "Generate nutritionally balanced, Ayurveda-compliant diet plans instantly",
            icon: "📋"
        },
        {
            title: "Patient Management",
            description: "Comprehensive profiles with health parameters and dietary habits tracking",
            icon: "👥"
        }
    ];

    const stats = [
        { number: "8,000+", label: "Food Items" },
        { number: "100%", label: "Ayurveda Compliant" },
        { number: "24/7", label: "Cloud Access" },
        { number: "∞", label: "Recipes" }
    ];

    useEffect(() => {
        setIsLoaded(true);
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [features.length]);

    return (
        <div>
            {/* Hero Section */}
            <section className={`min-h-screen flex items-center relative pt-16 pb-16 px-4 sm:px-8 max-w-6xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                {/* Floating Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/5 left-1/10 text-5xl opacity-10 animate-bounce" style={{animationDuration: '6s', animationDelay: '0s'}}>🕉️</div>
                    <div className="absolute top-3/5 right-1/6 text-5xl opacity-10 animate-bounce" style={{animationDuration: '6s', animationDelay: '1s'}}>🌿</div>
                    <div className="absolute bottom-1/3 left-1/5 text-5xl opacity-10 animate-bounce" style={{animationDuration: '6s', animationDelay: '2s'}}>💊</div>
                    <div className="absolute top-2/5 right-1/4 text-5xl opacity-10 animate-bounce" style={{animationDuration: '6s', animationDelay: '3s'}}>📋</div>
                </div>
                
                <div className="flex-1 z-10">
                    {/* Hero Badge */}
                    <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 px-4 py-2 rounded-full mb-8 text-sm text-amber-400">
                        <span>Problem ID: 25024</span>
                        <span className="opacity-50">|</span>
                        <span>Ministry of Ayush - AIIA</span>
                    </div>
                    
                    {/* Hero Title */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                        Comprehensive Cloud-Based
                        <span className="block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                            Practice Management
                        </span>
                        <span className="block">& Nutrient Analysis Software</span>
                    </h1>
                    
                    {/* Hero Subtitle */}
                    <p className="text-xl sm:text-2xl text-amber-400 mb-6 opacity-90">
                        For Ayurvedic Dietitians, Tailored for Ayurveda-Focused Diet Plans
                    </p>
                    
                    {/* Hero Description */}
                    <div className="text-lg leading-relaxed text-gray-300 mb-12 max-w-2xl">
                        <p>
                            Bridging traditional Ayurvedic wisdom with modern nutritional science. 
                            Our platform integrates caloric values, food properties (Hot/Cold), 
                            digestibility factors, and the six tastes (Rasa) for holistic dietary care.
                        </p>
                    </div>
                    
                    {/* CTA Buttons */}
                    <div className="flex gap-6 flex-wrap justify-center sm:justify-start">
                        <button 
                            className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-black rounded-full text-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-400/40 relative overflow-hidden group"
                            onClick={() => navigate('/admin/dashboard')}
                        >
                            <span className="relative z-10">Start as Doctor</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        </button>
                        <button 
                            className="px-8 py-4 bg-transparent text-amber-400 border-2 border-amber-400 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-amber-400/10 hover:-translate-y-1"
                            onClick={() => navigate('/patient/dashboard')}
                        >
                            Patient Portal
                        </button>
                    </div>
                </div>

                {/* Hero Visual */}
                <div className="flex-1 flex justify-center items-center z-10 mt-12 lg:mt-0">
                    <div className="relative">
                        <div className="bg-amber-400/10 border border-amber-400/30 p-8 rounded-3xl text-center backdrop-blur-lg min-w-0 sm:min-w-80 animate-pulse" style={{animationDuration: '3s'}}>
                            <div className="text-5xl mb-4">{features[currentFeature].icon}</div>
                            <h3 className="text-amber-400 mb-4 text-xl font-semibold">{features[currentFeature].title}</h3>
                            <p className="text-gray-300 leading-relaxed">{features[currentFeature].description}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4 sm:px-8 bg-amber-400/5 border-y border-amber-400/10">
                <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center opacity-0 translate-y-8 animate-fade-in-up" style={{animationDelay: `${index * 0.2}s`, animationFillMode: 'forwards', animationDuration: '1s'}}>
                            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-2">
                                {stat.number}
                            </div>
                            <div className="text-gray-300 text-lg uppercase tracking-wide">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                        Revolutionary Features
                    </h2>
                    <p className="text-xl text-gray-300">
                        Transforming Ayurvedic practice with cutting-edge technology
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-amber-400/5 border border-amber-400/20 p-10 rounded-3xl text-center transition-all duration-300 hover:-translate-y-4 hover:shadow-xl hover:shadow-amber-400/10 hover:border-amber-400/40 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        <div className="text-6xl mb-6 opacity-80">🔬</div>
                        <h3 className="text-amber-400 text-xl font-semibold mb-4">Scientific Nutrient Data</h3>
                        <p className="text-gray-300 leading-relaxed">Calculated for men, women, and children across all age groups with precision</p>
                    </div>
                    
                    <div className="bg-amber-400/5 border border-amber-400/20 p-10 rounded-3xl text-center transition-all duration-300 hover:-translate-y-4 hover:shadow-xl hover:shadow-amber-400/10 hover:border-amber-400/40 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        <div className="text-6xl mb-6 opacity-80">🌍</div>
                        <h3 className="text-amber-400 text-xl font-semibold mb-4">Global Cuisine Database</h3>
                        <p className="text-gray-300 leading-relaxed">8,000+ food items covering Indian, multicultural, and international cuisines</p>
                    </div>
                    
                    <div className="bg-amber-400/5 border border-amber-400/20 p-10 rounded-3xl text-center transition-all duration-300 hover:-translate-y-4 hover:shadow-xl hover:shadow-amber-400/10 hover:border-amber-400/40 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        <div className="text-6xl mb-6 opacity-80">⚡</div>
                        <h3 className="text-amber-400 text-xl font-semibold mb-4">Automated Generation</h3>
                        <p className="text-gray-300 leading-relaxed">Instant diet chart creation with nutritionally balanced, Ayurveda-compliant plans</p>
                    </div>
                    
                    <div className="bg-amber-400/5 border border-amber-400/20 p-10 rounded-3xl text-center transition-all duration-300 hover:-translate-y-4 hover:shadow-xl hover:shadow-amber-400/10 hover:border-amber-400/40 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        <div className="text-6xl mb-6 opacity-80">🏥</div>
                        <h3 className="text-amber-400 text-xl font-semibold mb-4">Patient Management</h3>
                        <p className="text-gray-300 leading-relaxed">Comprehensive profiles with health parameters and dietary habits tracking</p>
                    </div>
                    
                    <div className="bg-amber-400/5 border border-amber-400/20 p-10 rounded-3xl text-center transition-all duration-300 hover:-translate-y-4 hover:shadow-xl hover:shadow-amber-400/10 hover:border-amber-400/40 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        <div className="text-6xl mb-6 opacity-80">🍲</div>
                        <h3 className="text-amber-400 text-xl font-semibold mb-4">Recipe Analysis</h3>
                        <p className="text-gray-300 leading-relaxed">Recipe-based diet charts with automated nutrient analysis and guidance</p>
                    </div>
                    
                    <div className="bg-amber-400/5 border border-amber-400/20 p-10 rounded-3xl text-center transition-all duration-300 hover:-translate-y-4 hover:shadow-xl hover:shadow-amber-400/10 hover:border-amber-400/40 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                        <div className="text-6xl mb-6 opacity-80">🔒</div>
                        <h3 className="text-amber-400 text-xl font-semibold mb-4">Security & Compliance</h3>
                        <p className="text-gray-300 leading-relaxed">HIPAA compliant with advanced data privacy and security measures</p>
                    </div>
                </div>
            </section>

            {/* Problem Statement Section */}
            <section className="py-24 px-4 sm:px-8 bg-amber-400/3">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                            The Challenge
                        </h2>
                        <div className="space-y-6 text-gray-300">
                            <p className="text-lg leading-relaxed">
                                Currently, in Ayurvedic hospitals, diet charts are prescribed manually 
                                by doctors in handwritten form. Existing software solutions primarily 
                                focus on macro- and micro-nutrient tracking but fail to align with 
                                Ayurvedic nutritional concepts.
                            </p>
                            <p className="text-lg leading-relaxed">
                                This gap creates inefficiencies, reduces accuracy, and makes it harder 
                                for practitioners to deliver holistic dietary care rooted in Ayurveda.
                            </p>
                        </div>
                    </div>
                    
                    <div>
                        <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                            Our Solution
                        </h2>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-amber-400/10 rounded-2xl border-l-4 border-amber-400 transition-all duration-300 hover:bg-amber-400/15 hover:translate-x-2">
                                <span className="text-2xl text-amber-400">✨</span>
                                <span className="text-white font-medium">Intuitive platform for Ayurvedic dietitians</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-amber-400/10 rounded-2xl border-l-4 border-amber-400 transition-all duration-300 hover:bg-amber-400/15 hover:translate-x-2">
                                <span className="text-2xl text-amber-400">⚡</span>
                                <span className="text-white font-medium">Quick food input and comprehensive tracking</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-amber-400/10 rounded-2xl border-l-4 border-amber-400 transition-all duration-300 hover:bg-amber-400/15 hover:translate-x-2">
                                <span className="text-2xl text-amber-400">🎯</span>
                                <span className="text-white font-medium">Ayurvedic dietary categorization</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-amber-400/10 rounded-2xl border-l-4 border-amber-400 transition-all duration-300 hover:bg-amber-400/15 hover:translate-x-2">
                                <span className="text-2xl text-amber-400">📱</span>
                                <span className="text-white font-medium">Mobile and tablet compatibility</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
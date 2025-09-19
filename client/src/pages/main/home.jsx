import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const [currentFeature, setCurrentFeature] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    const features = [
        {
            title: "8,000+ Food Database",
            description: "Comprehensive database covering Indian, multicultural, and international cuisines with detailed nutritional analysis",
            icon: "🍽️",
            image: "/assets/photos/food-database.jpg",
            gradient: "from-emerald-400 to-teal-600"
        },
        {
            title: "Ayurvedic Principles",
            description: "Integrates six tastes (Rasa) and food properties (Hot/Cold, Easy/Difficult to digest) with ancient wisdom",
            icon: "🌿",
            image: "/assets/photos/ayurveda-herbs.jpg",
            gradient: "from-green-400 to-emerald-600"
        },
        {
            title: "Automated Diet Charts",
            description: "Generate nutritionally balanced, Ayurveda-compliant diet plans instantly with AI-powered recommendations",
            icon: "📋",
            image: "/assets/photos/diet-planning.jpg",
            gradient: "from-blue-400 to-indigo-600"
        },
        {
            title: "Patient Management",
            description: "Comprehensive profiles with health parameters, dietary habits tracking, and progress monitoring",
            icon: "👥",
            image: "/assets/photos/patient-care.jpg",
            gradient: "from-purple-400 to-pink-600"
        }
    ];

    const stats = [
        { number: "8,000+", label: "Food Items", icon: "🍎" },
        { number: "100%", label: "Ayurveda Compliant", icon: "✅" },
        { number: "24/7", label: "Cloud Access", icon: "☁️" },
        { number: "∞", label: "Recipes", icon: "📚" }
    ];

    useEffect(() => {
        setIsLoaded(true);
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length);
        }, 4000);

        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);

        return () => {
            clearInterval(interval);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [features.length]);

    return (
        <div className="relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
                <div className="absolute inset-0 bg-[url('/assets/photos/ayurveda-pattern.png')] opacity-5"></div>
                <div 
                    className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-emerald-500/10 transition-transform duration-1000"
                    style={{ transform: `translateY(${scrollY * 0.5}px)` }}
                ></div>
            </div>

            {/* Hero Section */}
            <section className={`relative z-10 min-h-screen flex items-center pt-16 pb-16 px-4 sm:px-8 max-w-7xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                {/* Floating Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/5 left-1/10 text-6xl opacity-20 animate-bounce" style={{animationDuration: '6s', animationDelay: '0s'}}>🕉️</div>
                    <div className="absolute top-3/5 right-1/6 text-6xl opacity-20 animate-bounce" style={{animationDuration: '6s', animationDelay: '1s'}}>🌿</div>
                    <div className="absolute bottom-1/3 left-1/5 text-6xl opacity-20 animate-bounce" style={{animationDuration: '6s', animationDelay: '2s'}}>💊</div>
                    <div className="absolute top-2/5 right-1/4 text-6xl opacity-20 animate-bounce" style={{animationDuration: '6s', animationDelay: '3s'}}>📋</div>
                    <div className="absolute top-1/3 left-1/3 text-5xl opacity-15 animate-pulse" style={{animationDuration: '4s', animationDelay: '1s'}}>✨</div>
                    <div className="absolute bottom-1/5 right-1/3 text-5xl opacity-15 animate-pulse" style={{animationDuration: '4s', animationDelay: '2s'}}>🔬</div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                    {/* Hero Content */}
                    <div className="z-10">
                        {/* Hero Badge */}
                        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 backdrop-blur-sm border border-amber-400/30 px-6 py-3 rounded-full mb-8 text-sm font-medium">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-amber-300">Problem ID: 25024</span>
                            <span className="opacity-50">|</span>
                            <span className="text-emerald-300">Ministry of Ayush - AIIA</span>
                        </div>
                        
                        {/* Hero Title */}
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-8">
                            <span className="block text-white mb-2">Comprehensive</span>
                            <span className="block bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                                Cloud-Based
                            </span>
                            <span className="block text-white mb-2">Practice Management</span>
                            <span className="block text-2xl sm:text-3xl lg:text-4xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                & Nutrient Analysis Software
                            </span>
                        </h1>
                        
                        {/* Hero Subtitle */}
                        <p className="text-xl sm:text-2xl lg:text-3xl text-amber-300 mb-6 opacity-90 font-light">
                            For Ayurvedic Dietitians, Tailored for Ayurveda-Focused Diet Plans
                        </p>
                        
                        {/* Hero Description */}
                        <div className="text-lg leading-relaxed text-gray-300 mb-12 max-w-2xl">
                            <p className="text-xl">
                                Bridging traditional Ayurvedic wisdom with modern nutritional science. 
                                Our platform integrates caloric values, food properties (Hot/Cold), 
                                digestibility factors, and the six tastes (Rasa) for holistic dietary care.
                            </p>
                        </div>
                        
                        {/* CTA Buttons */}
                        <div className="flex gap-6 flex-wrap">
                            <button 
                                className="group px-10 py-5 bg-gradient-to-r from-amber-500 to-emerald-500 text-black rounded-full text-xl font-bold transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-amber-500/50 relative overflow-hidden"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/admin/dashboard');
                                }}
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    <span>Start as Doctor</span>
                                    <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">🚀</span>
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            </button>
                            <button 
                                className="group px-10 py-5 bg-transparent text-emerald-300 border-2 border-emerald-400 rounded-full text-xl font-bold transition-all duration-500 hover:bg-emerald-400/10 hover:scale-105 hover:border-emerald-300 backdrop-blur-sm"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/patient/dashboard');
                                }}
                            >
                                <span className="flex items-center gap-3">
                                    <span>Patient Portal</span>
                                    <span className="text-xl group-hover:translate-x-1 transition-transform duration-300">→</span>
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="z-10 relative">
                        <div className="relative">
                            {/* Main Feature Card */}
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br opacity-20" style={{backgroundImage: `linear-gradient(135deg, ${features[currentFeature].gradient.replace('from-', '').replace(' to-', ', ')})`}}></div>
                                
                                {/* Feature Image */}
                                <div className="relative mb-6 rounded-2xl overflow-hidden">
                                    <img 
                                        src={features[currentFeature].image} 
                                        alt={features[currentFeature].title}
                                        className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <div className="absolute top-4 right-4 text-4xl animate-pulse">
                                        {features[currentFeature].icon}
                                    </div>
                                </div>
                                
                                <h3 className="text-white text-2xl font-bold mb-4">{features[currentFeature].title}</h3>
                                <p className="text-gray-300 leading-relaxed text-lg">{features[currentFeature].description}</p>
                                
                                {/* Feature Indicators */}
                                <div className="flex gap-2 mt-6 justify-center">
                                    {features.map((_, index) => (
                                        <div 
                                            key={index}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                index === currentFeature 
                                                    ? 'bg-amber-400 scale-125' 
                                                    : 'bg-white/30 hover:bg-white/50'
                                            }`}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Floating Elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-400 to-emerald-500 rounded-full opacity-20 animate-pulse"></div>
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-15 animate-bounce" style={{animationDuration: '3s'}}></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative z-10 py-20 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 md:p-12">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center group cursor-pointer" style={{
                                    animation: `fadeInUp 1s ease-out forwards`,
                                    animationDelay: `${index * 0.2}s`,
                                    opacity: 0
                                }}>
                                    <div className="text-6xl mb-4 transition-transform duration-300 group-hover:scale-110">
                                        {stat.icon}
                                    </div>
                                    <div className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3 group-hover:animate-pulse">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-300 text-lg uppercase tracking-wider font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative z-10 py-32 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Revolutionary Features
                        </h2>
                        <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Transforming Ayurvedic practice with cutting-edge technology and ancient wisdom
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-3xl shadow-lg">
                                    🔬
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-4 group-hover:text-emerald-300 transition-colors duration-300">Scientific Nutrient Data</h3>
                                <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">Calculated for men, women, and children across all age groups with precision and accuracy</p>
                            </div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-3xl shadow-lg">
                                    🌍
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-4 group-hover:text-blue-300 transition-colors duration-300">Global Cuisine Database</h3>
                                <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">8,000+ food items covering Indian, multicultural, and international cuisines with detailed analysis</p>
                            </div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-3xl shadow-lg">
                                    ⚡
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-4 group-hover:text-purple-300 transition-colors duration-300">Automated Generation</h3>
                                <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">Instant diet chart creation with nutritionally balanced, Ayurveda-compliant plans using AI</p>
                            </div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-3xl shadow-lg">
                                    🏥
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-4 group-hover:text-green-300 transition-colors duration-300">Patient Management</h3>
                                <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">Comprehensive profiles with health parameters and dietary habits tracking for better outcomes</p>
                            </div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-3xl shadow-lg">
                                    🍲
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-4 group-hover:text-orange-300 transition-colors duration-300">Recipe Analysis</h3>
                                <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">Recipe-based diet charts with automated nutrient analysis and personalized guidance</p>
                            </div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-3xl shadow-lg">
                                    🔒
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-4 group-hover:text-cyan-300 transition-colors duration-300">Security & Compliance</h3>
                                <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">HIPAA compliant with advanced data privacy and security measures for patient protection</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Statement Section */}
            <section className="relative z-10 py-32 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Challenge Side */}
                        <div className="relative">
                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-10 shadow-2xl">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-400 to-orange-600 flex items-center justify-center text-2xl shadow-lg">
                                        ⚠️
                                    </div>
                                    <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                                        The Challenge
                                    </h2>
                                </div>
                                
                                <div className="space-y-6 text-gray-300">
                                    <p className="text-xl leading-relaxed">
                                        Currently, in Ayurvedic hospitals, diet charts are prescribed manually 
                                        by doctors in handwritten form. Existing software solutions primarily 
                                        focus on macro- and micro-nutrient tracking but fail to align with 
                                        Ayurvedic nutritional concepts.
                                    </p>
                                    <p className="text-xl leading-relaxed">
                                        This gap creates inefficiencies, reduces accuracy, and makes it harder 
                                        for practitioners to deliver holistic dietary care rooted in Ayurveda.
                                    </p>
                                </div>
                                
                                {/* Problem Illustration */}
                                <div className="mt-8 p-6 bg-red-400/10 rounded-2xl border border-red-400/20">
                                    <div className="flex items-center gap-3 text-red-300">
                                        <span className="text-2xl">📝</span>
                                        <span className="font-semibold">Manual handwritten prescriptions</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Solution Side */}
                        <div className="relative">
                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-10 shadow-2xl">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-2xl shadow-lg">
                                        💡
                                    </div>
                                    <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                        Our Solution
                                    </h2>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="group flex items-center gap-4 p-6 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-2xl border border-emerald-400/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">✨</span>
                                        <span className="text-white font-semibold text-lg">Intuitive platform for Ayurvedic dietitians</span>
                                    </div>
                                    <div className="group flex items-center gap-4 p-6 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-2xl border border-blue-400/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">⚡</span>
                                        <span className="text-white font-semibold text-lg">Quick food input and comprehensive tracking</span>
                                    </div>
                                    <div className="group flex items-center gap-4 p-6 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-2xl border border-purple-400/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🎯</span>
                                        <span className="text-white font-semibold text-lg">Ayurvedic dietary categorization</span>
                                    </div>
                                    <div className="group flex items-center gap-4 p-6 bg-gradient-to-r from-pink-400/10 to-red-400/10 rounded-2xl border border-pink-400/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">📱</span>
                                        <span className="text-white font-semibold text-lg">Mobile and tablet compatibility</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
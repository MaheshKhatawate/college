import React, { useState, useEffect } from 'react';
import { Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Card and FocusCards components (inline)
export const Card = React.memo(({ card, index, hovered, setHovered }) => (
    <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        className={cn(
            'rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden w-full transition-all duration-300 ease-out flex flex-col items-center',
            hovered !== null && hovered !== index && 'blur-sm scale-[0.98]'
        )}
    >
        <img
            src={card.src}
            alt={card.title}
            className="object-contain bg-white max-w-full max-h-[400px]"
            style={{ display: 'block' }}
        />
        <div
            className={cn(
                'absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300',
                hovered === index ? 'opacity-100' : 'opacity-0'
            )}
        >
            <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
                {card.title}
            </div>
        </div>
    </div>
));
Card.displayName = 'Card';

export function FocusCards({ cards }) {
    const [hovered, setHovered] = useState(null);
        return (
            <div className="flex gap-6 overflow-x-auto max-w-5xl mx-auto px-2 w-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {cards.map((card, index) => (
                    <div className="min-w-[250px] md:min-w-0 flex-1" key={card.title}>
                        <Card
                            card={card}
                            index={index}
                            hovered={hovered}
                            setHovered={setHovered}
                        />
                    </div>
                ))}
            </div>
        );
}

function Home() {
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    const stats = [
        { number: '8,000+', label: 'Food Items', icon: <Utensils className="inline w-10 h-10" /> },
        { number: '24/7', label: 'Cloud Access', icon: '☁️' },
        { number: '100%', label: 'Ayurveda Compliant', icon: '✅' },
    ];

    useEffect(() => {
        setIsLoaded(true);
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(120deg, #132a13 0%, #0f1f10 40%, #132a13 100%)',
                    }}
                />
                <div
                    className="absolute inset-0 opacity-60 transition-transform duration-1000"
                    style={{
                        backgroundImage:
                            'radial-gradient(60% 40% at 20% 20%, rgba(236,243,158,0.10) 0%, rgba(236,243,158,0.0) 60%), radial-gradient(50% 40% at 80% 70%, rgba(144,169,85,0.12) 0%, rgba(144,169,85,0.0) 60%)',
                        transform: `translateY(${scrollY * 0.5}px)`,
                    }}
                />
            </div>

            {/* Hero Section */}
            <section
                className={`relative z-10 min-h-screen pt-20 flex flex-col items-center transition-all duration-1000 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
            >
                {/* Hero Content */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#ecf39e1a] to-[#90a9551a] backdrop-blur-sm border border-[#ecf39e4d] px-6 py-3 rounded-full mb-8 text-sm font-medium">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-[#ecf39e]">Problem ID: 25024</span>
                        <span className="opacity-50">|</span>
                        <span className="text-[#90a955]">Ministry of Ayush - AIIA</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-8">
                        <span className="block text-white mb-2">Comprehensive</span>
                        <span className="block bg-gradient-to-r from-[#ecf39e] via-[#90a955] to-[#4f772d] bg-clip-text text-transparent mb-2">
                            Cloud-Based
                        </span>
                        <span className="block text-white mb-2">Practice Management</span>
                        <span className="block text-2xl sm:text-3xl lg:text-4xl bg-gradient-to-r from-[#ecf39e] to-[#90a955] bg-clip-text text-transparent">
                            & Nutrient Analysis Software
                        </span>
                    </h1>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-[#ecf39e] mb-6 opacity-90 font-light">
                        For Ayurvedic Dietitians, Tailored for Ayurveda-Focused Diet Plans
                    </p>
                    <div className="flex gap-6 flex-wrap justify-center">
                        <button
                            className="group px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-[#ecf39e] to-[#90a955] text-black rounded-full text-lg sm:text-xl font-bold transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-[#ecf39e66] relative overflow-hidden cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/admin/dashboard');
                            }}
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                <span>Start as Doctor</span>
                                <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">
                                    🚀
                                </span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        </button>
                        <button
                            className="group px-8 sm:px-10 py-4 sm:py-5 bg-transparent text-[#90a955] border-2 border-[#90a955] rounded-full text-lg sm:text-xl font-bold transition-all duration-500 hover:bg-[#90a9551a] hover:scale-105 hover:border-[#ecf39e] backdrop-blur-sm cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/patient/dashboard');
                            }}
                        >
                            <span className="flex items-center gap-3">
                                <span>Patient Portal</span>
                                <span className="text-xl group-hover:translate-x-1 transition-transform duration-300">
                                    →
                                </span>
                            </span>
                        </button>
                        <button
                            className="group px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-[#90a955] to-[#ecf39e] text-black rounded-full text-lg sm:text-xl font-bold transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-[#ecf39e66] relative overflow-hidden cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/main/nutrition-analyser');
                            }}
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                <span>Nutrition Analyser</span>
                                <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">
                                    🥗
                                </span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        </button>
                    </div>
                </div>

                {/* Image Gallery Card */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                    {/* FocusCards image gallery */}
                    <FocusCards
                        cards={[
                            {
                                src: '/assets/photos/ayurveda.webp',
                                title: 'Ayurvedic Principles',
                            },
                            {
                                src: '/assets/photos/diet-planning.webp',
                                title: 'Personalized Diet Plans',
                            },
                            {
                                src: '/assets/photos/food-database.webp',
                                title: 'Extensive Food Database',
                            },
                            {
                                src: '/assets/photos/patient-care.webp',
                                title: 'Patient Care Management',
                            },
                        ]}
                    />
                </div>
            {/* End Hero Section */}
            </section>

            {/* Stats Section */}
            <section className="relative z-10 py-20 px-4 sm:px-8">
                <div className="w-full flex justify-center">
                    <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-[#ecf39e33] p-8 md:p-12 inline-block">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="text-center group cursor-pointer"
                                    style={{
                                        animation: `fadeInUp 1s ease-out forwards`,
                                        animationDelay: `${index * 0.2}s`,
                                        opacity: 0,
                                    }}
                                >
                                    <div className="text-6xl mb-4 transition-transform duration-300 group-hover:scale-110">
                                        {stat.icon}
                                    </div>
                                    <div className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-[#ecf39e] via-[#90a955] to-[#4f772d] bg-clip-text text-transparent mb-3 group-hover:animate-pulse">
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
                        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#ecf39e] via-[#90a955] to-[#4f772d] bg-clip-text text-transparent">
                            Revolutionary Features
                        </h2>
                        <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Transforming Ayurvedic practice with cutting-edge technology and ancient wisdom
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-[#ecf39e33] p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#90a95533]">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#4f772d1a] to-[#90a9550d] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-[#4f772d] to-[#31572c] flex items-center justify-center text-3xl shadow-lg">
                                    🔬
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-4 group-hover:text-[#90a955] transition-colors duration-300">
                                    Scientific Nutrient Data
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">
                                    Calculated for men, women, and children across all age groups with precision and accuracy
                                </p>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-[#ecf39e33] p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#4f772d33]">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#31572c1a] to-[#4f772d0d] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-[#90a955] to-[#31572c] flex items-center justify-center text-3xl shadow-lg">
                                    🌍
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-4 group-hover:text-[#ecf39e] transition-colors duration-300">
                                    Global Cuisine Database
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">
                                    8,000+ food items covering Indian, multicultural, and international cuisines with detailed analysis
                                </p>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-[#ecf39e33] p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#31572c33]">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#ecf39e1a] to-[#90a9550d] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-[#ecf39e] to-[#90a955] flex items-center justify-center text-3xl shadow-lg">
                                    ⚡
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-4 group-hover:text-[#ecf39e] transition-colors duration-300">
                                    Automated Generation
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">
                                    Instant diet chart creation with nutritionally balanced, Ayurveda-compliant plans using AI
                                </p>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-[#ecf39e33] p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#90a95533]">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#4f772d1a] to-[#90a9550d] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-[#4f772d] to-[#90a955] flex items-center justify-center text-3xl shadow-lg">
                                    🏥
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-4 group-hover:text-[#90a955] transition-colors duration-300">
                                    Patient Management
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">
                                    Comprehensive profiles with health parameters and dietary habits tracking for better outcomes
                                </p>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-[#ecf39e33] p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#ecf39e33]">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#ecf39e1a] to-[#90a9550d] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-[#90a955] to-[#4f772d] flex items-center justify-center text-3xl shadow-lg">
                                    🍲
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-4 group-hover:text-[#ecf39e] transition-colors duration-300">
                                    Recipe Analysis
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">
                                    Recipe-based diet charts with automated nutrient analysis and personalized guidance
                                </p>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-[#ecf39e33] p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#4f772d33]">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#31572c1a] to-[#4f772d0d] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-[#31572c] to-[#4f772d] flex items-center justify-center text-3xl shadow-lg">
                                    🔒
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-4 group-hover:text-[#90a955] transition-colors duration-300">
                                    Security & Compliance
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">
                                    HIPAA compliant with advanced data privacy and security measures for patient protection
                                </p>
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
                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-[#ecf39e33] p-10 shadow-2xl">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4f772d] to-[#31572c] flex items-center justify-center text-2xl shadow-lg">
                                        ⚠️
                                    </div>
                                    <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#ecf39e] to-[#90a955] bg-clip-text text-transparent">
                                        The Challenge
                                    </h2>
                                </div>

                                <div className="space-y-6 text-gray-300">
                                    <p className="text-xl leading-relaxed">
                                        Currently, in Ayurvedic hospitals, diet charts are prescribed manually by doctors in handwritten form. Existing software solutions primarily focus on macro- and micro-nutrient tracking but fail to align with Ayurvedic nutritional concepts.
                                    </p>
                                    <p className="text-xl leading-relaxed">
                                        This gap creates inefficiencies, reduces accuracy, and makes it harder for practitioners to deliver holistic dietary care rooted in Ayurveda.
                                    </p>
                                </div>

                                {/* Problem Illustration */}
                                <div className="mt-8 p-6 bg-[#4f772d1a] rounded-2xl border border-[#4f772d33]">
                                    <div className="flex items-center gap-3 text-[#90a955]">
                                        <span className="text-2xl">📝</span>
                                        <span className="font-semibold">Manual handwritten prescriptions</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Solution Side */}
                        <div className="relative">
                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-[#ecf39e33] p-10 shadow-2xl">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#90a955] to-[#4f772d] flex items-center justify-center text-2xl shadow-lg">
                                        💡
                                    </div>
                                    <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#ecf39e] to-[#90a955] bg-clip-text text-transparent">
                                        Our Solution
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="group flex items-center gap-4 p-6 bg-gradient-to-r from-[#90a9551a] to-[#4f772d1a] rounded-2xl border border-[#90a95533] transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                                            ✨
                                        </span>
                                        <span className="text-white font-semibold text-lg">
                                            Intuitive platform for Ayurvedic dietitians
                                        </span>
                                    </div>
                                    <div className="group flex items-center gap-4 p-6 bg-gradient-to-r from-[#31572c1a] to-[#4f772d1a] rounded-2xl border border-[#31572c33] transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                                            ⚡
                                        </span>
                                        <span className="text-white font-semibold text-lg">
                                            Quick food input and comprehensive tracking
                                        </span>
                                    </div>
                                    <div className="group flex items-center gap-4 p-6 bg-gradient-to-r from-[#ecf39e1a] to-[#90a9551a] rounded-2xl border border-[#ecf39e33] transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                                            🎯
                                        </span>
                                        <span className="text-white font-semibold text-lg">
                                            Ayurvedic dietary categorization
                                        </span>
                                    </div>
                                    <div className="group flex items-center gap-4 p-6 bg-gradient-to-r from-[#4f772d1a] to-[#90a9551a] rounded-2xl border border-[#4f772d33] transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                        <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                                            📱
                                        </span>
                                        <span className="text-white font-semibold text-lg">
                                            Mobile and tablet compatibility
                                        </span>
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
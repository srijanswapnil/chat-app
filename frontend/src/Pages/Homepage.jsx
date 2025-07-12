import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Users, Zap, Shield, ArrowRight, Sparkles } from 'lucide-react';

const Homepage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate('/chats');
    }
    setIsVisible(true);
  }, [navigate]);

  const features = [
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Connect instantly with friends and communities"
    },
    {
      icon: Users,
      title: "Group Conversations",
      description: "Create and join vibrant group discussions"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Experience seamless, lag-free messaging"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your conversations are protected and encrypted"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900  to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className={`relative z-10 w-full max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-2xl">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-5xl sm:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 mb-6 tracking-tight">
            Talk-a-tive
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
            Where conversations come alive
          </p>
          
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Join thousands of users in meaningful conversations. Connect, share, and discover in our vibrant community.
          </p>
        </div>

        {/* Main CTA Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 sm:p-12 mb-16 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to start talking?
            </h2>
            <p className="text-gray-300 text-lg">
              Join our community today and be part of something amazing
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link to="/signup" className="flex-1">
              <button className="w-full group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </Link>
            
            <Link to="/login" className="flex-1">
              <button className="w-full px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20 ${
                isVisible ? 'animate-fadeIn' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">1M+</div>
              <div className="text-gray-300">Messages Sent</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-300">Communities</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Homepage;
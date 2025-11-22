import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, Apple, Trophy, Target, ChevronRight, 
  ArrowRight, Star, Play
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      id: "ai",
      title: "AI Workout Builder",
      desc: "Algorithms that adapt to your strength level week by week.",
      icon: Brain,
      color: "bg-purple-100 text-purple-600",
      colSpan: "md:col-span-2"
    },
    {
      id: "norep",
      title: "No-Rep Counter",
      desc: "Computer vision ensures perfect form.",
      icon: Target,
      color: "bg-red-100 text-red-600",
      colSpan: "md:col-span-1"
    },
    {
      id: "nutrition",
      title: "Smart Nutrition",
      desc: "Macro tracking that syncs with your metabolic rate.",
      icon: Apple,
      color: "bg-green-100 text-green-600",
      colSpan: "md:col-span-1"
    },
    {
      id: "community",
      title: "Community Hub",
      desc: "Join challenges and climb the global leaderboard.",
      icon: Trophy,
      color: "bg-yellow-100 text-yellow-600",
      colSpan: "md:col-span-2"
    }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-[999] bg-white border-b border-slate-200 shadow-sm h-20 px-8 flex items-center justify-between">
          
          {/* LEFT: Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group select-none" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <h1 className="text-3xl font-black tracking-tighter italic text-slate-900 group-hover:text-primary transition-colors">
              FIT<span className="text-primary">11</span>
            </h1>
          </div>
          
          {/* CENTER: Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 absolute left-1/2 transform -translate-x-1/2">
            <button onClick={() => scrollToSection('features')} className="hover:text-primary transition-colors cursor-pointer">Platform</button>
            <button onClick={() => scrollToSection('demo')} className="hover:text-primary transition-colors cursor-pointer">Demo</button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-primary transition-colors cursor-pointer">Stories</button>
          </div>

          {/* RIGHT: Auth Buttons */}
          <div className="flex items-center gap-4">
            <Button 
              className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-full px-6 font-medium transform hover:scale-105 transition-all duration-200 cursor-pointer" 
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
            
            <Button 
              className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-full px-6 font-medium transform hover:scale-105 transition-all duration-200 cursor-pointer" 
              onClick={() => navigate('/login')}
            >
              Get Started
            </Button>
          </div>
      </nav>

      {/* --- SPACER FOR NAVBAR --- */}
      {/* This invisible block guarantees content starts below the fixed nav */}
      <div className="h-28 w-full bg-transparent" />

      {/* --- HERO SECTION (CONTAINED LIKE CTA) --- */}
      <section className="px-6 pb-20">
        {/* The Container: Rounded, White, Shadowed (Similar to CTA style) */}
        <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] p-12 md:p-24 text-center shadow-sm border border-slate-100 relative overflow-hidden">
            
            {/* Subtle Background Pattern inside the card */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-dots.png')] opacity-30"></div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Badge */}
                <Badge variant="outline" className="mb-8 px-6 py-2 text-base font-medium border-orange-200 text-orange-700 bg-orange-50/50 rounded-full animate-fade-in inline-flex items-center cursor-default shadow-sm">
                <Star className="w-4 h-4 mr-2 fill-orange-400 text-orange-400" />
                The Future of Fitness Intelligence
                </Badge>
                
                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-900 leading-[1.1]">
                Build Your Ideal <br />
                <span className="bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                    Fitness Ecosystem
                </span>
                </h1>
                
                <p className="text-lg md:text-2xl text-slate-500 mb-12 max-w-3xl leading-relaxed">
                From automated workout planning to real-time form correction. 
                FIT11 combines AI precision with professional coaching structure.
                </p>
                
                {/* Single Button */}
                <Button 
                    size="lg" 
                    className="h-14 px-12 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25 w-auto transform hover:scale-105 transition-all duration-300 group cursor-pointer inline-flex items-center" 
                    onClick={() => navigate('/login')}
                >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
      </section>

      {/* --- PARTNERS SECTION --- */}
      <section id="testimonials" className="py-12 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">
            Trusted by fitness professionals at
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center text-black">
            <div className="flex justify-center">
              <h3 className="text-2xl font-black tracking-tighter hover:text-primary transition-colors cursor-pointer">GYMSHARK</h3>
            </div>
            <div className="flex justify-center">
              <h3 className="text-2xl font-black italic hover:text-primary transition-colors cursor-pointer">NIKE<span className="font-extrabold">TRAINING</span></h3>
            </div>
            <div className="flex justify-center">
              <h3 className="text-2xl font-black hover:text-primary transition-colors cursor-pointer">CROSSFIT</h3>
            </div>
            <div className="flex justify-center">
              <h3 className="text-2xl font-black font-serif hover:text-primary transition-colors cursor-pointer">GOLD'S GYM</h3>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES BENTO GRID --- */}
      <section id="features" className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              Everything you need to <br />
              <span className="text-primary">Dominate Your Goals</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              We replaced the guesswork with data. FIT11 gives you a comprehensive suite of tools to manage every aspect of your physiology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className={`${feature.colSpan} border-none shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden bg-white cursor-pointer`}
                onClick={() => navigate('/login')} 
              >
                <CardContent className="p-8 h-full flex flex-col justify-between relative">
                  <div className={`absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br ${feature.color.replace('text', 'from').replace('600', '100')} to-transparent rounded-full opacity-50 blur-2xl group-hover:scale-150 transition-transform`} />
                  
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-500 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                  
                  <div className="mt-8 flex items-center text-primary font-semibold text-sm group-hover:translate-x-2 transition-transform">
                    See in action <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-700/50">
            {[
              { label: "Active Users", value: "10k+" },
              { label: "Workouts Created", value: "50k+" },
              { label: "Calories Burned", value: "1M+" },
              { label: "App Store Rating", value: "4.9" },
            ].map((stat, i) => (
              <div key={i} className="px-4 group hover:-translate-y-1 transition-transform duration-300">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 group-hover:to-white transition-colors cursor-default">
                  {stat.value}
                </div>
                <div className="text-slate-400 font-medium uppercase tracking-wider text-xs md:text-sm cursor-default">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto bg-primary rounded-[2.5rem] p-12 md:p-20 text-center relative shadow-2xl shadow-orange-500/20 overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform?
            </h2>
            <p className="text-white/90 text-xl max-w-2xl mx-auto mb-10">
              Join 10,000+ athletes building their dream physique with FIT11. 
              Start your 7-day free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="h-14 px-8 bg-white text-primary hover:bg-slate-100 text-lg rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer" 
                onClick={() => navigate('/login')}
              >
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              {/* Footer Logo */}
              <h2 className="text-2xl font-black tracking-tighter italic text-slate-400 hover:text-primary transition-colors cursor-pointer">
                FIT11
              </h2>
            </div>
            <p className="text-sm text-slate-400">© 2024 FIT11 Inc. All rights reserved.</p>
            <div className="flex gap-6 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-primary transition-colors cursor-pointer">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors cursor-pointer">Terms</a>
              <a href="#" className="hover:text-primary transition-colors cursor-pointer">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import "@/app/globals.css";


export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Reusable Card Component
  const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 ${className}`}>
      {children}
    </div>
  );

  // Reusable Button Component
  const Button = ({ children, variant = 'primary', className = '', ...props }: { children: React.ReactNode, variant?: 'primary' | 'secondary', className?: string, [key: string]: any }) => (
    <button
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
        variant === 'primary' 
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/30' 
          : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute w-[40rem] h-[40rem] bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full mix-blend-soft-light filter blur-[100px] animate-pulse"
          style={{
            left: `${mousePosition.x * 0.05}px`,
            top: `${mousePosition.y * 0.05}px`,
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-[30rem] h-[30rem] bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full mix-blend-soft-light filter blur-[100px] animate-pulse" 
             style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-[25rem] h-[25rem] bg-gradient-to-r from-pink-600/20 to-rose-600/20 rounded-full mix-blend-soft-light filter blur-[100px] animate-pulse" 
             style={{ animationDelay: '2s' }} />
      </div>

      <main className="min-h-screen container mx-auto px-4 py-20">
        {/* Hero Section */}
        <section className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative mb-8">
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              Teens 4 Teens
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto font-light leading-relaxed">
              Join our team and make a <span className="text-pink-300 font-semibold">difference</span> in your community!
            </p>
          </div>
        </section>

        {/* Application CTA */}
        <section className={`w-full max-w-2xl mx-auto mb-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Card className="p-8 border-white/30">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Start Your Journey</h2>
              <p className="text-white/80 mb-8 text-lg leading-relaxed">
                We're looking for passionate teens to join our team. The application takes just 5 minutes to complete.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login" passHref>
                  <Button className="px-8 py-4 text-lg">
                    Apply Now
                  </Button>
                </Link>
                <Link href="https://www.teens4teens.net" passHref>
                  <Button variant="secondary" className="px-8 py-4 text-lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>

        {/* Benefits Section */}
        <section className={`mb-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Join Our Team?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                title: "Skill Development",
                description: "Gain valuable professional skills that will help you in college and beyond.",
                icon: "📈",
                color: "bg-gradient-to-r from-blue-400 to-purple-500"
              },
              {
                title: "Community Impact",
                description: "Make a real difference in the lives of other teens in your community.",
                icon: "🤝",
                color: "bg-gradient-to-r from-purple-500 to-pink-500"
              },
              {
                title: "Networking",
                description: "Connect with like-minded peers and professionals in your field of interest.",
                icon: "🌐",
                color: "bg-gradient-to-r from-pink-500 to-rose-500"
              }
            ].map((benefit, index) => (
              <Card key={index} className="p-6 h-full hover:border-white/40">
                <div className={`w-16 h-16 rounded-full ${benefit.color} flex items-center justify-center text-2xl mb-4 mx-auto`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-3">{benefit.title}</h3>
                <p className="text-white/80 text-center">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Application Steps */}
        <section className={`mb-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Simple Application Process
          </h2>
          <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
            {[
              {
                step: "1",
                title: "Complete the Form",
                description: "Fill out our simple online application"
              },
              {
                step: "2",
                title: "Interviews",
                description: "Two rounds of 15-20 minute interviews with our team"
              },
              {
                step: "3",
                title: "Get Started",
                description: "Begin your journey with Teens 4 Teens"
              }
            ].map((step, index) => (
              <div key={index} className="flex-1">
                <Card className="p-6 text-center hover:border-white/40">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl mb-4 mx-auto">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-white/80">{step.description}</p>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 rounded-2xl bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-white/20 mb-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
            <Link href="/apply" passHref>
              <Button className="px-8 py-4 text-lg mx-auto">
                Start Your Application
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-white/10 bg-gradient-to-b from-transparent to-black/30">
        <div className="container mx-auto px-4">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Teens 4 Teens. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [email, setEmail] = useState('');
  const [currentCount, setCurrentCount] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch current count on component mount
    fetchCurrentCount();
  }, []);

  const fetchCurrentCount = async () => {
    try {
      const response = await fetch('/api/count');
      const data = await response.json();
      setCurrentCount(data.count);
    } catch (_error) {
      console.error('Error fetching count:', _error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Successfully registered! Welcome to our premium client list.');
        setEmail('');
        setCurrentCount(data.newCount);
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setMessage('');
        }, 5000);
      } else {
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-emerald-950">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          {/* Logos */}
          <div className="mb-8">
            <div className="flex flex-col items-center space-y-4">
              {/* AppointMe Logo */}
              <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <Image
                  src="/PLOGO.png"
                  alt="AppointMe Logo"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Partnership indicator */}
              <div className="text-xs text-emerald-400 uppercase tracking-widest">
                In Partnership With
              </div>
              
              {/* Universal Eventspace Logo */}
              <div className="w-40 h-32 flex items-center justify-center p-2 shadow-lg -mt-6">
                <Image
                  src="/universal.png"
                  alt="Universal Eventspace Logo"
                  width={160}
                  height={128}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                AppointMe
              </span>
              <br />
              <span className="text-2xl sm:text-3xl text-gray-300">
                Universal Eventspace
              </span>
            </h1>
            
            <p className="text-lg text-gray-400 max-w-sm mx-auto">
              Exclusive event booking platform for Universal Eventspace by Peter &amp; Paul&apos;s Hospitality Group
            </p>
            
            <div className="text-sm text-emerald-400 font-medium">
              Powered by Onetap Software
            </div>
          </div>

          {/* Counter */}
          <div className="bg-gray-900/60 backdrop-blur-sm border border-emerald-800/30 rounded-2xl p-6 shadow-xl">
            <div className="text-center space-y-2">
              <p className="text-gray-400 text-sm uppercase tracking-wider">
                Accepting Only
              </p>
              <div className="text-3xl font-bold text-white">
                <span className="text-emerald-400">{currentCount}</span>
                <span className="text-gray-500 mx-2">/</span>
                <span>50</span>
              </div>
              <p className="text-gray-400 text-sm">
                Premium Event Bookings
              </p>
              <div className="w-full bg-gray-800 rounded-full h-2 mt-4">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentCount / 50) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-4 bg-gray-900/50 backdrop-blur-sm border border-emerald-800/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || currentCount >= 50}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Securing Your Booking...</span>
                </div>
              ) : currentCount >= 50 ? (
                'Event Bookings Full'
              ) : (
                'Reserve Your Event Slot'
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-xl ${
              message.includes('Successfully') 
                ? 'bg-green-900/50 border border-green-700 text-green-300' 
                : 'bg-red-900/50 border border-red-700 text-red-300'
            }`}>
              {message}
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 text-sm text-gray-500 space-y-2">
            <p>© 2025 AppointMe by Onetap Software</p>
            <p className="text-xs">
              In partnership with Universal Eventspace - Peter &amp; Paul&apos;s Hospitality Group
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

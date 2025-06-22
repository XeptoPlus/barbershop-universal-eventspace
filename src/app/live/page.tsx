'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface EmailData {
  emails: string[];
  count: number;
}

export default function LiveDashboard() {
  const [emailData, setEmailData] = useState<EmailData>({ emails: [], count: 2 });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/emails');
      const data = await response.json();
      setEmailData(data);
      setLastUpdate(new Date().toLocaleTimeString());
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching emails:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchEmails();

    // Set up real-time polling every 2 seconds
    const interval = setInterval(fetchEmails, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-emerald-950">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with Logos */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center space-y-4 mb-6">
              {/* AppointMe Logo */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <Image
                  src="/PLOGO.png"
                  alt="AppointMe Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Partnership indicator */}
              <div className="text-xs text-emerald-400 uppercase tracking-widest">
                In Partnership With
              </div>
              
              {/* Universal Eventspace Logo */}
              <div className="w-32 h-24 flex items-center justify-center p-2 shadow-lg -mt-4">
                <Image
                  src="/universal.png"
                  alt="Universal Eventspace Logo"
                  width={128}
                  height={96}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Live Waiting List
              </span>
            </h1>
            <p className="text-gray-400 mb-4">
              Real-time event booking submissions
            </p>
            
            {/* Live indicator */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-400">LIVE</span>
              <span className="text-xs text-gray-500">
                Last updated: {lastUpdate}
              </span>
            </div>
          </div>

          {/* Email List with Counter */}
          <div className="bg-gray-900/60 backdrop-blur-sm border border-emerald-800/30 rounded-2xl p-6 shadow-xl">
            {/* Counter Display */}
            <div className="text-center space-y-2 mb-8">
              <p className="text-gray-400 text-sm uppercase tracking-wider">
                Current Bookings
              </p>
              <div className="text-4xl font-bold text-white">
                <span className="text-emerald-400">{emailData.count}</span>
                <span className="text-gray-500 mx-2">/</span>
                <span>50</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 mt-4">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(emailData.count / 50) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Premium Event Bookings
              </h2>
              <div className="text-sm text-gray-400">
                {emailData.emails.length} submissions
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-400">Loading submissions...</span>
              </div>
            ) : emailData.emails.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-2">📧</div>
                <p className="text-gray-400">No submissions yet</p>
                <p className="text-sm text-gray-500">Email submissions will appear here in real-time</p>
              </div>
            ) : (
              <div className="space-y-3">
                {emailData.emails.slice().reverse().map((email, index) => {
                  const bookingNumber = emailData.emails.length - index;
                  return (
                    <div
                      key={`${email}-${bookingNumber}`}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-emerald-800/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                          <span className="text-emerald-400 text-sm font-semibold">
                            {bookingNumber}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{email}</p>
                          <p className="text-xs text-gray-500">Premium booking #{bookingNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                          CONFIRMED
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-500 space-y-2">
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
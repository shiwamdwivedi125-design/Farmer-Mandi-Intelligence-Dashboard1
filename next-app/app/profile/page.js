"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, MapPin, Bell, MessageCircle, LogOut, ArrowLeft, Settings, HelpCircle, ChevronDown, CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('settings'); // 'profile', 'settings', 'help'
  const [session, setSession] = useState(null);
  
  // Settings State
  const [language, setLanguage] = useState('hi');
  const [alertType, setAlertType] = useState('WhatsApp');
  const [threshold, setThreshold] = useState(2500);

  useEffect(() => {
    // Check simulated JWT
    const stored = localStorage.getItem('kisan_session');
    if (!stored) {
      router.push('/login');
    } else {
      setSession(JSON.parse(stored).user);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('kisan_session');
    router.push('/');
  };

  if (!session) return <p className="text-center mt-20">Loading Profile Data...</p>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Header */}
      <div className="bg-green-600 text-white pt-10 pb-24 px-6 relative">
        <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 hover:opacity-80 transition font-bold">
          <ArrowLeft size={20}/> Back to Dashboard
        </Link>
        <button onClick={handleLogout} className="absolute top-6 right-6 flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg transition">
          <LogOut size={16}/> Logout
        </button>
        
        <div className="max-w-4xl mx-auto text-center mt-8">
          <div className="w-24 h-24 bg-white text-green-600 mx-auto rounded-full flex items-center justify-center shadow-xl mb-4 text-4xl font-black">
            {session.name.charAt(0)}
          </div>
          <h1 className="text-3xl font-extrabold">{session.name}</h1>
          <p className="flex justify-center items-center gap-2 mt-2 opacity-90">
            <MapPin size={16}/> {session.location} 
            <span className="mx-2">|</span> 
            <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 flex items-center gap-1 rounded-full font-bold">
              <CheckCircle size={14}/> {session.badge}
            </span>
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 -mt-16">
        
        {/* Tab Navigation */}
        <div className="flex bg-white rounded-t-2xl shadow border-b border-gray-100 overflow-hidden">
          <button onClick={() => setActiveTab('settings')} className={`flex-1 py-4 font-bold flex justify-center items-center gap-2 ${activeTab === 'settings' ? 'bg-gray-50 text-green-600 border-b-4 border-green-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Settings size={18}/> Settings
          </button>
          <button onClick={() => setActiveTab('help')} className={`flex-1 py-4 font-bold flex justify-center items-center gap-2 ${activeTab === 'help' ? 'bg-gray-50 text-green-600 border-b-4 border-green-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            <HelpCircle size={18}/> Help & Support
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-8 rounded-b-2xl shadow-xl min-h-[400px]">
          
          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
              
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2"><User className="text-green-600"/> Language Preference</h3>
                <div className="flex gap-4">
                  <label className={`flex-1 relative cursor-pointer rounded-xl border p-4 ${language === 'hi' ? 'bg-green-50 border-green-500' : 'border-gray-200'}`}>
                    <input type="radio" className="sr-only" checked={language === 'hi'} onChange={() => setLanguage('hi')}/>
                    <div className="font-bold text-center">हिंदी (Hindi)</div>
                  </label>
                  <label className={`flex-1 relative cursor-pointer rounded-xl border p-4 ${language === 'en' ? 'bg-green-50 border-green-500' : 'border-gray-200'}`}>
                    <input type="radio" className="sr-only" checked={language === 'en'} onChange={() => setLanguage('en')}/>
                    <div className="font-bold text-center">English</div>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2"><Bell className="text-blue-500"/> Price Alert Thresholds</h3>
                <p className="text-sm text-gray-500 mb-4">Set your minimum price for Wheat. We will notify you instantly when Kanpur Mandi exceeds this price.</p>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-xl">₹</span>
                  <input type="number" value={threshold} onChange={e=>setThreshold(e.target.value)} className="w-full text-lg border border-gray-300 rounded-lg p-3 font-bold text-green-700 bg-gray-50 outline-none focus:ring-2 focus:ring-green-500" />
                  <span className="font-bold text-gray-500">/Quintal</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2"><MessageCircle className="text-purple-500"/> Notification Method</h3>
                <div className="flex gap-4">
                  <label className={`flex-1 relative cursor-pointer rounded-xl border p-4 ${alertType === 'SMS' ? 'bg-green-50 border-green-500' : 'border-gray-200'}`}>
                    <input type="radio" className="sr-only" checked={alertType === 'SMS'} onChange={() => setAlertType('SMS')}/>
                    <div className="font-bold text-center">Standard SMS</div>
                  </label>
                  <label className={`flex-1 relative cursor-pointer rounded-xl border p-4 ${alertType === 'WhatsApp' ? 'bg-green-50 border-green-500' : 'border-gray-200'}`}>
                    <input type="radio" className="sr-only" checked={alertType === 'WhatsApp'} onChange={() => setAlertType('WhatsApp')}/>
                    <div className="font-bold text-center text-green-600">WhatsApp 🟢</div>
                  </label>
                </div>
              </div>

              <button className="w-full py-4 text-white font-bold bg-green-600 hover:bg-green-700 rounded-xl shadow-lg transition mt-8">
                Save Preferences
              </button>

            </div>
          )}

          {/* HELP TAB */}
          {activeTab === 'help' && (
            <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
               <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b pb-2">Frequently Asked Questions</h3>
               <div className="space-y-4">
                  {[
                    { q: "Mandi price kab update hota hai?", a: "Prices har din subah 9 AM aur dopahar 2 PM National Agmarknet portal se live update hote hain." },
                    { q: "Kya main apna yield quantity badal sakta hoon?", a: "Haan, aap Dashboard par Profit Calculator mein apni yield quantity (Quintals mein) modify kar sakte hain." },
                    { q: "Voice alerts kaise enable karein?", a: "Dashboard par 'Voice Alert' button par click karein. Yeh bina active internet ke bhi browser ke through kaam karega." },
                  ].map((faq, i) => (
                    <div key={i} className="border rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition">
                      <div className="flex justify-between items-center font-bold">
                        {faq.q} <ChevronDown size={20} className="text-gray-400"/>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{faq.a}</p>
                    </div>
                  ))}
               </div>

               <div className="mt-10 p-6 bg-blue-50 rounded-xl border border-blue-100 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                    <PhoneCall size={24}/>
                  </div>
                  <h4 className="font-bold text-blue-900">Kisan Toll-Free Helpline</h4>
                  <p className="text-blue-800 text-2xl font-black tracking-widest mt-1">1800-180-1551</p>
                  <p className="text-sm mt-2 text-blue-600 opacity-80">(Available 6 AM to 10 PM)</p>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

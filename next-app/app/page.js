"use client";
import React, { useState, useEffect } from 'react';
import PriceChart from '../components/PriceChart';
import { 
  Leaf, Moon, Sun, Mic, Bot, X, Send, CloudSun, TrendingUp, TrendingDown, 
  Database, Users, Banknote, Building, MessageSquareWarning, Camera, MapPin, PhoneCall, Scan, RefreshCw,
  Activity, Target, Sprout, Truck, AlertTriangle, CheckSquare, Settings, HelpCircle, LogOut
} from 'lucide-react';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Namaste Ramesh! Main aapka AI Kisan Mitra hoon. Main aapki kaise madad kar sakta hoon? (Kya aap kisi fasal ki bimaari ke baare me puchna chahte hain?)' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Auth State
  const [session, setSession] = useState(null);

  const [prices, setPrices] = useState([]);
  const [yieldQty, setYieldQty] = useState(50);
  const [transportCost, setTransportCost] = useState(2000);
  const [profit, setProfit] = useState(0);

  // Db State
  const [reports, setReports] = useState([]);
  const [reportForm, setReportForm] = useState({ farmerName: '', mandiLocation: 'Kanpur', crowdLevel: 'Medium', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hackathon specific States
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [locationDetected, setLocationDetected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const basePriceKanpur = prices.find(p => p.mandi === 'Kanpur')?.price || 2300;

  useEffect(() => {
    // Check if user is logged in
    const stored = localStorage.getItem('kisan_session');
    if(stored) setSession(JSON.parse(stored).user);

    fetch('/api/prices')
      .then(res => res.json())
      .then(data => setPrices(data));
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const res = await fetch('/api/reports');
    if (res.ok) setReports(await res.json());
  };

  useEffect(() => {
    setProfit((yieldQty * basePriceKanpur) - transportCost);
  }, [yieldQty, basePriceKanpur, transportCost]);

  // Feature: Voice Assistant (Speech to Text)
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("🎙️ Voice recognition is not supported in this browser. Try Google Chrome!");
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Prioritize Hindi / India Accent
    recognition.continuous = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setChatInput(prev => (prev + " " + transcript).trim());
    };
    
    recognition.start();
  };

  // Feature 1: Advanced FAST Generative AI Chatbot (Gemini)
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    
    // 1. Immediately push user text to UI
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsChatLoading(true);
    
    try {
      // 2. Fetch from the real Generative AI backend
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history: chatMessages })
      });
      
      const data = await res.json();
      
      // 3. Push AI response to UI
      setChatMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'bot', text: "Network connection lost. Please try again." }]);
    }
    
    setIsChatLoading(false);
  };

  // Feature 2: Image Recognition Simulation
  const handleImageUpload = (e) => {
    if(e.target.files && e.target.files[0]) {
      setIsScanning(true);
      setScanResult(null);
      setTimeout(() => {
        setIsScanning(false);
        setScanResult({
          crop: 'Wheat',
          health: 'Excellent',
          mandi: 'Kanpur',
          price: `₹${basePriceKanpur}`,
          impact: 'Clear Weather - Premium Quality expected'
        });
      }, 3000);
    }
  };

  // Feature 3: Geo-Location Navigation
  const detectLocation = () => {
    setLocationDetected('loading');
    setTimeout(() => {
      setLocationDetected('Prayagraj');
    }, 2000);
  };

  // Feature 6: Smart Voice Alerts
  const triggerVoiceAlert = () => {
    if('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance();
      msg.text = `Ramesh ji, Namaste. Ek zaruri sooch-na... Gehu ka daam kanpur mandi mein pachees sau rupeye cross kar gaya hai. Kripya apna stock taiyaar rakhein!`;
      msg.lang = 'hi-IN'; // Hindi voice
      msg.rate = 0.9;
      window.speechSynthesis.speak(msg);
      alert("🎙️ Simulating Offline Voice Call to Ramesh...");
    } else {
      alert("Browser does not support Speech Synthesis.");
    }
  };

  // Feature: Offline Sync Simulator
  const handleOfflineSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert("✅ Success: Latest 250 Mandi Prices and 7-day weather forecasts have been cached locally securely. The app will now work without an active internet connection.");
    }, 2000);
  };

  const submitCommunityReport = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await fetch('/api/reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reportForm) });
    if (res.ok) {
      setReportForm({ farmerName: '', mandiLocation: 'Kanpur', crowdLevel: 'Medium', notes: '' });
      fetchReports();
    }
    setIsSubmitting(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      
      {/* Navbar Upgrade */}
      <nav className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl rounded-2xl border backdrop-blur-md px-6 py-4 flex justify-between items-center z-50 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/40 shadow-sm'}`}>
        <div className="flex items-center gap-2 font-bold text-xl text-green-600">
          <Leaf /> KisanMandi
        </div>
        <div className="hidden md:flex gap-6 uppercase text-sm font-semibold tracking-wide">
          <a href="#dashboard" className="hover:text-green-600 transition">Dashboard</a>
          <a href="#community" className="hover:text-green-600 transition">Forum</a>
          {/* Feature 7 Link */}
          <a href="/policy" className="hover:text-purple-600 text-purple-500 font-bold transition flex items-center gap-1"><Building size={16}/> Policy Gov</a>
          {session ? (
            <div className="relative group cursor-pointer pb-2 -mb-2">
              <div className="hover:bg-green-50 text-green-600 font-bold border border-green-600 px-4 py-1.5 rounded-full transition flex items-center gap-1">
                Hi, {session.name} <span className="text-xs">▼</span>
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 invisible group-hover:visible flex flex-col z-50 overflow-hidden transform origin-top-right scale-95 group-hover:scale-100">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{session.name}</p>
                  <p className="text-xs text-green-600 font-bold flex items-center gap-1 mt-0.5"><CheckSquare size={10}/> Verified Farmer</p>
                </div>
                <a href="/profile" className="px-4 py-3 hover:bg-green-50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium transition-colors">
                  <Settings size={16} className="text-gray-400"/> Settings
                </a>
                <a href="/profile" className="px-4 py-3 hover:bg-green-50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium transition-colors">
                  <HelpCircle size={16} className="text-gray-400"/> Help & Support
                </a>
                <button onClick={() => { localStorage.removeItem('kisan_session'); window.location.reload(); }} className="px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-3 font-bold w-full text-left transition-colors">
                  <LogOut size={16}/> Logout
                </button>
              </div>
            </div>
          ) : (
            <a href="/login" className="hover:bg-gray-100 text-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 font-bold border px-4 py-1 rounded-full transition flex items-center gap-1">
              Login / Register
            </a>
          )}
        </div>
        <div className="flex gap-3 items-center">
          {/* Hackathon Item: Offline Mode Interactive Badge */}
          <button onClick={handleOfflineSync} disabled={isSyncing} className="hidden lg:flex items-center gap-2 bg-gray-100 hover:bg-green-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 font-bold shadow-sm">
            {isSyncing ? (
              <><RefreshCw size={12} className="animate-spin text-green-600"/> Caching Data...</>
            ) : (
              <><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Offline Sync Active</>
            )}
          </button>

          {/* Feature 6: Voice Sync Button */}
          <button onClick={triggerVoiceAlert} className="flex gap-2 items-center px-4 md:py-2 rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400 font-bold hover:bg-red-200 transition">
            <PhoneCall size={16}/> <span className="hidden md:inline">Voice Alert</span>
          </button>
          
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
          </button>
        </div>
      </nav>

      {/* Hero Section (Slide 1) - Now with AI Background Image and Glassmorphism */}
      <section className="relative pt-32 pb-20 px-6 text-center w-full min-h-[500px] flex flex-col justify-center items-center bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('/images/hero-bg.png')" }}>
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-0"></div>
        
        <div className="relative z-10 p-10 rounded-3xl backdrop-blur-md bg-white/10 dark:bg-black/30 border border-white/20 shadow-2xl max-w-4xl mx-auto transform transition duration-500 hover:scale-[1.02]">
          <div className="flex justify-center flex-wrap gap-4 mb-6">
            <span className="inline-block py-1 px-4 rounded-full bg-green-500/90 backdrop-blur-lg text-white text-xs font-bold animate-pulse shadow-lg shadow-green-500/30 border border-green-400/50">
              Codeathon 2026 - AI Feature Pack Active
            </span>
            <span className="inline-block py-1 px-4 rounded-full bg-blue-500/90 backdrop-blur-lg text-white text-xs font-bold shadow-lg shadow-blue-500/30 border border-blue-400/50">
              PS-A03: AI for Bharat
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-white drop-shadow-lg tracking-tight">
            Farmer Mandi Intelligence
          </h1>
          <p className="text-xl opacity-90 mb-2 max-w-2xl mx-auto text-gray-100 font-medium">
            Empowering Farmers with Data Literacy: Real-time pricing, AI trend predictions, and profit transparency calculation.
          </p>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className="max-w-7xl mx-auto px-6 py-6">
        
        {/* NEW HACKATHON FEATURES ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Feature 2: Image Recognition */}
          <div className={`rounded-3xl p-8 border backdrop-blur-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-900/10 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/80 shadow-xl shadow-blue-900/5'}`}>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400"><Camera className="text-green-500"/> AI Image Crop Recognition</h3>
            <p className="mb-4 opacity-70 text-sm">Upload a photo of your harvest instead of typing. We will detect the crop and fetch real-time market impacts.</p>
            
            <div className="relative">
              <input type="file" onChange={handleImageUpload} className={`w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 ${darkMode ? 'text-gray-400 file:bg-green-900 file:text-green-300' : 'text-gray-600'} cursor-pointer border-2 border-dashed p-4 rounded-xl border-green-500/50`} />
              
              {isScanning && (
                <div className="mt-4 flex flex-col items-center justify-center p-6 bg-green-100/50 dark:bg-green-900/20 rounded-xl">
                  <Scan size={40} className="text-green-500 animate-spin" />
                  <p className="mt-2 font-bold animate-pulse text-green-600">AI Deep Scanning Crop Vector...</p>
                </div>
              )}

              {scanResult && !isScanning && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/40 rounded-xl border border-green-200 dark:border-green-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h4 className="font-bold text-lg text-green-700 dark:text-green-400 mb-2">✅ AI Result: {scanResult.crop}</h4>
                  <ul className="text-sm space-y-1 opacity-90">
                    <li><strong>Health:</strong> {scanResult.health}</li>
                    <li><strong>Nearest Best Mandi:</strong> {scanResult.mandi} (Current: {scanResult.price})</li>
                    <li><strong>Agro-Weather Impact:</strong> {scanResult.impact}</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Feature 3: Geo-Location & Transport Routing */}
          <div className={`rounded-3xl p-8 border backdrop-blur-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/10 flex flex-col justify-center ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/80 shadow-xl shadow-blue-900/5'}`}>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500"><MapPin className="text-blue-500"/> Smart Geo-Routing</h3>
            <p className="mb-6 opacity-70 text-sm">Automatically detects your farm's GPS coordinates to calculate transport economics and suggest the best local mandi.</p>
            
            {!locationDetected && <button onClick={detectLocation} className="w-full py-4 rounded-xl bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 transition dark:bg-blue-900 dark:text-blue-300">
              Locate My Farm via GPS
            </button>}
            
            {locationDetected === 'loading' && <p className="text-center font-bold animate-pulse"><RefreshCw className="animate-spin inline mr-2"/> Detecting Satellites...</p>}
            
            {locationDetected === 'Prayagraj' && (
               <div className="p-4 bg-blue-50 dark:bg-blue-900/40 rounded-xl border border-blue-200 dark:border-blue-800">
                 <h4 className="font-bold text-lg text-blue-700 dark:text-blue-400 mb-2">📍 Location: District Prayagraj</h4>
                 <p className="text-sm opacity-90 leading-relaxed">
                   <strong>Route AI Suggestion:</strong> Although Kanpur offers ₹2300/Q, your local <strong>Allahabad Mandi</strong> is currently at ₹2100/Q.<br/><br/>
                   Because your transport distance is reduced by 180km, selling locally increases your net margin by <strong>₹450/Trip</strong>!
                 </p>
               </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Chart Column */}
          <div className={`lg:col-span-2 flex flex-col rounded-3xl p-2 border backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20 ${darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-white/90 border-white shadow-2xl shadow-indigo-900/5'}`}>
            <div className={`p-6 rounded-t-2xl border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-2"><Activity className="text-indigo-500 animate-pulse"/> AI Price Prediction</h2>
              
              <div className="flex gap-3">
                <div className={`px-4 py-2 rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-indigo-50 border-indigo-100'}`}>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kanpur Rate</p>
                  <p className="font-black text-xl text-indigo-600">₹{basePriceKanpur}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-green-50 border-green-100'}`}>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">7-Day Forecast</p>
                  <p className="font-black text-xl text-green-600 flex items-center gap-1">+₹80 <TrendingUp size={16}/></p>
                </div>
              </div>
            </div>

            <div className="p-6 flex-1 relative h-72 w-full">
              {prices.length > 0 && <PriceChart currentPrice={basePriceKanpur} />}
            </div>

            <div className={`m-4 p-5 rounded-2xl border flex items-start gap-4 ${darkMode ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-indigo-100'}`}>
              <div className="bg-indigo-500 text-white p-2 rounded-xl">
                <Target size={24}/>
              </div>
              <div>
                <h4 className="font-extrabold text-indigo-900 dark:text-indigo-300 text-sm uppercase tracking-wider mb-1">AI Seasonal Insights</h4>
                <p className="text-sm font-medium opacity-80 leading-relaxed text-indigo-950 dark:text-indigo-200">
                  <strong className="text-indigo-600 dark:text-indigo-400">Alert:</strong> Weather models predict a dry spell in 3 weeks. Retain 15% Wheat yield as scarcity may drive Kanpur mandi prices up to <strong className="text-green-600 dark:text-green-400">₹2450/qtl</strong>.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 flex flex-col h-full">
            <div className={`flex-1 flex flex-col rounded-3xl p-8 border backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/20 ${darkMode ? 'bg-gray-800/60 border-gray-700' : 'bg-white/90 border-white shadow-2xl shadow-yellow-900/5'}`}>
              <h3 className="text-2xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center gap-2">
                <Banknote className="text-yellow-500"/> Profit Calculator
              </h3>
              
              <div className="space-y-6 flex-1">
                <div className="relative">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Total Yield To Sell</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 opacity-50"><Sprout size={20}/></div>
                    <input 
                      type="number" 
                      value={yieldQty} 
                      onChange={e=>setYieldQty(Number(e.target.value))}
                      className="w-full text-lg font-bold pl-12 pr-16 py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-yellow-500 outline-none transition"
                    />
                    <span className="absolute right-4 font-bold text-gray-400">Qtl</span>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-70">Estimated Logistics Cost</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 opacity-50"><Truck size={20}/></div>
                    <input 
                      type="number" 
                      value={transportCost} 
                      onChange={e=>setTransportCost(Number(e.target.value))}
                      className="w-full text-lg font-bold pl-12 pr-12 py-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-yellow-500 outline-none transition"
                    />
                    <span className="absolute right-4 font-bold text-gray-400">₹</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-dashed border-gray-300 dark:border-gray-600 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-4 text-xs font-bold text-gray-400">NET RETURN</div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl p-6 text-center text-white shadow-xl shadow-green-500/30 transform hover:-translate-y-1 transition duration-300">
                  <p className="text-sm font-bold opacity-90 mb-1">Projected Total Profit</p>
                  <h4 className="text-5xl font-black tracking-tighter">₹{profit.toLocaleString('en-IN')}</h4>
                  <p className="text-xs mt-3 opacity-80 backdrop-blur-sm bg-white/20 inline-block px-3 py-1 rounded-full">Calculated using live API data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 5: Farmer Community Forum (Using Real Database) */}
      <section id="community" className="max-w-7xl mx-auto px-6 py-12 relative">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black mb-3 inline-flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
            <Users className="text-indigo-500" size={36}/> Social Farmer Forum
          </h2>
          <p className="opacity-70 font-medium max-w-xl mx-auto text-sm">Verified crowd-sourced intelligence directly from the ground. Real-time reports saved via MongoDB.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Submit form -> POST Database */}
          <div className={`rounded-3xl p-8 border backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/90 border-white/80 shadow-2xl'}`}>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 text-indigo-700 dark:text-indigo-400"><MessageSquareWarning size={24}/> Start a Discussion</h3>
            <p className="opacity-70 mb-8 text-sm">Warn other farmers about mandi crowding or local scams.</p>
            <form onSubmit={submitCommunityReport} className="space-y-5">
              <input required type="text" placeholder="Your Name (e.g. Ramesh)" value={reportForm.farmerName} onChange={e=>setReportForm({...reportForm, farmerName: e.target.value})} className={`w-full px-5 py-4 rounded-xl border font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} />
              
              <div className="relative">
                <select value={reportForm.crowdLevel} onChange={e=>setReportForm({...reportForm, crowdLevel: e.target.value})} className={`w-full px-5 py-4 rounded-xl border font-medium focus:ring-2 focus:ring-indigo-500 outline-none appearance-none transition ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`}>
                  <option value="Low">🟢 Low Crowd Level (Smooth Entry)</option>
                  <option value="Medium">🟡 Medium Crowd Level (Expect Delays)</option>
                  <option value="High">🔴 High Crowd Level (Avoid Today!)</option>
                </select>
              </div>

              <textarea placeholder="Write your post/experience..." value={reportForm.notes} onChange={e=>setReportForm({...reportForm, notes: e.target.value})} className={`w-full px-5 py-4 rounded-xl border font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-28 transition ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`} />

              <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transform transition hover:-translate-y-1">
                {isSubmitting ? 'Posting to Base...' : 'Broadcast to Network'}
              </button>
            </form>
          </div>

          {/* Social Feed -> GET Database */}
          <div className={`rounded-3xl p-8 border backdrop-blur-xl ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/90 border-white/80 shadow-2xl'}`}>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Database className="text-blue-500" size={24}/> Intelligence Feed</h3>
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-3 elegant-scrollbar">
              {reports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 opacity-50">
                  <MessageSquareWarning size={48} className="mb-4 text-gray-400"/>
                  <p className="font-medium text-center">No discussions yet.<br/>Be the first to report!</p>
                </div>
              ) : reports.map((rep, idx) => (
                <div key={idx} className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${darkMode ? 'border-gray-700 bg-gray-900/50 hover:border-gray-600' : 'border-gray-100 bg-gray-50 hover:border-indigo-100 hover:bg-white'}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center rounded-2xl text-white font-black text-lg shadow-md flex-shrink-0 transform rotate-3">
                      {rep.farmerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <strong className="text-indigo-700 dark:text-indigo-300 font-black">{rep.farmerName}</strong>
                        <span className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-black ${rep.crowdLevel === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : rep.crowdLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'}`}>
                          {rep.crowdLevel}
                        </span>
                      </div>
                      <p className="text-sm font-medium opacity-80 leading-relaxed text-gray-800 dark:text-gray-200">"{rep.notes || "Live update from mandi."}"</p>
                      
                      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center text-xs opacity-60 font-bold">
                        <button className="flex items-center gap-1 hover:text-red-500 transition-colors"><Leaf size={14}/> Appreciate</button>
                        <span>{new Date(rep.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Codeathon Presentation Extra Slides Sections */}
      <section className="relative bg-gray-50 dark:bg-gray-900/40 py-20 overflow-hidden border-t border-gray-200 dark:border-gray-800">
        {/* Decorative background blurs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Feasibility & Viability (Slide 4) */}
            <div className="flex flex-col h-full">
              <h2 className="text-3xl font-black tracking-tight mb-8 flex items-center gap-3">
                <Building className="text-blue-500" size={32}/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Feasibility & Viability</span>
              </h2>
              <div className="p-8 flex-1 border border-indigo-100 dark:border-indigo-900/50 rounded-3xl bg-indigo-50/50 dark:bg-indigo-900/10 backdrop-blur-md shadow-xl transition-all duration-300">
                
                <h4 className="font-black tracking-widest uppercase text-xs text-red-500 mb-4 flex items-center gap-2">⚠️ Core Challenges</h4>
                <ul className="space-y-3 opacity-90 text-sm font-medium mb-8">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-black">❌</span>
                    <span className="leading-relaxed">Data cleaning complexity (missing values, unverified Agmarknet data).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-black">❌</span>
                    <span className="leading-relaxed">Farmers’ digital literacy barriers and low-bandwidth internet in rural areas.</span>
                  </li>
                </ul>

                <hr className="border-indigo-200 dark:border-indigo-800 border-dashed mb-8"/>

                <h4 className="font-black tracking-widest uppercase text-xs text-green-600 mb-4 flex items-center gap-2">💡 Execution Strategies</h4>
                <ul className="space-y-3 opacity-90 text-sm font-medium text-green-950 dark:text-green-100">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-black">✅</span>
                    <span className="leading-relaxed">Use robust Simple Moving Averages algorithm for localized predictions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-black">✅</span>
                    <span className="leading-relaxed">Implement Bilingual UI + HTML5 Voice Alerts for maximum digital accessibility.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Impact & Benefits (Slide 5) */}
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-8 flex items-center gap-3">
                <Leaf className="text-emerald-500" size={32}/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600">Impact & Benefits</span>
              </h2>
              <div className="grid grid-cols-2 gap-5">
                <div className="p-6 rounded-3xl border border-blue-200 bg-white dark:bg-gray-800 shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 group">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition"><Users size={20}/></div>
                  <h4 className="font-black text-blue-700 dark:text-blue-400 mb-1">Social</h4>
                  <p className="text-sm font-medium opacity-80 leading-relaxed">Empowers data literacy, fundamentally reducing middleman exploitation.</p>
                </div>
                <div className="p-6 rounded-3xl border border-green-200 bg-white dark:bg-gray-800 shadow-lg hover:shadow-green-500/20 transition-all duration-300 hover:-translate-y-2 group">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3 group-hover:scale-110 transition"><Banknote size={20}/></div>
                  <h4 className="font-black text-green-700 dark:text-green-400 mb-1">Economic</h4>
                  <p className="text-sm font-medium opacity-80 leading-relaxed">Boosts net profits directly via transport and predictive yield optimization.</p>
                </div>
                <div className="p-6 rounded-3xl border border-yellow-200 bg-white dark:bg-gray-800 shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 hover:-translate-y-2 group">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mb-3 group-hover:scale-110 transition"><Leaf size={20}/></div>
                  <h4 className="font-black text-yellow-700 dark:text-yellow-400 mb-1">Environmental</h4>
                  <p className="text-sm font-medium opacity-80 leading-relaxed">Smarter selling logic reduces supply chain waste and carbon emissions.</p>
                </div>
                <div className="p-6 rounded-3xl border border-purple-200 bg-white dark:bg-gray-800 shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-2 group">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition"><Building size={20}/></div>
                  <h4 className="font-black text-purple-700 dark:text-purple-400 mb-1">Policy</h4>
                  <p className="text-sm font-medium opacity-80 leading-relaxed">Provides micro-level macro insights for FCI Government procurement.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Research & References (Slide 6) */}
          <div className="mt-28 text-center max-w-4xl mx-auto border-t border-gray-300 dark:border-gray-800 pt-16">
            <h2 className="text-2xl font-black mb-8 tracking-wide">Research & Data Architecture</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://agmarknet.gov.in/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full border-2 bg-white dark:bg-gray-800 text-sm font-black text-gray-600 dark:text-gray-300 hover:bg-green-50 hover:text-green-600 hover:border-green-500 transition-all duration-300 shadow-md hover:shadow-green-500/20 hover:-translate-y-1">
                Agmarknet (data.gov.in) ↗
              </a>
              <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full border-2 bg-white dark:bg-gray-800 text-sm font-black text-gray-600 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-500 transition-all duration-300 shadow-md hover:shadow-blue-500/20 hover:-translate-y-1">
                OpenWeather API ↗
              </a>
              <a href="https://mospi.gov.in/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full border-2 bg-white dark:bg-gray-800 text-sm font-black text-gray-600 dark:text-gray-300 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-500 transition-all duration-300 shadow-md hover:shadow-yellow-500/20 hover:-translate-y-1">
                MOSPI / RBI Datasets ↗
              </a>
              <a href="https://upfr.agristack.gov.in/" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full border-2 bg-white dark:bg-gray-800 text-sm font-black text-gray-600 dark:text-gray-300 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-500 transition-all duration-300 shadow-md hover:shadow-purple-500/20 hover:-translate-y-1">
                U.P Farmer Case Studies ↗
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Floating AI Chatbot */}
      <button onClick={() => setIsAiOpen(!isAiOpen)} className="fixed bottom-8 right-8 w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center shadow-red-500/20 shadow-2xl hover:scale-110 transition z-50 animate-bounce">
        <Bot size={30} />
      </button>

      {isAiOpen && (
        <div className={`fixed bottom-28 right-8 w-80 h-[450px] flex flex-col rounded-3xl overflow-hidden shadow-2xl z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
          <div className="bg-green-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold"><Bot /> AI Kisan Mitra</div>
            <button onClick={() => setIsAiOpen(false)}><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((m, i) => (
              <div key={i} className={`p-3 rounded-2xl max-w-[85%] text-sm ${m.sender === 'user' ? 'bg-green-600 text-white ml-auto rounded-tr-sm' : `rounded-tl-sm ${darkMode?'bg-gray-700':'bg-gray-100'}`}`}>
                {m.text}
              </div>
            ))}
            {isChatLoading && (
              <div className={`p-3 rounded-2xl max-w-[85%] text-sm rounded-tl-sm w-16 flex justify-center gap-1 ${darkMode?'bg-gray-700':'bg-gray-100'}`}>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
              </div>
            )}
          </div>
          <div className={`p-3 border-t flex gap-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button 
              onClick={startListening} 
              title="Speak in Hindi/English" 
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.7)]' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
            >
              <Mic size={18} />
            </button>
            <input 
              type="text" 
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendChat()}
              placeholder={isListening ? "Listening... (Bolिये)" : "Type or click mic to speak..."} 
              className={`flex-1 px-4 py-2 rounded-full outline-none text-sm border-2 transition-colors ${isListening ? 'border-red-400 bg-red-50 dark:bg-red-900/20' : 'border-transparent'} ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            />
            <button onClick={handleSendChat} disabled={!chatInput.trim()} className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${chatInput.trim() ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'}`}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

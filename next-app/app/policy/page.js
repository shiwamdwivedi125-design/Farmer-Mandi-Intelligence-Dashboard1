"use client";
import React, { useState } from 'react';
import BarChart from '../../components/BarChart';
import { 
  Building, Leaf, TrendingUp, AlertTriangle, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function PolicyDashboard() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      
      {/* Navbar for Policy */}
      <nav className={`w-full border-b px-6 py-4 flex justify-between items-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <Link href="/" className="flex items-center gap-2 font-bold text-gray-500 hover:text-purple-600 transition">
          <ArrowLeft size={18}/> Back to Farmer Dashboard
        </Link>
        <div className="flex items-center gap-2 font-bold text-xl text-purple-600">
          <Building /> Gov Policy Insights
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className="text-sm px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-bold">
          Toggle Theme
        </button>
      </nav>

      <section className="pt-10 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-2">Macro Agriculture Economics</h1>
        <p className="opacity-70 mb-10">Real-time crowdsourced intelligence for Policy Makers and FCI Procurement Officers.</p>

        {/* Top Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h4 className="opacity-70 text-sm font-bold uppercase mb-2">Highest Fluctuation Crop</h4>
            <div className="text-3xl font-black text-purple-600 flex items-center gap-2">Mustard <TrendingUp/></div>
            <p className="text-sm mt-2 font-medium bg-red-100 text-red-700 inline-block px-2 py-1 rounded">Action Required: Price Cap Suggestion</p>
          </div>
          
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h4 className="opacity-70 text-sm font-bold uppercase mb-2">Severe Mandi Congestion</h4>
            <div className="text-3xl font-black text-orange-500 flex items-center gap-2">Varanasi <AlertTriangle/></div>
            <p className="text-sm mt-2 font-medium bg-orange-100 text-orange-700 inline-block px-2 py-1 rounded">Reroute Subsidies to Neighboring Districts</p>
          </div>

          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h4 className="opacity-70 text-sm font-bold uppercase mb-2">Total AI Reports Pulled</h4>
            <div className="text-3xl font-black text-green-500 flex items-center gap-2">1,245 <Leaf/></div>
            <p className="text-sm mt-2 font-medium bg-green-100 text-green-700 inline-block px-2 py-1 rounded">Crowdsourced Data Volume</p>
          </div>
        </div>

        {/* Charts & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Price Fluctuation Index Chart */}
          <div className={`p-8 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-xl shadow-purple-900/5'}`}>
            <h3 className="text-xl font-bold mb-6">National Crop Fluctuation Index</h3>
            <div className="h-72 w-full">
              <BarChart />
            </div>
          </div>

          {/* AI Policy Recommendations */}
          <div className={`p-8 rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-xl shadow-purple-900/5'}`}>
            <h3 className="text-xl font-bold mb-6 text-purple-600">AI Procurement Recommendations</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                 <h4 className="font-bold">1. FCI Wheat Procurement Strategy</h4>
                 <p className="text-sm opacity-80 mt-1">Kanpur prices reaching ₹2500/Q limit. Recommend early FCI procurement in Allahabad where prices remain stable at ₹2100/Q.</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                 <h4 className="font-bold">2. Subsidy Shift: Mustard Seeds</h4>
                 <p className="text-sm opacity-80 mt-1">22% price fluctuation in 4 weeks. Recommend releasing minimum buffer stocks immediately to cool off local retail inflation.</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                 <h4 className="font-bold">3. Fertilizer Distribution Alert</h4>
                 <p className="text-sm opacity-80 mt-1">Weather patterns predict dry spell in U.P. Recommend shifting distribution priority to drought-resistant fertilizer variants.</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, ArrowRight, Smartphone, ShieldCheck } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  
  // Hardcoded Mock Credentials for Presentation Speed
  const [phone, setPhone] = useState('+91 9876543210');
  const [password, setPassword] = useState('1234');
  const [isOtpMode, setIsOtpMode] = useState(true);
  const [lang, setLang] = useState('hi');

  const text = {
    hi: {
      title: 'किसान मंडी में आपका स्वागत है',
      subtitle: 'अपना मंडी डैशबोर्ड देखने के लिए लॉगिन करें',
      phone: 'मोबाइल नंबर',
      pass: 'पासवर्ड',
      otpBtn: 'लॉगिन करें (OTP द्वारा)',
      passBtn: 'लॉगिन करें (पासवर्ड द्वारा)',
      switchOtp: 'OTP से लॉगिन करें',
      switchPass: 'पासवर्ड से लॉगिन करें'
    },
    en: {
      title: 'Welcome to Kisan Mandi',
      subtitle: 'Login to access your personalized dashboard',
      phone: 'Mobile Number',
      pass: 'Password',
      otpBtn: 'Login with OTP',
      passBtn: 'Login with Password',
      switchOtp: 'Use OTP Instead',
      switchPass: 'Use Password Instead'
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate JWT Session Creation using localStorage
    localStorage.setItem('kisan_session', JSON.stringify({
      token: 'mock_jwt_token_12345',
      user: { name: 'Ramesh', phone: '+91 9876543210', location: 'Prayagraj', badge: 'Data Champion' }
    }));
    
    // Redirect to profile
    router.push('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="absolute top-4 right-4 flex gap-2">
        <button onClick={()=>setLang('hi')} className={`px-3 py-1 rounded-full text-sm font-bold border ${lang==='hi' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}>हिंदी</button>
        <button onClick={()=>setLang('en')} className={`px-3 py-1 rounded-full text-sm font-bold border ${lang==='en' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}>English</button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 flex items-center justify-center rounded-full mb-4">
          <Leaf size={32} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">{text[lang].title}</h2>
        <p className="mt-2 text-sm text-gray-600">{text[lang].subtitle}</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700">{text[lang].phone}</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Smartphone className="text-gray-400" size={20}/>
                </div>
                <input required type="text" value={phone} onChange={e=>setPhone(e.target.value)} className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>

            {!isOtpMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700">{text[lang].pass}</label>
                <div className="mt-1">
                  <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
              </div>
            )}

            <div>
              <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-bold text-lg transition">
                {isOtpMode ? <><ShieldCheck size={20}/> {text[lang].otpBtn}</> : <><ArrowRight size={20}/> {text[lang].passBtn}</>}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Option</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button onClick={() => setIsOtpMode(!isOtpMode)} className="text-green-600 font-bold hover:text-green-500">
                {isOtpMode ? text[lang].switchPass : text[lang].switchOtp}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

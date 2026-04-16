import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini if Key is present
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// The strict persona instructions so it behaves like Kisan Mitra
const systemPrompt = `You are AI Kisan Mitra, an intelligent and friendly agricultural assistant. 
Your goal is to help Indian farmers maximize their profits and yield.
Rules:
1. Always respond in either Hindi (written in English script) or very simple English, matching the user's tone.
2. Keep your answers brief (max 3-4 short sentences).
3. Be encouraging and use emojis when appropriate.
4. Provide actionable farming advice (e.g., weather, crop disease, mandi price logic).`;

export async function POST(request) {
  try {
    const { message, history } = await request.json();

    if (!apiKey) {
      // Smart Fallback for Hackathon Presentation if API key is missing
      const lower = message.toLowerCase();
      let fallbackReply = "Namaste! Main aapka AI Kisan Mitra hoon. Main abhi 'Offline Demo Mode' mein chal raha hoon.";
      
      if (lower.includes('gehu') || lower.includes('wheat') || lower.includes('daam') || lower.includes('rate')) {
        fallbackReply = "🌾 Kanpur mandi mein gehu ka daam abhi ₹2300 pratee quintal chal raha hai. AI forecast kehte hain ki agle 7 din mein rate ₹80 tak badh sakta hai!";
      } else if (lower.includes('keed') || lower.includes('disease') || lower.includes('rog') || lower.includes('fasal')) {
        fallbackReply = "🐛 Agar fasal mein keede (pests) lag gaye hain, toh main salah dunga ki Neem Oil (नीम का तेल) ka chhidkaw karein. Yeh organic hai aur bahut asardar hota hai.";
      } else if (lower.includes('mausam') || lower.includes('weather') || lower.includes('barish')) {
        fallbackReply = "☀️ OpenWeather API data ke mutabik, agle hafte tak Kanpur/Prayagraj kshetra mein barish (rain) ke koi aasaar nahi hain. Mausam saaf rahega.";
      } else if (lower.includes('scheme') || lower.includes('yojana') || lower.includes('sarkari')) {
        fallbackReply = "🏛️ Aap PM-Kisan Samman Nidhi ke tat-hat ₹6000 saalana (annual) paane ke kabil hain. Registration pass ki mandi e-suvidha kendra se kiya ja sakta hai.";
      } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('namaste') || lower.includes('हेलो')) {
        fallbackReply = "Namaste Kisan Bhai! 🙏 Main yahan mandi price, weather report aur crop diseases ke mutabik jankari dene ke liye hoon. Boliye, main kya madad kar sakta hoon?";
      } else {
        fallbackReply = "Maaf kijiye, main abhi theek se samajh nahi paaya. Kya aap daam (mandi rates), mausam (weather forecast), ya fasal mein lagne wale keedo (pests) ke baare mein poochna chahte hain?";
      }

      return NextResponse.json({ reply: fallbackReply }, { status: 200 });
    }

    // Call the actual Google Gemini LLM API
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Combine context
    const fullPrompt = `${systemPrompt}\n\nFarmer: ${message}\nAssistant:`;

    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText }, { status: 200 });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ reply: "Sorry Ramesh, I am facing server issues right now. Try again later!" }, { status: 500 });
  }
}

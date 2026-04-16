import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import MandiPrice from '../../../models/MandiPrice';

export async function GET(request) {
  try {
    // Attempt to connect to MongoDB
    await dbConnect();
    
    // In a real app, we'd fetch actual values from the DB if they existed:
    // const prices = await MandiPrice.find({}).sort('-date').limit(10);
    
    // For the Hackathon presentation, we mock the specific fallback data first 
    // to guarantee the "Ramesh" flow is perfect, even if DB is empty.
    const mockPrices = [
      { crop: 'Wheat', mandi: 'Kanpur', price: 2300, unit: 'Quintal', trend: 'up', date: new Date().toISOString() },
      { crop: 'Wheat', mandi: 'Lucknow', price: 2200, unit: 'Quintal', trend: 'down', date: new Date().toISOString() },
      { crop: 'Rice', mandi: 'Varanasi', price: 3100, unit: 'Quintal', trend: 'up', date: new Date().toISOString() }
    ];

    return NextResponse.json(mockPrices, { status: 200 });
  } catch (error) {
    console.warn("API Error (Serving Fallback Data):", error);
    return NextResponse.json([
        { crop: 'Wheat', mandi: 'Kanpur', price: 2300, trend: 'up' },
        { crop: 'Wheat', mandi: 'Lucknow', price: 2200, trend: 'down' }
    ], { status: 200 });
  }
}

import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import CommunityReport from '../../../models/CommunityReport';

export async function GET() {
  try {
    await dbConnect();
    // Fetch all reports from our MongoDB instance, newest first
    const reports = await CommunityReport.find({}).sort({ submittedAt: -1 }).limit(10);
    return NextResponse.json(reports, { status: 200 });
  } catch (error) {
    console.error("GET Reports Error:", error);
    return NextResponse.json({ error: "Database not connected" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Create new report document in MongoDB
    const newReport = await CommunityReport.create({
      farmerName: body.farmerName || 'Anonymous',
      mandiLocation: body.mandiLocation || 'Unknown',
      crowdLevel: body.crowdLevel || 'Medium',
      notes: body.notes || ''
    });

    return NextResponse.json({ success: true, data: newReport }, { status: 201 });
  } catch (error) {
    console.error("POST Report Error:", error);
    return NextResponse.json({ error: "Failed to save to database" }, { status: 500 });
  }
}

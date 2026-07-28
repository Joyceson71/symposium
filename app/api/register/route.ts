import { NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/sheets';
import { registerSchema } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const result = registerSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid data', details: result.error }, { status: 400 });
    }

    const { fullName, email, phone, college, department, year, eventId, paymentId } = result.data;

    // Map to sheet columns
    const sheetValues = [
      new Date().toISOString(), // Timestamp
      fullName,
      email,
      phone,
      college,
      department,
      `Year ${year}`,
      eventId,
      paymentId
    ];

    const sheetRes = await appendToSheet(sheetValues);

    if (!sheetRes.success) {
      throw new Error('Failed to save to Google Sheets');
    }

    return NextResponse.json({ success: true, message: 'Registration successful' });
  } catch (error: any) {
    console.error('Registration Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { db } from '../../../../lib/firebase';

interface EmailData {
  emails: string[];
  count: number;
}

async function getEmailData(): Promise<EmailData> {
  try {
    const doc = await db.collection('app-data').doc('emails').get();
    if (doc.exists) {
      return doc.data() as EmailData;
    } else {
      // If document doesn't exist, return default data
      return { emails: [], count: 2 };
    }
  } catch {
    // If there's an error, return default data
    return { emails: [], count: 2 };
  }
}

export async function GET() {
  try {
    const emailData = await getEmailData();
    return NextResponse.json({ count: emailData.count });
  } catch {
    console.error('Error reading count from Firestore');
    return NextResponse.json({ count: 2 });
  }
} 
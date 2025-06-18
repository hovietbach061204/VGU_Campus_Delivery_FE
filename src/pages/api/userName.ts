import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '../../lib/userProfile';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  const authHeader = req.headers.get('authorization');
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;
  if (!userId || !token) {
    return NextResponse.json({ name: null }, { status: 401 });
  }
  try {
    // Use the existing getUserProfile function
    const profile = await getUserProfile(userId, token);
    // Prefer username if available, otherwise fallback to first+last name
    const name =
      profile.username ||
      [profile.firstName, profile.lastName].filter(Boolean).join(' ');
    return NextResponse.json({ name });
  } catch {
    return NextResponse.json({ name: null }, { status: 500 });
  }
}

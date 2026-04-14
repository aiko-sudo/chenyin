export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAvailableDevices } from '@/lib/onenet';

export async function GET() {
  try {
    const devices = getAvailableDevices();
    return NextResponse.json({ devices });
  } catch (error: any) {
    console.error('[API] 获取设备列表失败:', error.message);
    return NextResponse.json({ devices: [] }, { status: 500 });
  }
}

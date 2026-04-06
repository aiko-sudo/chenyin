import { NextResponse } from 'next/server';
import { getLatestProperties } from '@/lib/onenet';

// 内存缓存（简单的 Map 实现）
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30000; // 30 秒

export async function GET() {
  try {
    const cacheKey = 'latest_device_data';
    const cached = cache.get(cacheKey);
    const now = Date.now();

    // 检查缓存是否有效
    if (cached && now - cached.timestamp < CACHE_TTL) {
      console.log('[API] 使用缓存数据');
      return NextResponse.json(cached.data);
    }

    // 获取最新数据
    const { data, online } = await getLatestProperties();

    if (!data) {
      return NextResponse.json(
        {
          error: '设备离线或无数据',
          online: false,
          data: null
        },
        { status: 200 } // 200 因为这是"正常"的离线状态
      );
    }

    // 更新缓存
    const cacheData = {
      ...(data as Record<string, unknown>),
      // 格式化输出
      survey: (data as Record<string, unknown>).survey_,
      confidence: (data as Record<string, unknown>).level_,
      status: (data as Record<string, unknown>).dust_,
      battery: (data as Record<string, unknown>).BatteryVoltage,
      online
    };

    cache.set(cacheKey, {
      data: cacheData,
      timestamp: now
    });

    console.log('[API] 返回最新数据:', cacheData);
    return NextResponse.json(cacheData);
  } catch (error: any) {
    console.error('[API] 获取最新数据错误:', error.message);
    return NextResponse.json(
      {
        error: '获取数据失败',
        message: error.message,
        online: false
      },
      { status: 500 }
    );
  }
}

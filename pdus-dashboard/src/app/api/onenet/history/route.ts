import { NextRequest, NextResponse } from 'next/server';
import { getPropertyHistory } from '@/lib/onenet';

// 内存缓存
interface CacheEntry {
  data: any[];
  timestamp: number;
  startTime: number;
  endTime: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 300000; // 5 分钟

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const identifier = searchParams.get('identifier') || 'survey_';
    const days = parseInt(searchParams.get('days') || '7');
    
    if (days < 1 || days > 365) {
      return NextResponse.json({ error: 'days 参数必须在 1-365 之间' }, { status: 400 });
    }

    const now = Date.now();
    const startTime = now - days * 24 * 60 * 60 * 1000;
    const endTime = now;

    // 生成缓存键
    const cacheKey = `${identifier}_${days}`;
    const cached = cache.get(cacheKey);

    // 检查缓存是否有效
    if (cached && now - cached.timestamp < CACHE_TTL) {
      console.log('[API] 使用缓存历史数据');
      return NextResponse.json({
        identifier,
        startTime: cached.startTime,
        endTime: cached.endTime,
        records: cached.data
      });
    }

    // 获取历史数据
    const records = await getPropertyHistory(identifier, startTime, endTime);

    // 按时间排序
    records.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    // 更新缓存
    cache.set(cacheKey, {
      data: records,
      timestamp: now,
      startTime,
      endTime
    });

    const result = {
      identifier,
      startTime,
      endTime,
      days,
      recordCount: records.length,
      records
    };

    console.log('[API] 返回历史数据:', result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API] 获取历史数据错误:', error.message);
    return NextResponse.json(
      {
        error: '获取历史数据失败',
        message: error.message,
        records: []
      },
      { status: 500 }
    );
  }
}

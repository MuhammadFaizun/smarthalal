import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [total, halal, syubhat, haram] = await Promise.all([
      prisma.ingredient.count(),
      prisma.ingredient.count({ where: { status: 'HALAL' } }),
      prisma.ingredient.count({ where: { status: 'SYUBHAT' } }),
      prisma.ingredient.count({ where: { status: 'HARAM' } }),
    ]);

    return NextResponse.json({
      success: true,
      data: { total, halal, syubhat, haram }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

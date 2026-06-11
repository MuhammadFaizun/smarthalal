import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { translateIngredients } from '@/lib/translator';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const lang = searchParams.get('lang') || 'id';

    let ingredients;
    if (q) {
      ingredients = await prisma.ingredient.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { eNumber: { contains: q, mode: 'insensitive' } }
          ]
        },
        include: { category: true }
      });
    } else {
      ingredients = await prisma.ingredient.findMany({
        include: { category: true }
      });
    }

    let data = ingredients;
    if (lang === 'en') {
      data = await translateIngredients(ingredients, 'id', 'en');
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Admin key check
    const key = request.headers.get('x-admin-key');
    const validKey = process.env.ADMIN_SECRET_KEY;

    if (!validKey) {
      return NextResponse.json(
        { success: false, message: 'Server misconfiguration: ADMIN_SECRET_KEY tidak diset.' },
        { status: 500 }
      );
    }

    if (!key || key !== validKey) {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak. API key tidak valid.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, eNumber, status, description, source, categoryId } = body;

    if (!name || !status) {
      return NextResponse.json(
        { success: false, message: 'Name dan status wajib diisi.' },
        { status: 400 }
      );
    }

    const newIngredient = await prisma.ingredient.create({
      data: {
        name,
        eNumber: eNumber || null,
        status,
        description: description || null,
        source: source || null,
        categoryId: categoryId || null
      }
    });

    return NextResponse.json({ success: true, data: newIngredient }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

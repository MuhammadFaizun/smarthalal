import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { translateIngredient } from '@/lib/translator';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'id';

    const ingredient = await prisma.ingredient.findUnique({
      where: { id },
      include: { category: true }
    });

    if (!ingredient) {
      return NextResponse.json({ success: false, message: 'Ingredient not found' }, { status: 404 });
    }

    let data = ingredient;
    if (lang === 'en') {
      data = await translateIngredient(ingredient, 'id', 'en');
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const ingredient = await prisma.ingredient.findUnique({
      where: { id }
    });

    if (!ingredient) {
      return NextResponse.json({ success: false, message: 'Ingredient not found' }, { status: 404 });
    }

    await prisma.ingredient.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Bahan berhasil dihapus.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

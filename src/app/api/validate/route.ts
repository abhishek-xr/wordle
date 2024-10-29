import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { word } = await request.json();

    const exists = await prisma.word.findUnique({
      where: { word: word.toLowerCase() }
    });

    return NextResponse.json({ valid: !!exists });
  } catch (error) {
    console.error('Error validating word:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const word = await prisma.word.findFirst({
      where: {
        OR: [
          { lastUsed: null },
          { lastUsed: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
        ]
      },
      orderBy: [
        { usedCount: 'asc' },
        { lastUsed: 'asc' }
      ]
    });

    if (!word) {
      // Reset all words if none are available
      await prisma.word.updateMany({
        data: { lastUsed: null }
      });
      return NextResponse.json({ error: 'No words available' }, { status: 500 });
    }

    await prisma.word.update({
      where: { id: word.id },
      data: {
        usedCount: { increment: 1 },
        lastUsed: new Date()
      }
    });

    return NextResponse.json({ word: word.word.toUpperCase() });
  } catch (error) {
    console.error('Error fetching word:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { userId, wordId, attempts, success, duration } = await request.json();

    const game = await prisma.game.create({
      data: {
        userId,
        wordId,
        attempts,
        success,
        duration
      }
    });

    // Update user stats
    await prisma.stats.upsert({
      where: { userId },
      update: {
        gamesPlayed: { increment: 1 },
        wins: { increment: success ? 1 : 0 },
        streak: success ? { increment: 1 } : 0,
        maxStreak: {
          increment: success ? 1 : 0
        },
        avgAttempts: {
          set: prisma.raw(`(avgAttempts * gamesPlayed + ${attempts}) / (gamesPlayed + 1)`)
        }
      },
      create: {
        userId,
        gamesPlayed: 1,
        wins: success ? 1 : 0,
        streak: success ? 1 : 0,
        maxStreak: success ? 1 : 0,
        avgAttempts: attempts
      }
    });

    return NextResponse.json({ success: true, game });
  } catch (error) {
    console.error('Error saving stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
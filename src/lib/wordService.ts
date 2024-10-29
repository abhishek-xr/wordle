// src/lib/wordService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getRandomWord() {
  try {
    // Get the last 10 used words to avoid repetition
    const recentWords = await prisma.word.findMany({
      where: {
        lastUsed: { not: null }
      },
      orderBy: {
        lastUsed: 'desc'
      },
      take: 10,
    });

    // Get first letters of recent words
    const recentFirstLetters = new Set(recentWords.map(w => w.word[0]));

    // Find words that haven't been used recently and don't start with recent letters
    const eligibleWords = await prisma.word.findMany({
      where: {
        AND: [
          {
            OR: [
              { lastUsed: null },
              { lastUsed: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
            ]
          },
          {
            word: {
              not: {
                startsWith: Array.from(recentFirstLetters)
              }
            }
          }
        ]
      },
      orderBy: [
        { usedCount: 'asc' },
        { lastUsed: 'asc' }
      ],
    });

    if (eligibleWords.length === 0) {
      // Fallback to any unused word if no eligible words found
      const anyUnusedWord = await prisma.word.findFirst({
        where: {
          OR: [
            { lastUsed: null },
            { lastUsed: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
          ]
        },
        orderBy: [
          { usedCount: 'asc' },
          { lastUsed: 'asc' }
        ],
      });

      if (!anyUnusedWord) {
        // Reset all words if none are available
        await prisma.word.updateMany({
          data: { lastUsed: null }
        });
        return getRandomWord();
      }

      return anyUnusedWord;
    }

    // Select a random word from eligible words
    const randomIndex = Math.floor(Math.random() * eligibleWords.length);
    const selectedWord = eligibleWords[randomIndex];

    // Update word usage
    await prisma.word.update({
      where: { id: selectedWord.id },
      data: {
        usedCount: { increment: 1 },
        lastUsed: new Date()
      }
    });

    return selectedWord;
  } catch (error) {
    console.error('Error selecting word:', error);
    throw error;
  }
}
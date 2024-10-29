# Wordle+

A  Wordle clone built with Next.js , featuring enhanced animations, dark mode, and statistics tracking.


## Tech Stack

- Next.js 14
- TypeScript
- Prisma + PostgreSQL
- TailwindCSS
- Canvas Confetti

## Getting Started

1. **Clone and Install**
```bash
git clone https://github.com/abhishek-xr/wordle
cd enhanced-wordle
npm install
```

2. **Set up Environment**
```bash
cp .env.example .env
# Update DATABASE_URL in .env
```

3. **Setup Database**
```bash
npx prisma generate
npx prisma db push
npm run seed
```

4. **Run Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## How to Play

- Guess the word in 6 tries
- Each guess must be a valid 5-letter word
- Color feedback after each guess:
  - 🟩 Correct letter, correct spot
  - 🟨 Correct letter, wrong spot
  - ⬜ Letter not in word

## Database Schema

```prisma
model Word {
  id        Int       @id @default(autoincrement())
  word      String    @unique
  usedCount Int       @default(0)
  lastUsed  DateTime?
}
```



---
Developed by [Abhishek ](https://github.com/abhishek-xr)

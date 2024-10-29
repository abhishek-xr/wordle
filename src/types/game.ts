export interface GameState {
    currentAttempt: string;
    attempts: AttemptType[];
    gameStatus: 'playing' | 'won' | 'lost';
    targetWord: string;
    keyboardState: { [key: string]: string };
  }
  
  export interface AttemptType {
    word: string;
    evaluation: ('correct' | 'present' | 'absent')[];
  }
  
  // src/lib/db.ts
  import { Pool } from 'pg';
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  export default pool;
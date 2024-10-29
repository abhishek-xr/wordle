"use client"

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, BarChart2, Info, Share2 } from 'lucide-react';

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

const defaultStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
  },
  lastPlayed: null,
  lastCompleted: null
};

const StatBox = ({ label, value }) => (
  <div className="flex flex-col items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
    <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
    <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
  </div>
);

const GuessDistribution = ({ distribution, maxValue }) => (
  <div className="w-full space-y-2">
    {Object.entries(distribution).map(([guess, count]) => (
      <div key={guess} className="flex items-center gap-2">
        <div className="w-4 text-sm text-gray-600 dark:text-gray-400">{guess}</div>
        <div className="flex-1 h-6">
          <div
            className="h-full bg-green-500 rounded-sm flex items-center px-2 min-w-[20px]"
            style={{
              width: `${(count / (maxValue || 1)) * 100}%`,
            }}
          >
            <span className="text-white text-sm">{count}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const GameTile = ({ letter, status, delay, isRevealing }) => (
  <div
    className={`
      w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold
      rounded-md transform transition-all duration-500
      ${isRevealing ? 'animate-flip' : ''}
      ${letter ? 'border-gray-400 dark:border-gray-500' : 'border-gray-300 dark:border-gray-600'}
      ${status === 'correct' ? 'bg-green-500 border-green-500 text-white' :
        status === 'present' ? 'bg-yellow-500 border-yellow-500 text-white' :
        status === 'absent' ? 'bg-gray-500 border-gray-500 text-white' :
        'bg-transparent dark:text-white'}
    `}
    style={{ 
      animationDelay: `${delay}ms`,
      perspective: '1000px'
    }}
  >
    {letter}
  </div>
);

const StatsModal = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  const maxDistribution = Math.max(...Object.values(stats.distribution));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Statistics</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {/* <X size={24} /> */}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatBox label="Played" value={stats.gamesPlayed} />
          <StatBox label="Win %" value={stats.winPercentage} />
          <StatBox label="Streak" value={stats.currentStreak} />
          <StatBox label="Max Streak" value={stats.maxStreak} />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Guess Distribution</h3>
          <GuessDistribution distribution={stats.distribution} maxValue={maxDistribution} />
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function GameBoard() {
  const [targetWord, setTargetWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [keyboardState, setKeyboardState] = useState({});
  const [stats, setStats] = useState(defaultStats);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    loadGameState();
    loadStats();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameStatus !== 'playing' || isRevealing) return;

      if (e.key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (e.key === 'Enter' && currentGuess.length === WORD_LENGTH) {
        submitGuess();
      } else if (/^[A-Za-z]$/.test(e.key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess(prev => (prev + e.key).toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameStatus, isRevealing]);

  const loadGameState = () => {
    const savedState = localStorage.getItem('wordleGameState');
    if (savedState) {
      const { targetWord, guesses, gameStatus, keyboardState } = JSON.parse(savedState);
      if (targetWord) {
        setTargetWord(targetWord);
        setGuesses(guesses);
        setGameStatus(gameStatus);
        setKeyboardState(keyboardState);
      } else {
        fetchNewWord();
      }
    } else {
      fetchNewWord();
    }
    setIsLoading(false);
  };

  const loadStats = () => {
    const savedStats = localStorage.getItem('wordleStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  };

  const fetchNewWord = async () => {
    try {
      const response = await fetch('/api/word');
      const data = await response.json();
      setTargetWord(data.word.toUpperCase());
    } catch (error) {
      console.error('Error fetching word:', error);
      showToastMessage('Error fetching word');
    }
  };

  const saveGameState = (newState) => {
    localStorage.setItem('wordleGameState', JSON.stringify({
      targetWord,
      guesses: newState.guesses || guesses,
      gameStatus: newState.gameStatus || gameStatus,
      keyboardState: newState.keyboardState || keyboardState,
    }));
  };

  const saveStats = (newStats) => {
    localStorage.setItem('wordleStats', JSON.stringify(newStats));
    setStats(newStats);
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const evaluateGuess = (guess, target) => {
    const evaluation = Array(WORD_LENGTH).fill('absent');
    const targetChars = target.split('');
    
    // First pass: mark correct letters
    guess.split('').forEach((letter, i) => {
      if (letter === targetChars[i]) {
        evaluation[i] = 'correct';
        targetChars[i] = null;
      }
    });
    
    // Second pass: mark present letters
    guess.split('').forEach((letter, i) => {
      if (evaluation[i] !== 'correct') {
        const targetIndex = targetChars.indexOf(letter);
        if (targetIndex !== -1) {
          evaluation[i] = 'present';
          targetChars[targetIndex] = null;
        }
      }
    });
    
    return evaluation;
  };

  const updateStats = (won, attempts) => {
    const newStats = { ...stats };
    newStats.gamesPlayed++;
    
    if (won) {
      newStats.gamesWon++;
      newStats.currentStreak++;
      newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak);
      newStats.distribution[attempts]++;
    } else {
      newStats.currentStreak = 0;
    }

    newStats.lastPlayed = new Date().toISOString();
    if (won) {
      newStats.lastCompleted = new Date().toISOString();
    }

    saveStats(newStats);
  };

  const submitGuess = async () => {
    if (currentGuess.length !== WORD_LENGTH || isRevealing) return;

    const evaluation = evaluateGuess(currentGuess, targetWord);
    const newGuesses = [...guesses, { word: currentGuess, evaluation }];
    
    setIsRevealing(true);
    setTimeout(() => setIsRevealing(false), WORD_LENGTH * 300 + 100);

    const newState = {
      guesses: newGuesses,
      keyboardState: updateKeyboardState(currentGuess, evaluation),
      gameStatus,
    };

    if (currentGuess === targetWord) {
      newState.gameStatus = 'won';
      updateStats(true, newGuesses.length);
      showToastMessage('Excellent! 🎉');
      setTimeout(() => setIsStatsOpen(true), 1800);
    } else if (newGuesses.length === MAX_ATTEMPTS) {
      newState.gameStatus = 'lost';
      updateStats(false, null);
      showToastMessage(`The word was ${targetWord}`);
      setTimeout(() => setIsStatsOpen(true), 1800);
    }

    setGuesses(newState.guesses);
    setKeyboardState(newState.keyboardState);
    setGameStatus(newState.gameStatus);
    setCurrentGuess('');
    saveGameState(newState);
  };

  const updateKeyboardState = (guess, evaluation) => {
    const newState = { ...keyboardState };
    guess.split('').forEach((letter, i) => {
      const newStatus = evaluation[i];
      if (!newState[letter] || newStatus === 'correct' || 
          (newStatus === 'present' && newState[letter] === 'absent')) {
        newState[letter] = newStatus;
      }
    });
    return newState;
  };

  const handleKeyPress = (key) => {
    if (gameStatus !== 'playing' || isRevealing) return;

    if (key === '⌫') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (key === 'ENTER') {
      if (currentGuess.length === WORD_LENGTH) {
        submitGuess();
      } else {
        showToastMessage('Not enough letters');
      }
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(prev => prev + key);
    }
  };

  const resetGame = () => {
    setCurrentGuess('');
    setGuesses([]);
    setGameStatus('playing');
    setKeyboardState({});
    fetchNewWord();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="w-full max-w-xl flex justify-between items-center p-4 border-b dark:border-gray-800">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-wider">
            WORDLE+
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsStatsOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="View statistics"
          >
            <BarChart2 className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? 
              <Sun className="h-6 w-6 text-gray-300" /> : 
              <Moon className="h-6 w-6 text-gray-600" />
            }
          </button>
        </div>
      </header>
      {/* Toast */}
      <div
        className={`
          fixed top-20 left-1/2 transform -translate-x-1/2
          bg-gray-900 dark:bg-white text-white dark:text-gray-900
          px-4 py-2 rounded-lg shadow-lg z-50
          transition-opacity duration-200
          ${showToast ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        {toastMessage}
      </div>

      {/* Game Container */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto p-4">
        {/* Game Board */}
        <div className="grid gap-2 mb-8">
          {[...Array(MAX_ATTEMPTS)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              {[...Array(WORD_LENGTH)].map((_, colIndex) => {
                const isCurrentRow = rowIndex === guesses.length;
                const letter = isCurrentRow
                  ? currentGuess[colIndex]
                  : guesses[rowIndex]?.word[colIndex] || '';
                
                const status = guesses[rowIndex]?.evaluation[colIndex] || '';
                const isRevealing = guesses.length === rowIndex + 1;

                return (
                  <GameTile
                    key={colIndex}
                    letter={letter}
                    status={status}
                    delay={colIndex * 300}
                    isRevealing={isRevealing && !showToast}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Keyboard */}
        <div className="w-full max-w-md grid gap-2 px-2">
          {KEYBOARD_ROWS.map((row, i) => (
            <div key={i} className="flex justify-center gap-1">
              {row.map(key => (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className={`
                    ${key.length > 1 ? 'px-4 text-xs' : 'px-3 text-sm'}
                    h-14 rounded-lg font-medium transition-all duration-200
                    ${keyboardState[key] === 'correct' ? 'bg-green-500 text-white hover:bg-green-600' :
                      keyboardState[key] === 'present' ? 'bg-yellow-500 text-white hover:bg-yellow-600' :
                      keyboardState[key] === 'absent' ? 'bg-gray-500 text-white hover:bg-gray-600' :
                      'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'}
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  disabled={gameStatus !== 'playing' || isRevealing}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
        </div>
      </main>

      {/* Game Over Modal */}
      {gameStatus !== 'playing' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6 shadow-lg animate-fadeIn">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
              {gameStatus === 'won' ? 'Congratulations! 🎉' : 'Game Over'}
            </h2>
            <p className="text-center mb-6 text-gray-700 dark:text-gray-300">
              The word was: <span className="font-bold">{targetWord}</span>
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsStatsOpen(true)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                View Stats
              </button>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Modal */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={{
          ...stats,
          winPercentage: stats.gamesPlayed > 0
            ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
            : 0
        }}
      />
    </div>
  );
}
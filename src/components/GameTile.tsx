import React from 'react';

export const GameTile = ({ letter, status, delay, isRevealing, isLastTile }) => (
  <div
    className={`
      w-20 h-20 border-2 flex items-center justify-center text-4xl font-bold
      transform transition-all duration-500
      ${isRevealing ? 'animate-flip' : ''}
      ${letter ? 'border-gray-400 dark:border-gray-500' : 'border-gray-300 dark:border-gray-600'}
      ${status === 'correct' ? 'bg-green-500 border-green-500 text-white' :
        status === 'present' ? 'bg-yellow-500 border-yellow-500 text-white' :
        status === 'absent' ? 'bg-gray-500 border-gray-500 text-white' :
        'bg-transparent dark:text-white'}
    `}
    style={{ 
      animationDelay: `${isLastTile ? delay + 200 : delay}ms`,
      perspective: '1000px'
    }}
  >
    {letter}
  </div>
);
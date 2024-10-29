// src/components/Keyboard.tsx
import React from 'react';

const KeyboardKey = ({ children, onClick, status, isWide }) => (
  <button
    onClick={onClick}
    className={`
      ${isWide ? 'px-6 text-sm' : 'px-4 text-lg'}
      h-16 rounded-xl font-bold transition-all duration-200
      shadow-lg active:shadow-md active:transform active:scale-95
      ${status === 'correct' ? 'bg-gradient-to-br from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700' :
        status === 'present' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700' :
        status === 'absent' ? 'bg-gradient-to-br from-gray-400 to-gray-600 text-white hover:from-gray-500 hover:to-gray-700' :
        'bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-600 dark:to-gray-800 text-gray-900 dark:text-white hover:from-gray-200 hover:to-gray-400 dark:hover:from-gray-500 dark:hover:to-gray-700'}
    `}
  >
    {children}
  </button>
);

export const Keyboard = ({ onKeyPress, keyboardState }) => (
  <div className="w-full max-w-3xl grid gap-2 px-4">
    {KEYBOARD_ROWS.map((row, i) => (
      <div key={i} className="flex justify-center gap-2">
        {row.map(key => (
          <KeyboardKey
            key={key}
            onClick={() => onKeyPress(key)}
            status={keyboardState[key]}
            isWide={key.length > 1}
          >
            {key}
          </KeyboardKey>
        ))}
      </div>
    ))}
  </div>
);
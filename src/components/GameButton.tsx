import React from 'react'

type GameButtonProps = {
  children: React.ReactNode;
  action: () => void;
};

const GameButton: React.FC<GameButtonProps> = ({ children, action }) => {
  return (
    <div>
      <button onClick={action} className="text-white bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-amber-300 dark:focus:ring-amber-800 shadow-lg shadow-amber-500/50 dark:shadow-lg dark:shadow-amber-800/80 font-medium rounded-lg text-xl px-5 py-2.5 text-center me-2 mb-5 animate-buttonheartbeat cursor-pointer">
        {children}
      </button>
    </div>
  )
}

export default GameButton;

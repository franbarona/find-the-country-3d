import confetti from "canvas-confetti";
import CountUp from "./CountUp";
import GameButton from "./GameButton";
import { useEffect, useState } from "react";
import Copyright from "./Copyright";

interface GameOverModalProps {
  score: number;
  onRestart: () => void;
}

export default function GameOverModal ({ score, onRestart }: GameOverModalProps) {

  const [showConfetti, setShowConfetti] = useState(false);


  // Configurar confetti
  useEffect(() => {
    setTimeout(() => {
      if (score > 0)
        setShowConfetti(true);
    }, 1500)
  }, [score]);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-20 text-white">
      {showConfetti &&

        <div className="absolute top-0 left-0 right-0 bottom-0 z-10">{
          confetti({
            particleCount: score,
            startVelocity: 50,
            spread: 360,
            origin: {
              x: Math.random(),
              y: Math.random() - 0.2
            }
          })
        }</div>
      }
      <div className="relative inline-flex items-center w-[90%] md:w-[450px] justify-center p-[1px] text-md font-medium text-center">
        <div className="relative transition-all ease-in duration-1000 p-10 flex flex-col gap-5 w-full overflow-hidden">
          <div className="relative w-full h-full overflow-hidden">
            <div className="relative mt-5 mb-20">
              <span className="text-xl">¡<strong> Time 's </strong>up !</span>
              <h1 className="text-4xl font-extrabold mt-5">SCORE</h1>
              <strong className="text-8xl">
                {
                  document.visibilityState === "visible" ?
                    <CountUp
                      from={0}
                      to={score}
                      separator=","
                      direction='up'
                      duration={3}
                      className="count-up-text"
                    />
                    :
                    score
                }
              </strong>
              <span className="text-xl block mt-15">
                {
                  score < 50 ? 'Keep trying, you can do better!' : score > 50 && score < 150 ? 'Well done!' : 'What a score! Congratulations'
                }
              </span>
            </div>
          </div>
          <div className="absolute bottom-[.5rem] left-[50%] translate-x-[-50%]">
            <GameButton action={onRestart}>¡ RETRY !</GameButton>
          </div>
        </div>
      </div>
      <Copyright />
    </div>
  );
}
import CountUp from './CountUp'

interface GameHeaderProps {
  timeLeft: number;
  targetCountry: string | null;
  score: number;
  prevScore: number;
}

export default function GameHeader ({ timeLeft, targetCountry, score, prevScore }: GameHeaderProps) {
  return (
    <div className="absolute top-20 left-[50%] translate-x-[-50%] rounded-md flex gap-5 justify-center bg-[rgba(0,0,0,0.6)] z-1 text-white border-2 border-amber-400 px-8 pt-3 pb-2">
      <div className="text-center leading-3 m-auto">
        <span className="font-light block">Time</span>
        <strong className="text-2xl">{timeLeft}</strong>
      </div>
      <div className="text-center leading-3 m-auto border-l-2 border-r-2 px-6 md:w-[300px] w-[165px]">
        <span className="font-light block">Find</span>
        <strong className={targetCountry && targetCountry?.length > 17 ? "md:text-xl" : "md:text-3xl text-lg"}>{targetCountry ?? '...'}</strong>
      </div>
      <div className="text-center leading-3 m-auto">
        <span className="font-light block">Score</span>
        <strong className="text-2xl">
          <CountUp
            from={prevScore | 0}
            to={score}
            separator=","
            direction={prevScore > score ? 'down' : 'up'}
            duration={1}
            className="count-up-text"
          />
        </strong>
      </div>
    </div>
  );
}
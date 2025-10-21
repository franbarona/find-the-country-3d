import BorderBlock from "./ui/BorderBlock";
import CountUp from "./animate-ui/CountUp";

interface ScoreProps {  
  prevScore: number;
  score: number;
}

const Score = ({ score, prevScore = 0 }: ScoreProps) => {
  return (
    <BorderBlock title="Score">
      <div className="m-auto flex justify-center items-center text-xl text-white">
        <CountUp
          from={prevScore}
          to={score}
          separator=","
          direction={prevScore > score ? "down" : "up"}
          duration={1}
          className="count-up-text"
        />
      </div>
    </BorderBlock>
  );
};

export default Score;

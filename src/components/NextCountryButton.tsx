import { useState } from "react";
import CompassIcon from "./animate-ui/Compass";

interface NextCountryButtonProps {
  action: () => void;
  timeLeftToNext: number;
  disabled?: boolean;
}

const NextCountryButton = ({ action, timeLeftToNext, disabled }: NextCountryButtonProps) => {
  const [animate, setAnimate] = useState<"once" | undefined>(undefined);

  const handleClick = () => {
    setAnimate("once");
    setTimeout(() => {
      setAnimate(undefined);
    }, 5000);
    action();
  }

  return (
    <div className="relative border-2 border-amber-400 rounded-lg flex items-center justify-center p-2">
      {
        timeLeftToNext > 0 && (
          <span className="absolute w-full h-full text-sm text-white font-light select-none z-10 text-end pr-2 pt-1">
           {timeLeftToNext}
          </span>
        )
      }
      <button onClick={() => handleClick()} className={`cursor-pointer ${disabled ? "opacity-10" : "opacity-100"}`} disabled={disabled}>
        <CompassIcon size="small" animate={animate} />
      </button>
    </div>
  );
};

export default NextCountryButton;

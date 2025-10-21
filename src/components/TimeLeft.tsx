import BorderBlock from "./ui/BorderBlock";

interface TimeLeftProps {
  time: number;
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const remainingSeconds = time % 60;
  return `${minutes} : ${remainingSeconds.toString().padStart(2, "0")}`;
};

const TimeLeft = ({ time }: TimeLeftProps) => {
  return (
    <BorderBlock title="Time">
      <strong className="text-xl text-white text-center">{formatTime(time)}</strong>
    </BorderBlock>
  );
};

export default TimeLeft;

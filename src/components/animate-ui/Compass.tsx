
const SudTriangle = () => {
  return (
    <div className="w-[22%] h-[50%] relative left-[50%] translate-x-[-50%] bottom-[10%] -translate-y-[-10%]">
      {/* Triángulo dividido */}
      <div
        className="w-full h-full"
        style={{
          background:
            "linear-gradient(to right, oklch(55.1% 0.027 264.364) 50%, oklch(37.3% 0.034 259.733) 50%)",
          clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)",
        }}
      ></div>
    </div>
  );
};

const NorthTriangle = () => {
  return (
    <div className="w-[22%] h-[50%] relative left-[50%] translate-x-[-50%] top-[10%] translate-y-[-10%]">
      {/* Triángulo dividido */}
      <div
        className="w-full h-full"
        style={{
          background:
            "linear-gradient(to right, oklch(63.7% 0.237 25.331) 50%, oklch(50.5% 0.213 27.518) 50%)",
          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
        }}
      ></div>
    </div>
  );
};

const CompassIcon = ({size, animate}: {size: "big" | "small", animate?: "once" | "infinity"}) => {
  let animationClass = "";
  if (animate === "infinity") {
    animationClass = "animate-rotational-wave";
  } else if (animate === "once") {
    animationClass = "animate-rotational-wave-once";
  }

  return (
    <div className={`relative ${size === "big" ? "w-20 h-20" : "w-10 h-10"} bg-white rounded-full border-white drop-shadow-xl drop-shadow-black`}>
      <div className="absolute inset-0 flex items-center justify-center"></div>
      {/* Center (White) part */}
      <div className={`absolute ${size === "big" ? "w-5 h-5" : "w-2 h-2"} bg-black/95 border-2 border-gray-700 rounded-full top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] transform`} />
      <div className={`relative w-full h-full rotate-45 ${animationClass}`}>
        <NorthTriangle />
        <SudTriangle />
      </div>
    </div>
  );
};

export default CompassIcon;
import React from "react";

type GameButtonProps = {
  children: React.ReactNode;
  action: () => void;
  style?: "primary" | "secondary";
  disabled?: boolean;
};

export const ActionButton: React.FC<GameButtonProps> = ({
  children,
  action,
  disabled,
}) => {
  return (
    <button
      onClick={action}
      disabled={disabled}
      className={
        "group/button rounded-sm bg-black text-black transform -skew-x-12 cursor-pointer disabled:opacity-70"
      }
    >
      <span
        className={
          "block -translate-x-1 -translate-y-1 rounded-sm border-2 border-black bg-amber-300 px-3 py-1.5 font-medium tracking-tight transition-all group-hover/button:-translate-y-2 group-active/button:translate-x-0 group-active/button:translate-y-0 w-20"
        }
      >
        {children}
      </span>
    </button>
  );
};

const NavButton: React.FC<GameButtonProps> = ({
  children,
  action,
  style = "primary",
}) => {
  return (
    <button
      onClick={action}
      className={
        "group/button rounded-sm bg-black text-black transform -skew-x-12 cursor-pointer border-2 "
      }
    >
      <span
        className={`text-2xl xl:text-3xl block -translate-x-1 -translate-y-1 rounded-sm border-2 border-black px-6 py-2 font-medium tracking-tight transition-all group-hover/button:-translate-y-2 group-active/button:translate-x-0 group-active/button:translate-y-0 ${
          style === "primary" ? "bg-amber-300" : "bg-white"
        }`}
      >
        {children}
      </span>
    </button>
  );
};

export default NavButton;

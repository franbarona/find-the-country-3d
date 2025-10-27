import CompassIcon from "./animate-ui/Compass";
import NavButton from "./Buttons";
import Copyright from "./Copyright";

interface StartGameModalProps {
  readonly onStart: () => void;
}

export default function StartGameModal({ onStart }: StartGameModalProps) {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.1)] flex items-center justify-center z-10 text-white font-light">
      <div className="relative inline-flex items-center w-full justify-center p-[1px] text-md  text-center">
        <div className="relative transition-all ease-in duration-1000 p-10 flex flex-col gap-5 w-full overflow-hidden">
          <div className="relative mt-16 mb-40">
            <strong className="flex items-center justify-center transform -skew-x-6">
              <span className=" text-5xl xl:text-5xl drop-shadow-2xl drop-shadow-black">
                The
              </span>
            </strong>
            <strong className="flex items-center justify-center transform -skew-x-6">
              <span className=" text-5xl xl:text-7xl drop-shadow-2xl drop-shadow-black flex items-baseline">
                Gl
              </span>
              <span className="z-30">
                {/* COMPASS */}
                <CompassIcon size="big" animate="infinity" />
              </span>
              {/*  */}
              <span className=" text-5xl xl:text-7xl drop-shadow-2xl drop-shadow-black flex items-baseline">
                be
              </span>
            </strong>
            <strong className="flex items-center justify-center transform -skew-x-6">
              <span className=" text-5xl xl:text-7xl drop-shadow-2xl drop-shadow-black">
                Challenge
              </span>
            </strong>
          </div>

          <div className="absolute bottom-[.5rem] left-[50%] translate-x-[-50%] w-fit flex flex-col gap-5">
            <NavButton action={onStart}>NEW GAME</NavButton>
            <NavButton action={onStart} style="secondary">
              SETTINGS
            </NavButton>
          </div>
        </div>
      </div>
      <Copyright />
    </div>
  );
}

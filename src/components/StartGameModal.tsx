import Copyright from "./Copyright";
import GameButton from "./GameButton";

interface StartGameModalProps {
  onStart: () => void;
}

export default function StartGameModal ({ onStart }: StartGameModalProps) {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-10 text-white">
      <div className="relative inline-flex items-center w-[90%] md:w-[450px] justify-center p-[1px] text-md font-medium text-center">
        <div className="relative transition-all ease-in duration-1000 p-10 flex flex-col gap-5 w-full overflow-hidden">
          <div className="relative w-full h-full">
            <div className="relative mt-16 mb-40">
              <div className="flex gap-5 items-baseline">
                <div className="flex w-fit ml-15 text-6xl mb-[-.2rem] items-center justify-center drop-shadow-gray-950 drop-shadow-2xl ">
                  <strong>F</strong>
                  <img src="./pin.svg" alt="pin" className="z-10 mx-[-.5rem]" width={50} />
                  <strong>n</strong>
                  <strong>d</strong>
                </div>
                <span className="text-2xl">the</span>

              </div>
              <strong className=" block text-7xl mr-5 drop-shadow-gray-700 drop-shadow-[0_2.5px_2.5px_rgba(0,0,0,0.8)]">Country</strong>
            </div>
          </div>

          <div className="absolute bottom-[.5rem] left-[50%] translate-x-[-50%]">
            <GameButton action={onStart}>¡ PLAY !</GameButton>
          </div>
        </div>
      </div>
      <Copyright />
    </div>
  );
}

interface BorderBlockProps {
  title: string;
  children: React.ReactNode;
}

const BorderBlock = ({ title, children }: BorderBlockProps) => {
  return (
    <div className="relative border-2 border-amber-400 rounded-lg p-6 flex items-center justify-center bg-[rgba(0,0,0,0.5)] w-full">
      <span className="absolute -top-4 left-[50%] translate-x-[-50%] px-6 text-normal font-medium text-white border-2 border-amber-400 rounded-md bg-[rgba(0,0,0,0.8)] overflow-hidden">
        <span
          className="absolute inset-0 -z-10"
          style={{
            background: "inherit",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(5px)",
          }}
        ></span>
        {title}
      </span>
      {children}
    </div>
  );
};

export default BorderBlock;
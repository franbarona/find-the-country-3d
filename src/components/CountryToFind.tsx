import BorderBlock from "./ui/BorderBlock";

interface CountryToFindProps {
  country: string | null;
}

const CountryToFind = ({ country }: CountryToFindProps) => {
  return (
    <BorderBlock title="Find">
      <strong
        className={`text-white w-full text-center text-2xl`}
      >
        {country ?? "..."}
      </strong>
    </BorderBlock>
  );
};

export default CountryToFind;

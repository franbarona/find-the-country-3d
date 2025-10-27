import { useEffect, useState, useCallback, useRef } from "react";
import { type CountryFeature, type HighlightMap } from "./types";
import GameOverModal from "./GameOverModal";
import GlobeView from "./GlobeView";
import StartGameModal from "./StartGameModal";
import { GAME_TIME, TIME_TO_UNLOCK_NEXT } from "../constants/constants";
import TimeLeft from "./TimeLeft";
import CountryToFind from "./CountryToFind";
import Score from "./Score";
import NextCountryButton from "./NextCountryButton";

export default function Game() {
  const [isStarted, setIsStarted] = useState(false);
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [targetCountry, setTargetCountry] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<HighlightMap>({});
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [timeLeftToNext, setTimeLeftToNext] = useState(TIME_TO_UNLOCK_NEXT);
  const [score, setScore] = useState(0);
  const prevScore = useRef(0);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [streak, setStreak] = useState(0);

  const pickRandomCountry = useCallback((list: CountryFeature[]): string => {
    const availableCountries = list.filter(
      (country) =>
        !Object.keys(highlights).includes(country.properties.name)
    );

    if (availableCountries.length === 0) {
      setGameOver(true);
    }

    const randomIndex = Math.floor(Math.random() * availableCountries.length);
    return availableCountries[randomIndex].properties.name;
  }, []);

  // Cargar países solo una vez
  useEffect(() => {
    let isMounted = true;

    fetch(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    )
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setCountries(data.features);
          setTargetCountry("Spain");
        }
      })
      .catch((err) => console.error("Error cargando países:", err));

    return () => {
      isMounted = false;
    };
  }, [pickRandomCountry]);

  // Resetear ronda con useCallback optimizado
  const resetRound = useCallback(() => {
    if (countries.length === 0) return;

    setTargetCountry(pickRandomCountry(countries));
  }, [countries, pickRandomCountry]);

  useEffect(() => {
    if (!isStarted) return;
    const intervalo = setInterval(() => {
      setTimeLeftToNext((prev) => prev - 1); // Usa función para acceder al valor actual
    }, 1000); // Se ejecuta cada segundo

    // Cleanup: limpia el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalo);
  }, [isStarted]);

  // Timer optimizado con ref para limpiar correctamente
  useEffect(() => {
    if (gameOver || !isStarted) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameOver, isStarted]);

  const getOnlyCorrectCountries = () => {
    return Object.fromEntries(
      Object.entries(highlights).filter(
        ([key, value]) => key && value === "correct"
      )
    );
  };

  // Actualizar score anterior
  useEffect(() => {
    prevScore.current = score;
  }, [score]);

  // Manejar click en país con useCallback
  const handleCountryClick = useCallback(
    (country: object) => {
      const name = (country as CountryFeature).properties.name;
      if (!targetCountry || gameOver || !isStarted) return;

      if (name === targetCountry) {
        const newHighlights = getOnlyCorrectCountries();
        // Acierto
        setHighlights({ ...newHighlights, [name]: "correct" });

        // Batch updates
        setTimeLeft((prev) => prev);
        const points = 20 * (streak + 1);
        setScore((prev) => prev + points);

        // Incrementar racha DESPUÉS de actualizar highlights
        const newStreak = streak < 5 ? streak + 1 : streak;
        setStreak(newStreak); // Incrementar en 1
        resetRound();
      } else {
        // Error - resetear racha
        setStreak(0);
        setHighlights((prev) => ({
          ...prev,
          [name]: "incorrect",
        }));
        setScore((prev) => (prev - 1 >= 0 ? prev - 1 : 0));
      }
    },
    [targetCountry, gameOver, isStarted, streak]
  );

  // Reiniciar juego optimizado
  const restartGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setHighlights({});
    setScore(0);
    setStreak(0);
    setTimeLeft(GAME_TIME);
    setGameOver(false);
    setTargetCountry(
      countries.length > 0 ? pickRandomCountry(countries) : null
    );
    setIsStarted(false);
  }, [countries, pickRandomCountry]);

  // Iniciar juego
  const handleStart = useCallback(() => {
    setIsStarted(true);
  }, []);

  const handleNext = () => {
    const newHighlights = getOnlyCorrectCountries();
    setHighlights({ ...newHighlights });
    resetRound();
    setTimeLeftToNext(TIME_TO_UNLOCK_NEXT);
  };

  return (
    <div className="w-screen h-screen overflow-hidden">
      {!isStarted && <StartGameModal onStart={handleStart} />}
      {isStarted && (
        <>
          <div className="absolute top-10 left-10 z-10 w-32">
            <TimeLeft time={timeLeft} />
          </div>
          <div className="absolute top-10 left-[52%] translate-x-[-50%] z-10 w-150">
            <div className="flex gap-2">
              <div className="w-full">
                <CountryToFind country={targetCountry} />
              </div>
              <div
                className={`w-fit pt-2 ${
                  timeLeftToNext > 0 ? "opacity-50" : "opacity-100"
                } cursor-pointer`}
              >
                <NextCountryButton
                  action={handleNext}
                  timeLeftToNext={timeLeftToNext}
                  disabled={timeLeftToNext > 0}
                />
              </div>
            </div>
          </div>
          <div className="absolute top-10 right-10 z-10 w-32">
            <Score score={score} prevScore={prevScore.current} />
          </div>
        </>
      )}
      <GlobeView
        countries={countries}
        highlights={highlights}
        onCountryClick={handleCountryClick}
        isStarted={isStarted}
        gameOver={gameOver}
        streak={streak}
      />
      {gameOver && <GameOverModal score={score} onRestart={restartGame} />}
    </div>
  );
}

import { useEffect, useState, useCallback, useRef } from 'react';
import type { CountryFeature, HighlightMap } from './types';
import GameHeader from './GameHeader';
import GameOverModal from './GameOverModal';
import GlobeView from './GlobeView';
import StartGameModal from './StartGameModal';

export default function Game () {
  const [isStarted, setIsStarted] = useState(false);
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [targetCountry, setTargetCountry] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<HighlightMap>({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const prevScore = useRef(0); // Aquí se guarda el valor anterior
  const [gameOver, setGameOver] = useState(false);

  // Cargar países
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(res => res.json())
      .then((data) => {
        setCountries(data.features);
        setTargetCountry(pickRandomCountry(data.features));
      });
  }, []);

  const pickRandomCountry = (list: CountryFeature[]): string => {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex].properties.name;
  };

  const resetRound = useCallback(() => {
    setHighlights({});
    const newTarget = pickRandomCountry(countries);
    setTargetCountry(newTarget);
  }, [countries]);

  // ⏱ Cuenta atrás
  useEffect(() => {
    if (gameOver || !isStarted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver, isStarted]);

  useEffect(() => {
    // Cada vez que 'numero' cambie, actualizamos el valor anterior
    prevScore.current = score;
  }, [score]);

  const handleCountryClick = (country: object) => {
    const name = (country as CountryFeature).properties.name;
    if (!targetCountry || gameOver || !isStarted) return;

    if (name === targetCountry) {
      setHighlights((prev) => ({
        ...prev,
        [name]: 'correct'
      }));
      setScore((prev) => prev + 20);

      setTimeout(() => {
        resetRound();
      }, 500);
    } else {
      setHighlights((prev) => ({
        ...prev,
        [name]: 'incorrect'
      }));
      if (score > 0) {
        setScore((prev) => prev - 1);
      }
    }
  };

  const restartGame = () => {
    setHighlights({});
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setTargetCountry(pickRandomCountry(countries));
    setIsStarted(false); // vuelve al modal inicial
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {!isStarted && <StartGameModal onStart={() => setIsStarted(true)} />}
      {isStarted && <GameHeader timeLeft={timeLeft} targetCountry={targetCountry} score={score} prevScore={prevScore.current} />}
      <GlobeView countries={countries} highlights={highlights} onCountryClick={handleCountryClick} isStarted={isStarted} gameOver={gameOver} />
      {gameOver && <GameOverModal score={score} onRestart={restartGame} />}
    </div>
  );
}
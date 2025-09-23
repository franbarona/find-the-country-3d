import Globe, { type GlobeMethods } from 'react-globe.gl';
import type { CountryFeature, HighlightMap } from './types';
import { useEffect, useRef } from 'react';

interface GlobeViewProps {
  countries: CountryFeature[];
  highlights: HighlightMap;
  onCountryClick: (polygon: object, event: MouseEvent, coords: { lat: number, lng: number, altitude: number }) => void;
  isStarted: boolean;
  gameOver: boolean;
}

export default function GlobeView ({ countries, highlights, onCountryClick, isStarted, gameOver }: GlobeViewProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  // Configurar límites de zoom según ancho de pantalla
  useEffect(() => {
    if (!globeRef.current) return;

    const controls = globeRef.current.controls();
    controls.minDistance = 150;
    controls.maxDistance = 350;

    if (window.innerWidth <= 700) {
      controls.maxDistance = 600; //Permitimos un zoom más distante para móviles
    }

    // Activar o desactivar rotación automática
    controls.autoRotate = !isStarted || gameOver;
    controls.autoRotateSpeed = 0.5;

    controls.update();
    if (isStarted) {
      globeRef.current.pointOfView(
        { lat: 20, lng: 0, altitude: 1.8 }, // Ajusta la altitud según lo que quieras mostrar
        2000 // Duración en ms
      );
    }

    if (gameOver) {
      globeRef.current.pointOfView(
        { lat: 0, lng: 0, altitude: 8 }, // Ajusta la altitud según lo que quieras mostrar
        2000 // Duración en ms
      );
    }
  }, [isStarted, gameOver]);

  const getColorForCountry = (country: object): string => {
    const name = (country as CountryFeature).properties.name;
    const status = highlights[name];
    if (status === 'correct') return '#50DD8E80';
    if (status === 'incorrect') return '#FF747480';
    return 'rgba(100, 200, 255, 0.4)';
  };

  return (
    <Globe
      ref={globeRef}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      polygonsData={countries}
      polygonAltitude={0.01}
      polygonCapColor={getColorForCountry}
      polygonSideColor={() => 'rgba(0, 100, 255, 0.1)'}
      polygonStrokeColor={() => '#111'}
      onPolygonClick={onCountryClick}
    />
  );
}
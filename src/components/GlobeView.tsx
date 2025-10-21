import Globe, { type GlobeMethods } from 'react-globe.gl';
import type { CountryFeature, HighlightMap } from './types';
import { useEffect, useRef, useCallback, useMemo, useState } from 'react';

interface PointsAnimation {
  id: number;
  x: number;
  y: number;
  points: number;
  streak: number;
}

interface GlobeViewProps {
  countries: CountryFeature[];
  highlights: HighlightMap;
  onCountryClick: (polygon: object, event: MouseEvent, coords: { lat: number, lng: number, altitude: number }) => void;
  isStarted: boolean;
  gameOver: boolean;
  streak: number;
}

export default function GlobeView({ countries, highlights, onCountryClick, isStarted, gameOver, streak }: GlobeViewProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const configuredRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const isMobileRef = useRef(window.innerWidth <= 700);
  const [pointsAnimations, setPointsAnimations] = useState<PointsAnimation[]>([]);
  const animationIdRef = useRef(0);
  const prevHighlightsRef = useRef<HighlightMap>({});
  const lastClickPosRef = useRef<{ x: number; y: number } | null>(null);

  // Colores constantes
  const COLORS = useMemo(() => ({
    correct: '#50DD8E80',
    incorrect: '#FF747480',
    default: 'rgba(100, 200, 255, 0.4)',
    side: 'rgba(0, 100, 255, 0.1)',
    stroke: '#111'
  }), []);

  // Función de color optimizada (sin Map intermedio)
  const getColorForCountry = useCallback((country: object): string => {
    const name = (country as CountryFeature).properties.name;
    const status = highlights[name];
    
    if (status === 'correct') return COLORS.correct;
    if (status === 'incorrect') return COLORS.incorrect;
    return COLORS.default;
  }, [highlights, COLORS]);

  // Funciones estáticas memoizadas
  const polygonSideColor = useCallback(() => COLORS.side, [COLORS.side]);
  const polygonStrokeColor = useCallback(() => COLORS.stroke, [COLORS.stroke]);

  // Wrapper para capturar posición del click
  const handlePolygonClick = useCallback((polygon: object, event: MouseEvent, coords: { lat: number, lng: number, altitude: number }) => {
    // Guardar posición del click
    lastClickPosRef.current = { x: event.clientX, y: event.clientY };
    
    // Llamar al handler original
    onCountryClick(polygon, event, coords);
  }, [onCountryClick]);

  // Detectar aciertos y mostrar animación de puntos
  useEffect(() => {
    const newCorrect = Object.keys(highlights).find(
      country => highlights[country] === 'correct' && prevHighlightsRef.current[country] !== 'correct'
    );

    if (newCorrect && lastClickPosRef.current) {
      const { x, y } = lastClickPosRef.current;

      // Usar el streak actual (ya incrementado)
      const newAnimation: PointsAnimation = {
        id: animationIdRef.current++,
        x,
        y,
        points: 20,
        streak: streak // Este es el streak actual después del incremento
      };

      setPointsAnimations(prev => [...prev, newAnimation]);

      // Eliminar animación después de 1000ms
      setTimeout(() => {
        setPointsAnimations(prev => prev.filter(anim => anim.id !== newAnimation.id));
      }, 1000);
    }

    prevHighlightsRef.current = highlights;
  }, [highlights, streak]);

  // Configuración inicial optimizada
  useEffect(() => {
    if (!globeRef.current || configuredRef.current) return;

    const controls = globeRef.current.controls();
    const isMobile = isMobileRef.current;
    
    // Configuración de controles optimizada
    controls.minDistance = 150;
    controls.maxDistance = isMobile ? 600 : 350;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotateSpeed = 0.5;
    controls.rotateSpeed = 0.5;
    
    // Deshabilitar zoom con scroll en móvil para mejor UX
    if (isMobile) {
      controls.enableZoom = true;
      controls.zoomSpeed = 0.5;
    }
    
    configuredRef.current = true;
  }, []);

  // Manejar estado del juego con transiciones suaves
  useEffect(() => {
    if (!globeRef.current) return;

    const controls = globeRef.current.controls();
    const shouldRotate = !isStarted || gameOver;
    
    // Cancelar animación previa
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Aplicar auto-rotación
    controls.autoRotate = shouldRotate;

    // Transiciones de cámara optimizadas
    if (isStarted && !gameOver) {
      globeRef.current.pointOfView(
        { lat: 20, lng: 10, altitude: 1.8 },
        1500 // Reducido de 2000ms para más fluidez
      );
    } else if (gameOver) {
      globeRef.current.pointOfView(
        { lat: 0, lng: 0, altitude: 8 },
        1500
      );
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isStarted, gameOver]);

  // Manejar resize con debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!globeRef.current) return;
        
        const isMobile = window.innerWidth <= 700;
        isMobileRef.current = isMobile;
        
        const controls = globeRef.current.controls();
        controls.maxDistance = isMobile ? 600 : 350;
      }, 150); // Debounce de 150ms
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Renderer config optimizado
  const rendererConfig = useMemo(() => ({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance' as const,
    precision: 'highp' as const,
    stencil: false, // Desactivar stencil buffer si no se usa
    depth: true,
    logarithmicDepthBuffer: false // Mejor rendimiento
  }), []);

  const getStreakColor = (streak: number) => {
    switch (streak) {
      case 2:
        return 'text-yellow-200'
        case 3:
        return 'text-yellow-300'
        case 4:
        return 'text-yellow-400'
        case 5:
        return 'text-yellow-500'
      default:
        break;
    }

  }

  return (
    <div className="relative w-full h-full">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        polygonsData={countries}
        polygonAltitude={0.01}
        polygonCapColor={getColorForCountry}
        polygonSideColor={polygonSideColor}
        polygonStrokeColor={polygonStrokeColor}
        onPolygonClick={handlePolygonClick}
        animateIn={false}
        waitForGlobeReady={true}
        rendererConfig={rendererConfig}
      />
      
      {/* Animaciones de puntos */}
      {pointsAnimations.map(anim => (
        <div
          key={anim.id}
          className="absolute pointer-events-none text-4xl font-bold text-green-400"
          style={{
            left: `${anim.x}px`,
            top: `${anim.y}px`,
            transform: 'translate(-50%, -50%)',
            textShadow: '0 0 10px rgba(80, 221, 142, 0.8), 0 0 20px rgba(80, 221, 142, 0.4)',
            animation: 'float 1s ease-out forwards'
          }}
        >
          +{anim.points}
          {anim.streak > 1 && (
            <span className={`ml-2 ${getStreakColor(streak)}`} style={{ textShadow: '0 0 10px rgba(250, 204, 21, 0.8)' }}>
              x{anim.streak}
            </span>
          )}
        </div>
      ))}
      
      <style>{`
        @keyframes float {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -60px) scale(1.3);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -120px) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
export interface CountryFeature {
  type: 'Feature';
  properties: {
    name: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: any;
  };
}

export type HighlightMap = Record<string, 'correct' | 'incorrect'>;
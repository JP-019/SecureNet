import type { MapPointInput, MapPoint } from '../types';

export const isValidLatLng = (lat: number, lng: number): boolean => {
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

export const parseMapPoint = (value: string): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const normalizeMapPoint = (input: MapPointInput): MapPoint | null => {
  const lat = parseMapPoint(input.lat);
  const lng = parseMapPoint(input.lng);

  if (!input.nombre.trim() || lat === null || lng === null) return null;
  if (!isValidLatLng(lat, lng)) return null;

  return {
    id: `map-${Date.now()}`,
    nombre: input.nombre.trim(),
    lat,
    lng,
    tipo: input.tipo ?? 'Punto',
  };
};

import { useCallback, useState } from 'react';
import type { MapPoint } from '../types';

const useMapPoints = (initialPoints: MapPoint[] = []) => {
  const [mapPoints, setMapPoints] = useState<MapPoint[]>(initialPoints);

  const addMapPoint = useCallback((point: MapPoint) => {
    setMapPoints(prev => [...prev, point]);
  }, []);

  const removeMapPoint = useCallback((pointId: string) => {
    setMapPoints(prev => prev.filter(point => point.id !== pointId));
  }, []);

  const updateMapPoint = useCallback((pointId: string, changes: Partial<MapPoint>) => {
    setMapPoints(prev => prev.map(point => point.id === pointId ? { ...point, ...changes } : point));
  }, []);

  return {
    mapPoints,
    addMapPoint,
    removeMapPoint,
    updateMapPoint,
  };
};

export default useMapPoints;

export interface MapPoint {
  id: string;
  nombre: string;
  lat: number;
  lng: number;
  tipo: 'Punto' | 'Ruta' | 'Zona';
}

export interface MapPointInput {
  nombre: string;
  lat: string;
  lng: string;
  tipo: 'Punto' | 'Ruta' | 'Zona';
}
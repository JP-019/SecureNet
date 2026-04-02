class Zona {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.ubicacion = data.ubicacion;
    this.empresaId = data.empresaId;
    this.lat = data.lat;
    this.lng = data.lng;
    this.color = data.color;
    this.tipo = data.tipo;
    this.capacidad = data.capacidad;
  }

  toPublic() {
    return {
      id: this.id,
      nombre: this.nombre,
      ubicacion: this.ubicacion,
      empresaId: this.empresaId,
      lat: this.lat,
      lng: this.lng,
      color: this.color,
      tipo: this.tipo,
      capacidad: this.capacidad
    };
  }

  static fromData(data) {
    return new Zona(data);
  }
}

module.exports = Zona;
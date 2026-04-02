const { v4: uuidv4 } = require('uuid');

class Alerta {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.tipo = data.tipo;
    this.descripcion = data.descripcion;
    this.prioridad = data.prioridad;
    this.zona = data.zona;
    this.usuarioId = data.usuarioId;
    this.empresaId = data.empresaId;
    this.timestamp = data.timestamp || new Date().toISOString();
    this.estado = data.estado || 'active';
    this.resuelta = data.resuelta || false;
  }

  toPublic() {
    return {
      id: this.id,
      tipo: this.tipo,
      descripcion: this.descripcion,
      prioridad: this.prioridad,
      zona: this.zona,
      usuarioId: this.usuarioId,
      empresaId: this.empresaId,
      timestamp: this.timestamp,
      estado: this.estado,
      resuelta: this.resuelta
    };
  }

  static fromData(data) {
    return new Alerta(data);
  }
}

module.exports = Alerta;
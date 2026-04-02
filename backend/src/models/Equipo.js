const { v4: uuidv4 } = require('uuid');

class Equipo {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.nombre = data.nombre;
    this.empresaId = data.empresaId;
    this.turno = data.turno;
    this.zona = data.zona;
    this.miembros = data.miembros || [];
    this.horarioInicio = data.horarioInicio;
    this.horarioFin = data.horarioFin;
  }

  toPublic() {
    return {
      id: this.id,
      nombre: this.nombre,
      empresaId: this.empresaId,
      turno: this.turno,
      zona: this.zona,
      miembros: this.miembros,
      horarioInicio: this.horarioInicio,
      horarioFin: this.horarioFin
    };
  }

  static fromData(data) {
    return new Equipo(data);
  }
}

module.exports = Equipo;
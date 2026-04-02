class Rol {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.color = data.color;
    this.permisos = data.permisos;
  }

  toPublic() {
    return {
      id: this.id,
      nombre: this.nombre,
      color: this.color,
      permisos: this.permisos
    };
  }

  static fromData(data) {
    return new Rol(data);
  }
}

module.exports = Rol;
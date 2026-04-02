class Empresa {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.direccion = data.direccion;
    this.telefono = data.telefono;
    this.email = data.email;
    this.logo = data.logo;
    this.activa = data.activa;
  }

  toPublic() {
    return {
      id: this.id,
      nombre: this.nombre,
      direccion: this.direccion,
      telefono: this.telefono,
      email: this.email,
      logo: this.logo,
      activa: this.activa
    };
  }

  static fromData(data) {
    return new Empresa(data);
  }
}

module.exports = Empresa;
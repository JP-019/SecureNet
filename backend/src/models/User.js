const { v4: uuidv4 } = require('uuid');

class User {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.empresaId = data.empresaId;
    this.usuario = data.usuario;
    this.password = data.password;
    this.nombre = data.nombre;
    this.rol = data.rol;
    this.email = data.email;
    this.telefono = data.telefono;
    this.zona = data.zona;
    this.estado = data.estado || 'active';
    this.foto = data.foto;
    this.fechaAlta = data.fechaAlta || new Date().toISOString();
    this.ultimoAcceso = data.ultimoAcceso || new Date().toISOString();
  }

  toPublic() {
    return {
      id: this.id,
      nombre: this.nombre,
      usuario: this.usuario,
      rol: this.rol,
      email: this.email,
      telefono: this.telefono,
      estado: this.estado,
      zona: this.zona
    };
  }

  static fromData(data) {
    return new User(data);
  }
}

module.exports = User;
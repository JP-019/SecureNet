const { v4: uuidv4 } = require('uuid');

class Message {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.de = data.de;
    this.para = data.para;
    this.contenido = data.contenido;
    this.tipo = data.tipo || 'text';
    this.timestamp = data.timestamp || new Date().toISOString();
    this.leido = data.leido || false;
    this.empresaId = data.empresaId;
  }

  toPublic() {
    return {
      id: this.id,
      de: this.de,
      para: this.para,
      contenido: this.contenido,
      tipo: this.tipo,
      timestamp: this.timestamp,
      leido: this.leido,
      empresaId: this.empresaId
    };
  }

  static fromData(data) {
    return new Message(data);
  }
}

module.exports = Message;
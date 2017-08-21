export class Contacto {
  constructor() {
    this.tipo = '';
    this.dato = '';
  }
}

export class Formacion {
  constructor() {
    this.tipo = '';
    this.titulo = '';
    this.fecha = '';
    this.institucion = '';
  }
}

export class Domicilio {
  constructor() {
    this.calle = '';
    this.numero = '';
    this.codpostal = '';
    this.localidad = '';
  }
}

export class Profesional {
  constructor() {
    this.nombre = '';
    this.apellido = '';
    this.dni = '';
    this.cuit = '';
    this.sexo = '';
    this.estadoCivil = '';
    this.lugarNacimiento = '';
    this.fechaNacimiento = '';
    this.nacionalidad = '';
    this.observaciones = '';
    this.domicilioReal = new Domicilio();
    this.domicilioLegal = new Domicilio();
    this.contactos = [];
    this.formaciones = [];
  }
}

export class Solicitud {
  constructor() {
    this.fecha = '';
    this.delegacion = '';
    this.profesional = new Profesional();
  }
}

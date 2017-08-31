export class Beneficiario {
  constructor() {
    this.dni = '';
    this.apellido = '';
    this.nombre = '';
    this.fechaNacimiento = '';
    this.vinculo = '';
    this.invalidez = false;
  }
}

export class Subsidiario {
  constructor() {
    this.dni = '';
    this.apellido = '';
    this.nombre = '';
    this.porcentaje = '';
  }
}


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
    this.localidad = '';
    this.pais = '';
    this.provincia = '';
    this.departamento = '';
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
    this.relacionLaboral = 'dependencia';
    this.empresa = '';
    this.serviciosPrestados = '';
    this.cajaPrevisional = '';
    this.beneficiarios = [];
    this.subsidiarios = [];
    this.publicar = false;
  }
}

export class Solicitud {
  constructor() {
    this.fecha = '';
    this.delegacion = '';
    this.profesional = new Profesional();
    this.exencionArt10 = false;
    this.exencionArt6 = false;
  }
}

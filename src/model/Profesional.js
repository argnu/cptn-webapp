import { Domicilio } from '@/model/Domicilio';

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
    this.id = null;
    this.tipo = '';
    this.valor = '';
  }
}

export class Formacion {
  constructor() {
    this.titulo = '';
    this.fecha = '';
    this.institucion = '';
    this.tipo = '';
  }
}

export class Profesional {
  constructor() {
    this.tipo = 'profesional';
    this.condafip = '';
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
    this.domicilioProfesional = new Domicilio();
    this.domicilioConstituido = new Domicilio();
    this.contactos = [];
    this.formaciones = [];
    this.relacionDependencia = false;
    this.independiente = false;
    this.empresa = '';
    this.serviciosPrestados = '';
    this.poseeCajaPrevisional = false;
    this.nombreCajaPrevisional = '';
    this.beneficiarios = [];
    this.subsidiarios = [];
    this.publicar = false;
  }
}

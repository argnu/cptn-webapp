import { Entidad } from '@/model/Entidad';

export class Subsidiario {
  constructor() {
    this.persona = null;
    this.dni = null;
    this.apellido = null
    this.nombre = null;
    this.porcentaje = null;
  }
}

export class Formacion {
  constructor() {
    this.titulo = '';
    this.fechaEmision = '';
    this.fechaEgreso = '';
    this.institucion = '';
    this.nivel = '';
    this.principal = false;
    this.tiempoEmision = '';
  }
}

export class CajaPrevisional {
  constructor() {
    this.nombre = '';
  }
}

export class Profesional extends Entidad {
  constructor() {
    super();
    this.tipo = 'profesional';
    this.apellido = '';
    this.dni = '';
    this.sexo = '';
    this.estadoCivil = '';
    this.lugarNacimiento = '';
    this.fechaNacimiento = '';
    this.nacionalidad = '';
    this.observaciones = '';
    this.formaciones = [];
    this.relacionDependencia = false;
    this.independiente = false;
    this.empresa = '';
    this.serviciosPrestados = '';
    this.cajas_previsionales = [];
    this.subsidiarios = [];
    this.publicarEmail = false;
    this.publicarCelular = false;
    this.publicarDireccion = false;
    this.publicarAcervo = false;
  }
}

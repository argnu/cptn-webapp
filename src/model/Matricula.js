export class Matricula {
  constructor(delegacion) {
    this.documento = {
      fecha: '',
      numero: '',
      tipo: 1
    };
    this.solicitud = null;
    this.delegacion = delegacion;
    this.generar_boleta = true;
    this.tipo = 'TECA';
  }
}

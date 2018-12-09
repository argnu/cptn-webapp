import { Ability } from '@casl/ability'

export default {
  state: {
    snackbar: {
      show: false
    },
    user: null,
    delegacion: null,
    opciones: null,
    cursor_wait: false,
    ability: null
  },

  setUser(user) {
    this.state.user = user;
    this.state.ability = new Ability(user.rules);
  },

  setDelegacion(delegacion) {
    this.state.delegacion = delegacion;
  },

  setOpciones(opciones) {
    this.state.opciones = opciones;
  },

  removeUser() {
    this.state.user = null;
    this.state.delegacion = null;
  }
}

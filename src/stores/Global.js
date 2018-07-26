export default {
  state: {
    snackbar: {
      show: false
    },
    user: null,
    delegacion: null,
    opciones: null,
    cursor_wait: false 
  },

  setUser(user) {
    this.state.user = user;
  },

  setDelegacion(delegacion) {
    this.state.delegacion = delegacion;
  },

  setOptions(opciones) {
    this.state.opciones = opciones;
  },

  removeUser() {
    this.state.user = null;
    this.state.delegacion = null;
  }
}

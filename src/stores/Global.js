export default {
  state: {
    snackbar: {
      show: false
    },
    user: null,
    delegacion: null
  },

  setUser(user) {
    this.state.user = user;
  },

  setDelegacion(delegacion) {
    this.state.delegacion = delegacion;
  },

  removeUser() {
    this.state.user = null;
    this.state.delegacion = null;
  }
}

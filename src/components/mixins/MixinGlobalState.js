import Store from '@/stores/Global'
import { roles, tipos_matricula, tipo_entidad, tipo_persona,
  estado_solicitud  
} from '@/opciones'

export default {
    data() {
        return {
          global_state: Store.state,
          opciones_globales: {
              roles, 
              tipos_matricula,
              tipo_entidad,
              tipo_persona,
              estado_solicitud
          }
        }
      },
    
      computed: {
        user: function () {
          return this.global_state.user;
        },
    
        delegacion: function () {
          return this.global_state.delegacion;
        }
      },
    
      methods: {
        snackOk: function(msg) {
          this.global_state.snackbar.msg = msg;
          this.global_state.snackbar.color = 'success';
          this.global_state.snackbar.show = true;
        },

        snackError: function(e) {
          let msg = (!e.response || e.response.status === 500) ? 'Ha ocurrido un error en la conexión' : e.response.data.mensaje;
          this.global_state.snackbar.msg = msg;
          this.global_state.snackbar.color = 'error';
          this.global_state.snackbar.show = true;
          console.error(e)
        }    
      }
}

# Instalación de APP Web

Los siguientes pasos tienen el fin de instalar la aplicación Web en un servidor Apache.

1- Clonar el repositorio y acceder al proyecto

`git clone https://github.com/argnu/cptn-webapp`
`cd cptn-webapp`

2- Instalar las dependencias

`npm install`

3- Configurar

Es necesario configurar la aplicación. Para ello debemos crear un archivo `config.js` y guardar dentro de la carpeta `src` del proyecto.

`nano src/config.js`

Dicho archivo tiene la siguient estructura:

```javascript
export default {
    api: 'url_api',
    reports: 'url_reportes'
}
```

en el mismo debemos determinar la url de la API y del servicio de reportes (Jasper)

4- Generar empaquetado y deplegar en Apache

Para ello ejecutamos el siguiente comando:

`sh deploy.sh $DIR -e $ENV`

El mismo tiene los siguientes parámetros:

* **$DIR**: carpeta relativa a `/var/www/html` donde será alojada la app. *Parámetro Obligatorio*.

* **$ENV**: ambiente de deploy. Puede ser: 
    * `prod` para deploy en producción.
    * `test` para deploy en ambiente de prueba. *Valor por defecto*

Ej. `sh deploy.sh webapp -e prod`

**Observación:** puede ser necesario ejecutar dicho comando con permisos de superusuario ya que se modificará el contenido de la carpeta `/var/www/html`



# Desarrollo

Para el desarrollo de la aplicación debemos instalar como se explicó anteriormente, hasta el paso 3).

El código de la aplicación se encuentra en la carpeta `src`.

Podemos visualizar la aplicación con el siguiente comando:

`npm run dev`

Esto desplegará la aplicación en un servidor web temporal en el puerto 8080 y se actualizará automáticamente con cada cambio que realicemos en el código de la aplicación (carpeta `src`).
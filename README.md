## Desarrollo

Ejecutar los siguientes comandos:

`npm install`

`npm run dev`


## Deploy

Ejecutar el siguiente comando:

`sh deploy.sh $DIR -e $ENV -u $URL`

Tiene los siguientes parámetros:

* **$DIR**: carpeta relativa a `/var/www/html` donde será alojada la app. *Parámetro Obligatorio*.

* **$ENV**: ambiente de deploy. Puede ser: 
    * `prod` para deploy en producción.
    * `test` para deploy en ambietne de prueba. *Valor por defecto*

* **$URL**: url de la API REST.

Ej. `sh deploy.sh webapp -e prod -u cptn.com.ar`

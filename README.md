## Desarrollo

Ejecutar los siguientes comandos:

`npm install`

`npm run dev`


## Deploy

Ejecutar el siguiente comando:

`sh deploy.sh $DIR -u $URL`

Tiene los siguientes parámetros:

* **$DIR**: carpeta relativa a `/var/www/html` donde será alojada la app. **Parámetro Obligatorio**.

* **$URL**: url de la API REST.

Ej. `sh deploy.sh webapp -u "cptn.com.ar"`

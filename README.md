# Trimon Pedidos FE

## Variables de entorno requeridas
 - VITE_API_BASE_URL: URL del API

## Como ejecutar el codigo en GitHub codespaces 
### Ejecucion `mockApi`
Si no se tiene acceso al backend se puede usar un servidor mock de la siguiente manera
1. Navegar a `mockApi`
2. Ejecutar `npm install`
3. ejecutar `node app.js`
Esto va a ejecutar un API que va a retornar informacion fija.
Por ahora solo contiene el endpoint `/clientes` pero otros pueden ser agregados

### Ejecutar frontend
En la raiz del proyecto ejecutar
1. crear archivo `.env` en la raiz del proyecto con contenido
```.env
VITE_API_BASE_URL=/api
```
2. `npm install`
3. `npm run dev`



## Cómo generar una versión en GitHub

1. Navega a la sección de [Releases](https://github.com/monicasierrar/trimon-pedidos-fe/releases).
2. Haz clic en `Draft a new Release`.
3. En la opción `Tag`, escribe la nueva versión, usualmente con el formato `v0.0.1`.
4. En la opción `Target`, selecciona la rama `main`.
5. Luego, presiona el botón `Generate release notes`.
6. Marca la casilla `Set as a pre-release`.
7. Presiona el botón `Publish release`.
8. Ve a la sección `Actions` del repositorio.
9. Espera a que la tarea de ejecución del despliegue con el nombre del tag dado en el `paso 3` termine.
10. Navega a INSERTAR_URL_DE_DESPLIEGUE.
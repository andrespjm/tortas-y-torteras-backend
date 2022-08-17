# Grupal Project - Henry

-Si clonaron el primer repo, borrarlo en su pc.
-Aceptar la invitacion del segundo repo que recibieron por mail: https://github.com/andrespjm/tortas-y-torteras-backend
-Clonarlo en una carpeta que no contenga el primer repo.
-Crear su rama y manejarse siempre en ella
-Ejecutar npm install
-Ejecutar npm run json (tiene que estar sin uso el puerto 5000)
-Ejecutar npm start
-Eliminar en client el json que estaban usando para empezar a llamar al back, las rutas actuales son las que se detallan debajo.

-Sucesivos merges: (siempre desde su rama)
-Ejecutar git pull origin main
-Ejecutar npm run json
-Ejecutar npm start

En caso que hayamos instalados nuevas librerias que se incorporan a un merge, luego del git pull origin main, al hacer npm start, les diria que falta un modulo. En este caso se debe volver a ejecutar npm install y luego nuevamente npm start.

-Debajo pueden ver la las rutas, la info que se debe enviar para los post, y la que pueden enviar para el put de products (en este caso todos los campos modificables son opcionales, pueden enviar el put incluso con un solo atributo a modificar)

# Users

POST
http://localhost:3001/users/signup

<
{
"name":"Andrés",
"lastname":"Salazar",
"email":"hola@mundo.com",
"password":"123456"
}
/>

# Colors

GET
http://localhost:3001/colors

# Products

Campos enum:
collection: 'Flowers', 'Abstract', 'Butterflies'
type:'Cake Tray', 'Turntable'
size: 'Standard', 'Special'

GET
http://localhost:3001/products

GET detail
http://localhost:3001/products/:id

DELETE
http://localhost:3001/products/:id

POST (si no encuentra el color lo crea)
http://localhost:3001/products

<
{
"name": "prueba post",
"description": "other description",
"diameter": 9.9,
"collection":"Flowers",
"stock": 9,
"size":"Special",
"price": 99,
"type": "Cake Tray",
"img_home": "https://i.ibb.co/Qv8SSPP/AXEF1454.jpg",
"img_detail":
["https://i.ibb.co/GFxrYK1/IMG-E4815.jpg","https://i.ibb.co/DMdkpK9/CEWAE4328.jpg","https://i.ibb.co/Qv8SSPP/AXEF1454.jpg"],
"colors":
[{"hex":"#0000FF","name":"blue"},{"hex":"#FFC0CB","name":"pink"},{"hex":"#FFF8FF","name":"new"}],  
 "artist": "other artist"
}
/>

PUT (se pueden enviar una, varias o todas las propiedades, si no encuentra el color lo crea)
http://localhost:3001/products/:id

<
{
"name": "prueba put",
"description": "other description",
"diameter": 9.9,
"stock": 9,
"price": 99,
"type": "Cake Tray",
"img_home": "https://i.ibb.co/Qv8SSPP/AXEF1454.jpg",
"collection":"Flowers",
"size":"Special",
"img_detail":["https://i.ibb.co/GFxrYK1/IMG-E4815.jpg","https://i.ibb.co/DMdkpK9/CEWAE4328.jpg","https://i.ibb.co/Qv8SSPP/AXEF1454.jpg"],
"colors":[{"hex":"#0000FF","name":"blue"},{"hex":"#FFC0CB","name":"pink"},{"hex":"#FFF8FF","name":"new"}],  
 "artist": "other artist"
}
/>

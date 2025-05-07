# Juguetería UAM

Una plataforma modular de juegos con una interfaz similar a Friv, desarrollada con HTML, CSS y JavaScript vanilla, integrando Firebase para autenticación y almacenamiento de datos.

## Estructura del Proyecto

```
Jugueteria UAM/
├── css/
│   ├── styles.css       # Estilos principales
│   └── animations.css   # Animaciones y efectos visuales
├── js/
│   ├── firebase-config.js # Configuración de Firebase
│   ├── auth.js          # Funcionalidad de autenticación
│   ├── games.js         # Manejo de juegos y módulos
│   └── app.js           # Script principal de la aplicación
├── img/
│   └── placeholder-game.jpg # Imagen de placeholder para juegos
├── modules/             # Carpeta para módulos de juegos
│   └── sample-game/     # Ejemplo de un módulo de juego
│       └── index.html   # Juego de ejemplo
└── index.html           # Página principal
```

## Características

- **Autenticación de usuarios**: Registro e inicio de sesión con Firebase Authentication
- **Plataforma de juegos**: Interfaz tipo Friv para mostrar juegos disponibles
- **Estructura modular**: Cada juego se aloja en su propia carpeta dentro de `modules/`
- **Diseño moderno e interactivo**: Animaciones y efectos visuales atractivos
- **Responsive**: Adaptable a diferentes tamaños de pantalla

## Configuración de Firebase

Para que la aplicación funcione correctamente, debes configurar Firebase:

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Registra una aplicación web en tu proyecto Firebase
3. Copia las credenciales de configuración proporcionadas
4. Reemplaza los valores de placeholder en `js/firebase-config.js` con tus credenciales:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};
```

5. Habilita la autenticación por correo electrónico/contraseña en Firebase Console (Authentication > Sign-in method)
6. Configura Firestore Database para almacenar datos de usuarios y juegos

## Cómo agregar nuevos juegos

Para agregar un nuevo juego a la plataforma:

1. Crea una nueva carpeta dentro de `modules/` con el nombre de tu juego
2. Desarrolla tu juego como una aplicación web independiente dentro de esta carpeta
3. Asegúrate de que tu juego pueda comunicarse con la aplicación principal mediante `window.postMessage()`
4. Actualiza el array `sampleGames` en `js/games.js` o agrega el juego a la colección de Firebase

## Ejecución local

Para ejecutar la aplicación localmente, simplemente abre el archivo `index.html` en tu navegador. Para una experiencia completa con Firebase, necesitarás un servidor local o utilizar Firebase Hosting.

## Notas importantes

- Esta aplicación utiliza Firebase para autenticación y almacenamiento de datos
- No se utilizan frameworks, todo está desarrollado con JavaScript vanilla
- La estructura modular permite agregar nuevos juegos fácilmente
- El diseño es responsive y se adapta a diferentes dispositivos

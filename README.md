## 🧭 Eternal Pose de Cumpleaños: ¡Ruta a Raftel\!

Una aplicación web móvil diseñada para funcionar como un **Eternal Pose** de One Piece, apuntando de forma constante a las coordenadas de la fiesta de cumpleaños del Capitán.

Este proyecto utiliza el GPS del dispositivo y el sensor de Brújula para calcular en tiempo real el ángulo exacto que la aguja debe rotar para señalar el destino final, sin importar cómo el usuario gire el teléfono.

### 🌟 Características

  * **Eternal Pose Dinámico:** La aguja gira automáticamente para apuntar a un punto fijo en la Tierra.
  * **Menú de Configuración:** Interfaz simple para ingresar Latitud y Longitud del destino.
  * **Diseño Temático:** Estética rústica inspirada en las brújulas y los Log Poses de One Piece.
  * **Distancia en Tiempo Real:** Calcula y muestra la distancia aproximada restante al destino.
  * **Compatibilidad Total:** Funciona en iOS (con manejo de permisos de brújula) y Android.

### ⚙️ Tecnología Utilizada

Este proyecto es un Front-End puro, ligero y rápido:

  * **HTML5:** Estructura de la aplicación.
  * **CSS3:** Estilos temáticos y el diseño visual de la brújula.
  * **JavaScript (ES6):**
      * API de **Geolocation** (`navigator.geolocation`) para obtener la ubicación del usuario.
      * API de **Device Orientation** (`deviceorientation` event) para leer el rumbo del dispositivo.
      * Fórmulas de navegación (Rumbo Inicial y Haversine) para el cálculo del ángulo y la distancia.

### 🛠️ Configuración e Instalación

Dado que esta es una aplicación web que requiere acceso a sensores de seguridad, debe desplegarse bajo el protocolo HTTPS.

#### 1\. Preparación Local

Clona este repositorio o descarga los archivos:

```bash
git clone https://github.com/tu-usuario/eternal-pose-party.git
cd eternal-pose-party
```

#### 2\. Despliegue (Requisito Clave)

Para que el GPS y la Brújula funcionen en navegadores modernos (especialmente Chrome y Safari), el sitio **DEBE** ser servido a través de **HTTPS**.

Se recomienda usar un servicio de alojamiento estático gratuito:

| Servicio | Enlace de Despliegue | Ventaja |
| :--- | :--- | :--- |
| **Netlify** | Conectar con GitHub | Despliegue continuo (CI/CD) y HTTPS automático. |
| **GitHub Pages** | Configuración sencilla | Integración nativa si el código está en un repositorio público. |

### 🧭 Cómo Usar el Eternal Pose

1.  **Abrir el Enlace:** El invitado accede a la URL desplegada (ej: `fiesta-pirata-one-piece.netlify.app`).
2.  **Fijar el Destino (Log Pose):** En el menú de configuración, introduce las coordenadas de la ubicación de la fiesta (Latitud y Longitud).
3.  **Iniciar Navegación:** Haz clic en el botón **"Fijar Destino (¡Zarpar\!)"**.
4.  **Permisos (Solo iOS):** Si el dispositivo es un iPhone, se le pedirá al usuario que **permita el acceso a los sensores de movimiento**. Este permiso es indispensable para el funcionamiento de la brújula.
5.  **Navegar:** La aguja roja del "Eternal Pose" ahora **apuntará directamente a la ubicación de la fiesta** en todo momento, sin importar la dirección en que el usuario esté mirando.

### 📐 Fórmulas Clave (La Lógica del Eternal Pose)

La función central del código se basa en dos cálculos trigonométricos esenciales:

#### 1\. Cálculo del Rumbo (Bearing)

El ángulo $\theta$ necesario para apuntar desde la ubicación actual ($L_U, O_U$) al destino ($L_D, O_D$):

$$\theta = \operatorname{atan2}(\sin(\Delta O) \cdot \cos(L_D), \cos(L_U) \cdot \sin(L_D) - \sin(L_U) \cdot \cos(L_D) \cdot \cos(\Delta O))$$

#### 2\. Rotación Final de la Aguja

El ángulo aplicado a la aguja es el Rumbo hacia el Destino compensado por la orientación actual del teléfono (Heading):

$$\text{Rotación} = \text{Rumbo Destino} - \text{Rumbo Dispositivo}$$

### 👨‍💻 Contribución y Créditos

Este proyecto fue creado para una celebración de cumpleaños especial.

  * **Creador Original:** Nestor Santos 
  * **Inspiración:** Eiichiro Oda / El manga y anime **One Piece**.
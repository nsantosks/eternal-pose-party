// --- VARIABLES GLOBALES ---
let destLat = 0; // Latitud del destino
let destLon = 0; // Longitud del destino
let currentLat = 0;
let currentLon = 0;
let watchId = null; // Para detener el GPS si es necesario

// Elementos del DOM
const configMenu = document.getElementById('config-menu');
const eternalPoseScreen = document.getElementById('eternal-pose-screen');
const pointer = document.getElementById('pointer');
const distanceInfo = document.getElementById('distance-info');

// Botones
document.getElementById('set-log-btn').addEventListener('click', iniciarNavegacion);
document.getElementById('reset-log-btn').addEventListener('click', reiniciarLog);

// --- FUNCIONES PRINCIPALES ---

function iniciarNavegacion() {
    const latInput = document.getElementById('latitud').value;
    const lonInput = document.getElementById('longitud').value;

    if (!latInput || !lonInput) {
        alert("¡Argh! Necesitas coordenadas para fijar el Log Pose.");
        return;
    }

    // Guardar destino
    destLat = parseFloat(latInput);
    destLon = parseFloat(lonInput);

    // Cambiar de pantalla
    configMenu.classList.remove('active');
    eternalPoseScreen.classList.add('active');

    // Iniciar sensores
    solicitarPermisosYArrancar();
}

// --- FUNCIONES PRINCIPALES (MODIFICADA) ---

function solicitarPermisosYArrancar() {
    // 1. Lógica de Solicitud de Permisos para iOS 13+
    if (window.DeviceOrientationEvent && 
        typeof DeviceOrientationEvent.requestPermission === 'function') {
        
        // Es un iPhone (o un dispositivo que requiere la solicitud explícita)
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    // Permiso concedido, podemos iniciar los sensores
                    iniciarSensores();
                } else {
                    alert("¡Permiso denegado! No puedo orientar el Eternal Pose sin acceso a la brújula.");
                    // Vuelve al menú de configuración si no se concede el permiso
                    reiniciarLog(); 
                }
            })
            .catch(error => {
                console.error("Error al solicitar permiso de orientación:", error);
                alert("Ocurrió un error al intentar acceder a la brújula.");
                reiniciarLog(); 
            });
    } else {
        // Android o navegadores que no requieren solicitud explícita
        iniciarSensores();
    }
}

// --- FUNCIÓN DE INICIO DE SENSORES (NUEVA) ---

function iniciarSensores() {
    // 1. Iniciar GPS (Geolocation)
    if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(actualizarUbicacion, errorGPS, {
            enableHighAccuracy: true
        });
    } else {
        distanceInfo.innerText = "Tu Den Den Mushi no tiene GPS.";
    }

    // 2. Iniciar Brújula (DeviceOrientation)
    if (window.DeviceOrientationEvent) {
        // El listener solo se agrega si el navegador lo soporta y, en iOS, solo después del permiso
        window.addEventListener('deviceorientation', actualizarBrujula);
    } else {
        distanceInfo.innerText += " / Dispositivo sin Brújula.";
    }
}

// --- El resto de funciones (actualizarUbicacion, actualizarBrujula, calcularRumbo, etc.) se mantienen igual ---

function solicitarPermisosYArrancar() {
    // 1. Iniciar GPS
    if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(actualizarUbicacion, errorGPS, {
            enableHighAccuracy: true
        });
    } else {
        distanceInfo.innerText = "Tu Den Den Mushi no tiene GPS.";
    }

    // 2. Iniciar Brújula (DeviceOrientation)
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', actualizarBrujula);
    } else {
        alert("Tu dispositivo no soporta orientación.");
    }
}

// --- LÓGICA DE NAVEGACIÓN ---

// Se ejecuta cada vez que el GPS detecta movimiento
function actualizarUbicacion(position) {
    currentLat = position.coords.latitude;
    currentLon = position.coords.longitude;

    // Calcular distancia (Opcional, solo visual)
    const distancia = calcularDistancia(currentLat, currentLon, destLat, destLon);
    distanceInfo.innerText = `Distancia: ${distancia.toFixed(2)} km`;
}

// Se ejecuta cada vez que giras el teléfono
function actualizarBrujula(event) {
    // 1. Calcular el ángulo hacia el destino (Bearing)
    const rumboDestino = calcularRumbo(currentLat, currentLon, destLat, destLon);

    // 2. Obtener hacia dónde apunta el teléfono (Heading)
    let rumboDispositivo = 0;

    // Manejo especial para iOS (iPhone) vs Android
    if (event.webkitCompassHeading) {
        // iOS
        rumboDispositivo = event.webkitCompassHeading;
    } else {
        // Android / Estándar (alpha es rotación en eje Z)
        rumboDispositivo = 360 - event.alpha;
    }

    // 3. Calcular la rotación final de la aguja
    // La aguja debe apuntar al destino, compensando el giro del teléfono
    let rotacionAguja = rumboDestino - rumboDispositivo;

    // Aplicar la rotación al elemento HTML
    // NOTA: Mantenemos el translate(-50%, -100%) del CSS para que gire desde su base
    pointer.style.transform = `translate(-50%, -100%) rotate(${rotacionAguja}deg)`;
}

// --- MATEMÁTICAS DE NAVEGACIÓN (TRIGONOMETRÍA) ---

// Convierte grados a radianes
function toRad(deg) {
    return deg * Math.PI / 180;
}

// Convierte radianes a grados
function toDeg(rad) {
    return rad * 180 / Math.PI;
}

// Calcula el ángulo (Azimut) desde el punto A al punto B
function calcularRumbo(lat1, lon1, lat2, lon2) {
    const dLon = toRad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(toRad(lat2));
    const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
              Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
    
    let brng = toDeg(Math.atan2(y, x));
    
    // Normalizar a 0 - 360 grados
    return (brng + 360) % 360;
}

// Fórmula de Haversine para distancia en KM (aproximada)
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la tierra en km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function errorGPS(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
    distanceInfo.innerText = "Buscando señal...";
}
# AR Taza — Pañuelo Orbitante

Aplicación web de Realidad Aumentada que detecta un marker 2D impreso en una
taza y muestra un pañuelo blanco animado orbitando alrededor de ella.

Stack: **HTML estático + A-Frame 1.5 + MindAR 1.2 (image tracking)**  
Funciona en: Android Chrome, iOS Safari, desktop con webcam. Sin instalación.


## Estructura del proyecto

```
ar-taza/
├── index.html            ← Escena AR principal
├── assets/
│   ├── panuelo.png       ← Textura del pañuelo (con transparencia)
│   └── panuelo.glb       ← (Opcional) Modelo 3D exportado de Blender
├── targets/
│   └── taza-marker.mind  ← Target compilado de MindAR
└── README.md
```


## Setup rápido (3 pasos)

### 1. Compilar el marker

Entrá a la herramienta de compilación de MindAR:  
**https://hiukim.github.io/mind-ar-js-doc/tools/compile**

- Subí la imagen del marker que está impreso en la taza
  (cuanto más contraste y detalle tenga, mejor tracking)
- Descargá el archivo `.mind` generado
- Guardalo en `targets/taza-marker.mind`

**Tips para un buen marker:**
- Alta resolución (mínimo 300×300px, ideal 800+)
- Buen contraste, bordes definidos, sin grandes áreas planas de un color
- Evitá patrones repetitivos o simétricos (confunden al tracker)
- El marker puede ser un diseño artístico; no tiene que ser un QR

### 2. Agregar el asset del pañuelo

**Opción A — PNG (más simple, recomendado para empezar):**
- Poné tu mejor frame del pañuelo en `assets/panuelo.png`
- Asegurate de que tenga fondo transparente (canal alfa)
- El archivo `index.html` ya viene configurado para usarlo

**Opción B — Modelo GLB desde Blender (mejor calidad):**
- Abrí el archivo .blend del pañuelo
- Seguí la guía de exportación más abajo
- Guardá el `.glb` en `assets/panuelo.glb`
- En `index.html`, comentá el `<a-plane>` y descomentá el `<a-entity gltf-model>`

### 3. Servir por HTTPS

La cámara del navegador requiere HTTPS. Opciones para desarrollo:

```bash
# Opción A: npx (si tenés Node.js)
npx serve .

# Opción B: Python
python3 -m http.server 8000

# Opción C: VS Code Live Server (extensión)
# Click derecho en index.html → Open with Live Server
```

Para probar en tu celular desde la PC, usá un túnel:
```bash
npx localtunnel --port 8000
# o
ngrok http 8000
```

Ambos te dan una URL HTTPS que podés abrir en el celular.


## Exportar GLB desde Blender

### Si el pañuelo ya tiene animación de cloth/keyframes:

1. **Limpiar la escena:** Eliminá todo excepto el pañuelo y su armature/keyframes
2. **Aplicar transformaciones:** Seleccioná el pañuelo → `Ctrl+A` → All Transforms
3. **Centrar el origen:** El origin del objeto debe estar donde querés el centro de
   la órbita (o sea, donde estaría el centro de la taza).
   - Si el pañuelo se mueve solo (cloth sim), poné el origin en el pañuelo
   - Si querés que la órbita la maneje A-Frame, ponelo en (0,0,0)
4. **Exportar:**
   - File → Export → glTF 2.0 (.glb)
   - Format: glTF Binary (.glb)
   - Activar: ☑ Animations
   - Dejar el resto por defecto
5. **Verificar:** Arrastrá el .glb a https://gltf-viewer.donmccurdy.com/ para
   confirmar que la animación se ve bien

### Si solo tenés el pañuelo estático (mesh sin animación):

1. Exportá el mesh como GLB sin animación
2. La órbita la maneja `orbit-animation` en A-Frame (ya configurado)
3. Opcionalmente podés agregar un cloth simulation bakeado para que el pañuelo
   "flamee" mientras orbita


## Calibración del pañuelo

Los valores clave a ajustar en `index.html`:

### Radio de órbita
```
position="0.7 0 0"   ← en el <a-plane> o <a-entity gltf-model>
```
Este es el radio en unidades MindAR (1 unidad = ancho del marker).  
Fórmula: `radio = (diámetro_taza / ancho_marker) × 0.5`

| Marker | Taza Ø | Radio |
|--------|--------|-------|
| 4 cm   | 8 cm   | 1.0   |
| 5 cm   | 8 cm   | 0.8   |
| 6 cm   | 8 cm   | 0.67  |
| 6 cm   | 10 cm  | 0.83  |

### Altura del pañuelo
```
position="0 0 0"     ← en #orbit-compensation
```
Si querés que orbite más arriba o abajo de donde está el marker,
ajustá el Y de `orbit-compensation`. El valor también es relativo al
ancho del marker.

### Velocidad de órbita
```
orbit-animation="speed: 40"
```
40 = 40°/seg ≈ 9 segundos por vuelta. Bajalo a 20-25 para algo más suave.

### Tamaño del pañuelo
```
width="0.4" height="0.4"    ← para el plano PNG
scale="0.3 0.3 0.3"         ← para el modelo GLB
```

### Compensación de orientación
```
rotation="-90 0 0"    ← en #orbit-compensation
```
- Marker en el **costado** de la taza: `rotation="-90 0 0"`
- Marker en la **parte superior**: `rotation="0 0 0"`
- Marker en el **fondo** de la taza: `rotation="180 0 0"`

### Debug visual
Descomentá los ejes de debug en `index.html` para ver los ejes XYZ del
marker en la escena. Rojo = X, Verde = Y, Azul = Z. Esto te ayuda a
entender hacia dónde apunta cada eje y calibrar la compensación.


## Notas de compatibilidad

| Plataforma       | Estado  | Notas                                    |
|-------------------|---------|------------------------------------------|
| Android Chrome    | ✅      | Funciona directo                         |
| iOS Safari 15.4+  | ✅      | Requiere iOS 15.4+ para WebGL2           |
| Desktop Chrome    | ✅      | Con webcam                               |
| Desktop Firefox   | ✅      | Con webcam                               |
| Desktop Safari    | ⚠️      | Puede requerir habilitar WebGL2 en flags |

MindAR usa WebGL y getUserMedia, ambos ampliamente soportados.
No se necesitan permisos de giroscopio ni APIs experimentales.


## Troubleshooting

**El marker no se detecta:**
- Verificá que `taza-marker.mind` existe y la ruta es correcta
- Probá con buena iluminación, sin reflejos sobre el marker
- Imprimí el marker en buena calidad (no pixelado)

**El pañuelo aparece pero en posición incorrecta:**
- Usá los ejes de debug para entender la orientación
- Ajustá `rotation` en `#orbit-compensation`

**La escena se ve muy lenta en móvil:**
- Reducí el tamaño del PNG del pañuelo (max 512×512)
- Si usás GLB, optimizá con https://meshoptimizer.org/gltf/

**No carga en el celular:**
- Verificá que estás usando HTTPS (http no tiene acceso a cámara)
- En iOS, abrí en Safari (Chrome iOS no soporta bien WebRTC)

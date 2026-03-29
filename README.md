# AR Experiencias

Colección de experiencias de realidad aumentada para la web.  
Stack: **HTML estático + A-Frame + MindAR** — deploy en **Vercel**.


## Estructura

```
ar-webapp/
├── public/                    ← Vercel sirve este directorio
│   ├── index.html             ← Landing page (listado de proyectos)
│   │
│   ├── taza-abuelas/          ← midominio.com/taza-abuelas/
│   │   ├── index.html         ← Escena AR
│   │   ├── assets/
│   │   │   └── panuelo.png
│   │   └── targets/
│   │       └── taza-marker.mind
│   │
│   └── nuevo-proyecto/        ← midominio.com/nuevo-proyecto/
│       ├── index.html
│       ├── assets/
│       └── targets/
│
├── vercel.json                ← Config de deploy
├── .gitignore
└── README.md
```

Cada proyecto es una carpeta dentro de `public/` con su propio `index.html`.  
La URL es automática: la carpeta `taza-abuelas/` se accede en `/taza-abuelas/`.


## Setup inicial

### 1. Crear repo en GitHub

```bash
cd ar-webapp
git init
git add .
git commit -m "setup inicial"
gh repo create tu-usuario/ar-experiencias --public --push
```

### 2. Deploy en Vercel

Opción A — Desde la web:
1. Ir a https://vercel.com/new
2. Importar el repo de GitHub
3. Vercel detecta automáticamente que es estático
4. Click en Deploy

Opción B — Desde la terminal:
```bash
npx vercel --prod
```

### 3. Dominio personalizado (opcional)

En Vercel → Settings → Domains → agregar tu dominio.


## Agregar un nuevo proyecto

1. Crear la carpeta dentro de `public/`:
```bash
mkdir -p public/mi-nuevo-proyecto/{assets,targets}
```

2. Crear el `index.html` de la escena AR dentro de esa carpeta

3. Agregar la tarjeta en `public/index.html`:
```html
<a class="card" href="/mi-nuevo-proyecto/">
  <span class="tag">Image Tracking</span>
  <h2>Mi Nuevo Proyecto</h2>
  <p>Descripción de la experiencia.</p>
  <span class="arrow">Abrir experiencia →</span>
</a>
```

4. Commit y push — Vercel redeploya automáticamente.


## Desarrollo local

```bash
# Terminal 1: servir archivos
npx serve public

# Terminal 2 (para probar en celular): túnel HTTPS
npx ngrok http 3000
```


## Notas sobre Vercel

- `vercel.json` configura:
  - `outputDirectory: "public"` → solo sirve la carpeta public
  - `trailingSlash: true` → URLs limpias con barra final
  - Headers `Permissions-Policy: camera=(*)` → permite cámara en todos los proyectos
  - Content-Type correcto para archivos `.mind`
- Vercel provee HTTPS gratis — necesario para acceso a cámara en móvil
- El free tier soporta bien este tipo de proyectos estáticos
- Cada push a main redeploya automáticamente

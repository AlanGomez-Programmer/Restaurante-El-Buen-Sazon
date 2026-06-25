# Restaurante El Buen Sazón

Sistema de gestión integral para restaurante con funcionalidades completas de inventario, platillos y pedidos.

## 📑 Tabla de Contenido

| Sección | Descripción |
|---------|-------------|
| [Características Principales](#características-principales) | Módulos del sistema |
| [Diseño y UX](#diseño-y-experiencia-de-usuario) | Responsive, modo oscuro, navegación |
| [Tecnologías](#tecnologías-utilizadas) | Stack tecnológico |
| [Estructura](#estructura-del-proyecto) | Organización de archivos |
| [Funcionalidades](#funcionalidades-técnicas) | Formularios, tablas, tarjetas |
| [Instalación](#instalación-y-uso) | Guía de instalación |
| [Wireframes Móvil](#wireframes-versión-móvil) | Diseños de referencia móvil |
| [Wireframes Desktop](#wireframes-versión-desktop) | Diseños de referencia desktop |

## Características Principales

### 🚀 Módulos del Sistema

#### 🔐 Sistema de Login
- Autenticación de usuarios
- Diseño responsive para móvil y desktop
- Validación de credenciales
- Interfaz moderna y accesible

#### 📦 Gestión de Inventario
- **Registro de Insumos**: Alta de nuevos insumos con tipo, cantidad, unidad, fecha y descripción
- **Visualización**: Tarjetas informativas con datos completos de cada insumo
- **Actualización**: Modificación de información de insumos existentes
- **Eliminación**: Baja de insumos del inventario
- **Creación de Tipos**: Gestión de categorías de insumos
- **Confirmación de Datos**: Verificación antes de guardar cambios

#### 🍽️ Gestión de Platillos
- **Registro de Platillos**: Creación de nuevos platillos con imagen, tipo, código, descripción y valor de venta
- **Gestión de Ingredientes**: Asignación de ingredientes a platillos
- **Visualización**: Tarjetas con información completa de platillos
- **Actualización**: Modificación de datos de platillos
- **Eliminación**: Eliminación de platillos del catálogo
- **Creación de Tipos**: Gestión de categorías de platillos (PF - Platillo Fuerte, Entradas, Bebidas, etc.)
- **Modal de Detalles**: Vista detallada de cada platillo

#### 📋 Gestión de Pedidos
- **Registro de Pedidos**: Creación de nuevos pedidos con fecha, hora, cliente y selección de platillos
- **Selección de Platillos**: Tabla interactiva para agregar platillos al pedido
- **Cálculo Automático**: Subtotal y total del pedido calculado automáticamente
- **Visualización**: Tarjetas con información de pedidos
- **Actualización de Estado**: Modificación del estado de pedidos (Pendiente, En Proceso, Completado, Cancelado)
- **Eliminación**: Cancelación de pedidos
- **Modal de Detalles**: Vista completa de información del pedido

### 🎨 Diseño y Experiencia de Usuario

#### Responsive Design
- **Mobile-First**: Diseño optimizado primero para dispositivos móviles
- **Desktop**: Layout mejorado con sidebar de navegación y grillas optimizadas
- **Adaptación Automática**: Transiciones suaves entre diferentes tamaños de pantalla

#### Modo Oscuro
- Tema claro y oscuro
- Transiciones suaves entre temas
- Variables CSS para consistencia en colores
- Preservación de preferencia del usuario

#### Navegación Intuitiva
- **Sidebar**: Menú lateral con navegación clara en desktop
- **Botones de Regreso**: Navegación fácil entre secciones
- **Indicadores Visuales**: Estados activos en menú de navegación

### 💾 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con CSS Variables y Flexbox/Grid
- **JavaScript**: Lógica de negocio y manipulación del DOM
- **LocalStorage**: Persistencia de datos en el navegador
- **Responsive Design**: Media queries para adaptación a diferentes dispositivos

### 📁 Estructura del Proyecto

```
Restaurante-El-Buen-Sazon/
├── css/
│   ├── desktop/           # Estilos específicos para desktop
│   │   ├── layout-desktop.css
│   │   ├── login-desktop.css
│   │   ├── menu-desktop.css
│   │   ├── inventario-desktop.css
│   │   ├── platillos-desktop.css
│   │   └── pedidos-desktop.css
│   ├── inventario.css     # Estilos base de inventario
│   ├── platillos.css      # Estilos base de platillos
│   ├── pedidos.css       # Estilos base de pedidos
│   ├── login.css          # Estilos de login
│   ├── menu.css           # Estilos del menú principal
│   └── variables.css      # Variables CSS globales
├── js/
│   ├── Insumos.js         # Lógica de inventario
│   ├── platillos.js       # Lógica de platillos
│   ├── pedidos.js         # Lógica de pedidos
│   ├── login.js           # Lógica de autenticación
│   ├── utils.js           # Funciones utilitarias
│   └── persistencia.js    # Manejo de localStorage
├── img/
│   └── wireframes/        # Wireframes de referencia
├── inventario.html        # Página de inventario
├── platillos.html         # Página de platillos
├── pedidos.html           # Página de pedidos
├── login.html             # Página de login
├── index.html             # Página principal
└── README.md              # Este archivo
```

### 🎯 Funcionalidades Técnicas

#### Formularios
- Validación de campos
- Alineación responsive de inputs
- Labels e inputs agrupados para mejor UX
- Confirmación de datos antes de guardar

#### Tablas
- Diseño responsive con scroll horizontal
- Información organizada en columnas
- Estilos consistentes en desktop

#### Tarjetas
- Diseño moderno con sombras y transiciones
- Información clara y organizada
- Hover effects para interactividad
- Botones de acción integrados

#### Modales
- Visualización de información detallada
- Cierre fácil con botón o click fuera
- Diseño responsive
- Animaciones suaves

### 🚀 Instalación y Uso

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/AlanGomez-Programmer/Restaurante-El-Buen-Sazon.git
   ```

2. **Navegar al directorio**:
   ```bash
   cd Restaurante-El-Buen-Sazon
   ```

3. **Abrir el archivo principal**:
   - Abrir `index.html` en un navegador web moderno
   - No requiere servidor web ni instalación de dependencias

4. **Uso del Sistema**:
   - Iniciar sesión con credenciales válidas
   - Navegar entre módulos usando el menú
   - Utilizar las funciones de CRUD según necesidad
   - Activar/desactivar modo oscuro según preferencia

### 🎨 Diseño Visual

#### Paleta de Colores
- **Principal**: Negro y blanco con acentos
- **Acciones**: Verde (#2E7D32) para acciones positivas, Rojo (#c62828) para acciones negativas
- **Fondo**: Variables CSS para adaptación a temas

#### Tipografía
- Títulos con fuente personalizada
- Peso de fuente para jerarquía visual
- Letter-spacing para legibilidad

#### Componentes
- **Botones**: Diseño consistente con sombras y hover effects
- **Inputs**: Bordes redondeados con validación visual
- **Tarjetas**: Sombras sutiles con hover elevation
- **Tablas**: Diseño limpio con filas alternadas

### 📱 Responsive Breakpoints

- **Mobile**: < 1024px
- **Desktop**: ≥ 1024px
- **Desktop Large**: ≥ 1440px

### 🔧 Características Adicionales

- **Persistencia Local**: Datos guardados en localStorage
- **Validación de Formularios**: Feedback visual de errores
- **Animaciones Suaves**: Transiciones CSS para mejor UX
- **Accesibilidad**: Estructura semántica HTML5
- **Performance**: Optimizado para carga rápida
- **Cross-browser**: Compatibilidad con navegadores modernos

### 👥 Desarrollo

Este proyecto está desarrollado con un enfoque mobile-first, priorizando la experiencia de usuario en dispositivos móviles y mejorando progresivamente para pantallas más grandes.

**Estado del Proyecto**: Sistema funcional con módulos completos de inventario, platillos y pedidos.

## 📱 Wireframes Versión Móvil

### Login
![Login Móvil](./img/wireframes/version%20movil/Login.jpg)

### Menú Principal
![Menú Principal Móvil](./img/wireframes/version%20movil/Menu_principal.jpg)

### Inventario
#### Menú de Inventario
![Inventario Menú Móvil](./img/wireframes/version%20movil/Inventario_menuj.jpg)

#### Registro de Inventario
![Inventario Registro Móvil](./img/wireframes/version%20movil/Inventario_registro.jpg)

#### Mostrar Inventario
![Inventario Mostrar Móvil](./img/wireframes/version%20movil/Inventario_mostrar.jpg)

#### Actualizar Inventario
![Inventario Actualizar Móvil](./img/wireframes/version%20movil/Inventario_actualizar.jpg)

#### Eliminar Inventario
![Inventario Eliminar Móvil](./img/wireframes/version%20movil/Inventario_eliminar.jpg)

### Pedidos
#### Menú de Pedidos
![Pedidos Menú Móvil](./img/wireframes/version%20movil/Pedidos_menu.jpg)

#### Registro de Pedidos
![Pedidos Registro Móvil](./img/wireframes/version%20movil/Pedidos_registro.jpg)

#### Mostrar Pedidos
![Pedidos Mostrar Móvil](./img/wireframes/version%20movil/Pedidos_mostrar.jpg)

#### Actualizar Pedidos
![Pedidos Actualizar Móvil](./img/wireframes/version%20movil/Pedidos_actualizar.jpg)

#### Eliminar Pedidos
![Pedidos Eliminar Móvil](./img/wireframes/version%20movil/Pedidos_eliminar.jpg)

### Platillos
#### Menú de Platillos
![Platillos Menú Móvil](./img/wireframes/version%20movil/Platillos_menu.jpg)

#### Registro de Platillos
![Platillos Registro Móvil](./img/wireframes/version%20movil/Platillos_registro.jpg)

#### Mostrar Platillos
![Platillos Mostrar Móvil](./img/wireframes/version%20movil/Platillos%20Mostrar.jpg)

#### Actualizar Platillos
![Platillos Actualizar Móvil](./img/wireframes/version%20movil/Platillos_actualizar.jpg)

#### Eliminar Platillos
![Platillos Eliminar Móvil](./img/wireframes/version%20movil/Platillos_eliminar.jpg)

## 💻 Wireframes Versión Desktop

### Login
![Login Desktop](./img/wireframes/version%20escritorio/login.jpg)

### Menú Principal
![Menú Principal Desktop](./img/wireframes/version%20escritorio/Menu_principal.jpg)

### Inventario
#### Menú de Inventario
![Inventario Menú Desktop](./img/wireframes/version%20escritorio/Inventario_menu.jpg)

#### Registro de Inventario
![Inventario Registro Desktop](./img/wireframes/version%20escritorio/Inventario_registro.jpg)

#### Mostrar Inventario
![Inventario Mostrar Desktop](./img/wireframes/version%20escritorio/Inventario_mostrar.jpg)

#### Actualizar Inventario
![Inventario Actualizar Desktop](./img/wireframes/version%20escritorio/Inventario_actualizar.jpg)

#### Eliminar Inventario
![Inventario Eliminar Desktop](./img/wireframes/version%20escritorio/Inventario_eliminar.jpg)

### Pedidos
#### Menú de Pedidos
![Pedidos Menú Desktop](./img/wireframes/version%20escritorio/Pedidos_menu.jpg)

#### Registro de Pedidos
![Pedidos Registro Desktop](./img/wireframes/version%20escritorio/Pedidos_registro.jpg)

#### Mostrar Pedidos
![Pedidos Mostrar Desktop](./img/wireframes/version%20escritorio/Pedidos_mostrar.jpg)

#### Actualizar Pedidos
![Pedidos Actualizar Desktop](./img/wireframes/version%20escritorio/Pedidos_actualizar.jpg)

#### Eliminar Pedidos
![Pedidos Eliminar Desktop](./img/wireframes/version%20escritorio/Pedidos_eliminar.jpg)

### Platillos
#### Menú de Platillos
![Platillos Menú Desktop](./img/wireframes/version%20escritorio/Platillos_menu.jpg)

#### Registro de Platillos
![Platillos Registro Desktop](./img/wireframes/version%20escritorio/Platillos_registro.jpg)

#### Mostrar Platillos
![Platillos Mostrar Desktop](./img/wireframes/version%20escritorio/Platillos%20Mostrar.jpg)

#### Actualizar Platillos
![Platillos Actualizar Desktop](./img/wireframes/version%20escritorio/Platillos_actualizar.jpg)

#### Eliminar Platillos
![Platillos Eliminar Desktop](./img/wireframes/version%20escritorio/Platillos_eliminar.jpg)

---

## 👨 AUTOR
Programador Full-Stack Jr. Alan Gomez

GitHub: [AlanGomez-Programmer](https://github.com/AlanGomez-Programmer)

Linkedln: alan-gomez-763163320
const exampleRoutes = require('./exampleRoutes');
const dateRoutes = require('./dateRoutes');
const authRoutes = require('./authRoutes');
const usuariosRoutes = require('./usuariosRoutes');
const ganadoRoutes = require('./ganadoRoutes');
const saludGanadoRoutes = require('./saludGanadoRoutes');
const produccionLecheRoutes = require('./produccionLecheRoutes');
const inventariosRoutes = require('./inventariosRoutes');
const categoriasInventarioRoutes = require('./categoriasInventarioRoutes');
const empleadosRoutes = require('./empleadosRoutes');
const gestionPersonalRoutes = require('./gestionPersonalRoutes');
const ventasRoutes = require('./ventasRoutes');
const facturacionRoutes = require('./facturacionRoutes');
const produccionDiariaRoutes = require('./produccionDiariaRoutes');
const alertasRoutes = require('./alertasRoutes');
const historicoSaludRoutes = require('./historicoSaludRoutes');
const historicoProduccionRoutes = require('./historicoProduccionRoutes');

// Función para registrar todas las rutas
const registerRoutes = (app) => {
  // Ruta de prueba de salud
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString(),
      timezone: process.env.TZ || 'UTC'
    });
  });

  // ==============================
  // RUTAS PÚBLICAS (sin autenticación)
  // ==============================
  app.use('/api/auth', authRoutes); // Login y registro

  // ==============================
  // RUTAS PROTEGIDAS (requieren autenticación)
  // ==============================
  
  // Gestión de usuarios y roles
  app.use('/api/usuarios', usuariosRoutes);
  
  // Gestión de ganado
  app.use('/api/ganado', ganadoRoutes);
  app.use('/api/salud-ganado', saludGanadoRoutes);
  app.use('/api/produccion-leche', produccionLecheRoutes);
  app.use('/api/produccion-diaria', produccionDiariaRoutes);
  app.use('/api/historico-salud', historicoSaludRoutes);
  app.use('/api/historico-produccion', historicoProduccionRoutes);
  
  // Gestión de inventario
  app.use('/api/inventarios', inventariosRoutes);
  app.use('/api/categorias-inventario', categoriasInventarioRoutes);
  
  // Gestión de personal
  app.use('/api/empleados', empleadosRoutes);
  app.use('/api/gestion-personal', gestionPersonalRoutes);
  
  // Gestión de ventas
  app.use('/api/ventas', ventasRoutes);
  app.use('/api/facturacion', facturacionRoutes);
  
  // Alertas
  app.use('/api/alertas', alertasRoutes);
  
  // ==============================
  // RUTAS DE DESARROLLO/EJEMPLO
  // ==============================
  app.use('/api/examples', exampleRoutes);
  app.use('/api/dates', dateRoutes);
  
  // Aquí puedes agregar más rutas
  // app.use('/api/ganado', ganadoRoutes);
  // app.use('/api/productos', productosRoutes);

  // Ruta 404 - No encontrada
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Ruta no encontrada'
    });
  });
};

module.exports = registerRoutes;

/**
 * Utilidades para manejo de fechas y horas
 * Formato: DD/MM/YYYY en 24 horas
 */

/**
 * Formatea una fecha al formato español DD/MM/YYYY HH:mm:ss
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
const formatDateTimeES = (date) => {
  if (!date) return null;
  const d = new Date(date);
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

/**
 * Formatea solo la fecha al formato DD/MM/YYYY
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} Fecha formateada
 */
const formatDateES = (date) => {
  if (!date) return null;
  const d = new Date(date);
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Formatea solo la hora al formato HH:mm:ss (24 horas)
 * @param {Date|string} date - Fecha/hora a formatear
 * @returns {string} Hora formateada
 */
const formatTimeES = (date) => {
  if (!date) return null;
  const d = new Date(date);
  
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * Obtiene la fecha/hora actual en formato español
 * @returns {string} Fecha y hora actual formateada
 */
const getCurrentDateTimeES = () => {
  return formatDateTimeES(new Date());
};

/**
 * Convierte una fecha en formato DD/MM/YYYY a objeto Date
 * @param {string} dateStr - Fecha en formato DD/MM/YYYY
 * @returns {Date} Objeto Date
 */
const parseSpanishDate = (dateStr) => {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('/');
  return new Date(year, month - 1, day);
};

/**
 * Query SQL para formatear fechas en PostgreSQL
 * Uso: SELECT ${sqlFormatDate('created_at')} as fecha_formateada
 */
const sqlFormatDate = (columnName) => {
  return `TO_CHAR(${columnName}, 'DD/MM/YYYY HH24:MI:SS')`;
};

/**
 * Query SQL solo para fecha
 */
const sqlFormatDateOnly = (columnName) => {
  return `TO_CHAR(${columnName}, 'DD/MM/YYYY')`;
};

/**
 * Query SQL solo para hora
 */
const sqlFormatTimeOnly = (columnName) => {
  return `TO_CHAR(${columnName}, 'HH24:MI:SS')`;
};

module.exports = {
  formatDateTimeES,
  formatDateES,
  formatTimeES,
  getCurrentDateTimeES,
  parseSpanishDate,
  sqlFormatDate,
  sqlFormatDateOnly,
  sqlFormatTimeOnly
};

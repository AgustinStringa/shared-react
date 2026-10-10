/**
 * Cliente HTTP genérico, agnóstico y reutilizable para proyectos React.
 * Provee manejo centralizado de baseURL, headers por defecto, serialización JSON y control de errores HTTP.
 */
export class HttpClient {
  /**
   * @param {Object} config
   * @param {string | (() => string)} [config.baseUrl] URL base o función que resuelve la URL base dinámica.
   * @param {Object | (() => Object)} [config.getHeaders] Headers o función que resuelve headers dinámicos (ej: Authorization).
   * @param {(error: Error, context: Object) => void} [config.onError] Handler global de errores.
   */
  constructor({ baseUrl = '', getHeaders = () => ({}), onError = console.error } = {}) {
    this.baseUrl = baseUrl;
    this.getHeaders = getHeaders;
    this.onError = onError;
  }

  /**
   * Obtiene la URL base resolviendo si es un string o función.
   * @returns {string}
   */
  resolveBaseUrl() {
    return typeof this.baseUrl === 'function' ? this.baseUrl() : this.baseUrl;
  }

  /**
   * Obtiene los headers resolviendo si es un objeto o función.
   * @returns {Object}
   */
  resolveHeaders() {
    return typeof this.getHeaders === 'function' ? this.getHeaders() : this.getHeaders;
  }

  /**
   * Realiza una petición HTTP usando fetch con manejo estandarizado.
   * @param {string} endpoint Ruta relativa (ej: '/planes')
   * @param {RequestInit} [options] Opciones estándar de fetch
   * @returns {Promise<any>}
   */
  async request(endpoint, options = {}) {
    const base = this.resolveBaseUrl().replace(/\/$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${base}${cleanEndpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...this.resolveHeaders(),
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorData = null;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }

        const error = new Error(errorData?.message || `HTTP ${response.status} en ${url}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      // Si la respuesta no tiene contenido (204 No Content)
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (err) {
      if (this.onError) {
        this.onError(err, { url, endpoint, options });
      }
      throw err;
    }
  }

  /**
   * Petición GET
   * @param {string} endpoint
   * @param {RequestInit} [options]
   */
  get(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * Petición POST
   * @param {string} endpoint
   * @param {any} [body]
   * @param {RequestInit} [options]
   */
  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Petición PUT
   * @param {string} endpoint
   * @param {any} [body]
   * @param {RequestInit} [options]
   */
  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Petición PATCH
   * @param {string} endpoint
   * @param {any} [body]
   * @param {RequestInit} [options]
   */
  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * Petición DELETE
   * @param {string} endpoint
   * @param {RequestInit} [options]
   */
  delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

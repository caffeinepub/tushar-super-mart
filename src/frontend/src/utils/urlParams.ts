/**
 * Utility functions for parsing and managing URL parameters
 * Works with both hash-based and browser-based routing
 */

/**
 * Extracts a URL parameter from the current URL
 * Works with both query strings (?param=value) and hash-based routing (#/?param=value)
 *
 * @param paramName - The name of the parameter to extract
 * @returns The parameter value if found, null otherwise
 */
export function getUrlParameter(paramName: string): string | null {
  // Try to get from regular query string first
  const urlParams = new URLSearchParams(window.location.search);
  const regularParam = urlParams.get(paramName);

  if (regularParam !== null) {
    return regularParam;
  }

  // If not found, try to extract from hash (for hash-based routing)
  const hash = window.location.hash;
  const queryStartIndex = hash.indexOf('?');

  if (queryStartIndex !== -1) {
    const hashQuery = hash.substring(queryStartIndex + 1);
    const hashParams = new URLSearchParams(hashQuery);
    return hashParams.get(paramName);
  }

  return null;
}

/**
 * Stores a parameter in both sessionStorage and localStorage for persistence
 * Useful for maintaining state like admin tokens throughout the session and across reloads
 *
 * @param key - The key to store the value under
 * @param value - The value to store
 */
export function storeParameter(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to store parameter ${key}:`, error);
  }
}

/**
 * Retrieves a parameter from sessionStorage or localStorage
 * Checks sessionStorage first, then localStorage
 *
 * @param key - The key to retrieve
 * @returns The stored value if found, null otherwise
 */
export function getStoredParameter(key: string): string | null {
  try {
    // Check session storage first (current session)
    const sessionValue = sessionStorage.getItem(key);
    if (sessionValue !== null) {
      return sessionValue;
    }
    
    // Fall back to local storage (persists across sessions)
    const localValue = localStorage.getItem(key);
    if (localValue !== null) {
      // Copy to session storage for faster access
      sessionStorage.setItem(key, localValue);
      return localValue;
    }
    
    return null;
  } catch (error) {
    console.warn(`Failed to retrieve parameter ${key}:`, error);
    return null;
  }
}

/**
 * Gets a parameter from URL or storage (URL takes precedence)
 * If found in URL, also stores it in both storages for future use
 *
 * @param paramName - The name of the parameter to retrieve
 * @param storageKey - Optional custom storage key (defaults to paramName)
 * @returns The parameter value if found, null otherwise
 */
export function getPersistedUrlParameter(paramName: string, storageKey?: string): string | null {
  const key = storageKey || paramName;

  // Check URL first
  const urlValue = getUrlParameter(paramName);
  if (urlValue !== null) {
    // Store in both storages for persistence
    storeParameter(key, urlValue);
    return urlValue;
  }

  // Fall back to stored value
  return getStoredParameter(key);
}

/**
 * Removes a parameter from both sessionStorage and localStorage
 *
 * @param key - The key to remove
 */
export function clearParameter(key: string): void {
  try {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to clear parameter ${key}:`, error);
  }
}

/**
 * Removes a specific parameter from the URL without reloading the page
 * Preserves route information and other parameters
 * Used to remove sensitive data from the address bar after extracting it
 *
 * @param paramName - The parameter to remove from the URL
 */
function clearParamFromUrl(paramName: string): void {
  if (!window.history.replaceState) {
    return;
  }

  // Handle query string parameters
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has(paramName)) {
    urlParams.delete(paramName);
    const newSearch = urlParams.toString();
    const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '') + window.location.hash;
    window.history.replaceState(null, '', newUrl);
  }

  // Handle hash parameters
  const hash = window.location.hash;
  if (!hash || hash.length <= 1) {
    return;
  }

  const hashContent = hash.substring(1);
  const queryStartIndex = hashContent.indexOf('?');

  if (queryStartIndex === -1) {
    return;
  }

  const routePath = hashContent.substring(0, queryStartIndex);
  const queryString = hashContent.substring(queryStartIndex + 1);

  const params = new URLSearchParams(queryString);
  if (params.has(paramName)) {
    params.delete(paramName);
    const newQueryString = params.toString();
    let newHash = routePath;

    if (newQueryString) {
      newHash += '?' + newQueryString;
    }

    const newUrl = window.location.pathname + window.location.search + (newHash ? '#' + newHash : '');
    window.history.replaceState(null, '', newUrl);
  }
}

/**
 * Gets a secret parameter with fallback chain: URL -> sessionStorage -> localStorage
 * This is the recommended way to handle sensitive parameters like admin tokens
 *
 * Security benefits:
 * - Automatically cleared from URL after extraction
 * - Persisted across page reloads and sessions
 * - Not sent in HTTP Referer headers after clearing
 *
 * @param paramName - The name of the secret parameter
 * @returns The secret value if found, null otherwise
 */
export function getSecretParameter(paramName: string): string | null {
  // Check if already stored
  const existingSecret = getStoredParameter(paramName);
  if (existingSecret !== null) {
    return existingSecret;
  }

  // Try to extract from URL
  const urlValue = getUrlParameter(paramName);
  if (urlValue) {
    // Store for persistence
    storeParameter(paramName, urlValue);
    // Clear from URL to avoid history leakage
    clearParamFromUrl(paramName);
    return urlValue;
  }

  return null;
}

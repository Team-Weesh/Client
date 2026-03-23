type LocalStorageKey = "access_token" | "refresh_token";

export class Storage {
  private static isWindowAvailable() {
    return typeof window !== "undefined";
  }
  
  static getItem(key: LocalStorageKey) {
    if (this.isWindowAvailable()) return localStorage.getItem(key);
  }
  
  static setItem(key: LocalStorageKey, value: string) {
    if (!this.isWindowAvailable()) return;
    localStorage.setItem(key, value);
  }
  
  static delItem(key: LocalStorageKey) {
    if (!this.isWindowAvailable()) return;
    localStorage.removeItem(key);
  }
  
  static clear() {
    if (this.isWindowAvailable()) localStorage.clear();
  }
}

export class TokenManager {
  static saveTokens(accessToken: string, refreshToken?: string) {
    Storage.setItem("access_token", accessToken);
    if (refreshToken) {
      Storage.setItem("refresh_token", refreshToken);
    }
  }

  static getToken() {
    return Storage.getItem("access_token");
  }

  static getRefreshToken() {
    return Storage.getItem("refresh_token");
  }

  static removeTokens() {
    Storage.delItem("access_token");
    Storage.delItem("refresh_token");
  }

  static hasToken() {
    return Boolean(this.getToken());
  }

  static isTokenExpired(token?: string) {
    const tokenToCheck = token || this.getToken();
    if (!tokenToCheck) return true;

    if (tokenToCheck.split('.').length !== 3) return false;

    const payload = JSON.parse(atob(tokenToCheck.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    return payload.exp ? payload.exp < currentTime : false;
  }

  static getBearerToken() {
    const token = this.getToken();
    return token ? `Bearer ${token}` : null;
  }

  static parseTokenPayload(token?: string) {
    const tokenToParse = token || this.getToken();
    if (!tokenToParse) return null;

    if (tokenToParse.split('.').length !== 3) return null;

    const payload = JSON.parse(atob(tokenToParse.split('.')[1]));
    return payload;
  }
}
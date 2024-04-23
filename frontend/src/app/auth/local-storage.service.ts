import { Injectable } from "@angular/core";

enum LocalStorageEnum {
    JWT_TOKEN = 'jwt-token',
    REFRESH_TOKEN = 'refresh-token',
    USER = 'user',
}

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    constructor() { }

    clearAll(): void {
        localStorage.clear();
    }

    getJwtToken() {
        return localStorage.getItem(LocalStorageEnum.JWT_TOKEN);
    }

    setToken(jwtToken: string) {
        localStorage.removeItem(LocalStorageEnum.JWT_TOKEN);
        localStorage.setItem(LocalStorageEnum.JWT_TOKEN, jwtToken);
    }

    getUser() {
        const user = localStorage.getItem(LocalStorageEnum.USER);
        return user ? JSON.parse(user) : {};
    }

    setUser(user: any) {
        localStorage.removeItem(LocalStorageEnum.USER);
        localStorage.setItem(LocalStorageEnum.USER, JSON.stringify(user));
    }

    updateUserToken(token: string) {
        const userLocalStorage = this.getUser();
        const updatedUser = { ...userLocalStorage, _token: token }
        localStorage.setItem(LocalStorageEnum.USER, JSON.stringify(updatedUser))
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(LocalStorageEnum.REFRESH_TOKEN);
    }

    setRefreshToken(refreshToken: string): void {
        localStorage.removeItem(LocalStorageEnum.REFRESH_TOKEN);
        localStorage.setItem(LocalStorageEnum.REFRESH_TOKEN, refreshToken);
    }
}
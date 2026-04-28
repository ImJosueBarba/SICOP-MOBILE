import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'app-dark-mode';
  private isDark = false;

  constructor() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored !== null) {
      this.isDark = stored === 'true';
    } else {
      this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    this.apply();
  }

  get darkMode(): boolean {
    return this.isDark;
  }

  toggle() {
    this.isDark = !this.isDark;
    localStorage.setItem(this.STORAGE_KEY, String(this.isDark));
    this.apply();
  }

  private apply() {
    document.documentElement.classList.toggle('ion-palette-dark', this.isDark);
  }
}

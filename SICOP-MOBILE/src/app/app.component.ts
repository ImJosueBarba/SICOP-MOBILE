import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonMenuToggle, IonSplitPane, IonToggle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { barChartOutline, documentTextOutline, homeOutline, logOutOutline, statsChartOutline, moonOutline, sunnyOutline } from 'ionicons/icons';
import { AuthService } from './features/auth/services/auth.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [CommonModule, IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonMenuToggle, IonSplitPane, IonToggle, RouterLink, RouterLinkActive],
})
export class AppComponent {
  public appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'bar-chart-outline' },
    { title: 'Predicciones ML', url: '/ml-predicciones', icon: 'stats-chart-outline' },
    { title: 'Reportes', url: '/reportes', icon: 'document-text-outline' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    public themeService: ThemeService
  ) {
    addIcons({ barChartOutline, documentTextOutline, homeOutline, logOutOutline, statsChartOutline, moonOutline, sunnyOutline });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

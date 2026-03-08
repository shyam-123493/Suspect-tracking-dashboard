import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '@core/services/auth.service';
import { AlertService } from '@core/services/alert.service';
import { SimulationService } from '@core/services/simulation.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent implements OnInit, OnDestroy {
  isSidenavOpen = true;
  isMobile = false;
  sidenavMode: 'side' | 'over' = 'side';
  alertCount = 0;
  isRunning = false;
  pageTitle = 'Dashboard';
  username = 'Officer';

  private subs: Subscription[] = [];

  private routeTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/map': 'Investigation Map',
    '/suspects': 'Suspect Directory',
    '/cases': 'Case Files',
    '/alerts': 'Alert Center',
    '/network': 'Network Graph'
  };

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private simulationService: SimulationService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.username = this.authService.getCurrentUser()?.username || 'Officer';

    this.subs.push(
      this.alertService.getAllAlerts().subscribe(alerts => {
        this.alertCount = alerts.filter(a => !a.isDismissed).length;
      }),

      this.simulationService.isRunning$.subscribe(r => (this.isRunning = r)),

      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd)
      ).subscribe((event: any) => {
        const url = event.urlAfterRedirects.split('?')[0];
        this.pageTitle = this.routeTitles[url] || 'Police Investigation';
        // Auto-close sidebar on mobile when navigating
        if (this.isMobile) {
          this.isSidenavOpen = false;
        }
      }),

      // Responsive breakpoint observer
      this.breakpointObserver
        .observe(['(max-width: 768px)'])
        .subscribe(result => {
          this.isMobile = result.matches;
          if (this.isMobile) {
            this.sidenavMode = 'over';
            this.isSidenavOpen = false;
          } else {
            this.sidenavMode = 'side';
            this.isSidenavOpen = true;
          }
        })
    );

    // Set initial title
    const url = this.router.url.split('?')[0];
    this.pageTitle = this.routeTitles[url] || 'Police Investigation';
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  onNavClick() {
    if (this.isMobile) {
      this.isSidenavOpen = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

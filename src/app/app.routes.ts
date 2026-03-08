import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent)
      },
      {
        path: 'map',
        loadComponent: () => import('./features/map/investigation-map/investigation-map.component').then(m => m.InvestigationMapComponent)
      },
      {
        path: 'suspects',
        loadComponent: () => import('./features/suspects/suspect-list/suspect-list.component').then(m => m.SuspectListComponent)
      },
      {
        path: 'suspects/:id',
        loadComponent: () => import('./features/suspects/suspect-profile/suspect-profile.component').then(m => m.SuspectProfileComponent)
      },
      {
        path: 'alerts',
        loadComponent: () => import('./features/alerts/alerts-list/alerts-list.component').then(m => m.AlertsListComponent)
      },
      {
        path: 'cases',
        loadComponent: () => import('./features/cases/cases-list/cases-list.component').then(m => m.CasesListComponent)
      },
      {
        path: 'network',
        loadComponent: () => import('./features/network/network-graph/network-graph.component').then(m => m.NetworkGraphComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

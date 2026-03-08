import { Injectable } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
}

export const authGuard: CanActivateFn = (route, state) => {
  const authService = new AuthService();

  if (authService.isAuthenticated()) {
    return true;
  }

  const router = new Router();
  router.navigate(['/login']);
  return false;
};

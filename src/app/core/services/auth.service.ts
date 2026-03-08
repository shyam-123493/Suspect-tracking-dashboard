import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AuthUser {
  username: string;
  role: 'officer' | 'investigator' | 'supervisor';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.loadAuthState();
  }

  /**
   * Simulate login
   */
  login(username: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      // Simulated authentication
      if (username && password.length >= 4) {
        const user: AuthUser = {
          username,
          role: 'investigator'
        };
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
        localStorage.setItem('auth_user', JSON.stringify(user));
        localStorage.setItem('auth_token', 'dummy_token_' + Date.now());
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  /**
   * Logout
   */
  logout(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  }

  /**
   * Get current user
   */
  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Load auth state from localStorage
   */
  private loadAuthState(): void {
    const user = localStorage.getItem('auth_user');
    const token = localStorage.getItem('auth_token');
    if (user && token) {
      try {
        const parsedUser = JSON.parse(user);
        this.currentUserSubject.next(parsedUser);
        this.isAuthenticatedSubject.next(true);
      } catch (e) {
        this.logout();
      }
    }
  }
}

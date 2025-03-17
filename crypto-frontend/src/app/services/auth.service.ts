import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, tap, of, catchError, Subscription, timer, map } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private apiUrl = 'http://localhost:8080/api/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private sessionCheckSubscription?: Subscription;

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
      this.startSessionCheck();
    }
    this.checkSessionStatus();
  }

  ngOnDestroy(): void {
    if (this.sessionCheckSubscription) {
      this.sessionCheckSubscription.unsubscribe();
    }
  }

  login(loginRequest: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, loginRequest, { withCredentials: true }).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.startSessionCheck();
      })
    );
  }

  register(registerRequest: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, registerRequest, { withCredentials: true });
  }

  logout(): void {
    this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe();

    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);

    if (this.sessionCheckSubscription) {
      this.sessionCheckSubscription.unsubscribe();
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  checkSessionValid(): Observable<boolean> {
    return this.http.get<User>(`${this.apiUrl}/current`, { withCredentials: true })
      .pipe(
        tap(user => {
          if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        }),
        catchError(error => {
          if (error.status === 401) {
            console.log('Session expired or invalid');
            localStorage.removeItem('currentUser');
            this.currentUserSubject.next(null);
          }
          return of(false);
        }),
        map(user => !!user)
      );
  }

  private checkSessionStatus(): void {
    this.checkSessionValid().subscribe();
  }

  private startSessionCheck(): void {
    if (this.sessionCheckSubscription) {
      this.sessionCheckSubscription.unsubscribe();
    }

    this.sessionCheckSubscription = timer(5 * 60 * 1000, 5 * 60 * 1000)
      .subscribe(() => this.checkSessionStatus());
  }
}

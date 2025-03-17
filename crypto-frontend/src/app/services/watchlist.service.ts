import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cryptocurrency } from '../models/cryptocurrency.model';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private apiUrl = 'http://localhost:8080/api/watchlist';

  constructor(private http: HttpClient) { }

  getWatchlist(): Observable<Cryptocurrency[]> {
    return this.http.get<Cryptocurrency[]>(this.apiUrl, { withCredentials: true });
  }

  addToWatchlist(cryptoId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${cryptoId}`, {}, { withCredentials: true });
  }

  removeFromWatchlist(cryptoId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${cryptoId}`, { withCredentials: true });
  }
}

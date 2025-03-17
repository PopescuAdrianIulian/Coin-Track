import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cryptocurrency } from '../models/cryptocurrency.model';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private apiUrl = 'http://localhost:8080/api/cryptocurrencies';

  constructor(private http: HttpClient) { }

  getTopCryptocurrencies(): Observable<Cryptocurrency[]> {
    return this.http.get<Cryptocurrency[]>(this.apiUrl, { withCredentials: true });
  }

  getCryptocurrencyById(id: string): Observable<Cryptocurrency> {
    return this.http.get<Cryptocurrency>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  searchCryptocurrencies(query: string): Observable<Cryptocurrency[]> {
    return this.http.get<Cryptocurrency[]>(`${this.apiUrl}/search?query=${query}`, { withCredentials: true });
  }
}

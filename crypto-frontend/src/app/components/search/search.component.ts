import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { CryptoService } from '../../services/crypto.service';
import { Cryptocurrency } from '../../models/cryptocurrency.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchResults: Cryptocurrency[] = [];
  private searchTerms = new Subject<string>();

  constructor(
    private cryptoService: CryptoService,
    private router: Router
  ) {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.trim().length === 0) {
          return [];
        }
        return this.cryptoService.searchCryptocurrencies(term);
      })
    ).subscribe(results => {
      this.searchResults = results;
    });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerms.next(target.value);
  }

  selectCrypto(crypto: Cryptocurrency): void {
    this.router.navigate(['/crypto', crypto.id]);
    this.searchResults = [];
  }
}

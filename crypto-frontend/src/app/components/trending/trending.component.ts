import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CryptoService } from '../../services/crypto.service';
import { Cryptocurrency } from '../../models/cryptocurrency.model';
import { CryptoCardComponent } from '../crypto-card/crypto-card.component';

@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [CommonModule, RouterLink, CryptoCardComponent],
  templateUrl: './trending.component.html',
  styleUrl: './trending.component.css'
})
export class TrendingComponent implements OnInit {
  topCryptocurrencies: Cryptocurrency[] = [];
  activePage: string = '';

  constructor(
    private cryptoService: CryptoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activePage = this.router.url.substring(1);

    this.loadTopCryptocurrencies();
  }

  loadTopCryptocurrencies(): void {
    this.cryptoService.getTopCryptocurrencies()
      .subscribe({
        next: (data) => {
          this.topCryptocurrencies = data;
        },
        error: (error) => {
          console.error('Error fetching top cryptocurrencies', error);
        }
      });
  }
}

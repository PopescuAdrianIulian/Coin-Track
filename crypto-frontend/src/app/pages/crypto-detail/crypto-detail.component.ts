import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CryptoService } from '../../services/crypto.service';
import { WatchlistService } from '../../services/watchlist.service';
import { AuthService } from '../../services/auth.service';
import { Cryptocurrency } from '../../models/cryptocurrency.model';

@Component({
  selector: 'app-crypto-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './crypto-detail.component.html',
  styleUrl: './crypto-detail.component.css'
})
export class CryptoDetailComponent implements OnInit {
  cryptocurrency: Cryptocurrency | null = null;
  isInWatchlist = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cryptoService: CryptoService,
    private watchlistService: WatchlistService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadCryptocurrency(id);
      }
    });
  }

  loadCryptocurrency(id: string): void {
    this.cryptoService.getCryptocurrencyById(id).subscribe({
      next: (data: Cryptocurrency) => {
        this.cryptocurrency = data;
        this.checkWatchlistStatus();
      },
      error: (error: any) => {
        console.error('Error loading cryptocurrency', error);
      }
    });
  }

  checkWatchlistStatus(): void {
    if (!this.authService.isLoggedIn() || !this.cryptocurrency) {
      this.isInWatchlist = false;
      return;
    }

    this.watchlistService.getWatchlist().subscribe({
      next: (watchlist) => {
        this.isInWatchlist = watchlist.some(crypto => crypto.id === this.cryptocurrency?.id);
      },
      error: (error) => {
        console.error('Error checking watchlist status', error);
        if (error.status === 401) {
          this.authService.checkSessionValid().subscribe();
        }
      }
    });
  }

  toggleWatchlist(): void {
    if (!this.authService.isLoggedIn() || !this.cryptocurrency) {
      this.router.navigate(['/login']);
      return;
    }

    const wasInWatchlist = this.isInWatchlist;

    this.isInWatchlist = !this.isInWatchlist;

    const action = wasInWatchlist ?
      this.watchlistService.removeFromWatchlist(this.cryptocurrency.id) :
      this.watchlistService.addToWatchlist(this.cryptocurrency.id);

    action.subscribe({
      next: (response) => {
        console.log('Watchlist operation successful:', response);
      },
      error: (error) => {
        this.isInWatchlist = wasInWatchlist;

        console.error(`Error ${wasInWatchlist ? 'removing from' : 'adding to'} watchlist:`, error);
        if (error.status === 401) {
          console.error('Authentication issue. User might not be properly logged in.');
          this.authService.checkSessionValid().subscribe(() => {
            this.router.navigate(['/login']);
          });
        } else {
          console.error('Server error details:', error.error);
        }
      }
    });
  }

  formatLargeNumber(num: number): string {
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(2)}B`;
    } else if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`;
    } else if (num >= 1_000) {
      return `${(num / 1_000).toFixed(2)}K`;
    } else {
      return num.toString();
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}

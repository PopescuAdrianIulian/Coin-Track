import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Cryptocurrency } from '../../models/cryptocurrency.model';
import { WatchlistService } from '../../services/watchlist.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-crypto-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './crypto-card.component.html',
  styleUrl: './crypto-card.component.css'
})
export class CryptoCardComponent implements OnInit {
  @Input() cryptocurrency!: Cryptocurrency;
  isInWatchlist = false;
  Math = Math;

  constructor(
    private watchlistService: WatchlistService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkWatchlistStatus();
  }

  checkWatchlistStatus(): void {
    if (!this.authService.isLoggedIn()) {
      this.isInWatchlist = false;
      return;
    }

    this.watchlistService.getWatchlist().subscribe({
      next: (watchlist) => {
        this.isInWatchlist = watchlist.some(crypto => crypto.id === this.cryptocurrency.id);
      },
      error: (error) => {
        console.error('Error checking watchlist status', error);
        if (error.status === 401) {
          this.authService.checkSessionValid().subscribe();
        }
      }
    });
  }

  toggleWatchlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.authService.isLoggedIn()) {
      // Redirect to login page
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
}

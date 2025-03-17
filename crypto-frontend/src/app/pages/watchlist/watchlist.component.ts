import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WatchlistService } from '../../services/watchlist.service';
import { AuthService } from '../../services/auth.service';
import { Cryptocurrency } from '../../models/cryptocurrency.model';
import { CryptoCardComponent } from '../../components/crypto-card/crypto-card.component';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterLink, CryptoCardComponent],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css'
})
export class WatchlistComponent implements OnInit {
  watchlist: Cryptocurrency[] = [];
  
  constructor(
    private watchlistService: WatchlistService,
    public authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.loadWatchlist();
  }
  
  loadWatchlist(): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    
    this.watchlistService.getWatchlist().subscribe({
      next: (data) => {
        this.watchlist = data;
      },
      error: (error) => {
        console.error('Error fetching watchlist', error);
      }
    });
  }
}

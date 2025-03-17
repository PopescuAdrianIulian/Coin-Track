import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { WatchlistComponent } from './pages/watchlist/watchlist.component';
import { CryptoDetailComponent } from './pages/crypto-detail/crypto-detail.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { TrendingComponent } from './components/trending/trending.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'watchlist', component: WatchlistComponent },
  { path: 'trending', component: TrendingComponent },
  { path: 'crypto/:id', component: CryptoDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];

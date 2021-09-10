import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FavoritesComponent } from './favorites/favorites.component';
import { RelaysComponent } from './relays/relays.component';
const routes: Routes = [
  { path: 'favorites', component: FavoritesComponent },
  { path: 'relays', component: RelaysComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

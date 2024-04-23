import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeFormComponent } from './recipies/recipe-form/recipe-form.component';
import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeStartComponent } from './home-start/home-start.component';
import { RecipeDetailComponent } from './recipies/recipe-detail/recipe-detail.component';
import { RecipieListComponent } from './recipies/recipie-list/recipe-list.component';
import { AuthComponent } from './auth/auth.component';

const appRoutes: Routes = [
  { path: 'auth', component: AuthComponent },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeStartComponent },
      { path: 'recipes', component: RecipieListComponent, },
      { path: 'recipes/new', component: RecipeFormComponent },
      { path: 'recipes/view', component: RecipeDetailComponent },
      { path: 'recipes/view/edit', component: RecipeFormComponent },
      { path: 'new', component: RecipeFormComponent },
      { path: 'shopping-list', component: ShoppingListComponent },
    ],
  },
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

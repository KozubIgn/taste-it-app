import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { RecipeFormComponent } from './recipies/recipe-form/recipe-form.component';
import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeStartComponent } from './home-start/home-start.component';
import { RecipeDetailComponent } from './recipies/recipe-detail/recipe-detail.component';
import { RecipieListComponent } from './recipies/recipie-list/recipe-list.component';
import { AuthComponent } from './auth/auth.component';
import { ShoppingListPageComponent } from './shopping-list/shopping-page/shopping-list-page.component';

const appRoutes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeStartComponent },
      { path: 'new', component: RecipeFormComponent },
      { path: 'shopping-list', component: ShoppingListPageComponent },
      {
        path: ':listType', 
        children: [
          { path: '', component: RecipieListComponent },
            { path: 'new', component: RecipeFormComponent },
            { path: ':id', component: RecipeDetailComponent },
            { path: ':id/edit', component: RecipeFormComponent },
        ],
        resolve: {
          listType: (route: ActivatedRouteSnapshot) => route.paramMap.get('listType')
        },
      },
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

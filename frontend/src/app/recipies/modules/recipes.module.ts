import { NgModule } from '@angular/core';
import { RecipeDetailComponent } from '../recipe-detail/recipe-detail.component';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';
import { RecipesComponent } from '../recipes.component';
import { RecipeItemComponent } from '../recipie-list/recipe-item/recipe-item.component';
import { RecipieListComponent } from '../recipie-list/recipe-list.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipesRoutingModule } from '../recipes-routing.module';
import { SharedModule } from '../../shared/modules/shared.module';

@NgModule({
    declarations: [
        RecipesComponent,
        RecipieListComponent,
        RecipeDetailComponent,
        RecipeItemComponent,
        RecipesComponent,
        RecipeFormComponent,
    ],
    imports: [
        RouterModule,
        ReactiveFormsModule,
        SharedModule
    ],
    exports: [
        RecipesComponent,
        RecipieListComponent,
        RecipeDetailComponent,
        RecipeItemComponent,
        RecipesComponent,
        RecipeFormComponent,
        RecipesRoutingModule,
    ]
})
export class RecipesModule {

}
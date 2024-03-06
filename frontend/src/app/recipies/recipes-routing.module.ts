import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RecipeDetailComponent } from "./recipe-detail/recipe-detail.component";
import { RecipeFormComponent } from "./recipe-form/recipe-form.component";
import { RecipieListComponent } from "./recipie-list/recipe-list.component";
import { RecipesResolverService } from "./services/recipes-resolver.service";

const routes: Routes = [

]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RecipesRoutingModule { }
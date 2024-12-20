import {
  Component,
  OnInit,
} from '@angular/core';
import { Recipe } from '../interfaces/recipe.interface';
import { RecipeService } from '../services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ListType } from '../enums/list-type.enum';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipieListComponent implements OnInit {
  recipes$: Observable<Recipe[]> | undefined;


  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(params => {
      const listType: ListType = params['listType'];
      this.recipes$ = this.recipeService.getRecipesForListType(listType);
    })
  }

  onNewRecipe() {
    this.router.navigate(['dashboard/new']);
  }

  onSelectRecipeItem(recipe: Recipe) {
    this.recipeService.setRecipeSubject(recipe);
    this.router.navigate([`./${recipe.id}`], { relativeTo: this.route });
  }
}
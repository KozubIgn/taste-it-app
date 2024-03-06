import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Recipe } from '../interfaces/recipe.interface';
import { RecipeService } from '../services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipieListComponent implements OnInit, OnDestroy {
  recipes$!: Observable<Recipe[]>;
  recipes: Recipe[] = [];
  recipesSub$: Subscription | undefined;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.recipeService.getAllRecipes().subscribe(val => {
      this.recipes = val;
    })
  }
  ngOnDestroy() {
    this.recipesSub$?.unsubscribe();
  }

  onNewRecipe() {
    this.router.navigate(['./new'], { relativeTo: this.route });
  }

  onRecipe() {
  }
}
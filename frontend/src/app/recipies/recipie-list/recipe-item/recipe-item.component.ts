import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Recipe } from '../../interfaces/recipe.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { RecipeService } from '../../services/recipe.service';

type Url = {
  url: string;
}

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RecipeItemComponent implements OnInit {
  constructor(private router: Router,
    private route: ActivatedRoute,
  private recipeService: RecipeService) { }
  @Input() recipe!: Recipe;
  @Input() index: number | undefined;
  recipeItemSubject$: Subject<Recipe> = new Subject<Recipe>();
  url: string[] = [];
  urlString?: Url | undefined;
  text: string = 'Portion';
  noValue: string = '-';

  ngOnInit(): void {
    this.recipe?.imagePath?.forEach(urlObj => {
      this.urlString = urlObj as unknown as Url;
  
    })
  }

  onViewRecipe(recipe: Recipe) {
    this.recipeService.setRecipeSubject(recipe);
    this.router.navigate(['./view'], { relativeTo: this.route });
  }
}

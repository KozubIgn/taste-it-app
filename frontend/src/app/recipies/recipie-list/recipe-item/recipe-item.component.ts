import { Component, Input, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { Recipe } from '../../interfaces/recipe.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { BehaviorSubject } from 'rxjs';

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
  @Input() recipe!: Recipe;
  urlString?: Url | undefined;
  text: string = 'Portion';
  noValue: string = '-';
  showListItem: boolean = false;
  screenWidthSubject$: BehaviorSubject<number> = new BehaviorSubject(window.innerWidth);

  constructor(private router: Router,
    private route: ActivatedRoute,
    private recipeService: RecipeService) { }

  @HostListener('window:resize', ['$event']) onResize() {
    this.screenWidthSubject$.subscribe(width => {
      this.showListItem = width < 976 && width > 480;
    })
  }

  ngOnInit(): void {
    this.recipe?.imagePath?.forEach(urlObj => {
      this.urlString = urlObj as unknown as Url;
      this.getScreenWidth();
      this.onResize();
    })
  }

  onViewRecipe(recipe: Recipe) {
    this.recipeService.setRecipeSubject(recipe);
    this.router.navigate([`./${recipe.id}`], { relativeTo: this.route });
  }
  
  getScreenWidth() {
    window.addEventListener('resize', () => this.screenWidthSubject$.next(window.innerWidth));
  }

}

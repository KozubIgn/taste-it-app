import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Recipe } from '../interfaces/recipe.interface';
import { RecipeService } from '../services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'src/app/components/dialogs/delete-dialog.component';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class RecipeDetailComponent {
  recipe: Recipe | undefined;
  id: number | undefined;
  recipe$: Observable<Recipe | undefined> | undefined;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    const recipeId = this.route.snapshot.paramMap.get('id');
    this.recipe$ = this.recipeService.getRecipeById(recipeId!)
  };

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe?.ingredients);
  }
  onEditRecipe() {
    if (this.recipe) {
      this.recipeService.setRecipeSubject(this.recipe);
    }
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
  onDeleteRecipe(id: string) {
    this.recipeService.deleteRecipe(id);
    this.router.navigate(['/dashboard/recipes']);
  }

  openDeleteModalDialog() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, { data: this.recipe});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDeleteRecipe(result);
      }
    });
  }
}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Tag } from '../../shared/interfaces/tag.interface';
import { Recipe } from '../interfaces/recipe.interface';
import { UploadedFile } from 'src/app/shared/interfaces/upload-file.interface';
import { FileUploadService } from 'src/app/components/file/file-upload/service/file-upload.service';
import { TagService } from 'src/app/shared/services/tag.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeFormComponent implements OnInit {
  id: number | undefined;
  editMode = false;
  recipeForm!: FormGroup;
  uploadedFiles: UploadedFile[] = [];
  tags: Tag[] | undefined = [];
  tags$: Observable<Tag[]> | undefined;
  recipeSubject$: Observable<Recipe | undefined> | undefined;
  recipe: Recipe | undefined;


  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private fileUplaodService: FileUploadService,
    private tagService: TagService,
  ) { }

  ngOnInit(): void {
    this.recipeService.getRecipeSubject().subscribe(recipe => { this.recipe = recipe; });
    this.tagService.getAllTags().subscribe(Alltags => { this.tags = Alltags; });
    this.editMode = this.isEditRoute();
    this.fileUplaodService.uploadedFilesSubject$.subscribe((files) => {
      this.uploadedFiles = files;
    });
    this.initForm();
  }

  isEditRoute(): boolean {
    return this.router.url.includes('edit');
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  isTagSelected(tag: Tag) {
    return this.recipe ? this.recipe.tags?.some(recipeTag => recipeTag.id === tag.id) : false;
  }

  onSubmit() {
    const TagIds: number[] = this.recipeForm.value['tags'];
    const tags: Tag[] = [];
    if (TagIds && this.tags) {
      TagIds.forEach((tagId: number) => {
        const tag = this.tags?.find(tag => tag.id === tagId);
        if (tag) {
          tags.push(tag);
        }
      })
    }
    const newRecipe: Recipe = {
      name: this.recipeForm.value['name'],
      description: this.recipeForm.value['description'],
      imagePath: this.recipeForm.value['imagePath'],
      tags: tags,
      note: this.recipeForm.value['note'],
      instruction: this.recipeForm.value['instruction'],
      favourites: this.recipeForm.value['favourites'],
      vield: this.recipeForm.value['vield'],
      vieldType: this.recipeForm.value['vieldType'],
      prepTime: this.recipeForm.value['prepTime'],
      cookTime: this.recipeForm.value['cookTime'],
      ingredients: this.recipeForm.value['ingredients'],
    }
    this.editMode ? this.recipeService.updateRecipe(this.id!, newRecipe) : this.recipeService.addRecipe(newRecipe);
    this.onCancel();
  }
  private initForm() {
    let recipeName: string | undefined = '';
    let recipeImagePath: UploadedFile[] | undefined = this.uploadedFiles;
    let recipeDescription: string | undefined = '';
    let note: string | undefined = '';
    let instruction: string | undefined = '';
    let recipeIngredients = new FormArray<FormGroup>([]);
    let tags: Tag[] | undefined;
    let vield: number | null | undefined = null;
    let vieldType: string | undefined = '';
    let prepTime: number | null | undefined = null;
    let cookTime: number | null | undefined = null;
    let favourites: boolean = false;

    if (this.editMode) {
      const recipe = this.recipe;
      recipeName = recipe?.name;
      recipeImagePath = recipe?.imagePath;
      recipeDescription = recipe?.description;
      tags = this.tags;
      note = recipe?.note;
      instruction = recipe?.instruction;
      vield = recipe?.vield;
      vieldType = recipe?.vieldType;
      prepTime = recipe?.prepTime;
      cookTime = recipe?.cookTime;
      favourites = recipe!.favourites
      if (recipe && recipe['ingredients']) {
        for (let ingredient of recipe?.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
            })
          );
        }
      }
    }
    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      description: new FormControl(recipeDescription),
      note: new FormControl(note),
      tags: new FormControl(tags),
      imagePath: new FormControl(recipeImagePath),
      ingredients: recipeIngredients,
      instruction: new FormControl(instruction),
      vield: new FormControl(vield),
      vieldType: new FormControl(vieldType),
      prepTime: new FormControl(prepTime),
      cookTime: new FormControl(cookTime),
      favourites: new FormControl(favourites)
    });
  }

  handleUploadedFile(event: any) {
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  isInvalid(control: AbstractControl | null): boolean {
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
    this.recipeForm.reset();
  }
}

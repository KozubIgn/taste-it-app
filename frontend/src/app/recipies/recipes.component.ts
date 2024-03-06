import { Component } from '@angular/core';
import { Recipe } from './interfaces/recipe.interface';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
})
export class RecipesComponent {

  ngOnInit() {
    // good for initilization component
    // let name = this.route.snapshot.params['name'];
    // // to change the path after click on some event with path data . params is aObservable
    // this.route.params.subscribe((params: Params) => {
    // this.selectedRecipe.name = params['name'];
    // sending data to the routerlink
    // [queryParams] = "{allowEdit: '1'}"
    // fragment = "loading"
    // func(param){
    //   this.router.navigate(['servers', param,'edit'],
    // {queryParams: {allowEdit: '1'}, fragment: 'loading'})
    // }

    //retrieve data from the routerlink
    // });
  }
};

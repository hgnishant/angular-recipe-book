import { Route } from '@angular/compiler/src/core';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  //@Input() recipe: Recipe;
   recipe:Recipe;
   index : number;

  constructor(private recipeService: RecipeService, private acRoute : ActivatedRoute, private route: Router) { }

  ngOnInit() {

    this.acRoute.params.
       subscribe(
        (params: Params) => {
          this.index = +params['id'];
          this.recipe = this.recipeService.getRecipe(this.index);
        }
       );
  }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEdit()
  {
    this.route.navigate(['edit'],{relativeTo:this.acRoute});
    }

    onDelete()
    {
      this.recipeService.deleteRecipe(this.index);
      this.route.navigate(['/recipes']);
    }
}

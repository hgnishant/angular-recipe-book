import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit,OnDestroy {
  recipes: Recipe[];
  subscription:Subscription;

  constructor(private acRoute:ActivatedRoute, private router:Router,private recipeService: RecipeService) {
  }

  ngOnInit() {
    this.subscription=this.recipeService.recipesChanged.subscribe(
      (recipe:Recipe[])=>{
        this.recipes=recipe;
    });
    this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe(){
    this.router.navigate(['new'],{relativeTo:this.acRoute});
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}

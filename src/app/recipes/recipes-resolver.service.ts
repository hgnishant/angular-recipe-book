import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import {Recipe} from './recipe.model';
import {DataStorageService} from '../shared/data-storage.service'
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]>{

  constructor(private dataStorageService: DataStorageService, private recipSer: RecipeService) { }

  resolve(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
    const recipes = this.recipSer.getRecipes();
    if(recipes.length===0){
    return this.dataStorageService.FetchRecipes();//resolver will subscribe on its own when required
    }
    else{
      return recipes;
    }
  }

}

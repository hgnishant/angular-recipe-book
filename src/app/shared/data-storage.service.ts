import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { pipe } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  StoreRecipe() {
    const recipe: Recipe[] = this.recipeService.getRecipes();
    this.http
      .put('https://ng-recipe-book-4cb8c.firebaseio.com/recipes.json', recipe)
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  FetchRecipes() {
    //we need to send token with each request
    //take value from user BehaviorSubject
    //by using take(1) only 1 vlaue will be taken then it will be unsubscribed. 3
    //Once this value (user) is ready, it will be passed to exhaustMap. This is bascially callback like we have in js
    //we use exhaustMap here because we have two observables to subscibe here so we will merge them
    //and we added token in the url
    //response received from exhaustMap() is passed to map which in turn uses tap
    //requet commented below was used before using interceptor
    // return this.authService.user.pipe(
    //   take(1),
    //   exhaustMap((user) => {
    //     return this.http.get<Recipe[]>(
    //       'https://ng-recipe-book-4cb8c.firebaseio.com/recipes.json',
    //       {
    //         params: new HttpParams().set('auth', user.token),
    //       }
    //     );
    //   }),
    //   map((recipes) => {
    //     return recipes.map((recipe) => {
    //       return {
    //         ...recipe,
    //         ingredients: recipe.ingredients ? recipe.ingredients : [],
    //       };
    //     });
    //   }),
    //   tap((recipes) => {
    //     console.log(recipes);
    //     this.recipeService.setRecipes(recipes);
    //   })
    // );

    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        return this.http.get<Recipe[]>(
          'https://ng-recipe-book-4cb8c.firebaseio.com/recipes.json'
        );
      }),
      pipe(
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => {
          console.log(recipes);
          this.recipeService.setRecipes(recipes);
        })
      )
    );

    //code below is not required after we added BehaviorSubject and merged the two subscriptions above
    // return this.http
    //   .get<Recipe[]>('https://ng-recipe-book-4cb8c.firebaseio.com/recipes.json')
    //   .pipe(
    //     map((recipes) => {
    //       return recipes.map((recipe) => {
    //         return {
    //           ...recipe,
    //           ingredients: recipe.ingredients ? recipe.ingredients : [],
    //         };
    //       });
    //     }),
    //     tap((recipes) => {
    //       console.log(recipes);
    //       this.recipeService.setRecipes(recipes);
    //     })
    //   );
  }
}

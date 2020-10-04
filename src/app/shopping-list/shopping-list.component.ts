import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[];
  private igChangeSubs : Subscription;
  
  constructor(private slService: ShoppingListService) { }


  ngOnInit() {
    this.ingredients = this.slService.getIngredients();
    //using subjects below
    this.igChangeSubs= this.slService.ingredientsChanged
      .subscribe(
        (ingredients: Ingredient[]) => {
          this.ingredients = ingredients;
        }
      );
  }

  ngOnDestroy()
  {
    this.igChangeSubs.unsubscribe();
  }

  onEditItem(index:number){
    this.slService.editingStarted.next(index);
  }
}

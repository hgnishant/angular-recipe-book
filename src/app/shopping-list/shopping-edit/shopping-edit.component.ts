import {
  Component,
  OnInit,
  ElementRef,
  ViewChild, OnDestroy
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit,OnDestroy {
  // @ViewChild('nameInput', { static: false }) nameInputRef: ElementRef;
  // @ViewChild('amountInput', { static: false }) amountInputRef: ElementRef;
     @ViewChild('f',{static:false}) slForm :NgForm;
     subscription : Subscription;

  editMode=false;
  editItemIndex : number;
  editedItem:Ingredient;
  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.subscription=this.slService.editingStarted.subscribe(
      (index:number)=>{
        this.editMode = true;
        this.editItemIndex = index;
        this.editedItem = this.slService.getIngredient(index);
        this.slForm.setValue({
          name : this.editedItem.name,
          amount : this.editedItem.amount
        });
    });
  }

  onSubmit(form : NgForm) {
    const val = form.value
   // const ingName = this.nameInputRef.nativeElement.value;
    //const ingAmount = this.amountInputRef.nativeElement.value;
    //const newIngredient = new Ingredient(ingName, ingAmount);
    const newIngredient = new Ingredient(val.name, val.amount);
    if(this.editMode){
      this.slService.updateIngredients(this.editItemIndex,newIngredient);
    }
    else
    {
      this.slService.addIngredient(newIngredient);
    }
    this.editMode =false;
    form.reset();
  }

  onClear()
  {
    this.editMode =false;
    this.slForm.reset();
  }

  onDelete()
  {
    this.onClear();
    this.slService.deleteIngredient(this.editItemIndex);
  }
  ngOnDestroy()
  {
    this.subscription.unsubscribe();
  }

}

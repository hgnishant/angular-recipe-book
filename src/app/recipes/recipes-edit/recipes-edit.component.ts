import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipes-edit',
  templateUrl: './recipes-edit.component.html',
  styleUrls: ['./recipes-edit.component.css']
})
export class RecipesEditComponent implements OnInit {
id:number;
editMode=false;
recipeForm : FormGroup;
  constructor(private route : ActivatedRoute,private recipeserv : RecipeService,private router:Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params:Params) => {
        this.id = + params['id'];
        this.editMode=params['id']!=null;//this will determine if the new value or the edit mode
        this.initForm();//set the form whenever route changes
      }

    );
  }

  onSubmit()
  {
    if(this.editMode){
      this.recipeserv.updateRecipe(this.id,this.recipeForm.value);//form values and model values are mapped automatically
    }
    else{
      this.recipeserv.addRecipe(this.recipeForm.value);
    }
    this.router.navigate(['../'],{relativeTo:this.route});
  }


  get controls() { // a getter!
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  private initForm(){
    let recipeName ='';
    let imageURL='';
    let description ='';
    let recipeIngredient = new FormArray([]); 

    if(this.editMode){
      const recipe = this.recipeserv.getRecipe(this.id);
      recipeName = recipe.name;
      imageURL = recipe.imagePath;
      description = recipe.description;
     
      //recipe ingredient exists:
      if(recipe['ingredients']){
        //loop through all of them and create : formGroups for name and amount
        for(let ing of recipe.ingredients){
          console.log(ing);
            recipeIngredient.push(
              new FormGroup({
                'name':new FormControl(ing.name,Validators.required),
                'amount' : new FormControl(ing.amount,[Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)])
              })
            );
        }
      }
    }

      this.recipeForm = new FormGroup(
        {
          'name': new FormControl(recipeName, Validators.required),
          'imagePath': new FormControl(imageURL, Validators.required),
          'description': new FormControl(description,Validators.required),
          'ingredients' : recipeIngredient
        }
      );
  }

  onAddIngredients()
  {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount':new FormControl(null,[Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    );
   
  }
 
  onCancel()
  {
    this.router.navigate(['../'],{relativeTo:this.route})
  }

  onDeleteIngredient(index:number)
  {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}

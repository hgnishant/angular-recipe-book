import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const appRoutes: Routes = [
  { path: "", redirectTo: "/recipes", pathMatch: "full" },
  {
    //use loadChildren for lazy laoding. import is called dynamically. also,
    // remove RecipesModule from appModules now as it will be loaded lazily
    path: "recipes",
    loadChildren: () =>
      import("./recipes/recipes.module").then((m) => m.RecipesModule),
  },
  {
    path: "shopping-list",
    loadChildren: () =>
      import("./shopping-list/shopping-list.module").then(
        (m) => m.ShoppingListModule
      ),
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

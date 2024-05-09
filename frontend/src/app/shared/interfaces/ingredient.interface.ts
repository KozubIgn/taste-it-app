import { ThemePalette } from "@angular/material/core";

export interface Ingredient {
  name: string;
  amount: number;
  completed?: boolean;
  color?: ThemePalette
}

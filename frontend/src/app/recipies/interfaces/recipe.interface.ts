import { UploadedFile } from "src/app/shared/interfaces/upload-file.interface";
import { Ingredient } from "../../shared/interfaces/ingredient.interface";
import { Tag } from "../../shared/interfaces/tag.interface";

export interface Recipe {
     id?: string;
     name: string;
     description?: string;
     note?: string;
     tags?: Tag[];
     imagePath?: UploadedFile[];
     ingredients?: Ingredient[];
     instruction?: string;
     vield?: number;
     vieldType?: string;
     prepTime?: number;
     cookTime?: number;
     favourites: boolean;
}
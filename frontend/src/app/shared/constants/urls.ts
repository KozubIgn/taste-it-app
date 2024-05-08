const BASE_URL = 'http://localhost:5000';

export const RECIPES = BASE_URL + '/api/recipes';
export const RECIPE_ADD_NEW = (userId: string) => `${RECIPES}/${userId}/recipe/new`;
export const RECIPE_DELETE = (userId: string, recipeId: string) => `${RECIPES}/${userId}/recipes/${recipeId}`;
export const RECIPE_UPDATE = (userId: string, recipeId: string) => `${RECIPES}/${userId}/recipes/${recipeId}`;
export const FAVOURITES = (recipeId: string) => `${RECIPES}/${recipeId}/favourites`;
export const RECIPES_BY_SEARCH_URL = RECIPES + '/search/'; // behind slash leave an empty space for adding searchTeerm
export const RECIPES_BY_ID = BASE_URL + 'api/recipes/';
export const TAGS_URL = BASE_URL + '/api/tags';

export const AUTH = BASE_URL + '/api/auth/';
export const USER_SIGN_UP = AUTH + 'signup';
export const USER_LOGIN = AUTH + 'login';
export const REFRESH_TOKEN = AUTH + 'refresh-token';
export const REVOKE_TOKEN = AUTH + 'revoke-token';


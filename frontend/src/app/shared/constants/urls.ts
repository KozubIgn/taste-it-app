const BASE_URL = 'http://localhost:5000';

export const RECIPES_ALL_URL = BASE_URL + '/api/recipes';
export const RECIPE_ADD_NEW = RECIPES_ALL_URL + '/new';
export const RECIPES_BY_SEARCH_URL = RECIPES_ALL_URL + '/search/'; // behind slash leave an empty space for adding searchTeerm
export const RECIPES_BY_ID = BASE_URL + 'api/recipes/';
export const TAGS_URL = BASE_URL + '/api/tags';

export const AUTH = BASE_URL + '/api/auth/';
export const USER_SIGN_UP = AUTH + 'signup';
export const USER_LOGIN = AUTH + 'login';
export const REFRESH_TOKEN = AUTH + 'refresh-token';
export const REVOKE_TOKEN = AUTH + 'revoke-token';


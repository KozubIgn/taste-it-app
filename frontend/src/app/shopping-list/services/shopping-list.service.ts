import { Injectable } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ShoppingList } from '../interfaces/shopping-list.interface';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { SHOPPING_LIST_ADD_NEW } from 'src/app/shared/constants/urls';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  shoppingListSubject$: BehaviorSubject<ShoppingList[]> = new BehaviorSubject<ShoppingList[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.getShoppingLists().subscribe((shoppingLists: ShoppingList[]) => this.shoppingListSubject$.next(shoppingLists));
  }

  getShoppingLists(): Observable<ShoppingList[]> {
    return this.authService.getUser$().pipe(
      map((user: User | null) => {
        console.log(user);

        return (user && user.shopping_lists !== undefined) ? user.shopping_lists : [];
      })
    )
  }

  getShoppingListsSubject(): Observable<ShoppingList[]> {
    return this.shoppingListSubject$;
  }

  addNewShoppingList(shoppingList: ShoppingList) {
    const user = localStorage.getItem('user');
    const userObj: User = JSON.parse(user!);
    this.http.post<ShoppingList>(SHOPPING_LIST_ADD_NEW(userObj.id), shoppingList).pipe(map((res: any) => {
      if (res.shoppingList) {
        const array: ShoppingList[] = this.shoppingListSubject$.value;
        array.push(res.shoppingList);
        this.shoppingListSubject$.next(array);
      }
    })
    ).subscribe();
  }

  updateShoppingList(shoppingList: ShoppingList) { }

}

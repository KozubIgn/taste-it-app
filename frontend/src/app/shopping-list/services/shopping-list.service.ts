import { Injectable } from '@angular/core';
import { User } from 'src/app/auth/user.model';
import { BehaviorSubject, Observable, map, switchMap, take, tap } from 'rxjs';
import { ShoppingList } from '../interfaces/shopping-list.interface';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { SHOPPING_LIST_ADD_NEW, SHOPPING_LIST_CHECKED_STATUS, SHOPPING_LIST_DELETE, SHOPPING_LIST_UPDATE } from 'src/app/shared/constants/urls';

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
        return (user && user.shopping_lists !== undefined) ? user.shopping_lists : [];
      })
    )
  }

  getShoppingListsSubject(): BehaviorSubject<ShoppingList[]> {
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

  updateShoppingList(shoppingList: any) {
    const user = localStorage.getItem('user');
    const userObj: User = JSON.parse(user!);
    this.http.put<ShoppingList>(SHOPPING_LIST_UPDATE(userObj.id, shoppingList!.node?.id), shoppingList).pipe(
      switchMap((response: any) => {
        const updatedShoppingList = response.shoppingList;
        return this.shoppingListSubject$.pipe(
          take(1),
          map((shoppingLists: ShoppingList[]) => {
            const updatedShoppingLists: ShoppingList[] = shoppingLists.map(list => {
              if (list.id === updatedShoppingList.id) {
                return updatedShoppingList;
              } else {
                return list;
              }
            });
            return updatedShoppingLists;
          }),
          tap(updatedShoppingLists => {
            this.shoppingListSubject$.next(updatedShoppingLists)
          })
        );
      })
    ).subscribe();
  }

  deleteRecipe(id: string) {
    const user = localStorage.getItem('user');
    const userObj: User = JSON.parse(user!);
    this.http.delete(SHOPPING_LIST_DELETE(userObj.id, id)).pipe(
      map((response: any) => {
        this.shoppingListSubject$.next(response.user.shopping_lists);
      })
    ).subscribe();
  }

  updateCompletedStatus(shoppingLists: ShoppingList[]) {
    const user = localStorage.getItem('user');
    const userObj: User = JSON.parse(user!);
    return this.http.put<ShoppingList>(SHOPPING_LIST_CHECKED_STATUS(userObj.id),
      shoppingLists).subscribe((res: any) => {
        const updatedShoppingLists = this.shoppingListSubject$.value.map((list) =>
          res.updatedShoppingLists.find((updatedList: ShoppingList) => list.id === updatedList.id) || list
        );
        this.shoppingListSubject$.next(updatedShoppingLists);
      }
      );
  }
}

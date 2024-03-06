import { Injectable } from "@angular/core";
import { Tag } from "../interfaces/tag.interface";
import { Subject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { TAGS_URL } from "../constants/urls";

@Injectable({ providedIn: 'root' })
export class TagService{
    tags$ = new Subject<Tag[]>;

    constructor(private http: HttpClient) { }
    
    getAllTags(): Observable<Tag[]>{
        return this.http.get<Tag[]>(TAGS_URL);
    }
}
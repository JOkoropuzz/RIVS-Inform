import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavMenuService {
  
  public userName: BehaviorSubject<string|null> = new BehaviorSubject(localStorage.getItem('nickNameUser'));
}

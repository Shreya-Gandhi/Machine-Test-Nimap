import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private fb: FormBuilder) { }

  // Register a new user
  registerUser(user: any): Observable<any> {
    const formGroup = this.fb.group({
      firstName: [user.firstName, [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-Z ]*$')]],
      lastName: [user.lastName, [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-Z ]*$')]],
      email: [user.email, [Validators.required, Validators.email]],
      phone: [user.phone, [Validators.required, Validators.pattern('^\\+[0-9]{1,3}-[0-9]{3,14}$')]],
      age: [user.age, [Validators.required, Validators.min(18), Validators.max(100)]],
      state: [user.state, Validators.required],
      country: [user.country, Validators.required],
      address: [user.address, Validators.required],
      tags: [user.tags, Validators.required],
      subscribeToNewsletter: [user.subscribeToNewsletter],
      photo: [user.photo]
    });

    if (formGroup.invalid) {
      return throwError('Invalid form data');
    }

    return this.http.post(this.apiUrl, user).pipe(
      tap((registeredUser) => {
        this.userSubject.next(registeredUser);
      }),
      catchError(this.handleError)
    );
  }

  // Get a user by ID
  getUser(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Update a user by ID
  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  // Get user profile
  getUserProfile(): Observable<any> {
    return this.user$.pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}

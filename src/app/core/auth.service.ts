import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, tap } from "rxjs";
import { ApiService } from "./api.service";
import { IUserClient } from "./user-client.interface";

@Injectable({ providedIn: "root" })
export class AuthService {
    private api = inject(ApiService);
    private userSubject = new BehaviorSubject<IUserClient | null>(null);
    user$ = this.userSubject.asObservable();

    get currentUser() {
        return this.userSubject.value;
    }

    login(email: string, password: string) {
        return this.api
            .post<IUserClient>("/users/login", { email, password })
            .pipe(tap((user) => this.userSubject.next(user)));
    }

    register(email: string, username: string, password: string) {
        return this.api
            .post<IUserClient>("/users/register", { email, username, password })
            .pipe(tap((user) => this.userSubject.next(user)));
    }

    logout() {
        // Optionally call a logout endpoint if you add one
        this.userSubject.next(null);
    }

    fetchCurrentUser() {
        return this.api.get<IUserClient>("/users/me").pipe(
            tap(
                (user) => this.userSubject.next(user),
                () => this.userSubject.next(null)
            )
        );
    }
}

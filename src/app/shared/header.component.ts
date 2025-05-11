import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "../core/auth.service";
import { ButtonModule } from "primeng/button";
import { MenubarModule } from "primeng/menubar";
import { AvatarModule } from "primeng/avatar";
import { MenuItem } from "primeng/api";

@Component({
    selector: "app-header",
    standalone: true,
    imports: [CommonModule, ButtonModule, MenubarModule, AvatarModule],
    template: `
        <p-menubar [model]="menuItems" [ngStyle]="{ 'border-radius': '0 0 1rem 1rem' }" class="shadow-2">
            <ng-template pTemplate="start">
                <div class="flex align-items-center gap-2 cursor-pointer" (click)="goHome()">
                    <img src="https://placehold.co/40x40?text=GG" alt="logo" [ngStyle]="{ 'border-radius': '8px' }" />
                    <span class="font-bold text-xl ml-2">GameGear</span>
                </div>
            </ng-template>
            <ng-template pTemplate="end">
                <ng-container *ngIf="auth.currentUser; else loggedOut">
                    <button
                        pButton
                        type="button"
                        label="List Item"
                        icon="pi pi-plus"
                        class="p-button-text mr-2"
                        (click)="goCreateItem()"></button>
                    <button
                        pButton
                        type="button"
                        icon="pi pi-shopping-cart"
                        class="p-button-text mr-2"
                        (click)="goCart()"></button>
                    <p-avatar
                        label="{{ auth.currentUser.username[0] | uppercase }}"
                        [ngStyle]="{ background: '#2196F3' }"
                        class="mr-2"></p-avatar>
                    <span class="mr-2">Hi, {{ auth.currentUser.username }}</span>
                    <button pButton type="button" label="Logout" class="p-button-text" (click)="logout()"></button>
                </ng-container>
                <ng-template #loggedOut>
                    <button pButton type="button" label="Login" class="p-button-text mr-2" (click)="goLogin()"></button>
                    <button
                        pButton
                        type="button"
                        label="Register"
                        class="p-button-text"
                        (click)="goRegister()"></button>
                </ng-template>
            </ng-template>
        </p-menubar>
    `,
    styles: [
        `
            :host {
                display: block;
                width: 100%;
            }
            @media (max-width: 600px) {
                .p-menubar {
                    flex-direction: column;
                    align-items: flex-start;
                }
                .p-menubar-end {
                    margin-top: 0.5rem;
                }
            }
        `,
    ],
})
export class HeaderComponent {
    auth = inject(AuthService);
    router = inject(Router);

    menuItems: MenuItem[] = [];

    constructor() {
        this.auth.user$.subscribe(() => {
            const isLoggedIn = !!this.auth.currentUser;
            this.menuItems = [
                { label: "Listing", icon: "pi pi-list", command: () => this.router.navigate(["/listing"]) },
                {
                    label: "My Items",
                    icon: "pi pi-box",
                    command: () => this.router.navigate(["/my-items"]),
                    visible: isLoggedIn,
                },
                {
                    label: "Orders",
                    icon: "pi pi-book",
                    command: () => this.router.navigate(["/orders"]),
                    visible: isLoggedIn,
                },
            ];
        });
    }

    goHome() {
        this.router.navigate(["/"]);
    }
    goCart() {
        this.router.navigate(["/cart"]);
    }
    goLogin() {
        this.router.navigate(["/login"]);
    }
    goRegister() {
        this.router.navigate(["/register"]);
    }
    goCreateItem() {
        this.router.navigate(["/create-item"]);
    }
    logout() {
        this.auth.logout();
        this.router.navigate(["/"]);
    }
}

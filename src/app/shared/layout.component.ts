import { Component } from "@angular/core";
import { HeaderComponent } from "./header.component";
import { RouterOutlet } from "@angular/router";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";

@Component({
    selector: "app-layout",
    standalone: true,
    imports: [HeaderComponent, RouterOutlet, ToastModule],
    providers: [MessageService],
    template: `
        <app-header></app-header>
        <p-toast></p-toast>
        <main class="container">
            <router-outlet></router-outlet>
        </main>
    `,
    styles: [
        `
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 2rem 1rem;
                width: 100%;
            }
        `,
    ],
})
export class LayoutComponent {}

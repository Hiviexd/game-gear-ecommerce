import { Component } from "@angular/core";
import { HeaderComponent } from "./header.component";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: "app-layout",
    standalone: true,
    imports: [HeaderComponent, RouterOutlet],
    template: `
        <app-header></app-header>
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

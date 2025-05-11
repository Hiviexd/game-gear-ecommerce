import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "./core/auth.service";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
    title = "game-gear-ecommerce";
    constructor(private auth: AuthService) {}
    ngOnInit() {
        this.auth.fetchCurrentUser().subscribe();
    }
}

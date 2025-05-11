import { Component, OnInit, inject } from "@angular/core";
import { CardModule } from "primeng/card";
import { ApiService } from "../../core/api.service";
import { IItemClient } from "../../core/item-client.interface";
import { ItemCardComponent } from "../../shared/item-card.component";
import { CartService } from "../../core/cart.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-home-page",
    standalone: true,
    imports: [CardModule, ItemCardComponent, CommonModule],
    template: `
        <p-card header="Welcome to GameGear!" class="mb-4">
            <p>Buy and sell gaming consoles, accessories, and games with ease.</p>
        </p-card>
        <h2 class="mb-3">Newest Items</h2>
        <div *ngIf="loading" class="mb-3">Loading...</div>
        <div *ngIf="error" class="mb-3 text-danger">{{ error }}</div>
        <div class="flex flex-wrap gap-3">
            <app-item-card *ngFor="let item of items" [item]="item" (addToCart)="onAddToCart($event)"></app-item-card>
        </div>
        <div *ngIf="!loading && items.length === 0" class="mt-3">No items found.</div>
    `,
})
export class HomePageComponent implements OnInit {
    private api = inject(ApiService);
    private cart = inject(CartService);
    items: IItemClient[] = [];
    loading = false;
    error = "";

    ngOnInit() {
        this.fetchNewestItems();
    }

    fetchNewestItems() {
        this.loading = true;
        this.api.get<IItemClient[]>("/items?limit=5&sort=-createdAt").subscribe({
            next: (items) => {
                this.items = items;
                this.loading = false;
            },
            error: (err) => {
                this.error = err?.error?.error || "Failed to load items.";
                this.loading = false;
            },
        });
    }

    onAddToCart(item: IItemClient) {
        this.cart.addItem(item, 1);
    }
}

import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "../../core/api.service";
import { IItemClient } from "../../core/item-client.interface";
import { CartService } from "../../core/cart.service";
import { AuthService } from "../../core/auth.service";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { InputNumberModule } from "primeng/inputnumber";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "app-item-page",
    standalone: true,
    imports: [CommonModule, FormsModule, CardModule, ButtonModule, InputNumberModule],
    template: `
        <div *ngIf="loading" class="mb-3">Loading...</div>
        <div *ngIf="error" class="mb-3 text-danger">{{ error }}</div>
        <p-card *ngIf="item" [header]="item.name" [subheader]="item.type | titlecase">
            <div class="flex flex-column flex-md-row gap-4">
                <img
                    *ngIf="item.image"
                    [src]="item.image"
                    alt="{{ item.name }}"
                    class="border-round"
                    style="object-fit:cover; width:300px; max-width:100%; height:300px;" />
                <div class="flex flex-column gap-2">
                    <div class="text-lg font-bold">{{ item.price | currency : "USD" : "symbol" }}</div>
                    <div class="text-sm text-color-secondary">Seller: {{ item.seller.username }}</div>
                    <div class="mb-2">{{ item.description }}</div>
                    <div class="mb-2">
                        <span class="text-sm text-color-secondary">Available Quantity: {{ item.maxQuantity }}</span>
                    </div>
                    <div class="flex align-items-center gap-2">
                        <label for="quantity">Quantity:</label>
                        <p-inputNumber
                            id="quantity"
                            [(ngModel)]="quantity"
                            [min]="1"
                            [max]="item.maxQuantity"
                            [showButtons]="true"></p-inputNumber>
                    </div>
                    <button
                        pButton
                        type="button"
                        label="Add to Cart"
                        icon="pi pi-shopping-cart"
                        class="mt-2"
                        [disabled]="!isLoggedIn"
                        (click)="addToCart()"></button>
                    <div *ngIf="!isLoggedIn" class="text-sm text-color-secondary mt-2">Login to add to cart</div>
                </div>
            </div>
        </p-card>
    `,
})
export class ItemPageComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private api = inject(ApiService);
    private cart = inject(CartService);
    private auth = inject(AuthService);
    item: IItemClient | null = null;
    loading = false;
    error = "";
    quantity = 1;
    get isLoggedIn() {
        return !!this.auth.currentUser;
    }

    ngOnInit() {
        this.fetchItem();
    }

    fetchItem() {
        const id = this.route.snapshot.paramMap.get("id");
        if (!id) {
            this.error = "Invalid item ID.";
            return;
        }
        this.loading = true;
        this.api.get<IItemClient>(`/items/${id}`).subscribe({
            next: (item) => {
                this.item = item;
                this.quantity = 1;
                this.loading = false;
            },
            error: (err) => {
                this.error = err?.error?.error || "Failed to load item.";
                this.loading = false;
            },
        });
    }

    addToCart() {
        if (this.item && this.isLoggedIn) {
            this.cart.addItem(this.item, this.quantity);
        }
    }
}

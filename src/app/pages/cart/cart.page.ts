import { Component, inject } from "@angular/core";
import { CartService, CartItem } from "../../core/cart.service";
import { IItemClient } from "../../core/item-client.interface";
import { ApiService } from "../../core/api.service";
import { AuthService } from "../../core/auth.service";
import { CartItemCardComponent } from "../../shared/cart-item-card.component";
import { InputNumberModule } from "primeng/inputnumber";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MessageService } from "primeng/api";

@Component({
    selector: "app-cart-page",
    standalone: true,
    imports: [CommonModule, FormsModule, CardModule, ButtonModule, InputNumberModule, CartItemCardComponent],
    template: `
        <h2>Cart</h2>
        <div *ngIf="cart.length === 0" class="mb-3">Your cart is empty.</div>
        <div *ngIf="cart.length > 0">
            <div class="flex flex-wrap gap-3 mb-4">
                <div *ngFor="let cartItem of cart" class="relative">
                    <app-cart-item-card
                        [item]="cartItem.item"
                        [quantity]="cartItem.quantity"
                        (remove)="removeItem($event)"></app-cart-item-card>
                    <div class="flex align-items-center gap-2 mt-2">
                        <label for="qty-{{ cartItem.item._id }}">Qty:</label>
                        <p-inputNumber
                            id="qty-{{ cartItem.item._id }}"
                            [(ngModel)]="cartItem.quantity"
                            [min]="1"
                            [max]="cartItem.item.maxQuantity"
                            (ngModelChange)="updateQuantity(cartItem)"
                            [ngStyle]="{ width: '80px' }"></p-inputNumber>
                    </div>
                </div>
            </div>
            <div class="text-right text-lg font-bold mb-3">Total: {{ total | currency : "USD" : "symbol" }}</div>
            <button
                pButton
                type="button"
                label="Checkout"
                icon="pi pi-credit-card"
                class="w-full"
                [disabled]="loading || cart.length === 0"
                (click)="checkout()"></button>
            <div *ngIf="error" class="text-danger mt-2">{{ error }}</div>
            <div *ngIf="success" class="text-success mt-2">Order placed successfully!</div>
        </div>
    `,
})
export class CartPageComponent {
    private cartService = inject(CartService);
    private api = inject(ApiService);
    private auth = inject(AuthService);
    private messageService = inject(MessageService);
    cart: CartItem[] = [];
    loading = false;
    error = "";
    success = false;

    get total() {
        return this.cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
    }

    ngOnInit() {
        this.cartService.cart$.subscribe((cart) => (this.cart = cart));
    }

    updateQuantity(cartItem: CartItem) {
        this.cartService.updateQuantity(cartItem.item._id, cartItem.quantity);
        this.messageService.add({ severity: "info", summary: "Quantity Updated", detail: "Item quantity updated." });
    }

    removeItem(itemId: string) {
        this.cartService.removeItem(itemId);
        this.messageService.add({ severity: "info", summary: "Removed", detail: "Item removed from cart." });
    }

    checkout() {
        if (this.cart.length === 0) return;
        this.loading = true;
        this.error = "";
        this.success = false;
        const items = this.cart.map((ci) => ({ item: ci.item._id, quantity: ci.quantity }));
        this.api.post("/orders/checkout", { items }).subscribe({
            next: () => {
                this.cartService.clearCart();
                this.success = true;
                this.loading = false;
                this.messageService.add({
                    severity: "success",
                    summary: "Order Placed",
                    detail: "Your order was placed successfully!",
                });
            },
            error: (err) => {
                this.error = err?.error?.error || "Checkout failed.";
                this.loading = false;
            },
        });
    }
}

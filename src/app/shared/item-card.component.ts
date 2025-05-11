import { Component, Input, Output, EventEmitter, inject } from "@angular/core";
import { IItemClient } from "../core/item-client.interface";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

@Component({
    selector: "app-item-card",
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule],
    template: `
        <div class="card-clickable" (click)="goToDetails()">
            <p-card class="custom-item-card">
                <img *ngIf="item.image" [src]="item.image" alt="{{ item.name }}" class="item-image" />
                <div class="item-title">{{ item.name }}</div>
                <div class="item-price">{{ item.price | currency : "USD" : "symbol" }}</div>
                <div class="item-row">
                    <span class="item-seller">Seller: {{ item.seller.username }}</span>
                </div>
                <div class="item-row">
                    <span class="item-qty" *ngIf="item.maxQuantity">Qty: {{ item.maxQuantity }}</span>
                </div>

                <button
                    pButton
                    type="button"
                    label="Add to Cart"
                    icon="pi pi-shopping-cart"
                    class="add-to-cart-btn"
                    (click)="onAddToCart($event)"></button>
            </p-card>
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
            }
            .card-clickable {
                cursor: pointer;
            }
            .custom-item-card {
                background: #f5f6fa !important;
                border-radius: 12px;
                padding: 1rem;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 280px;
                min-width: 0;
                max-width: 100%;
            }
            .item-image {
                width: 100%;
                height: 180px;
                object-fit: cover;
                border-radius: 8px;
                margin-bottom: 1rem;
            }
            .item-title {
                font-size: 1.2rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
                text-align: center;
            }
            .item-price {
                font-size: 1.1rem;
                font-weight: 500;
                color: #2196f3;
                margin-bottom: 0.5rem;
                text-align: center;
            }
            .item-row {
                display: flex;
                justify-content: space-between;
                width: 100%;
                font-size: 0.95rem;
                color: #555;
                margin-bottom: 0.75rem;
            }
            .item-seller {
                font-style: italic;
            }
            .item-qty {
                font-weight: 500;
            }
            .add-to-cart-btn {
                width: auto;
                font-size: 0.9rem;
                padding: 0.25rem 1rem;
                align-self: flex-end;
            }
            @media (max-width: 320px) {
                .custom-item-card {
                    width: 100% !important;
                }
            }
        `,
    ],
})
export class ItemCardComponent {
    @Input() item!: IItemClient;
    @Output() addToCart = new EventEmitter<IItemClient>();
    private router = inject(Router);

    goToDetails() {
        this.router.navigate(["/item", this.item._id]);
    }

    onAddToCart(event: Event) {
        event.stopPropagation();
        this.addToCart.emit(this.item);
    }
}

import { Component, Input, inject, EventEmitter, Output } from "@angular/core";
import { IItemClient } from "../core/item-client.interface";
import { CardModule } from "primeng/card";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";

@Component({
    selector: "app-cart-item-card",
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule],
    template: `
        <div class="cart-item-root">
            <img *ngIf="item.image" [src]="item.image" alt="{{ item.name }}" class="cart-item-image" />
            <div class="cart-item-details">
                <div class="cart-item-title">{{ item.name }}</div>
                <div class="cart-item-meta">
                    <span class="cart-item-price">{{ item.price | currency : "USD" : "symbol" }}</span>
                    <span class="cart-item-seller">Seller: {{ item.seller.username }}</span>
                </div>
                <div class="cart-item-actions">
                    <p-button
                        icon="pi pi-trash"
                        severity="danger"
                        size="small"
                        (click)="remove.emit(item._id)"></p-button>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
            }
            .cart-item-root {
                display: flex;
                align-items: center;
                background: #fff;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 0.75rem 1rem;
                margin-bottom: 0.5rem;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
            }
            .cart-item-image {
                width: 72px;
                height: 72px;
                object-fit: cover;
                border-radius: 6px;
                margin-right: 1rem;
                background: #f5f6fa;
            }
            .cart-item-details {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            .cart-item-title {
                font-size: 1.05rem;
                font-weight: 600;
                margin-bottom: 0.1rem;
            }
            .cart-item-meta {
                font-size: 0.95rem;
                color: #888;
                display: flex;
                gap: 1.5rem;
                margin-bottom: 0.2rem;
            }
            .cart-item-price {
                color: #2196f3;
                font-weight: 500;
            }
            .cart-item-actions {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-top: 0.2rem;
            }
            .cart-item-qty {
                font-size: 0.98rem;
                color: #333;
            }
        `,
    ],
})
export class CartItemCardComponent {
    @Input() item!: IItemClient;
    @Input() quantity!: number;
    @Output() remove = new EventEmitter<string>();
}

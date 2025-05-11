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
            <p-card [header]="item.name" [subheader]="item.type | titlecase" class="w-18rem" [style]="{'background-color': item.status === 'sold' ? 'red' : '#f2f2f2'}">
                <img
                    *ngIf="item.image"
                    [src]="item.image"
                    alt="{{ item.name }}"
                    class="w-full mb-2 border-round"
                    style="object-fit:cover; height:180px;" />
                <div class="mb-2 text-lg font-bold">{{ item.price | currency : "USD" : "symbol" }}</div>
                <div class="mb-2 text-sm text-color-secondary">Seller: {{ item.seller.username }}</div>
                <ng-content></ng-content>
                <button
                    pButton
                    type="button"
                    label="Add to Cart"
                    icon="pi pi-shopping-cart"
                    class="w-full mt-2"
                    (click)="onAddToCart($event)"></button>
            </p-card>
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
            }
            .w-18rem {
                width: 18rem;
            }
            .card-clickable {
                cursor: pointer;
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

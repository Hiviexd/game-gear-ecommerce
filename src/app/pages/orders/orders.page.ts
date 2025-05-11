import { Component, OnInit, inject } from "@angular/core";
import { ApiService } from "../../core/api.service";
import { IOrderClient } from "../../core/order-client.interface";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-orders-page",
    standalone: true,
    imports: [CommonModule, CardModule, ButtonModule],
    template: `
        <h2>My Orders</h2>
        <div *ngIf="loading" class="mb-3">Loading...</div>
        <div *ngIf="error" class="mb-3 text-danger">{{ error }}</div>
        <div *ngIf="orders.length === 0 && !loading">No orders found.</div>
        <div *ngFor="let order of orders; let i = index" class="mb-4">
            <p-card [header]="'Order #' + (i + 1)" [subheader]="getCreatedAt(order)">
                <button
                    pButton
                    type="button"
                    label="{{ expanded[i] ? 'Hide Details' : 'Show Details' }}"
                    class="mb-3"
                    (click)="toggle(i)"></button>
                <div *ngIf="expanded[i]">
                    <div *ngFor="let oi of order.items" class="mb-2 border-bottom-1 surface-border pb-2">
                        <div class="flex justify-content-between align-items-center">
                            <div>
                                <span class="font-bold">{{ oi.item.name }}</span> ({{ oi.item.type | titlecase }})
                                <span class="ml-2">x{{ oi.quantity }}</span>
                            </div>
                            <div>{{ oi.item.price | currency : "USD" : "symbol" }}</div>
                        </div>
                    </div>
                    <div class="text-right font-bold mt-3">
                        Total: {{ order.totalPrice | currency : "USD" : "symbol" }}
                    </div>
                </div>
            </p-card>
        </div>
    `,
})
export class OrdersPageComponent implements OnInit {
    private api = inject(ApiService);
    orders: IOrderClient[] = [];
    loading = false;
    error = "";
    expanded: boolean[] = [];

    ngOnInit() {
        this.fetchOrders();
    }

    fetchOrders() {
        this.loading = true;
        this.api.get<IOrderClient[]>("/orders").subscribe({
            next: (orders) => {
                this.orders = orders;
                this.expanded = orders.map(() => false);
                this.loading = false;
            },
            error: (err) => {
                this.error = err?.error?.error || "Failed to load orders.";
                this.loading = false;
            },
        });
    }

    toggle(i: number) {
        this.expanded[i] = !this.expanded[i];
    }

    getCreatedAt(order: IOrderClient): string | undefined {
        return order.createdAt ?? undefined;
    }
}

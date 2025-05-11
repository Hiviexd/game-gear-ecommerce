import { Component, OnInit, inject } from "@angular/core";
import { ApiService } from "../../core/api.service";
import { IItemClient } from "../../core/item-client.interface";
import { ItemCardComponent } from "../../shared/item-card.component";
import { CardModule } from "primeng/card";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-my-items-page",
    standalone: true,
    imports: [CommonModule, CardModule, ItemCardComponent],
    template: `
        <h2>My Items</h2>
        <div *ngIf="loading" class="mb-3">Loading...</div>
        <div *ngIf="error" class="mb-3 text-danger">{{ error }}</div>
        <div class="flex flex-wrap gap-3">
            <app-item-card *ngFor="let item of items" [item]="item"></app-item-card>
        </div>
        <div *ngIf="!loading && items.length === 0" class="mt-3">You have not listed any items yet.</div>
    `,
})
export class MyItemsPageComponent implements OnInit {
    private api = inject(ApiService);
    items: IItemClient[] = [];
    loading = false;
    error = "";

    ngOnInit() {
        this.fetchMyItems();
    }

    fetchMyItems() {
        this.loading = true;
        this.api.get<IItemClient[]>("/items/mine").subscribe({
            next: (items) => {
                this.items = items;
                this.loading = false;
            },
            error: (err) => {
                this.error = err?.error?.error || "Failed to load your items.";
                this.loading = false;
            },
        });
    }
}

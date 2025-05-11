import { Component, OnInit, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { ApiService } from "../../core/api.service";
import { IItemClient } from "../../core/item-client.interface";
import { ItemCardComponent } from "../../shared/item-card.component";
import { CartService } from "../../core/cart.service";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-listing-page",
    standalone: true,
    imports: [
        ReactiveFormsModule,
        InputTextModule,
        InputNumberModule,
        DropdownModule,
        ButtonModule,
        CardModule,
        ItemCardComponent,
        CommonModule,
    ],
    template: `
        <p-card header="Search & Filter Items" class="mb-4">
            <form [formGroup]="form" (ngSubmit)="onSearch()" class="flex flex-wrap gap-3 align-items-end">
                <span class="p-float-label">
                    <input pInputText id="name" formControlName="name" />
                    <label for="name">Name</label>
                </span>
                <span class="p-float-label">
                    <p-dropdown
                        id="type"
                        formControlName="type"
                        [options]="typeOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Type"></p-dropdown>
                    <label for="type">Type</label>
                </span>
                <span class="p-float-label">
                    <input pInputNumber id="minPrice" formControlName="minPrice" mode="currency" currency="USD" />
                    <label for="minPrice">Min Price</label>
                </span>
                <span class="p-float-label">
                    <input pInputNumber id="maxPrice" formControlName="maxPrice" mode="currency" currency="USD" />
                    <label for="maxPrice">Max Price</label>
                </span>
                <button pButton type="submit" label="Search"></button>
            </form>
        </p-card>
        <div *ngIf="loading" class="mb-3">Loading...</div>
        <div *ngIf="error" class="mb-3 text-danger">{{ error }}</div>
        <div class="flex flex-wrap gap-3">
            <app-item-card *ngFor="let item of items" [item]="item" (addToCart)="onAddToCart(item)"></app-item-card>
        </div>
        <div *ngIf="!loading && items.length === 0" class="mt-3">No items found.</div>
    `,
})
export class ListingPageComponent implements OnInit {
    private api = inject(ApiService);
    private cart = inject(CartService);
    private fb = inject(FormBuilder);
    form = this.fb.group({
        name: [""],
        type: [""],
        minPrice: [null],
        maxPrice: [null],
    });
    items: IItemClient[] = [];
    loading = false;
    error = "";
    typeOptions = [
        { label: "All", value: "" },
        { label: "Game", value: "game" },
        { label: "Console", value: "console" },
        { label: "Accessory", value: "accessory" },
    ];

    ngOnInit() {
        this.onSearch();
    }

    onSearch() {
        this.loading = true;
        this.error = "";
        const { name, type, minPrice, maxPrice } = this.form.value;
        const params = [];
        if (name) params.push(`name=${encodeURIComponent(name)}`);
        if (type) params.push(`type=${encodeURIComponent(type)}`);
        if (minPrice != null) params.push(`minPrice=${minPrice}`);
        if (maxPrice != null) params.push(`maxPrice=${maxPrice}`);
        const query = params.length ? "?" + params.join("&") : "";
        this.api.get<IItemClient[]>(`/items${query}`).subscribe({
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

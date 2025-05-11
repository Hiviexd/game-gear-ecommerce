import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ApiService } from "../../core/api.service";
import { Router } from "@angular/router";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-create-item-page",
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CardModule,
        InputTextModule,
        InputNumberModule,
        DropdownModule,
        ButtonModule,
    ],
    template: `
        <p-card header="List a New Item">
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-column gap-3">
                <span class="p-float-label">
                    <input pInputText id="name" formControlName="name" />
                    <label for="name">Name</label>
                </span>
                <span class="p-float-label">
                    <input pInputText id="description" formControlName="description" />
                    <label for="description">Description</label>
                </span>
                <span class="p-float-label">
                    <input pInputText id="image" formControlName="image" />
                    <label for="image">Image URL</label>
                </span>
                <span class="p-float-label">
                    <input pInputNumber id="price" formControlName="price" mode="currency" currency="USD" />
                    <label for="price">Price</label>
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
                    <input pInputNumber id="maxQuantity" formControlName="maxQuantity" [min]="1" />
                    <label for="maxQuantity">Max Quantity</label>
                </span>
                <button pButton type="submit" label="Create Item" [disabled]="form.invalid || loading"></button>
                <div *ngIf="error" class="text-danger mt-2">{{ error }}</div>
            </form>
        </p-card>
    `,
})
export class CreateItemPageComponent {
    private fb = inject(FormBuilder);
    private api = inject(ApiService);
    private router = inject(Router);
    form = this.fb.group({
        name: ["", Validators.required],
        description: ["", Validators.required],
        image: [""],
        price: [null, [Validators.required, Validators.min(0)]],
        type: ["", Validators.required],
        maxQuantity: [1, [Validators.required, Validators.min(1)]],
    });
    loading = false;
    error = "";
    typeOptions = [
        { label: "Game", value: "game" },
        { label: "Console", value: "console" },
        { label: "Accessory", value: "accessory" },
    ];

    onSubmit() {
        if (this.form.invalid) return;
        this.loading = true;
        this.error = "";
        this.api.post("/items", this.form.value).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(["/my-items"]);
            },
            error: (err) => {
                this.error = err?.error?.error || "Failed to create item.";
                this.loading = false;
            },
        });
    }
}

import { Component, inject } from "@angular/core";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../core/auth.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-register-page",
    standalone: true,
    imports: [CardModule, InputTextModule, PasswordModule, ButtonModule, ReactiveFormsModule, CommonModule],
    template: `
        <p-card header="Register">
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-column gap-3">
                <span class="p-float-label">
                    <input pInputText id="email" formControlName="email" type="email" />
                    <label for="email">Email</label>
                </span>
                <span class="p-float-label">
                    <input pInputText id="username" formControlName="username" />
                    <label for="username">Username</label>
                </span>
                <span class="p-float-label">
                    <input pPassword id="password" formControlName="password" toggleMask="true" />
                    <label for="password">Password</label>
                </span>
                <button pButton type="submit" label="Register" [disabled]="form.invalid || loading"></button>
                <div *ngIf="error" class="text-danger mt-2">{{ error }}</div>
            </form>
        </p-card>
    `,
})
export class RegisterPageComponent {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private router = inject(Router);
    form = this.fb.group({
        email: ["", [Validators.required, Validators.email]],
        username: ["", [Validators.required, Validators.minLength(3)]],
        password: ["", [Validators.required, Validators.minLength(6)]],
    });
    loading = false;
    error = "";

    onSubmit() {
        if (this.form.invalid) return;
        this.loading = true;
        this.error = "";
        const { email, username, password } = this.form.value;
        this.auth.register(email!, username!, password!).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(["/"]);
            },
            error: (err) => {
                this.error = err?.error?.error || "Registration failed.";
                this.loading = false;
            },
        });
    }
}

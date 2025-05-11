import { Component, inject } from "@angular/core";
import { CardModule } from "primeng/card";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../core/auth.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MessageService } from "primeng/api";

@Component({
    selector: "app-login-page",
    standalone: true,
    imports: [CardModule, InputTextModule, PasswordModule, ButtonModule, ReactiveFormsModule, CommonModule],
    template: `
        <p-card header="Login">
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-column gap-3">
                <span class="flex flex-column gap-2 w-fit">
                    <label for="email">Email</label>
                    <input pInputText id="email" formControlName="email" type="email" />
                </span>
                <span class="flex flex-column gap-2">
                    <label for="password">Password</label>
                    <p-password id="password" formControlName="password" toggleMask="true" />
                </span>
                <button pButton type="submit" label="Login" [disabled]="form.invalid || loading"></button>
            </form>
        </p-card>
    `,
})
export class LoginPageComponent {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    form = this.fb.group({
        email: ["", [Validators.required, Validators.email]],
        password: ["", Validators.required],
    });
    loading = false;
    error = "";

    onSubmit() {
        if (this.form.invalid) return;
        this.loading = true;
        this.error = "";
        const { email, password } = this.form.value;
        this.auth.login(email!, password!).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(["/"]);
            },
            error: (err) => {
                this.error = err?.error?.error || "Login failed.";
                this.loading = false;
                this.messageService.add({ severity: "error", summary: "Login Failed", detail: this.error });
            },
        });
    }
}

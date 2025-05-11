import { Routes } from "@angular/router";
import { LayoutComponent } from "./shared/layout.component";
import { authGuard } from "./core/auth.guard";

export const routes: Routes = [
    {
        path: "",
        component: LayoutComponent,
        children: [
            { path: "", loadComponent: () => import("./pages/home/home.page").then((m) => m.HomePageComponent) },
            {
                path: "login",
                loadComponent: () => import("./pages/login/login.page").then((m) => m.LoginPageComponent),
            },
            {
                path: "register",
                loadComponent: () => import("./pages/register/register.page").then((m) => m.RegisterPageComponent),
            },
            {
                path: "listing",
                loadComponent: () => import("./pages/listing/listing.page").then((m) => m.ListingPageComponent),
            },
            {
                path: "item/:id",
                loadComponent: () => import("./pages/item/item.page").then((m) => m.ItemPageComponent),
            },
            {
                path: "cart",
                loadComponent: () => import("./pages/cart/cart.page").then((m) => m.CartPageComponent),
                canActivate: [authGuard],
            },
            {
                path: "orders",
                loadComponent: () => import("./pages/orders/orders.page").then((m) => m.OrdersPageComponent),
                canActivate: [authGuard],
            },
            {
                path: "my-items",
                loadComponent: () => import("./pages/my-items/my-items.page").then((m) => m.MyItemsPageComponent),
                canActivate: [authGuard],
            },
            {
                path: "create-item",
                loadComponent: () =>
                    import("./pages/create-item/create-item.page").then((m) => m.CreateItemPageComponent),
                canActivate: [authGuard],
            },
        ],
    },
    { path: "**", redirectTo: "" },
];

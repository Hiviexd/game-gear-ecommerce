import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface CartItem {
    item: any; // Should be IItem, but use any for now
    quantity: number;
}

@Injectable({ providedIn: "root" })
export class CartService {
    private storageKey = "cart";
    private cartSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
    cart$ = this.cartSubject.asObservable();

    private loadCart(): CartItem[] {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    private saveCart(cart: CartItem[]) {
        localStorage.setItem(this.storageKey, JSON.stringify(cart));
        this.cartSubject.next(cart);
    }

    getCart() {
        return this.cartSubject.value;
    }

    addItem(item: any, quantity: number = 1) {
        const cart = this.getCart();
        const idx = cart.findIndex((ci) => ci.item._id === item._id);
        if (idx > -1) {
            cart[idx].quantity = Math.min(cart[idx].quantity + quantity, item.maxQuantity);
        } else {
            cart.push({ item, quantity: Math.min(quantity, item.maxQuantity) });
        }
        this.saveCart(cart);
    }

    updateQuantity(itemId: string, quantity: number) {
        const cart = this.getCart();
        const idx = cart.findIndex((ci) => ci.item._id === itemId);
        if (idx > -1) {
            cart[idx].quantity = Math.max(1, Math.min(quantity, cart[idx].item.maxQuantity));
            this.saveCart(cart);
        }
    }

    removeItem(itemId: string) {
        const cart = this.getCart().filter((ci) => ci.item._id !== itemId);
        this.saveCart(cart);
    }

    clearCart() {
        this.saveCart([]);
    }
}

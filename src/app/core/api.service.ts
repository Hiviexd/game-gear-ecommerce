import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class ApiService {
    private http = inject(HttpClient);
    private baseUrl = "http://localhost:3000/api";

    get<T>(url: string) {
        return this.http.get<T>(this.baseUrl + url, { withCredentials: true });
    }

    post<T>(url: string, body: any) {
        return this.http.post<T>(this.baseUrl + url, body, { withCredentials: true });
    }

    put<T>(url: string, body: any) {
        return this.http.put<T>(this.baseUrl + url, body, { withCredentials: true });
    }

    delete<T>(url: string) {
        return this.http.delete<T>(this.baseUrl + url, { withCredentials: true });
    }
}

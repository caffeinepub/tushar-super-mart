import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface DeliveryDetails {
    city: string;
    postalCode: string;
    name: string;
    email: string;
    preferredDeliveryTime?: string;
    address: string;
    phone: string;
    deliveryInstructions?: string;
}
export type Time = bigint;
export interface Customer {
    id: string;
    contact: DeliveryDetails;
    orders: Array<Order>;
}
export interface Offer {
    id: string;
    title: string;
    endDate: Time;
    banner?: ExternalBlob;
    description: string;
    isActive: boolean;
    startDate: Time;
}
export interface Order {
    id: string;
    status: OrderStatus;
    total: bigint;
    deliveryDetails: DeliveryDetails;
    customer?: Principal;
    deliveryTime: Time;
    orderTime: Time;
    products: Array<Product>;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export interface Product {
    id: string;
    name: string;
    description: string;
    available: boolean;
    quantity: bigint;
    image?: ExternalBlob;
    price: bigint;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    activateOffer(id: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createOffer(title: string, description: string, banner: ExternalBlob | null, startDate: Time, endDate: Time, isActive: boolean): Promise<string>;
    createProduct(name: string, description: string, price: bigint, quantity: bigint, available: boolean, image: ExternalBlob | null): Promise<string>;
    deactivateOffer(id: string): Promise<void>;
    deleteOffer(id: string): Promise<void>;
    deleteProduct(id: string): Promise<void>;
    getActiveOffers(): Promise<Array<Offer>>;
    getAllCustomers(): Promise<Array<Customer>>;
    getAllOffers(): Promise<Array<Offer>>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomer(id: string): Promise<Customer | null>;
    getMyOrders(): Promise<Array<Order>>;
    getOrder(id: string): Promise<Order>;
    getProduct(id: string): Promise<Product>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    init(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(customer: Principal | null, customerInfo: DeliveryDetails, orderProducts: Array<Product>): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(term: string): Promise<Array<Product>>;
    updateOffer(id: string, title: string, description: string, banner: ExternalBlob | null, startDate: Time, endDate: Time, isActive: boolean): Promise<void>;
    updateOrderStatus(id: string, status: OrderStatus): Promise<void>;
    updateProduct(id: string, name: string, description: string, price: bigint, quantity: bigint, available: boolean, image: ExternalBlob | null): Promise<void>;
}

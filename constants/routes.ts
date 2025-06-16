import { StaffRole } from "@/types/staff";

type RouteConfig = {
  path: string;
  allowedRoles: StaffRole[];
}

export const ROUTE_PERMISSIONS: RouteConfig[] = [
  { path: "/dashboard/sales", allowedRoles: ["admin"] },
  { path: "/dashboard/manage-menu", allowedRoles: ["admin"] },
  { path: "/dashboard/menu-categories", allowedRoles: ["admin"] },
  { path: "/dashboard/manage-staff", allowedRoles: ["admin"] },
  { path: "/dashboard/cashier", allowedRoles: ["cashier"] },
  { path: "/dashboard/kitchen", allowedRoles: ["kitchen"] },
];

export const DEFAULT_ROUTES: Record<StaffRole, string> = {
  admin: "/dashboard/sales",
  cashier: "/dashboard/cashier",
  kitchen: "/dashboard/kitchen",
};
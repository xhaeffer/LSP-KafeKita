import {
  IconDashboard,
  IconListDetails,
  IconUsers,
  IconToolsKitchen2,
  IconReceipt2
} from "@tabler/icons-react"

export const NAVIGATION_BY_ROLE = {
  admin: [
    {
      title: "Sales",
      url: "/dashboard/sales",
      icon: IconReceipt2,
    },
    {
      title: "Manage Menu",
      url: "/dashboard/manage-menu",
      icon: IconToolsKitchen2,
    },
    {
      title: "Manage Menu Categories",
      url: "/dashboard/manage-menu-categories",
      icon: IconListDetails,
    },
    {
      title: "Manage Staff",
      url: "/dashboard/manage-staff",
      icon: IconUsers,
    },
  ],
  cashier: [
    {
      title: "Cashier Dashboard",
      url: "/dashboard/cashier",
      icon: IconDashboard,
    }
  ],
  kitchen: [
    {
      title: "Kitchen Dashboard",
      url: "/dashboard/kitchen",
      icon: IconDashboard,
    }
  ]
}
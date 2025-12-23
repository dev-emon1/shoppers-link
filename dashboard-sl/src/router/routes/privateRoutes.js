import { adminRoutes } from "./adminRoutes";
import { vendorRoutes } from "./vendorRoutes";

export const privateRoutes = [...adminRoutes, ...vendorRoutes];

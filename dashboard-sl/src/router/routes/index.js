import { createElement } from "react";
import { privateRoutes } from "./privateRoutes";
import RootLayout from "../../layouts/RootLayout";
import ProtectedRoute from "../ProtectedRoute";

// export const getRoutes = () => {
//   return {
//     path: "/",
//     // element: createElement(RootLayout),
//     element: createElement(ProtectedRoute, {
//       element: createElement(RootLayout),
//     }),
//     children: privateRoutes,
//   };
// };

export const getRoutes = () => {
  return [
    {
      path: "/",
      element: createElement(RootLayout),
      children: privateRoutes,
    },
  ];
};

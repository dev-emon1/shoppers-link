import { createElement, lazy } from "react";
const Login = lazy(() => import("../../views/auth/Login"));
const Register = lazy(() => import("../../views/auth/Register"));

const publicRoutes = [
  {
    path: "/login",
    element: createElement(Login),
  },
  {
    path: "/register",
    element: createElement(Register),
  },
];

export default publicRoutes;

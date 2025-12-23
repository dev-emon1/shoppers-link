import { useRoutes, Navigate } from "react-router-dom";

const Router = ({ allRoutes }) => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Navigate to="/login" replace />,
    },
    ...allRoutes,
  ]);

  return routes;
};

export default Router;

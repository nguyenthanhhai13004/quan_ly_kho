import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "../constants/routes";
import { Fragment } from "react/jsx-runtime";
import NotFoundPage from "../pages/not-found-page";
import ProtectedRoute from "./protected-route";
import UnProtectedRoute from "./un-protected-route";
import CustomWrapperPermissions from "../components/common/custom-wrapper-permissions";
import AccessDeniedView from "../views/access-denied";
export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {publicRoutes.map((route) => {
          const Layout = route.layout || Fragment;
          const Element = route.element;
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <UnProtectedRoute>
                  <Layout>
                    <Element />
                  </Layout>
                </UnProtectedRoute>
              }
            />
          );
        })}

        {privateRoutes.map((route) => {
          const Layout = route.layout || Fragment;
          const Element = route.element;
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute>
                  <Layout>
                    <CustomWrapperPermissions
                      permissionsRequired={route.permissions || []}
                      uiDeny={<AccessDeniedView />}
                    >
                      <Element />
                    </CustomWrapperPermissions>
                  </Layout>
                </ProtectedRoute>
              }
            />
          );
        })}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

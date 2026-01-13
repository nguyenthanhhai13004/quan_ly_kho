import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "../constants/routes";
import { Fragment } from "react/jsx-runtime";
import NotFoundPage from "../pages/not-found-page";
import ProtectedRoute from "./protected-route";
import UnProtectedRoute from "./un-protected-route";
import CustomWrapperPermissions from "../components/common/custom-wrapper-permissions";
import AccessDeniedView from "../views/access-denied";
import ModalProvider from "../providers/modal-provider";
import { useSEO } from "../hooks/use-seo";
import ResponsiveGuard from "../views/responsive-guard";
export default function AppRouter() {
  const renderWithSEO = (
    Element: React.ComponentType,
    seo?: { title?: string; description?: string },
  ) => {
    return () => {
      useSEO({
        title: seo?.title,
      });
      return <Element />;
    };
  };
  return (
    <Router>
      <ModalProvider>
        <Routes>
          {publicRoutes.map((route) => {
            const Layout = route.layout || Fragment;
            const Element = renderWithSEO(route.element, route.seo);
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
            let Element = renderWithSEO(route.element, route.seo);
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
                        <ResponsiveGuard />
                      </CustomWrapperPermissions>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            );
          })}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ModalProvider>
    </Router>
  );
}

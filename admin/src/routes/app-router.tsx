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
function SEORoute({
  Element,
  seo,
}: {
  Element: React.ComponentType;
  seo?: { title?: string; description?: string };
}) {
  useSEO({
    title: seo?.title,
  });
  return <Element />;
}

export default function AppRouter() {
  return (
    <Router>
      <ModalProvider>
        <Routes>
          {publicRoutes.map((route) => {
            const Layout = route.layout || Fragment;
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <UnProtectedRoute>
                    <Layout>
                      <SEORoute Element={route.element} seo={route.seo} />
                    </Layout>
                  </UnProtectedRoute>
                }
              />
            );
          })}

          {privateRoutes.map((route) => {
            const Layout = route.layout || Fragment;
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
                        <SEORoute Element={route.element} seo={route.seo} />
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

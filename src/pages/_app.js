import { useEffect } from "react";
import { useRouter } from "next/router";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "../redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

function AuthGuard({ children }) {
  const router = useRouter();
  const authToken = useSelector((state) => state.auth?.authToken);
  const isAuthenticated = !!authToken; // Converts truthy/falsy value into boolean

  useEffect(() => {
    const protectedRoutes = ["/admin"]; // Add all protected routes here
    const isProtectedRoute = protectedRoutes.includes(router.pathname);

    if (!isAuthenticated && isProtectedRoute) {
      router.push(`/login?redirect=${router.pathname}`); // Redirect to login with return URL
    }
  }, [isAuthenticated, router]);

  return children;
}

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthGuard>
          <Component {...pageProps} />
          <ToastContainer position="top-right" autoClose={3000} />
        </AuthGuard>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;

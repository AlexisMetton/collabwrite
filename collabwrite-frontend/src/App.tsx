import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import DocumentEditorPage from "./pages/DocumentEditorPage";
import EditorPage from "./pages/EditorPage";

// Layout pour les pages sans header/footer (login, register)
function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Layout pour les pages avec header/footer
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Pages avec Header et Footer */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <MainLayout>
                  <HomePage />
                </MainLayout>
              </PublicRoute>
            }
          />

          {/* Pages sans Header/Footer (auth) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <AuthLayout>
                  <LoginPage />
                </AuthLayout>
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <AuthLayout>
                  <RegisterPage />
                </AuthLayout>
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/:pageId"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <EditorPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/document/:documentId"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DocumentEditorPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

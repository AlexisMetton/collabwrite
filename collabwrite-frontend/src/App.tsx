import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Layouts & Components
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { AdminRoute } from "./components/AdminRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";

// Pages
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminDashboard } from "./pages/AdminDashboard";
import DocumentEditorPage from "./pages/DocumentEditorPage";
import EditorPage from "./pages/EditorPage";
import FileViewerPage from "./pages/FileViewerPage";
import { MyDocumentsPage } from "./pages/MyDocumentsPage";
import { MyFoldersPage } from "./pages/MyFoldersPage";

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
            path="/my-documents"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MyDocumentsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-folders"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MyFoldersPage />
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
            path="/viewer/:fileId"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <FileViewerPage />
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
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <MainLayout>
                  <AdminDashboard />
                </MainLayout>
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

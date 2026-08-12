import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdDetailPage from './pages/AdDetailPage';
import PostAdPage from './pages/PostAdPage';
import MyAdsPage from './pages/MyAdsPage';
import FavouritesPage from './pages/FavouritesPage';
import SearchPage from './pages/SearchPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EditAdPage from './pages/EditAdPage';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminUsers from './admin/pages/AdminUsers';
import AdminAds from './admin/pages/AdminAds';
import AdminCategories from './admin/pages/AdminCategories';
import AdminPayments from './admin/pages/AdminPayments';

function MainLayout() {
  return (
    <div className="min-h-screen bg-sellora-bg flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/"               element={<HomePage />} />
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/register"       element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/ads/:id"        element={<AdDetailPage />} />
          <Route path="/search"         element={<SearchPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/post-ad"      element={<PostAdPage />} />
            <Route path="/my-ads"       element={<MyAdsPage />} />
            <Route path="/edit-ad/:id"  element={<EditAdPage />} />
            <Route path="/favourites"   element={<FavouritesPage />} />
            <Route path="/messages"     element={<MessagesPage />} />
            <Route path="/profile"      element={<ProfilePage />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* Admin panel — own layout, no Navbar/Footer */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index                  element={<AdminDashboard />} />
          <Route path="users"           element={<AdminUsers />} />
          <Route path="ads"             element={<AdminAds />} />
          <Route path="categories"      element={<AdminCategories />} />
          <Route path="payments"        element={<AdminPayments />} />
        </Route>

        {/* Main site */}
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </>
  );
}

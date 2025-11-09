import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import all pages
import HomePage from './pages/HomePage';
import ItemsListPage from './pages/ItemsListPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import UserDashboard from './pages/UserDashboard';
import NgoDashboard from './pages/NgoDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateItemPage from './pages/CreateItemPage';
import ChatPage from "./pages/ChatPage";
import AdminRequestsPage from './pages/AdminRequestsPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import EditItemPage from './pages/EditItemPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminNgosPage from './pages/AdminNgosPage';
import AdminNgoVerificationPage from './pages/AdminNgoVerificationPage';
import AdminUserReportsPage from './pages/AdminUserReportsPage';
import AdminStatsPage from './pages/AdminStatsPage';
import NgoReportUserPage from './pages/NgoReportUserPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import MyRequestsPage from './pages/MyRequestsPage';
import ConversationsListPage from './pages/ConversationsListPage';
import NgoRequestsPage from './pages/NgoRequestsPage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import CampaignDetailsPage from './pages/CampaignDetailsPage';
import RewardsBadgesPage from './pages/RewardsBadgesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ImpactFeedPage from './pages/ImpactFeedPage';
import CreateImpactUpdatePage from './pages/CreateImpactUpdatePage';



function App() {
  return (
    <Router>
      {/* This div is for the sticky footer */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Your Navbar (with Login/Dashboard) renders here */}
        <Navbar /> 
        
        {/* The 'main' tag uses the global.css styles */}
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/items" element={<ItemsListPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/item/:itemId" element={<ItemDetailsPage />} />
            <Route path="/campaign/:id" element={<CampaignDetailsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/impact-feed" element={<ImpactFeedPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* <Route path="/privacy" element={<PrivacyPolicyPage />} /> */}

            {/* --- User (Individual) Routes --- */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['individual']}>
                <UserDashboard />
              </ProtectedRoute>
            }/>
            <Route path="/donate-item" element={
              <ProtectedRoute allowedRoles={['individual']}>
                <CreateItemPage />
              </ProtectedRoute>
            }/>
            <Route path="/edit-item/:itemId" element={
              <ProtectedRoute allowedRoles={['individual']}>
                <EditItemPage />
              </ProtectedRoute>
            }/>
            <Route path="/my-requests" element={
              <ProtectedRoute allowedRoles={['individual']}>
                <MyRequestsPage />
              </ProtectedRoute>
            }/>
            <Route path="/rewards-badges" element={
              <ProtectedRoute allowedRoles={['individual']}>
                <RewardsBadgesPage />
              </ProtectedRoute>
            }/>

            {/* --- NGO Routes --- */}
            <Route path="/ngo-dashboard" element={
              <ProtectedRoute allowedRoles={['ngo']}>
                <NgoDashboard />
              </ProtectedRoute>
            }/>
            <Route path="/ngo-requests" element={
              <ProtectedRoute allowedRoles={['ngo']}>
                <NgoRequestsPage />
              </ProtectedRoute>
            }/>
            <Route path="/ngo/report-user" element={
              <ProtectedRoute allowedRoles={['ngo']}>
                <NgoReportUserPage />
              </ProtectedRoute>
            }/>
            <Route path="/ngo/create-campaign" element={
              <ProtectedRoute allowedRoles={['ngo']}>
                <CreateCampaignPage />
              </ProtectedRoute>
            }/>
            <Route path="/ngo/create-impact-update" element={
              <ProtectedRoute allowedRoles={['ngo']}>
                <CreateImpactUpdatePage />
              </ProtectedRoute>
            }/>

            {/* --- Admin Routes --- */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }/>
            <Route path="/admin/requests" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminRequestsPage />
              </ProtectedRoute>
            }/>
            <Route path="/admin/categories" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCategoriesPage />
              </ProtectedRoute>
            }/>
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsersPage />
              </ProtectedRoute>
            }/>
            <Route path="/admin/ngos" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminNgosPage />
              </ProtectedRoute>
            }/>
            <Route path="/admin/ngo-verification" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminNgoVerificationPage />
              </ProtectedRoute>
            }/>
            <Route path="/admin/user-reports" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUserReportsPage />
              </ProtectedRoute>
            }/>
            <Route path="/admin/stats" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminStatsPage />
              </ProtectedRoute>
            }/>
            
            {/* --- Shared Routes --- */}
            <Route path="/chat" element={
              <ProtectedRoute allowedRoles={['individual', 'ngo', 'admin']}>
                <ConversationsListPage />
              </ProtectedRoute>
            }/>
            <Route path="/chat/:itemId/:otherUserId" element={
              <ProtectedRoute allowedRoles={['individual', 'ngo', 'admin']}>
                <ChatPage />
              </ProtectedRoute>
            }/>
          </Routes>
        </main>
            

        {/* Your Footer renders here */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';


// Import Components Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';

// Import Pages (Ensure all these files exist in the pages folder)
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import UniversalBookingCalendar from './pages/shared/UniversalBookingCalendar';
import UniversalContactDetails from './pages/shared/UniversalContactDetails';
import NotFound from './pages/NotFound';

import PrivateBoatInKapasDetails from './pages/Private Boat in Kapas Island Details';
import SquidJiggingDetails from './pages/Squid Jigging Activities Details';


import SnorkelingKapas from './pages/Kapas Island Snorkeling Day Trip Details';
import KapasSearchPage from './pages/Kapas Island Day Trips';

import RedangSearchPage from './pages/Redang Island Day Trips';

import RedangSnorkeling from './pages/Redang Island Snorkeling Day Trip Details';
import RedangSquidJigging from './pages/Squid Jigging in Redang Island Details';
import PerhentianSearchPage from './pages/Perhentian Island Day Trips';

import AboutPage from './pages/AboutPage';
import RedangPackages from './pages/Redang Island Packages';
import SnorkelingActivities from './pages/Snorkeling Activities';
import SnorkelingPerhentian from './pages/Perhentian Island Snorkeling Day Trip Details';
import SignIn from './pages/Control system';
import SignInOrCreateAccount from './pages/Sign in or create an account';
import BookingSuccess from './pages/BookingSuccess';
import Checkout from './pages/Checkout';
import Invoice from './pages/Invoice';
import MyBookings from './pages/MyBookings';
import AddVacation from './pages/admin/AddVacation';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCapacityManager from './pages/admin/AdminCapacityManager';
import AdminFlashSaleManager from './pages/admin/AdminFlashSaleManager';
import ListYourActivity from './pages/List your activity business';
import PartnerLogin from './pages/PartnerLogin';
import PartnerActivityListing from './pages/partner/PartnerActivityListing';
import PartnerLayout from './components/layout/PartnerLayout';
import PartnerAnalytics from './pages/partner/PartnerAnalytics';
import PartnerBooking from './pages/partner/PartnerBooking';
import PartnerIslandActivity from './pages/partner/PartnerIslandActivity';
import PartnerArrivalGuide from './pages/partner/PartnerArrivalGuide';
import PartnerPayouts from './pages/partner/PartnerPayouts';
import PartnerTransactions from './pages/partner/PartnerTransactions';
import PartnerPastPayouts from './pages/partner/PartnerPastPayouts';
import PartnerPayoutSettings from './pages/partner/PartnerPayoutSettings';
import PartnerCompensation from './pages/partner/PartnerCompensation';
import PartnerContracts from './pages/partner/PartnerContracts';
import PartnerPrivacyPolicy from './pages/partner/PartnerPrivacyPolicy';
import PartnerComplianceCenter from './pages/partner/PartnerComplianceCenter';
import PartnerUserManagement from './pages/partner/PartnerUserManagement';
import PartnerConnectivitySettings from './pages/partner/PartnerConnectivitySettings';
import PartnerMessaging from './pages/partner/PartnerMessaging';
import PartnerSnorkeling from './pages/partner/PartnerSnorkeling';
import PartnerOnePackageDetail from './pages/partner/PartnerOnePackageDetail';
import PartnerEquipmentService from './pages/partner/PartnerEquipmentService';
import PartnerDepartureTime from './pages/partner/PartnerDepartureTime';
import PartnerSpots from './pages/partner/PartnerSpots';
import PartnerPricing from './pages/partner/PartnerPricing';
import PartnerPhotos from './pages/partner/PartnerPhotos';
import PartnerPublish from './pages/partner/PartnerPublish';
import PartnerSquidJigging from './pages/partner/PartnerSquidJigging';
import PartnerBoatTrip from './pages/partner/PartnerBoatTrip';
import PartnerMultiplePackages from './pages/partner/PartnerMultiplePackages';
import PartnerActivityDetails from './pages/partner/PartnerActivityDetails';
import PartnerActivityDashboard from './pages/partner/PartnerActivityDashboard';
import PartnerGuestReviews from './pages/partner/PartnerGuestReviews';
import PartnerCalendar from './pages/partner/PartnerCalendar';
import PartnerPromotion from './pages/partner/PartnerPromotion';
import PartnerBookingSettings from './pages/partner/PartnerBookingSettings';
import PartnerSurcharges from './pages/partner/PartnerSurcharges';


import StaySafe from './pages/Stay safe';
import PartnerButtonListAnActivity from './pages/partner/PartnerButtonListAnActivity';




// Main Layout Component
import { ToastProvider } from './components/common/Toast';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

// Subdomain Router Component
const SubdomainRouter = () => {
  const hostname = window.location.hostname;
  const subdomain = hostname.split('.')[0];
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  // Admin Subdomain
  if (subdomain === 'admin' && !isLocalhost) {
    return <AdminRoutes />;
  }

  // Partner Subdomain
  if (subdomain === 'partner' && !isLocalhost) {
    return <PartnerRoutes />;
  }

  // Default / Main Domain
  // On localhost, we can access everything via paths: /partner/* and /admin/*
  return <MainRoutes />;
};

// --- Route Groups ---

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<AdminDashboard />} />
    <Route path="/dashboard" element={<AdminDashboard />} />
    <Route path="/add-vacation" element={<AddVacation />} />
    <Route path="/capacity" element={<AdminCapacityManager />} />
    <Route path="/flash-sale" element={<AdminFlashSaleManager />} />
    <Route path="/login" element={<SignIn />} />
    <Route path="*" element={<div className="p-5">Admin Page Not Found</div>} />
  </Routes>
);

const PartnerRoutes = () => (
  <Routes>
    <Route path="/" element={<PartnerActivityListing />} />
    <Route path="/login" element={<PartnerLogin />} />
    <Route path="/list-an-activity" element={<PartnerButtonListAnActivity />} />
    <Route path="/island-activity" element={<PartnerIslandActivity />} />
    <Route path="/snorkeling" element={<PartnerSnorkeling />} />
    <Route path="/one-package-detail" element={<PartnerOnePackageDetail />} />
    <Route path="/departure-time" element={<PartnerDepartureTime />} />
    <Route path="/spots" element={<PartnerSpots />} />
    <Route path="/pricing" element={<PartnerPricing />} />
    <Route path="/photos" element={<PartnerPhotos />} />
    <Route path="/publish" element={<PartnerPublish />} />
    <Route path="/squid-jigging" element={<PartnerSquidJigging />} />
    <Route path="/boat-trip" element={<PartnerBoatTrip />} />
    <Route path="/multiple-packages" element={<PartnerMultiplePackages />} />
    <Route path="/activity-details" element={<PartnerActivityDetails />} />
    <Route path="/equipment-service" element={<PartnerEquipmentService />} />
    <Route path="/activity-dashboard" element={<PartnerActivityDashboard />} />
    <Route path="/guest-reviews" element={<PartnerGuestReviews />} />
    <Route path="/calendar" element={<PartnerCalendar />} />
    <Route path="/promotion" element={<PartnerPromotion />} />
    <Route path="/booking-settings" element={<PartnerBookingSettings />} />
    <Route path="/surcharges" element={<PartnerSurcharges />} />

    <Route path="/arrival-guide" element={<PartnerArrivalGuide />} />
    <Route path="/payouts" element={<PartnerPayouts />} />
    <Route path="/transactions" element={<PartnerTransactions />} />
    <Route path="/past-payouts" element={<PartnerPastPayouts />} />
    <Route path="/payout-settings" element={<PartnerPayoutSettings />} />
    <Route path="/compensation" element={<PartnerCompensation />} />
    <Route path="/contracts" element={<PartnerContracts />} />
    <Route path="/privacy-policy" element={<PartnerPrivacyPolicy />} />
    <Route path="/compliance-center" element={<PartnerComplianceCenter />} />
    <Route path="/user-management" element={<PartnerUserManagement />} />
    <Route path="/connectivity-settings" element={<PartnerConnectivitySettings />} />
    <Route path="/messaging" element={<PartnerMessaging />} />

    {/* Partner Layout Routes */}
    <Route element={<PartnerLayout />}>
      <Route path="/activity-listing" element={<PartnerActivityListing />} />
      <Route path="/booking" element={<PartnerBooking />} />
      <Route path="/analytics" element={<PartnerAnalytics />} />
    </Route>
    <Route path="*" element={<div className="p-5">Partner Page Not Found</div>} />
  </Routes>
);

const MainRoutes = () => (
  <Routes>
    {/* Development Access for Subdomain-based features on localhost - NO GLOBAL NAVBAR */}
    <Route path="/admin/*" element={<AdminRoutes />} />
    <Route path="/partner/*" element={<PartnerRoutes />} />

    {/* Routes WITH Navbar & Footer */}
    <Route element={<MainLayout />}>
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/invoice/:bookingId" element={<Invoice />} />
      <Route path="/checkout-page" element={<Checkout />} />

      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchResults />} />

      {/* PULAU KAPAS */}
      <Route path="/kapas-island-day-trips" element={<KapasSearchPage />} />
      <Route path="/kapas-snorkeling-details" element={<SnorkelingKapas />} />
      <Route path="/book/kapas-private-boat-10pax" element={<UniversalBookingCalendar apiEndpoint="private-boat-10pax-kapas" maxPax={10} nextStepRoute="/contact-details/5-private-boat-10pax" defaultPrice="850.00" defaultTitle="5. Private Boat Trip (max 10pax)" />} />
      <Route path="/contact-details/5-private-boat-10pax" element={<UniversalContactDetails />} />
      <Route path="/book/kapas-private-boat-15pax" element={<UniversalBookingCalendar apiEndpoint="private-boat-15pax-kapas" maxPax={15} nextStepRoute="/contact-details/6-private-boat-15pax" defaultPrice="1050.00" defaultTitle="6. Private Boat Trip (max 15pax)" />} />
      <Route path="/contact-details/6-private-boat-15pax" element={<UniversalContactDetails />} />
      <Route path="/book/kapas-private-boat-25pax" element={<UniversalBookingCalendar apiEndpoint="private-boat-25pax-kapas" maxPax={25} nextStepRoute="/contact-details/7-private-boat-25pax" defaultPrice="1750.00" defaultTitle="7. Private Boat Trip (max 25pax)" />} />
      <Route path="/contact-details/7-private-boat-25pax" element={<UniversalContactDetails />} />
      <Route path="/book/kapas-private-boat-40pax" element={<UniversalBookingCalendar apiEndpoint="private-boat-40pax-kapas" maxPax={40} nextStepRoute="/contact-details/8-private-boat-40pax" defaultPrice="2800.00" defaultTitle="8. Private Boat Trip (max 40pax)" />} />
      <Route path="/contact-details/8-private-boat-40pax" element={<UniversalContactDetails />} />
      <Route path="/book/kapas-relaxation" element={<UniversalBookingCalendar apiEndpoint="relax-kapas" nextStepRoute="/contact-details/1-relaxation-kapas" defaultPrice="49.00" defaultTitle="1. Relaxation" />} />
      <Route path="/contact-details/1-relaxation-kapas" element={<UniversalContactDetails />} />
      <Route path="/book/kapas-mental-escape" element={<UniversalBookingCalendar apiEndpoint="mental-escape-kapas" nextStepRoute="/contact-details/2-mental-escape-kapas" defaultPrice="59.00" defaultTitle="2. Mental Escape" />} />
      <Route path="/contact-details/2-mental-escape-kapas" element={<UniversalContactDetails />} />
      <Route path="/book/kapas-joy-playfulness" element={<UniversalBookingCalendar apiEndpoint="joy-play-kapas" nextStepRoute="/contact-details/3-joy-play-kapas" defaultPrice="69.00" defaultTitle="3. Joy & Playfulness" />} />
      <Route path="/contact-details/3-joy-play-kapas" element={<UniversalContactDetails />} />
      <Route path="/book/kapas-mood-booster" element={<UniversalBookingCalendar apiEndpoint="mood-booster-kapas" nextStepRoute="/contact-details/4-mood-booster-kapas" defaultPrice="109.00" defaultTitle="4. Mood Booster" />} />
      <Route path="/contact-details/4-mood-booster-kapas" element={<UniversalContactDetails />} />
      <Route path="/book/kapas-private-package-10pax" element={<UniversalBookingCalendar apiEndpoint="private-package-10pax-kapas" maxPax={10} nextStepRoute="/contact-details/9-private-boat-10pax" defaultPrice="1400.00" defaultTitle="9. Private Boat Package (max 10pax)" />} />
      <Route path="/contact-details/9-private-boat-10pax" element={<UniversalContactDetails />} />
      <Route path="/book/kapas-private-package-15pax" element={<UniversalBookingCalendar apiEndpoint="private-package-15pax-kapas" maxPax={15} nextStepRoute="/contact-details/10-private-boat-15pax" defaultPrice="1800.00" defaultTitle="10. Private Boat Package (max 15pax)" />} />
      <Route path="/contact-details/10-private-boat-15pax" element={<UniversalContactDetails />} />
      <Route path="/book/kapas-private-package-25pax" element={<UniversalBookingCalendar apiEndpoint="private-package-25pax-kapas" maxPax={25} nextStepRoute="/contact-details/11-private-boat-25pax" defaultPrice="3000.00" defaultTitle="11. Private Boat Package (max 25pax)" />} />
      <Route path="/contact-details/11-private-boat-25pax" element={<UniversalContactDetails />} />
      <Route path="/book/kapas-private-package-40pax" element={<UniversalBookingCalendar apiEndpoint="private-package-40pax-kapas" maxPax={40} nextStepRoute="/contact-details/12-private-boat-40pax" defaultPrice="4400.00" defaultTitle="12. Private Boat Package (max 40pax)" />} />
      <Route path="/contact-details/12-private-boat-40pax" element={<UniversalContactDetails />} />
      <Route path="/kapas-private-boat-details" element={<PrivateBoatInKapasDetails />} />

      {/* PULAU REDANG */}
      <Route path="/redang-island-day-trips" element={<RedangSearchPage />} />
      <Route path="/squid-jigging-details" element={<SquidJiggingDetails />} />
      <Route path="/redang-squid-jigging-details" element={<RedangSquidJigging />} />
      <Route path="/book/redang-squid-jigging-private" element={<UniversalBookingCalendar apiEndpoint="squid-jigging-redang" nextStepRoute="/contact-details/2-squid-jigging-redang" defaultPrice="1350.00" defaultTitle="2. Squid Jigging Package (Private Boat)" />} />
      <Route path="/contact-details/2-squid-jigging-redang" element={<UniversalContactDetails />} />
      <Route path="/redang-snorkeling-details" element={<RedangSnorkeling />} />
      <Route path="/book/redang-snorkeling-day-trip" element={<UniversalBookingCalendar apiEndpoint="snorkeling-redang" nextStepRoute="/contact-details/1-snorkeling-redang" defaultPrice="100.00" defaultTitle="1. Day Trip Snorkeling (All-In)" />} />
      <Route path="/contact-details/1-snorkeling-redang" element={<UniversalContactDetails />} />
      <Route path="/book/redang-skin-dive" element={<UniversalBookingCalendar apiEndpoint="skin-dive-redang" nextStepRoute="/contact-details/2-skin-dive-redang" defaultPrice="250.00" defaultTitle="2. Redang Skin Dive Experience" />} />
      <Route path="/contact-details/2-skin-dive-redang" element={<UniversalContactDetails />} />
      <Route path="/book/redang-free-diving" element={<UniversalBookingCalendar apiEndpoint="free-dive-redang" nextStepRoute="/contact-details/3-free-dive-redang" defaultPrice="299.00" defaultTitle="3. Redang Freediving Daytrip Buddy" allowedDaysOfWeek={[0, 6]} />} />
      <Route path="/contact-details/3-free-dive-redang" element={<UniversalContactDetails />} />
      <Route path="/redang-island-packages" element={<RedangPackages />} />

      {/* PULAU PERHENTIAN */}
      <Route path="/perhentian-island-day-trips" element={<PerhentianSearchPage />} />
      <Route path="/perhentian-snorkeling-details" element={<SnorkelingPerhentian />} />
      <Route path="/book/perhentian-snorkeling-day-trip" element={<UniversalBookingCalendar apiEndpoint="snorkeling-perhentian" nextStepRoute="/contact-details/1-snorkeling-perhentian" defaultPrice="80.00" defaultTitle="1. Day Trip Snorkeling" />} />
      <Route path="/contact-details/1-snorkeling-perhentian" element={<UniversalContactDetails />} />
      <Route path="/book/perhentian-learn-skindiving" element={<UniversalBookingCalendar apiEndpoint="skin-dive-perhentian" nextStepRoute="/contact-details/2-skin-dive-perhentian" defaultPrice="260.00" defaultTitle="2. Learn Skindiving" allowedDaysOfWeek={[0, 6]} />} />
      <Route path="/contact-details/2-skin-dive-perhentian" element={<UniversalContactDetails />} />
      <Route path="/book/perhentian-free-diving" element={<UniversalBookingCalendar apiEndpoint="free-dive-perhentian" nextStepRoute="/contact-details/5-free-dive-perhentian" defaultPrice="280.00" defaultTitle="3. PERHENTIAN FREE DIVING DAYTRIP" allowedDaysOfWeek={[0, 6]} />} />
      <Route path="/contact-details/5-free-dive-perhentian" element={<UniversalContactDetails />} />


      <Route path="/snorkeling-activities" element={<SnorkelingActivities />} />

      {/* SYSTEM & INFO */}
      <Route path="/about" element={<AboutPage />} />
      {/* <Route path="/login" element={<PartnerLogin />} />  Moved to Partner Routes */}
      <Route path="/admin-login" element={<SignIn />} />
      <Route path="/auth" element={<SignInOrCreateAccount />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/booking-success" element={<BookingSuccess />} />
      <Route path="/PartnerOnePackageDetail" element={<PartnerOnePackageDetail />} />
      <Route path="/list-your-activity" element={<ListYourActivity />} />
      <Route path="/stay-safe" element={<StaySafe />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <ScrollToTop />
        <SubdomainRouter />
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;

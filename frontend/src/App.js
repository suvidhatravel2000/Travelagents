import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DestinationPage from "./pages/DestinationPage";
import PackageDetails from "./pages/PackageDetails";
import IndiaHolidays from "./pages/IndiaHolidays";
import InternationalHolidays from "./pages/InternationalHolidays";
import SearchResults from "./pages/SearchResults";
import Blog from "./pages/Blog";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardCMS from "./pages/AdminDashboardCMS";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/india-holidays" element={<IndiaHolidays />} />
          <Route path="/international-holidays" element={<InternationalHolidays />} />
          <Route path="/destination/:destinationId" element={<DestinationPage />} />
          <Route path="/package/:packageId" element={<PackageDetails />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/cms" element={<AdminDashboardCMS />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;

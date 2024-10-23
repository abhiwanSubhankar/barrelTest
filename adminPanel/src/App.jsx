import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BattleZoneHistory from "./pages/BattlezoneHistory/BattlezoneHistory.jsx";
import UserData from "./pages/UserData/UserData.jsx";
import Login from "./pages/Login/Login.jsx";
import Layout from "./Layout/Layout.jsx";
import AdminStatistics from "./pages/Statistics/AdminStatistics.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import "./App.css";
import { Toaster } from 'react-hot-toast';
import DebitedTransactions from "./pages/AllTransactions/DebitedTransactions.jsx";
import CreditedTransactions from "./pages/AllTransactions/CreditedTransactions.jsx";

function App() {
  return (
    <div>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<ProtectedRoute element={<UserData />} />} />
            <Route
              path="/userdata"
              element={<ProtectedRoute element={<UserData />} />}
            />
            <Route
              path="/debitedTransaction"
              element={<ProtectedRoute element={<DebitedTransactions />} />}
            />
            <Route
              path="/creditedTransaction"
              element={<ProtectedRoute element={<CreditedTransactions />} />}
            />
            <Route
              path="/matchhistory"
              element={<ProtectedRoute element={<BattleZoneHistory />} />}
            />
            <Route
              path="/statistics"
              element={<ProtectedRoute element={<AdminStatistics />} />}
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

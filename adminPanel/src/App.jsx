import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SideMenu from "./components/SideMenu/SideMenu.jsx";
import Home from "./pages/Home/Home.jsx";
import AllTransaction from "./pages/AllTransactions/DebitedTransactions.jsx";
import BattleZoneHistory from "./pages/BattlezoneHistory/BattlezoneHistory.jsx";
import RedeemToken from "./pages/RedeemToken/RedeemToken.jsx";
import UserData from "./pages/UserData/UserData.jsx";
import Login from "./pages/Login/Login.jsx";
import Layout from "./Layout/Layout.jsx";
import AddToken from "./pages/AddToken/AddToken.jsx";
import UserDetail from "./pages/UserDetail/UserDetail.jsx";
import AdminHouseCut from "./pages/WalletChange/AdminHouseCut.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import LeaderBoard from "./pages/LeaderBoard/LeaderBoard.jsx";
import Shop from "./pages/Shop/Shop.jsx";
import "./App.css";
import toast, { Toaster } from 'react-hot-toast';
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
              path="/adminledger"
              element={<ProtectedRoute element={<AdminHouseCut />} />}
            />

            {/*
            <Route
              path="/leaderBoard"
              element={<ProtectedRoute element={<LeaderBoard />} />}
            />

            <Route
              path="/shop"
              element={<ProtectedRoute element={<Shop />} />}
            />

            <Route
              path="/addToken"
              element={<ProtectedRoute element={<AddToken />} />}
            /> */}

            {/* <Route
              path="/redeemtoken"
              element={<ProtectedRoute element={<RedeemToken />} />}
            /> */}

            {/* <Route
              path="/user/:id"
              element={<ProtectedRoute element={<UserDetail />} />}
            /> */}

            {/* <Route
            path="/adminHouseCut"
            element={<ProtectedRoute element={<AdminHouseCut />} />}
          /> */}

          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

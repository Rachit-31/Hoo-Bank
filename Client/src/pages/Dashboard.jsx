import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../ApiUri";
import toast from "react-hot-toast";
import { FaHome, FaListAlt } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("account");
  const [balance, setBalance] = useState(null);
  const [accountType, setAccountType] = useState("Savings Account");
  const [lastLogin, setLastLogin] = useState("—");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    if (!token || !id) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    const fetchAccountDetails = async () => {
      try {
        const res = await axios.get(`${API}/accounts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setBalance(res.data.balance || 0);
        setAccountType(res.data.type || "Savings Account");
        setLastLogin(res.data.lastLogin || "—");
      } catch (err) {
        console.error("Failed to fetch account:", err);
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${API}/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setTransactions(res.data.transactions || []);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

    fetchAccountDetails();
    fetchTransactions();
  }, [navigate]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-900 text-white">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-950 p-4 border-r border-zinc-800">
        <h2 className="text-xs text-zinc-400 font-semibold mb-4">MENU</h2>
        <div className="space-y-2">
          <div
            onClick={() => setActiveSection("account")}
            className={`flex items-center p-2 rounded cursor-pointer ${
              activeSection === "account" ? "bg-zinc-800" : "hover:bg-zinc-800"
            }`}
          >
            <FaHome className="mr-3 text-blue-400" />
            <span className="text-white">Account Summary</span>
          </div>
          <div
            onClick={() => setActiveSection("transactions")}
            className={`flex items-center p-2 rounded cursor-pointer ${
              activeSection === "transactions" ? "bg-zinc-800" : "hover:bg-zinc-800"
            }`}
          >
            <FaListAlt className="mr-3 text-purple-400" />
            <span className="text-white">Transactions</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        {activeSection === "account" && (
          <section>
            <h1 className="text-3xl font-bold mb-6">Account Summary</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-800 p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-2">Account Balance</h3>
                <p className="text-2xl text-green-400 font-mono">
                  ₹{balance !== null ? balance.toLocaleString("en-IN") : "—"}
                </p>
              </div>
              <div className="bg-zinc-800 p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-2">Account Type</h3>
                <p>{accountType}</p>
              </div>
              <div className="bg-zinc-800 p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-2">Last Login</h3>
                <p>{lastLogin}</p>
              </div>
            </div>
          </section>
        )}

        {activeSection === "transactions" && (
          <section>
            <h1 className="text-3xl font-bold mb-6">Recent Transactions</h1>
            <div className="bg-zinc-800 p-6 rounded-xl shadow">
              {transactions.length > 0 ? (
                <ul className="divide-y divide-zinc-700">
                  {transactions.map((tx, idx) => (
                    <li key={idx} className="flex justify-between py-3">
                      <span>{tx.description || "Transaction"}</span>
                      <span
                        className={
                          tx.amount < 0 ? "text-red-400" : "text-green-400"
                        }
                      >
                        {tx.amount < 0
                          ? `- ₹${-tx.amount}`
                          : `+ ₹${tx.amount}`}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-zinc-400 text-sm">No transactions found.</p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

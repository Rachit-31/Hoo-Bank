import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../ApiUri";
import toast from "react-hot-toast";
import { FaHome, FaListAlt, FaExchangeAlt } from "react-icons/fa";

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("account");
    const [accounts, setAccounts] = useState({
        checking: [],
        savings: [],
        fixedDeposits: [],
    });
    const [transactions, setTransactions] = useState([]);

    const [fromAccountId, setFromAccountId] = useState("");
    const [toAccountNumber, setToAccountNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    const applyFilter = () => {
        const filtered = transactions.filter((tx) => {
            const txDate = new Date(tx.date);
            const from = startDate ? new Date(startDate) : null;
            const to = endDate ? new Date(endDate) : null;

            if (from && txDate < from) return false;
            if (to && txDate > to) return false;
            return true;
        });

        setFilteredTransactions(filtered);
    };


    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("id");

        if (!token || !userId) {
            toast.error("Please login first");
            navigate("/login");
            return;
        }

        const fetchAccounts = async () => {
            try {
                const res = await axios.get(`${API}/account/getAccount/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                setAccounts(res.data.accounts);
            } catch (err) {
                console.error("Failed to fetch account details:", err);
            }
        };

        const fetchTransactions = async () => {
            try {
                const res = await axios.get(`${API}/account/getTransactions/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                setTransactions(res.data.transactions || []);
                setFilteredTransactions(res.data.transactions || []);

            } catch (err) {
                console.error("Failed to fetch transactions:", err);
            }
        };

        fetchAccounts();
        fetchTransactions();
    }, [navigate]);



    const handleTransfer = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("id")

        try {
            const res = await axios.post(
                `${API}/account/makeTransaction/${userId}`,
                {
                    fromAccountId,
                    toAccountNumber,
                    amount: parseFloat(amount),
                    description,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            toast.success("Transfer successful!");

            // Optional: refresh accounts and transactions
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            console.error("Transfer error:", err.response?.data || err.message);
            toast.error(
                err.response?.data?.message || "Transfer failed. Try again."
            );
        }
    };


    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-zinc-900 text-white">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-zinc-950 p-4 border-r border-zinc-800">
                <h2 className="text-xs text-zinc-400 font-semibold mb-4 mt-13">MENU</h2>
                <div className="space-y-2">
                    <div
                        onClick={() => setActiveSection("account")}
                        className={`flex items-center p-2 rounded cursor-pointer ${activeSection === "account" ? "bg-zinc-800" : "hover:bg-zinc-800"
                            }`}
                    >
                        <FaHome className="mr-3 text-blue-400" />
                        <span className="text-white">Account Summary</span>
                    </div>
                    <div
                        onClick={() => setActiveSection("transactions")}
                        className={`flex items-center p-2 rounded cursor-pointer ${activeSection === "transactions"
                            ? "bg-zinc-800"
                            : "hover:bg-zinc-800"
                            }`}
                    >
                        <FaListAlt className="mr-3 text-purple-400" />
                        <span className="text-white">Transactions</span>
                    </div>
                    <div
                        onClick={() => setActiveSection("transfer")}
                        className={`flex items-center p-2 rounded cursor-pointer ${activeSection === "transfer" ? "bg-zinc-800" : "hover:bg-zinc-800"
                            }`}
                    >
                        <FaExchangeAlt className="mr-3 text-yellow-400" />
                        <span className="text-white">Transfer Money</span>
                    </div>

                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-auto">
                {activeSection === "account" && (
                    <section>
                        <h1 className="text-3xl font-bold mb-6">Account Summary</h1>
                        <div className="space-y-8">
                            {["checking", "savings", "fixedDeposits"].map((type) =>
                                accounts[type].length > 0 ? (
                                    <div key={type}>
                                        <h2 className="text-xl font-semibold capitalize mb-3">
                                            {type === "fixedDeposits" ? "Fixed Deposits" : `${type} Accounts`}
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {accounts[type].map((acc) => (
                                                <div
                                                    key={acc._id}
                                                    className="bg-zinc-800 p-5 rounded-xl shadow"
                                                >
                                                    <h3 className="text-lg font-semibold mb-1">
                                                        A/C Number: {acc.accountNumber}
                                                    </h3>
                                                    <p className="text-green-400 text-xl font-mono mb-1">
                                                        ₹{acc.balance.toLocaleString("en-IN")}
                                                    </p>
                                                    <p className="text-zinc-400 text-sm">
                                                        Opened On: {new Date(acc.openedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null
                            )}
                        </div>
                    </section>
                )}

                {activeSection === "transactions" && (
                    <section>
                        <h1 className="text-3xl font-bold mb-6">Recent Transactions</h1>

                        {/* Filter UI */}
                        <div className="mb-4 flex flex-col md:flex-row gap-4">
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="p-2 rounded bg-zinc-900 border border-zinc-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="p-2 rounded bg-zinc-900 border border-zinc-700"
                                />
                            </div>
                            <button
                                onClick={applyFilter}
                                className="self-end mt-6 md:mt-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Apply Filter
                            </button>
                        </div>

                        {/* Filtered Results */}
                        <div className="bg-zinc-800 p-6 rounded-xl shadow space-y-4">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((tx, idx) => (
                                    <div
                                        key={idx}
                                        className="border border-zinc-700 rounded-lg p-4 flex flex-col gap-1"
                                    >
                                        <div className="flex justify-between">
                                            <span className="text-sm text-zinc-400 font-medium">{tx.type.toUpperCase()}</span>
                                            <span
                                                className={
                                                    tx.type === "Debit" ? "text-red-400 font-semibold" : "text-green-400 font-semibold"
                                                }
                                            >
                                                {tx.type === "Debit" ? `- ₹${tx.amount}` : `+ ₹${tx.amount}`}
                                            </span>
                                        </div>

                                        <div className="text-sm text-zinc-300">
                                            <span className="font-medium">From:</span> A/C {tx.fromAccount?.accountNumber || "N/A"}
                                        </div>
                                        <div className="text-sm text-zinc-300">
                                            <span className="font-medium">To:</span> A/C {tx.toAccount?.accountNumber || "N/A"}
                                        </div>

                                        <div className="text-sm text-zinc-400 italic">
                                            {tx.description || "No description"}
                                        </div>

                                        <div className="text-xs text-zinc-500">
                                            {new Date(tx.date).toLocaleString()}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-zinc-400 text-sm">No transactions found.</p>
                            )}
                        </div>

                    </section>
                )}


                {activeSection === "transfer" && (
                    <section className="mt-15">
                        <form
                            onSubmit={handleTransfer}
                            className="bg-zinc-800 p-6 rounded-xl shadow space-y-4 max-w-xl"
                        >
                            <div>
                                <label className="block mb-1 text-sm">From Account</label>
                                <select
                                    value={fromAccountId}
                                    onChange={(e) => setFromAccountId(e.target.value)}
                                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded"
                                    required
                                >
                                    <option value="">Select account</option>
                                    {["checking", "savings"].flatMap((type) =>
                                        accounts[type]?.map((acc) => (
                                            <option key={acc._id} value={acc._id}>
                                                {type.toUpperCase()} - {acc.accountNumber} (₹{acc.balance})
                                            </option>
                                        )) || []
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm">To Account Number</label>
                                <input
                                    type="text"
                                    value={toAccountNumber}
                                    onChange={(e) => setToAccountNumber(e.target.value)}
                                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded"
                                    placeholder="Enter 10-digit account number"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm">Amount</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded"
                                    placeholder="Enter amount"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm">Description (optional)</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded"
                                />
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Transfer
                            </button>
                        </form>
                    </section>
                )}

            </main>
        </div>
    );
};

export default Dashboard;

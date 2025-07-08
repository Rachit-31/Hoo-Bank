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
    const [method, setMethod] = useState("NEFT");
    const [ifscCode, setIfscCode] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmInput, setConfirmInput] = useState("");
    const [profile, setProfile] = useState({ fullName: "", email: "" });
    const [editingProfile, setEditingProfile] = useState(false);



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
                console.log(res.data.transactions)
                setTransactions(res.data.transactions || []);
                setFilteredTransactions(res.data.transactions || []);

            } catch (err) {
                console.error("Failed to fetch transactions:", err);
            }
        };

        fetchAccounts();
        fetchTransactions();
    }, [navigate]);


    const handleTransferClick = (e) => {
        e.preventDefault();
        setShowConfirmModal(true);
    };


    const handleConfirmTransfer = async () => {
        if (confirmInput !== "CONFIRM") {
            toast.error("You must type CONFIRM to proceed.");
            return;
        }

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("id");

        try {
            const res = await axios.post(
                `${API}/account/makeTransaction`,
                {
                    fromAccountId,
                    toAccountNumber,
                    amount: parseFloat(amount),
                    description,
                    method,
                    ifscCode,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            toast.success("Transfer successful!");
            setShowConfirmModal(false);

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            console.error("Transfer error:", err.response?.data || err.message);
            toast.error(err.response?.data?.message || "Transfer failed. Try again.");
        }
    };

    const handleDownloadPDF = async (accountId) => {
        const token = localStorage.getItem("token");

        try {
            const res = await axios.get(`${API}/account/downloadPdf/${accountId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    withCredentials: true,
                },
                responseType: 'blob',
            });

            // ✅ Create a blob URL and trigger download
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "transfer-history.pdf");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            console.log(res)
        } catch (err) {
            console.error("Download error:", err.message || err);
            toast.error("Failed to download transfer history PDF.");
        }
    };


    useEffect(() => {
        const fetchProfile = async () => {
            const userId = localStorage.getItem("id");
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get(`${API}/users/getUser/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                setProfile(res.data.user);
            } catch (err) {
                console.error("Failed to fetch user profile:", err.message);
                // toast.error("Failed to load profile.");
            }
        };

        fetchProfile();
    }, []);

    const handleProfileUpdate = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await axios.put(
                `${API}/users/updateUser`,
                {
                    fullName: profile.fullName,
                    email: profile.email,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            toast.success(res.data.message || "Profile updated");
            setEditingProfile(false);
        } catch (err) {
            console.error("Profile update error:", err.message || err);
            toast.error(err.response?.data?.message || "Update failed");
        }
    };



    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-zinc-900 text-white">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-zinc-950 p-4 border-r border-zinc-800">
                <h2 className="text-xs text-zinc-400 font-semibold mb-4 mt-13">MENU</h2>
                <div className="space-y-2">
                    <div
                        onClick={() => setActiveSection("profile")}
                        className={`flex items-center p-2 rounded cursor-pointer ${activeSection === "profile" ? "bg-zinc-800" : "hover:bg-zinc-800"}`}
                    >
                        <span className="ml-2 text-white">Profile</span>
                    </div>

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
                                                <div key={acc._id} className="bg-zinc-800 p-5 rounded-xl shadow">
                                                    <h3 className="text-lg font-semibold mb-1">
                                                        A/C Number: {acc.accountNumber}
                                                    </h3>
                                                    <p className="text-green-400 text-xl font-mono mb-1">
                                                        ₹{acc.balance.toLocaleString("en-IN")}
                                                    </p>
                                                    <p className="text-zinc-400 text-sm mb-4">
                                                        Opened On: {new Date(acc.openedAt).toLocaleDateString()}
                                                    </p>

                                                    {/* 🧾 Download Button */}
                                                    <button
                                                        onClick={() => handleDownloadPDF(acc._id)}
                                                        className="mt-2 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded"
                                                    >
                                                        Download Transfer PDF
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null
                            )}
                        </div>
                    </section>

                )}

                {activeSection === "profile" && (
                    <section>
                        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
                        <div className="bg-zinc-800 p-6 rounded-xl shadow space-y-4 max-w-lg">
                            <div>
                                <label className="block mb-1 text-sm">Full Name</label>
                                <input
                                    type="text"
                                    value={profile.fullName}
                                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                    disabled={!editingProfile}
                                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm">Email</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    disabled={!editingProfile}
                                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded"
                                />
                            </div>

                            {editingProfile ? (
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleProfileUpdate}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setEditingProfile(false)}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setEditingProfile(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                >
                                    Edit Profile
                                </button>
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

                                        <div className="text-sm text-zinc-400 italic">
                                            {tx.description || "No description"}
                                        </div>

                                        <div className="text-xs text-zinc-500">
                                            {new Date(tx.timestamp).toLocaleString("en-IN", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })}
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
                    <section className="mt-15 flex justify-center items-start min-h-[80vh]">
                        <form
                            onSubmit={handleConfirmTransfer}
                            className="bg-zinc-800 p-6 rounded-xl shadow space-y-4 max-w-xl w-full"
                        >
                            {/* From Account */}
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
                                        ))
                                    )}
                                </select>
                            </div>

                            {/* To Account Number */}
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

                            {/* IFSC Code */}
                            <div>
                                <label className="block mb-1 text-sm">IFSC Code</label>
                                <input
                                    type="text"
                                    value={ifscCode}
                                    onChange={(e) => setIfscCode(e.target.value)}
                                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded"
                                    placeholder="Enter IFSC code"
                                    required
                                />
                            </div>

                            {/* Method */}
                            <div>
                                <label className="block mb-1 text-sm">Transfer Method</label>
                                <select
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded"
                                    required
                                >
                                    <option value="NEFT">NEFT</option>
                                    <option value="RTGS">RTGS</option>
                                    <option value="IMPS">IMPS</option>
                                </select>
                            </div>

                            {/* Amount */}
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

                            {/* Description */}
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
                                onClick={handleTransferClick}
                                type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Transfer
                            </button>
                            {showConfirmModal && (
                                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                                    <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-lg border border-zinc-700 shadow-lg">
                                        <h2 className="text-xl font-semibold text-red-500 mb-4">⚠️ Confirm Transfer</h2>
                                        <p className="mb-4 text-zinc-300">
                                            You are about to transfer <span className="text-green-400 font-bold">₹{amount}</span> from your account to account number <span className="text-blue-400 font-bold">{toAccountNumber}</span> via <span className="text-yellow-400 font-bold">{method}</span>.
                                        </p>
                                        <p className="text-sm text-red-400 mb-2">
                                            ⚠️ Please double-check the account number and amount. Bank transfers are irreversible. If you send to the wrong account, your money may be lost.
                                        </p>
                                        <p className="text-sm text-zinc-400 mb-2">
                                            Type <span className="font-mono text-white font-semibold">CONFIRM</span> to proceed:
                                        </p>
                                        <input
                                            type="text"
                                            value={confirmInput}
                                            onChange={(e) => setConfirmInput(e.target.value)}
                                            className="w-full p-2 bg-zinc-800 border border-zinc-600 rounded mb-4"
                                            placeholder="Type CONFIRM to continue"
                                        />
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                onClick={() => setShowConfirmModal(false)}
                                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleConfirmTransfer}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                                            >
                                                Confirm Transfer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </form>
                    </section>

                )}

            </main>
        </div>
    );
};

export default Dashboard;

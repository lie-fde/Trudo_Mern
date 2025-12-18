import React, { useState, useEffect } from "react";
import { Search, Wallet, Ticket, Calendar } from "lucide-react";
import Navbar from "../../components/User/Navbar.jsx";
import Trudofooter from "../../components/reusable/footer.jsx";
import CTABanner from "../../components/User/CTABanner";
import { DonationRow, StatCard } from "../../components/reusable/MyDonation";
import api from "../../api/api.js";
import Pagination from "../../components/reusable/Pagination.jsx";

const MyDonationPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [search, setSearch] = useState("");

  const [stats, setStats] = useState({
    totalAmount: 0,
    totalDonations: 0,
    latestDonation: null,
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const { data } = await api.get("/auth/users/donations/history", {
          params: {
            page,
            limit: 5,
            search: debouncedSearch,
          },
        });

        if (data.success) {
          setHistory(data.history);
          setPages(data.pages);
        }
      } catch (err) {
        console.error("Error fetching donation history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [page, debouncedSearch]);

  useEffect(() => {
    async function loadStats() {
      try {
        const { data } = await api.get("/auth/users/donations/stats");
        if (data.success) {
          setStats({
            totalAmount: data.stats.totalAmount,
            totalDonations: data.stats.totalDonations,
            latestDonation: data.stats.latestDonation,
          });
        }
      } catch (err) {
        console.error("Stats load error:", err);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg">
        Loading your donation history...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8">My Donations</h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={Wallet}
            title="Total Amount Donated"
            value={stats.totalAmount}
            colorClass="text-yellow-600"
          />
          <StatCard
            icon={Ticket}
            title="Total Donations Supported"
            value={stats.totalDonations}
            colorClass="text-pink-500"
          />
          <StatCard
            icon={Calendar}
            title="Latest Donation"
            value={
              stats.latestDonation
                ? new Date(stats.latestDonation).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "No Donations Yet"
            }
            colorClass="text-purple-500"
          />
        </div>

        {/* Search Input (No Button) */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="relative w-full md:w-[400px]">
            <input
              type="text"
              placeholder="Search by event or creator name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-5 pr-12 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm text-sm"
            />
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-7 gap-3 px-6 pb-4 text-sm font-bold text-gray-800 border-b border-gray-200 mb-6 mr-[140px]">
          <div className="pl-2">Event</div>
          <div>Created By</div>
          <div>Date</div>
          <div>Amount</div>
          <div>Payment Method</div>
          <div>Transaction ID</div>
          <div>Status</div>
        </div>
        <div className="hidden md:block absolute right-[calc(50%-36rem)] w-24 text-center text-sm font-bold text-gray-800 -mt-16">
          Action
        </div>

        {/* Donation Rows */}
        <div className="space-y-4">
          {history.map((donation) => (
            <DonationRow key={donation.id} item={donation} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination page={page} pages={pages} setPage={setPage} />
      </main>

      <CTABanner />
      <Trudofooter />
    </div>
  );
};

export default MyDonationPage;

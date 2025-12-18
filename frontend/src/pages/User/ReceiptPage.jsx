import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/reusable/footer";

export default function ReceiptPage() {
  const { receiptId } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchReceipt() {
      try {
        const { data } = await api.get(`/payments/receipt/${receiptId}`);
        setReceipt(data);
      } catch (err) {
        console.log("Receipt load error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchReceipt();
  }, [receiptId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg">
        Loading your receipt...
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg">
        Receipt not found.
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col items-center pt-24 bg-gray-50 pb-20">
        {/* Success Icon */}
        <div className="bg-green-500 text-white rounded-full p-4 shadow-lg mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Thank You for Your Donation!
        </h1>

        <p className="text-gray-600 mb-10 text-center px-4">
          Your contribution helps support the campaign and makes a positive
          impact.
        </p>

        {/* Receipt Card */}
        <div className="bg-white shadow-2xl rounded-2xl p-10 w-[450px] border border-gray-200">
          <h2 className="text-2xl font-semibold mb-5 text-center text-gray-900">
            Donation Receipt
          </h2>

          <div className="space-y-3 text-gray-800">
            <p>
              <strong>Receipt ID:</strong> {receipt.receiptId}
            </p>
            <p>
              <strong>Donor:</strong> {receipt.userName}
            </p>
            <p>
              <strong>Email:</strong> {receipt.userEmail}
            </p>
            <p>
              <strong>Campaign:</strong> {receipt.campaignName}
            </p>
            <p>
              <strong>Amount:</strong> ₹{receipt.amount}
            </p>
            <p>
              <strong>Payment ID:</strong> {receipt.paymentId}
            </p>
            <p>
              <strong>Date:</strong> {new Date(receipt.date).toLocaleString()}
            </p>
          </div>

          {/* Download PDF */}
          <button
            onClick={() => window.open(receipt.pdfUrl, "_blank")}
            className="mt-7 w-full bg-black text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-900 transition"
          >
            Download PDF Receipt
          </button>

          {/* Back to Home */}
          <button
            onClick={() => navigate("/")}
            className="mt-4 w-full bg-gray-200 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition"
          >
            Go to Home
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
}

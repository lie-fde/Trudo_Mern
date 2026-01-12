import React, { useEffect, useRef } from "react";
import useCountdown from "../../hooks/useCounter";
import Swal from "sweetalert2";
import { X } from "lucide-react";

export const PaymentModal = ({
  totalAmount,
  lockExpiresAt,
  onPay,
  onClose,     // 👈 go back to event page
  onExpire,    // 👈 auto close when expired
}) => {
  const timeLeft = useCountdown(lockExpiresAt);
  const alertShown = useRef(false);

  useEffect(() => {
    if (timeLeft === 0 && lockExpiresAt && !alertShown.current) {
      alertShown.current = true;

      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Your ticket reservation expired. Please try again.",
        confirmButtonText: "Back to Event",
      }).then(() => {
        onExpire?.();
      });
    }
  }, [timeLeft, lockExpiresAt, onExpire]);

  if (!lockExpiresAt) return null;

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, "0");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-fadeIn">

        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition"
          aria-label="Close payment modal"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Complete Payment
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Tickets are temporarily reserved for you
        </p>

        {/* Countdown */}
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5">
          <span className="text-sm text-red-700 font-medium">
            ⏳ Time Remaining
          </span>
          <span className="font-bold text-red-700">
            {minutes}:{seconds}
          </span>
        </div>

        {/* Amount */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-700 text-sm">Total Amount</span>
          <span className="text-lg font-bold text-gray-900">
            ₹{totalAmount}
          </span>
        </div>

        {/* Pay Button */}
        <button
          onClick={onPay}
          disabled={timeLeft === 0}
          className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 transition disabled:opacity-50"
        >
          Pay Now
        </button>

        {/* Footer hint */}
        <p className="mt-4 text-xs text-center text-gray-400">
          Secure payment powered by Razorpay
        </p>
      </div>
    </div>
  );
};

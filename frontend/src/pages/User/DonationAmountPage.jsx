import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/reusable/footer";
import { fetchPublicSingleCampaign } from "../../store/campaignUserSlice";

export default function DonationPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { singleCampaign, loading } = useSelector(
    (state) => state.campaignPublic
  );

  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState("");

  useEffect(() => {
    dispatch(fetchPublicSingleCampaign(id));
  }, [id, dispatch]);

  if (loading || !singleCampaign) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg">
        Loading...
      </div>
    );
  }

  const campaign = singleCampaign;

  // ------------- VALIDATION -------------
  const validateAmount = (value) => {
    if (!value) return "Amount is required";
    if (isNaN(value)) return "Amount must be a number";
    if (value < 100) return "Minimum donation is ₹100";
    if (value > 500000) return "Maximum donation is ₹5,00,000";
    return "";
  };

  const handleDonate = () => {
    const validationError = validateAmount(amount);
    setErrors(validationError);

    if (validationError === "") {
      console.log("Proceed to payment page with amount:", amount);
      // 👇 Add your payment logic here
    }
  };

  // Tax (if any)
  const tax = 0;
  const totalAmount = Number(amount || 0) + tax;

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="pt-24 flex justify-center items-start flex-grow pb-20">
        <div className="bg-white shadow-xl p-10 rounded-3xl w-[380px] border border-gray-200">

          {/* Campaign Image */}
          <div className="w-full flex justify-center mb-8">
            <img
              src={campaign.image?.[0]}
              alt="Campaign"
              className="w-40 h-40 object-cover rounded-xl"
            />
          </div>

          {/* Donation Amount */}
          <label className="block text-gray-700 font-semibold text-lg mb-2">
            Donating Amount
          </label>

          <input
            type="text"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setErrors("");
            }}
            placeholder="Enter amount (₹)"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-black outline-none"
          />

          {/* Validation Error */}
          {errors && (
            <p className="text-red-500 text-sm mt-1">{errors}</p>
          )}

          <hr className="my-5" />

          {/* Calculation */}
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Donating Amount</span>
            <span className="font-semibold">₹ {Number(amount || 0).toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-700 mb-2">
            <span>Tax</span>
            <span className="font-semibold">₹ {tax}</span>
          </div>

          <div className="flex justify-between text-gray-900 font-bold text-lg mt-3">
            <span>Total Amount</span>
            <span>₹ {totalAmount.toFixed(2)}</span>
          </div>

          {/* Donate Button */}
          <button
            onClick={handleDonate}
            className="mt-6 w-full bg-black text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-900 transition"
          >
            Donate
          </button>

        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

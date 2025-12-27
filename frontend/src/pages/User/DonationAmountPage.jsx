import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector} from "react-redux";
import Navbar from "../../components/User/Navbar";
import Footer from "../../components/reusable/footer";
import { fetchPublicSingleCampaign } from "../../store/campaignUserSlice";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function DonationPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { singleCampaign, loading } = useSelector(
    (state) => state.campaignPublic
  );

  const { userEmail ,mobileNumber} = useSelector((state)=> state.auth)

  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState("");
  const [raisedAmount, setRaisedAmount] = useState(0);

  useEffect(() => {
    dispatch(fetchPublicSingleCampaign(id));
  }, [id, dispatch]);

   useEffect(() => {
    const fetchRaisedAmount = async () => {
      try {
        const campaignId = id;
        const res = await api.get(`/campaign/raisedAmount/${campaignId}`);

        setRaisedAmount(res.data.raisedAmount);
      } catch (error) {
        console.error("Failed to fetch raised amount", error);
      }
    };

    if (id) {
      fetchRaisedAmount();
    }
  }, [id]);

  if (loading || !singleCampaign) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg">
        Loading...
      </div>
    );
  }

  const campaign = singleCampaign;
  
  const validateAmount = (value) => {
    const availableAmount = campaign.targetAmount - raisedAmount
    if (!value) return "Amount is required";
    if (isNaN(value)) return "Amount must be a number";
    if (value < 100) return "Minimum donation is ₹100";
    if (value > 500000) return "Maximum donation is ₹5,00,000";
    if (value > availableAmount) return `Donation exceeds . Maximum ₹${availableAmount} can be donated`
    return "";
  };

  const handleDonate = async () => {
    const validationError = validateAmount(amount);
    setErrors(validationError);

      if (validationError) {
    return;
  }

    const { data } = await api.post("/payments/create-order", {
      amount,
      campaignId: singleCampaign._id,
      email: userEmail,
      phone: mobileNumber,
    });

    const { order, key, paymentDBId } = data;

  const options = {
    key,
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,

    handler: async function (response) {
      // STEP 2: Verify payment
      const verify = await api.post("/payments/verify-payment", {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        userEmail,
        mobileNumber,
        paymentDBId,
        campaignId: singleCampaign._id
      });

      console.log("Payment Verified:", verify.data);

       navigate(`/donation/receipt/${verify.data.receiptId}`);
    },

    prefill: {
      email: userEmail,
      contact: mobileNumber,
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();



  };
  const tax = 0;
  const totalAmount = Number(amount || 0) + tax;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <div className="pt-24 flex justify-center items-start flex-grow pb-20">
        <div className="bg-white shadow-xl p-10 rounded-3xl w-[380px] border border-gray-200">
          <div className="w-full flex justify-center mb-8">
            <img
              src={campaign.image?.[0]}
              alt="Campaign"
              className="w-40 h-40 object-cover rounded-xl"
            />
          </div>

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

          {errors && <p className="text-red-500 text-sm mt-1">{errors}</p>}

          <hr className="my-5" />

          <div className="flex justify-between text-gray-700 mb-2">
            <span>Donating Amount</span>
            <span className="font-semibold">
              ₹ {Number(amount || 0).toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-gray-700 mb-2">
            <span>Tax</span>
            <span className="font-semibold">₹ {tax}</span>
          </div>

          <div className="flex justify-between text-gray-900 font-bold text-lg mt-3">
            <span>Total Amount</span>
            <span>₹ {totalAmount.toFixed(2)}</span>
          </div>

          <button
            onClick={handleDonate}
            className="mt-6 w-full bg-black text-white py-3 rounded-lg text-lg font-semibold hover:bg-gray-900 transition"
          >
            Donate
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

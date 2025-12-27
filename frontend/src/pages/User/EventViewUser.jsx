import React, { useEffect, useState } from "react";
import {
  User,
  ChevronLeft,
  ChevronRight,
  Share2,
  MessageCircle,
  Mail,
  CheckCircle2,
  MapPin,
  Calendar,
  Ticket,
  Menu,
} from "lucide-react";
import Navbar from "../../components/User/Navbar";
import Trudofooter from "../../components/reusable/footer";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { PaymentModal } from "../../components/User/PaymentModal";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return "Date not available";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const ImageGallery = ({ image, title }) => {
  return (
    <div className="relative w-full mb-8">
      <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden relative">
        <img
          // Use dynamic image or a fallback if array is empty
          src={
            image
              ? image
              : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000"
          }
          alt={title || "Event Image"}
          className="w-full h-full object-cover"
        />

        {/* Overlay text */}
        <div className="absolute bottom-4 left-4 text-white text-xs bg-black/50 px-3 py-1 rounded uppercase">
          {title || "EVENT"}
        </div>
      </div>
    </div>
  );
};

const TicketCard = ({
  value,
  setValue,
  event,
  baseAmount,
  gstAmount,
  totalAmount,
  getTicket,
  remainingTickets,
  totalTickets
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 sticky top-24">
    <h3 className="text-xl font-serif font-bold mb-6 text-gray-800">
      Join us to shape Tomorrow
    </h3>

    <div className="space-y-5">
      {/* Date */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">
          Date & Time
        </label>
        <div className="text-gray-600 text-sm border-b pb-2">
          {/* Dynamic Date and Time */}
          {formatDate(event?.date)}, {event?.eventTime || "Time TBA"}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">
          Location
        </label>
        <div className="text-gray-600 text-sm border-b pb-2">
          {/* Dynamic Venue */}
          {event?.venue || "Venue TBA"}
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-1">
          Ticket Price
        </label>
        {/* Dynamic Price */}
        <div className="text-gray-600 text-sm border-b pb-2">
          ₹{event?.ticketPrice}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          No. of Tickets
        </label>

        <div className="relative">
          <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
          >
            <option value="">Select tickets</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>

          {/* Dropdown Icon */}
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            ▼
          </span>
        </div>
      </div>
      <div className="text-sm text-gray-700 space-y-1">
        <p>Base Price: ₹{baseAmount}</p>
        <p>GST (18%): ₹{gstAmount}</p>
        <p className="font-bold text-black">Total: ₹{totalAmount}</p>
      </div>

      {/* Button */}
      <button
        className="w-full py-3 rounded-full border border-gray-800 text-gray-800 font-bold hover:bg-gray-800 hover:text-white transition"
        onClick={getTicket}
      >
        Get Tickets Now
      </button>

      {/* Remaining */}
      <div className="text-center text-red-400 text-xs font-medium">
        {/* Using totalTickets as remaining since 'sold' count wasn't provided in JSON, or you can calculate if data exists */}
        {remainingTickets} Tickets are remaining
      </div>
    </div>
  </div>
);

const CreatorBadge = ({ creatorName }) => (
  <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-3 inline-flex flex-col w-40 mt-8">
    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wide">
      Created by
    </span>
    {/* Dynamic Creator Name */}
    <span className="text-sm font-bold text-gray-800">
      {creatorName || "Unknown Host"}
    </span>
  </div>
);

const ActionStrip = () => (
  <div className="bg-gray-200/50 py-10 mt-12 flex justify-center gap-6">
    <button className="bg-black text-white px-8 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition shadow-lg">
      <MessageCircle className="text-green-400 fill-current" size={20} />
      <span className="font-medium">Whatsapp</span>
    </button>

    <button className="bg-black text-white px-8 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition shadow-lg">
      <Share2 className="text-white" size={20} />
      <span className="font-medium">Share</span>
    </button>
  </div>
);

// --- MAIN PAGE ---

export default function EventViewUserPage() {
  const [value, setValue] = useState(1);
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPayment, setShowPayment] = useState(false);
  const [lockExpiresAt, setLockExpiresAt] = useState(null);
  const [ticketId, setTicketId] = useState(null);

  const { eventId } = useParams();

  const navigate = useNavigate()
  const { userEmail , mobileNumber} = useSelector((state)=> state.auth)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/auth/users/events/${eventId}`);
        setEvent(res.data.event);
      } catch (err) {
        setError(err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  console.log(event)

  const remainingTickets =
  event?.remainingTickets?.remainingTickets ?? 0

  const GST_RATE = 0.18;

  const baseAmount = value * (event?.ticketPrice || 0);
  const gstAmount = Math.round(baseAmount * GST_RATE);
  const totalAmount = baseAmount + gstAmount;

  const getTicket = async () => {
    try {
      const res = await api.post("/auth/users/ticket/lock", {
        eventId,
        quantity: value,
      });

      setTicketId(res.data.ticketId);
      setLockExpiresAt(res.data.lockExpiresAt);
      setShowPayment(true);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Tickets Unavailable",
        text: err.response?.data?.message || "Something went wrong",
      });
    }
  };
  const handleClosePayment = () => {
    setShowPayment(false);
    setTicketId(null);
    setLockExpiresAt(null);
  };

  const handleExpire = () => {
    setShowPayment(false);
    setTicketId(null);
    setLockExpiresAt(null);
  };

  const handlePayment = async () => {
  // 1️⃣ Create order from backend
  const res = await api.post("/auth/users/payment/create-order", {
      amount: totalAmount,
      email: userEmail,
      phone: mobileNumber,
    });

    const {order , key ,paymentId} = res.data

  const options = {
    key,
    order_id: order.id,
    amount:  order.amount,
    currency: order.currency,

    handler: async function (response) {
     
      await api.post("/auth/users/payment/verify", {
        ticketId,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        paymentId,
        userEmail,
        mobileNumber,
        eventId
      });

      Swal.fire("Success", "Ticket booked successfully", "success")
        .then(() => navigate("/my-tickets"));
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};


  // Loading state placeholder (Optional but good for UX)
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        {/* Dynamic Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold mb-10 text-black">
          {event?.title || "Event Title"}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Content Column */}
          <div className="lg:col-span-8">
            {/* Dynamic Image Gallery */}
            <ImageGallery image={event?.images?.[0]} title={event?.title} />

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-black">
                About the Event
              </h2>
              {/* Dynamic Description */}
              <div className="space-y-3 text-sm leading-relaxed text-gray-700">
                <p>{event?.description}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">
                Who should attend
              </h2>
              {/* Keeping this static as the JSON didn't provide specific target audience data */}
              <ul className="space-y-2 text-sm text-gray-700 list-none">
                {[
                  "Entrepreneurs, Innovators & Startups",
                  "Software Developers & Engineers",
                  "Industry Professionals & Enthusiasts",
                  "Students & Academics interested in cutting-edge tech",
                ].map((item, i) => (
                  <li key={i} className="flex gap-2 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Dynamic Creator Badge (Assuming User object is nested in event based on logs) */}
            <CreatorBadge creatorName={event?.User?.userName} />

            <div className="mt-12 text-center text-lg font-medium text-gray-800">
              {/* Dynamic Contact Number */}
              For More details Please Contact :{" "}
              {event?.User?.mobileNumber || "N/A"}
            </div>
          </div>

          {/* Right Sidebar Column (Ticket Card) */}
          <div className="lg:col-span-4 relative">
            <div className="lg:-mt-24 z-10 relative">
              <TicketCard
                value={value}
                setValue={setValue}
                event={event}
                baseAmount={baseAmount}
                gstAmount={gstAmount}
                getTicket={getTicket}
                totalAmount={totalAmount}
                remainingTickets={remainingTickets}
              />
            </div>
          </div>
        </div>
        {showPayment && (
          <PaymentModal
            totalAmount={totalAmount}
            lockExpiresAt={lockExpiresAt}
            onPay={handlePayment}
            onClose={handleClosePayment}
            onExpire={handleExpire}
          />
        )}
      </main>

      <ActionStrip />
      <Trudofooter />
    </div>
  );
}

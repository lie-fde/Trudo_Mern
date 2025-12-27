// import React from "react";
// import Navbar from "../../components/User/Navbar.jsx";
// import frontImage from "../../assets/Front image .png";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// export default function Home() {
//   const userName = useSelector((state) => state.auth.userName);

//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-[#f8f9fb] flex flex-col">
//       <Navbar />
//       <div className="flex flex-col lg:flex-row items-center justify-between px-10 lg:px-20 py-16 gap-10">
//         <div className="lg:w-1/2">
//           <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
//             Transparent Giving <br />
//             for a Better <br />
//             Tomorrow | <span className="text-pink-600">Trudo</span>
//           </h1>

//           <p className="text-gray-600 mt-5 text-lg">
//             Welcome back,{" "}
//             <span className="font-semibold text-gray-800">{userName}</span> 👋
//             Empower change with trust & security.
//           </p>

//         <div className="flex gap-3 mt-6">
//   <button
//     onClick={() => navigate("/create-campaign")}
//     className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
//   >
//     Raise a Campaign
//   </button>

//   <button
//     onClick={() => navigate("/create-event")}
//     className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition"
//   >
//     Host an Event
//   </button>
// </div>

//         </div>

//         <div className="lg:w-1/2 flex justify-center">
//           <img
//             src={frontImage}
//             alt="Donation Illustration"
//             className="w-full max-w-lg drop-shadow-lg rounded-xl"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  Heart,
  Calendar,
  ShieldCheck,
  QrCode,
  ArrowRight,
  TrendingUp,
  Users,
  Award,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  Zap,
  Globe,
  PieChart,
  UserCheck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Navbar from "../../components/User/Navbar";
import Trudofooter from "../../components/reusable/footer";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const StatCard = ({ icon: Icon, label, value }) => (
    <div className="flex flex-col items-center md:items-start p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/5">
      <div className="p-3 bg-emerald-50 rounded-lg mb-4">
        <Icon className="text-emerald-600 w-6 h-6" />
      </div>
      <span className="text-3xl font-bold text-slate-900 mb-1">{value}</span>
      <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      {/* --- Hero Section --- */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/40 blur-[120px] rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/30 blur-[100px] rounded-full -ml-24 -mb-24" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full mb-8">
              <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                Unified Charity Ecosystem
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8">
              Empowering Charities, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500">
                Connecting Hearts.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl">
              Trudo is a secure bridge for charity raisers and event
              participants. Whether you're launching a campaign or joining a
              fundraiser, we ensure every rupee counts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-emerald-600/20 active:scale-95 group"
               onClick={()=> navigate("/events")}>
                Join an Event{" "}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 px-10 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-sm"
              onClick={()=> navigate("/create-campaign")}>
                Raise a Campaign
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-24 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={TrendingUp}
            label="Raised for Charities"
            value="₹12.5L+"
          />
          <StatCard icon={Users} label="Verified Supporters" value="4.2K+" />
          <StatCard icon={Globe} label="Active Campaigns" value="85+" />
          <StatCard icon={Award} label="Impact Verified" value="100%" />
        </div>
      </section>

      {/* --- The Two Paths Section --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How Can You Make an Impact?
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Trudo offers two distinct ways to engage with humanitarian causes,
              both built on security and transparency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Path 1: Campaign Raisers */}
            <div className="group p-10 bg-slate-50 rounded-[40px] border border-slate-100 hover:bg-emerald-50/30 hover:border-emerald-200 transition-all relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Heart size={120} />
              </div>
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-200">
                <TrendingUp className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                For Charity Raisers
              </h3>
              <p className="text-slate-600 leading-relaxed mb-8">
                Have a cause that needs support? Create a verified campaign and
                reach thousands of donors. We provide the tools to collect funds
                directly, ensuring your mission gets the resources it needs.
              </p>
              <ul className="space-y-4 mb-12">
                <li className="flex items-start gap-3 text-slate-700 font-medium">
                  <div className="mt-1 bg-emerald-100 rounded-full p-1">
                    <ShieldCheck size={14} className="text-emerald-600" />
                  </div>
                  Admin Verification for Trust
                </li>
                <li className="flex items-start gap-3 text-slate-700 font-medium">
                  <div className="mt-1 bg-emerald-100 rounded-full p-1">
                    <PieChart size={14} className="text-emerald-600" />
                  </div>
                  Real-time Donation Monitoring
                </li>
                <li className="flex items-start gap-3 text-slate-700 font-medium">
                  <div className="mt-1 bg-emerald-100 rounded-full p-1">
                    <Zap size={14} className="text-emerald-600" />
                  </div>
                  Funds Distributed Directly to Raisers
                </li>
              </ul>
              <button className="w-full mt-auto bg-white border border-emerald-200 text-emerald-700 py-4 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                onClick={()=> navigate("/create-campaign")}>
                Launch My Campaign
              </button>
            </div>

            {/* Path 2: Supporters */}
            <div className="group p-10 bg-slate-50 rounded-[40px] border border-slate-100 hover:bg-blue-50/30 hover:border-blue-200 transition-all relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Calendar size={120} />
              </div>
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200">
                <QrCode className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                For Event Participants
              </h3>
              <p className="text-slate-600 leading-relaxed mb-8">
                Join exclusive charity events organized by our trusted admin
                team. Purchase tickets securely and get instant QR code access
                for physical or digital event entry.
              </p>
              <ul className="space-y-4 mb-12">
                <li className="flex items-start gap-3 text-slate-700 font-medium">
                  <div className="mt-1 bg-blue-100 rounded-full p-1">
                    <CreditCard size={14} className="text-blue-600" />
                  </div>
                  Secure Razorpay Payments
                </li>
                <li className="flex items-start gap-3 text-slate-700 font-medium">
                  <div className="mt-1 bg-blue-100 rounded-full p-1">
                    <UserCheck size={14} className="text-blue-600" />
                  </div>
                  Instant QR Ticket Generation
                </li>
                <li className="flex items-start gap-3 text-slate-700 font-medium">
                  <div className="mt-1 bg-blue-100 rounded-full p-1">
                    <Zap size={14} className="text-blue-600" />
                  </div>
                  Digital Receipts & Certificates
                </li>
              </ul>
              <button className="w-full mt-auto bg-white border border-blue-200 text-blue-700 py-4 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                onClick={()=> navigate("/create-event")}>
                Host an Event
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Feature Breakdown: Verified Impact Journey --- */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              A Platform Built for{" "}
              <span className="text-emerald-600">Accountability.</span>
            </h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Trudo isn't just a donation site; it's a management ecosystem. We
              provide the infrastructure for transparency at every step of the
              journey.
            </p>

            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 shrink-0 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">
                    Strict Verification
                  </h4>
                  <p className="text-slate-500 text-sm">
                    Every campaign is manually reviewed by admins to prevent
                    fraud and ensure legitimacy before any funds are raised.
                  </p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 shrink-0 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">
                    Raiser Support
                  </h4>
                  <p className="text-slate-500 text-sm">
                    The platform empowers raisers by facilitating direct
                    collections and providing a dashboard to track their
                    progress.
                  </p>
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-12 h-12 shrink-0 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">
                    Transparent Transactions
                  </h4>
                  <p className="text-slate-500 text-sm">
                    Powered by Razorpay, all transactions are encrypted and
                    recorded, with automated receipt generation for donors.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* New Verified Impact Flow Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-600/5 blur-3xl rounded-full" />
            <div className="relative bg-white border border-slate-200 p-10 rounded-[40px] shadow-2xl">
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white z-10 relative">
                      <CheckCircle2 size={24} />
                    </div>
                    <div className="absolute top-12 left-1/2 w-0.5 h-12 bg-slate-100 -translate-x-1/2" />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl flex-grow border border-slate-100">
                    <p className="text-xs font-bold text-emerald-600 uppercase mb-1">
                      Step 01
                    </p>
                    <h5 className="font-bold text-slate-900">
                      Campaign Verified
                    </h5>
                    <p className="text-xs text-slate-500">
                      Admin team approved raising of ₹5,00,000
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white z-10 relative">
                      <Clock size={24} />
                    </div>
                    <div className="absolute top-12 left-1/2 w-0.5 h-12 bg-slate-100 -translate-x-1/2" />
                  </div>
                  <div className="bg-blue-50/50 p-4 rounded-2xl flex-grow border border-blue-100">
                    <p className="text-xs font-bold text-blue-600 uppercase mb-1">
                      Step 02
                    </p>
                    <h5 className="font-bold text-slate-900">
                      Fundraising Active
                    </h5>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-blue-500 h-full w-[65%]" />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 font-bold tracking-tight">
                      ₹3,25,000 RAISED SO FAR
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <QrCode size={24} />
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl flex-grow border border-slate-100 border-dashed">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                      Step 03
                    </p>
                    <h5 className="font-bold text-slate-400">
                      QR Event Access
                    </h5>
                    <p className="text-xs text-slate-400 italic">
                      Unlocks upon fundraiser completion
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Live Transparency Log
                  </span>
                </div>
                <button className="text-[11px] font-black text-emerald-600 uppercase hover:underline">
                  Verify On-Chain
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Trudofooter />
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  MapPin, 
  Clock, 
  Ticket as TicketIcon,
  Loader2,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import api from '../../api/api.js';
import { useParams , useNavigate } from 'react-router-dom';



const VerifyTicket = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { ticketId } = useParams();
  const navigate = useNavigate()

  // Simulation of the verification logic provided in the prompt
  useEffect(() => {
    const simulateVerification = async () => {
      setLoading(true);
      try {
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mocking a successful response matching the backend schema
        
        const res = await api.get(`/auth/users/verify-ticket/${ticketId}`);
        setData(res.data);

        
      } catch (err) {
        setError("Invalid ticket or network error");
      } finally {
        setLoading(false);
      }
    };

    simulateVerification();
  }, []);

  const handleReturn = () => {
    // In a real app with routing, this would be a navigation call
    navigate("/mytickets")
   
  };
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        {/* Branding/Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg mb-4">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Access Control</h1>
          <p className="text-slate-500 text-sm">Scan result for Ticket ID: #TKT-8829</p>
        </div>

        {loading ? (
          <LoadingState />
        ) : data?.valid ? (
          <SuccessTicket data={data} />
        ) : (
          <ErrorTicket message={data?.message || error} />
        )}

        {/* Action Button */}
        <button 
          onClick={handleReturn}
          className="mt-8 w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-semibold shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
        >
          <ArrowLeft size={18} />
          Return to My Tickets
        </button>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="bg-white p-12 rounded-3xl shadow-xl flex flex-col items-center border border-slate-100">
    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
    <p className="text-slate-500 font-medium animate-pulse">Verifying credentials...</p>
  </div>
);


const SuccessTicket = ({ data }) => (
  <div className="relative animate-in fade-in zoom-in duration-300">
    {/* Main Ticket Body */}
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
      {/* Status Header */}
      <div className="bg-emerald-500 p-6 flex flex-col items-center text-white">
        <CheckCircle2 size={48} className="mb-2 drop-shadow-md" />
        <h2 className="text-xl font-bold uppercase tracking-wider">Ticket Verified</h2>
      </div>

      {/* Perforated Divider Simulation */}
      <div className="relative flex items-center px-4 py-2">
        <div className="absolute -left-3 w-6 h-6 bg-slate-50 rounded-full border-r border-slate-100 shadow-inner"></div>
        <div className="w-full border-t-2 border-dashed border-slate-100"></div>
        <div className="absolute -right-3 w-6 h-6 bg-slate-50 rounded-full border-l border-slate-100 shadow-inner"></div>
      </div>

      {/* Event Details */}
      <div className="p-8 space-y-6">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Event Title</label>
          <h3 className="text-xl font-bold text-slate-800 leading-tight">{data.ticket.event}</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-indigo-500"><Calendar size={18} /></div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Date</label>
              <p className="text-sm font-semibold text-slate-700">{new Date(data.ticket.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 text-indigo-500"><Clock size={18} /></div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Time</label>
              <p className="text-sm font-semibold text-slate-700">{data.ticket.time}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-2 border-t border-slate-50">
          <div className="mt-1 text-indigo-500"><MapPin size={18} /></div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Venue</label>
            <p className="text-sm font-semibold text-slate-700 leading-relaxed">{data.ticket.venue}</p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="bg-slate-50 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TicketIcon size={14} className="text-slate-400" />
          <span className="text-[10px] font-mono text-slate-400">8229-4401-9923</span>
        </div>
        <div className="h-6 w-24 bg-gradient-to-r from-slate-200 to-slate-100 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

const ErrorTicket = ({ message }) => (
  <div className="bg-white p-8 rounded-3xl shadow-xl border-t-4 border-red-500 flex flex-col items-center text-center animate-in slide-in-from-bottom-4 duration-300">
    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
      <XCircle size={32} />
    </div>
    <h2 className="text-xl font-bold text-slate-800 mb-2">Verification Failed</h2>
    <p className="text-slate-500 mb-6 leading-relaxed">
      {message || "The scanned code does not correspond to a valid ticket in our database."}
    </p>
    <div className="w-full bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
      Reason: {message || "Invalid or Expired QR"}
    </div>
  </div>
);

export default VerifyTicket;
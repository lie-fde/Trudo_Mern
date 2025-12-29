import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  Search, 
  Clock, 
  ArrowRight,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  QrCode,
  Loader2,
  Users
} from 'lucide-react';
import Trudofooter from '../../components/reusable/footer';
import Navbar from '../../components/User/Navbar';
import api from '../../api/api'; 
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { QRModal } from '../../components/reusable/qrCodeModal';

const ITEMS_PER_PAGE = 6;

/* ---------------- Event Card Component ---------------- */
const EventCard = ({ event, onCancel , onViewQR}) => {
  const isCancelled = event.status === "Cancelled";
  const isExpired = event.status === "Expired";
  const isActive = event.status === "Active";
  const isLocked = event.status === "Locked";
  const isUpcoming = isActive || isLocked;

  return (
    <div className={`group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${(isExpired || isCancelled) ? 'opacity-90' : ''}`}>
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-orange-600 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
            {event.category}
          </span>
        </div>
        
        {(isCancelled || isExpired) && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className={`px-4 py-1 rounded-full text-sm font-bold text-white uppercase tracking-widest ${isCancelled ? 'bg-red-500/90' : 'bg-gray-600/90'}`}>
              {event.status}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 flex-grow">
            {event.title}
          </h3>
          {isLocked && (
            <span className="ml-2 bg-amber-50 text-amber-600 p-1 rounded-md" title="Locked">
              <AlertCircle className="w-4 h-4" />
            </span>
          )}
        </div>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="w-4 h-4 mr-2 text-orange-500" />
            <span>{event.date}</span>
            <span className="mx-2 font-light text-gray-300">|</span>
            <Clock className="w-4 h-4 mr-2 text-orange-500" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-orange-500" />
            <span className="line-clamp-1">{event.location}</span>
            <span className="mx-2 font-light text-gray-300">|</span>
            <Users  className="w-4 h-4 mr-2 text-orange-500"/>
            <span>{event.quantity}</span>
            <span/>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-tight">Price paid</p>
            <p className="text-lg font-bold text-gray-900">₹{event.price}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {isActive && (
              <button 
                onClick={() => onCancel(event.id)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-all font-bold text-xs"
                title="Cancel Ticket"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            )}

            <button 
             onClick={() => isUpcoming ? onViewQR(event) : null}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-bold transition-all ${
              (isExpired || isCancelled)
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                : 'bg-orange-600 text-white hover:bg-orange-700 shadow-md'
            }`}>
              <span className="text-xs whitespace-nowrap">
                {isUpcoming ? 'View QR' : 'Details'}
              </span>
              {isUpcoming ? <QrCode className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>


          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Main Page Component ---------------- */
export default function MyTickets() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate()

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);


  // --- Fetch Tickets ---
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const res = await api.get('/auth/users/my-tickets');
        const { active, expired, cancelled } = res.data.data;

        const normalize = (tickets) =>
          tickets.map(t => ({
            id: t._id,
            title: t.eventId.title,
            date: new Date(t.eventId.date).toDateString(),
            time: t.eventId.eventTime,
            location: t.eventId.venue,
            quantity:t.quantity,
            price: t.eventId.ticketPrice * t.quantity,
            category: t.eventId.category,
            image: t.eventId.images?.[0] || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800',
            status: t.status,
            qrCode: t.qrCode,
          }));

          console.log(res.data.data)

        setEvents([
          ...normalize(active),
          ...normalize(expired),
          ...normalize(cancelled),
        ]);
      } catch (err) {
        console.error('Failed to fetch tickets', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);


   const openQR = (event) => {
    setSelectedEvent(event);
    setIsQRModalOpen(true);
  };


  // --- Cancel Logic ---
const handleCancelTicket = async (ticketId) => {
  const result = await Swal.fire({
    title: "Cancel Ticket?",
    text: "This action cannot be undone. Refund will be initiated.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, cancel it",
    cancelButtonText: "No",
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  try {
    Swal.fire({
      title: "Cancelling...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    await api.patch(`/auth/users/tickets/cancel/${ticketId}`);
   

    Swal.fire({
      icon: "success",
      title: "Cancelled!",
      text: "Your ticket has been cancelled and refund is initiated.",
      timer: 2000,
      showConfirmButton: false,
    });

    // Update UI state
    setEvents((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status: "Cancelled" } : t
      )
    );

    setActiveTab("cancelled");
    
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Cancellation Failed",
      text:
        err.response?.data?.message ||
        "Unable to cancel ticket. Try again later.",
    });
  }
};


  // Reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [activeTab, searchQuery]);

  // --- Filtering Logic ---
  const filteredEvents = events.filter(event => {
    const tab = event.status === 'Cancelled' ? 'cancelled' : 
                event.status === 'Expired' ? 'past' : 'upcoming';
    
    return tab === activeTab && event.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2 uppercase">
              My Tickets
            </h1>
            <p className="text-gray-500 text-lg">
              Manage your event passes, track history, and handle cancellations.
            </p>
          </div>
        </section>

        {/* Controls Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your tickets..." 
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all text-sm font-medium"
              />
            </div>
            
            <div className="flex items-center p-1.5 bg-white border border-gray-200 rounded-2xl w-fit shadow-sm overflow-x-auto">
              {['upcoming', 'past', 'cancelled'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 capitalize whitespace-nowrap ${
                    activeTab === tab ? 'bg-orange-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'past' ? 'Past Events' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-orange-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Fetching your tickets...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedEvents.map(event => (
                  <EventCard key={event.id} event={event} onCancel={handleCancelTicket} onViewQR={openQR}/>
                ))}
              </div>

              {/* Empty State */}
              {filteredEvents.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                  <Ticket className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No {activeTab} tickets found</h3>
                  <p className="text-gray-500">Try adjusting your search or switching tabs.</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center space-x-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(totalPages)].map((_, idx) => (
                      <button
                        key={idx + 1}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                          currentPage === idx + 1 ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
        <QRModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        event={selectedEvent} 
      />

      <Trudofooter />
    </div>
  );
}
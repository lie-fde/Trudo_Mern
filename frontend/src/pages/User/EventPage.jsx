import React, { useEffect, useState, lazy, Suspense } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { fetchEventsApi, getEventsList } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/reusable/loader";

// 🔥 Lazy-loaded components
const Navbar = lazy(() => import("../../components/User/Navbar"));
const CTABanner = lazy(() => import("../../components/User/CTABanner"));
const Trudofooter = lazy(() => import("../../components/reusable/footer"));

const SearchBar = ({ search, setSearch, sort, setSort }) => (
  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center max-w-4xl mx-auto my-10 px-4">
    <div className="relative w-full sm:flex-1">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search events"
        className="w-full pl-4 pr-4 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      />
    </div>

    <select
      value={sort}
      onChange={(e) => setSort(e.target.value)}
      className="px-4 py-2 rounded-full border border-gray-300 text-sm"
    >
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
      <option value="nearby">Nearby</option>
    </select>
  </div>
);

const EventCard = ({ event, navigate }) => (
  <div
    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-3 h-full flex flex-col"
    onClick={() => navigate(`/events/${event._id}`)}
  >
    {/* Image Container - Matching the padded look from the screenshot */}
    <div className="relative h-56 w-full rounded-xl overflow-hidden mb-3 group">
      <img
        src={event.images[0]}
        alt={event.title}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
      />
      {/* Optional: Overlay gradient for better text visibility if needed, or badging */}
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-gray-800 shadow-sm">
        Public Event
      </div>
    </div>

    <div className="flex flex-col flex-1 px-1">
      {/* Title */}
      <h3 className="font-bold text-gray-900 text-lg leading-snug mb-3 line-clamp-2">
        {event.title}
      </h3>

      <div className="mt-auto space-y-3">
        {/* Price and Action Button */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-2xl text-gray-800">
            ₹ {event.ticketPrice}
          </span>
          <button className="px-5 py-2 rounded-full border-2 border-gray-900 text-sm font-semibold text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300">
            Get Ticket
          </button>
        </div>

        {/* Tickets Remaining (Dummy Data as requested) */}
        <div className="text-center">
          <p className="text-red-500 font-medium text-sm">
            {event.totalTickets} Ticket Remaining
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100 w-full my-1"></div>
        {console.log(event)}
        {/* Created By & Venue */}
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            Created by{" "}
            <span className="font-semibold text-gray-800">
              {event.createdBy}
            </span>
          </p>
          {event.venue && (
            <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1 mt-1">
              <MapPin size={12} /> {event.venue}
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const Pagination = ({ page, totalPages, setPage }) => (
  <div className="flex items-center justify-center gap-4 my-12">
    <button
      disabled={page === 1}
      onClick={() => setPage((p) => p - 1)}
      className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center disabled:opacity-50"
    >
      <ChevronLeft />
    </button>

    <span className="font-bold">
      {page} / {totalPages}
    </span>

    <button
      disabled={page === totalPages}
      onClick={() => setPage((p) => p + 1)}
      className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center disabled:opacity-50"
    >
      <ChevronRight />
    </button>
  </div>
);

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("EventPage mounted");
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);

      const res = await getEventsList(page, 8, search, sort);

      setEvents(res.data.events);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      loadEvents();
    }, 400); // 400ms debounce

    return () => clearTimeout(delay);
  }, [search, sort]);

  // 🔥 Pagination only
  useEffect(() => {
    loadEvents();
  }, [page]);

  return (
    // <Suspense fallback={<Loader/>}>
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pb-20">
        <SearchBar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
        />

        {loading ? (
          <p className="text-center mt-10">Loading events...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event._id} event={event} navigate={navigate} />
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </main>

      <CTABanner />
      <Trudofooter />
    </div>
    // </Suspense>
  );
};

export default EventPage;

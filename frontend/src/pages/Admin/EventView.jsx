import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleEvent } from "../../store/eventSlice.js";

import AdminNavbar from "../../components/Admin/AdminNavbar.jsx";
import AdminSidebar from "../../components/Admin/AdminSidebar.jsx";

const cleanMongoData = (data) => {
  const event = {};
  for (const key in data) {
    let value = data[key];

    if (typeof value === "object" && value !== null) {
      if (value.$oid) value = value.$oid;
      else if (value.$date?.$numberLong)
        value = new Date(parseInt(value.$date.$numberLong)).toISOString();
      else if (value.$numberInt) value = parseInt(value.$numberInt);
    }

    event[key] = value;
  }

  delete event.__v;
  return event;
};

const MediaCarousel = ({ mediaList }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!mediaList.length) return null;

  const prevMedia = () =>
    setCurrentIndex((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1));

  const nextMedia = () =>
    setCurrentIndex((prev) => (prev === mediaList.length - 1 ? 0 : prev + 1));

  const currentMedia = mediaList[currentIndex];

  return (
    <div className="relative flex flex-col justify-center mb-10 bg-white p-6 rounded-2xl shadow border border-gray-200">
      <div className="flex items-center justify-center w-full overflow-hidden rounded-xl bg-gray-50 border">
        <img
          src={currentMedia.url}
          alt=""
          className="w-full h-[420px] object-contain rounded-xl"
          onError={(e) => {
            e.target.src =
              "https://placehold.co/800x400/94A3B8/FFFFFF?text=Image+Not+Available";
          }}
        />
      </div>

      {mediaList.length > 1 && (
        <>
          <button
            onClick={prevMedia}
            className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={nextMedia}
            className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gray-900/60 text-white text-sm rounded-b-xl text-center">
        {currentIndex + 1} / {mediaList.length}
      </div>
    </div>
  );
};

export default function EventView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();

  const { singleEvent, loading } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(fetchSingleEvent(id));
  }, [id, dispatch]);

  if (loading || !singleEvent) {
    return <p className="p-10 text-center text-lg">Loading Event...</p>;
  }

  console.log(singleEvent);

  const event = cleanMongoData(singleEvent);

  const mediaList = (event.images || []).map((url) => ({
    url,
    type: "Event Image",
  }));

  // FILTER FIELDS FOR REVIEW
  const eventDetails = Object.entries(event)
    .filter(([key, value]) => {
      if (typeof value === "object") return false;

      return ![
        "description",
        "images",
        "isDeleted",
        "isBlocked",
        "User",
        "__v",
        "updatedAt",
        "createdAt",
      ].includes(key);
    })
    .map(([key, value]) => {
      const displayKey = key.replace(/([A-Z])/g, " $1").trim();
      const displayValue = value ?? "N/A";
      return { key: displayKey, value: displayValue };
    });

  return (
    <div className="flex w-full bg-gray-100 min-h-screen">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: collapsed ? 80 : 240, paddingTop: 72 }}
      >
        <AdminNavbar collapsed={collapsed} />

        <div className="py-10 flex justify-center">
          <div className="w-full max-w-[1000px] px-4">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm text-gray-500">
                Dashboard › Event Request ›{" "}
                <span className="font-semibold text-gray-800">Event View</span>
              </span>

              <button
                onClick={() => navigate(-1)}
                className="bg-gray-800 text-white px-5 py-2 rounded-lg shadow hover:bg-gray-700"
              >
                Back
              </button>
            </div>

            {/* Title */}
            <h2 className="text-4xl font-extrabold mb-6 text-gray-900 text-center">
              {event.title}
            </h2>

            {/* CAROUSEL */}
            <MediaCarousel mediaList={mediaList} />

            {/* STORY + INFO */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Story */}
              <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow">
                <h3 className="text-2xl font-bold mb-4">About the Event</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Right Info */}
              <div className="space-y-6">
                {/* Event Basic Info */}
                <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-teal-500">
                  <p className="text-xl font-bold mb-2 text-teal-600">
                    Event Details
                  </p>
                  <p className="font-semibold">📍 Venue: {event.venue}</p>
                  <p>🕒 Time: {event.eventTime}</p>
                  <p>📅 Date: {new Date(event.date).toDateString()}</p>
                  <p>⏳ Duration: {event.duration} mins</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Category:{" "}
                    <span className="font-semibold">{event.category}</span>
                  </p>
                </div>

                {/* Tickets */}
                <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-purple-500">
                  <p className="font-bold text-lg mb-3">Ticket Info</p>
                  <p>🎟 Ticket Price: ₹ {event.ticketPrice}</p>
                  <p>🎫 Total Tickets: {event.totalTickets}</p>
                </div>

                {/* Status */}
                <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-blue-500">
                  <p className="font-bold text-lg">Status</p>
                  <p className="text-gray-900 text-base mt-2">{event.status}</p>

                  {event.rejectionReason && (
                    <p className="mt-2 text-red-500 text-sm">
                      Reason: {event.rejectionReason}
                    </p>
                  )}

                  {event.approvalDate && (
                    <p className="mt-2 text-green-600 text-sm">
                      Approved On: {new Date(event.approvalDate).toDateString()}
                    </p>
                  )}
                </div>

                {/* Created By */}
                <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-orange-500">
                  <p className="font-bold text-lg mb-3">Created By</p>
                  <p className="text-gray-800 text-base">
                    👤 {event.User?.userName || "N/A"}
                  </p>
                  <p className="text-gray-800 text-base mt-2">
                    📧 {event.User?.userEmail || "N/A"}
                  </p>
                  <p className="text-gray-800 text-base mt-2">
                    📱 {event.User?.mobileNumber || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

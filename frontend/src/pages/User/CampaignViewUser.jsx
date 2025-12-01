import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, FileSearch, Heart } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicSingleCampaign } from "../../store/campaignUserSlice.js";

import Navbar from "../../components/User/Navbar.jsx";
import Trudofooter from "../../components/reusable/footer.jsx";

// ------------------------------------------------------------------
// CLEAN MONGO DATA
// ------------------------------------------------------------------
const cleanMongoData = (data) => {
  const campaign = {};
  for (const key in data) {
    let value = data[key];

    if (typeof value === "object" && value !== null) {
      if (value.$oid) value = value.$oid;
      else if (value.$date?.$numberLong)
        value = new Date(parseInt(value.$date.$numberLong)).toISOString();
      else if (value.$numberInt) value = parseInt(value.$numberInt);
    }

    if (key === "bankDetails" && typeof value === "object") {
      campaign.bankAccountNumber = value.accountNumber;
      campaign.bankIFSCCode = value.IFSCCode;
    } else {
      campaign[key] = value;
    }
  }

  delete campaign.__v;
  return campaign;
};

// ------------------------------------------------------------------
// MEDIA CAROUSEL
// ------------------------------------------------------------------
const MediaCarousel = ({ mediaList }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!mediaList.length) return null;

  const prevMedia = () =>
    setCurrentIndex((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1));

  const nextMedia = () =>
    setCurrentIndex((prev) =>
      prev === mediaList.length - 1 ? 0 : prev + 1
    );

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
            className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-3 rounded-full shadow"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={nextMedia}
            className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur p-3 rounded-full shadow"
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

// ------------------------------------------------------------------
// MAIN PAGE (NO SIDEBAR VERSION)
// ------------------------------------------------------------------
export default function CampaignViewUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { singleCampaign, loading } = useSelector((state) => state.campaignPublic);

  useEffect(() => {
    dispatch(fetchPublicSingleCampaign(id));
  }, [id, dispatch]);

  if (loading || !singleCampaign) {
    return <p className="p-10 text-center text-lg">Loading campaign...</p>;
  }

  const campaign = cleanMongoData(singleCampaign);

  const mediaList = (campaign.image || []).map((url) => ({
    url,
    type: "Campaign Image",
  }));

  return (
    <div className="w-full bg-gray-100 min-h-screen">

      {/* STATIC NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <div className="pt-15 pb-16 w-full flex justify-center">
        <div className="w-full max-w-[1100px] px-4">

          {/* Breadcrumb */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-sm text-gray-500">
              Campaigns › <span className="font-semibold text-gray-800">View</span>
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
            {campaign.title}
          </h2>

          {/* CAROUSEL */}
          <MediaCarousel mediaList={mediaList} />

          {/* STORY + INFO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Story */}
            <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow">
              <h3 className="text-2xl font-bold mb-4">The Story</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {campaign.description}
              </p>
            </div>

            {/* Right Info */}
            <div className="space-y-6">

              {/* Target */}
              <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-teal-500">
                <p className="text-xl font-bold mb-2 text-teal-600">
                  Target Amount
                </p>
                <p className="text-3xl font-extrabold text-gray-900">
                  ₹ {campaign.targetAmount?.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Category:{" "}
                  <span className="font-semibold">{campaign.category}</span>
                </p>
              </div>

              {/* Location */}
              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="font-bold text-lg mb-3">Location & Details</p>
                <p>📍 Location: {campaign.location}</p>
                <p>🧑 Beneficiary: {campaign.beneficiary}</p>
                <p>Status: {campaign.status}</p>
              </div>

              {/* -------------------------- */}
              {/* CREATED BY CARD (NEW)     */}
              {/* -------------------------- */}
              <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-purple-500">
                <p className="font-bold text-lg mb-3">Created By</p>
                <p className="text-gray-800 text-base">👤 {campaign.User?.userName || "N/A"}</p>
                <p className="text-gray-800 text-base mt-2">📧 {campaign.User?.userEmail || "N/A"}</p>
                <p className="text-gray-800 text-base mt-2">📱 {campaign.User?.mobileNumber || "N/A"}</p>
              </div>

              {/* Verification Docs */}
              <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-blue-500">
                <p className="font-bold mb-3">Verification Documents</p>

                {campaign.beneficiaryDocuments?.length > 0 ? (
                  <button
                    onClick={() =>
                      window.open(campaign.beneficiaryDocuments[0], "_blank")
                    }
                    className="flex items-center justify-center bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FileSearch size={18} className="mr-2" />
                    View Beneficiary Proof
                  </button>
                ) : (
                  <p className="text-sm text-red-500">No Beneficiary Document</p>
                )}

                {campaign.organizationIDProof?.length > 0 ? (
                  <button
                    onClick={() =>
                      window.open(campaign.organizationIDProof[0], "_blank")
                    }
                    className="mt-4 flex items-center justify-center bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FileSearch size={18} className="mr-2" />
                    View Organization Proof
                  </button>
                ) : (
                  <p className="text-sm text-red-500 mt-2">No Organization Document</p>
                )}
              </div>

              {/* Donation */}
              <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-emerald-500">
                <p className="font-bold mb-3 text-lg">Support this Cause</p>
                <p className="text-sm text-gray-600 mb-4">
                  Your contribution directly helps {campaign.beneficiary || "the beneficiary"}.
                </p>

                <button
                  onClick={() => navigate(`/campaigns/${campaign._id}/donate`)}
                  className="flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white w-full py-3 rounded-lg font-bold text-lg shadow-md transition-all transform hover:scale-[1.02]"
                >
                  <Heart size={20} className="mr-2 fill-current" />
                  Donate Now
                </button>
              </div>
            </div>
          </div>

          {/* DATA REVIEW */}
          <div className="mt-12 bg-white p-8 rounded-2xl shadow border-t-4 border-gray-400">
            <h3 className="text-2xl font-bold mb-6">Campaign Data Review</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* You can remove this section if no longer needed */}
              {Object.entries(campaign)
                .filter(([key, value]) => {
                  if (typeof value === "object") return false;
                  return ![
                    "description",
                    "organizationIDProof",
                    "image",
                    "beneficiaryDocuments",
                    "__v",
                    "isDeleted",
                    "isBlocked",
                    "_id",
                    "User"
                  ].includes(key);
                })
                .map(([key, value], index) => (
                  <div key={index} className="border-b pb-2">
                    <p className="text-xs text-gray-500 uppercase">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="font-medium text-gray-900 break-words">
                      {value ?? "N/A"}
                    </p>
                  </div>
                ))}
            </div>
          </div>

        </div>
      </div>
      <Trudofooter/>

    </div>
  );
}

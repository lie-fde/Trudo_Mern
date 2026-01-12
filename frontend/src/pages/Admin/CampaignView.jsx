import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, FileSearch } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleCampaign } from "../../store/campaignSlice.js";

import AdminNavbar from "../../components/Admin/AdminNavbar.jsx";
import AdminSidebar from "../../components/Admin/AdminSidebar.jsx";
import adminApi from "../../api/adminApi.js";

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
// MAIN PAGE
// ------------------------------------------------------------------
export default function CampaignView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const [raisedAmount, setRaisedAmount] = useState(0);

  const { singleCampaign, loading } = useSelector((state) => state.campaign);

  useEffect(() => {
    dispatch(fetchSingleCampaign(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (!id) return;

    const fetchRaisedAmount = async () => {
      try {
        const res = await adminApi.get(`/campaign/raisedAmountAdmin/${id}`);
        setRaisedAmount(res.data.raisedAmount || 0);
      } catch (error) {
        console.error("Failed to fetch raised amount", error);
        setRaisedAmount(0);
      }
    };

    fetchRaisedAmount();
  }, [id]);

  if (loading || !singleCampaign) {
    return <p className="p-10 text-center text-lg">Loading campaign...</p>;
  }

  const campaign = cleanMongoData(singleCampaign);

  const mediaList = (campaign.image || []).map((url) => ({
    url,
    type: "Campaign Image",
  }));

  const campaignDetails = Object.entries(campaign)
    .filter(([key, value]) => {
      if (typeof value === "object" && !Array.isArray(value)) return false;
      return ![
        "description",
        "organizationIDProof",
        "image",
        "beneficiaryDocuments",
        "__v",
        "isDeleted",
      ].includes(key);
    })
    .map(([key, value]) => {
      const displayKey = key.replace(/([A-Z])/g, " $1").trim();
      let displayValue = value;
      if (Array.isArray(value)) displayValue = `${value.length} item(s)`;
      if (value === null) displayValue = "N/A";
      return { key: displayKey, value: displayValue };
    });

  return (
    <div className="flex w-full bg-gray-100 min-h-screen">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: collapsed ? 80 : 240, paddingTop: 72 }}
      >
        <AdminNavbar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* MAIN PAGE CENTERED CONTAINER */}
        <div className="py-10 flex justify-center">
          <div className="w-full max-w-[1000px] px-4">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm text-gray-500">
                Dashboard › Campaign Request ›{" "}
                <span className="font-semibold text-gray-800">
                  Campaign View
                </span>
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

                <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-green-500">
                  <p className="text-xl font-bold mb-2 text-green-600">
                    Raised Amount
                  </p>
                  <p className="text-3xl font-extrabold text-gray-900">
                    ₹ {raisedAmount?.toLocaleString()}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    {raisedAmount >= campaign.targetAmount
                      ? "🎉 Campaign goal reached"
                      : `₹ ${(
                          campaign.targetAmount - raisedAmount
                        ).toLocaleString()} more needed`}
                  </p>
                </div>

                {/* Location */}
                <div className="bg-white p-6 rounded-2xl shadow">
                  <p className="font-bold text-lg mb-3">Location & Details</p>
                  <p>📍 Location: {campaign.location}</p>
                  <p>🧑 Beneficiary: {campaign.beneficiary}</p>
                  <p>Status: {campaign.status}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-purple-500">
                  <p className="font-bold text-lg mb-3">Created By</p>
                  <p className="text-gray-800 text-base">
                    👤 {campaign.User?.userName || "N/A"}
                  </p>
                  <p className="text-gray-800 text-base mt-2">
                    📧 {campaign.User?.userEmail || "N/A"}
                  </p>
                  <p className="text-gray-800 text-base mt-2">
                    📱 {campaign.User?.mobileNumber || "N/A"}
                  </p>
                </div>

                {/* Docs */}
                <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-blue-500">
                  <p className="font-bold mb-3">Verification Documents</p>

                  {campaign.beneficiaryDocuments?.length > 0 ? (
                    <button
                      onClick={() =>
                        window.open(campaign.beneficiaryDocuments[0], "_blank")
                      }
                      className="flex items-center justify-center bg-blue-600 text-white w-full py-2 rounded-lg"
                    >
                      <FileSearch size={18} className="mr-2" />
                      View Beneficiary Proof
                    </button>
                  ) : (
                    <p className="text-sm text-red-500">
                      No Beneficiary Document
                    </p>
                  )}

                  {campaign.organizationIDProof?.length > 0 ? (
                    <button
                      onClick={() =>
                        window.open(campaign.organizationIDProof[0], "_blank")
                      }
                      className="mt-4 flex items-center justify-center bg-blue-600 text-white w-full py-2 rounded-lg"
                    >
                      <FileSearch size={18} className="mr-2" />
                      View Organization Proof
                    </button>
                  ) : (
                    <p className="text-sm text-red-500 mt-2">
                      No Organization Document
                    </p>
                  )}
                </div>
              </div>
            </div>
            {console.log(campaignDetails)}

            {/* DATA REVIEW */}
            <div className="mt-12 bg-white p-8 rounded-2xl shadow border-t-4 border-gray-400">
              <h3 className="text-2xl font-bold mb-6">Campaign Data Review</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {campaignDetails.map((item, index) => (
                  <div key={index} className="border-b pb-2">
                    <p className="text-xs text-gray-500 uppercase">
                      {item.key}
                    </p>
                    <p className="font-medium text-gray-900 break-words">
                      {typeof item.value === "boolean"
                        ? item.value
                          ? "Yes"
                          : "No"
                        : typeof item.value === "string" &&
                          item.value.includes("T")
                        ? new Date(item.value).toLocaleDateString("en-IN")
                        : item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

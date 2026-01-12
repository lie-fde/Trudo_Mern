import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import Trudofooter from "../../components/reusable/footer";
import Navbar from "../../components/User/Navbar";

const Contact = () => {
  return (
    <>
      <Navbar />

      {/* PAGE CONTENT */}
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 space-y-6">
          {/* CALL US */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white">
              <Phone size={18} />
            </div>
            <div>
              <h3 className="font-semibold">Call To Us</h3>
              <p className="text-sm text-gray-600">
                We are available 24/7, 7 days a week.
              </p>
              <p className="text-sm font-medium mt-1">
                Phone: +91 9000-000-000
              </p>
            </div>
          </div>

          <hr />

          {/* WRITE TO US */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white">
              <Mail size={18} />
            </div>
            <div>
              <h3 className="font-semibold">Write To Us</h3>
              <p className="text-sm text-gray-600">
                Fill out our form and we will contact you within 24 hours.
              </p>
              <p className="text-sm font-medium mt-2">customer@trudo.com</p>
              <p className="text-sm font-medium">support@trudo.com</p>
            </div>
          </div>

          <hr />

          {/* ADDRESS */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
              <MapPin size={18} />
            </div>
            <p className="text-sm text-gray-700">
              Trudo Group, Thalore Valley,
              <br />
              Thrissur, Kerala 680306
              <br />
              India
            </p>
          </div>
        </div>
      </main>

      <Trudofooter />
    </>
  );
};

export default Contact;

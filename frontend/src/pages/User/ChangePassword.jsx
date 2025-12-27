// import React, { useState, useEffect } from 'react';
// import { 
//   Eye, 
//   EyeOff,
//   ChevronRight, 
//   CheckCircle2,
//   AlertCircle,
//   ArrowLeft,
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../../components/User/Navbar';

// const ChangePasswordProfile = () => {
//   const [showCurrent, setShowCurrent] = useState(false);
//   const [showNew, setShowNew] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [status, setStatus] = useState(null);

//   const [formData, setFormData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });

//   const [strength, setStrength] = useState(0);
//   const navigate = useNavigate()

//   useEffect(() => {
//     let score = 0;
//     if (formData.newPassword.length >= 8) score++;
//     if (/[A-Z]/.test(formData.newPassword)) score++;
//     if (/[0-9]/.test(formData.newPassword)) score++;
//     if (/[^A-Za-z0-9]/.test(formData.newPassword)) score++;
//     setStrength(score);
//   }, [formData.newPassword]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setStatus(null);

//     // Simulate API call
//     setTimeout(() => {
//       if (formData.newPassword !== formData.confirmPassword) {
//         setStatus('error');
//         setIsLoading(false);
//       } else {
//         setStatus('success');
//         setIsLoading(false);
//         setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
//       }
//     }, 1200);
//   };

//   const strengthColors = ['bg-slate-200', 'bg-rose-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-500'];

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
//      <Navbar/>

//       {/* Centered Form Content */}
//       <main className="max-w-lg mx-auto px-4 py-12 md:py-20">
//         <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 text-sm font-medium group"
//          onClick={()=>navigate("/profile")}>
//           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//           Back to Security Settings
//         </button>

//         <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
//           <div className="p-8 pb-4">
//             <h1 className="text-2xl font-bold text-slate-800">Change Password</h1>
//             <p className="text-sm text-slate-500 mt-2">
//               Please enter your current password to confirm your identity before choosing a new one.
//             </p>
//           </div>

//           <div className="p-8 pt-4">
//             {status === 'success' && (
//               <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-700 animate-in fade-in slide-in-from-top-2">
//                 <CheckCircle2 className="w-5 h-5" />
//                 <p className="text-sm font-medium">Password updated successfully!</p>
//               </div>
//             )}

//             {status === 'error' && (
//               <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-700 animate-in shake duration-300">
//                 <AlertCircle className="w-5 h-5" />
//                 <p className="text-sm font-medium">Passwords do not match. Please check again.</p>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-5">
//               {/* Current Password Field */}
//               <div className="space-y-1.5">
//                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Current Password</label>
//                 <div className="relative group">
//                   <input
//                     type={showCurrent ? "text" : "password"}
//                     name="currentPassword"
//                     value={formData.currentPassword}
//                     onChange={handleChange}
//                     className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
//                     placeholder="Enter current password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowCurrent(!showCurrent)}
//                     className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
//                   >
//                     {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//               </div>

//               <div className="h-px bg-slate-100 my-2" />

//               {/* New Password Field */}
//               <div className="space-y-1.5">
//                 <div className="flex justify-between items-center px-1">
//                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
//                   <div className="flex gap-1">
//                     {[1, 2, 3, 4].map((step) => (
//                       <div key={step} className={`w-3 h-1 rounded-full ${strength >= step ? strengthColors[strength] : 'bg-slate-100'}`} />
//                     ))}
//                   </div>
//                 </div>
//                 <div className="relative group">
//                   <input
//                     type={showNew ? "text" : "password"}
//                     name="newPassword"
//                     value={formData.newPassword}
//                     onChange={handleChange}
//                     className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
//                     placeholder="Create new password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowNew(!showNew)}
//                     className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
//                   >
//                     {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//               </div>

//               {/* Confirm Password Field */}
//               <div className="space-y-1.5">
//                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Confirm New Password</label>
//                 <div className="relative group">
//                   <input
//                     type={showConfirm ? "text" : "password"}
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
//                     placeholder="Repeat new password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirm(!showConfirm)}
//                     className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
//                   >
//                     {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//               </div>

//               <div className="pt-4">
//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full bg-slate-900 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-indigo-600 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
//                 >
//                   {isLoading ? (
//                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   ) : (
//                     <>
//                       <span>Update Password</span>
//                       <ChevronRight className="w-4 h-4" />
//                     </>
//                   )}
//                 </button>
//                 <button
//                   type="button"
//                   className="w-full mt-3 text-slate-500 text-sm font-semibold py-2 hover:text-slate-800 transition-colors"
//                   onClick={()=>navigate("/profile")}
//                 >
//                   Discard changes
//                 </button>
//               </div>
//             </form>
//           </div>
          
//           <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex items-center gap-3">
//              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
//              <p className="text-[11px] text-slate-500 font-medium">
//                This will sign you out from all other active devices.
//              </p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ChangePasswordProfile;

import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff,
  ChevronRight, 
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/User/Navbar';
import api from '../../api/api'; // ✅ axios instance
import Swal from 'sweetalert2';

const ChangePasswordProfile = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [strength, setStrength] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let score = 0;
    if (formData.newPassword.length >= 8) score++;
    if (/[A-Z]/.test(formData.newPassword)) score++;
    if (/[0-9]/.test(formData.newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(formData.newPassword)) score++;
    setStrength(score);
  }, [formData.newPassword]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 ONLY THIS FUNCTION CHANGED
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setStatus('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await api.put('/auth/users/changePassword-UserProfile', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setStatus('success');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });

      Swal.fire({
        icon: 'success',
        title: 'Password Updated',
        text: 'Your password has been changed successfully',
        timer: 1800,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate('/profile');
      }, 1800);

    } catch (error) {
      setStatus('Password update failed. Please try again.');

      Swal.fire(
        'Update Failed',
        error.response?.data?.message || 'Something went wrong',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const strengthColors = ['bg-slate-200', 'bg-rose-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-500'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <Navbar />

      <main className="max-w-lg mx-auto px-4 py-12 md:py-20">
        <button
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 text-sm font-medium group"
          onClick={() => navigate("/profile")}
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Security Settings
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="p-8 pb-4">
            <h1 className="text-2xl font-bold text-slate-800">Change Password</h1>
            <p className="text-sm text-slate-500 mt-2">
              Please enter your current password to confirm your identity before choosing a new one.
            </p>
          </div>

          <div className="p-8 pt-4">
          {status && (
  <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-700">
    <AlertCircle className="w-5 h-5" />
    <p className="text-sm font-medium">{status}</p>
  </div>
)}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* --- ALL YOUR INPUT FIELDS UNCHANGED --- */}
              {/* (kept exactly same as you sent) */}
              {/* Submit Button */}
              <div className="space-y-1.5">
  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
    Current Password
  </label>
  <div className="relative group">
    <input
      type={showCurrent ? "text" : "password"}
      name="currentPassword"
      value={formData.currentPassword}
      onChange={handleChange}
      className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
      placeholder="Enter current password"
      required
    />
    <button
      type="button"
      onClick={() => setShowCurrent(!showCurrent)}
      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
    >
      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  </div>
</div>

<div className="h-px bg-slate-100 my-2" />

{/* New Password Field */}
<div className="space-y-1.5">
  <div className="flex justify-between items-center px-1">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
      New Password
    </label>
    <div className="flex gap-1">
      {[1, 2, 3, 4].map((step) => (
        <div
          key={step}
          className={`w-3 h-1 rounded-full ${
            strength >= step ? strengthColors[strength] : "bg-slate-100"
          }`}
        />
      ))}
    </div>
  </div>

  <div className="relative group">
    <input
      type={showNew ? "text" : "password"}
      name="newPassword"
      value={formData.newPassword}
      onChange={handleChange}
      className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
      placeholder="Create new password"
      required
    />
    <button
      type="button"
      onClick={() => setShowNew(!showNew)}
      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
    >
      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  </div>
</div>

{/* Confirm Password Field */}
<div className="space-y-1.5">
  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
    Confirm New Password
  </label>
  <div className="relative group">
    <input
      type={showConfirm ? "text" : "password"}
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleChange}
      className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
      placeholder="Repeat new password"
      required
    />
    <button
      type="button"
      onClick={() => setShowConfirm(!showConfirm)}
      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
    >
      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  </div>
</div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-indigo-600 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Update Password</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="w-full mt-3 text-slate-500 text-sm font-semibold py-2 hover:text-slate-800 transition-colors"
                  onClick={() => navigate("/profile")}
                >
                  Discard changes
                </button>
              </div>
            </form>
          </div>

          <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <p className="text-[11px] text-slate-500 font-medium">
              This will sign you out from all other active devices.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChangePasswordProfile;

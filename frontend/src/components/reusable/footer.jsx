// import React from "react";


// export function TrudoFooter() {
// return (
// <footer className="trudo-footer">
// <div className="trudo-footer__inner">
// <div className="brand">
// <div className="logo">Trudo</div>
// </div>
// <div className="cols">
// <div className="col">
// <h4>Sitemap</h4>
// <ul>
// <li>Home</li>
// <li>Donate</li>
// <li>Volunteer Campaign</li>
// <li>Events</li>
// <li>Contact us</li>
// </ul>
// </div>
// <div className="col">
// <h4>Socials</h4>
// <ul>
// <li>Facebook</li>
// <li>LinkedIn</li>
// <li>Instagram</li>
// <li>Twitter</li>
// </ul>
// </div>
// <div className="col">
// <h4>Head Office</h4>
// <p>
// Xilliams Corner Wine © 2017. 1112 A Market St<br /># Ste B22, Charlottesville,
// CA 45565
// </p>
// </div>
// <div className="col newsletter">
// <h4>News Letter</h4>
// <input className="newsletter-input" placeholder="Enter your email address" />
// </div>
// </div>
// </div>
// <style>{`
// .trudo-footer{background:#07122a;color:#dfe9f2;padding:48px 24px 24px;}
// .trudo-footer__inner{max-width:1100px;margin:0 auto;display:flex;gap:32px;align-items:flex-start}
// .brand .logo{background:linear-gradient(180deg,#e6f2ff,#fff);color:#0b2b4a;padding:18px;border-radius:14px;font-weight:700}
// .cols{display:flex;flex:1;gap:28px}
// .col h4{margin:0 0 8px;font-size:14px}
// .col ul{list-style:none;padding:0;margin:0}
// .col p{font-size:13px;line-height:1.4}
// .newsletter-input{background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.12);padding:8px;color:inherit}
// @media(max-width:900px){.trudo-footer__inner{flex-direction:column;gap:20px}}
// `}</style>
// </footer>
// );
// }
import React from 'react';
import { Mail } from 'lucide-react';

const Trudofooter = () => {
  return (
    <div className="bg-gray-100 flex flex-col">
      {/* Embed fonts and custom styles directly. 
        In a real app, these imports usually go in CSS files or index.html.
      */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Lato:wght@300;400&family=Playfair+Display:wght@400;600&display=swap');
          
          .font-cinzel { font-family: 'Cinzel', serif; }
          .font-lato { font-family: 'Lato', sans-serif; }
          .font-playfair { font-family: 'Playfair Display', serif; }

          .footer-link {
              position: relative;
              transition: color 0.3s ease;
          }
          .footer-link::after {
              content: '';
              position: absolute;
              width: 0;
              height: 1px;
              bottom: -2px;
              left: 0;
              background-color: #9CA3AF;
              transition: width 0.3s ease;
          }
          .footer-link:hover::after {
              width: 100%;
          }
        `}
      </style>

      <footer className="bg-[#050B1C] text-white pt-20 pb-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Column 1: Logo Area (Span 3 cols) */}
            <div className="lg:col-span-3 flex flex-col items-start">
              {/* Logo Container - Reduced size to w-36 h-36, reduced padding and radius */}
              <div className="relative bg-gradient-to-br from-white via-blue-50 to-blue-100 w-30 h-30 rounded-[2rem] flex flex-col items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.05)] p-4 mb-6">
                {/* Custom SVG Logo Icon - Reduced size to 45 */}
                <div className="mb-2">
                  <svg width="45" height="45" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Hand */}
                    <path 
                      d="M20 65C20 65 35 80 50 80C65 80 80 65 80 65" 
                      stroke="#4B9CD3" 
                      strokeWidth="6" 
                      strokeLinecap="round"
                    />
                    <path 
                      d="M50 80V90" 
                      stroke="#4B9CD3" 
                      strokeWidth="6" 
                      strokeLinecap="round"
                    />
                    {/* Heart/Check shape */}
                    <path 
                      d="M30 45C30 30 45 30 50 40C55 30 70 30 70 45C70 55 50 70 50 70" 
                      fill="#69C0AC" 
                      fillOpacity="0.2"
                    />
                    <path 
                      d="M35 45L45 55L65 30" 
                      stroke="#5DAE9E" 
                      strokeWidth="8" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {/* Logo Text - Reduced text size */}
                <div className="text-center">
                  <h2 className="text-[#050B1C] font-playfair text-1xl font-bold tracking-tight mb-0">Trudo</h2>
                  <p className="text-gray-500 text-[9px] uppercase tracking-widest font-semibold mt-1">True Donations</p>
                </div>
              </div>
            </div>

            {/* Column 2: Sitemap (Span 2 cols) */}
            <div className="lg:col-span-2 pt-4">
              <h3 className="font-cinzel text-sm tracking-[0.2em] text-gray-200 mb-8 uppercase">Sitemap</h3>
              <ul className="space-y-4 font-lato text-gray-400 text-[15px]">
                <li><a href="#" className="footer-link hover:text-white">Home</a></li>
                <li><a href="#" className="footer-link hover:text-white">Donate</a></li>
                <li><a href="#" className="footer-link hover:text-white">Volunteer Campaign</a></li>
                <li><a href="#" className="footer-link hover:text-white">Events</a></li>
                <li><a href="#" className="footer-link hover:text-white">Contact us</a></li>
              </ul>
            </div>

            {/* Column 3: Socials (Span 2 cols) */}
            <div className="lg:col-span-2 pt-4">
              <h3 className="font-cinzel text-sm tracking-[0.2em] text-gray-200 mb-8 uppercase">Socials</h3>
              <ul className="space-y-4 font-lato text-gray-400 text-[15px]">
                <li><a href="#" className="footer-link hover:text-white">Facebook</a></li>
                <li><a href="#" className="footer-link hover:text-white">Linkedin</a></li>
                <li><a href="#" className="footer-link hover:text-white">Instagram</a></li>
                <li><a href="#" className="footer-link hover:text-white">Twitter</a></li>
              </ul>
            </div>

            {/* Column 4: Head Office & Newsletter (Span 5 cols) */}
            <div className="lg:col-span-5 pt-4">
              <div className="mb-12 relative">
                <h3 className="font-cinzel text-sm tracking-[0.2em] text-gray-200 mb-6 uppercase">Head Office</h3>
                <div className="flex justify-between items-start">
                  <p className="font-lato text-gray-400 text-[15px] leading-relaxed max-w-sm">
                    Xilliams Corner Wine © 2017. 1112 A Market St<br />
                    # Ste B22, Charlottesville, CA 45565
                  </p>
                  {/* Mail Icon floating right */}
                  {/* <div className="hidden sm:block text-gray-400 hover:text-white cursor-pointer transition-colors pt-2">
                    <Mail size={20} strokeWidth={1.5} />
                  </div> */}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-cinzel text-sm tracking-[0.2em] text-gray-200 mb-6 uppercase">News Letter</h3>
                <form className="relative max-w-md" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="w-full bg-transparent border-b border-gray-700 text-gray-300 py-3 focus:outline-none focus:border-white transition-colors placeholder-gray-500 font-lato text-[15px]"
                  />
                </form>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
};

export default Trudofooter;
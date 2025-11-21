import React from "react";


export function TrudoFooter() {
return (
<footer className="trudo-footer">
<div className="trudo-footer__inner">
<div className="brand">
<div className="logo">Trudo</div>
</div>
<div className="cols">
<div className="col">
<h4>Sitemap</h4>
<ul>
<li>Home</li>
<li>Donate</li>
<li>Volunteer Campaign</li>
<li>Events</li>
<li>Contact us</li>
</ul>
</div>
<div className="col">
<h4>Socials</h4>
<ul>
<li>Facebook</li>
<li>LinkedIn</li>
<li>Instagram</li>
<li>Twitter</li>
</ul>
</div>
<div className="col">
<h4>Head Office</h4>
<p>
Xilliams Corner Wine © 2017. 1112 A Market St<br /># Ste B22, Charlottesville,
CA 45565
</p>
</div>
<div className="col newsletter">
<h4>News Letter</h4>
<input className="newsletter-input" placeholder="Enter your email address" />
</div>
</div>
</div>
<style>{`
.trudo-footer{background:#07122a;color:#dfe9f2;padding:48px 24px 24px;}
.trudo-footer__inner{max-width:1100px;margin:0 auto;display:flex;gap:32px;align-items:flex-start}
.brand .logo{background:linear-gradient(180deg,#e6f2ff,#fff);color:#0b2b4a;padding:18px;border-radius:14px;font-weight:700}
.cols{display:flex;flex:1;gap:28px}
.col h4{margin:0 0 8px;font-size:14px}
.col ul{list-style:none;padding:0;margin:0}
.col p{font-size:13px;line-height:1.4}
.newsletter-input{background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.12);padding:8px;color:inherit}
@media(max-width:900px){.trudo-footer__inner{flex-direction:column;gap:20px}}
`}</style>
</footer>
);
}
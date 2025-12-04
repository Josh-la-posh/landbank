// export default function Footer() {
//   return (
//     <footer className="bg-gray-800 text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           <div>
//             <h3 className="text-xl font-bold mb-4">LandBank</h3>
//             <p className="text-gray-400">
//               Your trusted platform for land listings and property management.
//             </p>
//           </div>
//           <div>
//             <h4 className="font-semibold mb-4">Quick Links</h4>
//             <ul className="space-y-2 text-gray-400">
//               <li>About Us</li>
//               <li>Contact</li>
//               <li>Terms of Service</li>
//               <li>Privacy Policy</li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="font-semibold mb-4">Contact</h4>
//             <p className="text-gray-400">
//               Email: info@landbank.com
//               <br />
//               Phone: (555) 123-4567
//             </p>
//           </div>
//         </div>
//         <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
//           <p>&copy; 2025 LandBank. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   );
// }

import BrandLink from './BrandLink';

export default function Footer(){
    return (
        <footer className="transition-colors" style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm grid gap-6 md:grid-cols-3" style={{ color: 'var(--text-secondary)' }}>
                <div>
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>LandBank</div>
                    <p className="mt-2 max-w-xs">Connecting land sellers and buyers with verified listings and clear pricing.</p>
                </div>
                <ul className="space-y-2">
                    <li><BrandLink href="/lands">Browse Lands</BrandLink></li>
                    <li><BrandLink href="/pricing">Pricing</BrandLink></li>
                    <li><BrandLink href="/about">About</BrandLink></li>
                </ul>
                <div className="md:text-right">© {new Date().getFullYear()} LandBank. All rights reserved.</div>
            </div>
        </footer>
    );
}
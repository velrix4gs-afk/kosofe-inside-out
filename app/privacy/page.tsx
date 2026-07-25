import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">Privacy Policy</h1>
                <Link href="/" className="text-sm text-[#c41e3a] font-bold hover:underline">← Back Home</Link>
            </div>
            <div className="bg-white p-6 md:p-8 rounded shadow-sm space-y-4 text-sm text-gray-700 leading-relaxed">
                <p><strong>Last updated:</strong> July 2026</p>
                <p>Kosofe Inside Out ("we", "our", "us") respects your privacy. This Privacy Policy explains how we collect, use, and disclose information about you when you visit our website.</p>

                <h3 className="font-bold text-gray-900 text-base mt-4">1. Information We Collect</h3>
                <p>We may collect personal information that you provide directly to us, such as your name and email address when you subscribe to our newsletter, leave a comment, or contact us via our forms. We also automatically collect non-personal information via cookies and similar tracking technologies to improve your browsing experience.</p>

                <h3 className="font-bold text-gray-900 text-base mt-4">2. How We Use Your Information</h3>
                <p>We use the information we collect to provide, maintain, and improve our services, to send you newsletters, and to communicate with you. We also use aggregated, non-personal data for analytics and to track the performance of our site.</p>

                <h3 className="font-bold text-gray-900 text-base mt-4">3. Cookies</h3>
                <p>We use cookies to analyze traffic and optimize your experience on our site. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>

                <h3 className="font-bold text-gray-900 text-base mt-4">4. Third-Party Services</h3>
                <p>We use third-party services such as Google AdSense and Google Analytics. These third parties may collect information used to personalize advertisements and measure site performance. We recommend reviewing Google's Privacy Policy for more information on their data handling.</p>

                <h3 className="font-bold text-gray-900 text-base mt-4">5. Data Security</h3>
                <p>We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access. However, no internet transmission is ever 100% secure.</p>

                <h3 className="font-bold text-gray-900 text-base mt-4">6. Your Rights</h3>
                <p>You have the right to access, correct, or delete your personal information. If you would like to exercise these rights, please contact us at <span className="text-[#c41e3a]">kosofeinsideout@gmail.com</span>.</p>

                <h3 className="font-bold text-gray-900 text-base mt-4">7. Changes to this Policy</h3>
                <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

                <div className="border-t pt-4 mt-4 text-xs text-gray-500">
                    <p>If you have any questions about this Privacy Policy, please contact us at <span className="text-[#c41e3a]">kosofeinsideout@gmail.com</span>.</p>
                </div>
            </div>
        </div>
    );
}
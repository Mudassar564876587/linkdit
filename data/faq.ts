export interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

export const faqCategories = [
  "General",
  "Accounts",
  "AI Tools",
  "Pricing",
  "Store",
  "Privacy",
  "Security",
  "Submissions",
  "SEO",
  "Affiliate",
  "Ads",
] as const

export const faqs: FAQItem[] = [
  {
    id: "g1",
    question: "What is LinkDit?",
    answer: "LinkDit is a premium AI discovery platform that helps creators, developers, and businesses find, compare, and master the best AI tools. We offer curated tool directories, in-depth comparisons, expert tutorials, comprehensive guides, and an AI glossary — all designed to help you work smarter with artificial intelligence.",
    category: "General",
  },
  {
    id: "g2",
    question: "Is LinkDit free to use?",
    answer: "Yes, browsing our AI tools directory, reading articles, tutorials, guides, and the glossary are completely free. We also offer premium features and a store with exclusive resources for users who want to go deeper.",
    category: "General",
  },
  {
    id: "g3",
    question: "How are AI tools selected for the directory?",
    answer: "Our team of AI experts researches and evaluates tools based on functionality, user experience, pricing, and real-world performance. We prioritize tools that deliver genuine value and have positive user feedback. Tools can also be submitted by users and are reviewed before publication.",
    category: "General",
  },
  {
    id: "g4",
    question: "How often is the directory updated?",
    answer: "We update our directory daily with new AI tools, updated information, and latest reviews. Our team continuously monitors the AI landscape to ensure all listings are accurate and up to date.",
    category: "General",
  },
  {
    id: "g5",
    question: "Can I trust the reviews and ratings on LinkDit?",
    answer: "All reviews on LinkDit come from verified users who have actually used the tools. We do not allow fake reviews or paid ratings. Our moderation team actively monitors for suspicious activity to maintain integrity.",
    category: "General",
  },
  {
    id: "g6",
    question: "Does LinkDit offer personalized recommendations?",
    answer: "Yes, based on your browsing history, saved tools, and preferences, we provide personalized AI tool recommendations to help you discover tools that match your specific needs and workflow.",
    category: "General",
  },
  {
    id: "a1",
    question: "How do I create an account?",
    answer: "Click the 'Sign In' button at the top of the page and select 'Sign up'. You can register using your email address or sign in instantly with Google or GitHub. The process takes less than 30 seconds.",
    category: "Accounts",
  },
  {
    id: "a2",
    question: "Can I delete my account?",
    answer: "Yes, you can delete your account at any time from your Dashboard settings. This will permanently remove your profile, reviews, bookmarks, and personal data. You can also contact us if you need assistance.",
    category: "Accounts",
  },
  {
    id: "a3",
    question: "How do I reset my password?",
    answer: "Click 'Forgot Password' on the login page and enter your email address. We'll send you a password reset link. For security, the link expires after one hour.",
    category: "Accounts",
  },
  {
    id: "a4",
    question: "Can I use social login without creating a password?",
    answer: "Yes, you can sign in using Google or GitHub OAuth. This eliminates the need to remember another password and provides a secure, seamless login experience.",
    category: "Accounts",
  },
  {
    id: "a5",
    question: "What information is required to create an account?",
    answer: "You only need a valid email address and a password (or a Google/GitHub account). We recommend adding your full name and profile picture in your dashboard settings for a personalized experience.",
    category: "Accounts",
  },
  {
    id: "a6",
    question: "Can I have multiple accounts?",
    answer: "We allow one account per person. Multiple accounts for the same individual violate our terms of service and may result in all accounts being suspended.",
    category: "Accounts",
  },
  {
    id: "t1",
    question: "What types of AI tools are listed on LinkDit?",
    answer: "We cover a wide range of AI tools including: AI writing and content generation, image generation, video creation, coding assistants, audio production, marketing automation, analytics, productivity tools, design tools, and more across 10+ categories.",
    category: "AI Tools",
  },
  {
    id: "t2",
    question: "Are the AI tools on LinkDit free or paid?",
    answer: "We list tools across all pricing models — free, freemium, paid, and open source. Each tool listing clearly shows the pricing model so you can filter accordingly. Many tools offer free tiers or trials.",
    category: "AI Tools",
  },
  {
    id: "t3",
    question: "How do I compare two AI tools?",
    answer: "Visit our 'Compare' page, search for the tools you want to compare, and select them. We provide side-by-side comparisons across features, pricing, user ratings, and key specifications.",
    category: "AI Tools",
  },
  {
    id: "t4",
    question: "Can I save my favorite tools?",
    answer: "Yes, once you create an account, you can bookmark tools by clicking the bookmark icon on any tool card or detail page. Your saved tools are accessible from your Dashboard.",
    category: "AI Tools",
  },
  {
    id: "t5",
    question: "How do I find tools for a specific use case?",
    answer: "Use the search bar, browse by category, or apply filters for pricing, features, and platforms. Our advanced search helps you narrow down tools based on your specific requirements.",
    category: "AI Tools",
  },
  {
    id: "t6",
    question: "Are new AI tools added regularly?",
    answer: "Yes, our team adds new AI tools daily. We actively monitor product launches, and users can also submit new tools for our review. The AI landscape evolves rapidly and we strive to keep pace.",
    category: "AI Tools",
  },
  {
    id: "p1",
    question: "What premium features does LinkDit offer?",
    answer: "Premium features include: unlimited tool submissions, priority listing options, detailed analytics, advanced filters, ad-free browsing, exclusive resources from our store, and early access to new features.",
    category: "Pricing",
  },
  {
    id: "p2",
    question: "How much does LinkDit Pro cost?",
    answer: "LinkDit Pro is currently in development and will offer tiered pricing to suit different needs. Pricing details will be announced soon. Sign up for our newsletter to get notified when Pro launches.",
    category: "Pricing",
  },
  {
    id: "p3",
    question: "Is there a free trial for premium features?",
    answer: "Yes, when LinkDit Pro launches, we will offer a 14-day free trial for new users so you can experience all features before committing to a subscription.",
    category: "Pricing",
  },
  {
    id: "p4",
    question: "Can I get a refund?",
    answer: "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied with your premium subscription, contact our support team within 30 days for a full refund.",
    category: "Pricing",
  },
  {
    id: "p5",
    question: "Do you offer discounts for students or nonprofits?",
    answer: "Yes, we offer special pricing for students, educators, and verified nonprofit organizations. Contact our support team with your credentials to learn about available discounts.",
    category: "Pricing",
  },
  {
    id: "s1",
    question: "What is the LinkDit Store?",
    answer: "The LinkDit Store offers premium digital resources including AI prompt packs, templates, ebooks, courses, and exclusive tools designed to help you get more out of AI technology.",
    category: "Store",
  },
  {
    id: "s2",
    question: "What payment methods do you accept?",
    answer: "We accept major credit and debit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. All payments are processed securely through our payment partners.",
    category: "Store",
  },
  {
    id: "s3",
    question: "How do I access my purchased resources?",
    answer: "After purchase, digital resources are immediately available for download from your Dashboard under 'My Purchases'. You'll also receive a confirmation email with download links.",
    category: "Store",
  },
  {
    id: "s4",
    question: "Can I get a refund on store purchases?",
    answer: "Due to the digital nature of our products, store purchases are generally non-refundable. However, if you encounter technical issues with a purchased resource, contact us and we'll help resolve the issue or provide a refund.",
    category: "Store",
  },
  {
    id: "pr1",
    question: "What information does LinkDit collect?",
    answer: "We collect basic account information (email, name), usage data (pages visited, tools viewed), and preferences (bookmarked tools, saved filters). We never collect sensitive personal information without your explicit consent. See our Privacy Policy for full details.",
    category: "Privacy",
  },
  {
    id: "pr2",
    question: "How is my data used?",
    answer: "Your data is used to personalize your experience, improve our recommendations, and send occasional updates (with your permission). We never sell your personal data to third parties.",
    category: "Privacy",
  },
  {
    id: "pr3",
    question: "Does LinkDit use cookies?",
    answer: "Yes, we use essential cookies for authentication and site functionality. We also use analytics cookies (Google Analytics) to understand how users interact with our site. You can manage cookie preferences in your browser settings.",
    category: "Privacy",
  },
  {
    id: "pr4",
    question: "Can I request my data to be deleted?",
    answer: "Yes, you can request complete deletion of your data by deleting your account from Dashboard settings or by contacting us directly. We process deletion requests within 30 days.",
    category: "Privacy",
  },
  {
    id: "sc1",
    question: "How is my password stored?",
    answer: "Passwords are encrypted using industry-standard bcrypt hashing. We never store plain-text passwords. For users who sign in with Google or GitHub, authentication is handled entirely by those providers.",
    category: "Security",
  },
  {
    id: "sc2",
    question: "Is my connection to LinkDit secure?",
    answer: "Yes, all connections to LinkDit are encrypted using TLS/SSL (HTTPS). We maintain an A+ SSL rating and follow security best practices including HSTS headers and secure cookie flags.",
    category: "Security",
  },
  {
    id: "sc3",
    question: "How do you protect against unauthorized access?",
    answer: "We implement multiple security layers including rate limiting, session management, CSRF protection, and regular security audits. Our Supabase backend uses row-level security to ensure users can only access their own data.",
    category: "Security",
  },
  {
    id: "sc4",
    question: "Do you conduct regular security audits?",
    answer: "Yes, we perform regular security audits and penetration testing. We also monitor for vulnerabilities in our dependencies and apply security patches promptly.",
    category: "Security",
  },
  {
    id: "su1",
    question: "How do I submit a new AI tool?",
    answer: "Visit our 'Submit Tool' page, fill in the tool details including name, URL, description, category, and pricing. Our team will review your submission and publish it within 48 hours if it meets our quality standards.",
    category: "Submissions",
  },
  {
    id: "su2",
    question: "How long does the review process take?",
    answer: "Most submissions are reviewed within 24-48 hours. Complex submissions or those requiring additional verification may take up to 5 business days.",
    category: "Submissions",
  },
  {
    id: "su3",
    question: "Why was my submission rejected?",
    answer: "Common reasons include: incomplete information, duplicate listing, low-quality product, or failure to meet our editorial guidelines. We'll email you with specific feedback and suggestions for improvement.",
    category: "Submissions",
  },
  {
    id: "su4",
    question: "Can I submit an article or tutorial?",
    answer: "Absolutely! Visit our 'Submit Article' page to contribute tutorials, guides, or industry insights. Our editorial team reviews all submissions and selected pieces are published with full author credit and bio.",
    category: "Submissions",
  },
  {
    id: "su5",
    question: "Can I update my submitted tool information?",
    answer: "Yes, after your tool is published, you can request updates or changes by contacting us. If you have an account, you can also manage submissions from your Dashboard.",
    category: "Submissions",
  },
  {
    id: "se1",
    question: "Does LinkDit have its own search engine?",
    answer: "Yes, LinkDit features a powerful search engine that lets you find AI tools, articles, tutorials, and guides. Our search uses semantic understanding to deliver relevant results even with natural language queries.",
    category: "SEO",
  },
  {
    id: "se2",
    question: "How are pages on LinkDit optimized for search engines?",
    answer: "Each page on LinkDit is fully SEO-optimized with unique meta titles, descriptions, Open Graph tags, Twitter cards, structured data (JSON-LD), breadcrumbs, and canonical URLs. We follow Google's E-E-A-T guidelines for content quality.",
    category: "SEO",
  },
  {
    id: "se3",
    question: "Can my submitted tool rank on Google through LinkDit?",
    answer: "Yes, listed tools on LinkDit have strong SEO potential. Our pages are well-optimized and regularly indexed by search engines. Featured and high-rated tools get additional visibility.",
    category: "SEO",
  },
  {
    id: "se4",
    question: "Does LinkDit have a sitemap?",
    answer: "Yes, we maintain an XML sitemap at /sitemap.xml that includes all public pages. This helps search engines discover and index our content efficiently.",
    category: "SEO",
  },
  {
    id: "af1",
    question: "Does LinkDit have an affiliate program?",
    answer: "Yes, our affiliate program allows content creators, bloggers, and website owners to earn commissions by referring users to LinkDit. You earn a percentage of sales from users who sign up through your referral link.",
    category: "Affiliate",
  },
  {
    id: "af2",
    question: "How do I join the affiliate program?",
    answer: "Sign up for the affiliate program through our contact page. We'll review your application and if approved, provide you with unique referral links and marketing materials.",
    category: "Affiliate",
  },
  {
    id: "af3",
    question: "What commission rate do affiliates earn?",
    answer: "Affiliates earn up to 20% commission on referred sales. The exact rate depends on your traffic volume and conversion performance. Top-performing affiliates may qualify for higher rates.",
    category: "Affiliate",
  },
  {
    id: "af4",
    question: "When and how are affiliate payments made?",
    answer: "Payouts are made monthly via PayPal or bank transfer, with a minimum threshold of $50. Earnings are calculated on the 1st of each month and paid within 15 business days.",
    category: "Affiliate",
  },
  {
    id: "ad1",
    question: "Can I advertise on LinkDit?",
    answer: "Yes, we offer various advertising options including banner ads, sponsored listings, promoted tools, and newsletter sponsorships. Contact our advertising team for a custom proposal.",
    category: "Ads",
  },
  {
    id: "ad2",
    question: "What advertising formats are available?",
    answer: "We offer: display banners (728x90, 300x250), sidebar ads, sponsored tool placements, category sponsorships, newsletter ads, and custom integrated campaigns.",
    category: "Ads",
  },
  {
    id: "ad3",
    question: "How is advertising pricing structured?",
    answer: "Pricing depends on ad format, placement, duration, and audience targeting. We offer CPM (cost per thousand impressions) and CPC (cost per click) models for most placements. Custom campaigns are priced individually.",
    category: "Ads",
  },
  {
    id: "ad4",
    question: "Do you accept cryptocurrency for ad payments?",
    answer: "Yes, we accept Bitcoin, Ethereum, and USDC for advertising payments in addition to traditional payment methods. Contact our sales team to arrange crypto payments.",
    category: "Ads",
  },
]

export function getFAQsByCategory(category: string): FAQItem[] {
  return faqs.filter((f) => f.category === category)
}

export function searchFAQs(query: string): FAQItem[] {
  const q = query.toLowerCase()
  return faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
  )
}

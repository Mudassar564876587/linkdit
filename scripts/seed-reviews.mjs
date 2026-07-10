// Seed high-quality unique reviews for ALL AI tools
// Run: node scripts/seed-reviews.mjs

import { createClient } from "@supabase/supabase-js"
import { randomUUID } from "crypto"

const supabaseUrl = "https://voavwcfvnviwtweyeeej.supabase.co"
const serviceRoleKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvYXZ3Y2Z2bnZpd3R3ZXllZWVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzE0MDE1NSwiZXhwIjoyMDk4NzE2MTU1fQ.Me1f_XpDHhChfcUYcp6c5s3ZwE5U6F5WFikPqVEroXs"

const supabase = createClient(supabaseUrl, serviceRoleKey)

// ── 500+ Unique Reviewer Names from 16+ Countries ──────────
const REVIEWERS = [
  // USA (40)
  { name: "Michael Carter", country: "USA" }, { name: "Emma Wilson", country: "USA" }, { name: "Daniel Brooks", country: "USA" },
  { name: "Sophia Turner", country: "USA" }, { name: "Olivia Martin", country: "USA" }, { name: "James Walker", country: "USA" },
  { name: "Lucas Brown", country: "USA" }, { name: "Benjamin Harris", country: "USA" }, { name: "Ethan Cooper", country: "USA" },
  { name: "Noah Bennett", country: "USA" }, { name: "Ava Johnson", country: "USA" }, { name: "Charlotte Evans", country: "USA" },
  { name: "Henry Scott", country: "USA" }, { name: "Amelia Moore", country: "USA" }, { name: "William Green", country: "USA" },
  { name: "Alexander Reed", country: "USA" }, { name: "Mia Thompson", country: "USA" }, { name: "Harper White", country: "USA" },
  { name: "Isabella Hall", country: "USA" }, { name: "Liam Parker", country: "USA" }, { name: "Nathan Adams", country: "USA" },
  { name: "Evelyn Nelson", country: "USA" }, { name: "Caleb Mitchell", country: "USA" }, { name: "Abigail Roberts", country: "USA" },
  { name: "Dylan Turner", country: "USA" }, { name: "Ella Phillips", country: "USA" }, { name: "Mason Campbell", country: "USA" },
  { name: "Grace Collins", country: "USA" }, { name: "Logan Stewart", country: "USA" }, { name: "Chloe Morris", country: "USA" },
  { name: "Jackson Rogers", country: "USA" }, { name: "Lily Reed", country: "USA" }, { name: "Aiden Cook", country: "USA" },
  { name: "Zoey Bailey", country: "USA" }, { name: "Sebastian Howard", country: "USA" }, { name: "Scarlett Ward", country: "USA" },
  { name: "Owen Torres", country: "USA" }, { name: "Hannah Peterson", country: "USA" }, { name: "Gabriel Gray", country: "USA" },
  { name: "Aria Ramirez", country: "USA" },
  // UK (30)
  { name: "Oliver Davies", country: "UK" }, { name: "Charlotte Smith", country: "UK" }, { name: "George Williams", country: "UK" },
  { name: "Amelia Jones", country: "UK" }, { name: "Harry Taylor", country: "UK" }, { name: "Isla Brown", country: "UK" },
  { name: "Jack Wilson", country: "UK" }, { name: "Poppy Evans", country: "UK" }, { name: "Thomas Thomas", country: "UK" },
  { name: "Emily Roberts", country: "UK" }, { name: "Charles Johnson", country: "UK" }, { name: "Lily Wright", country: "UK" },
  { name: "Frederick Green", country: "UK" }, { name: "Freya Hall", country: "UK" }, { name: "Arthur Clarke", country: "UK" },
  { name: "Molly Turner", country: "UK" }, { name: "Edward Baker", country: "UK" }, { name: "Ella Harris", country: "UK" },
  { name: "Alfred Cooper", country: "UK" }, { name: "Grace Murray", country: "UK" }, { name: "Henry Fox", country: "UK" },
  { name: "Ruby Shaw", country: "UK" }, { name: "Albert Knight", country: "UK" }, { name: "Daisy Wells", country: "UK" },
  { name: "Simon Cross", country: "UK" }, { name: "Ivy Chapman", country: "UK" }, { name: "Peter Blake", country: "UK" },
  { name: "Rose Fleming", country: "UK" }, { name: "Hugh Grant", country: "UK" }, { name: "Violet Stone", country: "UK" },
  // Canada (20)
  { name: "Liam O'Brien", country: "Canada" }, { name: "Emma Tremblay", country: "Canada" }, { name: "Noah Gagnon", country: "Canada" },
  { name: "Olivia Leblanc", country: "Canada" }, { name: "William Cote", country: "Canada" }, { name: "Sophie Boucher", country: "Canada" },
  { name: "Benjamin Fortin", country: "Canada" }, { name: "Charlotte Gauthier", country: "Canada" }, { name: "Lucas Morin", country: "Canada" },
  { name: "Amelia Paquette", country: "Canada" }, { name: "Ethan Bergeron", country: "Canada" }, { name: "Harper Lacroix", country: "Canada" },
  { name: "James MacDonald", country: "Canada" }, { name: "Evelyn Desjardins", country: "Canada" }, { name: "Alexander Belanger", country: "Canada" },
  { name: "Abigail Roy", country: "Canada" }, { name: "Samuel Leclerc", country: "Canada" }, { name: "Emily Girard", country: "Canada" },
  { name: "Nathan Parent", country: "Canada" }, { name: "Elizabeth Boucher", country: "Canada" },
  // Germany (25)
  { name: "Lukas Weber", country: "Germany" }, { name: "Anna Schmidt", country: "Germany" }, { name: "Maximilian Mueller", country: "Germany" },
  { name: "Hannah Wagner", country: "Germany" }, { name: "Felix Becker", country: "Germany" }, { name: "Lea Hoffmann", country: "Germany" },
  { name: "Jonas Schaefer", country: "Germany" }, { name: "Sophie Koch", country: "Germany" }, { name: "Niklas Richter", country: "Germany" },
  { name: "Lena Schulz", country: "Germany" }, { name: "Tim Fischer", country: "Germany" }, { name: "Clara Weiss", country: "Germany" },
  { name: "Philipp Zimmermann", country: "Germany" }, { name: "Nele Braun", country: "Germany" }, { name: "Johannes Hartmann", country: "Germany" },
  { name: "Maja Kruger", country: "Germany" }, { name: "Daniel Lorenz", country: "Germany" }, { name: "Emilia Fuchs", country: "Germany" },
  { name: "Moritz Adler", country: "Germany" }, { name: "Lina Bach", country: "Germany" }, { name: "Jan Voigt", country: "Germany" },
  { name: "Paula Engel", country: "Germany" }, { name: "Tom Graf", country: "Germany" }, { name: "Marlene Kaiser", country: "Germany" },
  { name: "Erik Lang", country: "Germany" },
  // France (20)
  { name: "Lucas Bernard", country: "France" }, { name: "Camille Dubois", country: "France" }, { name: "Hugo Petit", country: "France" },
  { name: "Lea Moreau", country: "France" }, { name: "Nathan Laurent", country: "France" }, { name: "Chloe Simon", country: "France" },
  { name: "Tom Michel", country: "France" }, { name: "Manon Lefevre", country: "France" }, { name: "Maxime Rousseau", country: "France" },
  { name: "Sarah Girard", country: "France" }, { name: "Antoine Mercier", country: "France" }, { name: "Julie Caron", country: "France" },
  { name: "Romain Dupont", country: "France" }, { name: "Marine Gauthier", country: "France" }, { name: "Pierre David", country: "France" },
  { name: "Laura Bertin", country: "France" }, { name: "Adrien Fournier", country: "France" }, { name: "Lucie Brunet", country: "France" },
  { name: "Nicolas Blanc", country: "France" }, { name: "Emma Chevalier", country: "France" },
  // Spain (15)
  { name: "Alejandro Garcia", country: "Spain" }, { name: "Maria Lopez", country: "Spain" }, { name: "Pablo Martinez", country: "Spain" },
  { name: "Lucia Sanchez", country: "Spain" }, { name: "Diego Rodriguez", country: "Spain" }, { name: "Carmen Perez", country: "Spain" },
  { name: "Javier Gonzalez", country: "Spain" }, { name: "Elena Morales", country: "Spain" }, { name: "Miguel Diaz", country: "Spain" },
  { name: "Sofia Alvarez", country: "Spain" }, { name: "Carlos Ruiz", country: "Spain" }, { name: "Isabel Torres", country: "Spain" },
  { name: "Ramon Jimenez", country: "Spain" }, { name: "Marta Castillo", country: "Spain" }, { name: "Adrian Romero", country: "Spain" },
  // Italy (15)
  { name: "Alessandro Rossi", country: "Italy" }, { name: "Sofia Bianchi", country: "Italy" }, { name: "Lorenzo Romano", country: "Italy" },
  { name: "Giulia Colombo", country: "Italy" }, { name: "Matteo Ricci", country: "Italy" }, { name: "Chiara Marino", country: "Italy" },
  { name: "Francesco Greco", country: "Italy" }, { name: "Aurora Fontana", country: "Italy" }, { name: "Leonardo Barbieri", country: "Italy" },
  { name: "Alice Conti", country: "Italy" }, { name: "Marco Fabbri", country: "Italy" }, { name: "Ginevra Moretti", country: "Italy" },
  { name: "Davide Rinaldi", country: "Italy" }, { name: "Beatrice Ferrara", country: "Italy" }, { name: "Antonio Gallo", country: "Italy" },
  // Netherlands (12)
  { name: "Daan van Dijk", country: "Netherlands" }, { name: "Emma de Jong", country: "Netherlands" }, { name: "Sem Bakker", country: "Netherlands" },
  { name: "Lotte Visser", country: "Netherlands" }, { name: "Noah Hendriks", country: "Netherlands" }, { name: "Fenna Groot", country: "Netherlands" },
  { name: "Lars Dekker", country: "Netherlands" }, { name: "Mila Smit", country: "Netherlands" }, { name: "Thomas Bos", country: "Netherlands" },
  { name: "Sanne Willems", country: "Netherlands" }, { name: "Bram Vos", country: "Netherlands" }, { name: "Lisa Mulder", country: "Netherlands" },
  // India (30)
  { name: "Arun Sharma", country: "India" }, { name: "Priya Patel", country: "India" }, { name: "Ravi Verma", country: "India" },
  { name: "Ananya Gupta", country: "India" }, { name: "Vikram Singh", country: "India" }, { name: "Meera Reddy", country: "India" },
  { name: "Rajesh Kumar", country: "India" }, { name: "Neha Joshi", country: "India" }, { name: "Sanjay Deshmukh", country: "India" },
  { name: "Deepika Nair", country: "India" }, { name: "Manish Agarwal", country: "India" }, { name: "Kavita Menon", country: "India" },
  { name: "Siddharth Rao", country: "India" }, { name: "Pooja Iyer", country: "India" }, { name: "Anand Pillai", country: "India" },
  { name: "Divya Kulkarni", country: "India" }, { name: "Karan Saxena", country: "India" }, { name: "Ritu Mehta", country: "India" },
  { name: "Prakash Sinha", country: "India" }, { name: "Lakshmi Narayan", country: "India" }, { name: "Amit Trivedi", country: "India" },
  { name: "Shruti Bhatt", country: "India" }, { name: "Vivek Choudhury", country: "India" }, { name: "Tara Mahajan", country: "India" },
  { name: "Rohit Kapoor", country: "India" }, { name: "Anjali Dwivedi", country: "India" }, { name: "Nitin Gokhale", country: "India" },
  { name: "Kriti Saxena", country: "India" }, { name: "Aditya Thakur", country: "India" }, { name: "Rekha Mathew", country: "India" },
  // Pakistan (20)
  { name: "Hassan Ahmed", country: "Pakistan" }, { name: "Fatima Khan", country: "Pakistan" }, { name: "Bilal Hussain", country: "Pakistan" },
  { name: "Ayesha Malik", country: "Pakistan" }, { name: "Usman Sheikh", country: "Pakistan" }, { name: "Zainab Ali", country: "Pakistan" },
  { name: "Tariq Mahmood", country: "Pakistan" }, { name: "Sana Iqbal", country: "Pakistan" }, { name: "Imran Farooqi", country: "Pakistan" },
  { name: "Maria Nadeem", country: "Pakistan" }, { name: "Kamran Haider", country: "Pakistan" }, { name: "Rubab Javed", country: "Pakistan" },
  { name: "Salman Mirza", country: "Pakistan" }, { name: "Hira Batool", country: "Pakistan" }, { name: "Zubair Tariq", country: "Pakistan" },
  { name: "Nadia Rasheed", country: "Pakistan" }, { name: "Faisal Rana", country: "Pakistan" }, { name: "Saima Nawaz", country: "Pakistan" },
  { name: "Junaid Iqbal", country: "Pakistan" }, { name: "Tahira Aslam", country: "Pakistan" },
  // UAE (12)
  { name: "Ahmed Al Maktoum", country: "UAE" }, { name: "Layla Hassan", country: "UAE" }, { name: "Omar Rashid", country: "UAE" },
  { name: "Noor Abdullah", country: "UAE" }, { name: "Khalid Al Farsi", country: "UAE" }, { name: "Mariam Al Hashimi", country: "UAE" },
  { name: "Rashid Al Nuaimi", country: "UAE" }, { name: "Amira Said", country: "UAE" }, { name: "Sultan Al Qasimi", country: "UAE" },
  { name: "Hind Al Mazroui", country: "UAE" }, { name: "Mohammed Al Zaabi", country: "UAE" }, { name: "Nadia Al Shamsi", country: "UAE" },
  // Australia (15)
  { name: "Jack Thompson", country: "Australia" }, { name: "Mia O'Connor", country: "Australia" }, { name: "Lachlan Webb", country: "Australia" },
  { name: "Ruby Mitchell", country: "Australia" }, { name: "Cooper Sullivan", country: "Australia" }, { name: "Isabella King", country: "Australia" },
  { name: "Harper Murphy", country: "Australia" }, { name: "Harrison Lee", country: "Australia" }, { name: "Ella Taylor", country: "Australia" },
  { name: "Ryan Baxter", country: "Australia" }, { name: "Piper Dawson", country: "Australia" }, { name: "Toby Walsh", country: "Australia" },
  { name: "Matilda Quinn", country: "Australia" }, { name: "Angus Hughes", country: "Australia" }, { name: "Gemma Foster", country: "Australia" },
  // Japan (15)
  { name: "Haruto Tanaka", country: "Japan" }, { name: "Yui Suzuki", country: "Japan" }, { name: "Sota Takahashi", country: "Japan" },
  { name: "Sakura Watanabe", country: "Japan" }, { name: "Riku Ito", country: "Japan" }, { name: "Miyu Yamamoto", country: "Japan" },
  { name: "Kaito Nakamura", country: "Japan" }, { name: "Rin Kobayashi", country: "Japan" }, { name: "Sora Kato", country: "Japan" },
  { name: "Aoi Yoshida", country: "Japan" }, { name: "Yamato Yamaguchi", country: "Japan" }, { name: "Hina Matsumoto", country: "Japan" },
  { name: "Ren Sasaki", country: "Japan" }, { name: "Mei Inoue", country: "Japan" }, { name: "Hiroshi Kimura", country: "Japan" },
  // South Korea (15)
  { name: "Min-Jun Kim", country: "South Korea" }, { name: "Ji-Yeon Park", country: "South Korea" }, { name: "Seok-Jin Lee", country: "South Korea" },
  { name: "Soo-Jin Choi", country: "South Korea" }, { name: "Hyun-Woo Jung", country: "South Korea" }, { name: "Eun-Ji Kang", country: "South Korea" },
  { name: "Jun-Ho Cho", country: "South Korea" }, { name: "Hye-Jin Yoon", country: "South Korea" }, { name: "Sung-Min Jang", country: "South Korea" },
  { name: "Min-Ji Lim", country: "South Korea" }, { name: "Tae-Hyun Han", country: "South Korea" }, { name: "Na-Yeon Oh", country: "South Korea" },
  { name: "Jae-Won Seo", country: "South Korea" }, { name: "Bo-Ram Kwon", country: "South Korea" }, { name: "Dong-Hyuk Shin", country: "South Korea" },
  // Singapore (10)
  { name: "Wei Ming Tan", country: "Singapore" }, { name: "Li Na Ng", country: "Singapore" }, { name: "Jun Jie Lim", country: "Singapore" },
  { name: "Pei Qi Goh", country: "Singapore" }, { name: "Kai Wen Teo", country: "Singapore" }, { name: "Jia Hui Chua", country: "Singapore" },
  { name: "Zhi Hao Koh", country: "Singapore" }, { name: "Yee Ling Ong", country: "Singapore" }, { name: "Han Sheng Toh", country: "Singapore" },
  { name: "Mei Ling Sim", country: "Singapore" },
  // Brazil (20)
  { name: "Lucas Silva", country: "Brazil" }, { name: "Ana Santos", country: "Brazil" }, { name: "Gabriel Oliveira", country: "Brazil" },
  { name: "Julia Costa", country: "Brazil" }, { name: "Rafael Pereira", country: "Brazil" }, { name: "Larissa Fernandes", country: "Brazil" },
  { name: "Marcos Souza", country: "Brazil" }, { name: "Beatriz Lima", country: "Brazil" }, { name: "Pedro Almeida", country: "Brazil" },
  { name: "Isabela Carvalho", country: "Brazil" }, { name: "Thiago Rodrigues", country: "Brazil" }, { name: "Camila Barbosa", country: "Brazil" },
  { name: "Vinicius Gomes", country: "Brazil" }, { name: "Mariana Ribeiro", country: "Brazil" }, { name: "Bruno Cardoso", country: "Brazil" },
  { name: "Amanda Teixeira", country: "Brazil" }, { name: "Fernando Araujo", country: "Brazil" }, { name: "Luiza Castro", country: "Brazil" },
  { name: "Diego Campos", country: "Brazil" }, { name: "Rafaela Martins", country: "Brazil" },
  // Additional unique names (22)
  { name: "Vladimir Popov", country: "Russia" }, { name: "Natalia Sokolova", country: "Russia" }, { name: "Dmitri Ivanov", country: "Russia" },
  { name: "Olga Volkova", country: "Russia" }, { name: "Mikkel Andersen", country: "Denmark" }, { name: "Freja Kristensen", country: "Denmark" },
  { name: "Erik Johansson", country: "Sweden" }, { name: "Astrid Lindgren", country: "Sweden" }, { name: "Lars Nordqvist", country: "Sweden" },
  { name: "Ingrid Svensson", country: "Sweden" }, { name: "Piotr Novak", country: "Poland" }, { name: "Zofia Kowalczyk", country: "Poland" },
  { name: "Juan Herrera", country: "Mexico" }, { name: "Alejandra Cruz", country: "Mexico" }, { name: "Carlos Mendoza", country: "Mexico" },
  { name: "Valentina Ortiz", country: "Mexico" }, { name: "Yuki Nakagawa", country: "Japan" }, { name: "Mohammed Ali", country: "Egypt" },
  { name: "Aisha El-Sayed", country: "Egypt" }, { name: "David Okafor", country: "Nigeria" }, { name: "Chioma Eze", country: "Nigeria" },
  { name: "Kwame Asante", country: "Ghana" },
]

console.log(`Total unique reviewers defined: ${REVIEWERS.length}`)

// ── Helper ──────────────────────────────────────────────────
function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Review Templates ────────────────────────────────────────
const shortReviews = [
  "Exactly what I needed for quick content generation. The interface is clean and the output quality surpasses most competitors.",
  "Solid tool that does what it promises. Not perfect, but the core functionality is excellent.",
  "I've tried several alternatives and this one stands out for its reliability and consistent output quality.",
  "Great value for the price point. The free tier is generous enough for small projects.",
  "The best in its category right now. I've recommended it to my entire team.",
  "Does the job well. Some features could be more polished but overall a great experience.",
  "Impressed with the accuracy and speed. This has become an essential part of my daily workflow.",
  "Simple, effective, and reliable. Exactly what I look for in a productivity tool.",
  "After testing five alternatives, I chose this one. No regrets so far.",
  "Good tool with room for improvement. The core features work great but some advanced options feel incomplete.",
]

const mediumReviews = [
  "I've been using this tool for about three months now and it has significantly streamlined my workflow. The learning curve was gentle and within a week I was producing quality output. Customer support has been responsive when I had questions about integrations. My only wish is for more template options, but overall it's a solid choice for professionals.",
  "What sets this apart is the attention to user experience. The onboarding process is smooth, the dashboard is intuitive, and the output quality is consistently good. I particularly appreciate the regular updates that add meaningful features rather than bloat. Would recommend to anyone looking for a reliable solution.",
  "After trying the free trial, I upgraded within a week. The difference between this and free alternatives is night and day. The AI quality is noticeably better, the speed is impressive, and the customer support team actually understands the product. A few more export options would make it perfect.",
  "This tool has transformed how our team operates. We've reduced content production time by roughly 40% while maintaining quality. The collaboration features could use some work, but the core AI capabilities are best-in-class. Integration with our existing tools was straightforward and well-documented.",
  "I was skeptical at first but the results speak for themselves. The AI understands context remarkably well and produces natural-sounding output. The pricing is fair for what you get. My one criticism is the occasional slowness during peak hours, but the recent infrastructure upgrades seem to have helped.",
  "A well-rounded tool that excels in most areas. The feature set is comprehensive, the UI is modern and clean, and the output quality is consistently high. I've had a few minor issues with integrations but support resolved them quickly. Definitely worth considering for your tech stack.",
  "The recent updates have made a significant improvement. What was already a good tool is becoming great. The new features are genuinely useful rather than gimmicky. I appreciate that the development team seems to listen to user feedback and prioritizes practical improvements.",
  "I use this daily for both personal projects and client work. The consistency of the output is what keeps me coming back. While I wish some advanced features were available on lower-tier plans, the Pro plan offers excellent value. The API documentation is particularly well-written.",
  "Found this through a colleague's recommendation and it exceeded my expectations. The setup was quick, the results were impressive from day one, and I keep discovering new features that make my work easier. Occasional glitches but updates are frequent and the team is responsive.",
  "Solid performance across the board. The AI model handles nuance well and rarely requires significant editing of the output. I especially value the thoughtful design choices that make complex tasks feel simple. A few pain points around billing but the product itself is excellent.",
]

const longReviews = [
  "I've been using this tool extensively for the past six months across multiple projects and it has genuinely changed the way I work. The AI quality is consistently impressive, handling complex prompts with nuance and producing output that requires minimal editing. What really sets it apart is the attention to detail in the user interface — every feature feels thoughtfully placed and the learning curve is remarkably gentle for such a powerful tool.\n\nI initially started with the free tier to test capabilities and upgraded within two weeks. The premium features justify the cost, especially for power users who need advanced customization. Customer support has been responsive and helpful, though I've only needed to contact them a couple of times.\n\nWhere I see room for improvement is in the collaboration features. While the basic sharing works well, more robust team workflows would make this indispensable for agency work. The API is well-documented and reliable for those looking to build custom integrations. Overall, it's become an essential part of my toolkit and I recommend it to colleagues regularly.",
  "After evaluating dozens of options in this space over the past year, I can confidently say this is among the best. The development team has done an exceptional job balancing power with usability. What could have been an overwhelming tool is instead intuitive and accessible from day one.\n\nThe quality of AI-generated output varies by use case — it excels at structured tasks like summarization and data extraction, while creative tasks sometimes need more human guidance. That said, the speed is remarkable and the consistency across long sessions is better than any competitor I've tested.\n\nI particularly want to highlight the documentation and onboarding experience. The guides are thorough without being overwhelming, and the example workflows helped me understand best practices quickly. The community forum is active and the team actively participates in discussions about future features.\n\nPricing is competitive for the value provided. The mid-tier plan offers the best balance of features and cost for most professionals. Enterprise features like SSO and advanced audit logs are handled well. If the team continues this trajectory of improvement, this will be the undisputed leader in the space within a year.",
  "I've been in the software evaluation business for over a decade and this product demonstrates a rare combination of technical excellence and user-centric design. The core AI engine is built on impressive architecture that delivers fast, accurate results even with complex, multi-step prompts.\n\nWhat impressed me most during the evaluation period was the consistency. Many AI tools produce great results 60% of the time and confusing outputs the rest. This tool delivers quality results reliably, with only occasional edge cases requiring regeneration. The confidence calibration is notably better than alternatives.\n\nThe platform has evolved significantly since launch. Each update has brought meaningful improvements rather than cosmetic changes. The roadmap they've shared internally with enterprise customers suggests even more exciting capabilities in development. The mobile experience could be improved but the desktop and web apps are polished.\n\nFor organizations considering adoption, I recommend starting with a pilot team on the Pro plan. The admin controls are comprehensive and the analytics dashboard provides useful insights into usage patterns. The API has been reliable with 99.9% uptime over my testing period. Support response times average under two hours for critical issues.",
  "Switching to this tool was one of the better technology decisions our company made this year. We evaluated several alternatives and conducted a two-week trial before committing. The migration was smooth, the team adapted quickly, and within a month we saw measurable improvements in our content production metrics.\n\nThe AI quality is the standout feature. It understands industry-specific terminology accurately, maintains brand voice consistently, and handles multiple languages with impressive fluency. The speed has improved significantly since we started using it, with most tasks completing in seconds rather than minutes.\n\nCustomer support deserves special mention. When we had a complex integration requirement, their technical team worked with us directly to find a solution rather than pointing us to documentation. This level of support is rare and valuable.\n\nAreas for improvement include more granular permission controls, better reporting dashboards, and native integration with a few more third-party tools. But these are minor compared to the overall value. Our team's productivity has increased measurably and the quality of our output has been consistently high.",
  "I've tested this product extensively across various use cases and I'm impressed by its versatility. Whether I'm using it for quick brainstorming sessions, in-depth research analysis, or content creation, it delivers consistent quality. The key strength is its ability to understand context and maintain coherence across long interactions.\n\nThe user interface deserves praise. It's clean without being sparse, powerful without being overwhelming. New features are integrated thoughtfully rather than just piled on. I particularly appreciate the keyboard shortcuts and power-user features that make frequent tasks faster.\n\nPerformance has been excellent with fast response times and minimal downtime. The occasional slowdown during peak hours has improved with recent infrastructure upgrades. The API is robust and well-documented, making integration straightforward for developers.\n\nWhere the product could improve is in advanced customization options for enterprise users and more granular analytics. The current reporting provides good overview data but could go deeper. That said, the core product is exceptional and I've recommended it to several colleagues who've had similarly positive experiences.",
]

const reviewTemplates = { short: shortReviews, medium: mediumReviews, long: longReviews }

// ── Tool-specific themes and content ────────────────────────
const TOPIC_THEMES = {
  chatgpt: [{ aiRef: "ChatGPT's language model", featureRef: "GPT-4's reasoning" }],
  claude: [{ aiRef: "Claude's safety-focused AI", featureRef: "Claude's long context" }],
  jasper: [{ aiRef: "Jasper's brand voice AI", featureRef: "Jasper's campaign tools" }],
  grammarly: [{ aiRef: "Grammarly's language AI", featureRef: "Grammarly's tone detection" }],
  midjourney: [{ aiRef: "Midjourney's image generation", featureRef: "Midjourney's artistic quality" }],
  runway: [{ aiRef: "Runway's video AI", featureRef: "Runway's Gen-3 model" }],
  cursor: [{ aiRef: "Cursor's AI code engine", featureRef: "Cursor's agent mode" }],
  "github-copilot": [{ aiRef: "Copilot's code AI", featureRef: "Copilot's autocomplete" }],
  "notion-ai": [{ aiRef: "Notion's workspace AI", featureRef: "Notion AI's Q&A" }],
  elevenlabs: [{ aiRef: "ElevenLabs' voice AI", featureRef: "ElevenLabs' TTS quality" }],
  "julius-ai": [{ aiRef: "Julius' data analysis AI", featureRef: "Julius' chart generation" }],
  canva: [{ aiRef: "Canva's design AI", featureRef: "Canva's Magic Studio" }],
  perplexity: [{ aiRef: "Perplexity's search AI", featureRef: "Perplexity's citation system" }],
  "augment-code": [{ aiRef: "Augment's code AI", featureRef: "Augment's context engine" }],
  pearai: [{ aiRef: "PearAI's code assistant", featureRef: "PearAI's multi-model support" }],
  "continue-dev": [{ aiRef: "Continue's open-source AI", featureRef: "Continue's customization" }],
  cline: [{ aiRef: "Cline's autonomous AI", featureRef: "Cline's agent capabilities" }],
  openhands: [{ aiRef: "OpenHands' coding AI", featureRef: "OpenHands' autonomous mode" }],
  "browser-use": [{ aiRef: "Browser Use's automation", featureRef: "Browser Use's web agent" }],
  skyvern: [{ aiRef: "Skyvern's browser AI", featureRef: "Skyvern's visual understanding" }],
  "lindy-ai": [{ aiRef: "Lindy's automation AI", featureRef: "Lindy's workflow builder" }],
  "n8n-ai-agent": [{ aiRef: "n8n's agentic AI", featureRef: "n8n's workflow automation" }],
  "tavily-ai": [{ aiRef: "Tavily's search AI", featureRef: "Tavily's real-time data" }],
  "exa-ai": [{ aiRef: "Exa's search engine", featureRef: "Exa's semantic search" }],
  "jina-ai": [{ aiRef: "Jina's neural search", featureRef: "Jina's embeddings API" }],
  "tavus-ai": [{ aiRef: "Tavus's video AI", featureRef: "Tavus's personalized videos" }],
  "manus-ai": [{ aiRef: "Manus's agent AI", featureRef: "Manus's task execution" }],
  "genspark-ai": [{ aiRef: "Genspark's search AI", featureRef: "Genspark's SparkPages" }],
  "comet-browser": [{ aiRef: "Comet's browsing AI", featureRef: "Comet's automation" }],
  "dia-browser": [{ aiRef: "Dia's browser AI", featureRef: "Dia's agent platform" }],
  "higgsfield-ai": [{ aiRef: "Higgsfield's video AI", featureRef: "Higgsfield's generation" }],
  "seedream-ai": [{ aiRef: "Seedream's creative AI", featureRef: "Seedream's image quality" }],
  "minimax-ai": [{ aiRef: "MiniMax's generative AI", featureRef: "MiniMax's video models" }],
  "hunyuan-ai": [{ aiRef: "Hunyuan's multimodal AI", featureRef: "Hunyuan's video generation" }],
  "qwen-chat": [{ aiRef: "Qwen's language model", featureRef: "Qwen's reasoning" }],
  "kimi-ai": [{ aiRef: "Kimi's long context AI", featureRef: "Kimi's document analysis" }],
  "trae-ai": [{ aiRef: "Trae's coding AI", featureRef: "Trae's IDE integration" }],
  "devin-ai": [{ aiRef: "Devin's autonomous AI", featureRef: "Devin's end-to-end development" }],
}

function getTopicThemes(slug) {
  return TOPIC_THEMES[slug] || []
}

function getTitles(toolName, slug, lengthType) {
  const generic = [
    `Excellent ${toolName} experience`,
    `${toolName} exceeded my expectations`,
    `Why I switched to ${toolName}`,
    `${toolName}: A comprehensive review`,
    `Using ${toolName} for professional work`,
    `${toolName} transformed my workflow`,
    `Honest review of ${toolName}`,
    `${toolName} vs the competition`,
    `${toolName} after three months`,
    `Getting the most out of ${toolName}`,
    `${toolName} for enterprise teams`,
    `${toolName} pros and cons`,
    `Is ${toolName} worth it?`,
    `${toolName} for beginners`,
    `My experience with ${toolName}`,
  ]
  if (lengthType === "short") return generic.slice(0, 5)
  if (lengthType === "medium") return generic.slice(3, 10)
  return generic
}

function getPros(seed) {
  const options = [
    ["Excellent output quality", "Fast performance", "Clean interface"],
    ["Great value for money", "Reliable uptime", "Easy to learn"],
    ["Powerful features", "Regular updates", "Good documentation"],
    ["Responsive support", "Active community", "Stable API"],
    ["Intuitive design", "Consistent results", "Good integrations"],
    ["High accuracy", "Good customization", "Fast response times"],
    ["Works well for teams", "Affordable pricing", "Regular improvements"],
    ["Quality AI models", "User-friendly interface", "Good onboarding"],
  ]
  return options[seed % options.length]
}

function getCons(seed) {
  const options = [
    ["Premium features require upgrade", "Could be faster for large tasks", "Occasional UI quirks"],
    ["Steep learning curve for advanced features", "Mobile experience needs work", "Limited free tier"],
    ["Integration with some tools could be better", "Customer support can be slow", "Export options limited"],
    ["Occasional bugs after updates", "Documentation could be more detailed", "Price increase on renewal"],
    ["No offline mode", "Some features feel unfinished", "API rate limits restrictive"],
    ["Advanced features behind paywall", "Can be resource intensive", "Occasional downtime"],
    ["Collaboration features basic", "Limited customization", "No self-hosted option"],
    ["Learning curve for new users", "Some features redundant", "Pricing for teams adds up"],
  ]
  return options[seed % options.length]
}

function generateReviewsForTool(toolName, toolSlug, reviewerPool, count) {
  const selectedReviewers = reviewerPool.slice(0, count)
  const reviews = []
  const topicThemes = getTopicThemes(toolSlug)

  for (let i = 0; i < count; i++) {
    const reviewer = selectedReviewers[i]
    const lengthType = ["short", "medium", "long"][i % 3]
    const templates = reviewTemplates[lengthType]
    let content = templates[i % templates.length]

    if (topicThemes.length > 0) {
      const theme = topicThemes[i % topicThemes.length]
      content = content.replace("tool", toolName)
      content = content.replace("The AI", theme.aiRef || "The AI")
      content = content.replace("The feature", theme.featureRef || "The feature")
    } else {
      content = content.replace("tool", toolName)
    }

    const rating = randomInt(3, 5)
    const titles = getTitles(toolName, toolSlug, lengthType)

    reviews.push({
      userId: reviewer.id,
      rating,
      title: titles[i % titles.length],
      content,
      pros: getPros(i),
      cons: getCons(i),
      createdAt: daysAgo(randomInt(1, 365)),
    })
  }

  return reviews
}

// ── Tool configurations ─────────────────────────────────────
// All 38 tools from the database, each gets 8-9 reviews
// Total: 322 (within the 336 reviewer pool)
const TOOL_CONFIGS = [
  // Popular tools get 9 reviews
  { name: "ChatGPT", slug: "chatgpt", count: 9 },
  { name: "Claude", slug: "claude", count: 9 },
  { name: "Jasper", slug: "jasper", count: 8 },
  { name: "Grammarly", slug: "grammarly", count: 9 },
  { name: "Midjourney", slug: "midjourney", count: 9 },
  { name: "Runway", slug: "runway", count: 8 },
  { name: "Cursor", slug: "cursor", count: 9 },
  { name: "GitHub Copilot", slug: "github-copilot", count: 9 },
  { name: "Notion AI", slug: "notion-ai", count: 9 },
  { name: "ElevenLabs", slug: "elevenlabs", count: 8 },
  { name: "Julius AI", slug: "julius-ai", count: 8 },
  { name: "Canva", slug: "canva", count: 9 },
  { name: "Perplexity", slug: "perplexity", count: 9 },
  // Newer/less popular tools get 8 reviews
  { name: "Augment Code", slug: "augment-code", count: 8 },
  { name: "PearAI", slug: "pearai", count: 8 },
  { name: "Continue.dev", slug: "continue-dev", count: 8 },
  { name: "Cline", slug: "cline", count: 8 },
  { name: "OpenHands", slug: "openhands", count: 8 },
  { name: "Browser Use", slug: "browser-use", count: 8 },
  { name: "Skyvern", slug: "skyvern", count: 8 },
  { name: "Lindy AI", slug: "lindy-ai", count: 8 },
  { name: "n8n AI Agent", slug: "n8n-ai-agent", count: 8 },
  { name: "Tavily AI", slug: "tavily-ai", count: 8 },
  { name: "Exa AI", slug: "exa-ai", count: 8 },
  { name: "Jina AI", slug: "jina-ai", count: 8 },
  { name: "Tavus AI", slug: "tavus-ai", count: 8 },
  { name: "Manus AI", slug: "manus-ai", count: 8 },
  { name: "Genspark AI", slug: "genspark-ai", count: 8 },
  { name: "Comet Browser", slug: "comet-browser", count: 8 },
  { name: "Dia Browser", slug: "dia-browser", count: 8 },
  { name: "Higgsfield AI", slug: "higgsfield-ai", count: 8 },
  { name: "Seedream AI", slug: "seedream-ai", count: 8 },
  { name: "MiniMax AI", slug: "minimax-ai", count: 8 },
  { name: "Hunyuan AI", slug: "hunyuan-ai", count: 8 },
  { name: "Qwen Chat", slug: "qwen-chat", count: 8 },
  { name: "Kimi AI", slug: "kimi-ai", count: 8 },
  { name: "Trae AI", slug: "trae-ai", count: 8 },
  { name: "Devin AI", slug: "devin-ai", count: 8 },
]

const totalNeeded = TOOL_CONFIGS.reduce((s, c) => s + c.count, 0)
console.log(`Total reviews needed: ${totalNeeded}`)

if (totalNeeded > REVIEWERS.length) {
  console.error(`Not enough unique reviewers! Need ${totalNeeded}, have ${REVIEWERS.length}`)
  process.exit(1)
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  console.log("Starting review seed...\n")

  // 1. Delete existing reviews and reset tool ratings
  console.log("Deleting existing reviews...")
  const { data: allTools } = await supabase.from("tools").select("id")
  const { error: deleteErr } = await supabase.from("reviews").delete().neq("id", "00000000-0000-0000-0000-000000000000")
  if (deleteErr) {
    console.error(`  Error deleting reviews: ${deleteErr.message}`)
  } else {
    console.log("  ✓ All existing reviews deleted")
  }
  // Reset tool ratings to 0 (trigger may not exist)
  if (allTools) {
    for (const t of allTools) {
      await supabase.from("tools").update({ rating: 0, review_count: 0 }).eq("id", t.id)
    }
    console.log("  ✓ Tool ratings reset to 0")
  }

  // 2. Create reviewer users via auth.admin to satisfy FK constraints
  console.log("\nCreating reviewer users...")
  const shuffledReviewers = shuffle(REVIEWERS)
  const assignedReviewers = shuffledReviewers.slice(0, totalNeeded)

  let userCount = 0
  for (const reviewer of assignedReviewers) {
    const email = `${reviewer.name.toLowerCase().replace(/\s+/g, ".")}.${randomInt(100, 999)}@review.example.com`
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password: "temporaryPass123!",
        email_confirm: true,
        user_metadata: { full_name: reviewer.name },
      })
      if (!error && data?.user) {
        reviewer.id = data.user.id
        userCount++
      } else if (error) {
        // Try to find existing user with same email
        const { data: existing } = await supabase.from("users").select("id").eq("email", email).maybeSingle()
        if (existing) {
          reviewer.id = existing.id
          userCount++
        }
      }
    } catch {
      // Skip on failure
    }
  }
  console.log(`  ✓ ${userCount} users created/verified`)

  // 3. Fetch actual tool IDs from database
  console.log("\nFetching tools from database...")
  const { data: tools, error: toolsError } = await supabase
    .from("tools")
    .select("id, name, slug")
    .eq("is_published", true)

  if (toolsError) {
    console.error(`  Error fetching tools: ${toolsError.message}`)
    process.exit(1)
  }

  const toolMap = {}
  for (const t of tools) {
    toolMap[t.slug] = t
  }

  console.log(`  ✓ Found ${tools.length} tools`)

  // 4. Generate and insert reviews
  console.log("\nGenerating and inserting reviews...")
  let currentUserIndex = 0
  let totalInserted = 0

  for (const config of TOOL_CONFIGS) {
    const tool = toolMap[config.slug]
    if (!tool) {
      console.log(`  ✗ Tool not found: ${config.name} (${config.slug})`)
      continue
    }

    const reviewerSlice = assignedReviewers.slice(currentUserIndex, currentUserIndex + config.count)
    currentUserIndex += config.count

    const reviews = generateReviewsForTool(
      config.name,
      config.slug,
      reviewerSlice,
      config.count
    )

    let inserted = 0
    for (const review of reviews) {
      const { error } = await supabase.from("reviews").insert({
        user_id: review.userId,
        tool_id: tool.id,
        rating: review.rating,
        title: review.title,
        content: review.content,
        pros: review.pros,
        cons: review.cons,
        is_approved: true,
        created_at: review.createdAt,
        updated_at: review.createdAt,
      })
      if (error) {
        if (error.code !== "23505") {
          console.error(`  ✗ Error: ${error.message}`)
        }
      } else {
        inserted++
      }
    }

    totalInserted += inserted
    console.log(`  ✓ ${config.name}: ${inserted}/${config.count} reviews inserted`)
  }

  console.log(`\nTotal reviews inserted: ${totalInserted}`)

  // 5. Manually update tool ratings and review counts
  console.log("\nUpdating tool ratings...")
  for (const config of TOOL_CONFIGS) {
    const tool = toolMap[config.slug]
    if (!tool) continue
    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating")
      .eq("tool_id", tool.id)
      .eq("is_approved", true)
    if (reviews && reviews.length > 0) {
      const avg = parseFloat((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(2))
      await supabase.from("tools").update({ rating: avg, review_count: reviews.length }).eq("id", tool.id)
    }
  }
  console.log("  ✓ Tool ratings updated")

  // 6. Verify results
  console.log("\n=== FINAL VERIFICATION ===\n")

  const { data: finalTools } = await supabase
    .from("tools")
    .select("name, slug, rating, review_count")
    .order("review_count", { ascending: false })

  if (finalTools) {
    console.log("Tool Ratings & Review Counts:")
    for (const t of finalTools) {
      const stars = "⭐".repeat(Math.round(t.rating))
      console.log(`  ${t.name.padEnd(16)} ${String(t.rating).padEnd(5)} ${stars}  ${t.review_count} reviews`)
    }
  }

  // Check for duplicate reviewer names
  const { data: allReviews } = await supabase
    .from("reviews")
    .select("*, users!inner(full_name)")

  if (allReviews) {
    const nameCounts = {}
    let duplicates = 0
    for (const r of allReviews) {
      nameCounts[r.users.full_name] = (nameCounts[r.users.full_name] || 0) + 1
      if (nameCounts[r.users.full_name] > 1) duplicates++
    }
    if (duplicates > 0) {
      console.log(`\n⚠ Found ${duplicates} duplicate reviewer names!`)
      for (const [name, count] of Object.entries(nameCounts)) {
        if (count > 1) console.log(`  ${name}: ${count} reviews`)
      }
    } else {
      console.log("\n✓ No duplicate reviewer names found!")
    }

    const contents = allReviews.map((r) => r.content)
    const uniqueContents = new Set(contents)
    if (contents.length !== uniqueContents.size) {
      console.log(`⚠ Found ${contents.length - uniqueContents.size} duplicate review texts!`)
    } else {
      console.log("✓ All review texts are unique!")
    }

    const titles = allReviews.map((r) => r.title)
    const uniqueTitles = new Set(titles)
    if (titles.length !== uniqueTitles.size) {
      console.log(`⚠ Found ${titles.length - uniqueTitles.size} duplicate review titles!`)
    } else {
      console.log("✓ All review titles are unique!")
    }
  }

  console.log("\n✓ Seed complete!")
}

main().catch(console.error)

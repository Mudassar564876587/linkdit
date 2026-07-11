// Master Review System v1.0
// Run the migration SQL in Supabase Dashboard first:
// 1. Open https://supabase.com/dashboard/project/voavwcfvnviwtweyeeej/sql/new
// 2. Paste supabase/migrations/015_reviewer_profiles.sql
// 3. Click Run
// 4. Then: node scripts/seed-master-reviews.mjs

import { createClient } from "@supabase/supabase-js"
import { randomUUID } from "crypto"

const SUPABASE_URL = "https://voavwcfvnviwtweyeeej.supabase.co"
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvYXZ3Y2Z2bnZpd3R3ZXllZWVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzE0MDE1NSwiZXhwOjIwOTg3MTYxNTV9.Me1f_XpDHhChfcUYcp6c5s3ZwE5U6F5WFikPqVEroXs"

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function pickN(arr, n) { const a = [...arr]; for (let i = a.length-1; i>0; i--) { const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] } return a.slice(0, n) }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function daysAgo(n) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString() }
function weightedPick(items, weights) { const total = weights.reduce((a,b)=>a+b,0); let r = Math.random()*total; for (let i=0; i<items.length; i++) { r -= weights[i]; if (r <= 0) return items[i] } return items[items.length-1] }

const FIRST_NAMES_MALE = [
  "James","Robert","John","Michael","David","William","Richard","Joseph","Thomas","Christopher",
  "Daniel","Matthew","Anthony","Mark","Donald","Steven","Paul","Andrew","Joshua","Kenneth",
  "Kevin","Brian","George","Timothy","Ronald","Edward","Jason","Jeffrey","Ryan","Jacob",
  "Gary","Nicholas","Eric","Jonathan","Stephen","Larry","Justin","Scott","Brandon","Benjamin",
  "Samuel","Raymond","Gregory","Frank","Alexander","Patrick","Jack","Dennis","Jerry","Tyler",
  "Aaron","Jose","Nathan","Henry","Douglas","Peter","Adam","Zachary","Walter","Kyle",
  "Carl","Arthur","Gerald","Roger","Keith","Lawrence","Jeremy","Albert","Willie","Billy",
  "Liam","Noah","Oliver","Elijah","Lucas","Mason","Logan","Ethan","Sebastian","Mateo",
  "Levi","Leo","Jack","Owen","Henry","Wyatt","Gabriel","Julian","Isaiah","Ryan",
  "Josiah","Miles","Ezra","Micah","Carson","Cole","Braxton","Hunter","Damian","Asher",
  "Lukas","Felix","Jonas","Niklas","Tim","Philipp","Johannes","Moritz","Jan","Tom",
  "Alejandro","Pablo","Diego","Javier","Miguel","Carlos","Ramon","Adrian","Rafael","Luis",
  "Alessandro","Lorenzo","Matteo","Francesco","Leonardo","Marco","Davide","Antonio","Giuseppe","Simone",
  "Hassan","Omar","Ahmed","Ali","Mohammed","Khalid","Rashid","Sultan","Tariq","Kamran",
  "Arun","Ravi","Vikram","Rajesh","Manish","Siddharth","Karan","Rohit","Nitin","Aditya",
  "Hiroshi","Haruto","Sota","Riku","Kaito","Sora","Yamato","Ren","Min-Jun","Seok-Jin",
  "Hyun-Woo","Jun-Ho","Sung-Min","Tae-Hyun","Jae-Won","Dong-Hyuk","Wei","Jun","Kai","Zhi",
  "Lucas","Gabriel","Rafael","Vinicius","Fernando","Bruno","Thiago","Diego","Pedro","Marcos",
]

const FIRST_NAMES_FEMALE = [
  "Emma","Olivia","Ava","Isabella","Sophia","Mia","Charlotte","Amelia","Harper","Evelyn",
  "Abigail","Emily","Ella","Elizabeth","Camila","Luna","Sofia","Avery","Mila","Aria",
  "Scarlett","Penelope","Layla","Chloe","Victoria","Madison","Eleanor","Grace","Nora","Riley",
  "Zoey","Hannah","Hazel","Lily","Lillian","Aurora","Savannah","Audrey","Brooklyn","Bella",
  "Claire","Skylar","Lucy","Paisley","Anna","Caroline","Genesis","Aaliyah","Kennedy","Kinsley",
  "Hannah","Lea","Sophie","Clara","Nele","Maja","Emilia","Lina","Paula","Marlene",
  "Lucia","Carmen","Elena","Sofia","Isabel","Marta","Giulia","Chiara","Aurora","Alice",
  "Ginevra","Beatrice","Fatima","Ayesha","Zainab","Sana","Maria","Hira","Nadia","Saima",
  "Priya","Ananya","Meera","Neha","Deepika","Kavita","Pooja","Divya","Ritu","Anjali",
  "Yui","Sakura","Miyu","Rin","Aoi","Hina","Mei","Ji-Yeon","Soo-Jin","Eun-Ji",
  "Hye-Jin","Min-Ji","Na-Yeon","Bo-Ram","Li","Pei","Jia","Yee","Mei",
  "Ana","Julia","Larissa","Beatriz","Isabela","Camila","Mariana","Amanda","Luiza","Rafaela",
  "Mariam","Layla","Noor","Amira","Hind","Nadia","Emma","Lea","Camille","Manon",
  "Sarah","Julie","Marine","Laura","Lucie","Anna","Lotte","Fenna","Mila","Sanne",
  "Lisa","Ruby","Molly","Daisy","Ivy","Rose","Violet","Freya","Poppy","Isla",
]

const LAST_NAMES = [
  "Smith","Johnson","Williams","Brown","Jones","Garcia","Miller","Davis","Rodriguez","Martinez",
  "Hernandez","Lopez","Gonzalez","Wilson","Anderson","Thomas","Taylor","Moore","Jackson","Martin",
  "Lee","Perez","Thompson","White","Harris","Sanchez","Clark","Ramirez","Lewis","Robinson",
  "Walker","Young","Allen","King","Wright","Scott","Torres","Nguyen","Hill","Flores",
  "Green","Adams","Nelson","Baker","Hall","Rivera","Campbell","Mitchell","Carter","Roberts",
  "Gomez","Phillips","Evans","Turner","Diaz","Parker","Cruz","Edwards","Collins","Reyes",
  "Stewart","Morris","Morales","Murphy","Cook","Rogers","Gutierrez","Ortiz","Morgan","Cooper",
  "Peterson","Bailey","Reed","Kelly","Howard","Ramos","Kim","Cox","Ward","Richardson",
  "Watson","Brooks","Chavez","Wood","James","Bennett","Gray","Mendoza","Ruiz","Hughes",
  "Price","Alvarez","Castillo","Sanders","Patel","Myers","Long","Ross","Foster","Jimenez",
  "Schmidt","Mueller","Wagner","Becker","Hoffmann","Schaefer","Koch","Richter","Schulz","Fischer",
  "Weiss","Braun","Hartmann","Kruger","Lorenz","Fuchs","Adler","Bach","Voigt","Engel",
  "Weber","Dubois","Petit","Moreau","Laurent","Simon","Michel","Lefevre","Rousseau","Girard",
  "Mercier","Caron","Dupont","Gauthier","David","Bertin","Fournier","Brunet","Blanc","Chevalier",
  "Garcia","Lopez","Martinez","Sanchez","Rodriguez","Perez","Gonzalez","Morales","Diaz","Ruiz",
  "Jimenez","Castillo","Romero","Rossi","Bianchi","Romano","Colombo","Ricci","Marino","Greco",
  "Fontana","Barbieri","Conti","Fabbri","Moretti","Rinaldi","Ferrara","Gallo","Khan","Ahmed",
  "Ali","Malik","Sheikh","Hussain","Iqbal","Mahmood","Mirza","Rana","Sharma","Patel",
  "Verma","Singh","Reddy","Kumar","Joshi","Deshmukh","Nair","Agarwal","Menon","Rao",
  "Iyer","Pillai","Kulkarni","Saxena","Mehta","Sinha","Trivedi","Bhatt","Choudhury","Mahajan",
  "Kapoor","Dwivedi","Gokhale","Thakur","Mathew","Tanaka","Suzuki","Takahashi","Watanabe","Ito",
  "Yamamoto","Nakamura","Kobayashi","Kato","Yoshida","Yamaguchi","Matsumoto","Sasaki","Inoue","Kimura",
  "Kim","Park","Lee","Choi","Jung","Kang","Cho","Yoon","Jang","Lim",
  "Han","Oh","Seo","Kwon","Shin","Silva","Santos","Oliveira","Costa","Pereira",
  "Fernandes","Souza","Lima","Almeida","Carvalho","Rodrigues","Barbosa","Gomes","Ribeiro","Cardoso",
  "Teixeira","Araujo","Castro","Campos","Martins","Al-Maktoum","Al-Farsi","Al-Hashimi","Al-Nuaimi","Al-Qasimi",
  "Al-Mazroui","Al-Zaabi","Al-Shamsi","van Dijk","de Jong","Bakker","Visser","Hendriks","Groot",
  "Dekker","Smit","Bos","Willems","Vos","Mulder",
]

const COUNTRIES = [
  "USA","USA","USA","USA","USA","USA","USA","USA","USA","USA",
  "Canada","Canada","Canada","UK","UK","UK","UK","Germany","Germany","Germany",
  "France","France","Italy","Italy","Spain","Spain","Netherlands","Sweden","Norway","Poland",
  "Turkey","India","India","India","India","India","Pakistan","Pakistan","Bangladesh","Bangladesh",
  "Japan","Japan","South Korea","South Korea","Singapore","Singapore","Malaysia","Australia","Australia",
  "Brazil","Brazil","Brazil","Mexico","Mexico","South Africa","UAE","UAE","Saudi Arabia","Egypt",
]

const CITIES = {
  "USA": ["New York","San Francisco","Austin","Seattle","Chicago","Boston","Denver","Miami","Portland","Los Angeles","Dallas","Atlanta","Phoenix","Minneapolis"],
  "Canada": ["Toronto","Vancouver","Montreal","Calgary","Ottawa","Edmonton"],
  "UK": ["London","Manchester","Edinburgh","Birmingham","Glasgow","Leeds","Liverpool"],
  "Germany": ["Berlin","Munich","Hamburg","Cologne","Frankfurt","Stuttgart","Dusseldorf"],
  "France": ["Paris","Lyon","Marseille","Toulouse","Bordeaux","Lille","Nice"],
  "Italy": ["Rome","Milan","Turin","Naples","Bologna","Florence","Venice"],
  "Spain": ["Madrid","Barcelona","Valencia","Seville","Bilbao","Granada","Malaga"],
  "India": ["Mumbai","Delhi","Bangalore","Hyderabad","Chennai","Pune","Kolkata","Ahmedabad"],
  "Pakistan": ["Karachi","Lahore","Islamabad","Rawalpindi","Faisalabad","Multan","Peshawar"],
  "Japan": ["Tokyo","Osaka","Kyoto","Yokohama","Sapporo","Nagoya","Kobe"],
  "South Korea": ["Seoul","Busan","Incheon","Daegu","Daejeon","Gwangju"],
  "Brazil": ["Sao Paulo","Rio de Janeiro","Belo Horizonte","Brasilia","Salvador","Fortaleza"],
  "Australia": ["Sydney","Melbourne","Brisbane","Perth","Adelaide","Gold Coast"],
  "UAE": ["Dubai","Abu Dhabi","Sharjah","Ajman","Ras Al Khaimah"],
  "Singapore": ["Singapore"],
  "Netherlands": ["Amsterdam","Rotterdam","The Hague","Utrecht","Eindhoven"],
  "Sweden": ["Stockholm","Gothenburg","Malmo","Uppsala"],
  "Bangladesh": ["Dhaka","Chittagong","Khulna","Rajshahi"],
  "South Africa": ["Cape Town","Johannesburg","Durban","Pretoria"],
  "Mexico": ["Mexico City","Guadalajara","Monterrey","Puebla","Tijuana"],
}

function getCity(country) { return pick(CITIES[country] || ["City"]) }

const JOB_TITLES = [
  "Software Engineer","Senior Software Engineer","AI Engineer","ML Engineer","Data Scientist",
  "Backend Developer","Frontend Developer","Full Stack Developer","DevOps Engineer",
  "Student","College Student","Graduate Student","PhD Candidate","Research Assistant",
  "Professor","Assistant Professor","Computer Science Teacher","High School Teacher",
  "Researcher","AI Researcher","NLP Researcher","Computer Vision Researcher",
  "Freelancer","Freelance Developer","Freelance Writer","Freelance Designer",
  "Designer","Graphic Designer","UI/UX Designer","Product Designer",
  "Video Editor","Motion Designer","Visual Effects Artist","Content Creator",
  "Writer","Copywriter","Technical Writer","Content Writer",
  "SEO Specialist","Digital Marketer","Marketing Manager","Growth Marketer",
  "Product Manager","Project Manager","Engineering Manager","Team Lead",
  "Agency Owner","Startup Founder","Co-Founder","CEO","CTO",
  "Business Owner","Small Business Owner","Entrepreneur","Consultant",
  "YouTuber","TikTok Creator","Streamer","Blogger","Social Media Manager",
  "Data Analyst","Business Analyst","Marketing Analyst","Product Analyst",
  "No-Code Builder","Low-Code Developer","Automation Specialist","Prompt Engineer",
]

const INDUSTRIES = [
  "Technology","Software","Artificial Intelligence","SaaS","E-Commerce",
  "Education","Healthcare","Finance","Banking","Media",
  "Marketing","Advertising","Consulting","Design","Gaming",
  "E-Learning","Publishing","News","Entertainment","Music",
  "Video Production","Animation","Architecture","Engineering","Real Estate",
  "Legal","Non-Profit","Government","Retail","Manufacturing",
  "Telecommunications","Cybersecurity","Data Analytics","Cloud Computing","Robotics",
]

const EXPERIENCE_LEVELS = ["beginner","intermediate","advanced","expert"]
const EXPERIENCE_YEARS = { beginner: [0,1,2], intermediate: [2,4,6], advanced: [5,8,12], expert: [10,15,20] }
const USAGE_DURATIONS = ["Less than 1 month","1-3 months","3-6 months","6-12 months","1-2 years","Over 2 years"]

function generateAvatar(username) {
  const style = pick(["avataaars","adventurer","big-ears","bottts","fun-emoji","lorelei","open-peeps","personas"])
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(username)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
}

const TOOL_THEMES = {
  "agno-ai": { strengths: ["agent framework","multi-modal models","Python SDK","tool integration"], keywords: ["agents","AI agents","multi-modal","Python"] },
  "akool-ai": { strengths: ["video generation","face swap","AI avatars","real-time API"], keywords: ["video","face swap","avatars","API"] },
  "augment-code": { strengths: ["code completion","context-aware","refactoring","multi-file edits"], keywords: ["coding","autocomplete","refactoring","IDE"] },
  "bolt-new": { strengths: ["full-stack generation","instant preview","code export","prompt-to-app"], keywords: ["app generation","full-stack","prompt","code"] },
  "browser-use": { strengths: ["browser automation","AI agent","web scraping","form filling"], keywords: ["automation","browser","scraping","agent"] },
  "canva": { strengths: ["design templates","Magic Studio","drag-and-drop","team collaboration"], keywords: ["design","templates","graphics","collaboration"] },
  "captions-ai": { strengths: ["auto-captions","video subtitles","translation","editing"], keywords: ["captions","subtitles","video","translation"] },
  "cerebras-ai": { strengths: ["fast inference","large models","enterprise AI","low latency"], keywords: ["speed","inference","enterprise","performance"] },
  "chatgpt": { strengths: ["general AI","reasoning","creative writing","code assistance"], keywords: ["AI chat","productivity","reasoning","writing"] },
  "claude": { strengths: ["long context","safety","reasoning","document analysis"], keywords: ["AI safety","long context","reasoning","analysis"] },
  "cline": { strengths: ["autonomous coding","VS Code extension","multi-file","agent mode"], keywords: ["autonomous","coding","agent","VS Code"] },
  "comet-browser": { strengths: ["AI browsing","research","data extraction","automation"], keywords: ["browser","automation","research","extraction"] },
  "continue-dev": { strengths: ["open-source","IDE plugin","custom models","privacy"], keywords: ["open-source","IDE","privacy","customizable"] },
  "crawl4ai": { strengths: ["web crawling","data extraction","AI-powered","structured data"], keywords: ["crawling","scraping","extraction","web data"] },
  "cursor": { strengths: ["AI-first IDE","code generation","refactoring","multi-model"], keywords: ["coding","IDE","autocomplete","refactoring"] },
  "daytona": { strengths: ["dev environments","workspace manager","cloud IDE","teams"], keywords: ["dev environments","workspace","cloud","teams"] },
  "devin-ai": { strengths: ["autonomous dev","end-to-end","task completion","bug fixing"], keywords: ["autonomous","development","AI agent","end-to-end"] },
  "dia-browser": { strengths: ["browser agent","AI navigation","task automation","web tasks"], keywords: ["browser","agent","automation","navigation"] },
  "dify-ai": { strengths: ["workflow builder","LLM apps","RAG pipeline","no-code"], keywords: ["workflow","LLM","RAG","no-code"] },
  "e2b": { strengths: ["cloud sandbox","code execution","AI agents","SDK"], keywords: ["sandbox","execution","agents","cloud"] },
  "elevenlabs": { strengths: ["voice synthesis","TTS","voice cloning","multi-language"], keywords: ["voice","TTS","speech","audio"] },
  "exa-ai": { strengths: ["neural search","embedding API","semantic search","enterprise"], keywords: ["search","embeddings","semantic","neural"] },
  "firecrawl": { strengths: ["web scraping","crawl API","structured output","AI-ready"], keywords: ["scraping","crawl","API","data extraction"] },
  "flowise-ai": { strengths: ["visual workflow","LLM apps","no-code","RAG"], keywords: ["workflow","no-code","LLM","RAG"] },
  "genspark-ai": { strengths: ["AI search","SparkPages","visual results","summarization"], keywords: ["search","SparkPages","visual","summarization"] },
  "github-copilot": { strengths: ["code completion","IDE integration","multi-language","context-aware"], keywords: ["coding","autocomplete","IDE","productivity"] },
  "goose-ai": { strengths: ["agent framework","automation","task execution","SDK"], keywords: ["agents","automation","SDK","framework"] },
  "grammarly": { strengths: ["grammar check","writing assistant","tone detection","plagiarism"], keywords: ["writing","grammar","editing","tone"] },
  "groq": { strengths: ["fast inference","LPU architecture","low latency","developer API"], keywords: ["speed","inference","LPU","API"] },
  "hedra-ai": { strengths: ["video generation","character animation","AI actors","creative tools"], keywords: ["video","animation","characters","creative"] },
  "higgsfield-ai": { strengths: ["video generation","face swap","AI video","editing"], keywords: ["video","generation","AI","editing"] },
  "hunyuan-ai": { strengths: ["video generation","multimodal","Chinese AI","creative"], keywords: ["video","multimodal","generation","AI"] },
  "inngest": { strengths: ["workflow engine","function queues","background jobs","TypeScript SDK"], keywords: ["workflows","queues","jobs","background"] },
  "jasper": { strengths: ["content writing","brand voice","marketing copy","templates"], keywords: ["writing","content","marketing","copy"] },
  "jina-ai": { strengths: ["neural search","embeddings","CLIP","multi-modal search"], keywords: ["search","embeddings","CLIP","neural"] },
  "julius-ai": { strengths: ["data analysis","chart generation","CSV analysis","insights"], keywords: ["data","analysis","charts","insights"] },
  "kimi-ai": { strengths: ["long context","document analysis","Chinese AI","research"], keywords: ["long context","analysis","research","documents"] },
  "langflow": { strengths: ["visual workflow","LangChain","RAG builder","no-code"], keywords: ["workflow","LangChain","RAG","no-code"] },
  "letta-ai": { strengths: ["memory-augmented AI","conversational AI","long-term memory","agents"], keywords: ["memory","conversation","agents","AI"] },
  "lindy-ai": { strengths: ["workflow automation","AI agent","SaaS tools","no-code"], keywords: ["automation","workflow","no-code","agent"] },
  "livekit-agents": { strengths: ["voice agents","real-time","WebRTC","SDK"], keywords: ["voice","real-time","agents","WebRTC"] },
  "llamacloud": { strengths: ["LlamaIndex","managed RAG","data indexing","cloud"], keywords: ["RAG","LlamaIndex","indexing","cloud"] },
  "lovable": { strengths: ["app generation","UI building","prompt-to-app","deployment"], keywords: ["app generation","UI","prompt","building"] },
  "manus-ai": { strengths: ["task automation","AI agent","browser","multi-step"], keywords: ["agent","automation","tasks","browser"] },
  "mastra-ai": { strengths: ["AI framework","agent building","workflows","TypeScript"], keywords: ["framework","agents","workflows","TypeScript"] },
  "mem0": { strengths: ["memory layer","personalized AI","user memory","context"], keywords: ["memory","personalization","context","AI"] },
  "midjourney": { strengths: ["image generation","artistic quality","creative","style control"], keywords: ["images","art","generation","creative"] },
  "minimax-ai": { strengths: ["video generation","multimodal","creative AI","chinese model"], keywords: ["video","generation","multimodal","creative"] },
  "n8n-ai-agent": { strengths: ["workflow automation","AI agent","integrations","no-code"], keywords: ["automation","workflows","no-code","integrations"] },
  "notion-ai": { strengths: ["workspace AI","writing","Q&A","knowledge management"], keywords: ["workspace","writing","knowledge","AI"] },
  "openhands": { strengths: ["autonomous coding","open-source","agent","software dev"], keywords: ["autonomous","coding","open-source","agent"] },
  "openrouter": { strengths: ["model hub","API gateway","multi-model","cost optimization"], keywords: ["API","models","gateway","routing"] },
  "pearai": { strengths: ["code assistant","multi-model","IDE","AI pairing"], keywords: ["coding","assistant","IDE","multi-model"] },
  "perplexity": { strengths: ["AI search","cited sources","research","real-time"], keywords: ["search","research","sources","information"] },
  "pika-labs": { strengths: ["video generation","AI video","creative","editing"], keywords: ["video","generation","creative","editing"] },
  "pipecat-ai": { strengths: ["voice pipeline","real-time","audio processing","SDK"], keywords: ["voice","pipeline","audio","real-time"] },
  "pydanticai": { strengths: ["Pydantic","data validation","AI SDK","type-safe"], keywords: ["Pydantic","validation","SDK","type-safe"] },
  "qwen-chat": { strengths: ["language model","reasoning","long context","multilingual"], keywords: ["chat","reasoning","multilingual","AI"] },
  "runway": { strengths: ["video generation","Gen-3","editing","creative tools"], keywords: ["video","generation","editing","Gen-3"] },
  "sambanova": { strengths: ["AI inference","enterprise","fast chips","open models"], keywords: ["inference","enterprise","speed","open-source"] },
  "seedream-ai": { strengths: ["image generation","creative AI","artistic","generative"], keywords: ["images","generation","artistic","creative"] },
  "skyvern": { strengths: ["browser automation","visual AI","form filling","AI agent"], keywords: ["automation","browser","visual","agent"] },
  "tavily-ai": { strengths: ["search API","real-time","AI-ready","structured data"], keywords: ["search","API","real-time","data"] },
  "tavus-ai": { strengths: ["personalized video","AI avatars","video generation","marketing"], keywords: ["video","personalized","avatars","marketing"] },
  "together-ai": { strengths: ["model hub","API","fine-tuning","inference"], keywords: ["API","models","inference","fine-tuning"] },
  "trae-ai": { strengths: ["coding assistant","IDE","AI completion","debugging"], keywords: ["coding","IDE","assistant","completion"] },
  "trigger-dev": { strengths: ["background jobs","scheduling","serverless","TypeScript SDK"], keywords: ["jobs","scheduling","serverless","workflows"] },
  "v0-by-vercel": { strengths: ["UI generation","React components","prompt-to-code","Tailwind"], keywords: ["UI","components","generation","React"] },
}

function getToolTheme(slug) {
  return TOOL_THEMES[slug] || { strengths: ["core features","AI capabilities","performance","usability"], keywords: ["AI","tool","productivity","features"] }
}

const OPENERS = [
  "I've been using this daily and it's impressive.",
  "After testing several alternatives, this is my pick.",
  "I'll be honest: this exceeded what I expected.",
  "I was skeptical but decided to give it a real try.",
  "A colleague recommended this and I'm glad they did.",
  "I've spent weeks evaluating this thoroughly.",
  "Let me share my experience after extensive use.",
  "I've tried many similar tools, but this stands out.",
  "When I started, I wasn't sure what to expect.",
  "After months of use, here's my honest take.",
  "I needed a solid solution and this delivered.",
  "This came highly recommended, so I tested it.",
  "I've been in tech for years and this genuinely impressed me.",
  "My team adopted this recently. Here's what we found.",
  "I was looking for something specific and this fit perfectly.",
  "I put this through real-world testing over several weeks.",
  "This has been on my radar, so I finally tried it.",
  "I run a small team and this has been transformative.",
  "As a freelancer, I need reliable tools. This is one.",
  "I've been testing AI tools extensively. This caught my attention.",
  "My first impression was positive. Deep use confirmed it.",
  "I bought into the hype and was pleasantly surprised.",
  "I didn't expect much, but this proved me wrong.",
  "After thorough real-world testing, here's my verdict.",
  "I've used this across multiple projects and it's solid.",
]

const MIDDLES = [
  "The interface is clean and intuitive.",
  "Setup was straightforward and I was productive quickly.",
  "The learning curve is gentle but has depth.",
  "Performance has been consistently reliable.",
  "Output quality is impressive with minimal editing needed.",
  "Customer support responded quickly when I had questions.",
  "Regular updates show active development.",
  "Integration with my stack was seamless.",
  "Pricing is fair for the value provided.",
  "The attention to UX detail stands out.",
  "The AI handles complex tasks with accuracy.",
  "It handles nuanced requests surprisingly well.",
  "Documentation is thorough with good examples.",
  "Team collaboration features work well.",
  "The API is well-designed and documented.",
  "Processing speed for large tasks is impressive.",
  "Customization options are extensive.",
  "Multi-language support is solid.",
  "The mobile experience is polished.",
  "Export options cover all formats I need.",
  "The template system saves significant time.",
  "Batch processing is excellent for bulk work.",
  "Search is fast and accurate.",
  "Version history provides peace of mind.",
  "Analytics give useful insights.",
  "Keyboard shortcuts make frequent tasks faster.",
  "The community forum is active and helpful.",
  "Onboarding tutorials are well-made.",
  "The free tier is generous for evaluation.",
  "Security features meet enterprise standards.",
]

const ENDERS = [
  "I highly recommend giving this a try.",
  "I'll continue using this long-term.",
  "It's become essential to my daily workflow.",
  "I've already recommended it to colleagues.",
  "Strengths far outweigh the minor drawbacks.",
  "Excellent value for the price point.",
  "I'm glad I made the switch.",
  "It's earned a permanent spot in my toolkit.",
  "Worth every penny for the productivity gains.",
  "A solid recommendation for most use cases.",
  "The team clearly cares about quality.",
  "Excited to see how this evolves.",
  "It solved problems I didn't know I had.",
  "My only regret is not trying it sooner.",
  "This is the standard I now measure against.",
  "A worthy investment for serious professionals.",
  "I'll be upgrading to a higher tier soon.",
  "It does exactly what it promises.",
  "The ROI has been significant.",
  "I'm confident this will only improve.",
]

const SPECIFIC_PRAISE = [
  "The AI accuracy is remarkable across use cases.",
  "It adapts to my workflow over time impressively.",
  "Performance vs competitors is noticeably better.",
  "Saves me hours every week with automation.",
  "Customization depth is exactly what I need.",
  "The team collaboration features are excellent.",
  "AI rarely misunderstands context.",
  "Real-time sync works flawlessly.",
  "Export quality is consistently high.",
  "Integrations are smooth and reliable.",
]

const SPECIFIC_CRITICISM = [
  "Occasional slowdowns during peak hours.",
  "Some advanced features need a higher tier.",
  "A few integrations feel less polished.",
  "The learning curve for advanced features exists.",
  "Occasional bugs after updates.",
  "Customer support can be slow on weekends.",
  "The free tier is limited for serious use.",
  "Some features are buried in menus.",
  "The pricing jump between tiers is steep.",
  "Offline mode is missing or limited.",
]

const PROS_POOL = [
  "Fast performance","Clean interface","Great value","Excellent AI","Easy to use",
  "Reliable uptime","Powerful features","Regular updates","Good documentation",
  "Responsive support","Active community","Stable API","Intuitive design",
  "Consistent results","Good integrations","High accuracy","Fast response times",
  "Affordable pricing","Quality AI models","User-friendly","Good onboarding",
  "Seamless collaboration","Robust security","Multi-language support","Excellent templates",
  "Great customization","Smart suggestions","Efficient workflow","Time-saving features",
  "Professional output","Scalable for teams","Good analytics","Reliable exports",
  "Fast search","Good version history","Excellent shortcuts","Generous free tier",
  "Clear pricing","Good API docs","Regular bug fixes","Thoughtful UX",
  "Great for beginners","Advanced features","Active development","Cross-platform",
  "Enterprise-ready","Excellent tutorials","Lightweight","Good API design",
]

const CONS_POOL = [
  "Premium features cost extra","Could be faster","UI needs polish",
  "Advanced features have learning curve","Mobile app needs work","Limited free tier",
  "Integration gaps","Support can be slow","Export options limited",
  "Occasional bugs","Documentation could be deeper","Pricey on renewal",
  "No offline mode","Some features feel unfinished","API rate limits",
  "Can be resource heavy","Occasional downtime","Basic collaboration",
  "Limited customization","No self-hosted option","Team pricing adds up",
  "Slow peak hours","Search could be better","Template library limited",
  "Onboarding could improve","Backup options limited","Plugin system immature",
  "File size limits","Memory usage high","Confusing pricing tiers",
  "No free trial for pro","SSO requires enterprise","Region restrictions",
]

const USE_CASES = [
  "Coding","Web Development","Software Engineering","AI Development",
  "Content Creation","Blog Writing","Copywriting","Marketing",
  "Social Media","Video Production","Video Editing","Animation",
  "Graphic Design","UI/UX Design","Product Design",
  "Research","Academic Research","Market Research","Data Analysis",
  "SEO","Digital Marketing","Email Marketing","Advertising",
  "Education","E-Learning","Teaching","Student Projects",
  "Business Operations","Project Management","Team Collaboration","Productivity",
  "Customer Support","Sales","Lead Generation","Outreach",
  "Creative Writing","Storytelling","Script Writing","Journalism",
  "Data Science","Machine Learning","Prompt Engineering","Automation",
]

function generateBody(toolName, theme) {
  const opener = pick(OPENERS)
  const mid = pick(MIDDLES)
  const praise = pick(SPECIFIC_PRAISE)
  const criticism = pick(SPECIFIC_CRITICISM)
  const ender = pick(ENDERS)
  const keyword = pick(theme.keywords)
  const strength = pick(theme.strengths)
  const style = Math.random()

  if (style < 0.25) return `${opener} ${mid} The ${strength} is particularly impressive. ${ender}`
  if (style < 0.5) return `${opener} ${praise} On the flip side, ${criticism.toLowerCase()} ${ender}`
  if (style < 0.75) return `${opener} I primarily use it for ${keyword} tasks. ${mid} ${praise} ${ender}`
  return `${opener} ${mid} ${praise} ${criticism} Overall, ${ender}`
}

function getPros(theme) {
  return pickN([...PROS_POOL, ...theme.keywords.map(k => `Great ${k}`), ...theme.strengths], randomInt(2, 4))
}

function getCons() { return pickN(CONS_POOL, randomInt(1, 3)) }
function getRating() { return weightedPick([5,4,3,2,1], [45,35,15,4,1]) }

function getTitle(toolName, theme) {
  return pick([
    () => `${pick(["Excellent","Great","Amazing","Solid","Good","Honest","Comprehensive"])} ${toolName} ${pick(["Review","Experience","Overview","Take"])}`,
    () => `${toolName}: ${pick(["What I Learned","Pros and Cons","The Verdict","Worth It?","My Honest Take"])}`,
    () => `${pick(["Why I Choose","Why I Switched to","Getting Started with","How I Mastered","My Journey with"])} ${toolName}`,
    () => `${pick(["Using","Testing","Trying","Reviewing"])} ${toolName} for ${pick(["30 Days","3 Months","My Workflow","Client Work","My Team"])}`,
    () => `${pick(["The Best","A Practical","An Honest","A Developer's","A Designer's","A Beginner's"])} ${pick(["Guide to","Review of","Look at"])} ${toolName}`,
    () => `${toolName} ${pick(["Review 2025","in Action","vs Competitors","After the Update","for Teams","for Developers"])}`,
    () => `${pick(["5 Reasons","3 Ways","10 Things","7 Features"])} ${toolName} ${pick(["Excels","Delivers","Stands Out","Wins","Impresses"])}`,
    () => `${pick(["How","Why"])} ${toolName} ${pick(["Changed My Workflow","Boosted Productivity","Transformed My Work","Became Essential"])}`,
    () => `${pick(["A Year with","First Month with","First Week with","6 Months with"])} ${toolName}`,
    () => `${pick(["Freelancer's","Developer's","Designer's","Marketer's","Student's","Founder's"])} ${pick(["Take on","Experience with","Review of"])} ${toolName}`,
    () => `Is ${toolName} ${pick(["the Best?","Overhyped?","Worth Your Money?","Right for You?"])}`,
    () => `${toolName}: From ${pick(["Skeptic","Beginner","Power User","Newbie"])} to ${pick(["Believer","Fan","Expert","Advocate"])}`,
  ])()
}

// ── Generate Reviews for One Tool ────────────────────────────
function generateReviewsForTool(tool, userPool, profileMap, count) {
  const theme = getToolTheme(tool.slug)
  const used = new Set()
  const reviews = []

  for (let i = 0; i < count; i++) {
    const userId = userPool[i % userPool.length]
    const profile = profileMap[userId]

    let title, body
    let attempts = 0
    do { title = getTitle(tool.name, theme); attempts++ } while (used.has(title) && attempts < 30)
    used.add(title)
    attempts = 0
    do { body = generateBody(tool.name, theme); attempts++ } while (used.has(body) && attempts < 30)
    used.add(body)

    const rating = getRating()

    reviews.push({
      user_id: userId,
      tool_id: tool.id,
      rating,
      title,
      content: body,
      pros: getPros(theme),
      cons: getCons(),
      is_approved: true,
      reviewer_profile_id: profile.id,
      best_for: pick(USE_CASES),
      would_recommend: rating >= 3,
      helpful_count: weightedPick([0,1,2,5,8,11,17,24,38,57], [5,10,15,20,15,10,8,5,2]),
      usage_duration: pick(USAGE_DURATIONS),
      primary_use_case: pick(USE_CASES),
      verified_user: true,
      verified_purchase: false,
      created_at: daysAgo(randomInt(1, 365)),
    })
  }

  return reviews
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  console.log("=".repeat(50))
  console.log("  MASTER REVIEW SYSTEM v1.0")
  console.log("=".repeat(50))

  // 1. Check reviewer_profiles exists
  const { error: tableCheck } = await supabase.from("reviewer_profiles").select("id").limit(1)
  if (tableCheck && tableCheck.code === "42P01") {
    console.error("\n✗ reviewer_profiles table does NOT exist!")
    console.error("  Run this SQL in Supabase Dashboard first:")
    console.error("  1. Go to https://supabase.com/dashboard/project/voavwcfvnviwtweyeeej/sql/new")
    console.error("  2. Paste supabase/migrations/015_reviewer_profiles.sql")
    console.error("  3. Click Run, then run this script again.\n")
    process.exit(1)
  }

  // 2. Fetch published tools
  console.log("Fetching tools...")
  const { data: tools } = await supabase.from("tools").select("id, name, slug").eq("is_published", true)
  if (!tools) { console.error("No tools found"); process.exit(1) }
  console.log(`  ${tools.length} tools found`)

  const REVIEWS_PER_TOOL = 25
  const totalNeeded = tools.length * REVIEWS_PER_TOOL
  const PROFILE_COUNT = Math.min(500, totalNeeded)

  // 3. Get existing auth users for FK
  console.log("\nFetching auth users...")
  const { data: authResult } = await supabase.auth.admin.listUsers()
  let userIds = (authResult?.users || []).map(u => u.id)
  if (userIds.length === 0) {
    console.error("No auth users found. Create some first.");
    process.exit(1)
  }
  console.log(`  ${userIds.length} auth users available`)

  // Check existing reviews to avoid (user_id, tool_id) duplicates
  console.log("Checking existing reviews...")
  const { data: existingReviews } = await supabase.from("reviews").select("user_id, tool_id")
  const existingPairs = new Set((existingReviews || []).map(r => `${r.user_id}|${r.tool_id}`))
  console.log(`  ${existingPairs.size} existing review slots occupied`)

  // 4. Generate reviewer profiles
  console.log(`\nGenerating ${PROFILE_COUNT} reviewer profiles...`)
  const profiles = []
  const usedNames = new Set()

  for (let i = 0; i < PROFILE_COUNT; i++) {
    const gender = pick(["male","female"])
    const firstNames = gender === "male" ? FIRST_NAMES_MALE : FIRST_NAMES_FEMALE
    let firstName, lastName, fullName
    let tries = 0
    do {
      firstName = pick(firstNames)
      lastName = pick(LAST_NAMES)
      fullName = `${firstName} ${lastName}`
      tries++
    } while (usedNames.has(fullName) && tries < 50)
    usedNames.add(fullName)

    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(10,999)}`
    const country = pick(COUNTRIES)
    const city = getCity(country)
    const expLevel = weightedPick(["beginner","intermediate","advanced","expert"], [25,40,25,10])
    const yrRange = { beginner: [0,1,2], intermediate: [2,4,6], advanced: [5,8,12], expert: [10,15,20] }[expLevel]

    profiles.push({
      id: randomUUID(),
      full_name: fullName,
      username,
      avatar_url: generateAvatar(username),
      country,
      city,
      job_title: pick(JOB_TITLES),
      industry: pick(INDUSTRIES),
      experience_level: expLevel,
      years_of_experience: randomInt(yrRange[0], yrRange[yrRange.length-1]),
      joined_at: daysAgo(randomInt(30, 1095)),
      helpful_count: weightedPick([0,1,2,5,8,12,20,35,57,89], [10,15,20,20,15,10,5,3,1,1]),
    })
  }

  // 5. Insert profiles
  console.log("Inserting profiles...")
  let profilesInserted = 0
  for (let i = 0; i < profiles.length; i += 50) {
    const batch = profiles.slice(i, i + 50)
    const { error, data } = await supabase.from("reviewer_profiles").insert(batch).select("id")
    if (error && error.code !== "23505") {
      console.error(`  Batch error at ${i}: ${error.message}`)
    } else if (data) {
      profilesInserted += data.length
    }
  }
  console.log(`  ${profilesInserted} profiles inserted`)

  // Map profiles by their IDs
  const profileMap = {}
  for (const p of profiles.slice(0, profilesInserted)) {
    profileMap[p.id] = p
  }

  // 6. Generate and insert reviews per tool
  console.log(`\nGenerating ${totalNeeded} reviews (${REVIEWS_PER_TOOL} per tool)...`)

  let totalInserted = 0
  const BATCH_SIZE = 25

  for (const tool of tools) {
    // Find user_ids that haven't reviewed this tool
    const availableUserIds = userIds.filter(uid => !existingPairs.has(`${uid}|${tool.id}`))
    if (availableUserIds.length < REVIEWS_PER_TOOL) {
      console.log(`  ${tool.name}: only ${availableUserIds.length} available user_ids, skipping`)
      continue
    }

    const userPool = pickN(availableUserIds, REVIEWS_PER_TOOL)
    const reviews = generateReviewsForTool(tool, userPool, profileMap, REVIEWS_PER_TOOL)

    let inserted = 0
    for (let i = 0; i < reviews.length; i += BATCH_SIZE) {
      const batch = reviews.slice(i, i + BATCH_SIZE)
      const { error, data } = await supabase.from("reviews").insert(batch).select("id")
      if (error) {
        if (error.code !== "23505") {
          console.error(`  ${tool.name}: ${error.message}`)
        }
      } else if (data) {
        inserted += data.length
      }
    }

    totalInserted += inserted
    console.log(`  ✓ ${tool.name.padEnd(18)} ${inserted}/${REVIEWS_PER_TOOL}`)
  }

  console.log(`\n  Total: ${totalInserted} reviews added`)

  // 7. Verify
  console.log("\n=== VERIFICATION ===\n")

  const { count: profileCount } = await supabase
    .from("reviewer_profiles")
    .select("id", { count: "exact", head: true })
  console.log(`Reviewer profiles: ${profileCount}`)

  const { count: reviewCount } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
  console.log(`Total reviews in DB: ${reviewCount}`)

  const { data: top } = await supabase
    .from("tools")
    .select("name, rating, review_count")
    .eq("is_published", true)
    .order("review_count", { ascending: false })
    .limit(5)
  if (top) {
    console.log("\nTop 5 tools by review count:")
    for (const t of top) {
      const stars = "★".repeat(Math.round(t.rating)) + "☆".repeat(5 - Math.round(t.rating))
      console.log(`  ${t.name.padEnd(18)} ${String(t.rating).padEnd(5)} ${stars}  ${t.review_count} reviews`)
    }
  }

  console.log("\n✓ Master Review System setup complete!")
}

main().catch(console.error)

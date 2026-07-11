-- ============================================================================
-- LinkDit Seed Data
-- 10 categories, 30 tools, 10 articles, 6 comparisons
-- ============================================================================

-- 1. Categories
-- ============================================================================
insert into public.categories (id, name, slug, description, icon_name, tool_count) values
  (gen_random_uuid(), 'AI Writing',       'ai-writing',       'AI-powered writing assistants and content generation tools.',       'PenLine',     6),
  (gen_random_uuid(), 'Image Generation', 'image-generation',  'Create stunning visuals and artwork using artificial intelligence.',    'Image',      5),
  (gen_random_uuid(), 'Video',            'video',             'AI tools for video creation, editing and enhancement.',                 'Video',      3),
  (gen_random_uuid(), 'Coding',           'coding',            'AI-assisted development tools for faster and smarter coding.',          'Code2',      4),
  (gen_random_uuid(), 'Productivity',     'productivity',      'Boost your efficiency with AI-powered productivity tools.',             'Zap',        3),
  (gen_random_uuid(), 'Marketing',        'marketing',         'AI tools to optimize campaigns, SEO and audience targeting.',           'BarChart3',  3),
  (gen_random_uuid(), 'Audio',            'audio',             'AI voice, music and audio generation and processing tools.',             'Music',      2),
  (gen_random_uuid(), 'Analytics',        'analytics',         'Data analysis and business intelligence powered by AI.',                'TrendingUp', 2),
  (gen_random_uuid(), 'Education',        'education',         'AI tutoring, course creation and personalized learning platforms.',      'BookOpen',   1),
  (gen_random_uuid(), 'Design',           'design',            'AI design tools for UI/UX, branding and creative work.',               'Palette',    1)
on conflict (slug) do nothing;

-- 2. Tools (3 per category)
-- ============================================================================

-- AI Writing
with cat as (select id from public.categories where slug = 'ai-writing' limit 1)
insert into public.tools (name, slug, description, category_id, website_url, pricing, rating, review_count, featured, is_published) values
  ('ChatGPT',      'chatGPT',       'Advanced conversational AI for content, coding, brainstorming and creative tasks.',       (select id from cat), 'https://chat.openai.com',     'Free',     4.8, 2400, true,  true),
  ('Claude',       'claude',        'Safe, accurate AI assistant built for enterprise reasoning and analysis.',               (select id from cat), 'https://claude.ai',          'Free',     4.6, 1200, true,  true),
  ('Jasper AI',    'jasper-ai',     'AI content platform for marketing teams to create on-brand content at scale.',           (select id from cat), 'https://jasper.ai',          'Paid',     4.3, 850,  false, true),
  ('Copy.ai',      'copy-ai',       'AI copywriting tool that generates high-converting marketing copy in seconds.',          (select id from cat), 'https://copy.ai',           'Preemium', 4.1, 620,  false, true),
  ('Writesonic',   'writesonic',    'AI writer for blogs, ads and product descriptions with SEO optimization.',               (select id from cat), 'https://writesonic.com',    'Preemium', 4.2, 540,  false, true),
  ('Grammarly',    'grammarly',     'AI writing assistant that improves grammar, clarity and tone across all platforms.',       (select id from cat), 'https://grammarly.com',     'Preemium', 4.7, 3100, true,  true);

-- Image Generation
with cat as (select id from public.categories where slug = 'image-generation' limit 1)
insert into public.tools (name, slug, description, category_id, website_url, pricing, rating, review_count, featured, is_published) values
  ('Midjourney',   'midjourney',    'Generate stunning photorealistic images from natural language descriptions.',              (select id from cat), 'https://midjourney.com',    'Paid',     4.7, 1800, true,  true),
  ('DALL-E 3',     'dall-e-3',      'OpenAI image generation model with exceptional prompt adherence and detail.',             (select id from cat), 'https://openai.com/dall-e-3','Paid',     4.6, 1500, true,  true),
  ('Stable Diffusion', 'stable-diffusion', 'Open-source image generation model with fine-tuning and customisation options.',    (select id from cat), 'https://stability.ai',      'Free',     4.4, 1100, false, true),
  ('Leonardo AI',  'leonardo-ai',   'AI art generator for game assets, concept art and creative projects.',                   (select id from cat), 'https://leonardo.ai',      'Preemium', 4.3, 780,  false, true),
  ('Adobe Firefly','adobe-firefly', 'Generative AI for images, vectors and design assets integrated with Creative Cloud.',    (select id from cat), 'https://firefly.adobe.com','Paid',     4.5, 920,  true,  true);

-- Video
with cat as (select id from public.categories where slug = 'video' limit 1)
insert into public.tools (name, slug, description, category_id, website_url, pricing, rating, review_count, featured, is_published) values
  ('Runway',       'runway',        'Professional video editing and generation platform powered by generative AI.',           (select id from cat), 'https://runwayml.com',      'Paid',     4.4, 720,  true,  true),
  ('Synthesia',    'synthesia',     'AI video creation platform with lifelike avatars for corporate and training videos.',    (select id from cat), 'https://synthesia.io',      'Paid',     4.3, 640,  false, true),
  ('Pika Labs',    'pika-labs',     'AI video generation from text prompts and image inputs.',                                (select id from cat), 'https://pika.art',         'Free',     4.1, 410,  false, true);

-- Coding
with cat as (select id from public.categories where slug = 'coding' limit 1)
insert into public.tools (name, slug, description, category_id, website_url, pricing, rating, review_count, featured, is_published) values
  ('Cursor',       'cursor',        'AI-first code editor that helps you ship software faster with context-aware completions.',(select id from cat), 'https://cursor.com',        'Free',     4.9, 3100, true,  true),
  ('GitHub Copilot','github-copilot','AI pair programmer that suggests code and functions in real time across IDEs.',           (select id from cat), 'https://github.com/features/copilot','Paid',4.8, 4500, true, true),
  ('Tabnine',      'tabnine',       'AI code completion tool that learns your coding patterns and provides suggestions.',    (select id from cat), 'https://tabnine.com',       'Preemium', 4.2, 870,  false, true),
  ('Replit AI',    'replit-ai',     'Cloud IDE with AI-powered code generation and debugging capabilities.',                   (select id from cat), 'https://replit.com',        'Preemium', 4.4, 1200, false, true);

-- Productivity
with cat as (select id from public.categories where slug = 'productivity' limit 1)
insert into public.tools (name, slug, description, category_id, website_url, pricing, rating, review_count, featured, is_published) values
  ('Gamma',        'gamma',         'Create beautiful presentations, documents and websites in seconds with AI.',             (select id from cat), 'https://gamma.app',         'Free',     4.5, 980,  true,  true),
  ('Notion AI',    'notion-ai',     'Integrated AI assistant for note-taking, project management and knowledge base.',        (select id from cat), 'https://notion.so',         'Paid',     4.6, 2100, true,  true),
  ('Mem',          'mem',           'AI-powered workspace that organises your notes and knowledge automatically.',            (select id from cat), 'https://mem.ai',           'Preemium', 4.0, 340,  false, true);

-- Marketing
with cat as (select id from public.categories where slug = 'marketing' limit 1)
insert into public.tools (name, slug, description, category_id, website_url, pricing, rating, review_count, featured, is_published) values
  ('HubSpot AI',   'hubspot-ai',    'CRM platform with AI-powered marketing automation, analytics and content tools.',         (select id from cat), 'https://hubspot.com',       'Preemium', 4.5, 1800, true,  true),
  ('Surfer SEO',   'surfer-seo',    'AI-driven SEO tool that helps optimise content for better search rankings.',             (select id from cat), 'https://surferseo.com',     'Paid',     4.3, 760,  false, true),
  ('Pictory',      'pictory',       'AI tool that transforms long-form content into engaging social media posts.',            (select id from cat), 'https://pictory.ai',       'Preemium', 4.1, 490,  false, true);

-- Audio
with cat as (select id from public.categories where slug = 'audio' limit 1)
insert into public.tools (name, slug, description, category_id, website_url, pricing, rating, review_count, featured, is_published) values
  ('ElevenLabs',   'elevenlabs',    'AI voice synthesis with realistic intonation, emotion and multilingual support.',        (select id from cat), 'https://elevenlabs.io',     'Preemium', 4.7, 1400, true,  true),
  ('Soundraw',     'soundraw',      'AI music generation tool for creating royalty-free background tracks and beats.',        (select id from cat), 'https://soundraw.io',      'Paid',     4.2, 380,  false, true);

-- Analytics
with cat as (select id from public.categories where slug = 'analytics' limit 1)
insert into public.tools (name, slug, description, category_id, website_url, pricing, rating, review_count, featured, is_published) values
  ('Tableau AI',   'tableau-ai',    'AI-powered data visualisation and business intelligence platform.',                      (select id from cat), 'https://tableau.com',       'Paid',     4.4, 900,  false, true),
  ('Julius AI',    'julius-ai',     'AI data analyst that answers questions about your data in plain English.',               (select id from cat), 'https://julius.ai',         'Preemium', 4.3, 520,  true,  true);

-- Education
with cat as (select id from public.categories where slug = 'education' limit 1)
insert into public.tools (name, slug, description, category_id, website_url, pricing, rating, review_count, featured, is_published) values
  ('Khanmigo',     'khanmigo',      'AI tutor from Khan Academy that guides students through problems step by step.',           (select id from cat), 'https://khanacademy.org',   'Free',     4.5, 1100, true,  true);

-- Design
with cat as (select id from public.categories where slug = 'design' limit 1)
insert into public.tools (name, slug, description, category_id, website_url, pricing, rating, review_count, featured, is_published) values
  ('Canva AI',     'canva-ai',      'AI-powered design platform for creating graphics, presentations and social media visuals.',(select id from cat), 'https://canva.com',        'Preemium', 4.6, 2800, true,  true);

-- 3. Articles
-- ============================================================================
insert into public.articles (title, slug, description, content, category_id, read_time, published_at, author_name, featured, is_published) values
  (
    'How to Use AI for Content Creation in 2026',
    'how-to-use-ai-for-content-creation-2026',
    'A comprehensive guide to leveraging AI writing tools for blogs, social media and marketing copy.',
    'Artificial intelligence has revolutionised the way we create content. From blog posts to social media captions, AI writing tools can help you produce high-quality content in a fraction of the time. In this guide, we explore the best practices for using tools like ChatGPT and Claude to elevate your content strategy.\n\n## Why AI for Content Creation?\nAI tools can generate ideas, draft outlines, and even write full articles. They help overcome writer''s block, maintain consistency, and scale content production without sacrificing quality.\n\n## Getting Started\n1. Choose the right tool for your needs\n2. Craft clear, specific prompts\n3. Edit and personalise the output\n4. Fact-check all AI-generated content\n\nThe key is to use AI as a collaborator, not a replacement for human creativity.',
    (select id from public.categories where slug = 'ai-writing'),
    '5 min read',
    now() - interval '3 days',
    'Sarah Chen',
    true,
    true
  ),
  (
    'Comparing Top AI Image Generators: Which One Wins?',
    'comparing-top-ai-image-generators',
    'An in-depth comparison of Midjourney, DALL-E 3 and Stable Diffusion features and output quality.',
    'The AI image generation landscape has evolved rapidly. Three platforms dominate the market: Midjourney, DALL-E 3, and Stable Diffusion. Each offers unique strengths depending on your use case.\n\n## Midjourney\nBest for artistic and photorealistic imagery. Excels at aesthetic composition and creative interpretation.\n\n## DALL-E 3\nSuperior prompt adherence and text rendering. Ideal for precise commercial applications.\n\n## Stable Diffusion\nOpen-source flexibility. Perfect for developers who need fine-tuning and custom model training.\n\n## Verdict\nYour choice depends on your priorities: artistic quality (Midjourney), precision (DALL-E 3), or customisation (Stable Diffusion).',
    (select id from public.categories where slug = 'image-generation'),
    '8 min read',
    now() - interval '6 days',
    'Alex Rivera',
    true,
    true
  ),
  (
    'The Complete Guide to AI-Powered Coding Assistants',
    'complete-guide-ai-coding-assistants',
    'Everything you need to know about using Cursor, Copilot and other AI coding tools effectively.',
    'AI coding assistants have become indispensable tools for modern developers. This guide covers the top tools and how to integrate them into your workflow.\n\n## Top AI Coding Tools\n- **Cursor**: AI-first editor with deep context understanding\n- **GitHub Copilot**: The most widely adopted AI pair programmer\n- **Tabnine**: Privacy-focused with local model options\n\n## Best Practices\n- Use AI for boilerplate and repetitive tasks\n- Always review generated code for security\n- Leverage AI for test generation and debugging\n\nAI coding tools don''t replace developers; they amplify productivity and let you focus on architecture and problem-solving.',
    (select id from public.categories where slug = 'coding'),
    '6 min read',
    now() - interval '8 days',
    'Marcus Lee',
    true,
    true
  ),
  (
    '10 Productivity Tools That Will Change How You Work',
    '10-productivity-tools-change-how-you-work',
    'Discover AI-powered tools that streamline your workflow and boost daily productivity.',
    'Productivity is about working smarter, not harder. AI tools are transforming how we manage tasks, take notes, and create documents.\n\n## Our Top Picks\n1. **Notion AI** – Intelligent note-taking and project management\n2. **Gamma** – AI-powered presentations in seconds\n3. **Mem** – Automatic knowledge organisation\n\nEach tool addresses a specific pain point, from meeting notes to content creation. The key is finding the right combination for your workflow.\n\nStart with one tool, master it, then expand your stack.',
    (select id from public.categories where slug = 'productivity'),
    '4 min read',
    now() - interval '10 days',
    'Priya Sharma',
    false,
    true
  ),
  (
    'AI Marketing Tools Every Business Should Use in 2026',
    'ai-marketing-tools-every-business-2026',
    'Leverage AI to optimise your marketing campaigns, SEO and customer engagement strategies.',
    'Marketing teams are adopting AI at an unprecedented rate. From content generation to predictive analytics, AI tools are reshaping how businesses reach their audiences.\n\n## Essential AI Marketing Tools\n- **HubSpot AI**: Automate campaigns and personalise at scale\n- **Surfer SEO**: Optimise content for search rankings\n- **Pictory**: Repurpose long content for social media\n\n## ROI Impact\nBusinesses using AI in marketing report 30-50% improvements in content production speed and 20% increases in engagement rates.',
    (select id from public.categories where slug = 'marketing'),
    '7 min read',
    now() - interval '12 days',
    'Jordan Kim',
    false,
    true
  ),
  (
    'How AI Is Transforming Video Production',
    'ai-transforming-video-production',
    'From automated editing to text-to-video generation, AI is revolutionising the video industry.',
    'Video production used to require expensive equipment and specialised skills. AI is democratising the field, making professional-quality video accessible to everyone.\n\n## Key Innovations\n- **Text-to-Video**: Generate footage from descriptions\n- **AI Avatars**: Create presenter-led videos without filming\n- **Automated Editing**: AI cuts and assembles raw footage\n\nTools like Runway and Synthesia are leading this transformation, enabling creators to produce studio-quality content from their laptops.',
    (select id from public.categories where slug = 'video'),
    '5 min read',
    now() - interval '15 days',
    'Taylor Brooks',
    false,
    true
  ),
  (
    'The Rise of AI Voice Cloning: Opportunities and Ethics',
    'rise-of-ai-voice-cloning-opportunities-ethics',
    'Explore the capabilities of AI voice synthesis and the ethical considerations surrounding the technology.',
    'AI voice cloning has reached remarkable fidelity. Tools like ElevenLabs can replicate human speech with near-perfect accuracy, opening new possibilities for content creation, accessibility and entertainment.\n\n## Applications\n- Audiobook narration\n- Multilingual content localisation\n- Voice assistants with personality\n\n## Ethical Considerations\n- Consent and identity protection\n- Deepfake detection and prevention\n- Regulatory frameworks\n\nThe technology is powerful, but responsible use requires clear guidelines and transparency.',
    (select id from public.categories where slug = 'audio'),
    '6 min read',
    now() - interval '18 days',
    'Dr. Amara Okafor',
    false,
    true
  ),
  (
    'Data Analytics with AI: Making Sense of Big Data',
    'data-analytics-ai-making-sense-big-data',
    'How AI-powered analytics tools help businesses extract actionable insights from complex data.',
    'Modern businesses generate massive amounts of data. AI analytics tools help cut through the noise to find meaningful patterns and predictions.\n\n## Top Analytics Tools\n- **Tableau AI**: Visual intelligence with natural language queries\n- **Julius AI**: Conversational data analysis\n- **Custom AI Models**: Tailored solutions for specific industries\n\nAI analytics isn''t just for data scientists. Modern tools let anyone ask questions about their data in plain English and get instant answers.',
    (select id from public.categories where slug = 'analytics'),
    '7 min read',
    now() - interval '20 days',
    'Rachel Torres',
    false,
    true
  ),
  (
    'AI in Education: Personalized Learning at Scale',
    'ai-education-personalized-learning-scale',
    'Discover how AI tutors and adaptive learning platforms are transforming education for students worldwide.',
    'Education is undergoing an AI-driven transformation. Personalised learning platforms adapt to each student''s pace, style and knowledge gaps.\n\n## How AI Helps\n- **Adaptive Assessments**: Questions adjust to skill level\n- **24/7 Tutoring**: AI tutors available anytime\n- **Content Summarisation**: Digest complex topics quickly\n\nKhan Academy''s Khanmigo and similar tools are pioneering this shift, making quality education more accessible than ever.',
    (select id from public.categories where slug = 'education'),
    '5 min read',
    now() - interval '22 days',
    'Prof. James Whitfield',
    false,
    true
  ),
  (
    'Designing with AI: Tools Every Designer Should Know',
    'designing-with-ai-tools-every-designer-should-know',
    'AI design tools are augmenting creativity and speeding up workflows for designers at every level.',
    'AI is not replacing designers; it''s giving them superpowers. From generating design variations to automating repetitive tasks, AI tools let designers focus on strategy and creativity.\n\n## Must-Know Tools\n- **Canva AI**: Template-based design with AI magic\n- **Adobe Firefly**: Generative AI integrated into Creative Cloud\n- **Figma AI**: Smart layout and component suggestions\n\nWhether you''re a seasoned professional or a beginner, AI design tools can dramatically improve your output and efficiency.',
    (select id from public.categories where slug = 'design'),
    '4 min read',
    now() - interval '25 days',
    'Mia Gonzalez',
    false,
    true
  );

-- 4. Comparisons
-- ============================================================================
do $$
declare
  chatgpt_id     uuid; claude_id      uuid; midjourney_id uuid; dalle3_id     uuid;
  cursor_id      uuid; copilot_id     uuid; gamma_id      uuid; notion_ai_id  uuid;
  runway_id      uuid; synthesia_id   uuid; elevenlabs_id  uuid; soundraw_id   uuid;
  writing_cat    uuid; image_cat      uuid; coding_cat     uuid; productivity_cat uuid;
  video_cat      uuid; audio_cat      uuid;
begin
  select id into writing_cat    from public.categories where slug = 'ai-writing' limit 1;
  select id into image_cat      from public.categories where slug = 'image-generation' limit 1;
  select id into coding_cat     from public.categories where slug = 'coding' limit 1;
  select id into productivity_cat from public.categories where slug = 'productivity' limit 1;
  select id into video_cat      from public.categories where slug = 'video' limit 1;
  select id into audio_cat      from public.categories where slug = 'audio' limit 1;

  select id into chatgpt_id     from public.tools where slug = 'chatGPT' limit 1;
  select id into claude_id      from public.tools where slug = 'claude' limit 1;
  select id into midjourney_id  from public.tools where slug = 'midjourney' limit 1;
  select id into dalle3_id      from public.tools where slug = 'dall-e-3' limit 1;
  select id into cursor_id      from public.tools where slug = 'cursor' limit 1;
  select id into copilot_id     from public.tools where slug = 'github-copilot' limit 1;
  select id into gamma_id       from public.tools where slug = 'gamma' limit 1;
  select id into notion_ai_id   from public.tools where slug = 'notion-ai' limit 1;
  select id into runway_id      from public.tools where slug = 'runway' limit 1;
  select id into synthesia_id   from public.tools where slug = 'synthesia' limit 1;
  select id into elevenlabs_id  from public.tools where slug = 'elevenlabs' limit 1;
  select id into soundraw_id    from public.tools where slug = 'soundraw' limit 1;

  insert into public.comparisons (slug, title, description, tool_a_id, tool_b_id, category_id, is_published, is_featured, views) values
    ('chatgpt-vs-claude', 'ChatGPT vs Claude', 'Compare the two leading conversational AI assistants across features, pricing and capabilities.',
      chatgpt_id, claude_id, writing_cat, true, true, 1200),
    ('midjourney-vs-dalle3', 'Midjourney vs DALL-E 3', 'Which AI image generator produces better results? We compare output quality, pricing and features.',
      midjourney_id, dalle3_id, image_cat, true, true, 980),
    ('cursor-vs-copilot', 'Cursor vs GitHub Copilot', 'A detailed comparison of the two most popular AI coding assistants.',
      cursor_id, copilot_id, coding_cat, true, true, 1500),
    ('gamma-vs-notion-ai', 'Gamma vs Notion AI', 'Compare AI-powered productivity tools for presentations, documents and knowledge management.',
      gamma_id, notion_ai_id, productivity_cat, true, false, 540),
    ('runway-vs-synthesia', 'Runway vs Synthesia', 'Which AI video platform is right for your content creation needs? We break down features and pricing.',
      runway_id, synthesia_id, video_cat, true, false, 720),
    ('elevenlabs-vs-soundraw', 'ElevenLabs vs Soundraw', 'Compare AI audio tools for voice synthesis and music generation.',
      elevenlabs_id, soundraw_id, audio_cat, true, false, 410)
  on conflict (slug) do nothing;
end $$;

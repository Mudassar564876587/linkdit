export interface GlossaryItem {
  word: string
  definition: string
  explanation: string
  example: string
  relatedTopics: string[]
}

export const glossary: GlossaryItem[] = [
  {
    word: "LLM",
    definition: "Large Language Model",
    explanation: "A neural network model trained on vast amounts of text data that can understand, generate, and manipulate human language. Examples include GPT-4, Claude, and Gemini.",
    example: "ChatGPT is powered by an LLM that has been trained on hundreds of billions of words from the internet.",
    relatedTopics: ["Token", "Context Window", "Inference", "Fine-tuning"],
  },
  {
    word: "Token",
    definition: "The basic unit of text that an LLM processes",
    explanation: "Tokens are chunks of text (words, parts of words, or characters) that language models use as input and output. One token is roughly 0.75 words in English. Models have token limits that determine how much text they can process at once.",
    example: "The sentence 'AI is amazing' might be split into tokens like ['AI', ' is', ' amazing'].",
    relatedTopics: ["LLM", "Context Window", "Temperature"],
  },
  {
    word: "Embedding",
    definition: "A numerical vector representation of text or data",
    explanation: "Embeddings convert text into arrays of numbers that capture semantic meaning. Similar texts have similar embeddings, enabling semantic search, clustering, and classification. They are the foundation of RAG systems.",
    example: "The words 'king' and 'royalty' would have similar embedding vectors, while 'king' and 'apple' would be far apart.",
    relatedTopics: ["RAG", "Vector Database", "LLM"],
  },
  {
    word: "Fine-tuning",
    definition: "Training a pre-trained model on additional domain-specific data",
    explanation: "Fine-tuning adapts a general-purpose LLM to perform better on specific tasks or domains by continuing the training process on a smaller, targeted dataset. This improves performance without training a model from scratch.",
    example: "A customer support team fine-tunes GPT-4 on their past conversation logs to create a bot that matches their brand voice.",
    relatedTopics: ["LLM", "RAG", "Inference"],
  },
  {
    word: "RAG",
    definition: "Retrieval-Augmented Generation",
    explanation: "A technique that combines information retrieval with text generation. Before answering, the system searches a knowledge base for relevant documents and provides them as context to the LLM, improving accuracy and reducing hallucinations.",
    example: "A RAG-powered support bot searches the company's help articles for relevant info before answering a customer question.",
    relatedTopics: ["Embedding", "Vector Database", "Hallucination", "LLM"],
  },
  {
    word: "Inference",
    definition: "The process of an AI model generating a prediction or output",
    explanation: "Inference is when a trained model runs on new input data to produce an output. For LLMs, this means generating text based on a prompt. Inference speed is measured in tokens per second and is critical for real-time applications.",
    example: "When you type a question into ChatGPT and it starts generating a response, that is inference in action.",
    relatedTopics: ["LLM", "Token", "Temperature"],
  },
  {
    word: "Vector Database",
    definition: "A database optimized for storing and searching embeddings",
    explanation: "Vector databases store embeddings alongside metadata and enable fast similarity searches. They are essential for RAG systems, recommendation engines, and semantic search applications. Examples include Pinecone, Weaviate, and pgvector.",
    example: "A vector database stores embeddings of all your company documents, allowing instant retrieval of the most relevant ones for any query.",
    relatedTopics: ["Embedding", "RAG", "Semantic Search"],
  },
  {
    word: "Prompt",
    definition: "The input text provided to an AI model to guide its output",
    explanation: "A prompt is the instruction or question given to an AI model. Effective prompt engineering involves crafting prompts with clear instructions, context, and examples to produce desired outputs. Prompts can include system instructions, user messages, and few-shot examples.",
    example: "'Write a professional email to a client about a project delay. Keep it empathetic and solution-focused.' is a prompt.",
    relatedTopics: ["LLM", "Temperature", "Context Window"],
  },
  {
    word: "Hallucination",
    definition: "When an AI model generates false or misleading information confidently",
    explanation: "Hallucinations occur when LLMs produce information that sounds plausible but is factually incorrect. This happens because models predict likely text patterns rather than retrieving verified facts. RAG and grounding techniques help reduce hallucinations.",
    example: "An LLM might invent a biography for a real person, including false dates, places, and achievements that sound convincing.",
    relatedTopics: ["RAG", "LLM", "Grounding"],
  },
  {
    word: "Agent",
    definition: "An AI system that can autonomously perform tasks using tools and reasoning",
    explanation: "AI agents combine LLMs with the ability to use tools, execute code, browse the web, and take actions in the world. They can break down complex goals into steps, make decisions, and learn from feedback. Examples include AutoGPT and Claude with tool use.",
    example: "An AI agent given the goal 'plan a team offsite' would research venues, check calendars, compare prices, and book everything autonomously.",
    relatedTopics: ["LLM", "API", "Workflow", "MCP"],
  },
  {
    word: "MCP",
    definition: "Model Context Protocol",
    explanation: "An open protocol developed by Anthropic that standardizes how AI models connect to external tools and data sources. MCP enables models to securely interact with APIs, databases, and file systems through a unified interface.",
    example: "Using MCP, Claude can directly query your company's PostgreSQL database, read files from Google Drive, and post to Slack.",
    relatedTopics: ["Agent", "API", "Workflow"],
  },
  {
    word: "API",
    definition: "Application Programming Interface",
    explanation: "An API allows different software systems to communicate with each other. AI APIs (like OpenAI's API or Claude's API) let developers integrate AI capabilities into their own applications programmatically.",
    example: "A travel app uses the GPT-4 API to generate personalized itinerary descriptions for users based on their preferences.",
    relatedTopics: ["Agent", "MCP", "Workflow"],
  },
  {
    word: "Workflow",
    definition: "A sequence of automated steps combining AI and traditional logic",
    explanation: "AI workflows chain together multiple prompts, API calls, conditional logic, and human review steps to accomplish complex tasks. Modern workflow tools let you build these visually without coding.",
    example: "A content workflow might: 1) Research topic via Perplexity, 2) Generate outline via Claude, 3) Write draft via ChatGPT, 4) Human reviews, 5) Auto-publish.",
    relatedTopics: ["Agent", "API", "Prompt"],
  },
  {
    word: "Reasoning",
    definition: "The ability of an AI model to work through problems step by step",
    explanation: "Advanced AI models can demonstrate reasoning by breaking down complex questions into intermediate steps, showing their work, and arriving at conclusions through logical deduction. Chain-of-thought prompting enhances this capability.",
    example: "When solving a math problem, the model might write: 'Step 1: Calculate the area. Step 2: Multiply by the rate. Step 3: Add the base fee.'",
    relatedTopics: ["LLM", "Prompt", "Agent"],
  },
  {
    word: "Context Window",
    definition: "The maximum amount of text an AI model can process at once",
    explanation: "The context window determines how much information the model can consider when generating a response. Larger context windows (like Claude's 200K tokens) enable processing entire books, long codebases, or extensive conversation histories in a single request.",
    example: "With a 200K token context window, Claude can analyze the entire Great Gatsby novel and answer detailed questions about any passage.",
    relatedTopics: ["LLM", "Token", "RAG"],
  },
  {
    word: "Temperature",
    definition: "A parameter that controls the randomness of AI model outputs",
    explanation: "Temperature ranges from 0 to 2 (typically). Lower values (0-0.3) produce more deterministic, focused outputs ideal for factual tasks. Higher values (0.7-1.5) produce more creative, varied outputs good for brainstorming and creative writing.",
    example: "Set temperature to 0.1 when asking for a factual answer, and 0.8 when asking the AI to write a creative story.",
    relatedTopics: ["LLM", "Inference", "Prompt"],
  },
  {
    word: "Semantic Search",
    definition: "Search that understands the meaning and intent behind queries",
    explanation: "Unlike keyword search which matches exact words, semantic search uses embeddings to find content related to the meaning of a query. It can find relevant results even when they use different words than the search query.",
    example: "Searching for 'budget-friendly laptops' would find results mentioning 'cheap notebooks' because the meanings are similar.",
    relatedTopics: ["Embedding", "Vector Database", "RAG"],
  },
  {
    word: "Zero-shot Prompting",
    definition: "Asking an AI to perform a task without providing examples",
    explanation: "Zero-shot prompting relies entirely on the model's pre-trained knowledge to complete a task without any examples in the prompt. Modern LLMs are surprisingly capable at zero-shot tasks, though performance improves with few-shot examples.",
    example: "'Translate this to French: Hello, how are you?' — the model translates without ever having seen a translation example in this conversation.",
    relatedTopics: ["Prompt", "Few-shot Prompting", "LLM"],
  },
  {
    word: "Few-shot Prompting",
    definition: "Providing examples in the prompt to guide the AI's output",
    explanation: "Including a few input-output examples in your prompt significantly improves the model's performance on specific tasks. The examples help the model understand the format, style, and reasoning pattern you expect.",
    example: "Show the model 3 examples of customer emails with appropriate responses before asking it to respond to a new email.",
    relatedTopics: ["Prompt", "Zero-shot Prompting", "Fine-tuning"],
  },
  {
    word: "Chain-of-Thought",
    definition: "A prompting technique that encourages step-by-step reasoning",
    explanation: "Chain-of-thought (CoT) prompting asks the model to show its working steps before arriving at an answer. This dramatically improves performance on complex reasoning tasks like math problems, logic puzzles, and multi-step analysis.",
    example: "'Solve this step by step: A store has 15 apples, sells 7, then gets 10 more. How many apples now?'",
    relatedTopics: ["Reasoning", "Prompt", "LLM"],
  },
  {
    word: "Grounding",
    definition: "Connecting AI outputs to verifiable sources of truth",
    explanation: "Grounding ensures AI-generated content is based on factual, up-to-date information by providing relevant source documents as context. RAG is the most common grounding technique, but grounding can also involve API calls to live databases.",
    example: "A grounded AI assistant searches your company wiki for the latest vacation policy before answering a question about PTO.",
    relatedTopics: ["RAG", "Hallucination", "Embedding"],
  },
  {
    word: "LoRA",
    definition: "Low-Rank Adaptation — a lightweight fine-tuning method",
    explanation: "LoRA adapts large models by training small, task-specific weight matrices that plug into the base model. It's much faster and cheaper than full fine-tuning, making it practical to customize models for specific tasks on consumer hardware.",
    example: "A photographer uses LoRA to fine-tune Flux on 20 of their photos, creating a model that generates new images in their unique style.",
    relatedTopics: ["Fine-tuning", "LLM", "Inference"],
  },
  {
    word: "Multimodal",
    definition: "AI models that can process multiple types of data (text, images, audio, video)",
    explanation: "Multimodal AI models can understand and generate content across different modalities simultaneously. For example, Gemini and GPT-4V can analyze images, understand charts, and process video frames in addition to text.",
    example: "Upload a photo of a handwritten note and ask the AI to transcribe and translate it — that's multimodal AI in action.",
    relatedTopics: ["LLM", "Embedding", "Inference"],
  },
  {
    word: "Function Calling",
    definition: "The ability of an AI model to invoke external tools and APIs",
    explanation: "Function calling allows LLMs to request specific functions be executed, passing structured parameters. The application executes the function and returns results to the model, enabling integration with real-world systems and data sources.",
    example: "An AI travel agent calls a get_weather(location, date) function to check weather before suggesting activities.",
    relatedTopics: ["API", "Agent", "Workflow"],
  },
  {
    word: "Retrieval",
    definition: "The process of finding relevant information from a knowledge base",
    explanation: "Retrieval is the R in RAG — searching a database or document store for information relevant to the user's query. Hybrid retrieval combines semantic search (embeddings) with keyword search (BM25) for the best results.",
    example: "A legal AI assistant retrieves relevant case law and statutes before helping a lawyer draft a brief.",
    relatedTopics: ["RAG", "Embedding", "Vector Database"],
  },
  {
    word: "Synthetic Data",
    definition: "Artificially generated data used to train or test AI models",
    explanation: "Synthetic data is created by AI rather than collected from real-world sources. It's used to augment training datasets, test model behavior, and generate examples for scenarios where real data is scarce or privacy-sensitive.",
    example: "A company generates synthetic customer support conversations to train a chatbot without exposing real customer data.",
    relatedTopics: ["Fine-tuning", "LLM", "Training"],
  },
]

export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export function getGlossaryByLetter(letter: string): GlossaryItem[] {
  return glossary.filter((g) => g.word[0].toUpperCase() === letter.toUpperCase())
}

export function searchGlossary(query: string): GlossaryItem[] {
  const q = query.toLowerCase()
  return glossary.filter(
    (g) =>
      g.word.toLowerCase().includes(q) ||
      g.definition.toLowerCase().includes(q) ||
      g.explanation.toLowerCase().includes(q)
  )
}

export function getRelatedGlossaryItems(topics: string[]): GlossaryItem[] {
  return glossary.filter((g) => topics.includes(g.word))
}

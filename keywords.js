// =============================================
//  Categorized keyword dictionary
// =============================================
const KEYWORD_CATEGORIES = {
    lang: {
        label: "Languages",
        tagClass: "cat-lang",
        labelClass: "label-lang",
        keywords: [
            "Python", "JavaScript", "TypeScript", "Java", "C++", "C#",
            "Go", "Ruby", "PHP", "Swift", "Kotlin", "Rust", "Scala",
            "R", "MATLAB", "Bash", "Shell", "Solidity", "Zig", "Mojo",
            "C", "Objective-C", "Perl", "Haskell", "Elixir", "Clojure"
        ]
    },
    frame: {
        label: "Frameworks & Libraries",
        tagClass: "cat-frame",
        labelClass: "label-frame",
        keywords: [
            "Django", "Flask", "FastAPI", "React", "Angular", "Vue",
            "Next.js", "Node.js", "Express", "Spring Boot", "Laravel",
            "TailwindCSS", "Bootstrap", "Redux", "GraphQL", "React Native",
            "Svelte", "Flutter", "Remix", "SolidJS", "Electron", "Qt",
            "PySide", "Fast.ai", "Keras", "Streamlit", "Plotly", "D3.js"
        ]
    },
    db: {
        label: "Databases",
        tagClass: "cat-db",
        labelClass: "label-db",
        keywords: [
            "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis",
            "SQLite", "DynamoDB", "Cassandra", "Elasticsearch",
            "Oracle", "Firebase", "Pinecone", "Milvus", "Weaviate",
            "Neo4j", "MariaDB", "CouchDB", "InfluxDB", "ClickHouse"
        ]
    },
    cloud: {
        label: "Cloud",
        tagClass: "cat-cloud",
        labelClass: "label-cloud",
        keywords: [
            "AWS", "Azure", "GCP", "Google Cloud", "S3", "EC2",
            "Lambda", "Serverless", "Heroku", "Vercel", "Netlify",
            "DigitalOcean", "CloudFlare", "Supabase", "Cloudinary",
            "Auth0", "Appwrite", "Terraform Cloud", "CloudFormation"
        ]
    },
    devops: {
        label: "DevOps & Tools",
        tagClass: "cat-devops",
        labelClass: "label-devops",
        keywords: [
            "Docker", "Kubernetes", "Git", "GitHub", "GitLab", "CI/CD",
            "Jenkins", "Terraform", "Ansible", "Linux", "Nginx",
            "REST", "REST API", "API", "Microservices", "Agile", "Scrum",
            "JIRA", "Postman", "Bitbucket", "CircleCI", "Prometheus",
            "Grafana", "OpenTelemetry", "Datadog", "Sentry", "Helm"
        ]
    },
    ml: {
        label: "AI / ML",
        tagClass: "cat-ml",
        labelClass: "label-ml",
        keywords: [
            "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
            "OpenCV", "NLP", "LLM", "Transformers", "Scikit-learn",
            "Pandas", "NumPy", "Data Science", "Computer Vision",
            "Generative AI", "LangChain", "OpenAI", "Anthropic",
            "Llama", "Mistral", "Stable Diffusion", "Prompt Engineering",
            "LangGraph", "Vector Database", "RAG", "Fine-tuning"
        ]
    },
    other: {
        label: "Other",
        tagClass: "cat-other",
        labelClass: "label-other",
        keywords: [
            "HTML", "CSS", "JSON", "XML", "OAuth", "JWT", "SOAP",
            "WebSocket", "Kafka", "RabbitMQ", "gRPC", "Selenium",
            "Unit Testing", "TDD", "OOP", "Design Patterns", "Webpack",
            "Vite", "ESLint", "Prettier", "Cybersecurity", "Blockchain",
            "Web3", "Material UI", "Chakra UI", "Stripe"
        ]
    }
};

// Flat list for backward compat
const TECH_KEYWORDS = Object.values(KEYWORD_CATEGORIES)
    .flatMap(cat => cat.keywords);

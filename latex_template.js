// =============================================
//  User's LaTeX Resume Template
//  %%SKILLS%% is replaced at build time with
//  dynamically generated keyword skill rows.
// =============================================
const LATEX_TEMPLATE = String.raw`\documentclass[10pt, letterpaper]{article}

% Packages:
\usepackage[
    ignoreheadfoot,
    top=2 cm,
    bottom=2 cm,
    left=2 cm,
    right=2 cm,
    footskip=1.0 cm,
]{geometry}
\usepackage{titlesec}
\usepackage{tabularx}
\usepackage{array}
\usepackage[dvipsnames]{xcolor}
\definecolor{primaryColor}{RGB}{0, 0, 0}
\usepackage{enumitem}
\usepackage{fontawesome5}
\usepackage{amsmath}
\usepackage[
    pdftitle={%%FULLNAME%%'s CV},
    pdfauthor={%%FULLNAME%%},
    pdfcreator={LaTeX with RenderCV},
    colorlinks=true,
    urlcolor=primaryColor
]{hyperref}
\usepackage[pscoord]{eso-pic}
\usepackage{calc}
\usepackage{bookmark}
\usepackage{lastpage}
\usepackage{changepage}
\usepackage{paracol}
\usepackage{ifthen}
\usepackage{needspace}
\usepackage{iftex}

\ifPDFTeX
    \input{glyphtounicode}
    \pdfgentounicode=1
    \usepackage[T1]{fontenc}
    \usepackage[utf8]{inputenc}
    \usepackage{lmodern}
\fi

\usepackage{charter}

\raggedright
\AtBeginEnvironment{adjustwidth}{\partopsep0pt}
\pagestyle{empty}
\setcounter{secnumdepth}{0}
\setlength{\parindent}{0pt}
\setlength{\topskip}{0pt}
\setlength{\columnsep}{0.15cm}
\pagenumbering{gobble}

\titleformat{\section}{\needspace{4\baselineskip}\bfseries\large}{}{0pt}{}[\vspace{1pt}\titlerule]
\titlespacing{\section}{-1pt}{0.3 cm}{0.2 cm}

\renewcommand\labelitemi{-}
\newenvironment{highlights}{
    \begin{itemize}[topsep=0.10 cm,parsep=0.10 cm,partopsep=0pt,itemsep=0pt,leftmargin=0 cm + 10pt]
}{\end{itemize}}

\newenvironment{highlightsforbulletentries}{
    \begin{itemize}[topsep=0.10 cm,parsep=0.10 cm,partopsep=0pt,itemsep=0pt,leftmargin=10pt]
}{\end{itemize}}

\newenvironment{onecolentry}{
    \begin{adjustwidth}{0 cm + 0.00001 cm}{0 cm + 0.00001 cm}
}{\end{adjustwidth}}

\newenvironment{twocolentry}[2][]{
    \onecolentry
    \def\secondColumn{#2}
    \setcolumnwidth{\fill, 4.5 cm}
    \begin{paracol}{2}
}{
    \switchcolumn \raggedleft \secondColumn
    \end{paracol}
    \endonecolentry
}

\newenvironment{threecolentry}[3][]{
    \onecolentry
    \def\thirdColumn{#3}
    \setcolumnwidth{, \fill, 4.5 cm}
    \begin{paracol}{3}
    {\raggedright #2} \switchcolumn
}{
    \switchcolumn \raggedleft \thirdColumn
    \end{paracol}
    \endonecolentry
}

\newenvironment{header}{
    \setlength{\topsep}{0pt}\par\kern\topsep\centering\linespread{1.5}
}{\par\kern\topsep}

\let\hrefWithoutArrow\href

\begin{document}
    \newcommand{\AND}{\unskip
        \cleaders\copy\ANDbox\hskip\wd\ANDbox
        \ignorespaces
    }
    \newsavebox\ANDbox
    \sbox\ANDbox{$|$}

    \begin{header}
        \fontsize{25 pt}{25 pt}\selectfont %%FULLNAME%%

        \vspace{5 pt}

        \normalsize
        \mbox{%%LOCATION%%}%
        \kern 5.0 pt%
        \AND%
        \kern 5.0 pt%
        \mbox{\hrefWithoutArrow{mailto:%%EMAIL%%}{%%EMAIL%%}}%
        \kern 5.0 pt%
        \AND%
        \kern 5.0 pt%
        \mbox{\hrefWithoutArrow{tel:%%PHONE%%}{%%PHONE%%}}%
        \kern 5.0 pt%
        \AND%
        \kern 5.0 pt%
        \mbox{\hrefWithoutArrow{%%LINKEDIN_URL%%}{linkedin}}%
        \kern 5.0 pt%
        \AND%
        \kern 5.0 pt%
        \mbox{\hrefWithoutArrow{%%GITHUB_URL%%}{github}}%
    \end{header}

    \vspace{5 pt - 0.3 cm}

    \section{Professional Summary}

        \begin{onecolentry}
            %%SUMMARY%%
        \end{onecolentry}

        \vspace{0.2 cm}

    \section{Technical Skills}

%%SKILLS%%

    \section{Experience}

%%EXPERIENCE%%

    \section{Education}

%%EDUCATION%%

    \section{Projects}

%%PROJECTS%%

\end{document}
`;

// Default personal info (editable via the builder UI)
const DEFAULT_PERSONAL = {
    fullName: "vab jhon",
    location: "Hyderabad",
    email: "vabjhon77@gmail.com",
    phone: "+91 9090909090",
    linkedinUrl: "https://www.linkedin.com/in/vabjhon/",
    githubUrl: "https://github.com/vabjhon",
    summary: "Python Developer with 2+ years of experience in backend development using Django, Flask. Skilled in building scalable web applications, RESTful APIs, and microservices with PostgreSQL/MySQL, Redis, Celery. Proficient in AWS, Docker, CI/CD, and Agile practices, with strong debugging and troubleshooting skills."
};

// Static sections from user's resume
const STATIC_EXPERIENCE = String.raw`        \begin{twocolentry}{Oct 2024 – Present}
            \textbf{Backend Developer}, xyz -- Hyderabad, India
        \end{twocolentry}
        \vspace{0.15 cm}
        \begin{onecolentry}
            \begin{highlights}
                \item Maintained and enhanced a Form-as-a-Service (SaaS) and Forms platform similar to Google Forms, built using \textbf{Django} and DRF.
                \item Designed and implemented secure request–response communication using \textbf{AES}-based encryption.
                \item Developed and integrated role-based access control (\textbf{RBAC}) and token-based authentication.
                \item Performed API \textbf{penetration testing} using \textbf{Burp Suite} and remediated security vulnerabilities.
                \item Integrated asynchronous email notifications using \textbf{Celery} and background workers.
                \item Managed and monitored the \textbf{Jenkins CI/CD} pipeline for automated builds and deployments.
            \end{highlights}
        \end{onecolentry}

        \vspace{0.2 cm}

        \begin{twocolentry}{March 2024 – June 2024}
            \textbf{Software Engineer}, XYS -- Nashik, India
        \end{twocolentry}
        \vspace{0.10 cm}
        \begin{onecolentry}
            \begin{highlights}
                \item Developed high-quality Python \textbf{REST APIs} integrated with business workflows.
                \item Built and deployed \textbf{Flask-based} services to support AI application features.
                \item Designed, trained, and deployed ML models for \textbf{computer vision} and face recognition.
                \item Implemented interactive \textbf{D3.js}-based data visualizations in web applications.
            \end{highlights}
        \end{onecolentry}

        \vspace{0.2 cm}

        \begin{twocolentry}{July 2023 – Feb 2024}
            \textbf{AIML Trainee}, XYS -- Nashik, India
        \end{twocolentry}
        \vspace{0.10 cm}
        \begin{onecolentry}
            \begin{highlights}
                \item Scraped and curated satellite and drone imagery for computer vision datasets.
                \item Performed image annotation and labeling for drone and satellite data pipelines.
                \item Implemented \textbf{object detection} models using \textbf{pre-trained YOLO} architectures.
            \end{highlights}
        \end{onecolentry}`;

const STATIC_EDUCATION = String.raw`        \begin{twocolentry}{May 2019 – May 2023}
            \textbf{Sandip University}, B.Tech - Computer Science and Engineering
        \end{twocolentry}
        \vspace{0.10 cm}
        \begin{onecolentry}
            \begin{highlights}
                \item GPA: 8.4
            \end{highlights}
        \end{onecolentry}`;

const STATIC_PROJECTS = String.raw`        \begin{twocolentry}{\href{https://yzz.app}{Project Link}}
            \textbf{Saas - SaaS}
        \end{twocolentry}
        \vspace{0.10 cm}
        \begin{onecolentry}
            \begin{highlights}
                \item A web application for managing event-linked forms with automation features.
                \item Tech Stack: Django DRF, React, MySQL
            \end{highlights}
        \end{onecolentry}

        \vspace{0.2 cm}

        \begin{twocolentry}{\href{https://github.com/vabjhon/WebShare}{Project Link}}
            \textbf{WebShare}
        \end{twocolentry}
        \vspace{0.10 cm}
        \begin{onecolentry}
            \begin{highlights}
                \item Fast, secure, lightweight file-sharing solution for local networks -- no internet dependency.
                \item Tech Stack: Django DRF, React, MongoDB
            \end{highlights}
        \end{onecolentry}

        \vspace{0.2 cm}

        \begin{twocolentry}{\href{https://github.com/vabjhon/BotBuilder}{Project Link}}
            \textbf{BotBuilder}
        \end{twocolentry}
        \vspace{0.10 cm}
        \begin{onecolentry}
            \begin{highlights}
                \item Full-stack AI agent creation platform using RAG for accurate, context-aware chatbot responses.
                \item Tech Stack: Django DRF, TypeScript, MongoDB
            \end{highlights}
        \end{onecolentry}`;

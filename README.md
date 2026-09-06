# LeaseLens AI — Evidence-Grounded Lease Intelligence Platform

> **Hackathon Positioning**: Track 01 — AI, ML & Emerging Technologies  
> **Primary Alignment**: PS 03 — Generative AI for Productivity  
> **Secondary Alignment**: PS 05 — AI for Prediction & Decision Support  

*LeaseLens AI transforms complex lease agreements into evidence-grounded legal intelligence reports—helping users understand obligations, identify potential risks, retrieve relevant statutory context, and ask questions with document & statutory citations.*

---

## 🏛️ System Architecture

```
[ USER INTERFACE ] (Landing Page / Upload Modal / 3-Pane Interactive Dashboard)
        │
        ├──► Page-Aware PDF Ingestion & OCR Engine (`src/lib/pdf/`)
        │       ├── Magic Bytes Signature Validation (%PDF-)
        │       ├── Page-by-Page Text Extraction (`extractText.ts`)
        │       ├── Quality & Text Coverage Evaluator (`detectQuality.ts`)
        │       └── Gemini Vision OCR Fallback (`ocrFallback.ts`) for scanned & image pages
        │
        ├──► Temporary Server Storage & Cleanup (`src/lib/storage/tempFiles.ts`)
        │
        ├──► AI Provider Abstraction (`src/lib/ai/`)
        │       ├── Gemini 2.5/1.5 Flash API Provider (`gemini-provider.ts`)
        │       └── Local Heuristic Fallback Engine (`fallback-provider.ts`)
        │
        ├──► Legal Research & RAG Engine (`src/lib/legal-rag/`)
        │       ├── Curated Statutory Legal Database (California, New York, Texas, UK, India, Canada)
        │       └── Hybrid Vector & Keyword Chunk Retriever
        │
        └──► 3-Level Legal Intelligence Dashboard
                ├── Level 1: Document Understanding ("What's inside this lease?")
                ├── Level 2: Risk Intelligence ("Likelihood × Impact Transparent Risk Model")
                └── Level 3: Statutory Legal Context ("CONTRACT EVIDENCE vs. LEGAL EVIDENCE")
```

---

## 🚀 Key Features

1. **Universal PDF Ingestion Engine (Text, Scanned, Image & Mixed PDFs)**:
   - **Magic Bytes Validation**: Verifies `%PDF-` signature (`0x25 0x50 0x44 0x46 0x2D`).
   - **Page-Aware Quality Scoring**: Evaluates text coverage per page.
   - **Gemini Vision OCR Fallback**: Automatically invokes Gemini 2.5/1.5 Flash Vision to extract visible content from scanned pages without throwing false "invalid PDF" errors.
   - **Mixed PDF Support**: Processes text pages via fast extraction and scanned pages via Vision OCR.

2. **3-Level Intelligence Dashboard**:
   - **Level 1 (Document Understanding)**: Metadata extraction, dates, landlord/tenant roles, page & section index.
   - **Level 2 (Risk Intelligence)**: Transparent `Likelihood × Impact` risk model classifying items into `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL`.
   - **Level 3 (Legal Context)**: Grounded cross-referencing against official statutory legislation.

3. **Core Differentiator — Split Evidence View**:
   - **CONTRACT EVIDENCE**: Page #, Section #, and exact contract snippet.
   - **LEGAL EVIDENCE**: Official statutory authority title, section citation, and statutory URL link.

4. **Grounded "Ask Your Lease" Assistant**:
   - Interactive Q&A strictly grounded in document text and statutory legal sources.
   - Outputs structured responses: *Short Answer*, *According to Your Lease*, *Relevant Clause*, *Legal Context*, *Source*, *Confidence Rating*, and *Legal Disclaimer*.

5. **Missing Information & Ambiguity Detectors**:
   - Detects omitted deposit interest terms, walkthrough protocols, and vague wording with suggested clarification questions.

6. **Instant Fail-Safe Demo Mode**:
   - Includes a sample 5-page residential lease agreement with 8 complex clauses running through the full live AI analysis pipeline.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons & UI**: Lucide React, Framer Motion
- **AI SDK**: `@google/genai` (Google Gemini 2.5/1.5 Flash & Vision)
- **Document Extractors**: `pdf-parse` (Text PDF), Gemini Vision (Scanned PDF OCR), `mammoth` (DOCX)
- **Legal RAG**: In-memory vector chunking & statutory database index

---

## 📦 Setup & Running Locally

1. **Clone & Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Ensure `.env.local` contains your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: `.env.local` is ignored in `.gitignore` to prevent secret exposure).*

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Run Verification & Build**:
   ```bash
   npx tsc --noEmit
   npm run build
   ```

---

## 📜 Legal Disclaimer

*This application provides AI-assisted document analysis for informational purposes only. It is not legal advice and does not establish an attorney-client relationship. Laws and their application vary by jurisdiction and circumstances. Consult a qualified legal professional for important legal decisions.*

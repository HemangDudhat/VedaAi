# VedaAI: Intelligent Assignment Generator

VedaAI is an AI-powered platform for educators and students that instantly generates tailored test papers and assignments from your own reference materials (PDFs, text, images). It features an Intelligent Document Hub to store reference material for reuse and a highly polished modern user interface.

## 🚀 Features

- **Authentication & Profile Management**: Secure registration and login flows paired with editable user profiles to manage organization details (School/College) and avatars.
- **AI Question Generation**: Generate multiple-choice, short-answer, and long-answer questions from reference files using Google's Gemini AI.
- **Intelligent Document Hub (My Library)**: Securely upload, store, and organize reference documents. Easily retrieve them for any future assignment generation without re-uploading.
- **Native In-App PDF Previews**: Inline high-performance browser rendering for PDFs allowing teachers to review references dynamically in-app before generating tests.
- **Precise PDF Slicing (Token Optimization)**: Specify exact "Start Page" and "End Page" ranges when uploading textbooks or long documents. The backend physically slices the PDF before passing it to Gemini, protecting token limits and focusing context.
- **PDF Export**: Single-click high-quality PDF generation of finished tests using `html2pdf.js`, preserving custom styles, instructions, and page layouts.
- **Premium UI Polish**: Fully responsive and animated interfaces built with Tailwind CSS, utilizing glassmorphic overlays (`backdrop-blur`), custom icons, and React Portals for modal layout containment.

---

## 🏗️ Architecture Overview

The system is designed as a decoupled full-stack application for maximum scalability:

### Frontend Layer
- **Framework**: Next.js (App Router) + React 19.
- **State Management**: Zustand for global wizard state management and layout control.
- **Styling**: Tailwind CSS v4 for rapid, responsive UI creation and utility-first animations.
- **Asset Uploads**: ImageKit client-side integration (`@imagekit/next` & direct REST uploading) to securely transmit profile pictures to the cloud from the client.
- **Key Libraries**: `html2pdf.js` for document exporting, `lucide-react` for iconography, and `react-dropzone` for drag-and-drop file uploads.

### Backend Layer
- **Framework**: Node.js + Express.
- **Database**: MongoDB (via Mongoose) to persistently store user profiles, library documents, and generated assignments.
- **Caching & Queues**: Redis + BullMQ for asynchronous, non-blocking background AI generation tasks (allowing the user to queue long generations safely).
- **Asset Signatures**: ImageKit backend service (`@imagekit/nodejs`) to securely generate temporary cryptographic signatures/tokens for client-side uploads.
- **AI Integration**: Google GenAI SDK (`@google/genai`).
- **File Processing**: `pdf-lib` for physical PDF manipulation and slicing; `multer` for multipart form parsing.

---

## 🛠️ Approach & Methodology

### 1. Robust File Handling
When an educator uploads a 500-page textbook, passing the entire document to an LLM is both expensive and error-prone (hallucinations outside the intended scope). Our approach introduces **Frontend Page Range selection**. The backend uses `pdf-lib` to physically chop out the specified pages, converting only that tiny subset to Base64 for the Gemini Vision/Text API.

### 2. UI/UX Excellence
We focused heavily on the aesthetic details (Bonus Requirement).
- Used dynamic hover states, transitions, and scaling micro-animations.
- Refactored all modals (like the Library Preview and Selection modals) to use **React Portals** (`createPortal`). This explicitly bypasses parent CSS opacity/transform local stacking contexts, guaranteeing that modals are consistently layered flawlessly over the entire application.

### 3. Asynchronous Generation
Calling LLMs takes time. We implemented BullMQ with Redis to offload the assignment generation to a background worker. This prevents HTTP timeouts, allows the frontend to poll for status, and improves the scalability of the backend server.

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or on Atlas (`mongodb://localhost:27017`)
- Redis running locally (`redis://localhost:6379`)
- Google Gemini API Key

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vedaai
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=super_secret_jwt_key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url
```

Start the backend development server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=ws://localhost:5000/ws
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url
```

Start the frontend development server:
```bash
npm run dev
```

### 3. Usage
- Open `http://localhost:3000` in your browser.
- Create an account, head to the **Create Assignment** wizard, upload a PDF (or select from **My Library**), input your page ranges, and generate your custom test!

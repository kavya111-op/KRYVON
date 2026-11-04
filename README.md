# KRYVON
### AI-Powered Autonomous Commerce

**Discover Smarter. Decide Faster. Shop Better.**

KRYVON is an AI-powered autonomous commerce platform designed to transform traditional online shopping into an intelligent, personalized and streamlined experience.

Combining AI-powered shopping assistance, product discovery, intelligent recommendations, product comparison and payment capabilities, KRYVON aims to simplify the entire shopping journey.

---

## 🚀 Vision

To redefine online shopping through intelligent AI agents that understand customer needs, simplify purchasing decisions and create a seamless shopping experience.

## 💡 The Problem

Traditional e-commerce platforms often require customers to:

- Search through hundreds of products manually.
- Compare specifications, features and prices across different listings.
- Spend time identifying products that match their requirements.
- Make purchasing decisions without personalized assistance.
- Navigate multiple steps before completing a purchase.

## ✨ Our Solution

KRYVON aims to bring product discovery, comparison and purchasing assistance together in one intelligent commerce experience.

The platform is designed to help users explore products, evaluate available options and make informed purchasing decisions with AI-powered assistance.

## ⚡ Key Features

- **AI Shopping Assistant:** Conversational assistance for shopping-related queries.
- **Smart Product Discovery:** Explore products based on customer requirements.
- **Intelligent Recommendations:** Discover relevant shopping options.
- **Product Comparison:** Compare products to make informed decisions.
- **Shopping Cart:** Organize and manage selected products.
- **PayPal Checkout Interface:** Payment workflow and checkout interface.
- **Agent Activity Timeline:** Visualize shopping agent activities.
- **Responsive Interface:** User-friendly shopping experience across devices.

*Note: Feature availability and integration status depend on the current implementation and configuration.*

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| Frontend | React 19 |
| Programming Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Backend | Node.js and Express.js |
| AI Integration | Google Gemini API (@google/genai) |
| Animations | Motion |
| Icons | Lucide React |
| Environment Configuration | dotenv |
| Version Control | Git and GitHub |
| Deployment | Netlify (planned) |

## 🏗️ Project Architecture

KRYVON follows a component-based architecture.

The major components include:

1. User Interface and Navigation
2. AI Shopping Assistant
3. Product Discovery System
4. Product Recommendation and Comparison
5. Shopping Cart Management
6. Payment and Checkout Interface
7. Backend API Services

The frontend is built using React and Vite, while Express.js provides the backend server environment.

## 📂 Project Structure

```text
KRYVON/
│
├── src/
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductComparisonModal.tsx
│   │   ├── PayPalCheckoutModal.tsx
│   │   ├── PaymentSuccessModal.tsx
│   │   └── AgentActivityTimeline.tsx
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── server.ts
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── metadata.json
│
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

*Additional source files and components may be added as development progresses.*

## 💻 Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)
- Git
- Visual Studio Code (recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/kavya111-op/KRYVON.git
```

### 2. Navigate to the Project Directory

```bash
cd KRYVON
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a local `.env` file using `.env.example` as a reference.

Add your required API credentials and configuration values to the local `.env` file.

**Never upload your actual `.env` file or API credentials to GitHub.**

### 5. Start the Development Server

```bash
npm run dev
```

### 6. Create a Production Build

```bash
npm run build
```

### 7. Check TypeScript

```bash
npm run lint
```

## 🔐 Environment Variables

KRYVON uses environment variables to manage sensitive credentials and application configuration.

Examples of configuration variables may include:

- `GEMINI_API_KEY`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PORT`

Refer to `.env.example` for the required variable names and configure actual credentials locally or through your hosting provider.

**Security:** Never commit API keys, passwords, access tokens or private credentials to a public repository.

## 🌐 Deployment

KRYVON is being prepared for deployment.

The planned deployment architecture includes:

- **Frontend:** Netlify
- **Backend:** A Node.js-compatible hosting environment
- **AI Services:** Google Gemini API
- **Payment Services:** PayPal

Backend hosting and API configuration will be finalized before the production launch.

**Live Demo:** Coming Soon

## 🔮 Future Scope

- More advanced conversational AI capabilities.
- Personalized shopping experiences.
- Multi-agent shopping workflows.
- Advanced product ranking and comparison.
- Improved budget-aware recommendations.
- Enhanced order and wishlist management.
- Additional payment and commerce integrations.

## 👩‍💻 Project Information

| Detail | Information |
|---|---|
| Project Name | KRYVON |
| Category | Agentic AI / Autonomous Commerce |
| Development | Solo Developer |
| Developer | Kavya Gupta |
| GitHub | [kavya111-op](https://github.com/kavya111-op) |

## 📜 License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

---

**KRYVON — Discover Smarter. Decide Faster. Shop Better.**

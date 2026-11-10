# KRYVON
### AI-POWERED AUTONOMOUS COMMERCE

**Discover smarter. Decide faster. Shop better.**

KRYVON is an AI-powered autonomous commerce platform designed to make online shopping more intelligent, personalized and convenient.

By combining AI-powered shopping assistance, intelligent product discovery, recommendations, product comparison and integrated checkout capabilities, KRYVON brings essential parts of the shopping journey together in one platform.

---

## 🚀 Vision

To redefine online shopping through intelligent AI agents that understand customer needs, simplify purchasing decisions and deliver a seamless shopping experience.

## 💡 The Problem

Traditional e-commerce platforms often require customers to:

- Search through numerous products manually.
- Compare specifications, features and prices across different listings.
- Spend time identifying products that match their requirements.
- Make purchasing decisions without personalized assistance.
- Navigate multiple steps before completing a purchase.

## ✨ Our Solution

KRYVON brings product discovery, comparison and shopping assistance together in an intelligent commerce experience.

The platform combines an AI shopping assistant with shopping management tools and an integrated checkout workflow to help customers explore products and make informed purchasing decisions.

## ⚡ Key Features

- **AI Shopping Assistant:** Conversational shopping assistance powered by Google Gemini.
- **Smart Product Discovery:** Explore products based on shopping requirements.
- **Intelligent Recommendations:** Discover relevant products through AI assistance.
- **Product Comparison:** Evaluate product options before making a purchase.
- **Shopping Cart:** Add products, manage quantities and view cart totals.
- **Wishlist:** Keep track of products of interest.
- **Budget Guardian:** Monitor shopping expenditure and budget-related information.
- **Dashboard:** Access shopping insights and platform information.
- **Order Ledger:** Review shopping and order activity.
- **PayPal Checkout:** Integrated PayPal payment workflow.
- **Agent Activity Timeline:** Follow shopping assistant activities.
- **Responsive Interface:** Designed for a convenient experience across screen sizes.

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| Frontend | React 19 |
| Programming Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS and CSS |
| Backend | Node.js and Express.js |
| AI Integration | Google Gemini API |
| Animations | Motion |
| Icons | Lucide React |
| Payment Integration | PayPal |
| Environment Configuration | dotenv |
| Version Control | Git and GitHub |

## 🏗️ Project Architecture

KRYVON follows a component-based architecture.

Its main application layers include:

1. **Frontend Interface:** React-based shopping interface and navigation.
2. **Product Discovery:** Product catalogue and browsing experience.
3. **AI Shopping Layer:** Gemini-powered shopping assistance.
4. **Shopping Management:** Cart, wishlist and budget-related features.
5. **Dashboard and Activity:** Shopping insights and activity tracking.
6. **Payment Layer:** PayPal checkout workflow.
7. **Backend Services:** Express-based server and API endpoints.

## 📁 Project Structure

```text
KRYVON/
│
├── public/
│   └── images/
│
├── src/
│   ├── assets/
│   │   └── images/
│   │
│   ├── components/
│   │   ├── CartDrawer.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ShoppingWorkspace.tsx
│   │   ├── WishlistSection.tsx
│   │   ├── BudgetGuardian.tsx
│   │   ├── OrderLedger.tsx
│   │   └── PayPalCheckoutModal.tsx
│   │
│   ├── data/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── server.ts
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

*The structure above highlights the main application directories and components.*

## 💻 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
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

Create a `.env` file in the project root using `.env.example` as a reference.

Configure the following variables:

```env
GEMINI_API_KEY=your_gemini_api_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PORT=3000
```

**Important:** Replace the placeholder values with your own credentials. Never commit your actual `.env` file or expose API keys and payment credentials publicly.

### 5. Start the Development Server

```bash
npm run dev
```

Open the local URL shown in your terminal.

### 6. Create a Production Build

```bash
npm run build
```

### 7. Run TypeScript Checks

```bash
npm run lint
```

### 8. Start the Production Server

```bash
npm start
```

## 🌐 Deployment

KRYVON is being prepared for deployment using **Render** as a Node.js Web Service.

The production deployment uses the Express backend to serve the application and requires the appropriate Gemini and PayPal environment variables.

Deployment URL will be added here once the service is live.

## 🔐 Security

- API credentials are stored in environment variables.
- The `.env` file is excluded from version control.
- Payment credentials should never be exposed in frontend code.
- Production environment variables should be configured through the hosting provider's secure settings.

## 📌 Project Information

| Detail | Information |
|---|---|
| Project Name | KRYVON |
| Category | AI / ML and Autonomous Commerce |
| Development | Solo Developer |
| Developer | Kavya Gupta |
| GitHub | [kavya111-op](https://github.com/kavya111-op) |
| Repository | [KRYVON](https://github.com/kavya111-op/KRYVON) |
| Deployment | Render (in progress) |

## 📜 License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

---

**KRYVON — Discover Smarter. Decide Faster. Shop Better.**

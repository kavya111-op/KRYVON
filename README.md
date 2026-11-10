# KRYVON
### AI-POWERED AUTONOMOUS COMMERCE

**Discover smarter. Decide faster. Shop better.**

KRYVON is an AI-powered autonomous commerce platform that brings intelligent product discovery, personalized shopping assistance, product comparison, shopping management and secure payment processing into one integrated experience.

Powered by **Google Gemini AI** and integrated with the **PayPal Developer Platform**, KRYVON helps customers move from understanding their shopping needs to discovering suitable products and completing purchases through a streamlined checkout experience.

**Live Application:** https://kryvon.onrender.com  
**GitHub Repository:** https://github.com/kavya111-op/KRYVON

---

## 🚀 Vision

To make online commerce more intelligent and convenient through AI-powered shopping assistance that understands customer requirements, simplifies purchasing decisions and connects product discovery with payment completion.

## 💡 The Problem

Traditional e-commerce platforms often require customers to:

- Search through numerous products manually.
- Compare product specifications, features and prices across listings.
- Spend time identifying products that match their needs.
- Make purchasing decisions without personalized assistance.
- Manage their shopping activities across different sections.
- Navigate multiple steps before completing a purchase.

These processes can make online shopping time-consuming and unnecessarily complicated.

## ✨ Our Solution

KRYVON combines AI-powered shopping assistance with an integrated commerce experience.

Customers can explore products, communicate with an AI shopping assistant, receive relevant recommendations, compare available options, manage their shopping cart and complete purchases through PayPal.

Rather than treating AI and payments as separate integrations, KRYVON connects them within a single shopping journey.

## ⚡ Key Features

### 🤖 1. AI Shopping Assistant

- Powered by Google Gemini API.
- Provides conversational shopping assistance.
- Helps customers understand their shopping requirements.
- Supports product discovery and shopping decisions.
- Provides AI-assisted recommendations.

### 🔍 2. Smart Product Discovery

- Browse products across multiple categories.
- Explore products based on shopping requirements.
- Access relevant product information.
- Discover suitable purchasing options.

### ⚖️ 3. Intelligent Product Comparison

- Compare available product options.
- Evaluate prices and product information.
- Make more informed purchasing decisions.

### 🛒 4. Shopping Cart

- Add multiple products to the cart.
- Increase or decrease product quantities.
- Remove products.
- View automatically updated item counts and totals.

### ❤️ 5. Wishlist

- Save products of interest.
- Manage selected products.
- Keep potential purchases organized.

### 💰 6. Budget Guardian

- Monitor shopping expenditure.
- View budget-related information.
- Make more informed spending decisions.

### 📊 7. Dashboard

- Access shopping insights.
- View relevant platform information.
- Monitor shopping-related activity.

### 📖 8. Order Ledger

- Review order-related activity.
- Keep track of shopping transactions and records.

### 💳 9. PayPal Checkout Integration

KRYVON integrates the PayPal Developer Platform to provide a payment workflow within the shopping experience.

- PayPal Sandbox integration for development and testing.
- Server-side payment order creation.
- PayPal checkout approval workflow.
- Server-side payment capture.
- Payment confirmation after successful capture.
- Integration with the shopping cart and checkout process.

The PayPal integration allows customers to proceed from shopping to payment without leaving the application's overall checkout experience.

**Note:** The current implementation uses the PayPal Sandbox environment for testing. Sandbox transactions are simulated and do not represent real-money payments.

### ⚙️ 10. Agent Activity Timeline

- Displays shopping assistant activity.
- Helps users follow the shopping workflow.
- Provides visibility into assistant interactions.

### 📱 11. Responsive Interface

- Modern React-based interface.
- Responsive shopping experience.
- Interactive components and animations.
- Designed for convenient navigation.

---

## 🧠 AI + PayPal Integration

The central concept behind KRYVON is connecting intelligent shopping assistance with an actual commerce and payment workflow.

| Integration | Technology | Purpose |
|---|---|---|
| AI Shopping Assistant | Google Gemini API | Conversational shopping assistance and recommendations |
| Product Discovery | KRYVON Product Catalogue | Explore available products |
| Product Comparison | KRYVON Shopping Interface | Evaluate product options |
| Payment Order Creation | PayPal Developer Platform | Create checkout orders |
| Payment Approval | PayPal Sandbox | Approve test transactions |
| Payment Capture | PayPal Developer Platform | Capture approved payments |
| Confirmation | KRYVON Application | Display successful payment confirmation |

### Example Shopping Journey

1. A customer opens KRYVON.
2. The customer interacts with the Gemini-powered AI shopping assistant.
3. The assistant helps identify suitable products based on the customer's requirements.
4. The customer explores and compares products.
5. Selected products are added to the shopping cart.
6. The customer proceeds to PayPal checkout.
7. The customer approves the transaction using a PayPal Sandbox test account.
8. The application processes the payment capture through its backend.
9. A successful payment confirmation is displayed.

This connects AI-assisted product discovery with a working payment workflow.

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| Frontend | React 19 |
| Programming Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS and CSS |
| Backend | Node.js and Express.js |
| AI Integration | Google Gemini API |
| Payment Integration | PayPal Developer Platform |
| Payment Environment | PayPal Sandbox |
| Animations | Motion |
| Icons | Lucide React |
| Environment Configuration | dotenv |
| Version Control | Git and GitHub |
| Deployment | Render |

## 🏗️ Project Architecture

KRYVON follows a component-based application architecture.

Its major layers include:

1. **Frontend Interface:** React-based shopping interface, navigation and interactive components.
2. **Product Discovery:** Product catalogue, browsing and product information.
3. **AI Shopping Layer:** Gemini-powered conversational shopping assistance.
4. **Shopping Management:** Cart, wishlist and budget-related features.
5. **Dashboard and Activity:** Shopping insights, order records and activity tracking.
6. **Payment Layer:** PayPal order creation, approval and payment capture.
7. **Backend Services:** Express server, API endpoints and server-side integrations.

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

*The structure highlights the primary application directories and components. Additional files and components may be present in the repository.*

---

## 💻 Getting Started

### Prerequisites

Install the following tools:

- Node.js (LTS recommended)
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

Create a `.env` file in the root directory using `.env.example` as a reference.

Configure the following variables:

```env
GEMINI_API_KEY=your_gemini_api_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PORT=3000
```

**Important:**

- Obtain your Gemini API key from Google AI Studio.
- Obtain PayPal Sandbox credentials from the PayPal Developer Dashboard.
- Replace placeholder values with your own credentials.
- Never commit your actual `.env` file.
- Never expose API keys or PayPal client secrets in frontend code or public repositories.

### 5. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal.

### 6. Create a Production Build

```bash
npm run build
```

### 7. Run TypeScript Checks

```bash
npm run lint
```

### 8. Start the Application

```bash
npm start
```

---

## 🧪 Testing Instructions

KRYVON supports testing of its AI shopping and PayPal Sandbox workflows.

### AI Testing

1. Open the application.
2. Navigate to the AI shopping assistant.
3. Enter a shopping-related question.
4. Test conversational assistance and product discovery.
5. Verify that the assistant returns a response.

### Shopping Cart Testing

1. Browse the product catalogue.
2. Add multiple products.
3. Change product quantities.
4. Remove products.
5. Verify that the cart count and totals update correctly.

### PayPal Sandbox Testing

1. Configure valid PayPal Sandbox credentials.
2. Open the shopping cart.
3. Proceed to checkout.
4. Approve the payment using an appropriate PayPal Sandbox buyer account.
5. Verify successful payment capture and the application's confirmation message.

**Testing note:** Use PayPal Sandbox buyer and merchant accounts, not real payment credentials or real-money transactions.

Judges can use the hosted application or clone the public repository and configure their own API credentials to run the application.

---

## 🌐 Deployment

KRYVON is deployed as a Node.js Web Service using **Render**.

**Live Application:** https://kryvon.onrender.com

The production application uses:

- Express.js backend.
- React production build generated using Vite.
- Google Gemini API integration.
- PayPal Sandbox integration.
- Environment variables configured through Render's secure environment settings.

The application is connected to the GitHub repository and uses automatic deployment from the `main` branch.

**Hosting note:** The Render free instance may spin down after inactivity, resulting in a delay when the application receives its first request after becoming idle.

---

## 🔐 Security

- API credentials are stored in environment variables.
- The `.env` file is excluded from version control.
- PayPal client secrets remain on the backend.
- Payment order creation and capture are handled through server-side endpoints.
- Production credentials are configured through the hosting provider's secure environment settings.
- Sandbox credentials are used for payment testing.

---

## 📈 Development and Hackathon Updates

KRYVON has undergone significant development and enhancement to evolve into a more complete AI-powered commerce platform.

The development work includes:

- Integration of Google Gemini-powered shopping assistance.
- Implementation of PayPal Sandbox checkout.
- Development of payment order creation and capture workflows.
- Enhancement of product discovery and shopping interactions.
- Implementation of a multi-product shopping cart.
- Addition of wishlist and budget management functionality.
- Development of dashboard and order activity features.
- Improvements to the user interface, responsiveness and navigation.
- Deployment of the updated application using Render.

The GitHub commit history documents the project's development and implementation changes.

---

## 📌 Project Information

| Detail | Information |
|---|---|
| Project Name | KRYVON |
| Category | AI / ML and Autonomous Commerce |
| Developer | Kavya Gupta |
| Development | Solo Developer |
| AI Platform | Google Gemini |
| Payment Platform | PayPal Developer Platform |
| Payment Environment | PayPal Sandbox |
| Deployment Platform | Render |
| GitHub | [kavya111-op](https://github.com/kavya111-op) |
| Repository | [KRYVON](https://github.com/kavya111-op/KRYVON) |
| Live Application | [kryvon.onrender.com](https://kryvon.onrender.com) |

## 📜 License

This project is licensed under the **Apache License 2.0**.

See the [LICENSE](LICENSE) file for details.

---

**KRYVON — Discover Smarter. Decide Faster. Shop Better.**

*Bringing AI-powered shopping assistance and integrated payments together.*

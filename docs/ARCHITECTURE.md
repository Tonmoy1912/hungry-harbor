# 🏗️ Hungry Harbor — Architecture Document

> **Version**: 1.0  
> **Last Updated**: June 28, 2026  
> **Project**: Hungry Harbor — Online Food Ordering Platform

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [High-Level System Architecture](#3-high-level-system-architecture)
4. [Directory Structure](#4-directory-structure)
5. [Application Layer Architecture](#5-application-layer-architecture)
6. [Route Groups & Page Hierarchy](#6-route-groups--page-hierarchy)
7. [API Layer Architecture](#7-api-layer-architecture)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [Database Architecture](#9-database-architecture)
10. [Payment Processing & Concurrency Pipeline](#10-payment-processing--concurrency-pipeline)
11. [Real-Time Communication (WebSocket)](#11-real-time-communication-websocket)
12. [State Management](#12-state-management)
13. [File Storage Architecture](#13-file-storage-architecture)
14. [Component Architecture](#14-component-architecture)
15. [Deployment Architecture](#15-deployment-architecture)
16. [Data Flow Diagrams](#16-data-flow-diagrams)

---

## 1. Project Overview

**Hungry Harbor** is a full-stack online food ordering web application that enables customers to browse a menu, add items to a cart/wishlist, place orders with online payment, track their orders in real-time, and leave reviews. It also features a dedicated **Admin Control Panel** for shop owners to manage items, categories, orders, admins, and view business analytics.

### Core Features

| Feature | Description |
|---|---|
| **User Authentication** | Credentials-based and Google OAuth sign-in via NextAuth.js |
| **Menu Browsing** | Browse food items by categories with search, filtering, and sorting |
| **Cart & Wishlist** | Add/remove items, stock validation before checkout |
| **Online Payment & Concurrency** | Razorpay payment gateway with upfront atomic stock reservation, commit-before-network-call, webhook capture, late-payment race arbitration, and automated refunds |
| **Stock Recovery (Cron)** | Automated background compensation cron (`/api/cron/restore-reserved-stocks`) that safely restores expired (10m TTL) or failed stock holds |
| **Order Tracking** | Real-time order status updates via WebSocket (pending → accepted → ready → delivered) |
| **Reviews & Ratings** | Users can submit, update, and delete reviews with star ratings |
| **Notifications** | Real-time push notifications for order updates, delivered via Socket.io |
| **Admin Control Panel** | Dashboard with sales charts, order management, item CRUD, category management, admin management |
| **Shop Open/Close** | Owner can toggle shop availability; orders are blocked when the shop is closed |
| **Forgot Password** | OTP-based password reset flow via email (currently disabled for security) |

---

## 2. Technology Stack

```mermaid
graph LR
    subgraph Frontend
        A[Next.js 14 - React 18]
        B[Tailwind CSS 3]
        C[Framer Motion]
        D[React Icons]
        E[Typewriter Effect]
        F[Chart.js / react-chartjs-2]
        G[React Toastify]
        H[React Virtualized]
    end

    subgraph State Management
        I[Recoil]
        J[TanStack React Query v5]
    end

    subgraph Backend
        K[Next.js API Routes]
        L[NextAuth.js v4]
        M[Mongoose - MongoDB ODM]
        N[Razorpay SDK]
        O[Nodemailer]
        P[JSON Web Tokens]
        Q[bcrypt]
        R[Zod Validation]
    end

    subgraph External Services
        S[MongoDB Atlas]
        T[Razorpay Payment Gateway]
        U[Azure Blob Storage]
        V[Firebase Storage - Legacy]
        W[Google OAuth 2.0]
        X[Socket.io Server - External]
        Y[Gmail SMTP]
    end

    A --> I
    A --> J
    K --> M
    K --> N
    K --> L
    M --> S
    N --> T
```

### Dependency Summary

| Category | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js | 14.1.0 | Full-stack React framework (App Router) |
| **UI** | React | 18.x | Component-based UI |
| **Styling** | Tailwind CSS | 3.3.x | Utility-first CSS |
| **Animation** | Framer Motion | 11.x | Page/component animations |
| **State** | Recoil | 0.7.7 | Client-side global state |
| **Data Fetching** | TanStack React Query | 5.18.x | Server state caching & synchronization |
| **Auth** | NextAuth.js | 4.24.x | Authentication (Credentials + Google) |
| **Database** | Mongoose | 8.1.x | MongoDB ODM |
| **Payment** | Razorpay | 2.9.x | Payment gateway integration |
| **Validation** | Zod | 3.22.x | Runtime schema validation |
| **Real-time** | Socket.io-client | 4.7.x | WebSocket client |
| **Charts** | Chart.js | 4.4.x | Analytics charts |
| **Storage** | @azure/storage-blob | 12.33.x | Image uploads to Azure |
| **Email** | Nodemailer | 6.9.x | Transactional emails |

---

## 3. High-Level System Architecture

```mermaid
graph TB
    subgraph Client ["🖥️ Client Browser"]
        UI["Next.js Frontend<br/>(React + Recoil + React Query)"]
        SC["Socket.io Client"]
    end

    subgraph NextServer ["⚙️ Next.js Server (Node.js)"]
        SSR["Server-Side Rendering<br/>(App Router)"]
        API["API Route Handlers<br/>(/api/*)"]
        AUTH["NextAuth.js<br/>(Session Management)"]
        MW["Middleware<br/>(Payment Routes)"]
    end

    subgraph ExternalServices ["☁️ External Services"]
        MONGO[(MongoDB Atlas)]
        RAZORPAY["Razorpay<br/>Payment Gateway"]
        AZURE["Azure Blob<br/>Storage"]
        FIREBASE["Firebase Storage<br/>(Legacy)"]
        GOOGLE["Google OAuth 2.0"]
        SMTP["Gmail SMTP"]
    end

    subgraph SocketServer ["🔌 Socket.io Server (Separate)"]
        SS["Socket.io Server<br/>(External Process)"]
    end

    UI -->|HTTP / Fetch| API
    UI -->|Page Request| SSR
    SC <-->|WebSocket| SS
    API -->|Mongoose| MONGO
    API -->|SDK| RAZORPAY
    API -->|SDK| AZURE
    API -->|SDK| FIREBASE
    AUTH -->|OAuth| GOOGLE
    API -->|SMTP| SMTP
    API -->|HTTP POST| SS
    RAZORPAY -->|Webhook| API
    SSR -->|Session Check| AUTH

    style Client fill:#1e293b,color:#fff
    style NextServer fill:#0f172a,color:#fff
    style ExternalServices fill:#172554,color:#fff
    style SocketServer fill:#1e1b4b,color:#fff
```

### Key Architectural Decisions

1. **Monolithic Full-Stack**: The application uses Next.js as both the frontend and backend, eliminating the need for a separate API server.
2. **Separate Socket Server**: Real-time communication is handled by an **external Socket.io server** process, communicated with via HTTP POST from the Next.js API routes and WebSocket from the client.
3. **Webhook-Driven Payments**: Razorpay payment confirmations arrive via webhook (`POST /api/payment/payment-capture`), decoupling payment processing from the user's session.
4. **In-Order Inventory Hold & Concurrency Control**: Ordering uses atomic conditional decrements (`$inc` with `{ in_stock: { $gte: qty } }`) inside MongoDB multi-document transactions. To avoid connection starvation during gateway latency, it uses a **Commit-Before-Network-Call** pattern, webhook idempotency to prevent duplicate capture, programmatic refunds for late payments on expired holds, and an automated background cron (`/api/cron/restore-reserved-stocks`) for self-healing inventory recovery (see [`CONCURRENCY_HANDLING.md`](file:///Users/tonmoybiswas/Drive%20D/Web%20Development/Hungry%20Harbor/hungry-harbor/CONCURRENCY_HANDLING.md)).

---

## 4. Directory Structure

```
hungry-harbor/
├── .dockerignore
├── .env.example               # Environment variable template
├── .env.local                 # Local environment variables (gitignored)
├── .gitignore
├── Dockerfile                 # Docker containerization config
├── ER_DIAGRAM.md              # Database ER diagram documentation
├── README.md
├── jsconfig.json              # Path alias config (@/ → src/)
├── next.config.mjs            # Next.js configuration
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── public/
│   ├── images/                # Static image assets
│   ├── next.svg
│   └── vercel.svg
└── src/
    ├── middleware.js           # Next.js edge middleware
    ├── app/                   # Next.js App Router (pages + API)
    │   ├── layout.js          # Root layout (providers)
    │   ├── error.js           # Global error boundary
    │   ├── globals.css        # Global styles
    │   ├── favicon.ico
    │   ├── (auth-page)/       # Auth route group
    │   ├── (web-page)/        # Customer-facing route group
    │   ├── (owner-page)/      # Admin control panel route group
    │   └── api/               # API route handlers
    ├── components/            # Reusable UI components (20 directories)
    ├── config/                # Service configurations
    ├── models/                # Mongoose schemas (11 collections)
    ├── store/                 # Recoil atoms & selectors
    └── util/                  # Server-side utility functions
```

---

## 5. Application Layer Architecture

```mermaid
graph TB
    subgraph RootLayout ["Root Layout (layout.js)"]
        direction TB
        SP["SessionProvider<br/>(NextAuth Session)"]
        RS["RecoilState<br/>(Recoil Root)"]
        QP["QueryProvider<br/>(React Query)"]
        NOTI["Notification Component"]
        PB["ProgressBar Component"]
        SOCK["SocketComponent<br/>(WebSocket Client)"]
        TP["ToastProvider<br/>(React Toastify)"]
    end

    SP --> RS --> QP
    QP --> NOTI
    QP --> PB
    QP --> SOCK

    style RootLayout fill:#0f172a,color:#fff
```

### Provider Hierarchy (Root Layout)

The root `layout.js` wraps the entire application in a carefully ordered provider hierarchy:

```
<html>
  <body>
    <SessionProvider>          ← NextAuth session context
      <RecoilState>            ← Recoil state management root
        <QueryProvider>        ← TanStack React Query client
          {children}           ← Page content
          <Notification />     ← In-app notification overlay
          <ProgressBar />      ← Global loading progress bar
          <SocketComponent />  ← WebSocket connection manager
        </QueryProvider>
      </RecoilState>
    </SessionProvider>
    <ToastProvider />          ← Toast notification container
  </body>
</html>
```

---

## 6. Route Groups & Page Hierarchy

Next.js App Router **route groups** (parenthesized folders) are used to organize pages without affecting URL structure. The project has three major route groups:

```mermaid
graph TB
    ROOT["/"] --> AUTH_GROUP["(auth-page)<br/>Public Auth Pages"]
    ROOT --> WEB_GROUP["(web-page)<br/>Customer Pages"]
    ROOT --> OWNER_GROUP["(owner-page)<br/>Admin Pages"]
    ROOT --> API_GROUP["api/<br/>API Routes"]

    AUTH_GROUP --> LOGIN["/login"]
    AUTH_GROUP --> SIGNUP["/signup"]
    AUTH_GROUP --> FORGOT["/forgot-password"]

    WEB_GROUP --> HOME["/ (Home Page)"]
    WEB_GROUP --> ITEMS_LIST["/items"]
    WEB_GROUP --> ITEM_DETAIL["/items/[id]"]
    WEB_GROUP --> PRIVACY["/privacy-policy"]
    WEB_GROUP --> TERMS["/terms-and-conditions"]
    WEB_GROUP --> REFUND_PAGE["/refund-and-cancellation"]

    WEB_GROUP --> AUTH_CHECK["(auth-check)<br/>Requires Login"]
    AUTH_CHECK --> CART["/cart"]
    AUTH_CHECK --> WISHLIST["/wishlist"]
    AUTH_CHECK --> ORDERS["/orders"]
    AUTH_CHECK --> ORDER_SUMMARY["/orders/order-summary"]
    AUTH_CHECK --> PROFILE["/profile"]
    AUTH_CHECK --> CHANGE_PASS["/profile/change-password"]
    AUTH_CHECK --> NOTIFICATIONS_PAGE["/notifications"]

    OWNER_GROUP --> CP["control-panel/<br/>Requires Admin"]
    CP --> DASHBOARD["/control-panel/dashboard"]
    CP --> CP_ITEMS["/control-panel/items"]
    CP --> REMOVED["/control-panel/items/removed-items"]
    CP --> CP_ORDERS["/control-panel/orders"]
    CP --> ADMINS["/control-panel/admins"]

    style ROOT fill:#1e293b,color:#fff
    style AUTH_GROUP fill:#7c3aed,color:#fff
    style WEB_GROUP fill:#059669,color:#fff
    style OWNER_GROUP fill:#dc2626,color:#fff
    style AUTH_CHECK fill:#0369a1,color:#fff
    style API_GROUP fill:#d97706,color:#fff
```

### Route Group Details

| Route Group | Layout | Auth Guard | Description |
|---|---|---|---|
| `(auth-page)` | Minimal layout | None (public) | Login, Signup, Forgot Password pages |
| `(web-page)` | `Navbar` layout (TopBar + LeftBar + Footer) | None for public pages | Customer-facing storefront |
| `(web-page)/(auth-check)` | Inherits `Navbar` | Server-side session check — redirects if not logged in | Cart, Orders, Wishlist, Profile, Notifications |
| `(owner-page)` | Admin check layout | Server-side `isAdmin` check — blocks non-admins | Admin control panel |
| `(owner-page)/control-panel` | `ControlPanelNavbar` layout | Inherited from parent | Dashboard, Items, Orders, Admins management |

---

## 7. API Layer Architecture

The API layer is built using **Next.js Route Handlers** (`route.js` files inside `src/app/api/`). Each endpoint exports named HTTP method handlers (`GET`, `POST`, etc.).

```mermaid
graph LR
    subgraph API_Routes ["API Routes (/api)"]
        direction TB
        
        subgraph Auth ["/api/auth"]
            A1["[...nextauth] - NextAuth"]
            A2["signup"]
            A3["user-info"]
            A4["update-userinfo"]
            A5["change-password"]
            A6["socket-connection-token"]
        end
        
        subgraph Items ["/api/items"]
            I1["get-items"]
            I2["add-item"]
            I3["update-item"]
            I4["remove-item"]
            I5["restore-item"]
            I6["get-removed-items"]
            I7["upload-image"]
            I8["remove-image"]
            I9["update-item/set-out-of-stock"]
            I10["update-item/add-in-stock"]
        end
        
        subgraph Orders ["/api/order"]
            O1["get-all-active-order"]
            O2["get-all-prev-order"]
            O3["get-order-by-id"]
            O4["get-user-active-order"]
            O5["get-user-prev-order"]
            O6["set/accept-order"]
            O7["set/delivered"]
            O8["set/ready"]
            O9["set/user-cancel-order"]
        end
        
        subgraph Payment ["/api/payment"]
            P1["create-order"]
            P2["payment-capture<br/>(Razorpay Webhook)"]
            P3["payment-failed"]
            P4["refund-processed"]
        end

        subgraph Cron ["/api/cron"]
            CR1["restore-reserved-stocks<br/>(Stock Recovery Cron)"]
        end
        
        subgraph Others ["Other Routes"]
            C1["/api/category/*"]
            C2["/api/cart/*"]
            C3["/api/wishlist/*"]
            C4["/api/review/*"]
            C5["/api/notification/*"]
            C6["/api/statistics/*"]
            C7["/api/admin/*"]
            C8["/api/forgot-password/*"]
            C9["/api/apikeys/*"]
        end
    end

    style Auth fill:#7c3aed,color:#fff
    style Items fill:#059669,color:#fff
    style Orders fill:#0369a1,color:#fff
    style Payment fill:#dc2626,color:#fff
    style Cron fill:#0284c7,color:#fff
    style Others fill:#d97706,color:#fff
```

### Complete API Endpoint Inventory

| Domain | Endpoint | Method | Auth | Description |
|---|---|---|---|---|
| **Auth** | `/api/auth/[...nextauth]` | GET/POST | — | NextAuth.js handler (Google + Credentials) |
| | `/api/auth/signup` | POST | — | User registration |
| | `/api/auth/user-info` | GET | User | Fetch logged-in user profile |
| | `/api/auth/update-userinfo` | POST | User | Update name, phone, address, avatar |
| | `/api/auth/change-password` | POST | User | Change password |
| | `/api/auth/socket-connection-token` | GET | User | Generate JWT for socket auth |
| **Items** | `/api/items/get-items` | GET | — | Fetch all active menu items |
| | `/api/items/add-item` | POST | Admin | Add new menu item |
| | `/api/items/update-item` | POST | Admin | Update item details |
| | `/api/items/update-item/set-out-of-stock` | POST | Admin | Set item out of stock |
| | `/api/items/update-item/add-in-stock` | POST | Admin | Add stock to item |
| | `/api/items/remove-item` | POST | Admin | Soft-delete item |
| | `/api/items/restore-item` | POST | Admin | Restore soft-deleted item |
| | `/api/items/get-removed-items` | GET | Admin | Fetch soft-deleted items |
| | `/api/items/upload-image` | POST | Admin | Upload image to Azure Blob |
| | `/api/items/remove-image` | POST | Admin | Delete image from Azure Blob |
| **Category** | `/api/category/get-all-categories` | GET | — | List all categories with item counts |
| | `/api/category/add-category` | POST | Admin | Create new category |
| | `/api/category/remove-category` | POST | Admin | Delete category |
| **Cart** | `/api/cart/get-cart-items` | GET | User | Fetch user's cart |
| | `/api/cart/add-to-cart` | POST | User | Add item to cart |
| | `/api/cart/remove-from-cart` | POST | User | Remove item from cart |
| | `/api/cart/validate-stock` | POST | User | Check stock availability |
| **Wishlist** | `/api/wishlist/get-wishlist-items` | GET | User | Fetch user's wishlist |
| | `/api/wishlist/add-to-wishlist` | POST | User | Add item to wishlist |
| | `/api/wishlist/remove-from-wishlist` | POST | User | Remove item from wishlist |
| **Order** | `/api/order/get-user-active-order` | GET | User | Fetch user's active orders |
| | `/api/order/get-user-prev-order` | GET | User | Fetch user's order history |
| | `/api/order/get-all-active-order` | GET | Admin | Fetch all active orders |
| | `/api/order/get-all-prev-order` | GET | Admin | Fetch all past orders |
| | `/api/order/get-order-by-id` | POST | Admin | Fetch single order details |
| | `/api/order/set/accept-order` | POST | Admin | Accept a pending order |
| | `/api/order/set/delivered` | POST | Admin | Mark order as delivered |
| | `/api/order/set/ready` | POST | Admin | Mark order as ready |
| | `/api/order/set/user-cancel-order` | POST | User | Cancel an order |
| **Payment** | `/api/payment/create-order` | POST | User | Atomic inventory hold (`$inc: -qty`), initialize order (10m TTL), create Razorpay order |
| | `/api/payment/payment-capture` | POST | Webhook | Razorpay payment webhook (HMAC verification, idempotency gate, auto-refund on late arrival) |
| | `/api/payment/payment-failed` | POST | Webhook | Razorpay payment failure webhook |
| | `/api/payment/refund-processed` | POST | Webhook | Razorpay refund completion webhook |
| **Cron** | `/api/cron/restore-reserved-stocks` | GET/POST | Cron / Secret | Batch restore reserved stocks for expired/cancelled orders (self-healing recovery) |
| **Review** | `/api/review/get-all-review` | GET | — | Fetch all reviews for an item |
| | `/api/review/get-user-review` | GET | User | Fetch user's review for an item |
| | `/api/review/submit-review` | POST | User | Submit a new review |
| | `/api/review/update-review` | POST | User | Update existing review |
| | `/api/review/remove-review` | POST | User | Delete a review |
| **Notification** | `/api/notification/get-notification` | GET | User | Fetch user's notifications |
| | `/api/notification/get-unread-noti-count` | GET | User | Get unread notification count |
| | `/api/notification/mark-read` | POST | User | Mark notification as read |
| **Statistics** | `/api/statistics/get-stats` | GET | Admin | Fetch sales analytics (last 2 months) |
| **Admin** | `/api/admin/get-admins` | GET | Admin | List all admins |
| | `/api/admin/add-admin` | POST | Admin | Add new admin |
| | `/api/admin/remove-admin` | POST | Admin | Remove admin |
| **Forgot Password** | `/api/forgot-password/get-otp` | POST | — | Send OTP email (currently disabled) |
| | `/api/forgot-password/verify-otp` | POST | — | Verify OTP |
| | `/api/forgot-password/reset-password` | POST | — | Reset password |

---

## 8. Authentication & Authorization

```mermaid
sequenceDiagram
    participant User
    participant NextApp as Next.js App
    participant NextAuth as NextAuth.js
    participant Google as Google OAuth
    participant MongoDB

    Note over User, MongoDB: Credentials Login Flow
    User->>NextApp: POST /api/auth/signin (email, password)
    NextApp->>NextAuth: authorize()
    NextAuth->>MongoDB: Users.findOne({ email })
    MongoDB-->>NextAuth: User document
    NextAuth->>NextAuth: bcrypt.compare(password, hash)
    NextAuth-->>User: JWT Session Cookie

    Note over User, MongoDB: Google OAuth Flow
    User->>NextApp: Click "Sign in with Google"
    NextApp->>Google: OAuth redirect
    Google-->>NextApp: User profile
    NextApp->>NextAuth: jwt callback
    NextAuth->>MongoDB: Users.findOne({ email })
    alt User doesn't exist
        NextAuth->>MongoDB: Create new User (random password)
    end
    NextAuth->>MongoDB: Owners.findOne({ email })
    alt Is Admin
        NextAuth->>NextAuth: token.isAdmin = true
    end
    NextAuth-->>User: JWT Session Cookie
```

### Auth Architecture Details

- **Providers**: Google OAuth 2.0 + Credentials (email/password)
- **Strategy**: JWT-based sessions (stateless)
- **Password Hashing**: bcrypt with 10 salt rounds
- **Input Validation**: Zod schema validation on login
- **Admin Detection**: On every JWT callback, the system checks the `Owners` collection to set `token.isAdmin`
- **Google Auto-Registration**: First-time Google users are automatically created in the `Users` collection with a random password

### Authorization Layers

```mermaid
graph TB
    REQ["Incoming Request"] --> MW["Next.js Middleware<br/>(matcher: /api/payment/*)"]
    MW --> API["API Route Handler"]
    API --> SESSION_CHECK{"getServerSession()"}
    SESSION_CHECK -->|No Session| REJECT_401["401 Unauthorized"]
    SESSION_CHECK -->|Has Session| ADMIN_CHECK{"session.user.isAdmin?"}
    ADMIN_CHECK -->|Admin Route + Not Admin| REJECT_403["403 Forbidden"]
    ADMIN_CHECK -->|Authorized| HANDLER["Execute Business Logic"]

    style REQ fill:#1e293b,color:#fff
    style REJECT_401 fill:#dc2626,color:#fff
    style REJECT_403 fill:#dc2626,color:#fff
    style HANDLER fill:#059669,color:#fff
```

| Layer | Mechanism | Scope |
|---|---|---|
| **Middleware** | `src/middleware.js` (currently empty body) | `/api/payment/*` routes |
| **Server Layout Guards** | `getServerSession()` in layout.js | `(auth-check)` and `(owner-page)` route groups |
| **API Route Guards** | `getServerSession(authOptions)` in route handlers | Individual API endpoints |

---

## 9. Database Architecture

The application uses **MongoDB** as its primary database, accessed via **Mongoose ODM**. There are **11 collections**.

```mermaid
erDiagram
    USERS {
        ObjectId _id PK
        String name
        String email UK
        String password
        String phone
        String address
        Date date
        Number total_order
        String avatar
    }

    OWNERS {
        ObjectId _id PK
        ObjectId user FK
        String email
    }

    ITEMS {
        ObjectId _id PK
        String name
        String image
        String description
        Number price
        String category
        Date date
        Boolean removed
        Number category_order
        Number global_order
        Number in_stock
        Number total_review
        Number rating
    }

    CATEGORIES {
        ObjectId _id PK
        String category
        Number total
    }

    ORDERS {
        ObjectId _id PK
        String orderId
        String paymentId
        String refundId
        Date date
        Number total_amount
        Boolean paid
        Boolean payment_failed
        Boolean refunded
        ObjectId user FK
        String cooking_instruction
        String cooking_inst_status
        String status
        String active
        Date expiresAt
        Boolean required_restoration
        String ready_by
    }

    CARTS {
        ObjectId _id PK
        ObjectId user FK
    }

    WISH_LISTS {
        ObjectId _id PK
        ObjectId user FK
    }

    REVIEWS {
        ObjectId _id PK
        ObjectId user FK
        ObjectId item FK
        String review
        Number rating
        Date date
    }

    NOTIFICATIONS {
        ObjectId _id PK
        ObjectId user FK
        String message
        Date date
        Boolean is_read
        Boolean for_owner
    }

    STATS {
        ObjectId _id PK
        Number sells
        Number orders_placed
        Number orders_cancelled
        Date date
    }

    OPENINGTIMES {
        ObjectId _id PK
        Date date
    }

    USERS ||--o{ ORDERS : "places"
    USERS ||--o| CARTS : "has"
    USERS ||--o| WISH_LISTS : "has"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o| OWNERS : "may be"
    ITEMS ||--o{ REVIEWS : "receives"
    ITEMS }o--o{ ORDERS : "included in"
    ITEMS }o--o{ CARTS : "added to"
    ITEMS }o--o{ WISH_LISTS : "saved in"
```

### Database Connection Pattern

The `mongoConnect()` utility in `src/config/moongose.js` implements a **singleton connection pattern**:
- Checks `mongoose.connection.readyState` before connecting
- Reuses existing connections across API route invocations
- Prevents connection pool exhaustion in serverless environments

### Order Status State Machine

```mermaid
stateDiagram-v2
    [*] --> initialized : /api/payment/create-order\n(Stock reserved via $inc: -qty,\nexpiresAt set to now + 10m,\nrequired_restoration: true)

    initialized --> active : /api/payment/payment-capture\n(Payment successful within 10m,\nexpiresAt cleared,\npaid: true)

    initialized --> failed : Gateway initialization error\n(required_restoration: true)

    initialized --> expired : /api/cron/restore-reserved-stocks\n(expiresAt <= now,\nStock returned via $inc: +qty,\nrequired_restoration: false)

    failed --> expired : /api/cron/restore-reserved-stocks\n(Stock returned via $inc: +qty,\nrequired_restoration: false)

    expired --> expired : Late webhook arrives\n(Auto-refund issued via Razorpay,\norder.paid = true)

    state active {
        pending --> accepted : Admin Accepts
        pending --> cancelled : User Cancels / Admin Rejects
        accepted --> ready : Admin Marks Ready
        ready --> delivered : Admin Marks Delivered
    }

    active --> settled : Order Delivered / Order Cancelled
    expired --> [*]
    settled --> [*]
```

The `Orders` collection tracks multi-dimensional state with concurrency & recovery safeguards:
1. **`active`** field: Lifecycle stage (`initialized` → `active` → `settled` | `failed` | `expired`)
2. **`status`** field: Order workflow state (`pending` → `accepted` → `ready` → `delivered` or `cancelled`)
3. **`expiresAt`**: 10-minute reservation TTL timestamp used to arbitrate late payments and cron sweeps
4. **`required_restoration`**: Idempotency guard guaranteeing inventory is restored at most once
5. **Compound Indexes**: Optimizes high-throughput cron scanning:
   - `{ required_restoration: 1, active: 1, expiresAt: 1 }`
   - `{ required_restoration: 1, status: 1 }`
   - `{ active: 1, expiresAt: 1 }`

---

## 10. Payment Processing & Concurrency Pipeline

> 📖 **Full Specification**: For detailed code implementations, transaction boundary breakdowns, and race condition mitigations, see [`CONCURRENCY_HANDLING.md`](file:///Users/tonmoybiswas/Drive%20D/Web%20Development/Hungry%20Harbor/hungry-harbor/CONCURRENCY_HANDLING.md).

Hungry Harbor implements an **In-Order Inventory Hold Strategy** paired with **ACID Database Transactions**, **Atomic Conditional Writes**, **Commit-Before-Network Calls**, **Webhook Idempotency Gates**, and an **Eventual Consistency Compensation Cron**.

### End-to-End Concurrency & Payment Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User as Customer
    participant OrderAPI as /api/payment/create-order
    participant DB as MongoDB (Replica Set)
    participant Gateway as Razorpay API
    participant CaptureAPI as /api/payment/payment-capture
    participant Cron as /api/cron/restore-reserved-stocks
    participant Sockets as WebSocket / itemUpdateSync

    %% 1. Order Creation & Stock Reservation
    User->>OrderAPI: POST /api/payment/create-order (items, cooking_instruction)
    Note over OrderAPI,DB: Multi-document Transaction Started
    OrderAPI->>DB: Atomically check & decrement stock ($inc: -qty WHERE in_stock >= qty)
    alt Any Item Insufficient Stock
        OrderAPI->>DB: Abort Transaction
        OrderAPI-->>User: 400 Bad Request ("Only X left in stock")
    else All Items Available
        OrderAPI->>DB: Create Order (active: "initialized", required_restoration: true, expiresAt: now + 10m)
        OrderAPI->>DB: Commit Transaction
        OrderAPI->>Sockets: itemUpdateSync() (Broadcast remaining stock)
    end

    %% 2. Gateway Order Creation
    OrderAPI->>Gateway: razorpay.orders.create({ amount, receipt: order._id })
    alt Gateway Network Failure
        OrderAPI->>DB: Set active: "failed", status: "cancelled", required_restoration: true
        OrderAPI-->>User: 502 Bad Gateway
    else Gateway Success
        OrderAPI->>DB: Update order with orderId = razorpayOrder.id
        OrderAPI-->>User: 200 OK (Razorpay order payload, key, expiresAt)
    end

    %% 3. Payment Flow & Capture
    User->>Gateway: Submits Payment on Razorpay Modal
    Gateway->>CaptureAPI: POST Webhook (payment.captured)
    Note over CaptureAPI: Verify HMAC-SHA256 Signature
    alt Order is Paid (Idempotent replay)
        CaptureAPI-->>Gateway: 200 OK (already_processed)
    else Order is Expired (Late payment race condition)
        CaptureAPI->>Gateway: payments.refund(payment_id, amount)
        CaptureAPI->>DB: Mark paid: true, record paymentId
        CaptureAPI-->>Gateway: 200 OK (refunded_due_to_expiry)
    else Normal Success (Within 10 min window)
        CaptureAPI->>DB: Mark active: "active", paid: true, expiresAt: null
        CaptureAPI->>Sockets: itemUpdateSync() & sendEventToSocketServer
        CaptureAPI-->>Gateway: 200 OK
    end

    %% 4. Cron Recovery (For Abandoned Orders)
    loop Periodic Cron Run (e.g., every minute)
        Cron->>DB: Find orders WHERE required_restoration: true AND (expiresAt <= now OR cancelled OR failed)
        loop For Each Expired/Failed Order
            Note over Cron,DB: Transaction per Order
            Cron->>DB: Atomically increment stock ($inc: +qty)
            Cron->>DB: Set active: "expired", status: "cancelled", required_restoration: false
            Cron->>DB: Commit Transaction
        end
        Cron->>Sockets: itemUpdateSync() (Broadcast restored stock)
    end
```

### Core Concurrency Mechanisms

#### 1. Order Initialization & Atomic Reservation (`/api/payment/create-order`)
- **Atomic Conditional Decrement**: Stock is held upfront using `Items.findOneAndUpdate({ _id: itemId, in_stock: { $gte: requestedQty }, removed: { $ne: true } }, { $inc: { in_stock: -requestedQty } }, { session, new: true })`. This completely prevents **Time-of-Check to Time-of-Use (TOCTOU)** race conditions and overselling.
- **Cart-Level All-or-Nothing Guarantee**: If any item has insufficient stock, the multi-document transaction is aborted, immediately rolling back any previously decremented items in the cart.
- **Commit-Before-Network-Call Pattern**: The database transaction is committed and session closed **prior** to calling external payment gateway APIs (`razorpay.orders.create`). This prevents connection pool exhaustion and database lock starvation during third-party network latency.
- **Post-Commit Failure Recovery**: If the gateway network request fails, the order is flagged with `active: "failed"`, `status: "cancelled"`, and `required_restoration: true`, allowing the background compensation engine to safely release the held inventory.

#### 2. Webhook Verification, Idempotency & Late-Payment Arbitration (`/api/payment/payment-capture`)
- **HMAC-SHA256 Signature Verification**: Every webhook payload is verified cryptographically using `createHmac('sha256', secret)` before database access.
- **Idempotency Gate**: Replayed or duplicate webhooks check `if (orderData.paid)` and immediately return `200 OK (already_processed)` to avoid duplicate processing.
- **Late-Payment Arbitration & Auto-Refund**: If a user pays after the 10-minute hold expired (`orderData.active === "expired"` or `expiresAt <= now`), the server refuses order fulfillment and immediately triggers a programmatic refund via Razorpay (`instance.payments.refund`). This prevents overselling when expired stock has already been purchased by another customer.
- **Fulfillment Without Secondary Stock Check**: Because stock was secured upfront in `create-order`, the capture route safely activates the order (`active: "active"`, `paid: true`, `expiresAt: null`) without risking out-of-stock failures at completion.

#### 3. Self-Healing Stock Restoration Cron (`/api/cron/restore-reserved-stocks`)
- **Scheduled Eventual Consistency**: Periodically queries orders with `required_restoration: true` that have expired (`expiresAt <= now`) or failed.
- **Isolated Per-Order Transactions**: Atomically increments stock (`$inc: { in_stock: qty }`), transitions the order to `active: "expired"`, `status: "cancelled"`, and clears `required_restoration: false`.
- **Live UI Broadcast**: Calls `itemUpdateSync()` after releasing stock to immediately notify connected clients via WebSockets and re-enable purchase controls.

### Concurrency Patterns Matrix

| Pattern / Mechanism | Where Applied | Problem Solved |
| :--- | :--- | :--- |
| **Atomic Conditional Write (`$inc` + `$gte`)** | `create-order` | Prevents overselling and negative inventory across simultaneous concurrent purchases. |
| **Multi-Document ACID Transactions** | `create-order`, `restore-reserved-stocks` | Guarantees all-or-nothing atomicity across multiple distinct items in a cart. |
| **Commit-Before-Network Call** | `create-order` | Eliminates long-held database locks and prevents connection starvation during external payment gateway latency. |
| **HMAC-SHA256 Webhook Verification** | `payment-capture` | Prevents unauthorized / spoofed payment confirmation requests. |
| **Idempotency Gate (`if (order.paid)`)** | `payment-capture` | Prevents duplicate order processing and multiple notifications on webhook retries. |
| **Compensating Refund on Late Arrival** | `payment-capture` | Resolves race condition between reservation expiration and late customer payment. |
| **Idempotent Flagging (`required_restoration`)** | `restore-reserved-stocks` | Ensures inventory cannot be double-incremented during periodic cron runs or server restarts. |
| **Real-Time Inventory Broadcast (`itemUpdateSync`)** | All 3 routes | Keeps client UIs synchronized with live stock levels to reduce failed checkout attempts. |

---

## 11. Real-Time Communication (WebSocket)

The application uses a **separate Socket.io server** (external process) for real-time communication. The Next.js server communicates with it via HTTP, and the client connects directly via WebSocket.

```mermaid
graph TB
    subgraph Client ["Client Browser"]
        SOCKET_COMP["SocketComponent<br/>(Socket.io Client)"]
    end

    subgraph NextServer ["Next.js Server"]
        API_ROUTES["API Route Handlers"]
        SEND_EVENT["sendEventToSocketServer()<br/>HTTP POST to SS_HOST"]
        SEND_NOTI["sendNotiToSocketServerAndSave()<br/>Save to DB + HTTP POST"]
    end

    subgraph SocketServer ["Socket.io Server (External)"]
        SS["Socket.io Server"]
    end

    SOCKET_COMP <-->|WebSocket| SS
    API_ROUTES --> SEND_EVENT --> SS
    API_ROUTES --> SEND_NOTI --> SS

    SS -->|"newOrder"| SOCKET_COMP
    SS -->|"acceptOrder"| SOCKET_COMP
    SS -->|"readyOrder"| SOCKET_COMP
    SS -->|"deliveredOrder"| SOCKET_COMP
    SS -->|"userCancelOrder"| SOCKET_COMP
    SS -->|"receivedNotification"| SOCKET_COMP
    SS -->|"itemsUpdate"| SOCKET_COMP

    style Client fill:#1e293b,color:#fff
    style NextServer fill:#0f172a,color:#fff
    style SocketServer fill:#1e1b4b,color:#fff
```

### Socket Events

| Event | Direction | Receiver | Purpose |
|---|---|---|---|
| `send-token` | Server → Client | User | Request auth token from client |
| `set-token` | Client → Server | Server | Authenticate WebSocket connection |
| `newOrder` | Server → Admin | Admin | New order notification |
| `acceptOrder` | Server → User | User | Order accepted/rejected update |
| `readyOrder` | Server → User | User | Order ready for pickup |
| `deliveredOrder` | Server → User | User | Order delivered confirmation |
| `userCancelOrder` | Server → Admin | Admin | User cancelled order |
| `receivedNotification` | Server → User/Admin | Both | Generic notification |
| `itemsUpdate` | Server → All | All | Menu item updated (triggers React Query invalidation) |

### Authentication Flow for Socket

1. Client connects to Socket.io server
2. Server emits `send-token`
3. Client fetches JWT from `/api/auth/socket-connection-token`
4. Client emits `set-token` with the JWT
5. Server verifies JWT and associates the socket with the user

---

## 12. State Management

The application uses a **dual state management** approach:

```mermaid
graph TB
    subgraph Recoil ["Recoil (Client State)"]
        direction TB
        SA["sessionAtom<br/>(User Session)"]
        NA["navAtom<br/>(Navigation State)"]
        CA["categoryAtom<br/>(Categories + Selected)"]
        IA["allItemsAtom<br/>(Menu Items)"]
        WA["wishListItemsAtom<br/>(Wishlist)"]
        CIA["cartItemsAtom<br/>(Cart)"]
        SEA["searchAtom<br/>(Search Query)"]
        OA["orderAtom<br/>(Active Orders)"]
        NOA["notiAtom<br/>(Notification Popup)"]
        NCA["notificationCountAtom<br/>(Unread Count)"]
        PA["progressAtom<br/>(Loading State)"]
    end

    subgraph Selectors ["Recoil Selectors (Derived State)"]
        FS["filteredItemsSelector<br/>Items filtered by category + search"]
        CS["cartSummarySelector<br/>Total items, price, out-of-stock count"]
    end

    subgraph ReactQuery ["TanStack React Query (Server State)"]
        RQ1["['all-items'] — Menu Items"]
        RQ2["['cartitems'] — Cart Items"]
    end

    CA --> FS
    IA --> FS
    SEA --> FS
    CIA --> CS

    style Recoil fill:#1e293b,color:#fff
    style Selectors fill:#0f172a,color:#fff
    style ReactQuery fill:#172554,color:#fff
```

### State Management Philosophy

| Concern | Tool | Rationale |
|---|---|---|
| **Global UI State** | Recoil atoms | Navigation toggle, progress bar, notifications, search query |
| **Domain Data** | Recoil atoms + selectors | Items, categories, cart, wishlist, orders — with derived filtering/sorting |
| **Server Data Caching** | React Query | Automatic cache invalidation, background refetching (especially `all-items` and `cartitems`) |
| **Session State** | NextAuth + Recoil | Session fetched server-side, synced to Recoil `sessionAtom` for client access |

### Key Selectors

1. **`filteredItemsSelector`**: Filters items by `selectedCategoryAtom` and `searchAtom`, then sorts by `global_order` or `category_order`
2. **`cartSummarySelector`**: Computes `total_item`, `total_price`, and `out_of_stock` count from `cartItemsAtom`
3. **`categoryAtom` default selector**: Fetches categories on initialization and prepends an "ALL" virtual category with total count

---

## 13. File Storage Architecture

```mermaid
graph LR
    subgraph Client
        UPLOAD["Image Upload<br/>(FormData)"]
        DELETE["Image Delete<br/>(URL)"]
    end

    subgraph NextAPI ["Next.js API"]
        UPLOAD_API["/api/items/upload-image"]
        DELETE_API["/api/items/remove-image"]
    end

    subgraph Azure ["Azure Blob Storage"]
        CONTAINER["Container:<br/>AZURE_STORAGE_CONTAINER_NAME"]
    end

    subgraph Firebase ["Firebase Storage (Legacy)"]
        FB_BUCKET["Firebase Storage Bucket"]
    end

    UPLOAD --> UPLOAD_API -->|"uploadImage()<br/>azure_blob_utils.js"| CONTAINER
    DELETE --> DELETE_API -->|"deleteBlob()<br/>azure_blob_utils.js"| CONTAINER

    style Client fill:#1e293b,color:#fff
    style NextAPI fill:#0f172a,color:#fff
    style Azure fill:#0369a1,color:#fff
    style Firebase fill:#d97706,color:#fff
```

### Storage Details

- **Primary**: Azure Blob Storage — used for item image uploads
  - Images are stored with UUID-based unique filenames (`{name}-{uuid}.{ext}`)
  - Content type is set automatically based on file extension
  - Default item image: `https://hungryharbor.blob.core.windows.net/public/no-image.jpg`
  - Default avatar: `https://hungryharbor.blob.core.windows.net/public/Profile.png`
- **Legacy**: Firebase Storage — configuration still present but being replaced by Azure. The Firebase config is fetched dynamically from `/api/apikeys/firebase` for client-side access
- **Client Helpers**: `src/util/image_helper.js` provides `uploadImageClient()` and `deleteImageClient()` wrappers

---

## 14. Component Architecture

```mermaid
graph TB
    subgraph Providers ["Global Providers"]
        SP["SessionProvider"]
        RS["RecoilState"]
        QP["QueryProvider"]
        TP["ToastProvider"]
    end

    subgraph Navigation ["Navigation"]
        NB["Navbar"]
        TB["TopBar"]
        LB["LeftBar"]
        CPNB["ControlPanelNavBar"]
        CPLB["ControlPanelLeftBar"]
        FT["Footer"]
    end

    subgraph ItemComponents ["Item Components"]
        UIP["UserItemPageComponent"]
        AIW["AdminItemWindow"]
        AI["AddItem"]
        UI_COMP["UpdateItem"]
        RIW["RemovedItemsWindow"]
        CC["CartComponent"]
        WLC["WishListComponents"]
    end

    subgraph OrderComponents ["Order Components"]
        UOC["UserOrderComponents"]
        AOC["AdminOrderComponents"]
    end

    subgraph Shared ["Shared / Utility"]
        NOTI["Notification"]
        PB["ProgressBar"]
        CB["ConfirmBox"]
        BTN["ButtonComponents"]
        RC["ReviewComponents"]
        CAT["CategoryComponent"]
        HPComp["HomePageComponent"]
        DC["DashboardComponents"]
        NPC["NotificationPageComponents"]
        SOC["ShopOpenCloseComponents"]
        SOCK["SocketComponent"]
        RVB["ReactVirtualizedBootstrap"]
    end

    NB --> TB
    NB --> LB
    NB --> FT
    CPNB --> CPLB

    style Providers fill:#7c3aed,color:#fff
    style Navigation fill:#059669,color:#fff
    style ItemComponents fill:#0369a1,color:#fff
    style OrderComponents fill:#dc2626,color:#fff
    style Shared fill:#d97706,color:#fff
```

### Component Categories

| Category | Components | Purpose |
|---|---|---|
| **Providers** | `SessionProvider`, `RecoilState`, `QueryProvider`, `ToastProvider` | Wrap app in necessary contexts |
| **Navigation** | `Navbar`, `TopBar`, `LeftBar`, `Footer`, `ControlPanelNavBar`, `ControlPanelLeftBar` | Navigation chrome for customer and admin views |
| **Item Management** | `UserItemPageComponent`, `AdminItemWindow`, `AddItem`, `UpdateItem`, `RemovedItemsWindow` | Menu item display and CRUD |
| **Cart & Wishlist** | `CartComponent`, `WishListComponents` | Shopping cart and favorites |
| **Orders** | `UserOrderComponents`, `AdminOrderComponents` | Order tracking and management |
| **Reviews** | `ReviewComponents` | Star ratings and text reviews |
| **Dashboard** | `DashboardComponents` | Sales and order charts (Chart.js) |
| **Notifications** | `Notification`, `NotificationPageComponents` | Real-time popup + notification history page |
| **Utility** | `ProgressBar`, `ConfirmBox`, `ButtonComponents`, `CategoryComponent`, `ShopOpenCloseComponents` | Reusable UI elements |
| **Real-time** | `SocketComponent` | WebSocket connection lifecycle |

---

## 15. Deployment Architecture

```mermaid
graph TB
    subgraph Docker ["Docker Container"]
        NODE["Node.js 20"]
        NEXT_BUILD["Next.js Production Build"]
        NEXT_START["npm run start<br/>(Port 3000)"]
    end

    subgraph Infra ["Infrastructure"]
        HOST["Cloud Host / VPS"]
        DOMAIN["Domain + HTTPS"]
    end

    subgraph Services ["External Services"]
        MONGO_ATLAS["MongoDB Atlas"]
        RAZORPAY_SVC["Razorpay"]
        AZURE_SVC["Azure Blob Storage"]
        GOOGLE_SVC["Google OAuth"]
        SS_SVC["Socket.io Server<br/>(Separate Deployment)"]
    end

    HOST --> Docker
    DOMAIN --> HOST
    Docker --> MONGO_ATLAS
    Docker --> RAZORPAY_SVC
    Docker --> AZURE_SVC
    Docker --> GOOGLE_SVC
    Docker --> SS_SVC

    style Docker fill:#0f172a,color:#fff
    style Infra fill:#1e293b,color:#fff
    style Services fill:#172554,color:#fff
```

### Dockerfile Breakdown

```dockerfile
FROM node:20           # Base image
WORKDIR /app
COPY package*.json .   # Install dependencies first (layer caching)
RUN npm install
COPY . .               # Copy source
EXPOSE 3000            # Next.js default port
RUN npm run build      # Build production bundle
CMD ["npm","run","start"]  # Start production server
```

### Environment Variables

| Variable | Purpose |
|---|---|
| `NEXTAUTH_URL` | NextAuth base URL |
| `NEXTAUTH_SECRET` | JWT signing secret |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `MONGO_URL` | MongoDB connection string |
| `RAZORPAY_KEY_ID` / `RAZORPAY_SECRET` | Razorpay API credentials |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signature verification |
| `AZURE_STORAGE_CONNECTION_STRING` | Azure Blob Storage access |
| `AZURE_STORAGE_CONTAINER_NAME` | Azure container name |
| `FORGOT_PASSWORD_KEY` | JWT secret for OTP tokens |
| `DEVELOPER` | Developer email (for owner notifications) |
| `PASS_CODE` | Socket server authentication |
| `SS_HOST` / `NEXT_PUBLIC_SS_HOST` | Socket.io server URL (server / client) |

---

## 16. Data Flow Diagrams

### User Ordering Flow (End-to-End)

```mermaid
sequenceDiagram
    actor User
    participant UI as Frontend
    participant API as Next.js API
    participant DB as MongoDB
    participant RP as Razorpay
    participant SS as Socket Server

    User->>UI: Browse items, add to cart
    UI->>API: POST /api/cart/add-to-cart
    API->>DB: Update Cart document
    
    User->>UI: Click "Place Order"
    UI->>API: POST /api/payment/create-order
    Note over API,DB: Multi-document Transaction
    API->>DB: Atomically reserve stock ($inc: -qty WHERE in_stock >= qty)
    API->>DB: Save Order (active: "initialized", required_restoration: true, expiresAt: now + 10m)
    API->>DB: Commit Transaction (Releases DB locks)
    API->>SS: Broadcast updated stock (itemUpdateSync)
    API->>RP: razorpay.orders.create({ amount, receipt })
    RP-->>API: Razorpay Order Object
    API->>DB: Update order with Razorpay orderId
    API-->>UI: Razorpay order details & key

    UI->>RP: Open checkout modal & complete payment
    RP->>API: Webhook: POST /api/payment/payment-capture
    API->>API: Verify HMAC-SHA256 signature & check idempotency (if order.paid)
    alt Captured within 10 min window
        API->>DB: Update Order (active: "active", paid: true, expiresAt: null)
        API->>SS: HTTP POST: new-order event & itemUpdateSync
        SS-->>UI: WebSocket: "newOrder"
    else Expired reservation (Late webhook arrival)
        API->>RP: Programmatic auto-refund (payments.refund)
        API->>DB: Mark paid: true, record paymentId
        API->>SS: WebSocket notification (Auto-refunded due to expiry)
    end

    Note over User, SS: Admin Processes Order
    SS-->>UI: WebSocket: "acceptOrder"
    SS-->>UI: WebSocket: "readyOrder"
    SS-->>UI: WebSocket: "deliveredOrder"
```

### Item Management Flow (Admin)

```mermaid
sequenceDiagram
    actor Admin
    participant UI as Admin Panel
    participant API as Next.js API
    participant Azure as Azure Blob
    participant DB as MongoDB
    participant SS as Socket Server

    Admin->>UI: Add new item (form + image)
    UI->>API: POST /api/items/upload-image
    API->>Azure: Upload image blob
    Azure-->>API: Image URL
    API-->>UI: Image URL

    UI->>API: POST /api/items/add-item
    API->>DB: Create Item document
    API->>DB: Update Category count
    API->>SS: HTTP POST: item-update
    SS-->>UI: WebSocket: "itemsUpdate"
    Note over UI: React Query invalidates ['all-items']
```

---

> **Document generated for**: Hungry Harbor v0.1.0  
> **Framework**: Next.js 14 (App Router) | **Database**: MongoDB | **Payment**: Razorpay | **Real-time**: Socket.io

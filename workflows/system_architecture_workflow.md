# 🏥 OrganEase: System Architecture & End-to-End Workflow

This document provides a production-grade architectural and technical workflow specification for **OrganEase**, an automated digital platform bridging Organ Procurement Organizations (OPOs), hypothermic organ storage centers, and transplant hospitals.

---

## 1. High-Level Multi-Tier Architecture

```mermaid
flowchart TB
    subgraph ClientTier["Client Tier (React SPA - Port 3000)"]
        UI["React Component Tree<br/>(Navbar, Home, Cart, Modals)"]
        Router["React Router v5<br/>(Public, Protected, Admin Guards)"]
        State["Dual Context & Reducer State<br/>(HomeContext, CartContext, AdminContext)"]
        Storage["Browser Storage<br/>(localStorage: jwt, user, cart, wishList)"]
        PaymentUI["Braintree Web Drop-In<br/>(Card / Nonce Tokenization)"]
    end

    subgraph ServerTier["Server Tier (Node.js & Express - Port 5000)"]
        CORS["CORS Middleware<br/>(Origin: :3000, credentials: true)"]
        StaticMW["express.static('public')<br/>(Uploads: Categories, Customizes, Products)"]
        BodyParser["Body & Cookie Parsers<br/>(json, urlencoded, cookie-parser)"]
        AuthMW["Authentication & RBAC Middleware<br/>(loginCheck, isAuth, isAdmin)"]
        
        subgraph Controllers["API Controllers"]
            AuthCtrl["authController<br/>(signin, signup, allUser)"]
            CategoryCtrl["categoryController<br/>(getAllCategory, postAddCategory, edit, delete)"]
            ProductCtrl["productController<br/>(getAllProduct, productByCategory, add, edit, delete)"]
            OrderCtrl["orderController<br/>(createOrder, getAllOrders, orderByUserId, updateStatus)"]
            BraintreeCtrl["brainTreeController<br/>(generateToken, paymentProcess)"]
            CustomizeCtrl["customizeController<br/>(getImages, uploadSlideImage, migrateDb)"]
        end
    end

    subgraph DataTier["Data Tier (MongoDB Atlas / Replica Set)"]
        UsersCol[("users Collection<br/>(Admin & Hospital Requesters)")]
        CategoriesCol[("categories Collection<br/>(Organ Categories: Kidney, Liver, Heart, etc.)")]
        ProductsCol[("products Collection<br/>(Preserved Organs: Ischemia Window, PIN)")]
        OrdersCol[("orders Collection<br/>(Organ Transfer Requests & Status State Machine)")]
        CustomizeCol[("customizes Collection<br/>(Homepage Hero Carousel Slides)")]
    end

    UI --> Router
    Router --> State
    State --> PaymentUI
    UI -->|HTTP / REST with JWT & JSON| CORS

    CORS --> StaticMW
    CORS --> BodyParser
    BodyParser --> AuthCtrl
    BodyParser --> CategoryCtrl
    BodyParser --> ProductCtrl
    BodyParser --> CustomizeCtrl
    BodyParser --> BraintreeCtrl
    BodyParser --> AuthMW

    AuthMW --> OrderCtrl
    AuthMW --> CategoryCtrl
    AuthMW --> ProductCtrl

    AuthCtrl --> UsersCol
    CategoryCtrl --> CategoriesCol
    ProductCtrl --> ProductsCol
    ProductCtrl -.-> CategoriesCol
    OrderCtrl --> OrdersCol
    OrderCtrl -.-> ProductsCol
    OrderCtrl -.-> UsersCol
    CustomizeCtrl --> CustomizeCol
```

---

## 2. End-to-End Organ Request & Allocation Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Hospital as Transplant Hospital User
    participant Frontend as React Client (:3000)
    participant Backend as Express API (:5000)
    participant Braintree as Braintree Payment Gateway
    participant Database as MongoDB Atlas
    actor Procurement as OPO / Admin Procurement Officer

    Hospital->>Frontend: Browse available organs by category & blood group
    Frontend->>Backend: GET /api/product/all-product
    Backend->>Database: productModel.find({}).populate("pCategory")
    Database-->>Backend: Return active organs list
    Backend-->>Frontend: 200 OK (Products payload)

    Note over Frontend: Calculates Ischemia Expiration: moment(createdAt).add(pName, 'hours')
    Frontend->>Hospital: Display organ cards with viable hours & PIN code

    Hospital->>Frontend: Select organ & proceed to Checkout
    Frontend->>Backend: GET /api/braintree/get-token (Bearer JWT)
    Backend->>Braintree: gateway.clientToken.generate()
    Braintree-->>Backend: Client Token
    Backend-->>Frontend: Return client token
    Frontend->>Braintree: Drop-In UI initializes & tokenizes card
    Braintree-->>Frontend: Returns paymentMethodNonce

    Hospital->>Frontend: Confirm Organ Transfer Request
    Frontend->>Backend: POST /api/braintree/payment (nonce, amountTotal)
    Backend->>Braintree: gateway.transaction.sale()
    Braintree-->>Backend: Transaction Successful (transactionId)
    
    Backend->>Database: orderModel.create({ allProduct, user, amount, transactionId, status: "Under Scrutiny" })
    Database-->>Backend: Order saved
    Backend-->>Frontend: 200 OK (Order confirmed, Status: "Under Scrutiny")
    Frontend-->>Hospital: Display Transfer Confirmation & Tracking ID

    Procurement->>Frontend: Open Admin Dashboard (/admin/dashboard/orders)
    Frontend->>Backend: POST /api/order/get-all-orders (Bearer JWT, isAdmin)
    Backend->>Database: orderModel.find({}).populate("allProduct.id user")
    Database-->>Backend: Orders list
    Backend-->>Frontend: 200 OK
    Procurement->>Frontend: Review donor medical history & click "Accept Request"
    Frontend->>Backend: POST /api/order/update-order (orderId, status: "Request Accepted")
    Backend->>Database: orderModel.findByIdAndUpdate(status: "Request Accepted")
    Database-->>Backend: Updated order document
    Backend-->>Frontend: 200 OK (Status Updated)
```

---

## 3. Tier Responsibilities & Component Mapping

| Architectural Tier | Core Technologies | Primary Responsibilities | Key Files / Modules |
| :--- | :--- | :--- | :--- |
| **Client Tier** | React 16.13, React Router v5, Tailwind CSS, Axios, Moment.js, Braintree Drop-In | • User authentication state and JWT storage in `localStorage`<br>• Real-time organ search, category filtering & pagination<br>• Dynamic cold ischemia expiration calculation via Moment.js<br>• Secure tokenized payment modal for transfer confirmation tokens<br>• Separate User and Admin protected dashboard suites | [`App.js`](file:///D:/PROJECT_S/OrganEase/OrganEase/client/src/App.js)<br>[`HomeContext.js`](file:///D:/PROJECT_S/OrganEase/OrganEase/client/src/components/shop/home/HomeContext.js)<br>[`SingleProduct.js`](file:///D:/PROJECT_S/OrganEase/OrganEase/client/src/components/shop/home/SingleProduct.js)<br>[`CheckoutProducts.js`](file:///D:/PROJECT_S/OrganEase/OrganEase/client/src/components/shop/order/CheckoutProducts.js) |
| **Server Tier** | Node.js 20+, Express 4.18, JWT, bcryptjs, Braintree SDK, Multer | • Centralized REST API endpoints<br>• Role-Based Access Control (RBAC): `userRole: 0` (Hospital) vs `1` (Admin)<br>• Multer file uploads for organ and category imagery<br>• Braintree gateway integration for transaction validation<br>• Upload directory auto-generation & DNS fallback for Atlas | [`server.js`](file:///D:/PROJECT_S/OrganEase/OrganEase/server/server.js)<br>[`middleware/auth.js`](file:///D:/PROJECT_S/OrganEase/OrganEase/server/middleware/auth.js)<br>[`controller/products.js`](file:///D:/PROJECT_S/OrganEase/OrganEase/server/controller/products.js)<br>[`controller/orders.js`](file:///D:/PROJECT_S/OrganEase/OrganEase/server/controller/orders.js)<br>[`controller/braintree.js`](file:///D:/PROJECT_S/OrganEase/OrganEase/server/controller/braintree.js) |
| **Data Tier** | MongoDB Atlas, Mongoose 5.9, Replica Set Cluster | • Schema validation, indexing, and referential data integrity<br>• Population queries (`allProduct.id`, `pCategory`, `user`)<br>• Order status state machine lifecycle<br>• Idempotent database migrations and seeding routines | [`models/users.js`](file:///D:/PROJECT_S/OrganEase/OrganEase/server/models/users.js)<br>[`models/categories.js`](file:///D:/PROJECT_S/OrganEase/OrganEase/server/models/categories.js)<br>[`models/products.js`](file:///D:/PROJECT_S/OrganEase/OrganEase/server/models/products.js)<br>[`models/orders.js`](file:///D:/PROJECT_S/OrganEase/OrganEase/server/models/orders.js)<br>[`config/migrate.js`](file:///D:/PROJECT_S/OrganEase/OrganEase/server/config/migrate.js) |

---

## 4. Cold Ischemia Expiration & Viability State Machine

Organs in hypothermic preservation have strict time thresholds. OrganEase models this dynamically across the stack:

```mermaid
stateDiagram-v2
    [*] --> Procurement: Organ Donated & Logged (createdAt)
    Procurement --> ActiveStorage: Admin inputs pName (Ischemia Window hours)
    
    state ActiveStorage {
        [*] --> Viable: CurrentTime < (createdAt + pName)
        Viable --> NearExpiry: Time remaining <= 2 hours
        NearExpiry --> Expired: CurrentTime >= (createdAt + pName)
    }

    Viable --> Requested: Hospital Requests Organ
    Requested --> TransferAccepted: Admin / OPO accepts request
    Requested --> Cancelled: Rejection / Incompatibility
    NearExpiry --> Requested: Urgent Allocation
    Expired --> Disposal: System Disables Listing (pStatus = 'Disabled')
    TransferAccepted --> Completed: Transfer Delivered
```

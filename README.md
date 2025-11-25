# Short URL Service

A simple full-stack URL shortener built with **React (Vercel)** + **Node.js/Express (Render)** + **MongoDB Atlas**.

---

## 🚀 Features
- Shorten long URLs  
- Redirect using `/code`  
- View detailed stats  
- System health page  
- Clean responsive UI  

---

## 📂 Routes

### **Frontend (React – Vercel)**
| Route | Description |
|-------|-------------|
| `/` | Dashboard |
| `/code/:code` | Stats page |
| `/healthz` | Health check page |
| `/:code` | Redirect to original URL |

### **Backend (Node.js – Render)**
| Endpoint | Description |
|----------|-------------|
| `POST /api/create` | Create short link |
| `GET /api/stats/:code` | Link statistics |
| `GET /:code` | Redirect handler |
| `DELETE /:code` | Delete shortcode endpoint |
| `GET /healthz` | Health check endpoint |

---

## ⚙️ Installation & Running Locally

### **Backend**
Add .env file
```bash
PORT=3000
MONGO_URI=your-mongodb-uri
```
Start the server
```bash
cd server
npm install
node index.js
```

### **Frontend**
```bash
cd client
npm install
npm run dev
```



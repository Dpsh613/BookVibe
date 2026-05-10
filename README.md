# BookVibe 📚✨

**Mood-based book discovery with in-app EPUB reading.**
Find books by how you feel, explore literature across eras, and read them inside a clean reader UI.

Powered by the **GutenDex API** and books from **Project Gutenberg**.
Built with **MERN + Tailwind CSS**.

---

## 🌟 Why this app exists

Most book websites:

* overwhelm users with too many filters
* don’t help decide *what* to read
* redirect users away to read the actual book

This app focuses on:

> **Discovery + Reading experience in one place**

You choose a **mood** or an **era**, get curated suggestions, and start reading instantly inside the app.

---

## 🚀 Core Features

* 🎭 Mood → Book suggestions (happy, dark, romantic, mysterious, etc.)
* 🕰 Era → Discover classics by time period
* 🔎 Title & genre search
* 📖 In-app EPUB reader (no redirects)
* 🌙 Clean reader UI with dark/light mode
* 🔖 Reading progress & bookmarks (stored in DB)
* ⚡ Live data from Gutendex (no PDFs stored)

---

## 🧠 How it works (Architecture)

* Books are **not stored** in the database
* Metadata is fetched live from Gutendex API
* Only minimal data is stored:

  * user bookmarks
  * reading progress
  * mood/era mappings (static JSON)
* EPUB files are rendered inside the app using a React EPUB reader
* Custom styles are injected to improve typography and reading comfort

This keeps the project **within free MongoDB limits** while still delivering a rich experience.

---

## 🛠 Tech Stack

**Frontend**

* React.js
* Tailwind CSS
* EPUB Reader (epub.js / react-reader)

**Backend**

* Node.js
* Express.js
* MongoDB (minimal storage)
* Gutendex API integration

---

## 📷 Screenshots

*Add your UI screenshots here*

* Home page (mood selection)
* Era exploration
* Book listing
* Reader screen

---

## 📂 Folder Structure (important)

```
/client
  /components
  /pages
  /reader
  /styles

/server
  /controllers
  /routes
  /services (gutendex fetch logic)
  /data (mood & era mapping JSON)
  /models (bookmarks, progress)
```

---

## ⚙️ What is stored in Database?

Only:

* User bookmarks
* Reading progress
* Recently viewed books

No books, no PDFs, no heavy storage.

---

## ▶️ Run Locally

### 1. Clone repo

```
git clone <your-repo>
```

### 2. Install client

```
cd client
npm install
npm start
```

### 3. Install server

```
cd server
npm install
npm run dev
```

### 4. Add `.env`

```
MONGO_URI=your_mongodb_uri
PORT=5000
```

---

## 📚 Data Source & Credits

* Book data from **GutenDex API**
* Books provided by **Project Gutenberg** (Public Domain)

This project uses only public domain books and does not host any copyrighted content.

---

## 🎯 Future Improvements

* Reading statistics dashboard
* Personalized recommendations
* Book roulette
* Notes & highlights

---

## 💡 Learning Goals of this Project

This project demonstrates:

* Real API integration in MERN
* Smart DB design for free tier limits
* EPUB rendering & styling in React
* UX design around third-party content
* Clean project architecture

---

## ❤️ Made for readers who don’t know what to read next

If you’ve ever opened a book site and felt overwhelmed, this app is for you.

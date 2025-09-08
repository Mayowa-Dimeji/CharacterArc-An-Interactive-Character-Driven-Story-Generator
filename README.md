# CharacterArc – Frontend 🎭

An interactive storytelling web app where user-created characters (with traits, goals, and fears) shape branching AI-generated narratives.  
Built with **React + TypeScript + Vite**, styled with **Tailwind CSS**, and deployed on **Vercel**.

👉 [Live Demo](https://character-arc-ai-gen.vercel.app/)  
👉 [Backend API Github](https://github.com/Mayowa-Dimeji/CharacterArc-Backend.git)

---

## ✨ Features

- 🧑 **Character Builder** – Define archetype, traits, goals, fears, worldview, and growth theme.
- 📖 **AI-Generated Beats** – Each choice dynamically influences the next scene.
- 🗺 **Story Map Overlay** – Visualizes branching story paths and choices.
- 💾 **Persistent State** – Character + history saved across scenes.
- 🎨 **Modern UI** – Responsive, polished dashboard using Tailwind components.

---

## 📸 Screenshots

### Dashboard (Character Creation)

![Character Dashboard](/public/assets/dashboard.png)

### Example Beat Response

![AI Beat Example](/public/assets/example-beat.png)

---

## 🚀 Getting Started (Local Development)

1. Clone this repo:

   ```bash
   git clone https://github.com/Mayowa-Dimeji/CharacterArc-An-Interactive-Character-Driven-Story-Generator.git
   cd CharacterArc-Frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run local dev server (with backend running at http://localhost:8000):

   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm run preview
   ```

---

## 🔗 Environment Variables

Create a `.env.local` (for dev) or `.env.production` file:

```env
VITE_API_BASE=https://characterarc-backend-production.up.railway.app
```

---

## 🛠 Tech Stack

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)
- [Vercel](https://vercel.com) (deployment)

---

---

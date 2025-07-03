
# 📇 Contact Manager App

A modern contact management web application built using **Vite**, **React**, **Shadcn UI**, and **Supabase**. This app allows users to create, view, update, and delete contacts with profile image uploads and a tracked “last contacted date.”

---

## 🚀 Features

- ⚡ Create, Read, Update, Delete (CRUD) operations
- 🖼️ Upload & update profile images using Supabase Storage
- 📅 Store and sort by “last contact date”
- ✨ Clean, responsive UI with Shadcn
- 🔁 Real-time UI updates after actions
- 🔒 Form validations & error handling
- 🔄 Loading indicators on create/update

---

## 🧱 Tech Stack

- [Vite](https://vitejs.dev/)
- [React + TypeScript](https://react.dev/)
- [Supabase (Database + Storage)](https://supabase.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📦 Project Structure

```
src/
├── components/
│   ├── ContactInfoModal.tsx       # View/edit/delete contact modal
│   ├── NewContactModal.tsx        # Add new contact modal
├── pages/
│   └── ContactsPage.tsx           # Main contact list screen
├── lib/
│   └── supabaseClient.ts          # Supabase setup
├── App.tsx                        # Entry screen
└── main.tsx                       # Application mount point
```

---

## 🛠️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/contact-manager.git
cd contact-manager
npm install
```

### 2. Set Up Supabase

- Create a project at [https://supabase.com](https://supabase.com)
- Create a `contacts` table with the following schema:

```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  last_contact_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

- Create a **Storage Bucket** named: `contact-images`
- Make the bucket **public**

---

## 🔐 Supabase Policies

Enable RLS (Row Level Security) on the `contacts` table and set these policies:

```sql
-- Table policies
CREATE POLICY "Allow read" ON contacts FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON contacts FOR UPDATE USING (true);
CREATE POLICY "Allow delete" ON contacts FOR DELETE USING (true);

-- Storage object access
CREATE POLICY "Allow upload" ON storage.objects FOR INSERT USING (bucket_id = 'contact-images');
CREATE POLICY "Allow read" ON storage.objects FOR SELECT USING (bucket_id = 'contact-images');
```

---

## 🔧 Configure Supabase Client

Edit `src/lib/supabaseClient.ts`:

```ts
const supabaseUrl = "https://your-project-id.supabase.co";
const supabaseKey = "your-anon-public-key";
export const supabase = createClient(supabaseUrl, supabaseKey);
```

---

## ▶️ Running Locally

```bash
npm run dev
```

Then open your browser to:  
🔗 [http://localhost:5173](http://localhost:5173)

---

## 🌐 Live Demo

✅ [assignment-contacts-app.vercel.app](https://assignment-contacts-app.vercel.app/)

---

## 💻 GitHub Repository

📂 [https://github.com/saichinmay2000/assignment-contacts-app](https://github.com/saichinmay2000/assignment-contacts-app)

---

# Vue + Vite + Supabase Auth - Todo App

A full-featured todo management application with **Vue 3**, **Vite**, and **Supabase** authentication, featuring a comprehensive dashboard with charts, dark mode, and task management capabilities.

## 🚀 Quick Start


```bash
username: admin@gmail.com
password: password
```

```bash
npm install
```

Create `.env`:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

Run:
```bash
npm run dev
```

## 🛠️ Tech Stack

- **Vue 3** - Frontend framework (Composition API)
- **Vite** - Build tool & dev server
- **Supabase** - Auth & Database (PostgreSQL)
- **Vue Router** - Client-side routing
- **Chart.js & Vue-ChartJS** - Data visualization
- **Tailwind CSS** - Utility-first styling

## 📁 Features

### 🔐 Authentication
- ✅ Email/password authentication
- ✅ Protected routes & session management
- ✅ User profile management
- ✅ Secure logout

### 📋 Task Management
- ✅ Create, read, update, delete todos
- ✅ Task status tracking (Todo, In Progress, Done)
- ✅ Priority levels (Low, Medium, High)
- ✅ Due date assignment
- ✅ Task filtering & search
- ✅ Tag system for task organization

### 📊 Dashboard
- ✅ Statistics cards (Total, Completed, In Progress, Overdue)
- ✅ Completion rate progress bar
- ✅ Status distribution bar chart
- ✅ Priority distribution pie chart
- ✅ Recent tasks display
- ✅ Three view modes: Overview, Charts, Table

### 🌙 Dark Mode
- ✅ Toggle dark/light mode
- ✅ System preference detection
- ✅ Persistent dark mode preference (localStorage)
- ✅ Full dark mode support across all pages
- ✅ Smooth color transitions

### 📱 Views & Pages
- **Dashboard** - Overview with statistics and charts
- **Todos** - Manage all tasks with filters and search
- **Tags** - Create and organize task tags
- **Profile** - Edit user information and settings

## 📂 Project Structure

```
src/
├── components/
│   ├── Navigation.vue        # Top navigation with dark mode toggle
│   ├── PageWrapper.vue       # Reusable dark mode wrapper
│   ├── TaskFilters.vue       # Task filtering component
│   ├── TaskTable.vue         # Task table view
│   ├── charts/
│   │   ├── StatusBarChart.vue
│   │   └── PriorityPieChart.vue
├── views/
│   ├── Login.vue
│   ├── Dashboard.vue
│   ├── Todos.vue
│   ├── Tags.vue
│   └── Profile.vue
├── composables/
│   └── useDarkMode.js        # Dark mode state management
├── lib/
│   ├── supabase.js           # Supabase client setup
│   └── database.js           # Database service functions
├── router/
│   └── index.js              # Route definitions
└── App.vue
```

## 🔐 Setup Supabase

1. Create account at https://supabase.com
2. Create a new project
3. Enable Email authentication in Authentication > Providers
4. Create the following tables:

**profiles**
- id (uuid, primary key)
- user_id (uuid, foreign key)
- username (text)
- full_name (text)
- avatar_url (text)
- created_at (timestamp)

**todos**
- id (uuid, primary key)
- user_id (uuid, foreign key)
- title (text)
- description (text)
- status (text: todo, in_progress, done)
- priority (integer: 1-3)
- due_date (timestamp)
- created_at (timestamp)

**tags**
- id (uuid, primary key)
- user_id (uuid, foreign key)
- name (text)
- created_at (timestamp)

**todo_tags** (junction table)
- id (uuid, primary key)
- todo_id (uuid, foreign key)
- tag_id (uuid, foreign key)

5. Copy credentials to `.env`

## 🎨 Dark Mode

The app includes a comprehensive dark mode system:
- Toggle with the moon/sun icon in the navigation bar
- Automatic system preference detection
- Persistent preference stored in localStorage
- Consistent dark theme across all pages and components

## 📝 Scripts

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## 🔗 API Endpoints (Database Functions)

All database operations are managed through `lib/database.js`:
- `todoService.getTodos(userId)` - Fetch all todos
- `todoService.createTodo(userId, data)` - Create new todo
- `todoService.updateTodo(todoId, data)` - Update todo
- `todoService.deleteTodo(todoId)` - Delete todo
- `tagService.getTags(userId)` - Fetch all tags
- `tagService.createTag(userId, name)` - Create new tag
- `profileService.getProfile(userId)` - Get user profile
- `profileService.updateProfile(userId, data)` - Update profile

## 📸 Screenshots

- **Dashboard**: Overview with stats, charts, and task list
- **Todos Page**: Full task management with filters and search
- **Dark Mode**: System-wide dark theme support
- **Profile**: User information and settings

---

Vincent Vullag

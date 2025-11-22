# FIT11 - AI-Powered Fitness Ecosystem
FIT11 is a comprehensive, AI-driven fitness application designed to replace guesswork with data. It combines automated workout planning, real-time form correction, gamification, and community features into a single ecosystem.

## 👥 Team Members

* Musab Barnawi: Lead Developer 
* 
* 

## 🚀 Features

1. 🏋️‍♂️ AI Workout Builder
* Generates personalized 8-week training programs.
* Customizable based on goals (Hypertrophy, Strength, Fat Loss), experience level, and available equipment.
* Smart progression logic and deload weeks included.

2. 🎯 No-Rep Counter (Computer Vision)
* Uses the device camera to analyze exercise form in real-time.
* Provides instant feedback on rep quality (Perfect, Good, Poor).
* Auto-counts completed reps.

3. 🏆 Leaderboard & Gamification
* Global Leaderboard:** Compete with other users based on lifetime points.
* Challenges:** Join distance, streak, or volume challenges to earn points.
* Rewards Store:** Redeem points for exclusive merchandise (Water bottles, Towels, Apparel).
* Rank Protection:** Redeeming prizes deducts your *spendable balance* but maintains your *Lifetime Rank*.

4. 🎧 Audio & Video Library
* Curated fitness podcasts and educational videos.
* Integrated video player for training tips and motivation.

5. 👥 Community Hub
* Social feed to share progress and achievements.
* Like and comment on other users' posts.
* Top Contributors tracking.

6. 📊 Dashboard
* Centralized view of streaks, total points, and active plans.
* Quick access to daily tasks.

## 🛠️ Tech Stack

* **Framework:** [React](https://reactjs.org/) (v18)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **UI Components:** [Radix UI](https://www.radix-ui.com/) / Custom `shadcn/ui` inspired components.
* **Icons:** [Lucide React](https://lucide.dev/)
* **Routing:** [React Router DOM](https://reactrouter.com/)
* **Notifications:** [Sonner](https://sonner.emilkowal.ski/)

📦 Installation & Setup

1.  Clone the repository
2.  
    git clone [https://github.com/yourusername/FIT11.git
    cd FIT11
    

3.  Install dependencies
    
    npm install

4.  **Run the development server**

    npm run dev
    

5.  Open the app
    The app will be running at `http://localhost:5173`
    
📖 Usage Examples

* Creating a Workout:** Navigate to the "AI Workout Builder" from the sidebar, select your goal (e.g., Hypertrophy), input your available equipment, and generate a plan.
* Redeeming Rewards:** Go to the "Leaderboard", click the "Rewards" tab, and select an item. A confirmation dialog with a green checkmark will appear if you have enough points.
* Using the No-Rep Counter:** Allow camera permissions when prompted in the "No-Rep Counter" section to start real-time form analysis.

📂 Project Structure


src/
├── assets/             # Static images and assets
├── components/
│   ├── ui/             # Reusable UI components (Buttons, Cards, Dialogs, etc.)
│   ├── shared/         # Layout components (Sidebar, TopBar)
│   ├── utils/          # Helper functions 
├── lib/                # Utility libraries (Tailwind merge, etc.)
├── App.tsx             # Main application router
└── main.tsx            # Entry point

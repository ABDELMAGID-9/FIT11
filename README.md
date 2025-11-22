# FIT11 - AI-Powered Fitness Ecosystem
FIT11 is a comprehensive, AI-driven fitness application designed to replace guesswork with data. It combines automated workout planning, real-time form correction, gamification, and community features into a single ecosystem.

## 👥 Team Members

* Musab Barnawi: Lead Developer
* Abdelmagid Osman: Lead Developer
* Omar Alharbi: Frontend Developer


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

* Framework: React
* Languages: JavaScript, HTML, CSS
* Styling: CSS
* Routing: React Router DOM
* Icons: Lucide React
* Notifications: Sonner

📦 Installation & Setup

1.  Clone the repository
2.  
    git [clone https://github.com//FIT11.git](https://github.com/ABDELMAGID-9/FIT11)
    
    cd FIT11
    
4.  Install dependencies
    npm install

5.  Run the development server
    npm run dev
    or
    npm run dev -- --host
    

7.  Open the app
    The app will be running at `http://localhost:5173`
    
📖 Usage Examples

From the landing page press the login or sign in button to access all the website features including:
* Creating a Workout:** Navigate to the "AI Workout Builder" from the sidebar, select your goal (e.g., Hypertrophy), input your available equipment, and generate a plan.
* Generating a Nutrition Plan:** Go to the "AI Nutrition Tracker", enter your dietary preferences and goals, and the AI will generate a customized macro breakdown for you.
* Exploring the Audio Library:** Navigate to the "Audio Library" to listen to fitness podcasts or watch instructional videos directly within the app.

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

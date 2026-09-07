# 🏃‍♂️ SmartFit: BMI Re-calibration & Smart Nutrition Dashboard

An interactive data-driven dashboard built with **Streamlit** that provides personalized BMI analysis, activity recalibration, and intelligent food recommendations — powered by real nutritional data and community lifestyle insights.

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.x-red.svg)](https://streamlit.io/)
[![Plotly](https://img.shields.io/badge/Plotly-5.x-purple.svg)](https://plotly.com/)

---

## 🚀 Features

- **Real-time BMI Calculator** — Instantly computes BMI from weight and height input
- **BMI Re-calibration Target** — Calculates the exact kg needed to reach a healthy BMI (18.5–24.9)
- **Population Scatter Plot** — Visualizes your position relative to other users (BMI vs. Daily Steps)
- **Smart Food Recommendations** — Filters 8,618 food items based on your BMI category
- **Community Cuisine Profiling** — Personalization based on real food preference data from 120 respondents

---

## 📊 Datasets

This project is powered by three curated datasets:

### 1. `master_smartfit_final.csv` — Activity & BMI Tracking
Schema for physical metrics and daily activity logs. Key columns:

| Column | Description |
|---|---|
| `bmi` | Body Mass Index |
| `TotalSteps` | Daily step count |
| `VeryActiveMinutes` | Minutes of high-intensity activity |
| `SedentaryMinutes` | Minutes of inactivity |
| `Calories` | Total calories burned |
| `Recommendation_Label` | Activity-based recommendation category |

### 2. `abbrev_cleaned.csv` — Nutrition Database
A comprehensive food nutrition reference with **8,618 food items** (zero null values).

| Metric | Value |
|---|---|
| Total food entries | 8,618 |
| Calorie range | 0 – 902 kcal |
| Average calories | 226.4 kcal |
| Average protein | 11.5 g |
| Average carbohydrates | 21.8 g |
| Foods under 250 kcal | 5,345 items (62%) |

Columns: `food_name`, `calories`, `protein`, `fat`, `carbs`, `fiber`, `sugar`

### 3. `food_choices_cleaned.csv` — Community Lifestyle Preferences
Survey data from **120 respondents** capturing real eating and exercise habits.

| Metric | Value |
|---|---|
| Total respondents | 120 |
| Top cuisine | Italian (47 respondents, ~39%) |
| Other popular cuisines | Mexican, American, Chinese, Asian |
| Rarely exercise (level 1) | 57 respondents (47.5%) |
| Sometimes exercise (level 2) | 41 respondents (34.2%) |
| Often exercise (level 3) | 10 respondents (8.3%) |

Columns: `Gender`, `fav_cuisine`, `eating_out`, `exercise`, `weight`, `GPA`

---

## 🔍 EDA Insights

Key findings from the Exploratory Data Analysis phase:

**Nutrition Distribution**
- The nutrition database has a median of 191 kcal per food item, with 62% of foods falling under the 250 kcal threshold used for the low-calorie filter.
- Protein content ranges widely (0–88g), enabling effective high-protein food filtering for underweight profiles.

**Community Lifestyle Patterns**
- Italian cuisine dominates preferences at ~39% of respondents — significantly ahead of Mexican (8%) and American (6%), informing the cuisine-based personalization logic.
- Nearly half (47.5%) of respondents exercise rarely, highlighting the importance of activity-nudge recommendations in the app.
- Eating out frequency peaks at level 2 (moderate), suggesting most users balance home and restaurant meals.

**BMI Re-calibration Logic**
- For *Overweight/Obese* profiles: `kg_to_lose = weight - (24.9 × height_m²)`
- For *Underweight* profiles: `kg_to_gain = (18.5 × height_m²) - weight`

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| `Streamlit` | Interactive web dashboard |
| `Pandas` | Data loading, filtering, sampling |
| `Plotly Express` | Scatter plot visualization |

---

## ⚙️ Installation & Running Locally

**1. Clone the repository**
```bash
git clone https://github.com/your-username/smartfit-dashboard.git
cd smartfit-dashboard
```

**2. Install dependencies**
```bash
pip install -r requirements.txt
```

**3. Place datasets in the root directory**
Make sure these files are present:
```
master_smartfit_final.csv
abbrev_cleaned.csv
food_choices_cleaned.csv
```

**4. Run the app**
```bash
streamlit run streamlit_app.py
```

The app will open at `http://localhost:8501`.

---

## 📁 Project Structure

```
smartfit-dashboard/
│
├── streamlit_app.py          # Main Streamlit application
├── requirements.txt          # Python dependencies
│
├── master_smartfit_final.csv # Activity & BMI dataset
├── abbrev_cleaned.csv        # Nutrition database (8,618 items)
└── food_choices_cleaned.csv  # Community lifestyle survey (120 respondents)
```

---

## 🧠 How the Recommendation Logic Works

```
User Input (gender, weight, height)
        ↓
   Calculate BMI
        ↓
   ┌────────────────────────────────────┐
   │  BMI < 18.5  → Underweight        │
   │  18.5–24.9   → Normal             │
   │  BMI ≥ 25    → Overweight/Obese   │
   └────────────────────────────────────┘
        ↓
   Re-calibration target (kg difference)
        ↓
   Food filter from abbrev_cleaned.csv:
   • Overweight → foods < 250 kcal only
   • Normal/Underweight → diverse random sample
        ↓
   Cuisine tag from food_choices_cleaned.csv
   (random community preference sample)
```

---

## 📄 License

This project is for educational and portfolio purposes.

---

*Built with real data for real results — SmartFit helps you move smarter, eat better.*

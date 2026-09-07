import os
import joblib
import numpy as np
import tensorflow as tf
import random
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from enum import Enum
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SmartFit AI Backend - Full Recommendation")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "smartfit_fix_model.keras"
SCALER_PATH = "./scaler.pkl"

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("✅ Model berhasil diload!")
except Exception as e:
    print(f"❌ Gagal memuat model: {e}")
    model = None

try:
    scaler = joblib.load(SCALER_PATH)
    print("✅ Scaler berhasil diload!")
except Exception as e:
    print(f"❌ Scaler gagal dimuat: {e}")
    scaler = None

class GoalEnum(str, Enum):
    lose_weight = "lose_weight"
    maintain_weight = "maintain_weight"
    gain_weight = "gain_weight"

class UserInput(BaseModel):
    gender: str
    weight_kg: float
    height_cm: float
    goal: GoalEnum
    age: int

@app.post("/predict")
def predict_intensity(data: UserInput):
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Server/Model belum siap.")

    try:
        height_m = data.height_cm / 100.0
        bmi = data.weight_kg / (height_m ** 2)

        features = np.array([[data.weight_kg, bmi]])
        features_scaled = scaler.transform(features)

        prediction = model.predict(features_scaled)
        class_index = np.argmax(prediction, axis=1)[0]

        labels = ["Sedentary", "Light", "Moderate", "Vigorous"]
        predicted_label = labels[class_index]

        recommendation_rules = {
            "Sedentary": {
                "activities": [
                    {"id": 1, "name": "Morning Stretching", "description": "Light muscle stretching for 15 minutes to improve blood circulation.", "image": "/images/activities/morning-streching.jpg", "youtube_url": "https://www.youtube.com/watch?v=4snu7NxD4nM"},
                    {"id": 2, "name": "Leisurely Walk", "description": "A leisurely walk around the house for 20 minutes.", "image": "/images/activities/leisurely-walk.jpg", "youtube_url": "https://www.youtube.com/watch?v=-SSYX8sIOmM"},
                    {"id": 3, "name": "Chair Yoga", "description": "Light yoga movements while seated to stretch the spine.", "image": "/images/activities/chair-yoga.jpg", "youtube_url": "https://www.youtube.com/watch?v=xRH1To_xyr8"},
                    {"id": 4, "name": "Basic Tai Chi", "description": "Breathing exercises and slow movements for 15 minutes.", "image": "/images/activities/basic-tai-chi.jpg", "youtube_url": "https://www.youtube.com/watch?v=vHBR5MZmEsY"},
                    {"id": 5, "name": "Neck & Shoulder Stretch", "description": "Focus on relaxing upper body muscles for 10 minutes.", "image": "/images/activities/neck-shoulder-stretch.jpg", "youtube_url": "https://www.youtube.com/watch?v=s-7lyvblFNI"},
                    {"id": 6, "name": "Marching in Place", "description": "March in place while watching TV for 15 minutes.", "image": "/images/activities/marching-in-place.jpg", "youtube_url": "https://www.youtube.com/watch?v=Ac8M_Osjy6s"}
                ],
                "foods": [
                    {"id": 1, "name": "Oatmeal", "portion": "80g", "kcal": 150, "emoji": "🥣"},
                    {"id": 2, "name": "Banana", "portion": "1 piece", "kcal": 89, "emoji": "🍌"},
                    {"id": 3, "name": "Greek Yogurt", "portion": "150g", "kcal": 88, "emoji": "🍶"},
                    {"id": 4, "name": "Whole Wheat Bread", "portion": "2 slices", "kcal": 138, "emoji": "🍞"},
                    {"id": 5, "name": "Boiled Egg", "portion": "1 piece", "kcal": 77, "emoji": "🥚"},
                    {"id": 6, "name": "Apple", "portion": "1 piece", "kcal": 95, "emoji": "🍎"},
                    {"id": 7, "name": "Almond Milk", "portion": "250ml", "kcal": 39, "emoji": "🥛"},
                    {"id": 8, "name": "Almonds", "portion": "20g", "kcal": 115, "emoji": "🥜"},
                    {"id": 9, "name": "Green Tea", "portion": "1 cup", "kcal": 2, "emoji": "🍵"},
                    {"id": 10, "name": "Strawberries", "portion": "100g", "kcal": 32, "emoji": "🍓"},
                    {"id": 11, "name": "Cucumber Slices", "portion": "150g", "kcal": 24, "emoji": "🥒"},
                    {"id": 12, "name": "Watermelon", "portion": "200g", "kcal": 60, "emoji": "🍉"},
                    {"id": 13, "name": "Pear", "portion": "1 piece", "kcal": 101, "emoji": "🍐"},
                    {"id": 14, "name": "Chia Seeds", "portion": "15g", "kcal": 73, "emoji": "🥄"},
                    {"id": 15, "name": "Carrot Sticks", "portion": "100g", "kcal": 41, "emoji": "🥕"},
                    {"id": 16, "name": "Rice Cakes", "portion": "2 pieces", "kcal": 70, "emoji": "🍘"},
                    {"id": 17, "name": "Soy Milk", "portion": "250ml", "kcal": 80, "emoji": "🥛"},
                    {"id": 18, "name": "Blueberries", "portion": "100g", "kcal": 57, "emoji": "🫐"}
                ]
            },
            "Light": {
                "activities": [
                    {"id": 1, "name": "Basic Yoga", "description": "Light yoga movements for 30 minutes for flexibility.", "image": "/images/activities/basic-yoga.jpg", "youtube_url": "https://www.youtube.com/watch?v=v7AYKMP6rOE"},
                    {"id": 2, "name": "Brisk Walking", "description": "Walk at a brisk pace for 30 minutes to raise your heart rate.", "image": "/images/activities/brisk-walking.jpg", "youtube_url": "https://www.youtube.com/watch?v=nmvVfgrExAg"},
                    {"id": 3, "name": "Beginner Pilates", "description": "Light core muscle exercises for 20 minutes.", "image": "/images/activities/beginner-pilates.jpg", "youtube_url": "https://www.youtube.com/watch?v=TbYkJXqdUP0"},
                    {"id": 4, "name": "Leisurely Cycling", "description": "Leisurely cycling on a flat route for 30 minutes.", "image": "/images/activities/leisurely-cycling.jpg", "youtube_url": "https://www.youtube.com/watch?v=ZiGE3-L4vyg"},
                    {"id": 5, "name": "Light Aerobics", "description": "Low-impact aerobics for 25 minutes.", "image": "/images/activities/light-aerobics.jpg", "youtube_url": "https://www.youtube.com/watch?v=HP_P-A3crw4"},
                    {"id": 6, "name": "Evening Walk", "description": "Leisurely walk covering a distance of 2-3 KM.", "image": "/images/activities/evening-walk.jpg", "youtube_url": "https://www.youtube.com/watch?v=kAWYgSWkaA8"}
                ],
                "foods": [
                    {"id": 1, "name": "Vegetable Salad", "portion": "200g", "kcal": 80, "emoji": "🥗"},
                    {"id": 2, "name": "Boiled Egg Whites", "portion": "3 pieces", "kcal": 51, "emoji": "🥚"},
                    {"id": 3, "name": "Avocado", "portion": "100g", "kcal": 160, "emoji": "🥑"},
                    {"id": 4, "name": "Clear Chicken Soup", "portion": "1 bowl", "kcal": 120, "emoji": "🍲"},
                    {"id": 5, "name": "Steamed Tofu", "portion": "100g", "kcal": 76, "emoji": "🧊"},
                    {"id": 6, "name": "Edamame", "portion": "100g", "kcal": 121, "emoji": "🫛"},
                    {"id": 7, "name": "Dragon Fruit", "portion": "150g", "kcal": 90, "emoji": "🐉"},
                    {"id": 8, "name": "Brown Rice", "portion": "100g", "kcal": 110, "emoji": "🍚"},
                    {"id": 9, "name": "Cherry Tomatoes", "portion": "150g", "kcal": 27, "emoji": "🍅"},
                    {"id": 10, "name": "Orange", "portion": "1 piece", "kcal": 62, "emoji": "🍊"},
                    {"id": 11, "name": "Papaya", "portion": "150g", "kcal": 65, "emoji": "🥭"},
                    {"id": 12, "name": "Steamed Spinach", "portion": "100g", "kcal": 23, "emoji": "🥬"},
                    {"id": 13, "name": "Multigrain Crackers", "portion": "30g", "kcal": 120, "emoji": "🍘"},
                    {"id": 14, "name": "Boiled Corn", "portion": "1 cob", "kcal": 96, "emoji": "🌽"},
                    {"id": 15, "name": "Melon Slices", "portion": "200g", "kcal": 68, "emoji": "🍈"},
                    {"id": 16, "name": "Miso Soup", "portion": "1 bowl", "kcal": 40, "emoji": "🥣"},
                    {"id": 17, "name": "Boiled Pumpkin", "portion": "100g", "kcal": 26, "emoji": "🎃"},
                    {"id": 18, "name": "Grapefruit", "portion": "1 piece", "kcal": 52, "emoji": "🍊"}
                ]
            },
            "Moderate": {
                "activities": [
                    {"id": 1, "name": "Morning Cardio Run", "description": "Morning run for 30 minutes at a moderate pace.", "image": "/images/activities/morning-cardio-run.jpg", "youtube_url": "https://www.youtube.com/watch?v=c1mBu4tK90k"},
                    {"id": 2, "name": "Intense Cycling", "description": "Cycling at a moderate to fast pace for 45 minutes.", "image": "/images/activities/intense-cycling.jpg", "youtube_url": "https://www.youtube.com/watch?v=wBurKQX7h4Q"},
                    {"id": 3, "name": "Swimming", "description": "Freestyle swimming continuously for 30 minutes.", "image": "/images/activities/swimming.jpg", "youtube_url": "https://www.youtube.com/watch?v=P5sPzI6ME0E"},
                    {"id": 4, "name": "Zumba / Aerobics", "description": "Moderate intensity aerobics for 45 minutes.", "image": "/images/activities/zumba.jpg", "youtube_url": "https://www.youtube.com/watch?v=AhOlYmRAjp8"},
                    {"id": 5, "name": "Bodyweight Training", "description": "A combination of push-ups, sit-ups, and lunges for 30 minutes.", "image": "/images/activities/bodyweight-training.jpg", "youtube_url": "https://www.youtube.com/watch?v=4iy4yEKa7W8"},
                    {"id": 6, "name": "Evening Jog", "description": "Light evening jog covering 3-5 KM.", "image": "/images/activities/evening-jog.jpg", "youtube_url": "https://www.youtube.com/watch?v=N9C88z3g0Es"}
                ],
                "foods": [
                    {"id": 1, "name": "Chicken Breast", "portion": "150g", "kcal": 248, "emoji": "🍗"},
                    {"id": 2, "name": "Steamed Tuna", "portion": "120g", "kcal": 132, "emoji": "🐟"},
                    {"id": 3, "name": "Grilled Tempeh", "portion": "100g", "kcal": 193, "emoji": "🧆"},
                    {"id": 4, "name": "Quinoa", "portion": "100g", "kcal": 120, "emoji": "🍚"},
                    {"id": 5, "name": "Boiled Broccoli", "portion": "150g", "kcal": 53, "emoji": "🥦"},
                    {"id": 6, "name": "Boiled Sweet Potato", "portion": "150g", "kcal": 129, "emoji": "🍠"},
                    {"id": 7, "name": "Grilled Chicken Breast", "portion": "150g", "kcal": 220, "emoji": "🍗"},
                    {"id": 8, "name": "Vegetable Salad", "portion": "200g", "kcal": 80, "emoji": "🥗"},
                    {"id": 9, "name": "Whole Wheat Pasta", "portion": "100g", "kcal": 124, "emoji": "🍝"},
                    {"id": 10, "name": "Black Beans", "portion": "100g", "kcal": 132, "emoji": "🫘"},
                    {"id": 11, "name": "Grilled Tilapia", "portion": "150g", "kcal": 192, "emoji": "🐟"},
                    {"id": 12, "name": "Soba Noodles", "portion": "100g", "kcal": 99, "emoji": "🍜"},
                    {"id": 13, "name": "Lentil Soup", "portion": "1 bowl", "kcal": 186, "emoji": "🍲"},
                    {"id": 14, "name": "Roasted Chickpeas", "portion": "50g", "kcal": 180, "emoji": "🧆"},
                    {"id": 15, "name": "Baked Potato", "portion": "1 medium", "kcal": 161, "emoji": "🥔"},
                    {"id": 16, "name": "Boiled Shrimp", "portion": "100g", "kcal": 99, "emoji": "🍤"},
                    {"id": 17, "name": "Turkey Breast", "portion": "100g", "kcal": 135, "emoji": "🥩"},
                    {"id": 18, "name": "Couscous", "portion": "100g", "kcal": 112, "emoji": "🍚"}
                ]
            },
            "Vigorous": {
                "activities": [
                    {"id": 1, "name": "HIIT Training", "description": "High-intensity interval training for 25 minutes (Burpees, Mountain Climbers, Squat Jumps).", "image": "/images/activities/hiit-training.jpg", "youtube_url": "https://www.youtube.com/watch?v=npofZutKsfA"},
                    {"id": 2, "name": "Jump Rope", "description": "Jumping rope for 20 minutes continuously or with short intervals.", "image": "/images/activities/jump-rope.jpg", "youtube_url": "https://www.youtube.com/watch?v=drwHK8Xt-8w"},
                    {"id": 3, "name": "Sprint Intervals", "description": "30-second sprints alternating with a 1-minute walk, repeated 10 times.", "image": "/images/activities/sprint-intervals.jpg", "youtube_url": "https://www.youtube.com/watch?v=QLBT4-iN2yg"},
                    {"id": 4, "name": "Strength Training", "description": "Weight lifting (Dumbbell/Barbell) focusing on large muscle groups.", "image": "/images/activities/strength-training.jpg", "youtube_url": "https://www.youtube.com/watch?v=XxuRSjER3Qk"},
                    {"id": 5, "name": "Basic Crossfit", "description": "Intensive circuit training combining cardio and light weights.", "image": "/images/activities/basic-crossfit.jpg", "youtube_url": "https://www.youtube.com/watch?v=l0gDqsSUtWo"},
                    {"id": 6, "name": "Kickboxing", "description": "High-intensity cardio kickboxing for 40 minutes.", "image": "/images/activities/kickboxing.jpg", "youtube_url": "https://www.youtube.com/watch?v=S4F0gOhskY8"}
                ],
                "foods": [
                    {"id": 1, "name": "Chicken Breast", "portion": "150g", "kcal": 248, "emoji": "🍗"},
                    {"id": 2, "name": "Lean Beef", "portion": "150g", "kcal": 250, "emoji": "🥩"},
                    {"id": 3, "name": "Salmon", "portion": "150g", "kcal": 312, "emoji": "🍣"},
                    {"id": 4, "name": "Protein Shake", "portion": "1 glass", "kcal": 120, "emoji": "🥤"},
                    {"id": 5, "name": "Boiled Egg Whites", "portion": "4 pieces", "kcal": 68, "emoji": "🥚"},
                    {"id": 6, "name": "Greek Yogurt", "portion": "150g", "kcal": 88, "emoji": "🍶"},
                    {"id": 7, "name": "Oatmeal", "portion": "100g", "kcal": 389, "emoji": "🥣"},
                    {"id": 8, "name": "Roasted Asparagus", "portion": "100g", "kcal": 20, "emoji": "🎋"},
                    {"id": 9, "name": "Peanut Butter", "portion": "2 tbsp", "kcal": 188, "emoji": "🥜"},
                    {"id": 10, "name": "Cottage Cheese", "portion": "150g", "kcal": 147, "emoji": "🧀"},
                    {"id": 11, "name": "Tuna Salad", "portion": "200g", "kcal": 380, "emoji": "🥗"},
                    {"id": 12, "name": "Beef Jerky", "portion": "50g", "kcal": 205, "emoji": "🥩"},
                    {"id": 13, "name": "Protein Bar", "portion": "1 piece", "kcal": 220, "emoji": "🍫"},
                    {"id": 14, "name": "Sweet Potato Mash", "portion": "200g", "kcal": 172, "emoji": "🍠"},
                    {"id": 15, "name": "Mixed Nuts", "portion": "30g", "kcal": 180, "emoji": "🥜"},
                    {"id": 16, "name": "Sardines (in water)", "portion": "100g", "kcal": 148, "emoji": "🐟"},
                    {"id": 17, "name": "Whey Protein Isolate", "portion": "1 scoop", "kcal": 110, "emoji": "🥛"},
                    {"id": 18, "name": "Roasted Chicken Thigh", "portion": "150g", "kcal": 315, "emoji": "🍗"}
                ]
            }
        }

        pool = recommendation_rules.get(predicted_label, recommendation_rules["Moderate"])
        daily_activities = random.sample(pool["activities"], min(3, len(pool["activities"])))
        daily_foods = random.sample(pool["foods"], min(6, len(pool["foods"])))

        return {
            "activities": daily_activities,
            "foods": daily_foods
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
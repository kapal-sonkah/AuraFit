import streamlit as st
import pandas as pd
import plotly.express as px

# 1. Setup Halaman & Judul
st.set_page_config(page_title="SmartFit AI Dashboard", layout="wide")
st.title("🏃‍♂️ SmartFit: Re-kalibrasi BMI & Aktivitas")

# 2. Load Datasets
@st.cache_data
def load_all_data():
    master_df = pd.read_csv('master_smartfit_final.csv')
    nut_df = pd.read_csv('abbrev_cleaned.csv')
    choices_df = pd.read_csv('food_choices_cleaned.csv')
    return master_df, nut_df, choices_df

df, df_nut, df_choices = load_all_data()

# 3. Sidebar: Input User (Interaktif)
st.sidebar.header("Input Data Fisik Baru")
gender = st.sidebar.selectbox("Gender", ["Pria", "Wanita"])
weight = st.sidebar.number_input("Berat Badan (kg)", min_value=30.0, max_value=200.0, value=70.0)
height = st.sidebar.number_input("Tinggi Badan (cm)", min_value=100.0, max_value=250.0, value=170.0)

# 4. Logika Kalkulasi Real-time
height_m = height / 100
bmi = round(weight / (height_m ** 2), 2)

# Penentuan Kategori & Warna secara dinamis
if bmi < 18.5:
    status = "Underweight"
    color = "blue"
    rec_steps = "Fokus pada latihan beban (strength training) untuk massa otot."
    food_goal = "Surplus kalori dengan protein tinggi."
elif 18.5 <= bmi < 25:
    status = "Normal"
    color = "green"
    rec_steps = "Pertahankan gaya hidup aktif Anda! Target: 7.000 - 10.000 langkah per hari."
    food_goal = "Gizi seimbang untuk menjaga berat badan ideal."
else:
    status = "Overweight/Obese"
    color = "red"
    rec_steps = "Target: Minimal 10.000 langkah per hari & Defisit Kalori 500 kkal."
    food_goal = "Fokus pada makanan tinggi protein, serat, dan rendah gula/lemak."

# Tampilkan Status Utama
st.subheader(f"Hasil Analisis Real-time")
col_stat1, col_stat2 = st.columns(2)
col_stat1.metric("BMI Anda", bmi)
col_stat2.markdown(f"Status saat ini: <h2 style='color:{color}; margin-top:-15px;'>{status}</h2>", unsafe_allow_html=True)

st.write("---")

# 5. Dashboard Visualisasi & Rekomendasi Re-kalibrasi
col1, col2 = st.columns(2)

with col1:
    st.write("### 📍 Posisi Anda dalam Populasi")
    fig = px.scatter(df, x='bmi', y='TotalSteps', color='Recommendation_Label',
                     title="Distribusi BMI vs Aktivitas User Lain",
                     labels={'bmi': 'Indeks Massa Tubuh', 'TotalSteps': 'Langkah Harian'})
    
    # Tambahkan titik user saat ini
    fig.add_scatter(x=[bmi], y=[5000], mode='markers', name='Anda (Estimasi)',
                    marker=dict(size=18, color='black', symbol='star', line=dict(width=2, color='white')))
    st.plotly_chart(fig, use_container_width=True)

with col2:
    st.write("### 🎯 Target Re-kalibrasi")
    st.info(f"**Saran Aktivitas:**  \n{rec_steps}")
    
    if status == "Overweight/Obese":
        st.warning(f"Untuk mencapai BMI Normal (24.9), Anda perlu menurunkan berat badan sekitar **{round(weight - (24.9 * (height_m**2)), 1)} kg**.")
    elif status == "Underweight":
        st.warning(f"Untuk mencapai BMI Normal (18.5), Anda perlu meningkatkan berat badan sekitar **{round((18.5 * (height_m**2)) - weight, 1)} kg**.")
    else:
        st.success("Berat badan Anda sudah ideal. Fokuslah pada komposisi tubuh yang sehat.")

# 6. Integrasi Dataset Nutrisi & Preferensi
st.write("---")
st.write("### 🥗 Rekomendasi Menu Cerdas SmartFit")
st.caption(f"Target Nutrisi: {food_goal}")

# Logika pengambilan saran makanan berdasarkan preferensi masakan favorit dari dataset
# Kita ambil sample cuisine favorit untuk simulasi personalisasi
fav_cuisine = df_choices['fav_cuisine'].dropna().sample(1).iloc[0].capitalize()
st.write(f"Berdasarkan profil selera komunitas (**{fav_cuisine}**), berikut menu yang disarankan untuk Anda:")

# Filter makanan: Jika overweight cari yang < 250 kalori, jika normal/underweight cari yang bergizi
if status == "Overweight/Obese":
    diet_recommend = df_nut[df_nut['calories'] < 250].sample(3)
else:
    diet_recommend = df_nut.sample(3)

col_food1, col_food2, col_food3 = st.columns(3)
foods = [col_food1, col_food2, col_food3]

for i, col_f in enumerate(foods):
    row = diet_recommend.iloc[i]
    with col_f:
        st.success(f"**{row['food_name']}**")
        st.write(f"🔥 {row['calories']} kkal")
        st.write(f"🥩 Protein: {row['protein']}g")
        st.write(f"🍞 Karbo: {row['carbs']}g")
import { getAccessToken } from './network-data';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function authHeader() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAccessToken()}`,
  };
}

export async function loadProgress() {
  try {
    const res = await fetch(`${BASE_URL}/today`, { headers: authHeader() });
    const json = await res.json();
    if (json.status !== 'success') return { completedActivityIds: [], consumedFoodIds: [], streak: 0 };
    return json.data;
  } catch {
    return { completedActivityIds: [], consumedFoodIds: [], streak: 0 };
  }
}

export async function saveActivityProgress(activityId, completed) {
  try {
    console.log('Saving activity progress:', { activityId, completed });

    const res = await fetch(`${BASE_URL}/activity`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify({ activity_id: activityId, completed }),
    });
    const json = await res.json();
    return json.data?.streak ?? null;
  } catch {
    return null;
  }
}

export async function saveFoodProgress(foodId, consumed) {
  try {
    const res = await fetch(`${BASE_URL}/food`, {
      method: 'POST',
      headers: authHeader(),
      body: JSON.stringify({ food_id: foodId, consumed }),
    });

    const json = await res.json();
    return json.data?.streak ?? null;
  } catch {
    console.error('Failed to save food progress');
    return null;
  }
}
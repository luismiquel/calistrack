import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "calistrack_v4";

const EXERCISES = [
  { id: 1, name: "Flexiones inclinadas", level: "basico", category: "empuje", muscle: "Pecho", sets: 3, reps: "12", rest: "60 s", description: "Inicio básico", howTo: ["Manos elevadas", "Cuerpo recto", "Baja controlado", "Empuja"] },
  { id: 2, name: "Remo australiano", level: "basico", category: "tiron", muscle: "Espalda", sets: 4, reps: "8", rest: "75 s", description: "Base de tirón", howTo: ["Cuerpo recto", "Tira al pecho", "Controla bajada"] },
  { id: 3, name: "Sentadillas", level: "basico", category: "pierna", muscle: "Pierna", sets: 4, reps: "15", rest: "60 s", description: "Pierna básica", howTo: ["Espalda recta", "Baja profundo", "Sube fuerte"] },
  { id: 4, name: "Plancha", level: "basico", category: "core", muscle: "Core", sets: 3, reps: "30 s", rest: "45 s", description: "Core", howTo: ["Cuerpo recto", "Aprieta abdomen"] },

  { id: 5, name: "Burpees", level: "medio", category: "fullbody", muscle: "Todo", sets: 4, reps: "15", rest: "60 s", description: "Militar", howTo: ["Baja", "Extiende", "Salta"] },
];

function buildWorkout() {
  return EXERCISES.slice(0, 4).map((e, i) => ({
    id: i,
    name: e.name,
    done: false,
  }));
}

const DEFAULT_STATE = {
  theme: "light",
  name: "",
  workout: buildWorkout(),
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

export default function App() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  function toggleTheme() {
    setState((p) => ({
      ...p,
      theme: p.theme === "light" ? "dark" : "light",
    }));
  }

  function toggleExercise(id) {
    setState((p) => ({
      ...p,
      workout: p.workout.map((w) =>
        w.id === id ? { ...w, done: !w.done } : w
      ),
    }));
  }

  const dark = state.theme === "dark";

  if (!ready) return <div>Cargando...</div>;

  return (
    <div style={dark ? styles.darkPage : styles.page}>
      <h1>CalisTrack</h1>

      <button onClick={toggleTheme} style={styles.button}>
        {dark ? "Modo blanco" : "Modo negro"}
      </button>

      <input
        placeholder="Tu nombre"
        value={state.name}
        onChange={(e) =>
          setState((p) => ({ ...p, name: e.target.value }))
        }
        style={styles.input}
      />

      <h2>Entrenamiento</h2>

      {state.workout.map((w) => (
        <div key={w.id} style={dark ? styles.cardDark : styles.card}>
          <b>{w.name}</b>
          <button onClick={() => toggleExercise(w.id)} style={styles.button}>
            {w.done ? "Hecho" : "Marcar"}
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  page: {
    background: "#ffffff",
    color: "#000000",
    minHeight: "100vh",
    padding: 20,
  },
  darkPage: {
    background: "#000000",
    color: "#ffffff",
    minHeight: "100vh",
    padding: 20,
  },
  card: {
    border: "1px solid #ccc",
    padding: 10,
    margin: 10,
  },
  cardDark: {
    border: "1px solid #444",
    padding: 10,
    margin: 10,
  },
  button: {
    margin: 5,
    padding: 10,
    cursor: "pointer",
  },
  input: {
    padding: 10,
    margin: 10,
    width: "100%",
  },
};
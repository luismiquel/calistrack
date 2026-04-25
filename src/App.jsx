import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "calistrack_v10";
const TRAINING_MODES = ["calistenia", "militar", "mixto"];
const LEVELS = ["Básico", "Medio", "Experto"];

function calculateUserLevel(xp) {
  if (xp >= 1000) return "Experto";
  if (xp >= 400) return "Medio";
  return "Básico";
}

function calculateWorkoutXP(adherence) {
  if (adherence >= 90) return 120;
  if (adherence >= 75) return 90;
  if (adherence >= 50) return 60;
  if (adherence > 0) return 30;
  return 0;
}

function getXPProgress(xp) {
  if (xp >= 1000) {
    return { currentLevel: "Experto", nextLevel: "Máximo", percent: 100, remaining: 0 };
  }

  if (xp >= 400) {
    const percent = Math.round(((xp - 400) / 600) * 100);
    return { currentLevel: "Medio", nextLevel: "Experto", percent, remaining: 1000 - xp };
  }

  const percent = Math.round((xp / 400) * 100);
  return { currentLevel: "Básico", nextLevel: "Medio", percent, remaining: 400 - xp };
}

const EXERCISES = [
  {
    id: 1,
    name: "Flexiones inclinadas",
    level: "Básico",
    category: "empuje",
    muscle: "Pecho / Triceps",
    sets: 3,
    reps: "12",
    rest: 60,
    mode: "calistenia",
    description: "Perfectas para empezar con buena tecnica.",
    howTo: [
      "Apoya las manos en una superficie elevada.",
      "MantÃ©n el cuerpo recto de hombros a tobillos.",
      "Baja el pecho controlando el movimiento.",
      "Empuja hasta volver arriba sin arquear la espalda.",
    ],
  },
  {
    id: 2,
    name: "Flexiones clasicas",
    level: "Básico",
    category: "empuje",
    muscle: "Pecho / Hombro / Triceps",
    sets: 4,
    reps: "10",
    rest: 75,
    mode: "calistenia",
    description: "Base de fuerza del tren superior.",
    howTo: [
      "Coloca las manos un poco mÃ¡s abiertas que los hombros.",
      "Aprieta abdomen y glÃºteos para mantener el cuerpo recto.",
      "Desciende hasta que el pecho se acerque al suelo.",
      "Empuja fuerte hasta extender los brazos.",
    ],
  },
  {
    id: 3,
    name: "Remo australiano",
    level: "Básico",
    category: "tiron",
    muscle: "Espalda / Biceps",
    sets: 4,
    reps: "8",
    rest: 75,
    mode: "calistenia",
    description: "Progresion ideal antes de dominadas estrictas.",
    howTo: [
      "Agarra la barra con el cuerpo por debajo.",
      "MantÃ©n talones apoyados y cuerpo en lÃ­nea recta.",
      "Tira del pecho hacia la barra juntando escÃ¡pulas.",
      "Baja de forma lenta y controlada.",
    ],
  },
  {
    id: 4,
    name: "Dominadas asistidas",
    level: "Básico",
    category: "tiron",
    muscle: "Espalda / Biceps",
    sets: 4,
    reps: "6",
    rest: 90,
    mode: "calistenia",
    description: "Trabajo vertical de tiron para principiantes.",
    howTo: [
      "Usa banda o apoyo para reducir carga.",
      "Agarra la barra con firmeza y activa hombros.",
      "Sube llevando el pecho hacia la barra.",
      "Desciende despacio hasta extensiÃ³n casi completa.",
    ],
  },
  {
    id: 5,
    name: "Sentadillas al aire",
    level: "Básico",
    category: "pierna",
    muscle: "Cuadriceps / Gluteos",
    sets: 4,
    reps: "15",
    rest: 60,
    mode: "calistenia",
    description: "Ejercicio esencial de tren inferior.",
    howTo: [
      "Coloca los pies al ancho de hombros.",
      "Empuja la cadera hacia atrÃ¡s al bajar.",
      "MantÃ©n el pecho arriba y talones en el suelo.",
      "Sube extendiendo rodillas y cadera.",
    ],
  },
  {
    id: 6,
    name: "Plancha frontal",
    level: "Básico",
    category: "core",
    muscle: "Abdomen / Lumbar",
    sets: 3,
    reps: "30 s",
    rest: 45,
    mode: "calistenia",
    description: "Estabilidad basica del core.",
    howTo: [
      "Apoya antebrazos y puntas de los pies.",
      "MantÃ©n hombros alineados con codos.",
      "Aprieta abdomen y glÃºteos.",
      "Evita hundir o elevar demasiado la cadera.",
    ],
  },
  {
    id: 7,
    name: "Fondos en banco",
    level: "medio",
    category: "empuje",
    muscle: "Triceps / Pecho",
    sets: 4,
    reps: "10",
    rest: 75,
    mode: "calistenia",
    description: "Paso intermedio hacia fondos en paralelas.",
    howTo: [
      "Apoya las manos en el borde del banco.",
      "Extiende las piernas hacia delante.",
      "Baja flexionando codos cerca del cuerpo.",
      "Empuja hasta volver a la posiciÃ³n inicial.",
    ],
  },
  {
    id: 8,
    name: "Fondos en paralelas",
    level: "medio",
    category: "empuje",
    muscle: "Pecho / Hombro / Triceps",
    sets: 4,
    reps: "8",
    rest: 90,
    mode: "calistenia",
    description: "Gran ejercicio de empuje en calistenia.",
    howTo: [
      "Sujeta las paralelas con brazos extendidos.",
      "Inclina ligeramente el torso hacia delante.",
      "Baja hasta sentir buen rango sin perder control.",
      "Empuja fuerte hasta bloqueo estable.",
    ],
  },
  {
    id: 9,
    name: "Dominadas estrictas",
    level: "medio",
    category: "tiron",
    muscle: "Espalda / Biceps",
    sets: 5,
    reps: "5",
    rest: 120,
    mode: "calistenia",
    description: "Fuerza real del tren superior.",
    howTo: [
      "Cuelga con agarre firme y hombros activos.",
      "Inicia el tirÃ³n desde la espalda, no solo con brazos.",
      "Lleva el pecho hacia la barra.",
      "Baja controlando sin balancearte.",
    ],
  },
  {
    id: 10,
    name: "Elevaciones de rodillas",
    level: "medio",
    category: "core",
    muscle: "Abdomen / Cadera",
    sets: 4,
    reps: "12",
    rest: 60,
    mode: "calistenia",
    description: "Paso previo para L-sit.",
    howTo: [
      "Cuelga de una barra o apÃ³yate en paralelas.",
      "Sube las rodillas hacia el pecho.",
      "Evita impulsarte con balanceo.",
      "Baja despacio manteniendo el abdomen activo.",
    ],
  },
  {
    id: 11,
    name: "Zancadas alternas",
    level: "medio",
    category: "pierna",
    muscle: "Pierna unilateral",
    sets: 4,
    reps: "12 por lado",
    rest: 60,
    mode: "calistenia",
    description: "Control y estabilidad de pierna.",
    howTo: [
      "Da un paso largo hacia delante.",
      "Baja ambas rodillas controladamente.",
      "MantÃ©n torso erguido y abdomen firme.",
      "Empuja con la pierna delantera para volver.",
    ],
  },
  {
    id: 12,
    name: "L-sit tuck",
    level: "medio",
    category: "core",
    muscle: "Abdomen / Flexores de cadera",
    sets: 5,
    reps: "15 s",
    rest: 60,
    mode: "calistenia",
    description: "Progresion intermedia de compresion.",
    howTo: [
      "ApÃ³yate en paralelas o bloques.",
      "Eleva el cuerpo con hombros deprimidos.",
      "Lleva rodillas al pecho manteniendo pies fuera del suelo.",
      "SostÃ©n sin redondear demasiado la espalda.",
    ],
  },
  {
    id: 13,
    name: "Flexiones declinadas",
    level: "experto",
    category: "empuje",
    muscle: "Pecho superior / Hombro",
    sets: 5,
    reps: "12",
    rest: 90,
    mode: "calistenia",
    description: "Mayor intensidad de empuje horizontal.",
    howTo: [
      "Apoya los pies en una superficie elevada.",
      "Coloca las manos firmes en el suelo.",
      "Baja controlando el pecho hacia el suelo.",
      "Empuja sin perder alineaciÃ³n corporal.",
    ],
  },
  {
    id: 14,
    name: "Pike push-ups",
    level: "experto",
    category: "empuje",
    muscle: "Hombro / Triceps",
    sets: 5,
    reps: "8",
    rest: 90,
    mode: "calistenia",
    description: "Excelente base para handstand push-up.",
    howTo: [
      "Coloca cadera alta formando una V invertida.",
      "Baja la cabeza entre las manos.",
      "MantÃ©n codos orientados hacia atrÃ¡s.",
      "Empuja hacia arriba llevando carga a hombros.",
    ],
  },
  {
    id: 15,
    name: "Pistol squat asistida",
    level: "experto",
    category: "pierna",
    muscle: "Pierna unilateral / Gluteos",
    sets: 4,
    reps: "6 por lado",
    rest: 90,
    mode: "calistenia",
    description: "Fuerza, equilibrio y movilidad.",
    howTo: [
      "SujÃ©tate a un apoyo ligero.",
      "Extiende una pierna al frente.",
      "Baja sobre la pierna de apoyo sin perder equilibrio.",
      "Sube empujando fuerte con el pie apoyado.",
    ],
  },
  {
    id: 16,
    name: "L-sit completo",
    level: "experto",
    category: "core",
    muscle: "Abdomen / Compresion",
    sets: 5,
    reps: "20 s",
    rest: 75,
    mode: "calistenia",
    description: "Trabajo isometrico avanzado.",
    howTo: [
      "Empuja fuerte contra las paralelas.",
      "Eleva ambas piernas rectas al frente.",
      "MantÃ©n rodillas extendidas y abdomen firme.",
      "SostÃ©n sin dejar caer la cadera.",
    ],
  },
  {
    id: 17,
    name: "Dominadas explosivas",
    level: "experto",
    category: "tiron",
    muscle: "Espalda / Potencia",
    sets: 5,
    reps: "4",
    rest: 120,
    mode: "calistenia",
    description: "Muy utiles para progresion a muscle-up.",
    howTo: [
      "Inicia desde colgado estable.",
      "Tira con mÃ¡xima velocidad y potencia.",
      "Busca que el pecho suba lo mÃ¡s alto posible.",
      "Baja con control para repetir limpio.",
    ],
  },
  {
    id: 18,
    name: "Dragon flag progresion",
    level: "experto",
    category: "core",
    muscle: "Core completo",
    sets: 4,
    reps: "5",
    rest: 90,
    mode: "calistenia",
    description: "Trabajo avanzado de anti-extension.",
    howTo: [
      "Apoya hombros en banco y sujeta un punto firme.",
      "Eleva el cuerpo en bloque.",
      "Desciende lentamente sin doblarte por la cadera.",
      "Vuelve arriba manteniendo tensiÃ³n abdominal.",
    ],
  },
  {
    id: 19,
    name: "Burpees",
    level: "medio",
    category: "fullbody",
    muscle: "Cuerpo completo",
    sets: 4,
    reps: "15",
    rest: 60,
    mode: "militar",
    description: "Ejercicio militar clasico de resistencia y potencia.",
    howTo: [
      "Desde pie, baja las manos al suelo.",
      "Lleva los pies atrÃ¡s a posiciÃ³n de plancha.",
      "Vuelve con los pies hacia delante.",
      "Salta extendiendo el cuerpo arriba.",
    ],
  },
  {
    id: 20,
    name: "Flexiones diamante",
    level: "medio",
    category: "empuje",
    muscle: "Triceps",
    sets: 4,
    reps: "12",
    rest: 60,
    mode: "militar",
    description: "Muy usadas en entrenamiento militar para fuerza de triceps.",
    howTo: [
      "Junta las manos formando un diamante.",
      "MantÃ©n codos cerca del cuerpo.",
      "Baja controlando el pecho hacia las manos.",
      "Empuja fuerte hasta extensiÃ³n completa.",
    ],
  },
  {
    id: 21,
    name: "Sprint en sitio",
    level: "Básico",
    category: "cardio",
    muscle: "Pierna / Resistencia",
    sets: 5,
    reps: "30 s",
    rest: 30,
    mode: "militar",
    description: "Trabajo cardiovascular tipo militar.",
    howTo: [
      "Corre en el mismo sitio a mÃ¡xima intensidad.",
      "Eleva rodillas de forma activa.",
      "Mueve brazos con ritmo rÃ¡pido.",
      "MantÃ©n el tronco estable y respiraciÃ³n viva.",
    ],
  },
  {
    id: 22,
    name: "Mountain climbers",
    level: "medio",
    category: "core",
    muscle: "Core / Cardio",
    sets: 4,
    reps: "40 s",
    rest: 30,
    mode: "militar",
    description: "Alta intensidad usada en entrenamiento funcional militar.",
    howTo: [
      "ColÃ³cate en plancha alta.",
      "Lleva una rodilla al pecho y alterna rÃ¡pido.",
      "MantÃ©n hombros sobre las manos.",
      "Evita mover demasiado la cadera.",
    ],
  },
  {
    id: 23,
    name: "Salto con rodillas al pecho",
    level: "experto",
    category: "pierna",
    muscle: "Explosividad",
    sets: 4,
    reps: "12",
    rest: 60,
    mode: "militar",
    description: "Trabajo explosivo tipo entrenamiento de combate.",
    howTo: [
      "Parte de pie con rodillas ligeramente flexionadas.",
      "Salta lo mÃ¡s vertical posible.",
      "Lleva rodillas hacia el pecho en el aire.",
      "Aterriza suave y repite con control.",
    ],
  },
  {
    id: 24,
    name: "Plancha con desplazamiento",
    level: "experto",
    category: "core",
    muscle: "Core completo",
    sets: 4,
    reps: "30 s",
    rest: 45,
    mode: "militar",
    description: "Simula desplazamientos militares en el suelo.",
    howTo: [
      "Adopta posiciÃ³n de plancha baja.",
      "DesplÃ¡zate lateral o frontal manteniendo tensiÃ³n.",
      "MantÃ©n abdomen fuerte y cadera estable.",
      "Respira sin perder la postura.",
    ],
  },
];

const WEEK_DAYS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

const PLANS = {
  Básico: {
    name: "Plan básico",
    goal: "Crear base de fuerza y técnica",
    frequency: "3 días por semana",
    sessions: [
      { name: "Flexiones inclinadas", prescription: "3 x 12", rest: 60 },
      { name: "Remo australiano", prescription: "4 x 8", rest: 75 },
      { name: "Sentadillas al aire", prescription: "4 x 15", rest: 60 },
      { name: "Plancha frontal", prescription: "3 x 30 s", rest: 45 },
    ],
  },
  medio: {
    name: "Plan medio",
    goal: "Subir fuerza y control corporal",
    frequency: "4 días por semana",
    sessions: [
      { name: "Flexiones clasicas", prescription: "4 x 10", rest: 75 },
      { name: "Fondos en paralelas", prescription: "4 x 8", rest: 90 },
      { name: "Dominadas estrictas", prescription: "5 x 5", rest: 120 },
      { name: "Elevaciones de rodillas", prescription: "4 x 12", rest: 60 },
    ],
  },
  experto: {
    name: "Plan experto",
    goal: "Desarrollar fuerza avanzada y progresiones complejas",
    frequency: "5 días por semana",
    sessions: [
      { name: "Pike push-ups", prescription: "5 x 8", rest: 90 },
      { name: "Dominadas explosivas", prescription: "5 x 4", rest: 120 },
      { name: "Pistol squat asistida", prescription: "4 x 6 por lado", rest: 90 },
      { name: "L-sit completo", prescription: "5 x 20 s", rest: 75 },
    ],
  },
};

function levelKeyFromUser(level) {
  const normalized = String(level || "").toLowerCase();
  if (normalized === "medio") return "medio";
  if (normalized === "experto") return "experto";
  return "Básico";
}

function buildWorkoutLog(planKey) {
  return PLANS[planKey].sessions.map((session, index) => ({
    id: index + 1,
    ...session,
    done: false,
  }));
}

function buildAutoWorkout(mode, userLevel) {
  const levelKey = levelKeyFromUser(userLevel);
  const candidates = EXERCISES.filter((exercise) => {
    const matchesLevel = exercise.level === levelKey;
    const matchesMode = mode === "mixto" ? true : exercise.mode === mode;
    return matchesLevel && matchesMode;
  });

  const fallback = EXERCISES.filter((exercise) => {
    const matchesMode = mode === "mixto" ? true : exercise.mode === mode;
    return matchesMode;
  });

  const source = candidates.length >= 4 ? candidates : fallback;

  return source.slice(0, 4).map((exercise, index) => ({
    id: index + 1,
    name: exercise.name,
    prescription: `${exercise.sets} x ${exercise.reps}`,
    rest: exercise.rest,
    done: false,
  }));
}

const DEFAULT_STATE = {
  theme: "light",
  activeTab: "inicio",
  selectedPlan: "basico",
  search: "",
  levelFilter: "todos",
  categoryFilter: "todas",
  modeFilter: "mixto",
  completedDays: [true, false, false, true, false, false, false],
  workoutLog: buildWorkoutLog("Básico"),
  history: [],
  userStats: {
    isPro: false,
    streak: 2,
    workouts: 6,
    progress: 35,
    objective: "Escribe tu objetivo",
    name: "",
    level: "Básico",
    xp: 0,
    autoLevel: true,
  },
};

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      selectedPlan: PLANS[parsed.selectedPlan] ? parsed.selectedPlan : "basico",
      userStats: {
    isPro: false, ...DEFAULT_STATE.userStats, ...(parsed.userStats || {}) },
      completedDays: Array.isArray(parsed.completedDays) ? parsed.completedDays.slice(0, 7) : DEFAULT_STATE.completedDays,
      workoutLog: Array.isArray(parsed.workoutLog) && parsed.workoutLog.length ? parsed.workoutLog : DEFAULT_STATE.workoutLog,
      history: Array.isArray(parsed.history) ? parsed.history : DEFAULT_STATE.history,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function calculateAdherence(workoutLog) {
  if (!Array.isArray(workoutLog) || workoutLog.length === 0) return 0;
  const done = workoutLog.filter((item) => item.done).length;
  return Math.round((done / workoutLog.length) * 100);
}

function getDifficultyTag(exerciseLevel, userLevel) {
  const rank = { basico: 1, medio: 2, experto: 3 };
  const user = rank[levelKeyFromUser(userLevel)] || 1;
  const ex = rank[exerciseLevel] || 1;

  if (ex > user) return "Avanzado para ti";
  if (ex < user) return "Fácil";
  return "Adecuado";
}

function filterExercises(list, search, levelFilter, categoryFilter, modeFilter) {
  return list.filter((exercise) => {
    const haystack = `${exercise.name} ${exercise.category} ${exercise.muscle} ${exercise.mode}`.toLowerCase();
    const matchesSearch = haystack.includes(String(search || "").toLowerCase());
    const matchesLevel = levelFilter === "todos" || exercise.level === levelFilter;
    const matchesCategory = categoryFilter === "todas" || exercise.category === categoryFilter;
    const matchesMode = modeFilter === "mixto" || exercise.mode === modeFilter;
    return matchesSearch && matchesLevel && matchesCategory && matchesMode;
  });
}

function runTests() {
  console.assert(buildWorkoutLog("Básico").length === 4, "El Plan básico debe tener 4 ejercicios");
  console.assert(calculateAdherence([{ done: true }, { done: false }, { done: true }, { done: true }]) === 75, "La adherencia debe ser 75");
  console.assert(filterExercises(EXERCISES, "dominadas", "todos", "todas", "mixto").length >= 3, "Debe encontrar ejercicios de dominadas");
  console.assert(filterExercises(EXERCISES, "", "todos", "todas", "militar").every((item) => item.mode === "militar"), "Debe filtrar por modo");
  console.assert(buildAutoWorkout("militar", "Básico").every((item) => typeof item.name === "string"), "Debe crear rutina automÃ¡tica");
}

runTests();

function StatCard({ label, value }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick} style={{ ...styles.chip, ...(active ? styles.chipActive : {}) }}>
      {children}
    </button>
  );
}

function Badge({ children, active = false }) {
  return <span style={{ ...styles.badge, ...(active ? styles.badgeActive : {}) }}>{children}</span>;
}

export default function App() {
  const [state, setState] = useState(DEFAULT_STATE);
  const [ready, setReady] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [activeRestId, setActiveRestId] = useState(null);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveState(state);
  }, [state, ready]);

  useEffect(() => {
    if (restTimer <= 0) {
      setActiveRestId(null);
      return;
    }

    const interval = setInterval(() => {
      setRestTimer((current) => current - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [restTimer]);

  const currentPlan = PLANS[state.selectedPlan] || PLANS.basico || Object.values(PLANS)[0];
  const completedCount = state.completedDays.filter(Boolean).length;
  const adherence = calculateAdherence(state.workoutLog);
  const xpProgress = getXPProgress(state.userStats.xp || 0);

  const filteredExercises = useMemo(() => {
    return filterExercises(EXERCISES, state.search, state.levelFilter, state.categoryFilter, state.modeFilter);
  }, [state.search, state.levelFilter, state.categoryFilter, state.modeFilter]);

  function updateField(field, value) {
    setState((prev) => ({ ...prev, [field]: value }));
  }

  function updateUser(field, value) {
    setState((prev) => ({
      ...prev,
      userStats: {
    isPro: false, ...prev.userStats, [field]: value },
    }));
  }

  function toggleTheme() {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === "dark" ? "light" : "dark",
    }));
  }

  function selectPlan(planKey) {
    setState((prev) => ({
      ...prev,
      selectedPlan: planKey,
      workoutLog: buildWorkoutLog(planKey),
      userStats: {
    isPro: false,
        ...prev.userStats,
        level: planKey === "Básico" ? "Básico" : planKey === "medio" ? "Medio" : "Experto",
        progress: planKey === "Básico" ? 35 : planKey === "medio" ? 68 : 82,
      },
    }));
  }

  function trainNow() {
    setState((prev) => ({
      ...prev,
      activeTab: "inicio",
      workoutLog: buildAutoWorkout(prev.modeFilter, prev.userStats.level),
      userStats: {
    isPro: false,
        ...prev.userStats,
        progress: Math.min(100, prev.userStats.progress + 3),
      },
    }));
    setRestTimer(0);
    setActiveRestId(null);
  }

  function generateAutomaticRoutine() {
    if (!state.userStats.isPro) {
      alert("Funcion PRO. Desbloquea para usar rutinas automaticas ilimitadas.");
      return;
    }
    setState((prev) => ({
      ...prev,
      workoutLog: buildAutoWorkout(prev.modeFilter, prev.userStats.level),
      userStats: {
    isPro: false,
        ...prev.userStats,
        progress: Math.min(100, prev.userStats.progress + 5),
      },
    }));
  }

  function toggleWorkout(id) {
    setState((prev) => {
      const workoutLog = prev.workoutLog.map((item) => (item.id === id ? { ...item, done: !item.done } : item));
      const doneCount = workoutLog.filter((item) => item.done).length;
      return {
        ...prev,
        workoutLog,
        userStats: {
    isPro: false,
          ...prev.userStats,
          workouts: prev.userStats.workouts + 1,
          progress: Math.min(100, 20 + doneCount * 15),
        },
      };
    });
  }

  function startRest(seconds, id) {
    setRestTimer(Number(seconds) || 0);
    setActiveRestId(id);
  }

  function stopRest() {
    setRestTimer(0);
    setActiveRestId(null);
  }

  function toggleDay(index) {
    setState((prev) => {
      const nextValue = !prev.completedDays[index];
      const completedDays = prev.completedDays.map((item, i) => (i === index ? nextValue : item));
      return {
        ...prev,
        completedDays,
        userStats: {
    isPro: false,
          ...prev.userStats,
          streak: nextValue ? prev.userStats.streak + 1 : Math.max(0, prev.userStats.streak - 1),
        },
      };
    });
  }

  function saveWorkoutToHistory() {
    setState((prev) => {
      const completed = prev.workoutLog.filter((item) => item.done).length;
      const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        completed,
        total: prev.workoutLog.length,
        adherence: calculateAdherence(prev.workoutLog),
        mode: prev.modeFilter,
        level: prev.userStats.level,
      };

      return {
        ...prev,
        history: [
          newEntry,
          ...(prev.userStats.isPro ? (prev.history || []) : (prev.history || []).slice(0, 2)),
        ].slice(0, 20),
      };
    });
  }

  function finishWorkout() {
    setState((prev) => {
      const completed = prev.workoutLog.filter((item) => item.done).length;
      const adherenceValue = calculateAdherence(prev.workoutLog);
      let gainedXP = calculateWorkoutXP(adherenceValue);

// bonus por dificultad
const difficultyBonus = state.workoutLog.length > 0 ? 20 : 0;
gainedXP += difficultyBonus;
      const nextXP = (prev.userStats.xp || 0) + gainedXP;
      const nextLevel = prev.userStats.autoLevel ? calculateUserLevel(nextXP) : prev.userStats.level;

      const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        completed,
        total: prev.workoutLog.length,
        adherence: adherenceValue,
        mode: prev.modeFilter,
        level: nextLevel,
        xp: gainedXP,
      };

      return {
        ...prev,
        workoutLog: prev.workoutLog.map((item) => ({ ...item, done: false })),
        history: [
          newEntry,
          ...(prev.userStats.isPro ? (prev.history || []) : (prev.history || []).slice(0, 2)),
        ].slice(0, 20),
        userStats: {
    isPro: false,
          ...prev.userStats,
          workouts: prev.userStats.workouts + 1,
          xp: nextXP,
          level: nextLevel,
          progress: Math.min(100, Math.round((nextXP % 400) / 4)),
          streak: adherenceValue > 0 ? prev.userStats.streak + 1 : prev.userStats.streak,
        },
      };
    });
    setRestTimer(0);
    setActiveRestId(null);
  }

  function togglePro() {
    setState((prev) => ({
      ...prev,
      userStats: {
        ...prev.userStats,
        isPro: !prev.userStats.isPro,
      },
    }));
  }

  function toggleAutoLevel() {
    setState((prev) => ({
      ...prev,
      userStats: {
    isPro: false,
        ...prev.userStats,
        autoLevel: !prev.userStats.autoLevel,
      },
    }));
  }

  function resetApp() {
    window.localStorage.removeItem(STORAGE_KEY);
    setState(DEFAULT_STATE);
    setRestTimer(0);
    setActiveRestId(null);
  }

  if (!ready) {
    return <div style={styles.loading}>Cargando app...</div>;
  }

  const isDark = state.theme === "dark";
  const themeStyles = isDark ? darkTheme : lightTheme;

  return (
    <div style={{ ...styles.page, ...themeStyles.page }}>
      <div style={{ ...styles.phoneFrame, ...themeStyles.phoneFrame }}>
        <div style={{ ...styles.header, ...themeStyles.header }}>
          <div>
            <div style={{ ...styles.brand, ...themeStyles.textStrong }}>CalisTrack</div>
            <div style={{ ...styles.subtitle, ...themeStyles.textMuted }}>Entrenador personal de calistenia y preparación militar.</div>
          </div>
          <div style={styles.headerButtons}>
            <button type="button" onClick={toggleTheme} style={{ ...styles.secondaryButton, ...themeStyles.secondaryButton }}>
              {isDark ? "Modo blanco" : "Modo negro"}
            </button>
            <button type="button" onClick={resetApp} style={{ ...styles.secondaryButton, ...themeStyles.secondaryButton }}>Reiniciar</button>
          </div>
        </div>

        <div style={styles.profileGrid}>
          <div style={styles.profileField}>
            <label htmlFor="user-name" style={styles.fieldLabel}>Tu nombre</label>
            <input id="user-name" type="text" value={state.userStats.name} onChange={(e) => updateUser("name", e.target.value)} placeholder="Escribe tu nombre" style={{ ...styles.input, ...themeStyles.input }} />
          </div>
          <div style={styles.profileField}>
            <label htmlFor="user-objective" style={styles.fieldLabel}>Tu objetivo</label>
            <input id="user-objective" type="text" value={state.userStats.objective} onChange={(e) => updateUser("objective", e.target.value)} placeholder="Ejemplo: 10 dominadas limpias" style={{ ...styles.input, ...themeStyles.input }} />
          </div>
          <div style={styles.profileField}>
            <label htmlFor="user-level" style={styles.fieldLabel}>Nivel</label>
            <select id="user-level" value={state.userStats.level} onChange={(e) => updateUser("level", e.target.value)} style={{ ...styles.input, ...themeStyles.input }}>
              {LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
            </select>
          </div>
          <div style={styles.profileField}>
            <label htmlFor="mode-filter" style={styles.fieldLabel}>Modo de entrenamiento</label>
            <select id="mode-filter" value={state.modeFilter} onChange={(e) => updateField("modeFilter", e.target.value)} style={{ ...styles.input, ...themeStyles.input }}>
              {TRAINING_MODES.map((mode) => <option key={mode} value={mode}>{mode}</option>)}
            </select>
          </div>
        </div>

        <div style={styles.content}>
          {state.activeTab === "inicio" && (
            <>
              <div style={styles.statsGrid}>
                <StatCard label="Racha" value={`${state.userStats.streak} días`} />
                <StatCard label="Entrenos" value={state.userStats.workouts} />
                <StatCard label="Progreso" value={`${state.userStats.progress}%`} />
                <StatCard label="XP" value={state.userStats.xp || 0} />
                <StatCard label="Semana" value={`${completedCount}/7`} />
              </div>

              <button type="button" onClick={trainNow} style={{ ...styles.heroButton, ...themeStyles.primaryButton }}>
                Entrenar ahora
              </button>

              {restTimer > 0 && (
                <div style={{ ...styles.timerBox, ...themeStyles.timerBox }}>
                  <div style={styles.timerTitle}>Descanso activo</div>
                  <div style={styles.timerValue}>{restTimer}s</div>
                  <button type="button" onClick={stopRest} style={{ ...styles.stopRestButton, ...themeStyles.stopRestButton }}>Parar</button>
                </div>
              )}

              <div style={{ ...styles.card, ...themeStyles.card }}>
                <div style={styles.rowBetween}>
                  <div>
                    <div style={styles.cardTitle}>Entrenamiento de hoy{state.userStats.name ? `, ${state.userStats.name}` : ""}</div>
                    <div style={styles.cardHint}>{currentPlan.name} - {currentPlan.frequency}</div>
                  </div>
                  
                </div>
                <div style={styles.stackMd}>
                  {state.workoutLog.map((item) => (
                    <div key={item.id} style={{ ...styles.listRow, ...themeStyles.listRow }}>
                      <div style={{ flex: 1 }}>
                        <div style={styles.rowTitle}>{item.name}</div>
                        <div style={styles.rowHint}>{item.prescription}</div>
                        <div style={styles.rowHint}>Descanso: {item.Descanso || 60}s</div>
                      </div>
                      <div style={styles.buttonColumn}>
                        <button type="button" onClick={() => toggleWorkout(item.id)} style={{ ...styles.actionButton, ...themeStyles.actionButton, ...(item.done ? styles.actionButtonDone : {}) }}>
                          {item.done ? "Hecho" : "Marcar"}
                        </button>
                        <button
                          type="button"
                          onClick={() => startRest(item.Descanso || 60, item.id)}
                          style={{
                            ...styles.restButton,
                            ...themeStyles.restButton,
                            ...(activeRestId === item.id && restTimer > 0 ? styles.restButtonActive : {}),
                          }}
                        >
                          {activeRestId === item.id && restTimer > 0 ? `Descanso ${restTimer}s` : "Empezar descanso"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={styles.finishGrid}>
                  <button type="button" onClick={saveWorkoutToHistory} style={{ ...styles.secondaryButton, ...themeStyles.secondaryButton }}>
                    Guardar entreno
                  </button>
                  <button type="button" onClick={finishWorkout} style={{ ...styles.primaryButton, ...themeStyles.primaryButton }}>
                    Finalizar entreno
                  </button>
                </div>
              </div>

              <div style={{ ...styles.card, ...themeStyles.card }}>
                <div style={styles.cardTitle}>Tu progreso</div>
                <div style={styles.paragraph}>Objetivo: {state.userStats.objective}</div>
                <div style={styles.paragraph}>Nivel actual: {state.userStats.level}</div>
                <div style={styles.paragraph}>XP acumulado: {state.userStats.xp || 0}</div>
                <div style={styles.xpBox}>
                  <div style={styles.xpTopLine}>
                    <span>Progreso hacia {xpProgress.nextLevel}</span>
                    <strong>{xpProgress.percent}%</strong>
                  </div>
                  <div style={{ ...styles.xpTrack, ...themeStyles.xpTrack }}>
                    <div style={{ ...styles.xpFill, width: `${xpProgress.percent}%` }} />
                  </div>
                  <div style={styles.rowHint}>
                    {xpProgress.remaining > 0 ? `${xpProgress.remaining} XP para subir de nivel` : "Nivel máximo alcanzado"}
                  </div>
                </div>
                <div style={styles.paragraph}>Nivel automático: {state.userStats.autoLevel ? "Activado" : "Desactivado"}</div>
                <div style={styles.paragraph}>Modo: {state.modeFilter}</div>
                <div style={styles.paragraph}>Adherencia actual: {adherence}%</div>
              </div>
            </>
          )}

          {state.activeTab === "ejercicios" && (
            <>
              <div style={{ ...styles.card, ...themeStyles.card }}>
                <div style={styles.cardTitle}>Biblioteca de ejercicios</div>
                <input value={state.search} onChange={(e) => updateField("search", e.target.value)} placeholder="Buscar ejercicio o musculo" style={{ ...styles.input, ...themeStyles.input }} />
                <div style={styles.filterRowWrap}>
                  {["todos", "Básico", "medio", "experto"].map((item) => (
                    <Chip key={item === "basico" ? "básico" : item} active={state.levelFilter === item} onClick={() => updateField("levelFilter", item)}>{item === "basico" ? "básico" : item}</Chip>
                  ))}
                </div>
                <div style={styles.filterRowWrap}>
                  {["todas", "empuje", "tiron", "pierna", "core", "fullbody", "cardio"].map((item) => (
                    <Chip key={item === "basico" ? "básico" : item} active={state.categoryFilter === item} onClick={() => updateField("categoryFilter", item)}>{item === "basico" ? "básico" : item}</Chip>
                  ))}
                </div>
              </div>

              {filteredExercises.map((exercise) => (
                <div key={exercise.id} style={{ ...styles.card, ...themeStyles.card }}>
                  <div style={styles.rowBetween}>
                    <div style={{ flex: 1, paddingRight: 8 }}>
                      <div style={styles.cardTitle}>{exercise.name}</div>
                      <div style={styles.cardHint}>{exercise.description}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", marginTop: 4 }}>
                        {getDifficultyTag(exercise.level, state.userStats.level)}
                      </div>
                    </div>
                    <Badge active>{exercise.level}</Badge>
                  </div>
                  <div style={styles.pillRow}>
                    <Badge>{exercise.category}</Badge>
                    <Badge>{exercise.muscle}</Badge>
                    <Badge>{exercise.mode}</Badge>
                  </div>
                  <div style={styles.infoGrid}>
                    <div style={styles.infoBox}><div style={styles.infoLabel}>Series</div><div style={styles.infoValue}>{exercise.sets}</div></div>
                    <div style={styles.infoBox}><div style={styles.infoLabel}>Reps</div><div style={styles.infoValue}>{exercise.reps}</div></div>
                    <div style={styles.infoBox}><div style={styles.infoLabel}>Descanso</div><div style={styles.infoValue}>{exercise.rest}s</div></div>
                  </div>
                  <div style={styles.howToBox}>
                    <div style={styles.howToTitle}>Como se hace</div>
                    <ol style={styles.howToList}>
                      {exercise.howTo.map((step, index) => <li key={`${exercise.id}-${index}`} style={styles.howToItem}>{step}</li>)}
                    </ol>
                  </div>
                </div>
              ))}
            </>
          )}

          {state.activeTab === "rutinas" && (
            <>
              <div style={{ ...styles.card, ...themeStyles.card }}>
                <div style={styles.cardTitle}>Seleccion de plan</div>
                <div style={styles.cardHint}>Cambia el nivel para adaptar la rutina del usuario.</div>
                <div style={styles.filterRowWrap}>
                  {["Básico", "medio", "experto"].map((item) => (
                    <Chip key={item === "basico" ? "básico" : item} active={state.selectedPlan === item} onClick={() => selectPlan(item)}>{item === "basico" ? "básico" : item}</Chip>
                  ))}
                </div>
              </div>
              <div style={{ ...styles.card, ...themeStyles.card }}>
                <div style={styles.cardTitle}>{currentPlan.name}</div>
                <div style={styles.paragraph}>Objetivo del plan: {currentPlan.goal}</div>
                <div style={styles.paragraph}>Frecuencia: {currentPlan.frequency}</div>
                <div style={styles.paragraph}>Nivel actual: {state.userStats.level}</div>
              </div>
            </>
          )}

          {state.activeTab === "progreso" && (
            <>
              <div style={{ ...styles.card, ...themeStyles.card }}>
                <div style={styles.cardTitle}>Constancia semanal</div>
                <div style={styles.weekGrid}>
                  {WEEK_DAYS.map((day, index) => (
                    <button key={day} type="button" onClick={() => toggleDay(index)} style={{ ...styles.dayBox, ...themeStyles.dayBox, ...(state.completedDays[index] ? styles.dayBoxDone : {}) }}>
                      <div style={{ ...styles.dayText, ...(state.completedDays[index] ? styles.dayTextDone : {}) }}>{day}</div>
                      <div style={{ ...styles.daySubtext, ...(state.completedDays[index] ? styles.dayTextDone : {}) }}>{state.completedDays[index] ? "Hecho" : "Pendiente"}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ ...styles.card, ...themeStyles.card }}>
                <div style={styles.cardTitle}>Indicadores</div>
                <div style={styles.paragraph}>Meta actual: {state.userStats.objective}</div>
                <div style={styles.paragraph}>Nivel estimado: {state.userStats.level}</div>
                <div style={styles.paragraph}>Modo de entrenamiento: {state.modeFilter}</div>
                <div style={styles.paragraph}>Adherencia: {adherence}%</div>
              </div>

              <div style={{ ...styles.card, ...themeStyles.card }}>
                <div style={styles.cardTitle}>Historial</div>
                {state.history.length === 0 ? (
                  <div style={styles.paragraph}>Aun no hay entrenamientos guardados.</div>
                ) : (
                  <div style={styles.stackMd}>
                    {state.history.map((entry) => (
                      <div key={entry.id} style={{ ...styles.historyRow, ...themeStyles.listRow }}>
                        <div style={styles.rowTitle}>{entry.date}</div>
                        <div style={styles.rowHint}>
                          {entry.completed}/{entry.total} completados - {entry.adherence}% - {entry.mode} - {entry.level} - +{entry.xp || 0} XP
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {state.activeTab === "perfil" && (
            <div style={{ ...styles.card, ...themeStyles.card }}>
              <div style={styles.cardTitle}>{state.userStats.name || "Tu perfil"}</div>
              <div style={styles.paragraph}>Objetivo: {state.userStats.objective}</div>
              <div style={styles.paragraph}>Nivel: {state.userStats.level}</div>
              <div style={styles.paragraph}>Modo: {state.modeFilter}</div>
              <div style={styles.paragraph}>XP: {state.userStats.xp || 0}</div>
              <div style={styles.paragraph}>Nivel automático: {state.userStats.autoLevel ? "Activado" : "Desactivado"}</div>
              <button type="button" onClick={toggleAutoLevel} style={{ ...styles.secondaryButton, ...themeStyles.secondaryButton }}>
                {state.userStats.autoLevel ? "Desactivar Nivel automático" : "Activar Nivel automático"}
              </button>
              <div style={styles.paragraph}>Arquitectura: React + Vite + localStorage.</div>

              <button type="button" onClick={togglePro} style={{ ...styles.primaryButton }}>
                {state.userStats.isPro ? "Quitar PRO" : "Desbloquear PRO"}
              </button>

              {!state.userStats.isPro && (
                <div style={styles.lockedBox}>
                  Version gratuita activa. PRO desbloquea automatizacion completa.
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ ...styles.tabBar, ...themeStyles.tabBar }}>
          {[
            { key: "inicio", label: "Inicio" },
            { key: "ejercicios", label: "Ejercicios" },
            { key: "rutinas", label: "Rutinas" },
            { key: "progreso", label: "Progreso" },
            { key: "perfil", label: "Perfil" },
          ].map((tab) => (
            <button key={tab.key} type="button" onClick={() => updateField("activeTab", tab.key)} style={{ ...styles.tabItem, ...themeStyles.tabItem, ...(state.activeTab === tab.key ? { ...styles.tabItemActive, ...themeStyles.tabItemActive } : {}) }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const lightTheme = {
  page: { background: "#f8fafc", color: "#0f172a" },
  phoneFrame: { background: "#ffffff", borderColor: "#e2e8f0" },
  header: { borderBottomColor: "#e2e8f0" },
  card: { background: "#ffffff", borderColor: "#e2e8f0", color: "#0f172a" },
  listRow: { background: "#ffffff", borderColor: "#e2e8f0", color: "#0f172a" },
  tabBar: { background: "#ffffff", borderColor: "#e2e8f0" },
  tabItem: { color: "#64748b" },
  tabItemActive: { color: "#0f172a", background: "#f1f5f9" },
  input: { background: "#ffffff", color: "#0f172a", borderColor: "#cbd5e1" },
  secondaryButton: { background: "#ffffff", color: "#0f172a", borderColor: "#cbd5e1" },
  primaryButton: { background: "#0f172a", color: "#ffffff", borderColor: "#0f172a" },
  actionButton: { background: "#ffffff", color: "#0f172a", borderColor: "#cbd5e1" },
  restButton: { background: "#e2e8f0", color: "#0f172a" },
  timerBox: { background: "#0f172a", color: "#ffffff" },
  stopRestButton: { background: "#ffffff", color: "#0f172a" },
  dayBox: { background: "#ffffff", borderColor: "#cbd5e1" }, xpTrack: { background: "#e2e8f0" }, xpTrack: { background: "#e2e8f0" },
  textStrong: { color: "#0f172a" },
  textMuted: { color: "#475569" },
};

const darkTheme = {
  page: { background: "#000000", color: "#ffffff" },
  phoneFrame: { background: "#050505", borderColor: "#ffffff", boxShadow: "0 16px 40px rgba(255,255,255,0.08)" },
  header: { borderBottomColor: "#ffffff" },
  card: { background: "#0b0b0b", borderColor: "#ffffff", color: "#ffffff" },
  listRow: { background: "#000000", borderColor: "#ffffff", color: "#ffffff" },
  tabBar: { background: "#000000", borderColor: "#ffffff" },
  tabItem: { color: "#d4d4d4" },
  tabItemActive: { color: "#000000", background: "#ffffff" },
  input: { background: "#000000", color: "#ffffff", borderColor: "#ffffff" },
  secondaryButton: { background: "#000000", color: "#ffffff", borderColor: "#ffffff" },
  primaryButton: { background: "#ffffff", color: "#000000", borderColor: "#ffffff" },
  actionButton: { background: "#000000", color: "#ffffff", borderColor: "#ffffff" },
  restButton: { background: "#1f1f1f", color: "#ffffff" },
  timerBox: { background: "#ffffff", color: "#000000" },
  stopRestButton: { background: "#000000", color: "#ffffff" },
  dayBox: { background: "#000000", borderColor: "#ffffff" }, xpTrack: { background: "#1f1f1f" }, xpTrack: { background: "#1f1f1f" },
  textStrong: { color: "#ffffff" },
  textMuted: { color: "#d4d4d4" },
};

const styles = {
  page: { minHeight: "100vh", background: "#f8fafc", display: "flex", justifyContent: "center", padding: 24, fontFamily: "Inter, system-ui, sans-serif", color: "#0f172a" },
  phoneFrame: { width: "100%", maxWidth: 430, minHeight: 820, background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 32, boxShadow: "0 16px 40px rgba(15,23,42,0.08)", position: "relative", overflow: "hidden" },
  loading: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, system-ui, sans-serif", background: "#f8fafc", color: "#0f172a" },
  header: { padding: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, borderBottom: "1px solid #e2e8f0" },
  brand: { fontSize: 28, fontWeight: 800 },
  subtitle: { fontSize: 14, color: "#475569", marginTop: 4, maxWidth: 230, lineHeight: 1.4 },
  secondaryButton: { border: "1px solid #cbd5e1", background: "#ffffff", borderRadius: 14, padding: "10px 14px", fontWeight: 700, cursor: "pointer" },
  primaryButton: { border: "1px solid #0f172a", background: "#0f172a", color: "#ffffff", borderRadius: 14, padding: "12px 14px", fontWeight: 700, cursor: "pointer" },
  headerButtons: { display: "grid", gap: 8 },
  finishGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  heroButton: { border: "none", borderRadius: 24, padding: "20px 16px", fontSize: 20, fontWeight: 900, cursor: "pointer", boxShadow: "0 14px 30px rgba(15,23,42,0.18)" },
  xpBox: { display: "grid", gap: 8, marginTop: 8 },
  xpTopLine: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, fontWeight: 700 },
  xpTrack: { height: 12, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" },
  xpFill: { height: "100%", background: "#22c55e", borderRadius: 999, transition: "width 0.3s ease" },
  profileGrid: { padding: 16, display: "grid", gap: 12 },
  profileField: { display: "grid", gap: 6 },
  fieldLabel: { fontSize: 13, fontWeight: 700, color: "#334155" },
  content: { padding: 16, paddingBottom: 96, display: "grid", gap: 14 },
  statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  statCard: { background: "#ffffff", borderRadius: 18, padding: 16, border: "1px solid #e2e8f0" },
  statLabel: { fontSize: 13, color: "#64748b", marginBottom: 8 },
  statValue: { fontSize: 22, fontWeight: 800 },
  card: { background: "#ffffff", borderRadius: 22, padding: 16, border: "1px solid #e2e8f0", display: "grid", gap: 12 },
  cardTitle: { fontSize: 20, fontWeight: 700 },
  cardHint: { fontSize: 14, color: "#64748b", lineHeight: 1.4 },
  paragraph: { fontSize: 15, color: "#334155", lineHeight: 1.5 },
  stackMd: { display: "grid", gap: 10 },
  listRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, border: "1px solid #e2e8f0", borderRadius: 18, padding: 14 },
  rowTitle: { fontSize: 16, fontWeight: 700 },
  rowHint: { fontSize: 13, color: "#64748b", marginTop: 3 },
  actionButton: { background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: 14, padding: "10px 14px", fontWeight: 700, cursor: "pointer" },
  actionButtonDone: { background: "#0f172a", color: "#ffffff", border: "1px solid #0f172a" },
  buttonColumn: { display: "grid", gap: 8 },
  restButton: { background: "#e2e8f0", border: "none", borderRadius: 14, padding: "10px 14px", fontWeight: 700, cursor: "pointer" },
  restButtonActive: { background: "#dbeafe", color: "#1d4ed8" },
  timerBox: { background: "#0f172a", color: "#ffffff", borderRadius: 22, padding: 16, display: "grid", gap: 8, textAlign: "center" },
  timerTitle: { fontSize: 14, fontWeight: 700, opacity: 0.9 },
  timerValue: { fontSize: 28, fontWeight: 800 },
  stopRestButton: { background: "#ffffff", color: "#0f172a", border: "none", borderRadius: 12, padding: "10px 14px", fontWeight: 700, cursor: "pointer", justifySelf: "center" },
  input: { width: "100%", border: "1px solid #cbd5e1", borderRadius: 16, padding: "12px 14px", fontSize: 15, color: "#0f172a", background: "#ffffff", boxSizing: "border-box" },
  filterRowWrap: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { padding: "10px 14px", borderRadius: 999, background: "#e2e8f0", border: "none", fontWeight: 600, cursor: "pointer", textTransform: "capitalize" },
  chipActive: { background: "#0f172a", color: "#ffffff" },
  badge: { padding: "8px 12px", borderRadius: 999, background: "#eef2ff", color: "#1e293b", fontSize: 12, fontWeight: 600, textTransform: "capitalize" },
  badgeActive: { background: "#dbeafe", color: "#1d4ed8" },
  rowBetween: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
  pillRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 },
  infoBox: { border: "1px solid #e2e8f0", borderRadius: 16, padding: 12 },
  infoLabel: { fontSize: 12, color: "#64748b", marginBottom: 6 },
  infoValue: { fontSize: 15, fontWeight: 700 },
  howToBox: { border: "1px solid #e2e8f0", borderRadius: 16, padding: 12, background: "#f8fafc" },
  howToTitle: { fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 8 },
  howToList: { margin: 0, paddingLeft: 18, display: "grid", gap: 6, color: "#334155", fontSize: 14, lineHeight: 1.45 },
  howToItem: { paddingLeft: 2 },
  weekGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 },
  dayBox: { border: "1px solid #cbd5e1", borderRadius: 18, padding: "16px 10px", background: "#ffffff", textAlign: "center", cursor: "pointer" },
  dayBoxDone: { background: "#0f172a", border: "1px solid #0f172a" },
  dayText: { color: "#0f172a", fontWeight: 700 },
  daySubtext: { color: "#64748b", fontSize: 12, marginTop: 4 },
  dayTextDone: { color: "#ffffff" },
  historyRow: { border: "1px solid #e2e8f0", borderRadius: 16, padding: 12 },
  tabBar: { position: "absolute", left: 12, right: 12, bottom: 14, background: "#ffffff", borderRadius: 24, border: "1px solid #e2e8f0", padding: 6, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 },
  tabItem: { border: "none", background: "transparent", padding: "10px 4px", color: "#64748b", fontWeight: 600, fontSize: 12, borderRadius: 16, cursor: "pointer" },
  tabItemActive: { color: "#0f172a", background: "#f1f5f9", fontWeight: 800 },
};









import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "calistrack_local_v1";

const exercises = [
  {
    id: 1,
    name: "Flexiones inclinadas",
    level: "basico",
    category: "Empuje",
    muscle: "Pecho / Triceps",
    sets: 3,
    reps: "12",
    rest: "60 s",
    description: "Ideal para empezar a ganar fuerza de empuje con buena tecnica.",
  },
  {
    id: 2,
    name: "Flexiones clasicas",
    level: "basico",
    category: "Empuje",
    muscle: "Pecho / Hombro / Triceps",
    sets: 4,
    reps: "10",
    rest: "75 s",
    description: "Ejercicio base para fuerza general del tren superior.",
  },
  {
    id: 3,
    name: "Remo australiano",
    level: "basico",
    category: "Tiron",
    muscle: "Espalda / Biceps",
    sets: 4,
    reps: "8",
    rest: "75 s",
    description: "Construye la base para llegar a dominadas estrictas.",
  },
  {
    id: 4,
    name: "Dominadas asistidas",
    level: "basico",
    category: "Tiron",
    muscle: "Espalda / Biceps",
    sets: 4,
    reps: "6",
    rest: "90 s",
    description: "Progresion inicial para mejorar fuerza vertical de tiron.",
  },
  {
    id: 5,
    name: "Sentadillas al aire",
    level: "basico",
    category: "Pierna",
    muscle: "Cuadriceps / Gluteos",
    sets: 4,
    reps: "15",
    rest: "60 s",
    description: "Movimiento esencial para fuerza, movilidad y control corporal.",
  },
  {
    id: 6,
    name: "Plancha frontal",
    level: "basico",
    category: "Core",
    muscle: "Abdomen / Lumbar",
    sets: 3,
    reps: "30 s",
    rest: "45 s",
    description: "Base para estabilidad del core y postura.",
  },
  {
    id: 7,
    name: "Fondos en banco",
    level: "medio",
    category: "Empuje",
    muscle: "Triceps / Pecho",
    sets: 4,
    reps: "10",
    rest: "75 s",
    description: "Puente entre flexiones y fondos mas demandantes.",
  },
  {
    id: 8,
    name: "Fondos en paralelas",
    level: "medio",
    category: "Empuje",
    muscle: "Pecho / Hombro / Triceps",
    sets: 4,
    reps: "8",
    rest: "90 s",
    description: "Uno de los mejores ejercicios de empuje en calistenia.",
  },
  {
    id: 9,
    name: "Dominadas estrictas",
    level: "medio",
    category: "Tiron",
    muscle: "Espalda / Biceps",
    sets: 5,
    reps: "5",
    rest: "120 s",
    description: "Desarrolla fuerza real del tren superior y control escapular.",
  },
  {
    id: 10,
    name: "Elevaciones de rodillas",
    level: "medio",
    category: "Core",
    muscle: "Abdomen / Cadera",
    sets: 4,
    reps: "12",
    rest: "60 s",
    description: "Paso previo para desarrollar un L-sit solido.",
  },
  {
    id: 11,
    name: "Zancadas alternas",
    level: "medio",
    category: "Pierna",
    muscle: "Pierna unilateral",
    sets: 4,
    reps: "12 por lado",
    rest: "60 s",
    description: "Mejora fuerza, estabilidad y control de pierna.",
  },
  {
    id: 12,
    name: "L-sit tuck",
    level: "medio",
    category: "Core",
    muscle: "Abdomen / Flexores de cadera",
    sets: 5,
    reps: "15 s",
    rest: "60 s",
    description: "Progresion intermedia hacia el L-sit completo.",
  },
  {
    id: 13,
    name: "Flexiones declinadas",
    level: "experto",
    category: "Empuje",
    muscle: "Pecho superior / Hombro",
    sets: 5,
    reps: "12",
    rest: "90 s",
    description: "Aumenta la intensidad del patron de empuje horizontal.",
  },
  {
    id: 14,
    name: "Pike push-ups",
    level: "experto",
    category: "Empuje",
    muscle: "Hombro / Triceps",
    sets: 5,
    reps: "8",
    rest: "90 s",
    description: "Preparacion excelente para handstand push-up.",
  },
  {
    id: 15,
    name: "Pistol squat asistida",
    level: "experto",
    category: "Pierna",
    muscle: "Pierna unilateral / Gluteos",
    sets: 4,
    reps: "6 por lado",
    rest: "90 s",
    description: "Ejercicio avanzado de fuerza, equilibrio y movilidad.",
  },
  {
    id: 16,
    name: "L-sit completo",
    level: "experto",
    category: "Core",
    muscle: "Abdomen / Compresion",
    sets: 5,
    reps: "20 s",
    rest: "75 s",
    description: "Demanda alta de fuerza isometrica y control del cuerpo.",
  },
  {
    id: 17,
    name: "Dominadas explosivas",
    level: "experto",
    category: "Tiron",
    muscle: "Espalda / Potencia",
    sets: 5,
    reps: "4",
    rest: "120 s",
    description: "Progresion util hacia muscle-up y potencia vertical.",
  },
  {
    id: 18,
    name: "Dragon flag progresion",
    level: "experto",
    category: "Core",
    muscle: "Core completo",
    sets: 4,
    reps: "5",
    rest: "90 s",
    description: "Trabajo avanzado de anti-extension y fuerza abdominal.",
  },
];

const plans = {
  basico: {
    name: "Plan basico",
    goal: "Crear base de fuerza y tecnica",
    frequency: "3 dias por semana",
    sessions: [
      { name: "Flexiones inclinadas", prescription: "3 x 12" },
      { name: "Remo australiano", prescription: "4 x 8" },
      { name: "Sentadillas al aire", prescription: "4 x 15" },
      { name: "Plancha frontal", prescription: "3 x 30 s" },
    ],
  },
  medio: {
    name: "Plan medio",
    goal: "Subir fuerza y control corporal",
    frequency: "4 dias por semana",
    sessions: [
      { name: "Flexiones clasicas", prescription: "4 x 10" },
      { name: "Fondos en paralelas", prescription: "4 x 8" },
      { name: "Dominadas estrictas", prescription: "5 x 5" },
      { name: "Elevaciones de rodillas", prescription: "4 x 12" },
    ],
  },
  experto: {
    name: "Plan experto",
    goal: "Desarrollar fuerza avanzada y progresiones complejas",
    frequency: "5 dias por semana",
    sessions: [
      { name: "Pike push-ups", prescription: "5 x 8" },
      { name: "Dominadas explosivas", prescription: "5 x 4" },
      { name: "Pistol squat asistida", prescription: "4 x 6 por lado" },
      { name: "L-sit completo", prescription: "5 x 20 s" },
    ],
  },
};

const weeklyDays = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

function buildWorkoutLog(plan) {
  return plans[plan].sessions.map((session, index) => ({
    id: index + 1,
    ...session,
    done: false,
  }));
}

const defaultState = {
  selectedPlan: "basico",
  completedDays: [true, false, false, true, false, false, false],
  workoutLog: buildWorkoutLog("basico"),
  userStats: {
    streak: 2,
    workouts: 6,
    progress: 35,
    objective: "Lograr 8 dominadas estrictas y un L-sit de 20 s",
    name: "Luis",
    level: "Basico",
  },
};

function safeLoadState() {
  if (typeof window === "undefined") return defaultState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      userStats: {
        ...defaultState.userStats,
        ...(parsed.userStats || {}),
      },
      completedDays: Array.isArray(parsed.completedDays) ? parsed.completedDays.slice(0, 7) : defaultState.completedDays,
      workoutLog: Array.isArray(parsed.workoutLog) && parsed.workoutLog.length ? parsed.workoutLog : defaultState.workoutLog,
    };
  } catch {
    return defaultState;
  }
}

function safeSaveState(state) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeCategory(category) {
  return String(category || "").toLowerCase();
}

function filterExercises(list, search, levelFilter, categoryFilter) {
  return list.filter((exercise) => {
    const text = `${exercise.name} ${exercise.category} ${exercise.muscle}`.toLowerCase();
    const matchesSearch = text.includes(String(search || "").toLowerCase());
    const matchesLevel = levelFilter === "todos" || exercise.level === levelFilter;
    const matchesCategory = categoryFilter === "todas" || normalizeCategory(exercise.category) === categoryFilter;
    return matchesSearch && matchesLevel && matchesCategory;
  });
}

function calculateAdherence(workoutLog) {
  if (!Array.isArray(workoutLog) || workoutLog.length === 0) return 0;
  const completed = workoutLog.filter((item) => item.done).length;
  return Math.round((completed / workoutLog.length) * 100);
}

function runTests() {
  console.assert(buildWorkoutLog("basico").length === 4, "Debe crear 4 ejercicios para el plan basico");
  console.assert(filterExercises(exercises, "dominadas", "todos", "todas").length >= 3, "Debe encontrar ejercicios de dominadas");
  console.assert(filterExercises(exercises, "", "medio", "core").every((item) => item.level === "medio" && item.category === "Core"), "Debe filtrar por nivel y categoria");
  console.assert(calculateAdherence([{ done: true }, { done: false }, { done: true }, { done: true }]) === 75, "La adherencia debe calcularse bien");
  console.assert(calculateAdherence([]) === 0, "La adherencia vacia debe ser 0");
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

function Pill({ text, active }) {
  return <span style={{ ...styles.pill, ...(active ? styles.pillActive : {}) }}>{text}</span>;
}

function FilterButton({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick} style={{ ...styles.chip, ...(active ? styles.chipActive : {}) }}>
      {children}
    </button>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("todos");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [appState, setAppState] = useState(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAppState(safeLoadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    safeSaveState(appState);
  }, [appState, hydrated]);

  const currentPlan = plans[appState.selectedPlan];
  const completedCount = appState.completedDays.filter(Boolean).length;
  const adherence = calculateAdherence(appState.workoutLog);

  const filteredExercises = useMemo(() => {
    return filterExercises(exercises, search, levelFilter, categoryFilter);
  }, [search, levelFilter, categoryFilter]);

  function selectPlan(plan) {
    setAppState((prev) => ({
      ...prev,
      selectedPlan: plan,
      workoutLog: buildWorkoutLog(plan),
      userStats: {
        ...prev.userStats,
        level: plan === "basico" ? "Basico" : plan === "medio" ? "Medio" : "Experto",
        progress: plan === "basico" ? 35 : plan === "medio" ? 68 : 82,
      },
    }));
  }

  function toggleWorkout(id) {
    setAppState((prev) => {
      const updatedLog = prev.workoutLog.map((item) => (item.id === id ? { ...item, done: !item.done } : item));
      const newCompleted = updatedLog.filter((item) => item.done).length;
      return {
        ...prev,
        workoutLog: updatedLog,
        userStats: {
          ...prev.userStats,
          workouts: prev.userStats.workouts + 1,
          progress: Math.min(100, 20 + newCompleted * 15),
        },
      };
    });
  }

  function toggleDay(index) {
    setAppState((prev) => {
      const nextValue = !prev.completedDays[index];
      const updatedDays = prev.completedDays.map((item, i) => (i === index ? nextValue : item));
      return {
        ...prev,
        completedDays: updatedDays,
        userStats: {
          ...prev.userStats,
          streak: nextValue ? prev.userStats.streak + 1 : Math.max(0, prev.userStats.streak - 1),
        },
      };
    });
  }

  function resetLocalData() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setAppState(defaultState);
  }

  if (!hydrated) {
    return <div style={styles.loading}>Cargando datos locales...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.phoneFrame}>
        <div style={styles.header}>
          <div>
            <div style={styles.brand}>CalisTrack iOS</div>
            <div style={styles.subtitle}>Prototipo web con estilo iPhone y almacenamiento local.</div>
          </div>
          <button type="button" onClick={resetLocalData} style={styles.secondaryButton}>
            Reset
          </button>
        </div>

        <div style={styles.content}>
          {activeTab === "inicio" && (
            <>
              <div style={styles.statsGrid}>
                <StatCard label="Racha" value={`${appState.userStats.streak} dias`} />
                <StatCard label="Entrenos" value={appState.userStats.workouts} />
                <StatCard label="Progreso" value={`${appState.userStats.progress}%`} />
                <StatCard label="Semana" value={`${completedCount}/7`} />
              </div>

              <div style={styles.card}>
                <div style={styles.cardTitle}>Entrenamiento de hoy</div>
                <div style={styles.cardHint}>{currentPlan.name} · {currentPlan.frequency}</div>
                <div style={styles.stackMd}>
                  {appState.workoutLog.map((item) => (
                    <div key={item.id} style={styles.listRow}>
                      <div style={{ flex: 1 }}>
                        <div style={styles.rowTitle}>{item.name}</div>
                        <div style={styles.rowHint}>{item.prescription}</div>
                      </div>
                      <button
                        type="button"
                        style={{ ...styles.actionButton, ...(item.done ? styles.actionButtonDone : {}) }}
                        onClick={() => toggleWorkout(item.id)}
                      >
                        {item.done ? "Hecho" : "Marcar"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardTitle}>Resumen</div>
                <div style={styles.paragraph}>Objetivo: {currentPlan.goal}</div>
                <div style={styles.paragraph}>Adherencia actual: {adherence}%</div>
                <div style={styles.paragraph}>Nivel estimado: {appState.userStats.level}</div>
              </div>
            </>
          )}

          {activeTab === "ejercicios" && (
            <>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Biblioteca de ejercicios</div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar ejercicio o musculo"
                  style={styles.input}
                />
                <div style={styles.filterRowWrap}>
                  {[
                    { key: "todos", label: "Todos" },
                    { key: "basico", label: "Basico" },
                    { key: "medio", label: "Medio" },
                    { key: "experto", label: "Experto" },
                  ].map((item) => (
                    <FilterButton key={item.key} active={levelFilter === item.key} onClick={() => setLevelFilter(item.key)}>
                      {item.label}
                    </FilterButton>
                  ))}
                </div>
                <div style={styles.filterRowWrap}>
                  {[
                    { key: "todas", label: "Todas" },
                    { key: "empuje", label: "Empuje" },
                    { key: "tiron", label: "Tiron" },
                    { key: "pierna", label: "Pierna" },
                    { key: "core", label: "Core" },
                  ].map((item) => (
                    <FilterButton key={item.key} active={categoryFilter === item.key} onClick={() => setCategoryFilter(item.key)}>
                      {item.label}
                    </FilterButton>
                  ))}
                </div>
              </div>

              {filteredExercises.map((exercise) => (
                <div key={exercise.id} style={styles.card}>
                  <div style={styles.rowBetween}>
                    <div style={{ flex: 1, paddingRight: 8 }}>
                      <div style={styles.cardTitle}>{exercise.name}</div>
                      <div style={styles.cardHint}>{exercise.description}</div>
                    </div>
                    <Pill text={exercise.level} active />
                  </div>
                  <div style={styles.pillRow}>
                    <Pill text={exercise.category} />
                    <Pill text={exercise.muscle} />
                  </div>
                  <div style={styles.infoGrid}>
                    <div style={styles.infoBox}>
                      <div style={styles.infoLabel}>Series</div>
                      <div style={styles.infoValue}>{exercise.sets}</div>
                    </div>
                    <div style={styles.infoBox}>
                      <div style={styles.infoLabel}>Reps</div>
                      <div style={styles.infoValue}>{exercise.reps}</div>
                    </div>
                    <div style={styles.infoBox}>
                      <div style={styles.infoLabel}>Descanso</div>
                      <div style={styles.infoValue}>{exercise.rest}</div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === "rutinas" && (
            <>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Seleccion de plan</div>
                <div style={styles.cardHint}>Cambia el nivel para adaptar la rutina del usuario.</div>
                <div style={styles.filterRowWrap}>
                  {[
                    { key: "basico", label: "Basico" },
                    { key: "medio", label: "Medio" },
                    { key: "experto", label: "Experto" },
                  ].map((item) => (
                    <FilterButton key={item.key} active={appState.selectedPlan === item.key} onClick={() => selectPlan(item.key)}>
                      {item.label}
                    </FilterButton>
                  ))}
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardTitle}>{currentPlan.name}</div>
                <div style={styles.paragraph}>Objetivo: {currentPlan.goal}</div>
                <div style={styles.paragraph}>Frecuencia: {currentPlan.frequency}</div>
                <div style={styles.paragraph}>Nivel actual: {appState.userStats.level}</div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardTitle}>Sesion tipo</div>
                <div style={styles.stackMd}>
                  {currentPlan.sessions.map((item) => (
                    <div key={item.name} style={styles.listRow}>
                      <div>
                        <div style={styles.rowTitle}>{item.name}</div>
                        <div style={styles.rowHint}>{item.prescription}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "progreso" && (
            <>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Constancia semanal</div>
                <div style={styles.weekGrid}>
                  {weeklyDays.map((day, index) => (
                    <button
                      key={day}
                      type="button"
                      style={{ ...styles.dayBox, ...(appState.completedDays[index] ? styles.dayBoxDone : {}) }}
                      onClick={() => toggleDay(index)}
                    >
                      <div style={{ ...styles.dayText, ...(appState.completedDays[index] ? styles.dayTextDone : {}) }}>{day}</div>
                      <div style={{ ...styles.daySubtext, ...(appState.completedDays[index] ? styles.dayTextDone : {}) }}>
                        {appState.completedDays[index] ? "Hecho" : "Pendiente"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardTitle}>Indicadores</div>
                <div style={styles.paragraph}>Meta actual: {appState.userStats.objective}</div>
                <div style={styles.paragraph}>Nivel estimado: {appState.userStats.level}</div>
                <div style={styles.paragraph}>Adherencia: {adherence}%</div>
                <div style={styles.paragraph}>Guardado: local en el navegador como simulacion de iPhone.</div>
              </div>
            </>
          )}

          {activeTab === "perfil" && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>{appState.userStats.name}</div>
              <div style={styles.paragraph}>Objetivo: fuerza, core y dominadas.</div>
              <div style={styles.paragraph}>Frecuencia: {currentPlan.frequency}</div>
              <div style={styles.paragraph}>Meta a 90 dias: 8 dominadas, 25 flexiones limpias y L-sit estable.</div>
              <div style={styles.paragraph}>Arquitectura actual: prototipo React web compatible con canvas + localStorage.</div>
            </div>
          )}
        </div>

        <div style={styles.tabBar}>
          {[
            { key: "inicio", label: "Inicio" },
            { key: "ejercicios", label: "Ejercicios" },
            { key: "rutinas", label: "Rutinas" },
            { key: "progreso", label: "Progreso" },
            { key: "perfil", label: "Perfil" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              style={{ ...styles.tabItem, ...(activeTab === tab.key ? styles.tabItemActive : {}) }}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    padding: 24,
    fontFamily: "Inter, system-ui, sans-serif",
    color: "#0f172a",
  },
  phoneFrame: {
    width: "100%",
    maxWidth: 430,
    minHeight: 820,
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: 32,
    boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
    position: "relative",
    overflow: "hidden",
  },
  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, system-ui, sans-serif",
    background: "#f8fafc",
    color: "#0f172a",
  },
  header: {
    padding: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    borderBottom: "1px solid #e2e8f0",
  },
  brand: {
    fontSize: 28,
    fontWeight: 800,
  },
  subtitle: {
    fontSize: 14,
    color: "#475569",
    marginTop: 4,
    maxWidth: 230,
    lineHeight: 1.4,
  },
  secondaryButton: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    borderRadius: 14,
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  content: {
    padding: 16,
    paddingBottom: 96,
    display: "grid",
    gap: 14,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  statCard: {
    background: "#ffffff",
    borderRadius: 18,
    padding: 16,
    border: "1px solid #e2e8f0",
  },
  statLabel: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 800,
  },
  card: {
    background: "#ffffff",
    borderRadius: 22,
    padding: 16,
    border: "1px solid #e2e8f0",
    display: "grid",
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
  },
  cardHint: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 1.4,
  },
  paragraph: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 1.5,
  },
  stackMd: {
    display: "grid",
    gap: 10,
  },
  listRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    padding: 14,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: 700,
  },
  rowHint: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 3,
  },
  actionButton: {
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: 14,
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  actionButtonDone: {
    background: "#0f172a",
    color: "#ffffff",
    border: "1px solid #0f172a",
  },
  input: {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: 16,
    padding: "12px 14px",
    fontSize: 15,
    color: "#0f172a",
    background: "#ffffff",
    boxSizing: "border-box",
  },
  filterRowWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    padding: "10px 14px",
    borderRadius: 999,
    background: "#e2e8f0",
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  },
  chipActive: {
    background: "#0f172a",
    color: "#ffffff",
  },
  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  pillRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    padding: "8px 12px",
    borderRadius: 999,
    background: "#eef2ff",
    color: "#1e293b",
    fontSize: 12,
    fontWeight: 600,
  },
  pillActive: {
    background: "#dbeafe",
    color: "#1d4ed8",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 10,
  },
  infoBox: {
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: 700,
  },
  weekGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
  },
  dayBox: {
    border: "1px solid #cbd5e1",
    borderRadius: 18,
    padding: "16px 10px",
    background: "#ffffff",
    textAlign: "center",
    cursor: "pointer",
  },
  dayBoxDone: {
    background: "#0f172a",
    border: "1px solid #0f172a",
  },
  dayText: {
    color: "#0f172a",
    fontWeight: 700,
  },
  daySubtext: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 4,
  },
  dayTextDone: {
    color: "#ffffff",
  },
  tabBar: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 14,
    background: "#ffffff",
    borderRadius: 24,
    border: "1px solid #e2e8f0",
    padding: 6,
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 4,
  },
  tabItem: {
    border: "none",
    background: "transparent",
    padding: "10px 4px",
    color: "#64748b",
    fontWeight: 600,
    fontSize: 12,
    borderRadius: 16,
    cursor: "pointer",
  },
  tabItemActive: {
    color: "#0f172a",
    background: "#f1f5f9",
    fontWeight: 800,
  },
};

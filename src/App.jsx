import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "calistrack_v2";

const EXERCISES = [
  { id: 1, name: "Flexiones inclinadas", level: "basico", category: "empuje", muscle: "Pecho / Triceps", sets: 3, reps: "12", rest: "60 s", description: "Perfectas para empezar con buena tecnica.", howTo: ["Apoya las manos en una superficie elevada.", "Mantén el cuerpo recto de hombros a tobillos.", "Baja el pecho controlando el movimiento.", "Empuja hasta volver arriba sin arquear la espalda."] },
  { id: 2, name: "Flexiones clasicas", level: "basico", category: "empuje", muscle: "Pecho / Hombro / Triceps", sets: 4, reps: "10", rest: "75 s", description: "Base de fuerza del tren superior.", howTo: ["Coloca las manos un poco más abiertas que los hombros.", "Aprieta abdomen y glúteos para mantener el cuerpo recto.", "Desciende hasta que el pecho se acerque al suelo.", "Empuja fuerte hasta extender los brazos."] },
  { id: 3, name: "Remo australiano", level: "basico", category: "tiron", muscle: "Espalda / Biceps", sets: 4, reps: "8", rest: "75 s", description: "Progresion ideal antes de dominadas estrictas.", howTo: ["Agarra la barra con el cuerpo por debajo.", "Mantén talones apoyados y cuerpo en línea recta.", "Tira del pecho hacia la barra juntando escápulas.", "Baja de forma lenta y controlada."] },
  { id: 4, name: "Dominadas asistidas", level: "basico", category: "tiron", muscle: "Espalda / Biceps", sets: 4, reps: "6", rest: "90 s", description: "Trabajo vertical de tiron para principiantes.", howTo: ["Usa banda o apoyo para reducir carga.", "Agarra la barra con firmeza y activa hombros.", "Sube llevando el pecho hacia la barra.", "Desciende despacio hasta extensión casi completa."] },
  { id: 5, name: "Sentadillas al aire", level: "basico", category: "pierna", muscle: "Cuadriceps / Gluteos", sets: 4, reps: "15", rest: "60 s", description: "Ejercicio esencial de tren inferior.", howTo: ["Coloca los pies al ancho de hombros.", "Empuja la cadera hacia atrás al bajar.", "Mantén el pecho arriba y talones en el suelo.", "Sube extendiendo rodillas y cadera."] },
  { id: 6, name: "Plancha frontal", level: "basico", category: "core", muscle: "Abdomen / Lumbar", sets: 3, reps: "30 s", rest: "45 s", description: "Estabilidad basica del core.", howTo: ["Apoya antebrazos y puntas de los pies.", "Mantén hombros alineados con codos.", "Aprieta abdomen y glúteos.", "Evita hundir o elevar demasiado la cadera."] },

  { id: 7, name: "Fondos en banco", level: "medio", category: "empuje", muscle: "Triceps / Pecho", sets: 4, reps: "10", rest: "75 s", description: "Paso intermedio hacia fondos en paralelas.", howTo: ["Apoya las manos en el borde del banco.", "Extiende las piernas hacia delante.", "Baja flexionando codos cerca del cuerpo.", "Empuja hasta volver a la posición inicial."] },
  { id: 8, name: "Fondos en paralelas", level: "medio", category: "empuje", muscle: "Pecho / Hombro / Triceps", sets: 4, reps: "8", rest: "90 s", description: "Gran ejercicio de empuje en calistenia.", howTo: ["Sujeta las paralelas con brazos extendidos.", "Inclina ligeramente el torso hacia delante.", "Baja hasta sentir buen rango sin perder control.", "Empuja fuerte hasta bloqueo estable."] },
  { id: 9, name: "Dominadas estrictas", level: "medio", category: "tiron", muscle: "Espalda / Biceps", sets: 5, reps: "5", rest: "120 s", description: "Fuerza real del tren superior.", howTo: ["Cuelga con agarre firme y hombros activos.", "Inicia el tirón desde la espalda, no solo con brazos.", "Lleva el pecho hacia la barra.", "Baja controlando sin balancearte."] },
  { id: 10, name: "Elevaciones de rodillas", level: "medio", category: "core", muscle: "Abdomen / Cadera", sets: 4, reps: "12", rest: "60 s", description: "Paso previo para L-sit.", howTo: ["Cuelga de una barra o apóyate en paralelas.", "Sube las rodillas hacia el pecho.", "Evita impulsarte con balanceo.", "Baja despacio manteniendo el abdomen activo."] },
  { id: 11, name: "Zancadas alternas", level: "medio", category: "pierna", muscle: "Pierna unilateral", sets: 4, reps: "12 por lado", rest: "60 s", description: "Control y estabilidad de pierna.", howTo: ["Da un paso largo hacia delante.", "Baja ambas rodillas controladamente.", "Mantén torso erguido y abdomen firme.", "Empuja con la pierna delantera para volver."] },
  { id: 12, name: "L-sit tuck", level: "medio", category: "core", muscle: "Abdomen / Flexores de cadera", sets: 5, reps: "15 s", rest: "60 s", description: "Progresion intermedia de compresion.", howTo: ["Apóyate en paralelas o bloques.", "Eleva el cuerpo con hombros deprimidos.", "Lleva rodillas al pecho manteniendo pies fuera del suelo.", "Sostén sin redondear demasiado la espalda."] },

  { id: 13, name: "Flexiones declinadas", level: "experto", category: "empuje", muscle: "Pecho superior / Hombro", sets: 5, reps: "12", rest: "90 s", description: "Mayor intensidad de empuje horizontal.", howTo: ["Apoya los pies en una superficie elevada.", "Coloca las manos firmes en el suelo.", "Baja controlando el pecho hacia el suelo.", "Empuja sin perder alineación corporal."] },
  { id: 14, name: "Pike push-ups", level: "experto", category: "empuje", muscle: "Hombro / Triceps", sets: 5, reps: "8", rest: "90 s", description: "Excelente base para handstand push-up.", howTo: ["Coloca cadera alta formando una V invertida.", "Baja la cabeza entre las manos.", "Mantén codos orientados hacia atrás.", "Empuja hacia arriba llevando carga a hombros."] },
  { id: 15, name: "Pistol squat asistida", level: "experto", category: "pierna", muscle: "Pierna unilateral / Gluteos", sets: 4, reps: "6 por lado", rest: "90 s", description: "Fuerza, equilibrio y movilidad.", howTo: ["Sujétate a un apoyo ligero.", "Extiende una pierna al frente.", "Baja sobre la pierna de apoyo sin perder equilibrio.", "Sube empujando fuerte con el pie apoyado."] },
  { id: 16, name: "L-sit completo", level: "experto", category: "core", muscle: "Abdomen / Compresion", sets: 5, reps: "20 s", rest: "75 s", description: "Trabajo isometrico avanzado.", howTo: ["Empuja fuerte contra las paralelas.", "Eleva ambas piernas rectas al frente.", "Mantén rodillas extendidas y abdomen firme.", "Sostén sin dejar caer la cadera."] },
  { id: 17, name: "Dominadas explosivas", level: "experto", category: "tiron", muscle: "Espalda / Potencia", sets: 5, reps: "4", rest: "120 s", description: "Muy utiles para progresion a muscle-up.", howTo: ["Inicia desde colgado estable.", "Tira con máxima velocidad y potencia.", "Busca que el pecho suba lo más alto posible.", "Baja con control para repetir limpio."] },
  { id: 18, name: "Dragon flag progresion", level: "experto", category: "core", muscle: "Core completo", sets: 4, reps: "5", rest: "90 s", description: "Trabajo avanzado de anti-extension.", howTo: ["Apoya hombros en banco y sujeta un punto firme.", "Eleva el cuerpo en bloque.", "Desciende lentamente sin doblarte por la cadera.", "Vuelve arriba manteniendo tensión abdominal."] },

  { id: 19, name: "Burpees", level: "medio", category: "fullbody", muscle: "Cuerpo completo", sets: 4, reps: "15", rest: "60 s", description: "Ejercicio militar clasico de resistencia y potencia.", howTo: ["Desde pie, baja las manos al suelo.", "Lleva los pies atrás a posición de plancha.", "Vuelve con los pies hacia delante.", "Salta extendiendo el cuerpo arriba."] },
  { id: 20, name: "Flexiones diamante", level: "medio", category: "empuje", muscle: "Triceps", sets: 4, reps: "12", rest: "60 s", description: "Muy usadas en entrenamiento militar para fuerza de triceps.", howTo: ["Junta las manos formando un diamante.", "Mantén codos cerca del cuerpo.", "Baja controlando el pecho hacia las manos.", "Empuja fuerte hasta extensión completa."] },
  { id: 21, name: "Sprint en sitio", level: "basico", category: "cardio", muscle: "Pierna / Resistencia", sets: 5, reps: "30 s", rest: "30 s", description: "Trabajo cardiovascular tipo militar.", howTo: ["Corre en el mismo sitio a máxima intensidad.", "Eleva rodillas de forma activa.", "Mueve brazos con ritmo rápido.", "Mantén el tronco estable y respiración viva."] },
  { id: 22, name: "Mountain climbers", level: "medio", category: "core", muscle: "Core / Cardio", sets: 4, reps: "40 s", rest: "30 s", description: "Alta intensidad usada en entrenamiento funcional militar.", howTo: ["Colócate en plancha alta.", "Lleva una rodilla al pecho y alterna rápido.", "Mantén hombros sobre las manos.", "Evita mover demasiado la cadera."] },
  { id: 23, name: "Salto con rodillas al pecho", level: "experto", category: "pierna", muscle: "Explosividad", sets: 4, reps: "12", rest: "60 s", description: "Trabajo explosivo tipo entrenamiento de combate.", howTo: ["Parte de pie con rodillas ligeramente flexionadas.", "Salta lo más vertical posible.", "Lleva rodillas hacia el pecho en el aire.", "Aterriza suave y repite con control."] },
  { id: 24, name: "Plancha con desplazamiento", level: "experto", category: "core", muscle: "Core completo", sets: 4, reps: "30 s", rest: "45 s", description: "Simula desplazamientos militares en el suelo.", howTo: ["Adopta posición de plancha baja.", "Desplázate lateral o frontal manteniendo tensión.", "Mantén abdomen fuerte y cadera estable.", "Respira sin perder la postura."] },
];

const PLANS = {
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

const WEEK_DAYS = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];

function buildWorkoutLog(planKey) {
  return PLANS[planKey].sessions.map((session, index) => ({
    id: index + 1,
    ...session,
    done: false,
  }));
}

const DEFAULT_STATE = {
  activeTab: "inicio",
  selectedPlan: "basico",
  search: "",
  levelFilter: "todos",
  categoryFilter: "todas",
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

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      userStats: { ...DEFAULT_STATE.userStats, ...(parsed.userStats || {}) },
      completedDays: Array.isArray(parsed.completedDays) ? parsed.completedDays.slice(0, 7) : DEFAULT_STATE.completedDays,
      workoutLog: Array.isArray(parsed.workoutLog) && parsed.workoutLog.length ? parsed.workoutLog : DEFAULT_STATE.workoutLog,
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

function filterExercises(list, search, levelFilter, categoryFilter) {
  return list.filter((exercise) => {
    const haystack = `${exercise.name} ${exercise.category} ${exercise.muscle}`.toLowerCase();
    const matchesSearch = haystack.includes(String(search || "").toLowerCase());
    const matchesLevel = levelFilter === "todos" || exercise.level === levelFilter;
    const matchesCategory = categoryFilter === "todas" || exercise.category === categoryFilter;
    return matchesSearch && matchesLevel && matchesCategory;
  });
}

function runTests() {
  console.assert(buildWorkoutLog("basico").length === 4, "El plan basico debe tener 4 ejercicios");
  console.assert(calculateAdherence([{ done: true }, { done: false }, { done: true }, { done: true }]) === 75, "La adherencia debe ser 75");
  console.assert(filterExercises(EXERCISES, "dominadas", "todos", "todas").length >= 3, "Debe encontrar ejercicios de dominadas");
  console.assert(filterExercises(EXERCISES, "", "medio", "core").every((item) => item.level === "medio" && item.category === "core"), "Debe filtrar por nivel y categoria");
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

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveState(state);
  }, [state, ready]);

  const currentPlan = PLANS[state.selectedPlan];
  const completedCount = state.completedDays.filter(Boolean).length;
  const adherence = calculateAdherence(state.workoutLog);

  const filteredExercises = useMemo(() => {
    return filterExercises(EXERCISES, state.search, state.levelFilter, state.categoryFilter);
  }, [state.search, state.levelFilter, state.categoryFilter]);

  function updateField(field, value) {
    setState((prev) => ({ ...prev, [field]: value }));
  }

  function selectPlan(planKey) {
    setState((prev) => ({
      ...prev,
      selectedPlan: planKey,
      workoutLog: buildWorkoutLog(planKey),
      userStats: {
        ...prev.userStats,
        level: planKey === "basico" ? "Basico" : planKey === "medio" ? "Medio" : "Experto",
        progress: planKey === "basico" ? 35 : planKey === "medio" ? 68 : 82,
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
          ...prev.userStats,
          workouts: prev.userStats.workouts + 1,
          progress: Math.min(100, 20 + doneCount * 15),
        },
      };
    });
  }

  function toggleDay(index) {
    setState((prev) => {
      const nextValue = !prev.completedDays[index];
      const completedDays = prev.completedDays.map((item, i) => (i === index ? nextValue : item));
      return {
        ...prev,
        completedDays,
        userStats: {
          ...prev.userStats,
          streak: nextValue ? prev.userStats.streak + 1 : Math.max(0, prev.userStats.streak - 1),
        },
      };
    });
  }

  function resetApp() {
    window.localStorage.removeItem(STORAGE_KEY);
    setState(DEFAULT_STATE);
  }

  function updateUserName(name) {
    setState((prev) => ({
      ...prev,
      userStats: {
        ...prev.userStats,
        name,
      },
    }));
  }

  if (!ready) {
    return <div style={styles.loading}>Cargando app...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.phoneFrame}>
        <div style={styles.header}>
          <div>
            <div style={styles.brand}>CalisTrack</div>
            <div style={styles.subtitle}>App limpia de calistenia, guardado local y lista para desplegar.</div>
          </div>
          <button type="button" onClick={resetApp} style={styles.secondaryButton}>Reset</button>
        </div>

        <div style={styles.nameBar}>
          <label htmlFor="user-name" style={styles.nameLabel}>Tu nombre</label>
          <input
            id="user-name"
            type="text"
            value={state.userStats.name}
            onChange={(e) => updateUserName(e.target.value)}
            placeholder="Escribe tu nombre"
            style={styles.nameInput}
          />
        </div>

        <div style={styles.content}>
          {state.activeTab === "inicio" && (
            <>
              <div style={styles.statsGrid}>
                <StatCard label="Racha" value={`${state.userStats.streak} dias`} />
                <StatCard label="Entrenos" value={state.userStats.workouts} />
                <StatCard label="Progreso" value={`${state.userStats.progress}%`} />
                <StatCard label="Semana" value={`${completedCount}/7`} />
              </div>

              <div style={styles.card}>
                <div style={styles.cardTitle}>Entrenamiento de hoy{state.userStats.name ? `, ${state.userStats.name}` : ""}</div>
                <div style={styles.cardHint}>{currentPlan.name} - {currentPlan.frequency}</div>
                <div style={styles.stackMd}>
                  {state.workoutLog.map((item) => (
                    <div key={item.id} style={styles.listRow}>
                      <div style={{ flex: 1 }}>
                        <div style={styles.rowTitle}>{item.name}</div>
                        <div style={styles.rowHint}>{item.prescription}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleWorkout(item.id)}
                        style={{ ...styles.actionButton, ...(item.done ? styles.actionButtonDone : {}) }}
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
                <div style={styles.paragraph}>Nivel estimado: {state.userStats.level}</div>
              </div>
            </>
          )}

          {state.activeTab === "ejercicios" && (
            <>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Biblioteca de ejercicios</div>
                <input
                  value={state.search}
                  onChange={(e) => updateField("search", e.target.value)}
                  placeholder="Buscar ejercicio o musculo"
                  style={styles.input}
                />
                <div style={styles.filterRowWrap}>
                  {["todos", "basico", "medio", "experto"].map((item) => (
                    <Chip key={item} active={state.levelFilter === item} onClick={() => updateField("levelFilter", item)}>
                      {item}
                    </Chip>
                  ))}
                </div>
                <div style={styles.filterRowWrap}>
                  {["todas", "empuje", "tiron", "pierna", "core", "fullbody", "cardio"].map((item) => (
                    <Chip key={item} active={state.categoryFilter === item} onClick={() => updateField("categoryFilter", item)}>
                      {item}
                    </Chip>
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
                    <Badge active>{exercise.level}</Badge>
                  </div>
                  <div style={styles.pillRow}>
                    <Badge>{exercise.category}</Badge>
                    <Badge>{exercise.muscle}</Badge>
                  </div>
                  <div style={styles.infoGrid}>
                    <div style={styles.infoBox}><div style={styles.infoLabel}>Series</div><div style={styles.infoValue}>{exercise.sets}</div></div>
                    <div style={styles.infoBox}><div style={styles.infoLabel}>Reps</div><div style={styles.infoValue}>{exercise.reps}</div></div>
                    <div style={styles.infoBox}><div style={styles.infoLabel}>Descanso</div><div style={styles.infoValue}>{exercise.rest}</div></div>
                  </div>
                  <div style={styles.howToBox}>
                    <div style={styles.howToTitle}>Como se hace</div>
                    <ol style={styles.howToList}>
                      {exercise.howTo.map((step, index) => (
                        <li key={`${exercise.id}-${index}`} style={styles.howToItem}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </>
          )}

          {state.activeTab === "rutinas" && (
            <>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Seleccion de plan</div>
                <div style={styles.cardHint}>Cambia el nivel y reinicia la sesion del dia.</div>
                <div style={styles.filterRowWrap}>
                  {["basico", "medio", "experto"].map((item) => (
                    <Chip key={item} active={state.selectedPlan === item} onClick={() => selectPlan(item)}>
                      {item}
                    </Chip>
                  ))}
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardTitle}>{currentPlan.name}</div>
                <div style={styles.paragraph}>Objetivo: {currentPlan.goal}</div>
                <div style={styles.paragraph}>Frecuencia: {currentPlan.frequency}</div>
                <div style={styles.paragraph}>Nivel actual: {state.userStats.level}</div>
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

          {state.activeTab === "progreso" && (
            <>
              <div style={styles.card}>
                <div style={styles.cardTitle}>Constancia semanal</div>
                <div style={styles.weekGrid}>
                  {WEEK_DAYS.map((day, index) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(index)}
                      style={{ ...styles.dayBox, ...(state.completedDays[index] ? styles.dayBoxDone : {}) }}
                    >
                      <div style={{ ...styles.dayText, ...(state.completedDays[index] ? styles.dayTextDone : {}) }}>{day}</div>
                      <div style={{ ...styles.daySubtext, ...(state.completedDays[index] ? styles.dayTextDone : {}) }}>
                        {state.completedDays[index] ? "Hecho" : "Pendiente"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardTitle}>Indicadores</div>
                <div style={styles.paragraph}>Meta actual: {state.userStats.objective}</div>
                <div style={styles.paragraph}>Nivel estimado: {state.userStats.level}</div>
                <div style={styles.paragraph}>Adherencia: {adherence}%</div>
                <div style={styles.paragraph}>Guardado: local en el navegador.</div>
              </div>
            </>
          )}

          {state.activeTab === "perfil" && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>{state.userStats.name || "Tu perfil"}</div>
              <div style={styles.paragraph}>Objetivo: fuerza, core y dominadas.</div>
              <div style={styles.paragraph}>Frecuencia: {currentPlan.frequency}</div>
              <div style={styles.paragraph}>Meta a 90 dias: 8 dominadas, 25 flexiones limpias y L-sit estable.</div>
              <div style={styles.paragraph}>Arquitectura: React + Vite + localStorage.</div>
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
              onClick={() => updateField("activeTab", tab.key)}
              style={{ ...styles.tabItem, ...(state.activeTab === tab.key ? styles.tabItemActive : {}) }}
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
  nameBar: {
    padding: "0 16px 8px 16px",
    display: "grid",
    gap: 8,
  },
  nameLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: "#334155",
  },
  nameInput: {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: 14,
    padding: "12px 14px",
    fontSize: 15,
    color: "#0f172a",
    background: "#ffffff",
    boxSizing: "border-box",
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
    textTransform: "capitalize",
  },
  chipActive: {
    background: "#0f172a",
    color: "#ffffff",
  },
  badge: {
    padding: "8px 12px",
    borderRadius: 999,
    background: "#eef2ff",
    color: "#1e293b",
    fontSize: 12,
    fontWeight: 600,
    textTransform: "capitalize",
  },
  badgeActive: {
    background: "#dbeafe",
    color: "#1d4ed8",
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
    fontSize: "15px",
    fontWeight: 700,
  },
  howToBox: {
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 12,
    background: "#f8fafc",
  },
  howToTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 8,
  },
  howToList: {
    margin: 0,
    paddingLeft: 18,
    display: "grid",
    gap: 6,
    color: "#334155",
    fontSize: "14px",
    lineHeight: 1.45,
  },
  howToItem: {
    paddingLeft: 2,
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

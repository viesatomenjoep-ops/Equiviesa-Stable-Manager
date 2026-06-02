import React, { useState, useMemo, createContext, useContext } from "react";
import {
  Menu, X, Bell, Plus, Search, ChevronRight, ChevronLeft, Check,
  Home, Calendar, CalendarDays, CheckSquare, Heart, Carrot, MapPin, Contact,
  FileText, Users, Settings, HelpCircle, Receipt, BookOpen,
  Package, Baby, ShoppingCart, Sparkles, Trash2, Camera, MoreHorizontal, Globe, Wallet, ArrowUpRight, ArrowDownRight, Paperclip, ChevronDown, LogOut, Download, Upload
} from "lucide-react";
import { supabase } from "./supabaseClient";

/* ============================================================
   EQUIVESA — All-in stable manager
   Stap 2: gedeelde datalaag + volledige Paarden-module
   Fris & licht · Responsive · Drietalig (NL/EN/ES)
   ============================================================ */

/* ---------- i18n ---------- */
const I18N = {
  nl: {
    code: "NL",
    horses: "Paarden", calendar: "Kalender", tasks: "Taken", health: "Gezondheid", menu: "Menu",
    general: "Algemeen", finance: "Financiën", breeding: "Fokkerij", sales: "Verkoop",
    feeding: "Voeding", locations: "Locaties", contacts: "Contacten", documents: "Documenten",
    clients: "Klanten", bookings: "Boekingen", invoices: "Facturen", catalog: "Catalogus",
    mares: "Merries", embryos: "Embryo's", foals: "Veulens",
    users: "Gebruikers", settings: "Instellingen", help: "Hulp nodig",
    search: "Zoeken", addHorse: "Paard toevoegen", noHorses: "Nog geen paarden",
    noHorsesSub: "Maak een paardprofiel aan om te starten met taken, gezondheid en meer.",
    empty: "Geen items", nothingPlanned: "Niets gepland",
    planned: "Gepland", history: "Historiek", careOverview: "Overzicht zorg",
    appointments: "Afspraken", deworming: "Ontwormingen", vaccinations: "Vaccinaties",
    generalCare: "Algemene zorg", treatments: "Behandelingen",
    dental: "Tandverzorging", medication: "Medicatie", farrier: "Hoefverzorging",
    trial: "Proefperiode", daysLeft: "Nog 14 dagen", activate: "Activeer nu",
    bookDemo: "Een demo boeken", new: "Nieuw", comingSoon: "Wordt straks verder uitgebouwd",
    today: "Vandaag", overview: "Overzicht",
    supplies: "Stalbenodigdheden", addSupply: "Artikel toevoegen", noSupplies: "Geen benodigdheden aangevraagd.",
    supplyItem: "Artikel", requestedBy: "Aangevraagd door", qty: "Hoeveelheid", statusPending: "Nog nodig", statusPurchased: "Gekocht",
    // form
    add: "Toevoegen", save: "Opslaan", cancel: "Annuleren", required: "Verplicht", optional: "Optioneel",
    name: "Naam", studbook: "Stamboek", sex: "Geslacht", color: "Kleur",
    birthdate: "Geboortedatum", ueln: "UELN", chip: "Chip", feiid: "FEI ID", location: "Locatie",
    select: "Selecteer", photo: "Foto", active: "Actief", archived: "Gearchiveerd",
    profile: "Profiel", info: "Gegevens", delete: "Verwijderen",
    nameRequired: "Naam is verplicht", noResults: "Geen resultaten",
    sexMare: "Merrie", sexStallion: "Hengst", sexGelding: "Ruin",
    horseCount: (n) => `${n} ${n === 1 ? "paard" : "paarden"}`,
    backTo: "Terug", language: "Taal",
    months: ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"],
    weekdays: ["ma","di","wo","do","vr","za","zo"],
    fmtDay: (wd, d) => `${wd} ${d}`,
    fmtTodayDate: (d, mon) => `Vandaag, ${d} ${mon}`,
    // finance
    finOverview: "Overzicht", income: "Inkomsten", expenses: "Uitgaven", balance: "Saldo",
    newIncome: "Nieuwe inkomst", newExpense: "Nieuwe uitgave", addTransaction: "Transactie toevoegen",
    noTxns: "Nog geen transacties", noTxnsSub: "Voeg je eerste inkomst of uitgave toe om je financiën bij te houden.",
    step: "Stap", reference: "Referentie", amount: "Bedrag", next: "Volgende", back: "Vorige", finish: "Opslaan",
    fWhen: "Wanneer", fCategory: "Categorie", fWho: "Wie", fReference: "Referentie",
    fDescription: "Omschrijving", fAttachments: "Bijlagen", fHorse: "Paard", upload: "Uploaden",
    fAmountLabel: "Bedrag (€)", chooseType: "Wat wil je toevoegen?",
    catConcours: "Concours", catSold: "Verkocht", catBoard: "Pension", catVet: "Dierenarts",
    catFarrier: "Hoefsmid", catFeed: "Voer", catOther: "Overig",
    noContact: "Geen contact", allHorses: "Algemeen (geen paard)", thisMonth: "Deze maand",
    // users
    role: "Rol", roles: "Rollen", permissions: "Permissies", addUser: "Gebruiker toevoegen",
    noUsers: "Nog geen gebruikers", noUsersSub: "Nodig teamleden uit en bepaal wat ze mogen zien en doen.",
    roleAdmin: "Beheerder", roleManager: "Manager", roleStaff: "Medewerker", roleVet: "Dierenarts", roleOwner: "Eigenaar",
    permContacts: "Contacten", permHorses: "Paarden", permCalendar: "Kalender", permTasks: "Taken",
    permHealth: "Gezondheid", permTeams: "Teams", permFinance: "Financiën", permFeeding: "Voeding",
    permLinks: "Links", permStaff: "Personeelsrooster", invite: "Uitnodigen", email: "E-mail",
    selectAll: "Alles", userCount: (n) => `${n} ${n === 1 ? "gebruiker" : "gebruikers"}`,
    // feeding
    feedingTab: "Voeding", orderTab: "Bestelling",
    morning: "Ochtend", noon: "Middag", evening: "Avond", night: "Nacht",
    horse: "Paard", allHorsesShort: "Alle paarden", addFeed: "Voer toevoegen",
    noFeed: "Geen voerschema", noFeedSub: "Voeg paarden toe en stel hun voerschema per dagdeel in.",
    product: "Product", addProduct: "Product toevoegen",
    noFeedHorse: "Nog niets ingesteld voor dit dagdeel.",
    // mode gate
    chooseMode: "Wie ben je?", chooseModeSub: "Kies je weergave. Je kunt dit later wisselen.",
    groom: "Groom", manager: "Manager",
    groomDesc: "Dagelijks werk op de stal: voeren, taken en zorg.",
    managerDesc: "Volledig beheer: planning, financiën, team en meer.",
    enter: "Openen", switchMode: "Wissel weergave", backToChoice: "Terug naar keuze",
    managerPin: "Manager-pincode", pinHint: "Voer de pincode in om naar Manager te wisselen.",
    wrongPin: "Onjuiste pincode", groomMode: "Groom-weergave", managerMode: "Manager-weergave",
    today2: "Vandaag",
    authLoginTitle: "Inloggen", authRegisterTitle: "Registreren",
    authEmail: "E-mailadres", authPassword: "Wachtwoord",
    authLoginBtn: "Log in", authRegisterBtn: "Account aanmaken",
    authWait: "Even geduld...",
    authNoAccount: "Nog geen account? Registreer",
    authHasAccount: "Al een account? Log in",
    authCheckEmail: "Check je e-mail voor de bevestigingslink!",
    qtyHint: "bijv. 5 zakken, 2 balen", reqByHint: "bijv. je eigen naam",
    notes: "Opmerkingen", notesHint: "Optionele details...",
    addTask: "Taak toevoegen", taskTitle: "Titel", taskDesc: "Beschrijving", taskDue: "Deadline",
    taskHorse: "Paard (optioneel)", noTasks: "Nog geen taken", noTasksSub: "Voeg taken toe om je werk te organiseren.",
    done: "Voltooid", open: "Open", completedTasks: "Voltooid",
    addRecord: "Afspraak toevoegen", recordDate: "Datum", recordNotes: "Notities",
    performedBy: "Uitgevoerd door", cost: "Kosten (€)", noRecords: "Nog geen afspraken",
    noRecordsSub: "Voeg een afspraak toe om de gezondheid bij te houden.",
    prevMonth: "Vorige maand", nextMonth: "Volgende maand",
    selectHorse: "Selecteer paard", allCats: "Alle categorieën",
    taskCommon: ["Stal uitmesten", "Paddock", "Longeren", "Poetsen", "Hooi vullen", "Watercheck", "Weide maaien"],
  },
  en: {
    code: "EN",
    horses: "Horses", calendar: "Calendar", tasks: "Tasks", health: "Health", menu: "Menu",
    general: "General", finance: "Finance", breeding: "Breeding", sales: "Sales",
    feeding: "Feeding", locations: "Locations", contacts: "Contacts", documents: "Documents",
    clients: "Clients", bookings: "Bookings", invoices: "Invoices", catalog: "Catalog",
    mares: "Mares", embryos: "Embryos", foals: "Foals",
    users: "Users", settings: "Settings", help: "Need help",
    search: "Search", addHorse: "Add horse", noHorses: "No horses yet",
    noHorsesSub: "Create a horse profile to get started with tasks, health and more.",
    empty: "No items", nothingPlanned: "Nothing planned",
    planned: "Planned", history: "History", careOverview: "Care overview",
    appointments: "Appointments", deworming: "Deworming", vaccinations: "Vaccinations",
    generalCare: "General care", treatments: "Treatments",
    dental: "Dental care", medication: "Medication", farrier: "Farrier",
    trial: "Trial period", daysLeft: "14 days left", activate: "Activate now",
    bookDemo: "Book a demo", new: "New", comingSoon: "Built out further next",
    today: "Today", overview: "Overview",
    supplies: "Stable Supplies", addSupply: "Add supply request", noSupplies: "No supplies requested yet.",
    supplyItem: "Item", requestedBy: "Requested by", qty: "Quantity", statusPending: "Needed", statusPurchased: "Purchased",
    add: "Add", save: "Save", cancel: "Cancel", required: "Required", optional: "Optional",
    name: "Name", studbook: "Studbook", sex: "Sex", color: "Colour",
    birthdate: "Date of birth", ueln: "UELN", chip: "Chip", feiid: "FEI ID", location: "Location",
    select: "Select", photo: "Photo", active: "Active", archived: "Archived",
    profile: "Profile", info: "Details", delete: "Delete",
    nameRequired: "Name is required", noResults: "No results",
    sexMare: "Mare", sexStallion: "Stallion", sexGelding: "Gelding",
    horseCount: (n) => `${n} ${n === 1 ? "horse" : "horses"}`,
    backTo: "Back", language: "Language",
    months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    weekdays: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    fmtDay: (wd, d) => `${wd} ${d}`,
    fmtTodayDate: (d, mon) => `Today, ${mon} ${d}`,
    finOverview: "Overview", income: "Income", expenses: "Expenses", balance: "Balance",
    newIncome: "New income", newExpense: "New expense", addTransaction: "Add transaction",
    noTxns: "No transactions yet", noTxnsSub: "Add your first income or expense to track your finances.",
    step: "Step", reference: "Reference", amount: "Amount", next: "Next", back: "Back", finish: "Save",
    fWhen: "When", fCategory: "Category", fWho: "Who", fReference: "Reference",
    fDescription: "Description", fAttachments: "Attachments", fHorse: "Horse", upload: "Upload",
    fAmountLabel: "Amount (€)", chooseType: "What do you want to add?",
    catConcours: "Competition", catSold: "Sold", catBoard: "Boarding", catVet: "Vet",
    catFarrier: "Farrier", catFeed: "Feed", catOther: "Other",
    noContact: "No contact", allHorses: "General (no horse)", thisMonth: "This month",
    role: "Role", roles: "Roles", permissions: "Permissions", addUser: "Add user",
    noUsers: "No users yet", noUsersSub: "Invite team members and set what they can see and do.",
    roleAdmin: "Administrator", roleManager: "Manager", roleStaff: "Staff", roleVet: "Vet", roleOwner: "Owner",
    permContacts: "Contacts", permHorses: "Horses", permCalendar: "Calendar", permTasks: "Tasks",
    permHealth: "Health", permTeams: "Teams", permFinance: "Finance", permFeeding: "Feeding",
    permLinks: "Links", permStaff: "Staff schedule", invite: "Invite", email: "Email",
    selectAll: "All", userCount: (n) => `${n} ${n === 1 ? "user" : "users"}`,
    feedingTab: "Feeding", orderTab: "Order",
    morning: "Morning", noon: "Noon", evening: "Evening", night: "Night",
    horse: "Horse", allHorsesShort: "All horses", addFeed: "Add feed",
    noFeed: "No feeding schedule", noFeedSub: "Add horses and set up their feed per time of day.",
    product: "Product", addProduct: "Add product",
    noFeedHorse: "Nothing set for this time of day yet.",
    chooseMode: "Who are you?", chooseModeSub: "Choose your view. You can switch later.",
    groom: "Groom", manager: "Manager",
    groomDesc: "Daily work at the stable: feeding, tasks and care.",
    managerDesc: "Full management: planning, finance, team and more.",
    enter: "Open", switchMode: "Switch view", backToChoice: "Back to choice",
    managerPin: "Manager PIN", pinHint: "Enter the PIN to switch to Manager.",
    wrongPin: "Wrong PIN", groomMode: "Groom view", managerMode: "Manager view",
    today2: "Today",
    authLoginTitle: "Login", authRegisterTitle: "Register",
    authEmail: "Email address", authPassword: "Password",
    authLoginBtn: "Log in", authRegisterBtn: "Create account",
    authWait: "Please wait...",
    authNoAccount: "No account yet? Register",
    authHasAccount: "Already have an account? Log in",
    authCheckEmail: "Check your email for the confirmation link!",
    qtyHint: "e.g. 5 bags, 2 bales", reqByHint: "e.g. your name",
    notes: "Notes", notesHint: "Optional details...",
    addTask: "Add task", taskTitle: "Title", taskDesc: "Description", taskDue: "Due date",
    taskHorse: "Horse (optional)", noTasks: "No tasks yet", noTasksSub: "Add tasks to organize your work.",
    done: "Done", open: "Open", completedTasks: "Completed",
    addRecord: "Add record", recordDate: "Date", recordNotes: "Notes",
    performedBy: "Performed by", cost: "Cost (€)", noRecords: "No records yet",
    noRecordsSub: "Add a record to track health.",
    prevMonth: "Previous month", nextMonth: "Next month",
    selectHorse: "Select horse", allCats: "All categories",
    taskCommon: ["Muck out", "Paddock", "Lunging", "Grooming", "Fill hay", "Water check", "Mow pasture"],
  },
  es: {
    code: "ES",
    horses: "Caballos", calendar: "Calendario", tasks: "Tareas", health: "Salud", menu: "Menú",
    general: "General", finance: "Finanzas", breeding: "Cría", sales: "Ventas",
    feeding: "Alimentación", locations: "Ubicaciones", contacts: "Contactos", documents: "Documentos",
    clients: "Clientes", bookings: "Reservas", invoices: "Facturas", catalog: "Catálogo",
    mares: "Yeguas", embryos: "Embriones", foals: "Potros",
    users: "Usuarios", settings: "Ajustes", help: "Ayuda",
    search: "Buscar", addHorse: "Añadir caballo", noHorses: "Aún no hay caballos",
    noHorsesSub: "Crea un perfil de caballo para empezar con tareas, salud y más.",
    empty: "Sin elementos", nothingPlanned: "Nada planificado",
    planned: "Planificado", history: "Historial", careOverview: "Resumen de cuidados",
    appointments: "Citas", deworming: "Desparasitación", vaccinations: "Vacunas",
    generalCare: "Cuidado general", treatments: "Tratamientos",
    dental: "Cuidado dental", medication: "Medicación", farrier: "Herraje",
    trial: "Periodo de prueba", daysLeft: "Quedan 14 días", activate: "Activar ahora",
    bookDemo: "Reservar demo", new: "Nuevo", comingSoon: "Se ampliará a continuación",
    today: "Hoy", overview: "Resumen",
    supplies: "Suministros de establo", addSupply: "Añadir solicitud", noSupplies: "No hay suministros solicitados.",
    supplyItem: "Artículo", requestedBy: "Solicitado por", qty: "Cantidad", statusPending: "Necesario", statusPurchased: "Comprado",
    add: "Añadir", save: "Guardar", cancel: "Cancelar", required: "Obligatorio", optional: "Opcional",
    name: "Nombre", studbook: "Libro genealógico", sex: "Sexo", color: "Color",
    birthdate: "Fecha de nacimiento", ueln: "UELN", chip: "Chip", feiid: "FEI ID", location: "Ubicación",
    select: "Seleccionar", photo: "Foto", active: "Activo", archived: "Archivado",
    profile: "Perfil", info: "Datos", delete: "Eliminar",
    nameRequired: "El nombre es obligatorio", noResults: "Sin resultados",
    sexMare: "Yegua", sexStallion: "Semental", sexGelding: "Castrado",
    horseCount: (n) => `${n} ${n === 1 ? "caballo" : "caballos"}`,
    backTo: "Atrás", language: "Idioma",
    months: ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],
    weekdays: ["lun","mar","mié","jue","vie","sáb","dom"],
    fmtDay: (wd, d) => `${wd} ${d}`,
    fmtTodayDate: (d, mon) => `Hoy, ${d} ${mon}`,
    finOverview: "Resumen", income: "Ingresos", expenses: "Gastos", balance: "Saldo",
    newIncome: "Nuevo ingreso", newExpense: "Nuevo gasto", addTransaction: "Añadir transacción",
    noTxns: "Aún no hay transacciones", noTxnsSub: "Añade tu primer ingreso o gasto para controlar tus finanzas.",
    step: "Paso", reference: "Referencia", amount: "Importe", next: "Siguiente", back: "Atrás", finish: "Guardar",
    fWhen: "Cuándo", fCategory: "Categoría", fWho: "Quién", fReference: "Referencia",
    fDescription: "Descripción", fAttachments: "Adjuntos", fHorse: "Caballo", upload: "Subir",
    fAmountLabel: "Importe (€)", chooseType: "¿Qué quieres añadir?",
    catConcours: "Concurso", catSold: "Vendido", catBoard: "Pensión", catVet: "Veterinario",
    catFarrier: "Herrador", catFeed: "Pienso", catOther: "Otro",
    noContact: "Sin contacto", allHorses: "General (sin caballo)", thisMonth: "Este mes",
    role: "Rol", roles: "Roles", permissions: "Permisos", addUser: "Añadir usuario",
    noUsers: "Aún no hay usuarios", noUsersSub: "Invita a miembros del equipo y define qué pueden ver y hacer.",
    roleAdmin: "Administrador", roleManager: "Gerente", roleStaff: "Personal", roleVet: "Veterinario", roleOwner: "Propietario",
    permContacts: "Contactos", permHorses: "Caballos", permCalendar: "Calendario", permTasks: "Tareas",
    permHealth: "Salud", permTeams: "Equipos", permFinance: "Finanzas", permFeeding: "Alimentación",
    permLinks: "Enlaces", permStaff: "Horario del personal", invite: "Invitar", email: "Correo",
    selectAll: "Todos", userCount: (n) => `${n} ${n === 1 ? "usuario" : "usuarios"}`,
    feedingTab: "Alimentación", orderTab: "Pedido",
    morning: "Mañana", noon: "Mediodía", evening: "Tarde", night: "Noche",
    horse: "Caballo", allHorsesShort: "Todos los caballos", addFeed: "Añadir comida",
    noFeed: "Sin plan de alimentación", noFeedSub: "Añade caballos y configura su comida por momento del día.",
    product: "Producto", addProduct: "Añadir producto",
    noFeedHorse: "Aún no hay nada para este momento del día.",
    chooseMode: "¿Quién eres?", chooseModeSub: "Elige tu vista. Puedes cambiarla más tarde.",
    groom: "Mozo", manager: "Gerente",
    groomDesc: "Trabajo diario en la cuadra: comida, tareas y cuidados.",
    managerDesc: "Gestión completa: planificación, finanzas, equipo y más.",
    enter: "Abrir", switchMode: "Cambiar vista", backToChoice: "Volver a elegir",
    managerPin: "PIN de gerente", pinHint: "Introduce el PIN para cambiar a Gerente.",
    wrongPin: "PIN incorrecto", groomMode: "Vista mozo", managerMode: "Vista gerente",
    today2: "Hoy",
    authLoginTitle: "Iniciar sesión", authRegisterTitle: "Registrarse",
    authEmail: "Correo electrónico", authPassword: "Contraseña",
    authLoginBtn: "Iniciar sesión", authRegisterBtn: "Crear cuenta",
    authWait: "Por favor espera...",
    authNoAccount: "¿Aún no tienes cuenta? Regístrate",
    authHasAccount: "¿Ya tienes cuenta? Inicia sesión",
    authCheckEmail: "¡Revisa tu correo para el enlace de confirmación!",
    qtyHint: "ej. 5 sacos, 2 pacas", reqByHint: "ej. tu nombre",
    notes: "Notas", notesHint: "Detalles opcionales...",
    addTask: "Añadir tarea", taskTitle: "Título", taskDesc: "Descripción", taskDue: "Fecha límite",
    taskHorse: "Caballo (opcional)", noTasks: "Aún no hay tareas", noTasksSub: "Añade tareas para organizar tu trabajo.",
    done: "Hecho", open: "Pendiente", completedTasks: "Completadas",
    addRecord: "Añadir registro", recordDate: "Fecha", recordNotes: "Notas",
    performedBy: "Realizado por", cost: "Coste (€)", noRecords: "Aún no hay registros",
    noRecordsSub: "Añade un registro para seguir la salud.",
    prevMonth: "Mes anterior", nextMonth: "Mes siguiente",
    selectHorse: "Seleccionar caballo", allCats: "Todas las categorías",
    taskCommon: ["Limpiar cuadra", "Paddock", "Cuerda", "Cepillar", "Llenar heno", "Revisar agua", "Cortar pasto"],
  },
};

/* ---------- helpers ---------- */
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/* ---------- palette (fresh & light) ---------- */
const C = {
  bg: "#F4F7F5", surface: "#FFFFFF", ink: "#1F2D3A", sub: "#7C8A99",
  line: "#E8EEEA", field: "#F6F9F7",
  mint: "#2FB6A0", mintSoft: "#E3F5F0",
  sky: "#5B9BD5", coral: "#FF8A6B", amber: "#F2B441", pink: "#E86A9A", lilac: "#8E7CE0",
};

const SECTIONS = {
  general: ["horses", "calendar", "tasks", "health", "feeding", "supplies", "locations", "contacts", "documents"],
  finance: ["finance", "clients", "bookings", "invoices", "catalog"],
  breeding: ["mares", "embryos", "foals"],
};

function AuthScreen({ t, lang, setLang }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert(t.authCheckEmail);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: C.bg, fontFamily: "'Montserrat', sans-serif", position: "relative" }}>
      <div style={{ position: "absolute", top: 16, right: 16 }}>
        <LangMenu lang={lang} setLang={setLang} t={t} />
      </div>
      <form onSubmit={handleAuth} style={{ background: C.surface, padding: 32, borderRadius: 24, width: "100%", maxWidth: 360, boxShadow: "0 12px 34px rgba(31,45,58,.08)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24, gap: 10 }}>
          <img src="/logo.svg" alt="Logo" style={{ width: 48, height: 48 }} />
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 16, fontWeight: 700, color: C.ink, letterSpacing: "0.5px" }}>Equiviesa Stable Manager</span>
        </div>
        <h2 style={{ margin: "0 0 24px", textAlign: "center", fontSize: 24, fontWeight: 700 }}>{isLogin ? t.authLoginTitle : t.authRegisterTitle}</h2>
        <input type="email" placeholder={t.authEmail} value={email} onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid #E8EEEA", marginBottom: 12, fontSize: 16, fontFamily: "inherit" }} required />
        <input type="password" placeholder={t.authPassword} value={password} onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid #E8EEEA", marginBottom: 24, fontSize: 16, fontFamily: "inherit" }} required />
        <button type="submit" disabled={loading}
          style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: C.mint, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
          {loading ? t.authWait : (isLogin ? t.authLoginBtn : t.authRegisterBtn)}
        </button>
        <button type="button" onClick={() => setIsLogin(!isLogin)}
          style={{ width: "100%", padding: "14px", marginTop: 8, background: "transparent", border: "none", color: C.sub, cursor: "pointer", fontSize: 14 }}>
          {isLogin ? t.authNoAccount : t.authHasAccount}
        </button>
      </form>
    </div>
  );
}
const ICONS = {
  horses: Home, calendar: Calendar, tasks: CheckSquare, health: Heart,
  feeding: Carrot, supplies: ShoppingCart, locations: MapPin, contacts: Contact, documents: FileText,
  finance: Wallet, clients: Users, bookings: BookOpen, invoices: Receipt, catalog: Package,
  mares: Heart, embryos: Sparkles, foals: Baby, sales: ShoppingCart,
  users: Users, settings: Settings, help: HelpCircle,
};
const ACCENT = {
  horses: C.mint, calendar: C.sky, tasks: C.amber, health: C.coral,
  feeding: C.amber, supplies: C.coral, locations: C.mint, contacts: C.sky, documents: C.lilac,
  finance: C.mint, clients: C.sky, bookings: C.sky, invoices: C.sky, catalog: C.sky,
  mares: C.pink, embryos: C.pink, foals: C.pink, sales: C.amber,
};
const HEALTH_CATS = [
  ["appointments", Calendar, C.sky], ["farrier", Sparkles, C.lilac],
  ["deworming", Carrot, C.mint], ["vaccinations", Heart, C.sky],
  ["generalCare", Heart, C.amber], ["treatments", Plus, C.mint],
  ["dental", Plus, C.sub], ["medication", Plus, C.pink],
];
const BOTTOM = ["horses", "calendar", "tasks", "health", "menu"];

/* ---------- shared data store ---------- */
const Store = createContext(null);
const useStore = () => useContext(Store);

const HORSE_TINTS = [C.mint, C.sky, C.coral, C.amber, C.pink, C.lilac];

function StoreProvider({ children }) {
  const [horses, setHorses] = useState([]);
  const [txns, setTxns] = useState([]);
  const [users, setUsers] = useState([]);
  const [feed, setFeed] = useState({});
  const [supplies, setSupplies] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);

  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchHorses(); fetchTxns(); fetchSupplies(); fetchUsers(); fetchFeed();
        fetchTasks(); fetchHealthRecords();
      } else {
        setHorses([]); setTxns([]); setSupplies([]); setUsers([]); setFeed({});
        setTasks([]); setHealthRecords([]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchHorses = async () => {
    const { data } = await supabase.from('horses').select('*').order('created_at', { ascending: false });
    if (data) setHorses(data.map(h => ({...h, tint: h.tint || HORSE_TINTS[Math.floor(Math.random() * HORSE_TINTS.length)]})));
  };
  const addHorse = async (h) => {
    const { data } = await supabase.from('horses').insert([{...h, tint: HORSE_TINTS[horses.length % HORSE_TINTS.length]}]).select();
    if (data) setHorses(prev => [data[0], ...prev]);
  };
  const deleteHorse = async (id) => {
    await supabase.from('horses').delete().eq('id', id);
    setHorses(prev => prev.filter(h => h.id !== id));
  };

  const fetchTxns = async () => {
    const { data } = await supabase.from('transactions').select('*').order('when', { ascending: false });
    if (data) setTxns(data);
  };
  const addTxn = async (tx) => {
    const { data } = await supabase.from('transactions').insert([tx]).select();
    if (data) setTxns(prev => [data[0], ...prev]);
  };
  const deleteTxn = async (id) => {
    await supabase.from('transactions').delete().eq('id', id);
    setTxns(prev => prev.filter(x => x.id !== id));
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*');
    if (data) setUsers(data);
  };
  const addUser = async (u) => {
    const { data } = await supabase.from('profiles').insert([u]).select();
    if (data) setUsers(prev => [data[0], ...prev]);
  };
  const deleteUser = async (id) => {
    await supabase.from('profiles').delete().eq('id', id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const fetchSupplies = async () => {
    const { data } = await supabase.from('supplies_needed').select('*').order('created_at', { ascending: false });
    if (data) setSupplies(data);
  };
  const addSupply = async (item) => {
    const { data } = await supabase.from('supplies_needed').insert([{...item, status: 'pending'}]).select();
    if (data) setSupplies(prev => [data[0], ...prev]);
  };
  const toggleSupplyStatus = async (id) => {
    const s = supplies.find(x => x.id === id);
    if (!s) return;
    const newStatus = s.status === 'pending' ? 'purchased' : 'pending';
    await supabase.from('supplies_needed').update({ status: newStatus }).eq('id', id);
    setSupplies(prev => prev.map(x => x.id === id ? { ...x, status: newStatus } : x));
  };
  const deleteSupply = async (id) => {
    await supabase.from('supplies_needed').delete().eq('id', id);
    setSupplies(prev => prev.filter(s => s.id !== id));
  };

  const fetchFeed = async () => {
    const { data } = await supabase.from('feed_schedules').select('*');
    if (data) {
      const newFeed = {};
      data.forEach(item => {
        if (!newFeed[item.horse_id]) newFeed[item.horse_id] = { morning: [], noon: [], evening: [], night: [] };
        if (newFeed[item.horse_id][item.slot]) newFeed[item.horse_id][item.slot].push(item);
      });
      setFeed(newFeed);
    }
  };
  const addFeedItem = async (horseId, slot, item) => {
    const { data } = await supabase.from('feed_schedules').insert([{ horse_id: horseId, slot, product: item.product, qty: item.qty }]).select();
    if (data && data[0]) {
      setFeed(prev => {
        const h = prev[horseId] || { morning: [], noon: [], evening: [], night: [] };
        return { ...prev, [horseId]: { ...h, [slot]: [...(h[slot] || []), data[0]] } };
      });
    }
  };
  const deleteFeedItem = async (horseId, slot, itemId) => {
    await supabase.from('feed_schedules').delete().eq('id', itemId);
    setFeed(prev => {
      const h = prev[horseId]; if (!h) return prev;
      return { ...prev, [horseId]: { ...h, [slot]: h[slot].filter((i) => i.id !== itemId) } };
    });
  };

  /* --- Tasks CRUD --- */
  const fetchTasks = async () => {
    const { data } = await supabase.from('tasks').select('*').order('due_date', { ascending: true });
    if (data) setTasks(data);
  };
  const addTask = async (task) => {
    const { data } = await supabase.from('tasks').insert([task]).select();
    if (data) setTasks(prev => [data[0], ...prev]);
  };
  const toggleTask = async (id) => {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    const done = !t.is_completed;
    await supabase.from('tasks').update({ is_completed: done }).eq('id', id);
    setTasks(prev => prev.map(x => x.id === id ? { ...x, is_completed: done } : x));
  };
  const deleteTask = async (id) => {
    await supabase.from('tasks').delete().eq('id', id);
    setTasks(prev => prev.filter(x => x.id !== id));
  };

  /* --- Health Records CRUD --- */
  const fetchHealthRecords = async () => {
    const { data } = await supabase.from('health_records').select('*').order('scheduled_date', { ascending: false });
    if (data) setHealthRecords(data);
  };
  const addHealthRecord = async (rec) => {
    const { data } = await supabase.from('health_records').insert([rec]).select();
    if (data) setHealthRecords(prev => [data[0], ...prev]);
  };
  const toggleHealthRecord = async (id) => {
    const r = healthRecords.find(x => x.id === id);
    if (!r) return;
    const done = !r.completed;
    await supabase.from('health_records').update({ completed: done }).eq('id', id);
    setHealthRecords(prev => prev.map(x => x.id === id ? { ...x, completed: done } : x));
  };
  const deleteHealthRecord = async (id) => {
    await supabase.from('health_records').delete().eq('id', id);
    setHealthRecords(prev => prev.filter(x => x.id !== id));
  };

  /* --- Locations CRUD --- */
  const [locations, setLocations] = useState([]);
  const fetchLocations = async () => {
    const { data } = await supabase.from('locations').select('*').order('name');
    if (data) setLocations(data);
  };
  const addLocation = async (loc) => {
    const { data } = await supabase.from('locations').insert([loc]).select();
    if (data) setLocations(prev => [data[0], ...prev]);
  };
  const deleteLocation = async (id) => {
    await supabase.from('locations').delete().eq('id', id);
    setLocations(prev => prev.filter(x => x.id !== id));
  };

  /* --- Contacts CRUD --- */
  const [contacts, setContacts] = useState([]);
  const fetchContacts = async () => {
    const { data } = await supabase.from('contacts').select('*').order('name');
    if (data) setContacts(data);
  };
  const addContact = async (c) => {
    const { data } = await supabase.from('contacts').insert([c]).select();
    if (data) setContacts(prev => [data[0], ...prev]);
  };
  const deleteContact = async (id) => {
    await supabase.from('contacts').delete().eq('id', id);
    setContacts(prev => prev.filter(x => x.id !== id));
  };

  /* --- Documents CRUD --- */
  const [documents, setDocuments] = useState([]);
  const fetchDocuments = async () => {
    const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
    if (data) setDocuments(data);
  };
  const addDocument = async (doc) => {
    const { data } = await supabase.from('documents').insert([doc]).select();
    if (data) setDocuments(prev => [data[0], ...prev]);
  };
  const deleteDocument = async (id) => {
    await supabase.from('documents').delete().eq('id', id);
    setDocuments(prev => prev.filter(x => x.id !== id));
  };

  // Fetch locations, contacts, documents on auth
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { fetchLocations(); fetchContacts(); fetchDocuments(); fetchClients(); fetchBookings(); fetchInvoices(); fetchCompanySettings(); fetchCatalog(); fetchMares(); fetchEmbryos(); fetchFoals(); }
    });
  }, []);

  /* --- Clients CRUD --- */
  const [clients, setClients] = useState([]);
  const fetchClients = async () => { const { data } = await supabase.from('clients').select('*').order('name'); if (data) setClients(data); };
  const addClient = async (c) => { const { data } = await supabase.from('clients').insert([c]).select(); if (data) setClients(p => [data[0], ...p]); };
  const deleteClient = async (id) => { await supabase.from('clients').delete().eq('id', id); setClients(p => p.filter(x => x.id !== id)); };

  /* --- Bookings CRUD --- */
  const [bookings, setBookings] = useState([]);
  const fetchBookings = async () => { const { data } = await supabase.from('bookings').select('*').order('booking_date', { ascending: false }); if (data) setBookings(data); };
  const addBooking = async (b) => { const { data } = await supabase.from('bookings').insert([b]).select(); if (data) setBookings(p => [data[0], ...p]); };
  const deleteBooking = async (id) => { await supabase.from('bookings').delete().eq('id', id); setBookings(p => p.filter(x => x.id !== id)); };
  const updateBooking = async (id, updates) => { const { data } = await supabase.from('bookings').update(updates).eq('id', id).select(); if (data) setBookings(p => p.map(x => x.id === id ? data[0] : x)); };

  /* --- Invoices CRUD --- */
  const [invoices, setInvoices] = useState([]);
  const fetchInvoices = async () => { const { data } = await supabase.from('invoices').select('*').order('created_at', { ascending: false }); if (data) setInvoices(data); };
  const addInvoice = async (inv) => { const { data } = await supabase.from('invoices').insert([inv]).select(); if (data) setInvoices(p => [data[0], ...p]); };
  const updateInvoice = async (id, updates) => { const { data } = await supabase.from('invoices').update(updates).eq('id', id).select(); if (data) setInvoices(p => p.map(x => x.id === id ? data[0] : x)); };
  const deleteInvoice = async (id) => { await supabase.from('invoices').delete().eq('id', id); setInvoices(p => p.filter(x => x.id !== id)); };

  /* --- Company Settings --- */
  const [companySettings, setCompanySettings] = useState(null);
  const fetchCompanySettings = async () => { const { data } = await supabase.from('company_settings').select('*').limit(1); if (data && data[0]) setCompanySettings(data[0]); };
  const saveCompanySettings = async (s) => {
    if (companySettings?.id) { const { data } = await supabase.from('company_settings').update(s).eq('id', companySettings.id).select(); if (data) setCompanySettings(data[0]); }
    else { const { data } = await supabase.from('company_settings').insert([s]).select(); if (data) setCompanySettings(data[0]); }
  };

  /* --- Catalog CRUD --- */
  const [catalog, setCatalog] = useState([]);
  const fetchCatalog = async () => { const { data } = await supabase.from('catalog').select('*').order('created_at', { ascending: false }); if (data) setCatalog(data); };
  const addCatalogItem = async (item) => { const { data } = await supabase.from('catalog').insert([item]).select(); if (data) setCatalog(p => [data[0], ...p]); };
  const updateCatalogItem = async (id, updates) => { const { data } = await supabase.from('catalog').update(updates).eq('id', id).select(); if (data) setCatalog(p => p.map(x => x.id === id ? data[0] : x)); };
  const deleteCatalogItem = async (id) => { await supabase.from('catalog').delete().eq('id', id); setCatalog(p => p.filter(x => x.id !== id)); };

  /* --- Mares Breeding CRUD --- */
  const [maresBreeding, setMaresBreeding] = useState([]);
  const fetchMares = async () => { const { data } = await supabase.from('mares_breeding').select('*').order('created_at', { ascending: false }); if (data) setMaresBreeding(data); };
  const addMareBreeding = async (m) => { const { data } = await supabase.from('mares_breeding').insert([m]).select(); if (data) setMaresBreeding(p => [data[0], ...p]); };
  const deleteMareBreeding = async (id) => { await supabase.from('mares_breeding').delete().eq('id', id); setMaresBreeding(p => p.filter(x => x.id !== id)); };

  /* --- Embryos CRUD --- */
  const [embryos, setEmbryos] = useState([]);
  const fetchEmbryos = async () => { const { data } = await supabase.from('embryos').select('*').order('created_at', { ascending: false }); if (data) setEmbryos(data); };
  const addEmbryo = async (e) => { const { data } = await supabase.from('embryos').insert([e]).select(); if (data) setEmbryos(p => [data[0], ...p]); };
  const deleteEmbryo = async (id) => { await supabase.from('embryos').delete().eq('id', id); setEmbryos(p => p.filter(x => x.id !== id)); };

  /* --- Foals CRUD --- */
  const [foals, setFoals] = useState([]);
  const fetchFoals = async () => { const { data } = await supabase.from('foals').select('*').order('birth_date', { ascending: false }); if (data) setFoals(data); };
  const addFoal = async (f) => { const { data } = await supabase.from('foals').insert([f]).select(); if (data) setFoals(p => [data[0], ...p]); };
  const deleteFoal = async (id) => { await supabase.from('foals').delete().eq('id', id); setFoals(p => p.filter(x => x.id !== id)); };

  return (
    <Store.Provider value={{ horses, addHorse, deleteHorse, txns, addTxn, deleteTxn,
      users, addUser, deleteUser, feed, addFeedItem, deleteFeedItem,
      supplies, addSupply, toggleSupplyStatus, deleteSupply,
      tasks, addTask, toggleTask, deleteTask,
      healthRecords, addHealthRecord, toggleHealthRecord, deleteHealthRecord,
      locations, addLocation, deleteLocation,
      contacts, addContact, deleteContact,
      documents, addDocument, deleteDocument,
      clients, addClient, deleteClient,
      bookings, addBooking, updateBooking, deleteBooking,
      invoices, addInvoice, updateInvoice, deleteInvoice,
      companySettings, saveCompanySettings,
      catalog, addCatalogItem, updateCatalogItem, deleteCatalogItem,
      maresBreeding, addMareBreeding, deleteMareBreeding,
      embryos, addEmbryo, deleteEmbryo,
      foals, addFoal, deleteFoal }}>{children}</Store.Provider>
  );
}

/* ============================================================ */
export default function Equivesa() {
  return (
    <StoreProvider>
      <AppRoot />
    </StoreProvider>
  );
}

function AppRoot() {
  const [lang, setLang] = useState("en");
  const [mode, setMode] = useState(null);
  const [active, setActive] = useState("horses");
  const [drawer, setDrawer] = useState(false);
  const [route, setRoute] = useState({ name: "list" });
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const t = I18N[lang];

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (authLoading) return <div style={{ minHeight: "100vh", background: C.bg }} />;
  if (!session) return <AuthScreen t={t} lang={lang} setLang={setLang} />;

  const go = (key) => {
    if (key === "menu") { setDrawer(true); return; }
    setActive(key);
    setRoute({ name: "list" });
    setDrawer(false);
  };

  const pickMode = (m) => {
    setMode(m);
    setActive(m === "groom" ? "feeding" : "horses");
    setRoute({ name: "list" });
    setDrawer(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: "'Montserrat', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .ev-display { font-family: 'Montserrat', sans-serif; letter-spacing: -0.5px; }
        .ev-tap { transition: transform .12s ease, background .15s ease, box-shadow .15s ease; }
        .ev-tap:active { transform: scale(.97); }
        .ev-card { animation: evUp .4s ease both; }
        @keyframes evUp { from { opacity:0; transform: translateY(12px);} to {opacity:1; transform:none;} }
        @keyframes evFade { from {opacity:0;} to {opacity:1;} }
        @media (max-width: 520px) {
          .ev-modal-grid { grid-template-columns: 1fr !important; }
          .ev-modal-panel { max-height: 100vh !important; border-radius: 0 !important; padding: 18px !important; }
          .ev-modal-wrap { padding: 0 !important; align-items: flex-end !important; }
        }
        input, select { font-family: inherit; }
        .ev-scroll::-webkit-scrollbar { width: 0; height: 0; }
      `}</style>

      {mode === null ? (
        <ModeGate t={t} onPick={pickMode} lang={lang} setLang={setLang} />
      ) : (
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <DesktopNav t={t} active={active} go={go} lang={lang} setLang={setLang} mode={mode} setMode={setMode} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <TopBar t={t} active={active} route={route} setRoute={setRoute}
              onMenu={() => setDrawer(true)} lang={lang} setLang={setLang} mode={mode} />
            <main className="ev-scroll" style={{ flex: 1, overflowY: "auto", paddingBottom: 96 }}>
              <Screen active={active} route={route} setRoute={setRoute} t={t} mode={mode} go={go} />
            </main>
          </div>
          <BottomNav t={t} active={active} go={go} mode={mode} />
          {drawer && <Drawer t={t} active={active} go={go} close={() => setDrawer(false)} mode={mode} setMode={setMode} />}
        </div>
      )}
    </div>
  );
}

/* ---------- groom config: only the daily-essential modules ---------- */
const GROOM_KEYS = ["calendar", "feeding", "tasks", "health", "supplies", "horses"];
const GROOM_BOTTOM = ["calendar", "feeding", "tasks", "health", "horses"];
const MODE_PIN = { manager: "1111", groom: "2222" };

/* ---------- Mode chooser (first screen) ---------- */
function ModeGate({ t, onPick, lang, setLang }) {
  const [pending, setPending] = useState(null); // 'groom' | 'manager' awaiting PIN
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column",
      background: C.surface }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 22px",
        borderBottom: `1px solid ${C.line}` }}>
        <Brand />
        <LangMenu lang={lang} setLang={setLang} t={t} />
      </div>
      <div style={{ flex: 1, display: "grid", placeItems: "center", padding: "20px 18px 60px", background: C.bg }}>
        <div style={{ width: "100%", maxWidth: 560, textAlign: "center" }}>
          <h1 className="ev-display" style={{ fontSize: 34, fontWeight: 700, margin: "0 0 8px", letterSpacing: -0.6, color: C.ink }}>
            {t.chooseMode}
          </h1>
          <p style={{ color: C.sub, fontSize: 16, margin: "0 0 32px" }}>{t.chooseModeSub}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            <ModeCard t={t} onClick={() => setPending("groom")} color={C.amber} icon={<Carrot size={34} />}
              title={t.groom} desc={t.groomDesc} />
            <ModeCard t={t} onClick={() => setPending("manager")} color={C.mint} icon={<Sparkles size={34} />}
              title={t.manager} desc={t.managerDesc} />
          </div>
        </div>
      </div>
      {pending && (
        <PinModal t={t} target={pending}
          onClose={() => setPending(null)}
          onOk={() => { const m = pending; setPending(null); onPick(m); }} />
      )}
    </div>
  );
}
function ModeCard({ t, onClick, color, icon, title, desc }) {
  return (
    <button onClick={onClick} className="ev-tap" style={{
      display: "flex", alignItems: "center", gap: 18, width: "100%", textAlign: "left",
      background: C.surface, border: `1px solid ${C.line}`, borderRadius: 22, padding: "22px 22px",
      cursor: "pointer", fontFamily: "inherit", boxShadow: "0 8px 26px rgba(31,45,58,.06)",
    }}>
      <span style={{ width: 64, height: 64, borderRadius: 18, flexShrink: 0, display: "grid", placeItems: "center",
        background: `${color}1f`, color }}>{icon}</span>
      <span style={{ flex: 1 }}>
        <span className="ev-display" style={{ display: "block", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{title}</span>
        <span style={{ display: "block", color: C.sub, fontSize: 14.5, lineHeight: 1.4 }}>{desc}</span>
      </span>
      <ChevronRight size={26} color={color} />
    </button>
  );
}

/* ---------- Desktop sidebar ---------- */
function DesktopNav({ t, active, go, lang, setLang, mode, setMode }) {
  const groom = mode === "groom";
  return (
    <>
      <style>{`@media (max-width: 860px){ .ev-side{ display:none !important; } }`}</style>
      <aside className="ev-side" style={{
        width: 248, flexShrink: 0, background: C.surface, borderRight: `1px solid ${C.line}`,
        padding: "22px 14px", display: "flex", flexDirection: "column", gap: 4,
        height: "100vh", position: "sticky", top: 0, overflowY: "auto",
      }}>
        <Brand />
        <ModeBadge t={t} mode={mode} setMode={setMode} />
        <div style={{ height: 6 }} />
        {groom ? (
          GROOM_KEYS.map((k) => <NavRow key={k} k={k} t={t} active={active} go={go} />)
        ) : (
          <>
            {SECTIONS.general.map((k) => <NavRow key={k} k={k} t={t} active={active} go={go} />)}
            <Group label={t.finance} />
            {SECTIONS.finance.map((k) => <NavRow key={"f-" + k} k={k} t={t} active={active} go={go} fin />)}
            <Group label={t.breeding} />
            {SECTIONS.breeding.map((k) => <NavRow key={"b-" + k} k={k} t={t} active={active} go={go} fin />)}
            <div style={{ flex: 1 }} />
            <NavRow k="users" t={t} active={active} go={go} />
            <NavRow k="settings" t={t} active={active} go={go} />
            <NavRow k="help" t={t} active={active} go={go} />
          </>
        )}
        {groom && <div style={{ flex: 1 }} />}
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
          color: C.sub, padding: "12px 12px 6px" }}>{t.language}</div>
        <LangPicker lang={lang} setLang={setLang} block />
      </aside>
    </>
  );
}

/* ---------- mode badge + switcher ---------- */
function ModeBadge({ t, mode, setMode, inDrawer }) {
  const [pinOpen, setPinOpen] = useState(false);
  const groom = mode === "groom";
  const color = groom ? C.amber : C.mint;
  const label = groom ? t.groomMode : t.managerMode;

  const onSwitch = () => {
    if (groom) { setPinOpen(true); }   // groom locked → needs manager PIN to switch
    else { setMode(null); }            // manager → free, back to chooser
  };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 6px 4px",
        background: `${color}14`, borderRadius: 12, padding: "8px 10px" }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: color }} />
        <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color }}>{label}</span>
        <button onClick={onSwitch} className="ev-tap" title={t.switchMode} style={{
          border: "none", background: "transparent", cursor: "pointer", color, padding: 2,
          fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>{t.switchMode}</button>
      </div>
      {pinOpen && <PinModal t={t} target="manager" onClose={() => setPinOpen(false)}
        onOk={() => { setPinOpen(false); setMode(null); }} />}
    </>
  );
}

/* PIN gate: each mode has its own code (manager 1111 / groom 2222) */
function PinModal({ t, target, onClose, onOk }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const accent = target === "groom" ? C.amber : C.mint;
  const check = () => { if (pin === MODE_PIN[target]) onOk(); else setErr(true); };
  return (
    <ModalShell t={t} onClose={onClose} accent={accent}
      icon={target === "groom" ? <Carrot size={22} /> : <Sparkles size={22} />}
      title={target === "groom" ? t.groom : t.manager}>
      <p style={{ color: C.sub, fontSize: 14.5, margin: "0 0 16px" }}>{t.pinHint}</p>
      <input value={pin} onChange={(e) => { setPin(e.target.value); setErr(false); }}
        onKeyDown={(e) => e.key === "Enter" && check()}
        type="password" inputMode="numeric" placeholder="••••" autoFocus
        style={{ ...inputStyle(err), textAlign: "center", fontSize: 26, letterSpacing: 8, fontWeight: 700, color: accent }} />
      {err && <div style={{ color: C.coral, fontSize: 13, marginTop: 8 }}>{t.wrongPin}</div>}
      <ModalFooter t={t} onClose={onClose} onSave={check} accent={accent} saveLabel={t.enter} saveIcon={<Check size={20} />} />
    </ModalShell>
  );
}
function Brand() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "0 6px" }}>
      <img src="/logo.svg" alt="Equiviesa Logo" style={{ width: 38, height: 38, objectFit: "contain" }} />
      <div className="ev-display" style={{ fontSize: 21, fontWeight: 700, letterSpacing: -0.3 }}>Equiviesa</div>
    </div>
  );
}
function Group({ label }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
      color: C.sub, padding: "16px 12px 6px" }}>{label}</div>
  );
}
function NavRow({ k, t, active, go, fin }) {
  const Icon = ICONS[k] || Home;
  const on = active === k;
  return (
    <button onClick={() => go(k)} className="ev-tap" style={{
      display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 12px",
      border: "none", borderRadius: 12, cursor: "pointer",
      background: on ? C.mintSoft : "transparent", color: C.ink, textAlign: "left",
      fontSize: 15, fontWeight: on ? 600 : 500, fontFamily: "inherit",
    }}>
      <span style={{
        width: 30, height: 30, borderRadius: 9, display: "grid", placeItems: "center",
        background: fin ? `${ACCENT[k] || C.sky}22` : (on ? "#fff" : "transparent"),
        color: on ? C.mint : (fin ? (ACCENT[k] || C.sky) : C.sub),
      }}><Icon size={18} strokeWidth={2.1} /></span>
      {t[k]}
    </button>
  );
}

/* ---------- Top bar ---------- */
function TopBar({ t, active, route, setRoute, onMenu, lang, setLang }) {
  const inSub = active === "horses" && route.name !== "list";
  const title = active === "menu" ? t.menu : t[active];
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 20, background: "rgba(255,255,255,.85)",
      backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.line}`,
      padding: "14px 18px", display: "flex", alignItems: "center", gap: 12,
    }}>
      {inSub ? (
        <button onClick={() => setRoute({ name: "list" })} className="ev-tap" style={iconBtn}>
          <ChevronLeft size={22} />
        </button>
      ) : (
        <button onClick={onMenu} className="ev-tap ev-burger" style={{ ...iconBtn, display: "none" }}>
          <Menu size={22} />
        </button>
      )}
      <style>{`@media (max-width: 860px){ .ev-burger{ display:grid !important; } }`}</style>
      <h1 className="ev-display" style={{ margin: 0, fontSize: 24, fontWeight: 700, flex: 1, letterSpacing: -0.4 }}>
        {inSub ? (route.name === "add" ? t.add : t.profile) : title}
      </h1>
      <LangMenu lang={lang} setLang={setLang} t={t} />
      <button className="ev-tap" style={iconBtn}><Bell size={20} /></button>
      {active === "horses" && route.name === "list" && (
        <button onClick={() => setRoute({ name: "add" })} className="ev-tap"
          style={{ ...iconBtn, background: C.mint, color: "#fff", boxShadow: "0 4px 12px rgba(47,182,160,.4)" }}>
          <Plus size={22} />
        </button>
      )}
    </header>
  );
}
const iconBtn = {
  width: 42, height: 42, borderRadius: 12, border: "none", cursor: "pointer",
  background: C.surface, boxShadow: `inset 0 0 0 1px ${C.line}`,
  display: "grid", placeItems: "center", color: C.ink, flexShrink: 0,
};

function LangPicker({ lang, setLang, block }) {
  return (
    <div style={{ display: "flex", gap: 2, background: C.bg, borderRadius: 11, padding: 3,
      width: block ? "100%" : "auto", justifyContent: "center" }}>
      {["en", "nl", "es"].map((l) => (
        <button key={l} onClick={() => setLang(l)} className="ev-tap" style={{
          border: "none", cursor: "pointer", borderRadius: 9, padding: "6px 12px",
          fontSize: 13, fontWeight: 600, fontFamily: "inherit", flex: block ? 1 : "none",
          background: lang === l ? C.surface : "transparent", color: lang === l ? C.mint : C.sub,
          boxShadow: lang === l ? "0 1px 4px rgba(0,0,0,.08)" : "none",
        }}>{I18N[l].code}</button>
      ))}
    </div>
  );
}

function LangMenu({ lang, setLang, t }) {
  const [open, setOpen] = useState(false);
  const langs = [["en","English"],["nl","Nederlands"],["es","Español"]];
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)} className="ev-tap" aria-label={t.language}
        style={{ ...iconBtn, gap: 5, width: "auto", padding: "0 12px",
          background: open ? C.mintSoft : C.surface, color: open ? C.mint : C.ink }}>
        <Globe size={19} />
        <span style={{ fontSize: 13, fontWeight: 700 }}>{I18N[lang].code}</span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{ position: "absolute", top: 50, right: 0, zIndex: 41, background: C.surface,
            borderRadius: 14, border: `1px solid ${C.line}`, boxShadow: "0 12px 34px rgba(31,45,58,.18)",
            padding: 6, minWidth: 168, animation: "evUp .18s ease both" }}>
            {langs.map(([l, label]) => (
              <button key={l} onClick={() => { setLang(l); setOpen(false); }} className="ev-tap" style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", border: "none",
                background: lang === l ? C.mintSoft : "transparent", cursor: "pointer", borderRadius: 10,
                padding: "11px 12px", fontFamily: "inherit", fontSize: 15,
                fontWeight: lang === l ? 600 : 500, color: C.ink, textAlign: "left",
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: lang === l ? C.mint : C.sub,
                  width: 26 }}>{I18N[l].code}</span>
                {label}
                {lang === l && <Check size={17} color={C.mint} style={{ marginLeft: "auto" }} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function BottomNav({ t, active, go, mode }) {
  const groom = mode === "groom";
  const items = groom ? GROOM_BOTTOM : BOTTOM;
  return (
    <>
      <style>{`@media (min-width: 861px){ .ev-bottom{ display:none !important; } }`}</style>
      <nav className="ev-bottom" style={{
        position: "fixed", bottom: 14, left: 14, right: 14, zIndex: 30,
        background: "rgba(255,255,255,.92)", backdropFilter: "blur(14px)", borderRadius: 22,
        boxShadow: "0 8px 30px rgba(31,45,58,.14)", border: `1px solid ${C.line}`,
        padding: groom ? "10px 6px" : "8px 6px", display: "flex", justifyContent: "space-around",
      }}>
        {items.map((k) => {
          const Icon = k === "menu" ? Menu : ICONS[k];
          const on = active === k;
          const accent = groom ? C.amber : C.mint;
          const softAccent = groom ? `${C.amber}1f` : C.mintSoft;
          return (
            <button key={k} onClick={() => go(k)} className="ev-tap" style={{
              border: "none", background: "transparent", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              padding: groom ? "8px 4px" : "6px 4px", flex: 1, color: on ? accent : C.sub, fontFamily: "inherit",
            }}>
              <span style={{ width: groom ? 46 : 38, height: groom ? 36 : 30, borderRadius: 12, display: "grid", placeItems: "center",
                background: on ? softAccent : "transparent" }}>
                <Icon size={groom ? 25 : 21} strokeWidth={on ? 2.4 : 2} />
              </span>
              <span style={{ fontSize: groom ? 12 : 10.5, fontWeight: on ? 700 : 500 }}>{t[k]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

function Drawer({ t, active, go, close, mode, setMode }) {
  const groom = mode === "groom";
  const renderGroup = (label, keys, fin) => (
    <>
      {label && <Group label={label} />}
      {keys.map((k, i) => {
        const Icon = ICONS[k] || Home;
        const on = active === k;
        return (
          <button key={k + i} onClick={() => go(k)} className="ev-tap" style={{
            display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "14px 14px",
            border: "none", borderRadius: 14, cursor: "pointer",
            background: on ? C.mintSoft : "transparent", color: C.ink, textAlign: "left",
            fontSize: 17, fontWeight: on ? 600 : 500, fontFamily: "inherit",
          }}>
            <span style={{ width: 40, height: 40, borderRadius: 11, display: "grid", placeItems: "center",
              background: fin ? `${ACCENT[k] || C.sky}22` : C.bg,
              color: fin ? (ACCENT[k] || C.sky) : (on ? C.mint : C.sub) }}>
              <Icon size={21} strokeWidth={2.1} />
            </span>{t[k]}
          </button>
        );
      })}
    </>
  );
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, animation: "evFade .2s ease" }}>
      <div onClick={close} style={{ position: "absolute", inset: 0, background: "rgba(31,45,58,.4)" }} />
      <div className="ev-scroll" style={{
        position: "absolute", top: 0, left: 0, bottom: 0, width: "84%", maxWidth: 340,
        background: C.surface, padding: 18, overflowY: "auto",
        animation: "evSlide .26s cubic-bezier(.2,.8,.2,1)", boxShadow: "12px 0 40px rgba(0,0,0,.18)",
      }}>
        <style>{`@keyframes evSlide{from{transform:translateX(-100%)}to{transform:none}}`}</style>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Brand />
          <button onClick={close} className="ev-tap" style={{ ...iconBtn, boxShadow: "none", background: C.bg }}>
            <X size={22} />
          </button>
        </div>
        <ModeBadge t={t} mode={mode} setMode={setMode} inDrawer />
        <div style={{ height: 6 }} />
        {groom ? (
          renderGroup(null, GROOM_KEYS)
        ) : (
          <>
            {renderGroup(null, SECTIONS.general)}
            {renderGroup(t.finance, SECTIONS.finance, true)}
            {renderGroup(t.breeding, SECTIONS.breeding, true)}
            <Group label="" />
            {renderGroup(null, ["users", "settings", "help"])}
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   SCREENS
   ============================================================ */
function Screen({ active, route, setRoute, t }) {
  const wrap = { maxWidth: 920, margin: "0 auto", padding: "22px 18px" };
  if (active === "horses") {
    if (route.name === "add") return <div style={wrap}><HorseForm t={t} onDone={() => setRoute({ name: "list" })} /></div>;
    if (route.name === "detail") return <div style={wrap}><HorseDetail t={t} id={route.id} setRoute={setRoute} /></div>;
    return <div style={wrap}><HorsesList t={t} setRoute={setRoute} /></div>;
  }
  if (active === "calendar") return <div style={wrap}><CalendarScreen t={t} /></div>;
  if (active === "tasks") return <div style={wrap}><TasksScreen t={t} /></div>;
  if (active === "health") return <div style={wrap}><HealthScreen t={t} /></div>;
  if (active === "finance") return <div style={wrap}><FinanceScreen t={t} /></div>;
  if (active === "users") return <div style={wrap}><UsersScreen t={t} /></div>;
  if (active === "feeding") return <div style={wrap}><FeedingScreen t={t} setRoute={setRoute} /></div>;
  if (active === "supplies") return <div style={wrap}><SuppliesScreen t={t} /></div>;
  if (active === "locations") return <div style={wrap}><LocationsScreen t={t} /></div>;
  if (active === "contacts") return <div style={wrap}><ContactsScreen t={t} /></div>;
  if (active === "documents") return <div style={wrap}><DocumentsScreen t={t} /></div>;
  if (active === "clients") return <div style={wrap}><ClientsScreen t={t} /></div>;
  if (active === "bookings") return <div style={wrap}><BookingsScreen t={t} /></div>;
  if (active === "invoices") return <div style={wrap}><InvoicesScreen t={t} /></div>;
  if (active === "mares") return <div style={wrap}><MaresScreen t={t} /></div>;
  if (active === "embryos") return <div style={wrap}><EmbryosScreen t={t} /></div>;
  if (active === "foals") return <div style={wrap}><FoalsScreen t={t} /></div>;
  if (active === "catalog") return <div style={wrap}><CatalogScreen t={t} /></div>;
  return <div style={wrap}><PlaceholderScreen t={t} active={active} /></div>;
}

/* ---------- Horses: list (data-driven) ---------- */
function HorsesList({ t, setRoute }) {
  const { horses } = useStore();
  const [q, setQ] = useState("");
  const [tab, setTab] = useState(0); // 0 active 1 archived
  const filtered = useMemo(() => horses.filter((h) =>
    (tab === 0 ? !h.archived : h.archived) &&
    h.name.toLowerCase().includes(q.toLowerCase())), [horses, q, tab]);

  if (horses.length === 0) {
    return (
      <div className="ev-card">
        <EmptyHero accent={C.mint} icon={<Home size={46} strokeWidth={1.6} />}
          title={t.noHorses} sub={t.noHorsesSub} cta={t.addHorse}
          onClick={() => setRoute({ name: "add" })} />
      </div>
    );
  }
  return (
    <div className="ev-card">
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
        <span style={{ color: C.sub, fontSize: 15, fontWeight: 600 }}>{t.horseCount(filtered.length)}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.surface,
        border: `1px solid ${C.line}`, borderRadius: 14, padding: "13px 16px", marginBottom: 14 }}>
        <Search size={20} color={C.sub} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search + "…"}
          style={{ border: "none", outline: "none", background: "transparent", fontSize: 15, flex: 1, color: C.ink }} />
      </div>
      <div style={{ display: "inline-flex", gap: 2, background: C.bg, borderRadius: 12, padding: 3, marginBottom: 18 }}>
        {[t.active, t.archived].map((label, i) => (
          <button key={i} onClick={() => setTab(i)} className="ev-tap" style={{
            border: "none", cursor: "pointer", borderRadius: 9, padding: "8px 16px",
            fontSize: 14, fontWeight: 600, fontFamily: "inherit",
            background: tab === i ? C.surface : "transparent", color: tab === i ? C.ink : C.sub,
            boxShadow: tab === i ? "0 1px 4px rgba(0,0,0,.08)" : "none",
          }}>{label}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", color: C.sub, padding: "50px 0", fontStyle: "italic" }}>{t.noResults}</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
          {filtered.map((h) => <HorseCard key={h.id} h={h} t={t} onClick={() => setRoute({ name: "detail", id: h.id })} />)}
        </div>
      )}
    </div>
  );
}

function HorseAvatar({ h, size = 52 }) {
  if (h.photo_url) {
    return (
      <img src={h.photo_url} alt={h.name} style={{ width: size, height: size, borderRadius: "32%", objectFit: "cover", flexShrink: 0 }} />
    );
  }
  return (
    <span style={{
      width: size, height: size, borderRadius: "32%", flexShrink: 0,
      background: `linear-gradient(135deg, ${h.tint}, ${h.tint}99)`,
      display: "grid", placeItems: "center", color: "#fff",
      fontWeight: 700, fontSize: size * 0.42, fontFamily: "'Montserrat',sans-serif",
    }}>{(h.name || "?").charAt(0).toUpperCase()}</span>
  );
}

function HorseCard({ h, t, onClick }) {
  return (
    <button onClick={onClick} className="ev-tap" style={{
      display: "flex", alignItems: "center", gap: 14, width: "100%",
      background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18,
      padding: 16, cursor: "pointer", textAlign: "left", fontFamily: "inherit",
    }}>
      <HorseAvatar h={h} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: C.ink }}>{h.name}</div>
        <div style={{ fontSize: 13, color: C.sub, marginTop: 2 }}>
          {[h.sex && t[h.sex], h.studbook].filter(Boolean).join(" · ") || t.profile}
        </div>
      </div>
      <ChevronRight size={20} color={C.sub} />
    </button>
  );
}

/* ---------- Horses: add form ---------- */
const SEX_OPTS = ["sexMare", "sexStallion", "sexGelding"];
const BREEDS = [
  "KWPN", "Holsteiner", "Hannoveraner", "Oldenburger", "Selle Français", "BWP", "Westfalen",
  "Trakehner", "Irish Sport Horse", "Thoroughbred", "Arabian", "Friesian", "Lusitano",
  "Andalusian (PRE)", "Quarter Horse", "Warmblood", "Welsh Pony", "Haflinger", "Connemara",
  "Shetland Pony", "New Forest", "Icelandic", "Lipizzaner", "Appaloosa", "Paint Horse",
  "Morgan", "Clydesdale", "Shire", "Knabstrupper", "Fjord", "Dartmoor Pony", "Other",
];
const DISCIPLINES = [
  "Show Jumping", "Dressage", "Eventing", "Hunter", "Equitation", "Reining", "Western Pleasure",
  "Endurance", "Driving", "Polo", "Vaulting", "Para-Dressage", "Cross Country", "Show Hack",
  "Trail Riding", "Pleasure", "Breeding", "Liberty", "Working Equitation", "Mounted Games", "Other",
];
const HORSE_TYPES = [
  "Sport Horse", "Pony", "Warmblood", "Coldblood", "Thoroughbred", "Draft Horse",
  "Miniature Horse", "Gaited Horse", "Stock Horse", "Baroque Horse", "Other",
];
const COLORS_LIST = [
  "Bay", "Chestnut", "Black", "Grey", "Palomino", "Buckskin", "Dun", "Roan",
  "Pinto", "Appaloosa", "Cremello", "Dapple Grey", "Liver Chestnut", "Dark Bay",
  "Flaxen", "Tobiano", "Overo", "Sabino", "Other",
];

function HorseForm({ t, onDone }) {
  const { addHorse } = useStore();
  const [f, setF] = useState({
    name: "", studbook: "", sex: "", color: "", birthdate: "", ueln: "", chip: "",
    feiid: "", location: "", photo_url: "", breed: "", discipline: "", horse_type: ""
  });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "equivesa_uploads");
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "daj1lyfgk";
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.secure_url) setF(prev => ({ ...prev, photo_url: data.secure_url }));
    } catch (err) { console.error(err); alert("Upload failed."); }
    finally { setUploading(false); }
  };

  const submit = () => {
    if (!f.name.trim()) { setErr(true); return; }
    addHorse(f);
    onDone();
  };

  return (
    <div className="ev-card" style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={onDone} className="ev-tap" style={{ ...iconBtn, boxShadow: "none", background: C.bg }}>
          <ChevronLeft size={22} />
        </button>
        <h2 className="ev-display" style={{ flex: 1, margin: 0, fontSize: 22, fontWeight: 700 }}>{t.addHorse}</h2>
      </div>

      {/* Photo upload */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
        <label style={{
          width: 110, height: 110, borderRadius: "30%", border: `2px dashed ${C.line}`,
          background: C.field, cursor: "pointer", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 6,
          color: C.sub, overflow: "hidden", position: "relative",
          transition: "border-color .2s",
        }}>
          {f.photo_url ? (
            <img src={f.photo_url} alt="Horse" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
          ) : uploading ? (
            <span style={{ fontSize: 13, fontWeight: 600 }}>Uploading...</span>
          ) : (
            <><Camera size={28} /><span style={{ fontSize: 11, fontWeight: 600 }}>{t.photo}</span></>
          )}
          <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
        </label>
      </div>

      {/* Name - required */}
      <Field label={t.name} required>
        <input value={f.name} onChange={(e) => { set("name")(e); setErr(false); }}
          placeholder={t.name + " *"} style={inputStyle(err)} />
      </Field>
      {err && <div style={{ color: C.coral, fontSize: 13, marginTop: -8, marginBottom: 10 }}>{t.nameRequired}</div>}

      <Divider label={t.optional} />

      {/* Sex & Type - side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label={t.sex}>
          <select value={f.sex} onChange={set("sex")} style={{ ...inputStyle(), color: f.sex ? C.ink : C.sub }}>
            <option value="">{t.select}</option>
            {SEX_OPTS.map((s) => <option key={s} value={s}>{t[s]}</option>)}
          </select>
        </Field>
        <Field label="Type">
          <select value={f.horse_type} onChange={set("horse_type")} style={{ ...inputStyle(), color: f.horse_type ? C.ink : C.sub }}>
            <option value="">{t.select}</option>
            {HORSE_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>
      </div>

      {/* Breed & Discipline - side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Breed">
          <select value={f.breed} onChange={set("breed")} style={{ ...inputStyle(), color: f.breed ? C.ink : C.sub }}>
            <option value="">{t.select}</option>
            {BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>
        <Field label="Discipline">
          <select value={f.discipline} onChange={set("discipline")} style={{ ...inputStyle(), color: f.discipline ? C.ink : C.sub }}>
            <option value="">{t.select}</option>
            {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
      </div>

      {/* Color & Studbook - side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label={t.color}>
          <select value={f.color} onChange={set("color")} style={{ ...inputStyle(), color: f.color ? C.ink : C.sub }}>
            <option value="">{t.select}</option>
            {COLORS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label={t.studbook}>
          <input value={f.studbook} onChange={set("studbook")} placeholder={t.studbook} style={inputStyle()} />
        </Field>
      </div>

      {/* Birthdate & Location - side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label={t.birthdate}>
          <input type="date" value={f.birthdate} onChange={set("birthdate")} style={inputStyle()} />
        </Field>
        <Field label={t.location}>
          <input value={f.location} onChange={set("location")} placeholder={t.location} style={inputStyle()} />
        </Field>
      </div>

      <Divider label="ID" />

      {/* UELN & Chip - side by side */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label={t.ueln}><input value={f.ueln} onChange={set("ueln")} placeholder="UELN" style={inputStyle()} /></Field>
        <Field label={t.chip}><input value={f.chip} onChange={set("chip")} placeholder={t.chip} style={inputStyle()} /></Field>
      </div>
      <Field label={t.feiid}><input value={f.feiid} onChange={set("feiid")} placeholder="FEI ID" style={inputStyle()} /></Field>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button onClick={onDone} className="ev-tap" style={{
          flex: 1, padding: "15px", borderRadius: 14, border: `1px solid ${C.line}`,
          background: C.surface, color: C.ink, fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}>{t.cancel}</button>
        <button onClick={submit} className="ev-tap" style={{
          flex: 2, padding: "15px", borderRadius: 14, border: "none",
          background: C.mint, color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer",
          fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          boxShadow: "0 8px 22px rgba(47,182,160,.4)",
        }}><Check size={20} /> {t.save}</button>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 6, paddingLeft: 2 }}>
        {label}{required && <span style={{ color: C.coral }}> *</span>}
      </label>
      {children}
    </div>
  );
}
const inputStyle = (err) => ({
  width: "100%", padding: "14px 16px", borderRadius: 14, fontSize: 16,
  border: `1.5px solid ${err ? C.coral : "transparent"}`, background: C.field,
  color: C.ink, outline: "none", boxSizing: "border-box",
  WebkitAppearance: "none", MozAppearance: "none", appearance: "none",
  fontFamily: "inherit", minHeight: 50,
});
function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "22px 0 18px" }}>
      <div style={{ flex: 1, height: 1, background: C.line }} />
      <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: C.line }} />
    </div>
  );
}

/* ---------- Horses: detail ---------- */
function HorseDetail({ t, id, setRoute }) {
  const { horses, deleteHorse } = useStore();
  const h = horses.find((x) => x.id === id);
  if (!h) { setRoute({ name: "list" }); return null; }

  const rows = [
    [t.studbook, h.studbook], [t.sex, h.sex && t[h.sex]], [t.color, h.color],
    [t.birthdate, h.birthdate], [t.ueln, h.ueln], [t.chip, h.chip],
    [t.feiid, h.feiid], [t.location, h.location],
  ].filter(([, v]) => v);

  const del = () => { deleteHorse(id); setRoute({ name: "list" }); };

  return (
    <div className="ev-card" style={{ maxWidth: 620, margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 24 }}>
        <HorseAvatar h={h} size={96} />
        <h2 className="ev-display" style={{ fontSize: 30, fontWeight: 700, margin: "16px 0 4px" }}>{h.name}</h2>
        <div style={{ color: C.sub, fontSize: 15 }}>
          {[h.sex && t[h.sex], h.studbook].filter(Boolean).join(" · ")}
        </div>
      </div>

      {/* quick module links — connects horse to the rest of the app */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 22 }}>
        {[["health", Heart], ["tasks", CheckSquare], ["calendar", Calendar]].map(([k, Icon]) => (
          <div key={k} style={{
            background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px 8px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, display: "grid", placeItems: "center",
              background: `${ACCENT[k]}1f`, color: ACCENT[k] }}><Icon size={20} /></span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{t[k]}</span>
          </div>
        ))}
      </div>

      {rows.length > 0 && (
        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, overflow: "hidden", marginBottom: 18 }}>
          {rows.map(([label, val], i) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "15px 18px",
              borderTop: i ? `1px solid ${C.line}` : "none" }}>
              <span style={{ color: C.sub, fontSize: 15 }}>{label}</span>
              <span style={{ fontWeight: 600, fontSize: 15 }}>{val}</span>
            </div>
          ))}
        </div>
      )}

      <button onClick={del} className="ev-tap" style={{
        width: "100%", padding: "14px", borderRadius: 14, border: `1px solid ${C.coral}44`,
        background: `${C.coral}12`, color: C.coral, fontSize: 15, fontWeight: 600, cursor: "pointer",
        fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}><Trash2 size={18} /> {t.delete}</button>
    </div>
  );
}

/* ---------- Calendar ---------- */
function CalendarScreen({ t }) {
  const { tasks, healthRecords, horses } = useStore();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selDay, setSelDay] = useState(null);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const pad = (n) => String(n).padStart(2, "0");
  const dayStr = (d) => `${year}-${pad(month + 1)}-${pad(d)}`;

  // Build events map: "YYYY-MM-DD" -> [{...}]
  const events = useMemo(() => {
    const map = {};
    tasks.forEach(tk => {
      if (!tk.due_date) return;
      const key = tk.due_date.slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push({ type: "task", title: tk.title, color: C.amber, done: tk.is_completed });
    });
    healthRecords.forEach(hr => {
      if (!hr.scheduled_date) return;
      const key = hr.scheduled_date.slice(0, 10);
      if (!map[key]) map[key] = [];
      const horse = horses.find(h => h.id === hr.horse_id);
      map[key].push({ type: "health", title: `${t[hr.category] || hr.category}${horse ? " · " + horse.name : ""}`, color: C.coral, done: hr.completed });
    });
    return map;
  }, [tasks, healthRecords, horses, t]);

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); setSelDay(null); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); setSelDay(null); };

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selEvents = selDay ? (events[dayStr(selDay)] || []) : [];

  return (
    <div className="ev-card">
      {/* Month Navigator */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <button onClick={prev} className="ev-tap" style={{ ...iconBtn, boxShadow: "none", background: C.bg }}>
          <ChevronLeft size={22} />
        </button>
        <h2 className="ev-display" style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
          {cap(t.months[month])} <span style={{ color: C.sub }}>{year}</span>
        </h2>
        <button onClick={next} className="ev-tap" style={{ ...iconBtn, boxShadow: "none", background: C.bg }}>
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Weekday Headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, textAlign: "center", marginBottom: 4 }}>
        {t.weekdays.map(d => (
          <div key={d} style={{ fontSize: 12, color: C.sub, fontWeight: 700, padding: "6px 0", textTransform: "uppercase" }}>{d}</div>
        ))}
      </div>

      {/* Day Cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={`e${i}`} />;
          const ds = dayStr(d);
          const isToday = ds === todayStr;
          const isSel = selDay === d;
          const evs = events[ds] || [];
          return (
            <button key={d} onClick={() => setSelDay(d === selDay ? null : d)} className="ev-tap" style={{
              border: isSel ? `2px solid ${C.mint}` : "1px solid transparent", borderRadius: 14, padding: "8px 2px",
              background: isToday ? C.mintSoft : isSel ? `${C.mint}0d` : "transparent",
              cursor: "pointer", textAlign: "center", fontFamily: "inherit", minHeight: 52,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            }}>
              <span style={{ fontSize: 15, fontWeight: isToday ? 800 : 500, color: isToday ? C.mint : C.ink,
                width: 30, height: 30, lineHeight: "30px", borderRadius: "50%",
                background: isToday ? C.mint : "transparent", color: isToday ? "#fff" : C.ink,
                display: "inline-block" }}>{d}</span>
              {evs.length > 0 && (
                <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
                  {evs.slice(0, 3).map((ev, j) => (
                    <span key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: ev.color }} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Detail */}
      {selDay && (
        <div style={{ marginTop: 18, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, padding: 18 }}>
          <h3 className="ev-display" style={{ fontSize: 17, fontWeight: 700, margin: "0 0 12px" }}>
            {selDay} {cap(t.months[month])} {year}
          </h3>
          {selEvents.length === 0 ? (
            <div style={{ color: C.sub, fontStyle: "italic", fontSize: 14 }}>{t.nothingPlanned}</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {selEvents.map((ev, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                  background: `${ev.color}12`, borderRadius: 12, border: `1px solid ${ev.color}33` }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: ev.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.ink,
                    textDecoration: ev.done ? "line-through" : "none", opacity: ev.done ? 0.6 : 1 }}>{ev.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Tasks ---------- */
function TasksScreen({ t }) {
  const { tasks, addTask, toggleTask, deleteTask, horses } = useStore();
  const [tab, setTab] = useState(0); // 0 = open, 1 = completed
  const [modal, setModal] = useState(false);

  const filtered = tasks.filter(tk => tab === 0 ? !tk.is_completed : tk.is_completed);

  return (
    <div className="ev-card">
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ display: "inline-flex", gap: 2, background: C.bg, borderRadius: 12, padding: 3 }}>
          {[t.open, t.completedTasks].map((label, i) => (
            <button key={i} onClick={() => setTab(i)} className="ev-tap" style={{
              border: "none", cursor: "pointer", borderRadius: 9, padding: "8px 16px",
              fontSize: 14, fontWeight: 600, fontFamily: "inherit",
              background: tab === i ? C.surface : "transparent", color: tab === i ? C.ink : C.sub,
              boxShadow: tab === i ? "0 1px 4px rgba(0,0,0,.08)" : "none",
            }}>{label}</button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={() => setModal(true)} className="ev-tap" style={{
          display: "flex", alignItems: "center", gap: 8, border: "none", cursor: "pointer", fontFamily: "inherit",
          background: C.amber, color: "#fff", fontSize: 15, fontWeight: 600, padding: "11px 18px", borderRadius: 13,
          boxShadow: `0 6px 16px ${C.amber}66`, whiteSpace: "nowrap" }}>
          <Plus size={19} /> {t.addTask}
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyHero accent={C.amber} icon={<CheckSquare size={46} strokeWidth={1.6} />}
          title={tab === 0 ? t.noTasks : t.completedTasks} sub={tab === 0 ? t.noTasksSub : ""}
          cta={tab === 0 ? t.addTask : undefined} onClick={tab === 0 ? () => setModal(true) : undefined} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(tk => {
            const horse = horses.find(h => h.id === tk.horse_id);
            return (
              <div key={tk.id} style={{
                background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, padding: 16,
                display: "flex", alignItems: "flex-start", gap: 14, opacity: tk.is_completed ? 0.7 : 1
              }}>
                <button onClick={() => toggleTask(tk.id)} className="ev-tap" style={{
                  width: 28, height: 28, borderRadius: 9, border: `1.5px solid ${tk.is_completed ? C.mint : C.line}`,
                  background: tk.is_completed ? C.mintSoft : "transparent", cursor: "pointer",
                  display: "grid", placeItems: "center", color: C.mint, padding: 0, flexShrink: 0, marginTop: 2
                }}>
                  {tk.is_completed && <Check size={18} strokeWidth={3} />}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: tk.is_completed ? C.sub : C.ink,
                    textDecoration: tk.is_completed ? "line-through" : "none" }}>{tk.title}</div>
                  {tk.description && <div style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>{tk.description}</div>}
                  <div style={{ fontSize: 12, color: C.sub, marginTop: 6, display: "flex", flexWrap: "wrap", gap: "4px 12px" }}>
                    {tk.due_date && <span>📅 {tk.due_date.slice(0, 10)}</span>}
                    {horse && <span>🐴 {horse.name}</span>}
                    {tk.category && <span style={{ padding: "2px 8px", borderRadius: 8, background: tk.category === "horse" ? C.mintSoft : C.bg,
                      fontSize: 11, fontWeight: 600 }}>{tk.category === "horse" ? t.horses : t.general}</span>}
                  </div>
                </div>
                <button onClick={() => deleteTask(tk.id)} className="ev-tap" style={{
                  border: "none", background: "transparent", cursor: "pointer", color: C.sub, padding: 6 }}>
                  <Trash2 size={17} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {modal && <TaskModal t={t} horses={horses} onClose={() => setModal(false)}
        onSave={(task) => { addTask(task); setModal(false); }} />}
    </div>
  );
}

function TaskModal({ t, horses, onClose, onSave }) {
  const [f, setF] = useState({ title: "", description: "", due_date: "", category: "general", horse_id: null });
  const [err, setErr] = useState(false);

  const save = () => {
    if (!f.title.trim()) { setErr(true); return; }
    onSave(f);
  };

  return (
    <ModalShell t={t} onClose={onClose} accent={C.amber} icon={<CheckSquare size={22} />} title={t.addTask}>
      <Field label={t.taskTitle} required>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {(t.taskCommon || []).map(s => (
            <button key={s} type="button" onClick={() => { setF({...f, title: s}); setErr(false); }}
              className="ev-tap"
              style={{
                padding: "8px 14px", borderRadius: 16, border: `1px solid ${f.title === s ? C.amber : C.line}`,
                background: f.title === s ? C.amber : C.field,
                color: f.title === s ? "#fff" : C.sub,
                fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600
              }}>
              {s}
            </button>
          ))}
        </div>
        <input value={f.title} onChange={(e) => { setF({...f, title: e.target.value}); setErr(false); }}
          placeholder={t.taskTitle} style={inputStyle(err)} />
      </Field>
      {err && <div style={{ color: C.coral, fontSize: 13, marginTop: -8, marginBottom: 10 }}>{t.taskTitle} {t.required}</div>}

      <Field label={t.taskDesc}>
        <textarea value={f.description} onChange={(e) => setF({...f, description: e.target.value})}
          rows={2} style={{ ...inputStyle(), resize: "none" }} placeholder={t.notesHint} />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label={t.taskDue}>
          <input type="date" value={f.due_date} onChange={(e) => setF({...f, due_date: e.target.value})}
            style={inputStyle()} />
        </Field>
        <Field label={t.taskHorse}>
          <select value={f.horse_id || ""} onChange={(e) => setF({...f, horse_id: e.target.value || null, category: e.target.value ? "horse" : "general"})}
            style={inputStyle()}>
            <option value="">{t.general}</option>
            {horses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
        </Field>
      </div>

      <ModalFooter t={t} onClose={onClose} onSave={save} accent={C.amber} saveLabel={t.add} saveIcon={<Plus size={20} />} />
    </ModalShell>
  );
}

/* ---------- Health ---------- */
function HealthScreen({ t }) {
  const { healthRecords, addHealthRecord, toggleHealthRecord, deleteHealthRecord, horses } = useStore();
  const [activeCat, setActiveCat] = useState(null); // null = overview, string = category subpage
  const [modal, setModal] = useState(null); // null or category string

  // Count per category
  const counts = useMemo(() => {
    const c = {};
    HEALTH_CATS.forEach(([key]) => { c[key] = 0; });
    healthRecords.forEach(hr => { if (c[hr.category] !== undefined) c[hr.category]++; });
    return c;
  }, [healthRecords]);

  // If a category is selected, show its subpage
  if (activeCat) {
    const catRecords = healthRecords.filter(hr => hr.category === activeCat);
    const catMeta = HEALTH_CATS.find(c => c[0] === activeCat);
    const CatIcon = catMeta ? catMeta[1] : Heart;
    const catColor = catMeta ? catMeta[2] : C.coral;

    return (
      <div className="ev-card">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => setActiveCat(null)} className="ev-tap" style={{ ...iconBtn, boxShadow: "none", background: C.bg }}>
            <ChevronLeft size={22} />
          </button>
          <span style={{ width: 44, height: 44, borderRadius: 13, display: "grid", placeItems: "center",
            background: `${catColor}1f`, color: catColor }}><CatIcon size={22} strokeWidth={2.1} /></span>
          <h2 className="ev-display" style={{ flex: 1, margin: 0, fontSize: 22, fontWeight: 700 }}>{t[activeCat]}</h2>
          <button onClick={() => setModal(activeCat)} className="ev-tap" style={{
            display: "flex", alignItems: "center", gap: 8, border: "none", cursor: "pointer", fontFamily: "inherit",
            background: catColor, color: "#fff", fontSize: 14, fontWeight: 600, padding: "10px 16px", borderRadius: 13,
            boxShadow: `0 6px 16px ${catColor}55` }}>
            <Plus size={18} /> {t.addRecord}
          </button>
        </div>

        {catRecords.length === 0 ? (
          <EmptyHero accent={catColor} icon={<CatIcon size={46} strokeWidth={1.6} />}
            title={t.noRecords} sub={t.noRecordsSub} cta={t.addRecord} onClick={() => setModal(activeCat)} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {catRecords.map(hr => {
              const horse = horses.find(h => h.id === hr.horse_id);
              return (
                <div key={hr.id} style={{
                  background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, padding: 16,
                  display: "flex", alignItems: "flex-start", gap: 14, opacity: hr.completed ? 0.7 : 1
                }}>
                  <button onClick={() => toggleHealthRecord(hr.id)} className="ev-tap" style={{
                    width: 28, height: 28, borderRadius: 9, border: `1.5px solid ${hr.completed ? C.mint : C.line}`,
                    background: hr.completed ? C.mintSoft : "transparent", cursor: "pointer",
                    display: "grid", placeItems: "center", color: C.mint, padding: 0, flexShrink: 0, marginTop: 2
                  }}>
                    {hr.completed && <Check size={18} strokeWidth={3} />}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: hr.completed ? C.sub : C.ink,
                      textDecoration: hr.completed ? "line-through" : "none" }}>
                      {horse ? horse.name : t[activeCat]}
                    </div>
                    <div style={{ fontSize: 12, color: C.sub, marginTop: 4, display: "flex", flexWrap: "wrap", gap: "4px 12px" }}>
                      <span>📅 {hr.scheduled_date?.slice(0, 10)}</span>
                      {hr.performed_by && <span>👤 {hr.performed_by}</span>}
                      {hr.cost && <span>💰 €{Number(hr.cost).toFixed(2)}</span>}
                    </div>
                    {hr.notes && (
                      <div style={{ fontSize: 13, background: C.field, padding: "8px 12px", borderRadius: 10, marginTop: 8, color: C.ink }}>
                        {hr.notes}
                      </div>
                    )}
                  </div>
                  <button onClick={() => deleteHealthRecord(hr.id)} className="ev-tap" style={{
                    border: "none", background: "transparent", cursor: "pointer", color: C.sub, padding: 6 }}>
                    <Trash2 size={17} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {modal && <HealthModal t={t} category={modal} horses={horses}
          onClose={() => setModal(null)}
          onSave={(rec) => { addHealthRecord(rec); setModal(null); }} />}
      </div>
    );
  }

  // Overview with clickable category cards
  return (
    <div className="ev-card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <h2 className="ev-display" style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{t.careOverview}</h2>
        <button onClick={() => setModal("appointments")} className="ev-tap" style={{
          display: "flex", alignItems: "center", gap: 8, border: "none", cursor: "pointer", fontFamily: "inherit",
          background: C.coral, color: "#fff", fontSize: 14, fontWeight: 600, padding: "10px 16px", borderRadius: 13,
          boxShadow: `0 6px 16px ${C.coral}55` }}>
          <Plus size={18} /> {t.addRecord}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 12 }}>
        {HEALTH_CATS.map(([key, Icon, color]) => (
          <button key={key} onClick={() => setActiveCat(key)} className="ev-tap" style={{
            display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start",
            background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: 16,
            cursor: "pointer", textAlign: "left", fontFamily: "inherit",
            transition: "border-color .15s, box-shadow .15s",
          }}>
            <span style={{ width: 44, height: 44, borderRadius: 13, display: "grid", placeItems: "center",
              background: `${color}1f`, color }}><Icon size={22} strokeWidth={2.1} /></span>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{t[key]}</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: counts[key] > 0 ? color : C.sub }}>{counts[key]}</span>
          </button>
        ))}
      </div>

      {modal && <HealthModal t={t} category={modal} horses={horses}
        onClose={() => setModal(null)}
        onSave={(rec) => { addHealthRecord(rec); setModal(null); }} />}
    </div>
  );
}

function HealthModal({ t, category, horses, onClose, onSave }) {
  const [f, setF] = useState({ horse_id: "", scheduled_date: "", notes: "", performed_by: "", cost: "", category });
  const [err, setErr] = useState(false);
  const [catSel, setCatSel] = useState(category);

  const save = () => {
    if (!f.horse_id || !f.scheduled_date) { setErr(true); return; }
    onSave({ ...f, category: catSel, cost: f.cost ? parseFloat(f.cost) : null });
  };

  return (
    <ModalShell t={t} onClose={onClose} accent={C.coral} icon={<Heart size={22} />} title={t.addRecord}>
      {/* Category pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {HEALTH_CATS.map(([key, , color]) => (
          <button key={key} type="button" onClick={() => setCatSel(key)} className="ev-tap"
            style={{
              padding: "8px 14px", borderRadius: 16, border: `1px solid ${catSel === key ? color : C.line}`,
              background: catSel === key ? color : C.field,
              color: catSel === key ? "#fff" : C.sub,
              fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600
            }}>
            {t[key]}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label={t.selectHorse} required>
          <select value={f.horse_id} onChange={(e) => { setF({...f, horse_id: e.target.value}); setErr(false); }}
            style={inputStyle(err && !f.horse_id)}>
            <option value="">{t.selectHorse}...</option>
            {horses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
          </select>
        </Field>
        <Field label={t.recordDate} required>
          <input type="date" value={f.scheduled_date} onChange={(e) => { setF({...f, scheduled_date: e.target.value}); setErr(false); }}
            style={inputStyle(err && !f.scheduled_date)} />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label={t.performedBy}>
          <input value={f.performed_by} onChange={(e) => setF({...f, performed_by: e.target.value})}
            placeholder={t.performedBy} style={inputStyle()} />
        </Field>
        <Field label={t.cost}>
          <input type="number" step="0.01" value={f.cost} onChange={(e) => setF({...f, cost: e.target.value})}
            placeholder="0.00" style={inputStyle()} />
        </Field>
      </div>

      <Field label={t.recordNotes}>
        <textarea value={f.notes} onChange={(e) => setF({...f, notes: e.target.value})}
          rows={2} style={{ ...inputStyle(), resize: "none" }} placeholder={t.notesHint} />
      </Field>

      {err && <div style={{ color: C.coral, fontSize: 13, marginBottom: 10 }}>{t.selectHorse} & {t.recordDate} {t.required}</div>}

      <ModalFooter t={t} onClose={onClose} onSave={save} accent={C.coral} saveLabel={t.add} saveIcon={<Plus size={20} />} />
    </ModalShell>
  );
}

/* ---------- FINANCE ---------- */
const FIN_CATS = ["catConcours", "catSold", "catBoard", "catVet", "catFarrier", "catFeed", "catOther"];
const eur = (n) => "€ " + Number(n || 0).toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function FinanceScreen({ t }) {
  const { txns, deleteTxn } = useStore();
  const [modal, setModal] = useState(null);

  const income = txns.filter((x) => x.type === "income").reduce((s, x) => s + Number(x.amount || 0), 0);
  const expense = txns.filter((x) => x.type === "expense").reduce((s, x) => s + Number(x.amount || 0), 0);
  const balance = income - expense;

  return (
    <div className="ev-card">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 18 }}>
        <StatCard label={t.balance} value={eur(balance)} color={balance >= 0 ? C.mint : C.coral} big />
        <StatCard label={t.income} value={eur(income)} color={C.mint} icon={<ArrowUpRight size={18} />} />
        <StatCard label={t.expenses} value={eur(expense)} color={C.coral} icon={<ArrowDownRight size={18} />} />
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setModal("income")} className="ev-tap" style={addBtn(C.mint)}>
          <ArrowUpRight size={20} /> {t.newIncome}
        </button>
        <button onClick={() => setModal("expense")} className="ev-tap" style={addBtn(C.coral)}>
          <ArrowDownRight size={20} /> {t.newExpense}
        </button>
      </div>

      {txns.length === 0 ? (
        <EmptyHero accent={C.mint} icon={<Wallet size={46} strokeWidth={1.6} />}
          title={t.noTxns} sub={t.noTxnsSub} cta={t.addTransaction} onClick={() => setModal("income")} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {txns.map((x) => <TxnRow key={x.id} x={x} t={t} onDelete={() => deleteTxn(x.id)} />)}
        </div>
      )}

      {modal && <TxnModal type={modal} t={t} onClose={() => setModal(null)} />}
    </div>
  );
}

function StatCard({ label, value, color, icon, big }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, color: C.sub, fontSize: 13, fontWeight: 600 }}>
        {icon && <span style={{ color }}>{icon}</span>}{label}
      </div>
      <div className="ev-display" style={{ fontSize: big ? 30 : 24, fontWeight: 700, color, marginTop: 6 }}>{value}</div>
    </div>
  );
}

function TxnRow({ x, t, onDelete }) {
  const { horses } = useStore();
  const horse = horses.find((h) => h.id === x.horseId);
  const inc = x.type === "income";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.surface,
      border: `1px solid ${C.line}`, borderRadius: 16, padding: "14px 16px" }}>
      <span style={{ width: 42, height: 42, borderRadius: 12, display: "grid", placeItems: "center",
        background: `${inc ? C.mint : C.coral}1c`, color: inc ? C.mint : C.coral, flexShrink: 0 }}>
        {inc ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{t[x.category] || x.reference || t[inc ? "income" : "expenses"]}</div>
        <div style={{ fontSize: 12.5, color: C.sub, marginTop: 2 }}>
          {[x.when, horse && horse.name, x.who].filter(Boolean).join(" · ")}
        </div>
      </div>
      <div className="ev-display" style={{ fontSize: 17, fontWeight: 700, color: inc ? C.mint : C.coral }}>
        {inc ? "+" : "−"} {eur(x.amount)}
      </div>
      <button onClick={onDelete} className="ev-tap" style={{ border: "none", background: "transparent",
        cursor: "pointer", color: C.sub, padding: 6, marginLeft: 4 }}>
        <Trash2 size={17} />
      </button>
    </div>
  );
}

function addBtn(color) {
  return {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "15px", borderRadius: 15, border: "none", cursor: "pointer", fontFamily: "inherit",
    background: color, color: "#fff", fontSize: 15.5, fontWeight: 600, boxShadow: `0 8px 20px ${color}50`,
  };
}

function TxnModal({ type, t, onClose }) {
  const { addTxn, horses } = useStore();
  const inc = type === "income";
  const accent = inc ? C.mint : C.coral;
  const [step, setStep] = useState(1);
  const today = "06/02/2026";
  const [f, setF] = useState({ when: today, category: "", who: "", reference: "", description: "", amount: "", horseId: "" });
  const [err, setErr] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const next = () => { if (!f.category) { setErr(true); return; } setStep(2); };
  const save = () => { addTxn({ type, ...f, horseId: f.horseId ? Number(f.horseId) : null }); onClose(); };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, animation: "evFade .2s ease",
      display: "grid", placeItems: "center", padding: 16 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(31,45,58,.45)" }} />
      <div className="ev-scroll" style={{ position: "relative", width: "100%", maxWidth: 560, maxHeight: "90vh",
        overflowY: "auto", background: C.surface, borderRadius: 24, padding: 24,
        animation: "evUp .25s ease both", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <span style={{ width: 44, height: 44, borderRadius: 13, display: "grid", placeItems: "center",
            background: `${accent}1c`, color: accent }}>
            {inc ? <ArrowUpRight size={22} /> : <ArrowDownRight size={22} />}
          </span>
          <h2 className="ev-display" style={{ flex: 1, margin: 0, fontSize: 23, fontWeight: 700 }}>
            {inc ? t.newIncome : t.newExpense}
          </h2>
          <button onClick={onClose} className="ev-tap" style={{ ...iconBtn, boxShadow: "none", background: C.bg }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          {[[1, t.reference], [2, t.amount]].map(([n, label], i) => (
            <React.Fragment key={n}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", display: "grid", placeItems: "center",
                  fontSize: 13, fontWeight: 700, background: step >= n ? accent : C.bg,
                  color: step >= n ? "#fff" : C.sub }}>{n}</span>
                <span style={{ fontSize: 15, fontWeight: step === n ? 700 : 500, color: step === n ? C.ink : C.sub }}>{label}</span>
              </div>
              {i === 0 && <div style={{ flex: 1, height: 2, background: C.line }} />}
            </React.Fragment>
          ))}
        </div>

        {step === 1 ? (
          <div>
            <Field label={t.fWhen} required>
              <input value={f.when} onChange={set("when")} style={inputStyle()} />
            </Field>
            <Field label={t.fCategory} required>
              <select value={f.category} onChange={(e) => { set("category")(e); setErr(false); }}
                style={{ ...inputStyle(err), color: f.category ? C.ink : C.sub, appearance: "none" }}>
                <option value="">{t.select}</option>
                {FIN_CATS.map((c) => <option key={c} value={c}>{t[c]}</option>)}
              </select>
            </Field>
            {err && <div style={{ color: C.coral, fontSize: 13, marginTop: -8, marginBottom: 10 }}>{t.fCategory} *</div>}
            <Field label={t.fHorse}>
              <select value={f.horseId} onChange={set("horseId")}
                style={{ ...inputStyle(), color: f.horseId ? C.ink : C.sub, appearance: "none" }}>
                <option value="">{t.allHorses}</option>
                {horses.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </Field>
            <Field label={t.fWho}><input value={f.who} onChange={set("who")} placeholder={t.noContact} style={inputStyle()} /></Field>
            <Field label={t.fReference}>
              <input value={f.reference} onChange={(e) => e.target.value.length <= 60 && set("reference")(e)} style={inputStyle()} />
              <div style={{ textAlign: "right", fontSize: 12, color: C.sub, marginTop: 4 }}>{f.reference.length} / 60</div>
            </Field>
            <Field label={t.fDescription}>
              <textarea value={f.description} onChange={(e) => e.target.value.length <= 255 && set("description")(e)}
                rows={2} style={{ ...inputStyle(), resize: "none" }} />
              <div style={{ textAlign: "right", fontSize: 12, color: C.sub, marginTop: 4 }}>{f.description.length} / 255</div>
            </Field>
            <Field label={t.fAttachments}>
              <button className="ev-tap" style={{ display: "flex", alignItems: "center", gap: 8, border: `1px dashed ${C.line}`,
                background: C.field, borderRadius: 12, padding: "12px 16px", cursor: "pointer", color: C.sky,
                fontFamily: "inherit", fontSize: 15, fontWeight: 600, width: "100%" }}>
                <Paperclip size={18} /> {t.upload}
              </button>
            </Field>
          </div>
        ) : (
          <div>
            <Field label={t.fAmountLabel} required>
              <input type="number" inputMode="decimal" value={f.amount} onChange={set("amount")}
                placeholder="0,00" autoFocus
                style={{ ...inputStyle(), fontSize: 28, fontWeight: 700, fontFamily: "'Montserrat',sans-serif",
                  color: accent, textAlign: "center", padding: "22px 16px" }} />
            </Field>
            <div style={{ background: C.field, borderRadius: 14, padding: 16, marginTop: 8 }}>
              <SummaryRow label={t.fWhen} value={f.when} />
              <SummaryRow label={t.fCategory} value={t[f.category]} />
              {f.reference && <SummaryRow label={t.fReference} value={f.reference} />}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          {step === 2 && (
            <button onClick={() => setStep(1)} className="ev-tap" style={{
              padding: "15px 22px", borderRadius: 14, border: `1px solid ${C.line}`, background: C.surface,
              color: C.ink, fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t.back}</button>
          )}
          <button onClick={onClose} className="ev-tap" style={{
            flex: step === 1 ? 1 : "none", padding: "15px 22px", borderRadius: 14, border: `1px solid ${C.line}`,
            background: C.surface, color: C.ink, fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t.cancel}</button>
          {step === 1 ? (
            <button onClick={next} className="ev-tap" style={{ flex: 2, padding: "15px", borderRadius: 14, border: "none",
              background: accent, color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 22px ${accent}55` }}>
              {t.next} <ChevronRight size={20} />
            </button>
          ) : (
            <button onClick={save} className="ev-tap" style={{ flex: 2, padding: "15px", borderRadius: 14, border: "none",
              background: accent, color: "#fff", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 22px ${accent}55` }}>
              <Check size={20} /> {t.finish}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 14 }}>
      <span style={{ color: C.sub }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

/* ---------- USERS ---------- */
const ROLE_KEYS = ["roleAdmin", "roleManager", "roleStaff", "roleVet", "roleOwner"];
const PERM_KEYS = ["permContacts", "permHorses", "permCalendar", "permTasks", "permHealth",
  "permTeams", "permFinance", "permFeeding", "permLinks", "permStaff"];

function UsersScreen({ t }) {
  const { users, deleteUser } = useStore();
  const [modal, setModal] = useState(false);

  return (
    <div className="ev-card">
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <span style={{ color: C.sub, fontSize: 15, fontWeight: 600, flex: 1 }}>{t.userCount(users.length)}</span>
        <button onClick={() => setModal(true)} className="ev-tap" style={{
          display: "flex", alignItems: "center", gap: 8, border: "none", cursor: "pointer", fontFamily: "inherit",
          background: C.mint, color: "#fff", fontSize: 15, fontWeight: 600, padding: "11px 18px", borderRadius: 13,
          boxShadow: "0 6px 16px rgba(47,182,160,.4)" }}>
          <Plus size={19} /> {t.addUser}
        </button>
      </div>

      {users.length === 0 ? (
        <EmptyHero accent={C.sky} icon={<Users size={46} strokeWidth={1.6} />}
          title={t.noUsers} sub={t.noUsersSub} cta={t.addUser} onClick={() => setModal(true)} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {users.map((u) => <UserRow key={u.id} u={u} t={t} onDelete={() => deleteUser(u.id)} />)}
        </div>
      )}

      {modal && <UserModal t={t} onClose={() => setModal(false)} />}
    </div>
  );
}

function UserRow({ u, t, onDelete }) {
  const initials = u.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ width: 48, height: 48, borderRadius: "50%", flexShrink: 0, background: `linear-gradient(135deg, ${C.sky}, ${C.lilac})`,
          display: "grid", placeItems: "center", color: "#fff", fontWeight: 700, fontSize: 17 }}>{initials}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{u.name}</div>
          <div style={{ fontSize: 13, color: C.sub }}>{u.email}</div>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.sky, background: `${C.sky}18`,
          padding: "6px 12px", borderRadius: 10 }}>{t[u.role]}</span>
        <button onClick={onDelete} className="ev-tap" style={{ border: "none", background: "transparent",
          cursor: "pointer", color: C.sub, padding: 6 }}><Trash2 size={17} /></button>
      </div>
      {u.perms && u.perms.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 14 }}>
          {u.perms.map((p) => (
            <span key={p} style={{ fontSize: 12.5, fontWeight: 600, color: C.ink, background: C.bg,
              padding: "5px 11px", borderRadius: 9 }}>{t[p]}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function UserModal({ t, onClose }) {
  const { addUser } = useStore();
  const [f, setF] = useState({ name: "", email: "", role: "roleStaff", perms: [] });
  const [err, setErr] = useState(false);
  const togglePerm = (p) => setF((s) => ({ ...s, perms: s.perms.includes(p) ? s.perms.filter((x) => x !== p) : [...s.perms, p] }));
  const allOn = f.perms.length === PERM_KEYS.length;
  const toggleAll = () => setF((s) => ({ ...s, perms: allOn ? [] : [...PERM_KEYS] }));
  const save = () => { if (!f.name.trim() || !f.email.trim()) { setErr(true); return; } addUser(f); onClose(); };

  return (
    <ModalShell t={t} onClose={onClose} accent={C.sky}
      icon={<Users size={22} />} title={t.addUser}>
      <Field label={t.name} required>
        <input value={f.name} onChange={(e) => { setF({ ...f, name: e.target.value }); setErr(false); }}
          style={inputStyle(err && !f.name.trim())} />
      </Field>
      <Field label={t.email} required>
        <input value={f.email} onChange={(e) => { setF({ ...f, email: e.target.value }); setErr(false); }}
          placeholder="naam@mail.com" style={inputStyle(err && !f.email.trim())} />
      </Field>
      <Field label={t.role}>
        <select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}
          style={{ ...inputStyle(), appearance: "none" }}>
          {ROLE_KEYS.map((r) => <option key={r} value={r}>{t[r]}</option>)}
        </select>
      </Field>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <label style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.sub }}>{t.permissions}</label>
        <button onClick={toggleAll} className="ev-tap" style={{ border: "none", background: "transparent",
          cursor: "pointer", color: C.mint, fontWeight: 600, fontSize: 13, fontFamily: "inherit" }}>{t.selectAll}</button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {PERM_KEYS.map((p) => {
          const on = f.perms.includes(p);
          return (
            <button key={p} onClick={() => togglePerm(p)} className="ev-tap" style={{
              border: `1.5px solid ${on ? C.mint : C.line}`, cursor: "pointer", fontFamily: "inherit",
              background: on ? C.mintSoft : C.surface, color: on ? C.mint : C.sub,
              padding: "9px 14px", borderRadius: 11, fontSize: 13.5, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 6 }}>
              {on && <Check size={14} />}{t[p]}
            </button>
          );
        })}
      </div>
      <ModalFooter t={t} onClose={onClose} onSave={save} accent={C.sky} saveLabel={t.invite} saveIcon={<Check size={20} />} />
    </ModalShell>
  );
}

/* ---------- FEEDING ---------- */
const SLOTS = ["morning", "noon", "evening", "night"];
function FeedingScreen({ t, setRoute }) {
  const { horses, feed, addFeedItem, deleteFeedItem } = useStore();
  const [tab, setTab] = useState(0); // 0 feeding 1 order
  const [slot, setSlot] = useState("morning");
  const [horseFilter, setHorseFilter] = useState("");
  const [addFor, setAddFor] = useState(null); // horseId to add product for

  if (horses.length === 0) {
    return (
      <div className="ev-card">
        <EmptyHero accent={C.amber} icon={<Carrot size={46} strokeWidth={1.6} />}
          title={t.noFeed} sub={t.noFeedSub} cta={t.addHorse}
          onClick={() => setRoute && setRoute({ name: "add" })} />
      </div>
    );
  }

  const shown = horseFilter ? horses.filter((h) => h.id === Number(horseFilter)) : horses;

  return (
    <div className="ev-card">
      <Tabs tabs={[t.feedingTab, t.orderTab]} active={tab} onChange={setTab} />

      {tab === 0 ? (
        <>
          {/* slot + horse filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
            <div style={{ display: "inline-flex", gap: 3, background: C.bg, borderRadius: 13, padding: 4 }}>
              {SLOTS.map((s) => (
                <button key={s} onClick={() => setSlot(s)} className="ev-tap" style={{
                  border: "none", cursor: "pointer", borderRadius: 10, padding: "9px 16px",
                  fontSize: 14, fontWeight: 600, fontFamily: "inherit",
                  background: slot === s ? C.sky : "transparent", color: slot === s ? "#fff" : C.sub }}>
                  {t[s]}
                </button>
              ))}
            </div>
            <select value={horseFilter} onChange={(e) => setHorseFilter(e.target.value)}
              style={{ ...inputStyle(), width: "auto", flex: 1, minWidth: 140, padding: "11px 14px", appearance: "none",
                color: horseFilter ? C.ink : C.sub }}>
              <option value="">{t.allHorsesShort}</option>
              {horses.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>

          {/* per-horse feed rows for selected slot */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {shown.map((h) => {
              const items = (feed[h.id] && feed[h.id][slot]) || [];
              return (
                <div key={h.id} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: items.length ? 12 : 0 }}>
                    <HorseAvatar h={h} size={40} />
                    <span style={{ flex: 1, fontSize: 16, fontWeight: 600 }}>{h.name}</span>
                    <button onClick={() => setAddFor(h.id)} className="ev-tap" style={{
                      width: 34, height: 34, borderRadius: 10, border: "none", cursor: "pointer",
                      background: `${C.amber}1f`, color: C.amber, display: "grid", placeItems: "center" }}>
                      <Plus size={19} />
                    </button>
                  </div>
                  {items.length === 0 ? (
                    <div style={{ color: C.sub, fontSize: 13.5, fontStyle: "italic" }}>{t.noFeedHorse}</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {items.map((it) => (
                        <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 10,
                          background: C.field, borderRadius: 11, padding: "10px 14px" }}>
                          <Carrot size={17} color={C.amber} />
                          <span style={{ flex: 1, fontSize: 14.5, fontWeight: 500 }}>{it.product}</span>
                          <span style={{ fontSize: 14, color: C.sub, fontWeight: 600 }}>{it.qty}</span>
                          <button onClick={() => deleteFeedItem(h.id, slot, it.id)} className="ev-tap"
                            style={{ border: "none", background: "transparent", cursor: "pointer", color: C.sub, padding: 2 }}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <OrderTab t={t} />
      )}

      {addFor != null && (
        <FeedModal t={t} slot={slot}
          onClose={() => setAddFor(null)}
          onSave={(item) => { addFeedItem(addFor, slot, item); setAddFor(null); }} />
      )}
    </div>
  );
}

function OrderTab({ t }) {
  const { feed } = useStore();
  // aggregate products across all horses & slots
  const totals = {};
  Object.values(feed).forEach((slots) => Object.values(slots).forEach((arr) =>
    arr.forEach((it) => { totals[it.product] = (totals[it.product] || 0) + 1; })));
  const entries = Object.entries(totals);

  if (entries.length === 0) {
    return <EmptyHero accent={C.sky} icon={<Package size={46} strokeWidth={1.6} />} title={t.empty} sub="" cta={t.addProduct} onClick={() => {}} />;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {entries.map(([product, count]) => (
        <div key={product} style={{ display: "flex", alignItems: "center", gap: 12, background: C.surface,
          border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 16px" }}>
          <span style={{ width: 38, height: 38, borderRadius: 11, display: "grid", placeItems: "center",
            background: `${C.amber}1f`, color: C.amber }}><Package size={18} /></span>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>{product}</span>
          <span style={{ fontSize: 14, color: C.sub, fontWeight: 600 }}>×{count}</span>
        </div>
      ))}
    </div>
  );
}

const FEED_PRODUCTS = [
  "Hay", "Haylage", "Alfalfa", "Oats", "Barley", "Beet Pulp", "Chaff",
  "Pellets", "Muesli", "Oil", "Supplements", "Electrolytes", "Salt Lick",
  "Bran", "Rice Bran", "Linseed", "Carrots", "Apples", "Balancer", "Other",
];

function FeedModal({ t, slot, onClose, onSave }) {
  const [f, setF] = useState({ product: "", qty: "" });
  const [err, setErr] = useState(false);
  const save = () => { if (!f.product.trim()) { setErr(true); return; } onSave(f); };
  return (
    <ModalShell t={t} onClose={onClose} accent={C.amber} icon={<Carrot size={22} />}
      title={`${t.addProduct} · ${t[slot]}`}>
      <Field label={t.product} required>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {FEED_PRODUCTS.map(p => (
            <button key={p} type="button" onClick={() => { setF({...f, product: p}); setErr(false); }}
              className="ev-tap"
              style={{
                padding: "8px 14px", borderRadius: 16, border: `1px solid ${f.product === p ? C.amber : C.line}`,
                background: f.product === p ? C.amber : C.field,
                color: f.product === p ? "#fff" : C.sub,
                fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600
              }}>
              {p}
            </button>
          ))}
        </div>
        <input value={f.product} onChange={(e) => { setF({ ...f, product: e.target.value }); setErr(false); }}
          placeholder={t.product} style={inputStyle(err)} />
      </Field>
      <Field label={t.qty}>
        <input value={f.qty} onChange={(e) => setF({ ...f, qty: e.target.value })}
          placeholder="2 kg" style={inputStyle()} />
      </Field>
      <ModalFooter t={t} onClose={onClose} onSave={save} accent={C.amber} saveLabel={t.finish} saveIcon={<Check size={20} />} />
    </ModalShell>
  );
}

/* ---------- reusable modal shell ---------- */
function ModalShell({ t, onClose, accent, icon, title, children }) {
  return (
    <div className="ev-modal-wrap" style={{ position: "fixed", inset: 0, zIndex: 60, animation: "evFade .2s ease",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16, overflowY: "auto" }}>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(31,45,58,.45)", zIndex: 0 }} />
      <div className="ev-scroll ev-modal-panel" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 560,
        maxHeight: "92vh", overflowY: "auto", background: C.surface, borderRadius: 24, padding: 24,
        animation: "evUp .25s ease both", boxShadow: "0 24px 60px rgba(0,0,0,.25)",
        WebkitOverflowScrolling: "touch" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <span style={{ width: 44, height: 44, borderRadius: 13, display: "grid", placeItems: "center",
            background: `${accent}1c`, color: accent, flexShrink: 0 }}>{icon}</span>
          <h2 className="ev-display" style={{ flex: 1, margin: 0, fontSize: 21, fontWeight: 700, minWidth: 0 }}>{title}</h2>
          <button onClick={onClose} className="ev-tap" style={{ ...iconBtn, boxShadow: "none", background: C.bg, flexShrink: 0 }}>
            <X size={22} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalFooter({ t, onClose, onSave, accent, saveLabel, saveIcon }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
      <button onClick={onClose} className="ev-tap" style={{
        flex: "1 1 120px", padding: "15px", borderRadius: 14, border: `1px solid ${C.line}`, background: C.surface,
        color: C.ink, fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t.cancel}</button>
      <button onClick={onSave} className="ev-tap" style={{
        flex: "2 1 180px", padding: "15px", borderRadius: 14, border: "none", background: accent, color: "#fff",
        fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 22px ${accent}55` }}>
        {saveIcon} {saveLabel}
      </button>
    </div>
  );
}

/* ============================================================
   NEW MODULE SCREENS
   ============================================================ */

/* ---------- LOCATIONS ---------- */
const LOCATION_TYPES = ["stable","paddock","arena","clinic","field","pasture","trailer","showground","breeding_center","quarantine","other"];
const CONTINENTS = ["Europe","North America","South America","Asia","Africa","Oceania","Antarctica"];

function LocationsScreen({ t }) {
  const { locations, addLocation, deleteLocation } = useStore();
  const [modal, setModal] = useState(false);
  return (
    <div className="ev-card">
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:10, marginBottom:16 }}>
        <h2 className="ev-display" style={{ margin:0, fontSize:22, fontWeight:700, flex:1 }}>{t.locations}</h2>
        <button onClick={()=>setModal(true)} className="ev-tap" style={{ display:"flex", alignItems:"center", gap:8, border:"none", cursor:"pointer", fontFamily:"inherit", background:C.sky, color:"#fff", fontSize:14, fontWeight:600, padding:"10px 16px", borderRadius:13, boxShadow:`0 6px 16px ${C.sky}55`, whiteSpace:"nowrap" }}><Plus size={18} /> {t.addLocation || "Add Location"}</button>
      </div>
      {locations.length===0 ? (
        <EmptyHero accent={C.sky} icon={<MapPin size={46} strokeWidth={1.6}/>} title={t.noLocations||"No locations yet"} sub={t.noLocationsSub||"Add your stables, paddocks and arenas."} cta={t.addLocation||"Add Location"} onClick={()=>setModal(true)}/>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {locations.map(loc => (
            <div key={loc.id} style={{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:18, padding:16, display:"flex", alignItems:"flex-start", gap:14 }}>
              <span style={{ width:44, height:44, borderRadius:13, display:"grid", placeItems:"center", background:`${C.sky}1f`, color:C.sky, flexShrink:0 }}><MapPin size={22}/></span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:16, fontWeight:600 }}>{loc.name}</div>
                <div style={{ fontSize:13, color:C.sub, marginTop:4 }}>
                  {[loc.location_type, loc.city, loc.country, loc.continent].filter(Boolean).join(" · ")}
                </div>
                {loc.address && <div style={{ fontSize:12, color:C.sub, marginTop:2 }}>{loc.address}</div>}
                {loc.notes && <div style={{ fontSize:13, background:C.field, padding:"6px 10px", borderRadius:8, marginTop:6 }}>{loc.notes}</div>}
                {(loc.latitude && loc.longitude) && <a href={`https://maps.google.com/?q=${loc.latitude},${loc.longitude}`} target="_blank" rel="noreferrer" style={{ fontSize:12, color:C.sky, marginTop:4, display:"inline-block" }}>📍 Google Maps</a>}
              </div>
              <button onClick={()=>deleteLocation(loc.id)} className="ev-tap" style={{ border:"none", background:"transparent", cursor:"pointer", color:C.sub, padding:6 }}><Trash2 size={17}/></button>
            </div>
          ))}
        </div>
      )}
      {modal && <LocationModal t={t} onClose={()=>setModal(false)} onSave={(l)=>{addLocation(l);setModal(false);}}/>}
    </div>
  );
}
function LocationModal({ t, onClose, onSave }) {
  const [f,setF]=useState({name:"",location_type:"stable",address:"",city:"",province:"",country:"",continent:"",postal_code:"",notes:"",capacity:"",latitude:"",longitude:""});
  const [err,setErr]=useState(false);
  const save=()=>{if(!f.name.trim()){setErr(true);return;}onSave({...f,capacity:f.capacity?parseInt(f.capacity):null,latitude:f.latitude?parseFloat(f.latitude):null,longitude:f.longitude?parseFloat(f.longitude):null});};
  return(
    <ModalShell t={t} onClose={onClose} accent={C.sky} icon={<MapPin size={22}/>} title={t.addLocation||"Add Location"}>
      <Field label={t.name} required><input value={f.name} onChange={e=>{setF({...f,name:e.target.value});setErr(false);}} style={inputStyle(err)}/></Field>
      <Field label="Type"><select value={f.location_type} onChange={e=>setF({...f,location_type:e.target.value})} style={inputStyle()}>{LOCATION_TYPES.map(lt=><option key={lt} value={lt}>{lt.replace(/_/g," ")}</option>)}</select></Field>
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label={t.address||"Address"}><input value={f.address} onChange={e=>setF({...f,address:e.target.value})} style={inputStyle()}/></Field>
        <Field label={t.city||"City"}><input value={f.city} onChange={e=>setF({...f,city:e.target.value})} style={inputStyle()}/></Field>
      </div>
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label={t.province||"Province"}><input value={f.province} onChange={e=>setF({...f,province:e.target.value})} style={inputStyle()}/></Field>
        <Field label={t.country||"Country"}><input value={f.country} onChange={e=>setF({...f,country:e.target.value})} style={inputStyle()}/></Field>
      </div>
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="Continent"><select value={f.continent} onChange={e=>setF({...f,continent:e.target.value})} style={inputStyle()}><option value="">{t.select}</option>{CONTINENTS.map(c=><option key={c} value={c}>{c}</option>)}</select></Field>
        <Field label="Capacity"><input type="number" value={f.capacity} onChange={e=>setF({...f,capacity:e.target.value})} placeholder="Max horses" style={inputStyle()}/></Field>
      </div>
      <Field label={t.recordNotes||"Notes"}><textarea value={f.notes} onChange={e=>setF({...f,notes:e.target.value})} rows={2} style={{...inputStyle(),resize:"none"}}/></Field>
      <ModalFooter t={t} onClose={onClose} onSave={save} accent={C.sky} saveLabel={t.add||"Add"} saveIcon={<Plus size={20}/>}/>
    </ModalShell>
  );
}

/* ---------- CONTACTS ---------- */
const CONTACT_ROLES = ["owner","client","vet","farrier","rider","supplier","dealer","trainer","breeder","transporter","insurance","dentist","physiotherapist","osteopath","saddler","photographer","sponsor","federation","stable_hand","manager","private","other"];

function ContactsScreen({ t }) {
  const { contacts, addContact, deleteContact } = useStore();
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="ev-card">
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:10, marginBottom:16 }}>
        <h2 className="ev-display" style={{ margin:0, fontSize:22, fontWeight:700 }}>{t.contacts}</h2>
        <div style={{ flex:1 }}/>
        <button onClick={()=>setModal(true)} className="ev-tap" style={{ display:"flex", alignItems:"center", gap:8, border:"none", cursor:"pointer", fontFamily:"inherit", background:C.lilac, color:"#fff", fontSize:14, fontWeight:600, padding:"10px 16px", borderRadius:13, boxShadow:`0 6px 16px ${C.lilac}55`, whiteSpace:"nowrap" }}><Plus size={18}/> {t.addContact||"Add Contact"}</button>
      </div>
      {contacts.length>0 && <div style={{ marginBottom:14 }}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.search} style={{...inputStyle(),padding:"11px 14px"}}/></div>}
      {filtered.length===0 ? (
        <EmptyHero accent={C.lilac} icon={<Users size={46} strokeWidth={1.6}/>} title={t.noContacts||"No contacts yet"} sub={t.noContactsSub||"Add vets, farriers, trainers and more."} cta={t.addContact||"Add Contact"} onClick={()=>setModal(true)}/>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map(c => (
            <div key={c.id} style={{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:18, padding:16, display:"flex", alignItems:"center", gap:14 }}>
              <span style={{ width:44, height:44, borderRadius:"50%", display:"grid", placeItems:"center", background:`${C.lilac}1f`, color:C.lilac, flexShrink:0, fontWeight:700, fontSize:17 }}>{c.name.charAt(0).toUpperCase()}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:16, fontWeight:600 }}>{c.name}{c.company && <span style={{ color:C.sub, fontWeight:400 }}> — {c.company}</span>}</div>
                <div style={{ fontSize:12, color:C.sub, marginTop:2 }}>{[c.role?.replace(/_/g," "), c.city, c.country].filter(Boolean).join(" · ")}</div>
                {c.phone && <div style={{ fontSize:12, color:C.sub }}>📞 {c.phone}</div>}
                {c.email && <div style={{ fontSize:12, color:C.sub }}>{c.email}</div>}
              </div>
              <button onClick={()=>deleteContact(c.id)} className="ev-tap" style={{ border:"none", background:"transparent", cursor:"pointer", color:C.sub, padding:6 }}><Trash2 size={17}/></button>
            </div>
          ))}
        </div>
      )}
      {modal && <ContactModal t={t} onClose={()=>setModal(false)} onSave={(c)=>{addContact(c);setModal(false);}}/>}
    </div>
  );
}
function ContactModal({ t, onClose, onSave }) {
  const [f,setF]=useState({name:"",company:"",email:"",phone:"",role:"other",address:"",city:"",country:"",website:"",notes:""});
  const [err,setErr]=useState(false);
  const save=()=>{if(!f.name.trim()){setErr(true);return;}onSave(f);};
  return(
    <ModalShell t={t} onClose={onClose} accent={C.lilac} icon={<Users size={22}/>} title={t.addContact||"Add Contact"}>
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label={t.name} required><input value={f.name} onChange={e=>{setF({...f,name:e.target.value});setErr(false);}} style={inputStyle(err)}/></Field>
        <Field label="Company"><input value={f.company} onChange={e=>setF({...f,company:e.target.value})} style={inputStyle()}/></Field>
      </div>
      <Field label="Role">
        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:8 }}>
          {CONTACT_ROLES.slice(0,10).map(r=>(
            <button key={r} type="button" onClick={()=>setF({...f,role:r})} className="ev-tap" style={{ padding:"6px 12px", borderRadius:14, border:`1px solid ${f.role===r?C.lilac:C.line}`, background:f.role===r?C.lilac:C.field, color:f.role===r?"#fff":C.sub, fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>{r.replace(/_/g," ")}</button>
          ))}
        </div>
        <select value={f.role} onChange={e=>setF({...f,role:e.target.value})} style={inputStyle()}>{CONTACT_ROLES.map(r=><option key={r} value={r}>{r.replace(/_/g," ")}</option>)}</select>
      </Field>
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="Email"><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} style={inputStyle()}/></Field>
        <Field label="Phone"><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} style={inputStyle()}/></Field>
      </div>
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label={t.city||"City"}><input value={f.city} onChange={e=>setF({...f,city:e.target.value})} style={inputStyle()}/></Field>
        <Field label={t.country||"Country"}><input value={f.country} onChange={e=>setF({...f,country:e.target.value})} style={inputStyle()}/></Field>
      </div>
      <Field label={t.recordNotes||"Notes"}><textarea value={f.notes} onChange={e=>setF({...f,notes:e.target.value})} rows={2} style={{...inputStyle(),resize:"none"}}/></Field>
      <ModalFooter t={t} onClose={onClose} onSave={save} accent={C.lilac} saveLabel={t.add||"Add"} saveIcon={<Plus size={20}/>}/>
    </ModalShell>
  );
}

/* ---------- DOCUMENTS ---------- */
const DOC_CATS = ["passport","vaccination","vet_report","xray","insurance","contract","invoice","registration","pedigree","sales_photo","sales_video","competition","training","farrier_report","dental_report","transport","feed_plan","other"];

function DocumentsScreen({ t }) {
  const { documents, addDocument, deleteDocument, horses } = useStore();
  const [modal, setModal] = useState(false);
  const [catFilter, setCatFilter] = useState("");
  const filtered = catFilter ? documents.filter(d => d.category === catFilter) : documents;
  return (
    <div className="ev-card">
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:10, marginBottom:16 }}>
        <h2 className="ev-display" style={{ margin:0, fontSize:22, fontWeight:700 }}>{t.documents}</h2>
        <div style={{ flex:1 }}/>
        <button onClick={()=>setModal(true)} className="ev-tap" style={{ display:"flex", alignItems:"center", gap:8, border:"none", cursor:"pointer", fontFamily:"inherit", background:C.sky, color:"#fff", fontSize:14, fontWeight:600, padding:"10px 16px", borderRadius:13 }}><Plus size={18}/> Upload</button>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:16 }}>
        <button onClick={()=>setCatFilter("")} className="ev-tap" style={{ padding:"6px 12px", borderRadius:14, border:`1px solid ${!catFilter?C.sky:C.line}`, background:!catFilter?C.sky:C.field, color:!catFilter?"#fff":C.sub, fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>All</button>
        {DOC_CATS.slice(0,8).map(c=>(
          <button key={c} onClick={()=>setCatFilter(c)} className="ev-tap" style={{ padding:"6px 12px", borderRadius:14, border:`1px solid ${catFilter===c?C.sky:C.line}`, background:catFilter===c?C.sky:C.field, color:catFilter===c?"#fff":C.sub, fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>{c.replace(/_/g," ")}</button>
        ))}
      </div>
      {filtered.length===0 ? (
        <EmptyHero accent={C.sky} icon={<FileText size={46} strokeWidth={1.6}/>} title="No documents" sub="Upload passports, vet reports, photos and videos." cta="Upload" onClick={()=>setModal(true)}/>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map(d => {
            const horse = horses.find(h=>h.id===d.horse_id);
            return (
              <div key={d.id} style={{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:18, padding:16, display:"flex", alignItems:"center", gap:14 }}>
                <span style={{ width:44, height:44, borderRadius:13, display:"grid", placeItems:"center", background:`${C.sky}1f`, color:C.sky, flexShrink:0 }}><FileText size={20}/></span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:15, fontWeight:600 }}>{d.name}</div>
                  <div style={{ fontSize:12, color:C.sub, marginTop:2 }}>{[d.category?.replace(/_/g," "), d.file_type, horse?.name].filter(Boolean).join(" · ")}</div>
                </div>
                <a href={d.url} target="_blank" rel="noreferrer" style={{ color:C.sky, padding:6 }}><Download size={17}/></a>
                <button onClick={()=>deleteDocument(d.id)} className="ev-tap" style={{ border:"none", background:"transparent", cursor:"pointer", color:C.sub, padding:6 }}><Trash2 size={17}/></button>
              </div>
            );
          })}
        </div>
      )}
      {modal && <DocModal t={t} horses={horses} onClose={()=>setModal(false)} onSave={(d)=>{addDocument(d);setModal(false);}}/>}
    </div>
  );
}
function DocModal({ t, horses, onClose, onSave }) {
  const [f,setF]=useState({name:"",url:"",file_type:"",category:"other",description:"",horse_id:""});
  const [uploading,setUploading]=useState(false);
  const [err,setErr]=useState(false);
  const handleUpload = async(e)=>{
    const file=e.target.files[0]; if(!file) return;
    setUploading(true);
    const fd=new FormData(); fd.append("file",file); fd.append("upload_preset","equivesa_uploads"); fd.append("resource_type","auto");
    try {
      const res=await fetch("https://api.cloudinary.com/v1_1/daj1lyfgk/auto/upload",{method:"POST",body:fd});
      const data=await res.json();
      if(data.secure_url) setF(p=>({...p, url:data.secure_url, name:p.name||file.name, file_type:file.name.split('.').pop().toLowerCase(), file_size:file.size}));
    } catch(e){console.error(e);}
    finally{setUploading(false);}
  };
  const save=()=>{if(!f.name.trim()||!f.url){setErr(true);return;}onSave(f);};
  return(
    <ModalShell t={t} onClose={onClose} accent={C.sky} icon={<FileText size={22}/>} title="Upload Document">
      <div style={{ border:`2px dashed ${C.line}`, borderRadius:16, padding:24, textAlign:"center", marginBottom:16, cursor:"pointer", background:C.field }}>
        <label style={{ cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          {uploading ? <span style={{ fontSize:14, fontWeight:600 }}>Uploading...</span> : f.url ? <><Check size={28} color={C.mint}/><span style={{ fontSize:13, color:C.mint, fontWeight:600 }}>Uploaded ✓</span></> : <><Upload size={28} color={C.sub}/><span style={{ fontSize:13, color:C.sub }}>Click to upload (PDF, JPG, MP4, etc.)</span></>}
          <input type="file" accept="*/*" onChange={handleUpload} style={{ display:"none" }}/>
        </label>
      </div>
      <Field label={t.name} required><input value={f.name} onChange={e=>{setF({...f,name:e.target.value});setErr(false);}} style={inputStyle(err&&!f.name.trim())}/></Field>
      <Field label="Category">
        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:8 }}>
          {DOC_CATS.map(c=>(
            <button key={c} type="button" onClick={()=>setF({...f,category:c})} className="ev-tap" style={{ padding:"6px 10px", borderRadius:14, border:`1px solid ${f.category===c?C.sky:C.line}`, background:f.category===c?C.sky:C.field, color:f.category===c?"#fff":C.sub, fontSize:11, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>{c.replace(/_/g," ")}</button>
          ))}
        </div>
      </Field>
      <Field label={t.selectHorse||"Horse"}><select value={f.horse_id} onChange={e=>setF({...f,horse_id:e.target.value})} style={inputStyle()}><option value="">— None —</option>{horses.map(h=><option key={h.id} value={h.id}>{h.name}</option>)}</select></Field>
      <Field label="Description"><textarea value={f.description} onChange={e=>setF({...f,description:e.target.value})} rows={2} style={{...inputStyle(),resize:"none"}}/></Field>
      {err&&!f.url && <div style={{ color:C.coral, fontSize:13, marginBottom:10 }}>Please upload a file first</div>}
      <ModalFooter t={t} onClose={onClose} onSave={save} accent={C.sky} saveLabel="Save" saveIcon={<Check size={20}/>}/>
    </ModalShell>
  );
}

/* ---------- CLIENTS ---------- */
const CLIENT_TYPES = ["horse_owner","boarder","lesson_student","buyer","seller","breeding_client","competition_rider","training_client","livery","half_lease","full_lease","investor","syndicate","other"];

function ClientsScreen({ t }) {
  const { clients, addClient, deleteClient } = useStore();
  const [modal, setModal] = useState(false);
  return (
    <div className="ev-card">
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:10, marginBottom:16 }}>
        <h2 className="ev-display" style={{ margin:0, fontSize:22, fontWeight:700 }}>{t.clients}</h2>
        <div style={{ flex:1 }}/>
        <button onClick={()=>setModal(true)} className="ev-tap" style={{ display:"flex", alignItems:"center", gap:8, border:"none", cursor:"pointer", fontFamily:"inherit", background:C.mint, color:"#fff", fontSize:14, fontWeight:600, padding:"10px 16px", borderRadius:13 }}><Plus size={18}/> {t.addClient||"Add Client"}</button>
      </div>
      {clients.length===0 ? (
        <EmptyHero accent={C.mint} icon={<Users size={46} strokeWidth={1.6}/>} title="No clients yet" sub="Add horse owners, boarders, lesson students and more." cta={t.addClient||"Add Client"} onClick={()=>setModal(true)}/>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {clients.map(c=>(
            <div key={c.id} style={{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:18, padding:16, display:"flex", alignItems:"center", gap:14 }}>
              <span style={{ width:44, height:44, borderRadius:"50%", display:"grid", placeItems:"center", background:`${C.mint}1f`, color:C.mint, flexShrink:0, fontWeight:700, fontSize:17 }}>{c.name.charAt(0).toUpperCase()}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:16, fontWeight:600 }}>{c.name}{c.company&&<span style={{ color:C.sub, fontWeight:400 }}> — {c.company}</span>}</div>
                <div style={{ fontSize:12, color:C.sub, marginTop:2 }}>{[c.client_type?.replace(/_/g," "), c.city, c.country].filter(Boolean).join(" · ")}</div>
                {c.email && <div style={{ fontSize:12, color:C.sub }}>{c.email}</div>}
              </div>
              <button onClick={()=>deleteClient(c.id)} className="ev-tap" style={{ border:"none", background:"transparent", cursor:"pointer", color:C.sub, padding:6 }}><Trash2 size={17}/></button>
            </div>
          ))}
        </div>
      )}
      {modal && <ClientModal t={t} onClose={()=>setModal(false)} onSave={(c)=>{addClient(c);setModal(false);}}/>}
    </div>
  );
}
function ClientModal({ t, onClose, onSave }) {
  const [f,setF]=useState({name:"",company:"",email:"",phone:"",client_type:"horse_owner",address:"",city:"",country:"",billing_email:"",vat_number:"",notes:""});
  const [err,setErr]=useState(false);
  const save=()=>{if(!f.name.trim()){setErr(true);return;}onSave(f);};
  return(
    <ModalShell t={t} onClose={onClose} accent={C.mint} icon={<Users size={22}/>} title={t.addClient||"Add Client"}>
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label={t.name} required><input value={f.name} onChange={e=>{setF({...f,name:e.target.value});setErr(false);}} style={inputStyle(err)}/></Field>
        <Field label="Company"><input value={f.company} onChange={e=>setF({...f,company:e.target.value})} style={inputStyle()}/></Field>
      </div>
      <Field label="Client Type">
        <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
          {CLIENT_TYPES.map(ct=>(
            <button key={ct} type="button" onClick={()=>setF({...f,client_type:ct})} className="ev-tap" style={{ padding:"6px 12px", borderRadius:14, border:`1px solid ${f.client_type===ct?C.mint:C.line}`, background:f.client_type===ct?C.mint:C.field, color:f.client_type===ct?"#fff":C.sub, fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>{ct.replace(/_/g," ")}</button>
          ))}
        </div>
      </Field>
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="Email"><input type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} style={inputStyle()}/></Field>
        <Field label="Phone"><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} style={inputStyle()}/></Field>
      </div>
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="Billing Email"><input type="email" value={f.billing_email} onChange={e=>setF({...f,billing_email:e.target.value})} style={inputStyle()}/></Field>
        <Field label="VAT Number"><input value={f.vat_number} onChange={e=>setF({...f,vat_number:e.target.value})} style={inputStyle()}/></Field>
      </div>
      <ModalFooter t={t} onClose={onClose} onSave={save} accent={C.mint} saveLabel={t.add||"Add"} saveIcon={<Plus size={20}/>}/>
    </ModalShell>
  );
}

/* ---------- BOOKINGS ---------- */
const BOOKING_TYPES = ["arena","lesson","training","vet_visit","farrier_visit","dentist_visit","transport","competition","clinic","viewing","trial_ride","photo_shoot","stable_visit","paddock","walker","solarium","wash_bay","other"];
const BOOKING_STATUS = ["pending","confirmed","cancelled","completed","no_show"];

function BookingsScreen({ t }) {
  const { bookings, addBooking, deleteBooking, horses, clients } = useStore();
  const [modal, setModal] = useState(false);
  return (
    <div className="ev-card">
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:10, marginBottom:16 }}>
        <h2 className="ev-display" style={{ margin:0, fontSize:22, fontWeight:700 }}>{t.bookings}</h2>
        <div style={{ flex:1 }}/>
        <button onClick={()=>setModal(true)} className="ev-tap" style={{ display:"flex", alignItems:"center", gap:8, border:"none", cursor:"pointer", fontFamily:"inherit", background:C.amber, color:"#fff", fontSize:14, fontWeight:600, padding:"10px 16px", borderRadius:13 }}><Plus size={18}/> {t.addBooking||"Add Booking"}</button>
      </div>
      {bookings.length===0 ? (
        <EmptyHero accent={C.amber} icon={<CalendarDays size={46} strokeWidth={1.6}/>} title="No bookings" sub="Schedule arena time, lessons, vet visits and more." cta={t.addBooking||"Add Booking"} onClick={()=>setModal(true)}/>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {bookings.map(b=>{
            const horse=horses.find(h=>h.id===b.horse_id);
            const statusColor={pending:C.amber,confirmed:C.mint,cancelled:C.sub,completed:C.sky,no_show:C.coral}[b.status]||C.sub;
            return(
              <div key={b.id} style={{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:18, padding:16, display:"flex", alignItems:"flex-start", gap:14 }}>
                <span style={{ width:44, height:44, borderRadius:13, display:"grid", placeItems:"center", background:`${C.amber}1f`, color:C.amber, flexShrink:0 }}><CalendarDays size={20}/></span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:16, fontWeight:600 }}>{b.title}</div>
                  <div style={{ fontSize:12, color:C.sub, marginTop:3, display:"flex", flexWrap:"wrap", gap:"3px 10px" }}>
                    <span>📅 {b.booking_date?.slice(0,10)}</span>
                    {b.start_time && <span>🕐 {b.start_time?.slice(0,5)}{b.end_time&&`–${b.end_time?.slice(0,5)}`}</span>}
                    {horse && <span>🐴 {horse.name}</span>}
                    <span style={{ padding:"2px 8px", borderRadius:8, background:`${statusColor}1f`, color:statusColor, fontSize:11, fontWeight:600 }}>{b.status}</span>
                  </div>
                  {b.calendar_url && <a href={b.calendar_url} target="_blank" rel="noreferrer" style={{ fontSize:12, color:C.sky, marginTop:4, display:"inline-block" }}>📅 Add to Calendar</a>}
                </div>
                <button onClick={()=>deleteBooking(b.id)} className="ev-tap" style={{ border:"none", background:"transparent", cursor:"pointer", color:C.sub, padding:6 }}><Trash2 size={17}/></button>
              </div>
            );
          })}
        </div>
      )}
      {modal && <BookingModal t={t} horses={horses} clients={clients} onClose={()=>setModal(false)} onSave={(b)=>{
        // Generate Google Calendar link
        const calUrl = b.booking_date ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(b.title)}&dates=${b.booking_date.replace(/-/g,"")}/${b.booking_date.replace(/-/g,"")}&details=${encodeURIComponent(b.notes||"")}` : "";
        addBooking({...b, calendar_url:calUrl}); setModal(false);
      }}/>}
    </div>
  );
}
function BookingModal({ t, horses, clients, onClose, onSave }) {
  const [f,setF]=useState({title:"",booking_type:"arena",booking_date:"",start_time:"",end_time:"",horse_id:"",client_id:"",status:"pending",location:"",price:"",notes:""});
  const [err,setErr]=useState(false);
  const save=()=>{if(!f.title.trim()||!f.booking_date){setErr(true);return;}onSave({...f,price:f.price?parseFloat(f.price):null});};
  return(
    <ModalShell t={t} onClose={onClose} accent={C.amber} icon={<CalendarDays size={22}/>} title={t.addBooking||"Add Booking"}>
      <Field label="Booking Type">
        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:8 }}>
          {BOOKING_TYPES.slice(0,10).map(bt=>(<button key={bt} type="button" onClick={()=>setF({...f,booking_type:bt,title:bt.replace(/_/g," ")})} className="ev-tap" style={{ padding:"6px 12px", borderRadius:14, border:`1px solid ${f.booking_type===bt?C.amber:C.line}`, background:f.booking_type===bt?C.amber:C.field, color:f.booking_type===bt?"#fff":C.sub, fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>{bt.replace(/_/g," ")}</button>))}
        </div>
      </Field>
      <Field label="Title" required><input value={f.title} onChange={e=>{setF({...f,title:e.target.value});setErr(false);}} style={inputStyle(err&&!f.title.trim())}/></Field>
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        <Field label="Date" required><input type="date" value={f.booking_date} onChange={e=>{setF({...f,booking_date:e.target.value});setErr(false);}} style={inputStyle(err&&!f.booking_date)}/></Field>
        <Field label="Start"><input type="time" value={f.start_time} onChange={e=>setF({...f,start_time:e.target.value})} style={inputStyle()}/></Field>
        <Field label="End"><input type="time" value={f.end_time} onChange={e=>setF({...f,end_time:e.target.value})} style={inputStyle()}/></Field>
      </div>
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="Horse"><select value={f.horse_id} onChange={e=>setF({...f,horse_id:e.target.value})} style={inputStyle()}><option value="">—</option>{horses.map(h=><option key={h.id} value={h.id}>{h.name}</option>)}</select></Field>
        <Field label="Status"><select value={f.status} onChange={e=>setF({...f,status:e.target.value})} style={inputStyle()}>{BOOKING_STATUS.map(s=><option key={s} value={s}>{s}</option>)}</select></Field>
      </div>
      <Field label={t.recordNotes||"Notes"}><textarea value={f.notes} onChange={e=>setF({...f,notes:e.target.value})} rows={2} style={{...inputStyle(),resize:"none"}}/></Field>
      <ModalFooter t={t} onClose={onClose} onSave={save} accent={C.amber} saveLabel={t.add||"Add"} saveIcon={<Plus size={20}/>}/>
    </ModalShell>
  );
}

/* ---------- MARES BREEDING ---------- */
const MARE_STATUS = ["inseminated","confirmed_pregnant","empty","aborted","foaled","resorbed","twin_reduced"];
const SERVICE_TYPES = ["natural","fresh_ai","chilled_ai","frozen_ai","icsi"];

function MaresScreen({ t }) {
  const { maresBreeding, addMareBreeding, deleteMareBreeding, horses } = useStore();
  const [modal, setModal] = useState(false);
  const mares = horses.filter(h=>h.sex==="sexMare");
  return (
    <div className="ev-card">
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:10, marginBottom:16 }}>
        <h2 className="ev-display" style={{ margin:0, fontSize:22, fontWeight:700 }}>{t.mares}</h2>
        <div style={{ flex:1 }}/>
        <button onClick={()=>setModal(true)} className="ev-tap" style={{ display:"flex", alignItems:"center", gap:8, border:"none", cursor:"pointer", fontFamily:"inherit", background:C.coral, color:"#fff", fontSize:14, fontWeight:600, padding:"10px 16px", borderRadius:13 }}><Plus size={18}/> Add Record</button>
      </div>
      {maresBreeding.length===0 ? (
        <EmptyHero accent={C.coral} icon={<Heart size={46} strokeWidth={1.6}/>} title="No breeding records" sub="Track inseminations, pregnancies and foaling." cta="Add Record" onClick={()=>setModal(true)}/>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {maresBreeding.map(m=>{
            const mare=horses.find(h=>h.id===m.mare_id);
            const statusColor={inseminated:C.amber,confirmed_pregnant:C.mint,empty:C.sub,aborted:C.coral,foaled:C.sky}[m.status]||C.sub;
            return(
              <div key={m.id} style={{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:18, padding:16, display:"flex", alignItems:"flex-start", gap:14 }}>
                <span style={{ width:44, height:44, borderRadius:13, display:"grid", placeItems:"center", background:`${C.coral}1f`, color:C.coral, flexShrink:0 }}><Heart size={20}/></span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:16, fontWeight:600 }}>{mare?.name||"Unknown Mare"} × {m.stallion_name}</div>
                  <div style={{ fontSize:12, color:C.sub, marginTop:3, display:"flex", flexWrap:"wrap", gap:"3px 10px" }}>
                    {m.service_date && <span>📅 {m.service_date.slice(0,10)}</span>}
                    {m.expected_foal_date && <span>🐣 Expected: {m.expected_foal_date.slice(0,10)}</span>}
                    <span style={{ padding:"2px 8px", borderRadius:8, background:`${statusColor}1f`, color:statusColor, fontSize:11, fontWeight:600 }}>{m.status?.replace(/_/g," ")}</span>
                  </div>
                  {m.notes && <div style={{ fontSize:13, background:C.field, padding:"6px 10px", borderRadius:8, marginTop:6 }}>{m.notes}</div>}
                </div>
                <button onClick={()=>deleteMareBreeding(m.id)} className="ev-tap" style={{ border:"none", background:"transparent", cursor:"pointer", color:C.sub, padding:6 }}><Trash2 size={17}/></button>
              </div>
            );
          })}
        </div>
      )}
      {modal && <MareModal t={t} mares={mares} onClose={()=>setModal(false)} onSave={(m)=>{addMareBreeding(m);setModal(false);}}/>}
    </div>
  );
}
function MareModal({ t, mares, onClose, onSave }) {
  const [f,setF]=useState({mare_id:"",stallion_name:"",stallion_studbook:"",service_date:"",service_type:"",expected_foal_date:"",vet_name:"",status:"inseminated",notes:"",cost:""});
  const [err,setErr]=useState(false);
  const save=()=>{if(!f.mare_id||!f.stallion_name.trim()){setErr(true);return;}onSave({...f,cost:f.cost?parseFloat(f.cost):null});};
  return(
    <ModalShell t={t} onClose={onClose} accent={C.coral} icon={<Heart size={22}/>} title="Add Breeding Record">
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="Mare" required><select value={f.mare_id} onChange={e=>{setF({...f,mare_id:e.target.value});setErr(false);}} style={inputStyle(err&&!f.mare_id)}><option value="">Select mare...</option>{mares.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></Field>
        <Field label="Stallion" required><input value={f.stallion_name} onChange={e=>{setF({...f,stallion_name:e.target.value});setErr(false);}} style={inputStyle(err&&!f.stallion_name.trim())}/></Field>
      </div>
      <Field label="Service Type"><div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>{SERVICE_TYPES.map(st=>(<button key={st} type="button" onClick={()=>setF({...f,service_type:st})} className="ev-tap" style={{ padding:"6px 12px", borderRadius:14, border:`1px solid ${f.service_type===st?C.coral:C.line}`, background:f.service_type===st?C.coral:C.field, color:f.service_type===st?"#fff":C.sub, fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>{st.replace(/_/g," ")}</button>))}</div></Field>
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="Service Date"><input type="date" value={f.service_date} onChange={e=>setF({...f,service_date:e.target.value})} style={inputStyle()}/></Field>
        <Field label="Expected Foal Date"><input type="date" value={f.expected_foal_date} onChange={e=>setF({...f,expected_foal_date:e.target.value})} style={inputStyle()}/></Field>
      </div>
      <Field label="Status"><div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>{MARE_STATUS.map(s=>(<button key={s} type="button" onClick={()=>setF({...f,status:s})} className="ev-tap" style={{ padding:"6px 12px", borderRadius:14, border:`1px solid ${f.status===s?C.coral:C.line}`, background:f.status===s?C.coral:C.field, color:f.status===s?"#fff":C.sub, fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>{s.replace(/_/g," ")}</button>))}</div></Field>
      <Field label="Notes"><textarea value={f.notes} onChange={e=>setF({...f,notes:e.target.value})} rows={2} style={{...inputStyle(),resize:"none"}}/></Field>
      <ModalFooter t={t} onClose={onClose} onSave={save} accent={C.coral} saveLabel={t.add||"Add"} saveIcon={<Plus size={20}/>}/>
    </ModalShell>
  );
}

/* ---------- EMBRYOS ---------- */
function EmbryosScreen({ t }) {
  const { embryos, addEmbryo, deleteEmbryo, horses } = useStore();
  const [modal, setModal] = useState(false);
  return (
    <div className="ev-card">
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:10, marginBottom:16 }}>
        <h2 className="ev-display" style={{ margin:0, fontSize:22, fontWeight:700 }}>{t.embryos}</h2>
        <div style={{ flex:1 }}/>
        <button onClick={()=>setModal(true)} className="ev-tap" style={{ display:"flex", alignItems:"center", gap:8, border:"none", cursor:"pointer", fontFamily:"inherit", background:C.lilac, color:"#fff", fontSize:14, fontWeight:600, padding:"10px 16px", borderRadius:13 }}><Plus size={18}/> Add Embryo</button>
      </div>
      {embryos.length===0 ? (
        <EmptyHero accent={C.lilac} icon={<Sparkles size={46} strokeWidth={1.6}/>} title="No embryos" sub="Track flushed, frozen and transferred embryos." cta="Add Embryo" onClick={()=>setModal(true)}/>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {embryos.map(e=>{
            const donor=horses.find(h=>h.id===e.donor_mare_id);
            return(
              <div key={e.id} style={{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:18, padding:16, display:"flex", alignItems:"flex-start", gap:14 }}>
                <span style={{ width:44, height:44, borderRadius:13, display:"grid", placeItems:"center", background:`${C.lilac}1f`, color:C.lilac, flexShrink:0 }}><Sparkles size={20}/></span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:16, fontWeight:600 }}>{donor?.name||"Unknown"} × {e.stallion_name}</div>
                  <div style={{ fontSize:12, color:C.sub, marginTop:3 }}>Flush: {e.flush_date?.slice(0,10)} · {e.status?.replace(/_/g," ")}{e.grade&&` · Grade ${e.grade}`}</div>
                  {e.notes && <div style={{ fontSize:13, background:C.field, padding:"6px 10px", borderRadius:8, marginTop:6 }}>{e.notes}</div>}
                </div>
                <button onClick={()=>deleteEmbryo(e.id)} className="ev-tap" style={{ border:"none", background:"transparent", cursor:"pointer", color:C.sub, padding:6 }}><Trash2 size={17}/></button>
              </div>
            );
          })}
        </div>
      )}
      {modal && <EmbryoModal t={t} horses={horses} onClose={()=>setModal(false)} onSave={(e)=>{addEmbryo(e);setModal(false);}}/>}
    </div>
  );
}
function EmbryoModal({ t, horses, onClose, onSave }) {
  const mares=horses.filter(h=>h.sex==="sexMare");
  const [f,setF]=useState({donor_mare_id:"",stallion_name:"",flush_date:"",grade:"",status:"frozen",storage_location:"",straw_number:"",vet_name:"",notes:"",cost:""});
  const [err,setErr]=useState(false);
  const save=()=>{if(!f.donor_mare_id||!f.stallion_name.trim()||!f.flush_date){setErr(true);return;}onSave({...f,cost:f.cost?parseFloat(f.cost):null});};
  return(
    <ModalShell t={t} onClose={onClose} accent={C.lilac} icon={<Sparkles size={22}/>} title="Add Embryo">
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="Donor Mare" required><select value={f.donor_mare_id} onChange={e=>{setF({...f,donor_mare_id:e.target.value});setErr(false);}} style={inputStyle(err&&!f.donor_mare_id)}><option value="">Select...</option>{mares.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></Field>
        <Field label="Stallion" required><input value={f.stallion_name} onChange={e=>{setF({...f,stallion_name:e.target.value});setErr(false);}} style={inputStyle(err&&!f.stallion_name.trim())}/></Field>
      </div>
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        <Field label="Flush Date" required><input type="date" value={f.flush_date} onChange={e=>{setF({...f,flush_date:e.target.value});setErr(false);}} style={inputStyle(err&&!f.flush_date)}/></Field>
        <Field label="Grade"><input value={f.grade} onChange={e=>setF({...f,grade:e.target.value})} placeholder="1-4" style={inputStyle()}/></Field>
        <Field label="Status"><select value={f.status} onChange={e=>setF({...f,status:e.target.value})} style={inputStyle()}>{["frozen","transferred","pregnant","failed","discarded","exported"].map(s=><option key={s} value={s}>{s}</option>)}</select></Field>
      </div>
      <Field label="Notes"><textarea value={f.notes} onChange={e=>setF({...f,notes:e.target.value})} rows={2} style={{...inputStyle(),resize:"none"}}/></Field>
      <ModalFooter t={t} onClose={onClose} onSave={save} accent={C.lilac} saveLabel={t.add||"Add"} saveIcon={<Plus size={20}/>}/>
    </ModalShell>
  );
}

/* ---------- FOALS ---------- */
function FoalsScreen({ t }) {
  const { foals, addFoal, deleteFoal, horses } = useStore();
  const [modal, setModal] = useState(false);
  return (
    <div className="ev-card">
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:10, marginBottom:16 }}>
        <h2 className="ev-display" style={{ margin:0, fontSize:22, fontWeight:700 }}>{t.foals}</h2>
        <div style={{ flex:1 }}/>
        <button onClick={()=>setModal(true)} className="ev-tap" style={{ display:"flex", alignItems:"center", gap:8, border:"none", cursor:"pointer", fontFamily:"inherit", background:C.amber, color:"#fff", fontSize:14, fontWeight:600, padding:"10px 16px", borderRadius:13 }}><Plus size={18}/> Add Foal</button>
      </div>
      {foals.length===0 ? (
        <EmptyHero accent={C.amber} icon={<Baby size={46} strokeWidth={1.6}/>} title="No foals" sub="Register newborn foals with birth details." cta="Add Foal" onClick={()=>setModal(true)}/>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {foals.map(fo=>{
            const dam=horses.find(h=>h.id===fo.dam_id);
            return(
              <div key={fo.id} style={{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:18, padding:16, display:"flex", alignItems:"flex-start", gap:14 }}>
                <span style={{ width:44, height:44, borderRadius:13, display:"grid", placeItems:"center", background:`${C.amber}1f`, color:C.amber, flexShrink:0 }}><Baby size={20}/></span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:16, fontWeight:600 }}>{fo.name}</div>
                  <div style={{ fontSize:12, color:C.sub, marginTop:3 }}>{[dam&&`Dam: ${dam.name}`, fo.sire_name&&`Sire: ${fo.sire_name}`, `Born: ${fo.birth_date?.slice(0,10)}`, fo.sex&&t[fo.sex]].filter(Boolean).join(" · ")}</div>
                  {fo.notes && <div style={{ fontSize:13, background:C.field, padding:"6px 10px", borderRadius:8, marginTop:6 }}>{fo.notes}</div>}
                </div>
                <button onClick={()=>deleteFoal(fo.id)} className="ev-tap" style={{ border:"none", background:"transparent", cursor:"pointer", color:C.sub, padding:6 }}><Trash2 size={17}/></button>
              </div>
            );
          })}
        </div>
      )}
      {modal && <FoalModal t={t} horses={horses} onClose={()=>setModal(false)} onSave={(fo)=>{addFoal(fo);setModal(false);}}/>}
    </div>
  );
}
function FoalModal({ t, horses, onClose, onSave }) {
  const mares=horses.filter(h=>h.sex==="sexMare");
  const [f,setF]=useState({name:"",dam_id:"",sire_name:"",birth_date:"",sex:"",color:"",birth_type:"normal",vet_present:false,notes:""});
  const [err,setErr]=useState(false);
  const save=()=>{if(!f.name.trim()||!f.birth_date){setErr(true);return;}onSave(f);};
  return(
    <ModalShell t={t} onClose={onClose} accent={C.amber} icon={<Baby size={22}/>} title="Register Foal">
      <Field label={t.name} required><input value={f.name} onChange={e=>{setF({...f,name:e.target.value});setErr(false);}} style={inputStyle(err&&!f.name.trim())}/></Field>
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="Dam"><select value={f.dam_id} onChange={e=>setF({...f,dam_id:e.target.value})} style={inputStyle()}><option value="">—</option>{mares.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></Field>
        <Field label="Sire"><input value={f.sire_name} onChange={e=>setF({...f,sire_name:e.target.value})} style={inputStyle()}/></Field>
      </div>
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        <Field label="Birth Date" required><input type="date" value={f.birth_date} onChange={e=>{setF({...f,birth_date:e.target.value});setErr(false);}} style={inputStyle(err&&!f.birth_date)}/></Field>
        <Field label={t.sex}><select value={f.sex} onChange={e=>setF({...f,sex:e.target.value})} style={inputStyle()}><option value="">—</option>{SEX_OPTS.map(s=><option key={s} value={s}>{t[s]}</option>)}</select></Field>
        <Field label={t.color}><select value={f.color} onChange={e=>setF({...f,color:e.target.value})} style={inputStyle()}><option value="">—</option>{COLORS_LIST.map(c=><option key={c} value={c}>{c}</option>)}</select></Field>
      </div>
      <Field label="Notes"><textarea value={f.notes} onChange={e=>setF({...f,notes:e.target.value})} rows={2} style={{...inputStyle(),resize:"none"}}/></Field>
      <ModalFooter t={t} onClose={onClose} onSave={save} accent={C.amber} saveLabel={t.add||"Add"} saveIcon={<Plus size={20}/>}/>
    </ModalShell>
  );
}

/* ---------- CATALOG ---------- */
const LISTING_TYPES = ["for_sale","for_lease","stud_service","broodmare","auction","free_lease","half_lease","retirement","adoption","other"];

function CatalogScreen({ t }) {
  const { catalog, addCatalogItem, deleteCatalogItem, horses } = useStore();
  const [modal, setModal] = useState(false);
  return (
    <div className="ev-card">
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:10, marginBottom:16 }}>
        <h2 className="ev-display" style={{ margin:0, fontSize:22, fontWeight:700 }}>{t.catalog}</h2>
        <div style={{ flex:1 }}/>
        <button onClick={()=>setModal(true)} className="ev-tap" style={{ display:"flex", alignItems:"center", gap:8, border:"none", cursor:"pointer", fontFamily:"inherit", background:C.mint, color:"#fff", fontSize:14, fontWeight:600, padding:"10px 16px", borderRadius:13 }}><Plus size={18}/> New Listing</button>
      </div>
      {catalog.length===0 ? (
        <EmptyHero accent={C.mint} icon={<ShoppingCart size={46} strokeWidth={1.6}/>} title="No listings" sub="Create horse sales ads, lease listings and stud services." cta="New Listing" onClick={()=>setModal(true)}/>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
          {catalog.map(item=>{
            const horse=horses.find(h=>h.id===item.horse_id);
            return(
              <div key={item.id} style={{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:18, overflow:"hidden" }}>
                {horse?.photo_url && <img src={horse.photo_url} alt={horse.name} style={{ width:"100%", height:160, objectFit:"cover" }}/>}
                <div style={{ padding:16 }}>
                  <div style={{ fontSize:16, fontWeight:600 }}>{item.title}</div>
                  <div style={{ fontSize:13, color:C.sub, marginTop:4 }}>{item.listing_type?.replace(/_/g," ")} · {item.status}</div>
                  {!item.price_on_request && item.price && <div className="ev-display" style={{ fontSize:22, fontWeight:700, color:C.mint, marginTop:6 }}>€{Number(item.price).toLocaleString()}</div>}
                  {item.price_on_request && <div style={{ fontSize:14, fontWeight:600, color:C.amber, marginTop:6 }}>Price on request</div>}
                  {item.description && <div style={{ fontSize:13, color:C.sub, marginTop:6, lineHeight:1.4 }}>{item.description.slice(0,100)}{item.description.length>100?"...":""}</div>}
                  <div style={{ display:"flex", gap:8, marginTop:12 }}>
                    <button onClick={()=>deleteCatalogItem(item.id)} className="ev-tap" style={{ border:"none", background:`${C.coral}1f`, cursor:"pointer", color:C.coral, padding:"8px 14px", borderRadius:10, fontSize:13, fontWeight:600, fontFamily:"inherit" }}><Trash2 size={15}/> Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {modal && <CatalogModal t={t} horses={horses} onClose={()=>setModal(false)} onSave={(item)=>{addCatalogItem(item);setModal(false);}}/>}
    </div>
  );
}
function CatalogModal({ t, horses, onClose, onSave }) {
  const [f,setF]=useState({horse_id:"",title:"",listing_type:"for_sale",price:"",price_on_request:false,description:"",highlights:"",level:"",achievements:"",contact_name:"",contact_phone:"",contact_email:"",location:"",status:"active"});
  const [err,setErr]=useState(false);
  const save=()=>{if(!f.horse_id||!f.title.trim()){setErr(true);return;}onSave({...f,price:f.price?parseFloat(f.price):null});};
  return(
    <ModalShell t={t} onClose={onClose} accent={C.mint} icon={<ShoppingCart size={22}/>} title="New Listing">
      <Field label="Horse" required><select value={f.horse_id} onChange={e=>{setF({...f,horse_id:e.target.value,title:horses.find(h=>h.id===e.target.value)?.name||f.title});setErr(false);}} style={inputStyle(err&&!f.horse_id)}><option value="">Select horse...</option>{horses.map(h=><option key={h.id} value={h.id}>{h.name}</option>)}</select></Field>
      <Field label="Title" required><input value={f.title} onChange={e=>{setF({...f,title:e.target.value});setErr(false);}} style={inputStyle(err&&!f.title.trim())}/></Field>
      <Field label="Listing Type"><div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>{LISTING_TYPES.map(lt=>(<button key={lt} type="button" onClick={()=>setF({...f,listing_type:lt})} className="ev-tap" style={{ padding:"6px 12px", borderRadius:14, border:`1px solid ${f.listing_type===lt?C.mint:C.line}`, background:f.listing_type===lt?C.mint:C.field, color:f.listing_type===lt?"#fff":C.sub, fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight:600 }}>{lt.replace(/_/g," ")}</button>))}</div></Field>
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="Price (€)"><input type="number" value={f.price} onChange={e=>setF({...f,price:e.target.value})} style={inputStyle()}/></Field>
        <Field label="Level"><input value={f.level} onChange={e=>setF({...f,level:e.target.value})} placeholder="e.g. 1.40m" style={inputStyle()}/></Field>
      </div>
      <Field label="Description"><textarea value={f.description} onChange={e=>setF({...f,description:e.target.value})} rows={3} style={{...inputStyle(),resize:"none"}}/></Field>
      <ModalFooter t={t} onClose={onClose} onSave={save} accent={C.mint} saveLabel="Publish" saveIcon={<Check size={20}/>}/>
    </ModalShell>
  );
}

/* ---------- INVOICES ---------- */
function InvoicesScreen({ t }) {
  const { invoices, addInvoice, deleteInvoice, clients, companySettings } = useStore();
  const [modal, setModal] = useState(false);
  const statusColor = s => ({draft:C.sub,sent:C.sky,paid:C.mint,overdue:C.coral,cancelled:C.sub,partial:C.amber}[s]||C.sub);
  return (
    <div className="ev-card">
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:10, marginBottom:16 }}>
        <h2 className="ev-display" style={{ margin:0, fontSize:22, fontWeight:700 }}>{t.invoices}</h2>
        <div style={{ flex:1 }}/>
        <button onClick={()=>setModal(true)} className="ev-tap" style={{ display:"flex", alignItems:"center", gap:8, border:"none", cursor:"pointer", fontFamily:"inherit", background:C.mint, color:"#fff", fontSize:14, fontWeight:600, padding:"10px 16px", borderRadius:13 }}><Plus size={18}/> New Invoice</button>
      </div>
      {invoices.length===0 ? (
        <EmptyHero accent={C.mint} icon={<FileText size={46} strokeWidth={1.6}/>} title="No invoices" sub="Create and manage invoices for your clients." cta="New Invoice" onClick={()=>setModal(true)}/>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {invoices.map(inv=>(
            <div key={inv.id} style={{ background:C.surface, border:`1px solid ${C.line}`, borderRadius:18, padding:16, display:"flex", alignItems:"center", gap:14 }}>
              <span style={{ width:44, height:44, borderRadius:13, display:"grid", placeItems:"center", background:`${C.mint}1f`, color:C.mint, flexShrink:0 }}><FileText size={20}/></span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:16, fontWeight:600 }}>{inv.invoice_number}</div>
                <div style={{ fontSize:13, color:C.sub }}>{inv.client_name} · {inv.invoice_date?.slice(0,10)}</div>
              </div>
              <span style={{ padding:"4px 10px", borderRadius:8, background:`${statusColor(inv.status)}1f`, color:statusColor(inv.status), fontSize:12, fontWeight:600 }}>{inv.status}</span>
              <div className="ev-display" style={{ fontSize:18, fontWeight:700, color:C.ink }}>€{Number(inv.total||0).toFixed(2)}</div>
              <button onClick={()=>deleteInvoice(inv.id)} className="ev-tap" style={{ border:"none", background:"transparent", cursor:"pointer", color:C.sub, padding:6 }}><Trash2 size={17}/></button>
            </div>
          ))}
        </div>
      )}
      {modal && <InvoiceModal t={t} clients={clients} companySettings={companySettings} invoiceCount={invoices.length} onClose={()=>setModal(false)} onSave={(inv)=>{addInvoice(inv);setModal(false);}}/>}
    </div>
  );
}
function InvoiceModal({ t, clients, companySettings, invoiceCount, onClose, onSave }) {
  const prefix = companySettings?.invoice_prefix||"INV";
  const nextNum = String(invoiceCount+1).padStart(4,"0");
  const [f,setF]=useState({
    invoice_number:`${prefix}-${nextNum}`, client_id:"", client_name:"", client_email:"", client_address:"",
    invoice_date:new Date().toISOString().slice(0,10), due_date:"", status:"draft",
    line_items:[{description:"",qty:1,unit_price:0,amount:0}],
    tax_rate:Number(companySettings?.tax_rate||21), notes:""
  });
  const [err,setErr]=useState(false);

  const updateLine=(i,key,val)=>{
    const items=[...f.line_items]; items[i]={...items[i],[key]:val};
    if(key==="qty"||key==="unit_price") items[i].amount=Number(items[i].qty||0)*Number(items[i].unit_price||0);
    setF({...f,line_items:items});
  };
  const addLine=()=>setF({...f,line_items:[...f.line_items,{description:"",qty:1,unit_price:0,amount:0}]});
  const removeLine=(i)=>setF({...f,line_items:f.line_items.filter((_,j)=>j!==i)});

  const subtotal=f.line_items.reduce((s,l)=>s+Number(l.amount||0),0);
  const taxAmount=subtotal*(f.tax_rate/100);
  const total=subtotal+taxAmount;

  const selectClient=(id)=>{
    const client=clients.find(c=>c.id===id);
    if(client) setF({...f, client_id:id, client_name:client.name, client_email:client.email||"", client_address:[client.address,client.city,client.country].filter(Boolean).join(", ")});
  };

  const save=()=>{
    if(!f.client_name.trim()||!f.invoice_date||!f.due_date){setErr(true);return;}
    onSave({...f, subtotal, tax_amount:taxAmount, total, line_items:JSON.stringify(f.line_items)});
  };

  return(
    <ModalShell t={t} onClose={onClose} accent={C.mint} icon={<FileText size={22}/>} title="New Invoice">
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="Invoice #"><input value={f.invoice_number} onChange={e=>setF({...f,invoice_number:e.target.value})} style={inputStyle()}/></Field>
        <Field label="Client" required>
          <select value={f.client_id} onChange={e=>{selectClient(e.target.value);setErr(false);}} style={inputStyle(err&&!f.client_name.trim())}>
            <option value="">Select client...</option>
            {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
      </div>
      <div className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        <Field label="Invoice Date" required><input type="date" value={f.invoice_date} onChange={e=>{setF({...f,invoice_date:e.target.value});setErr(false);}} style={inputStyle(err&&!f.invoice_date)}/></Field>
        <Field label="Due Date" required><input type="date" value={f.due_date} onChange={e=>{setF({...f,due_date:e.target.value});setErr(false);}} style={inputStyle(err&&!f.due_date)}/></Field>
        <Field label="VAT %"><input type="number" value={f.tax_rate} onChange={e=>setF({...f,tax_rate:Number(e.target.value)})} style={inputStyle()}/></Field>
      </div>

      <Divider label="Line Items"/>
      {f.line_items.map((line,i)=>(
        <div key={i} className="ev-modal-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr auto", gap:8, marginBottom:8 }}>
          <input value={line.description} onChange={e=>updateLine(i,"description",e.target.value)} placeholder="Description" style={{...inputStyle(),padding:"10px 12px",fontSize:14}}/>
          <input type="number" value={line.qty} onChange={e=>updateLine(i,"qty",e.target.value)} placeholder="Qty" style={{...inputStyle(),padding:"10px 12px",fontSize:14}}/>
          <input type="number" value={line.unit_price} onChange={e=>updateLine(i,"unit_price",e.target.value)} placeholder="Price" style={{...inputStyle(),padding:"10px 12px",fontSize:14}}/>
          <button onClick={()=>removeLine(i)} className="ev-tap" style={{ border:"none", background:"transparent", cursor:"pointer", color:C.coral, padding:6 }}><Trash2 size={16}/></button>
        </div>
      ))}
      <button onClick={addLine} className="ev-tap" style={{ border:`1px dashed ${C.line}`, background:C.field, borderRadius:10, padding:"8px 14px", cursor:"pointer", fontSize:13, fontWeight:600, color:C.sky, fontFamily:"inherit", width:"100%", marginBottom:16 }}><Plus size={16}/> Add line</button>

      <div style={{ background:C.field, borderRadius:14, padding:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:14, marginBottom:4 }}><span style={{ color:C.sub }}>Subtotal</span><span style={{ fontWeight:600 }}>€{subtotal.toFixed(2)}</span></div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:14, marginBottom:4 }}><span style={{ color:C.sub }}>VAT ({f.tax_rate}%)</span><span style={{ fontWeight:600 }}>€{taxAmount.toFixed(2)}</span></div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:18, fontWeight:700, borderTop:`1px solid ${C.line}`, paddingTop:8, marginTop:8 }}><span>Total</span><span style={{ color:C.mint }}>€{total.toFixed(2)}</span></div>
      </div>

      <ModalFooter t={t} onClose={onClose} onSave={save} accent={C.mint} saveLabel="Create Invoice" saveIcon={<Check size={20}/>}/>
    </ModalShell>
  );
}

function PlaceholderScreen({ t, active }) {
  const Icon = ICONS[active] || Sparkles;
  const color = ACCENT[active] || C.mint;
  return (
    <div className="ev-card">
      <EmptyHero accent={color} icon={<Icon size={46} strokeWidth={1.6} />} title={t[active] || ""} sub={t.comingSoon} cta={t.new} />
    </div>
  );
}

/* ---------- shared UI ---------- */
function EmptyHero({ accent, icon, title, sub, cta, onClick }) {
  return (
    <div style={{ textAlign: "center", padding: "30px 16px" }}>
      <div style={{ width: 110, height: 110, margin: "0 auto 24px", borderRadius: 32,
        display: "grid", placeItems: "center", color: accent,
        background: `linear-gradient(135deg, ${accent}1c, ${accent}08)` }}>{icon}</div>
      <h2 className="ev-display" style={{ fontSize: 26, fontWeight: 700, margin: "0 0 10px" }}>{title}</h2>
      {sub && <p style={{ color: C.sub, fontSize: 15.5, maxWidth: 360, margin: "0 auto 24px", lineHeight: 1.5 }}>{sub}</p>}
      <button onClick={onClick} className="ev-tap" style={{
        border: "none", cursor: "pointer", fontFamily: "inherit", background: accent, color: "#fff",
        fontSize: 16, fontWeight: 600, padding: "15px 28px", borderRadius: 15, marginTop: sub ? 0 : 18,
        display: "inline-flex", alignItems: "center", gap: 9, boxShadow: `0 8px 22px ${accent}55`,
      }}><Plus size={20} /> {cta}</button>
    </div>
  );
}
function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, borderBottom: `1px solid ${C.line}`, marginBottom: 18 }}>
      {tabs.map((label, i) => (
        <button key={i} onClick={() => onChange(i)} className="ev-tap" style={{
          border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit",
          padding: "10px 14px", fontSize: 16, fontWeight: active === i ? 700 : 500,
          color: active === i ? C.ink : C.sub, position: "relative",
        }}>{label}
          {active === i && <span style={{ position: "absolute", left: 12, right: 12, bottom: -1, height: 3,
            background: C.mint, borderRadius: 3 }} />}
        </button>
      ))}
    </div>
  );
}
function Pill({ children, active }) {
  return (
    <span style={{ fontSize: 14, fontWeight: 600, padding: "8px 16px", borderRadius: 12,
      border: `1px solid ${active ? C.mint : C.line}`, color: active ? C.mint : C.sub,
      background: active ? C.mintSoft : C.surface }}>{children}</span>
  );
}

/* ---------- STABLE SUPPLIES ---------- */
function SuppliesScreen({ t }) {
  const { supplies, addSupply, toggleSupplyStatus, deleteSupply } = useStore();
  const [tab, setTab] = useState(0); // 0 pending 1 purchased
  const [modal, setModal] = useState(false);

  const filtered = supplies.filter((s) => tab === 0 ? s.status === "pending" : s.status === "purchased");

  return (
    <div className="ev-card">
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "inline-flex", gap: 2, background: C.bg, borderRadius: 12, padding: 3 }}>
          {[t.statusPending, t.statusPurchased].map((label, i) => (
            <button key={i} onClick={() => setTab(i)} className="ev-tap" style={{
              border: "none", cursor: "pointer", borderRadius: 9, padding: "8px 16px",
              fontSize: 14, fontWeight: 600, fontFamily: "inherit",
              background: tab === i ? C.surface : "transparent", color: tab === i ? C.ink : C.sub,
              boxShadow: tab === i ? "0 1px 4px rgba(0,0,0,.08)" : "none",
            }}>{label}</button>
          ))}
        </div>
        <button onClick={() => setModal(true)} className="ev-tap" style={{
          marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, border: "none", cursor: "pointer", fontFamily: "inherit",
          background: C.mint, color: "#fff", fontSize: 15, fontWeight: 600, padding: "11px 18px", borderRadius: 13,
          boxShadow: "0 6px 16px rgba(47,182,160,.4)" }}>
          <Plus size={19} /> {t.addSupply}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", color: C.sub, padding: "50px 0", fontStyle: "italic" }}>
          {t.noSupplies}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((s) => (
            <div key={s.id} style={{
              background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, padding: 18,
              display: "flex", alignItems: "center", gap: 14, opacity: s.status === "purchased" ? 0.75 : 1
            }}>
              <button onClick={() => toggleSupplyStatus(s.id)} className="ev-tap" style={{
                width: 28, height: 28, borderRadius: 9, border: `1.5px solid ${s.status === "purchased" ? C.mint : C.line}`,
                background: s.status === "purchased" ? C.mintSoft : "transparent", cursor: "pointer",
                display: "grid", placeItems: "center", color: C.mint, padding: 0
              }}>
                {s.status === "purchased" && <Check size={18} strokeWidth={3} />}
              </button>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 600, textDecoration: s.status === "purchased" ? "line-through" : "none", color: s.status === "purchased" ? C.sub : C.ink }}>
                  {s.item_name}
                </div>
                <div style={{ fontSize: 13, color: C.sub, marginTop: 2, display: "flex", flexWrap: "wrap", gap: "6px 12px" }}>
                  {s.quantity && <span><strong>{t.qty}:</strong> {s.quantity}</span>}
                  {s.requested_by && <span><strong>{t.requestedBy}:</strong> {s.requested_by}</span>}
                </div>
                {s.notes && (
                  <div style={{ fontSize: 13, background: C.field, padding: "8px 12px", borderRadius: 10, marginTop: 8, color: C.ink }}>
                    {s.notes}
                  </div>
                )}
              </div>

              <button onClick={() => deleteSupply(s.id)} className="ev-tap" style={{
                border: "none", background: "transparent", cursor: "pointer", color: C.sub, padding: 6
              }}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <SupplyModal t={t} lang={t.code.toLowerCase()} onClose={() => setModal(false)} onSave={(item) => { addSupply(item); setModal(false); }} />
      )}
    </div>
  );
}

function SupplyModal({ t, lang, onClose, onSave }) {
  const [f, setF] = useState({ item_name: "", quantity: "", requested_by: "", notes: "" });
  const [err, setErr] = useState(false);

  const COMMON = {
    nl: ["Hooi", "Stro", "Houtkrullen", "Vlas", "Biks", "Muesli", "Slobber"],
    en: ["Hay", "Straw", "Shavings", "Flax", "Pellets", "Muesli", "Mash"],
    es: ["Heno", "Paja", "Virutas", "Lino", "Pellets", "Muesli", "Papilla"],
  };
  const suggestions = COMMON[lang] || COMMON.en;

  const save = () => {
    if (!f.item_name.trim()) { setErr(true); return; }
    onSave(f);
  };

  return (
    <ModalShell t={t} onClose={onClose} accent={C.coral} icon={<ShoppingCart size={22} />} title={t.addSupply}>
      <Field label={t.supplyItem} required>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {suggestions.map(s => (
            <button key={s} type="button" onClick={() => { setF({...f, item_name: s}); setErr(false); }}
              className="ev-tap"
              style={{
                padding: "8px 14px", borderRadius: 16, border: `1px solid ${f.item_name === s ? C.coral : C.line}`,
                background: f.item_name === s ? C.coral : C.field,
                color: f.item_name === s ? "#fff" : C.sub,
                fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600
              }}>
              {s}
            </button>
          ))}
        </div>
        <input value={f.item_name} onChange={(e) => { setF({ ...f, item_name: e.target.value }); setErr(false); }}
          placeholder={t.supplyItem} style={inputStyle(err)} />
      </Field>
      {err && <div style={{ color: C.coral, fontSize: 13, marginTop: -8, marginBottom: 10 }}>{t.supplyItem} {t.required}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label={t.qty}>
          <input value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })}
            placeholder={t.qtyHint} style={inputStyle()} />
        </Field>
        <Field label={t.requestedBy}>
          <input value={f.requested_by} onChange={(e) => setF({ ...f, requested_by: e.target.value })}
            placeholder={t.reqByHint} style={inputStyle()} />
        </Field>
      </div>

      <Field label={t.notes}>
        <textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })}
          rows={2} style={{ ...inputStyle(), resize: "none" }} placeholder={t.notesHint} />
      </Field>

      <ModalFooter t={t} onClose={onClose} onSave={save} accent={C.coral} saveLabel={t.add} saveIcon={<Plus size={20} />} />
    </ModalShell>
  );
}

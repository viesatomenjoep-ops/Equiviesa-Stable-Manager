import React, { useState, useMemo, createContext, useContext } from "react";
import {
  Menu, X, Bell, Plus, Search, ChevronRight, ChevronLeft, Check,
  Home, Calendar, CheckSquare, Heart, Carrot, MapPin, Contact,
  FileText, Users, Settings, HelpCircle, Receipt, BookOpen,
  Package, Baby, ShoppingCart, Sparkles, Trash2, Camera, MoreHorizontal, Globe, Wallet, ArrowUpRight, ArrowDownRight, Paperclip, ChevronDown, LogOut, Edit2, AlertTriangle, AlertOctagon
} from "lucide-react";
import { supabase } from "./supabaseClient";
import { 
  EditorLayout, PhotoUpload, ContactEditor, ClientEditor, LocationEditor, 
  DocumentEditor, SupplyEditor, FinanceEditor, TaskEditor, HealthEditor, 
  BookingEditor, InvoiceEditor, CatalogEditor, UserEditor, FeedingEditor, QuickReportEditor,
  MareEditor, EmbryoEditor, FoalEditor
} from "./Editors";

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
    chooseFile: "Bestand kiezen", noFileChosen: "Geen bestand gekozen", viewFile: "Bekijken", downloadFile: "Downloaden",
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
    timeStart: "Starttijd", timeEnd: "Eindtijd",
    myDay: "Mijn Dag", myDaySub: "Jouw dagelijkse taken. Tik om af te vinken.",
    reportIssue: "Snel Melden", whatIsWrong: "Wat wil je doorgeven?", issueSupply: "Voorraad nodig", issueDefect: "Kapot / Defect", takePhoto: "Maak een foto (optioneel)", noTasksToday: "Geen taken voor jou vandaag!",
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
    chooseFile: "Choose file", noFileChosen: "No file chosen", viewFile: "View", downloadFile: "Download",
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
    timeStart: "Start time", timeEnd: "End time",
    myDay: "My Day", myDaySub: "Your daily tasks. Tap to complete.",
    reportIssue: "Quick Report", whatIsWrong: "What do you want to report?", issueSupply: "Supply needed", issueDefect: "Broken item / Defect", takePhoto: "Take a photo (optional)", noTasksToday: "No tasks for you today!",
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
    chooseFile: "Elegir archivo", noFileChosen: "Ningún archivo elegido", viewFile: "Ver", downloadFile: "Descargar",
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
    timeStart: "Hora inicio", timeEnd: "Hora fin",
  },
};

/* ---------- helpers ---------- */
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/* ---------- palette (fresh & light) ---------- */
const C = {
  bg: "#FFFFFF", surface: "#FFFFFF", ink: "#1F2D3A", sub: "#64748B",
  line: "#94A3B8", field: "#FFFFFF",
  mint: "#2FB6A0", mintSoft: "#E3F5F0",
  sky: "#5B9BD5", coral: "#FF8A6B", amber: "#F2B441", pink: "#E86A9A", lilac: "#8E7CE0",
};

const SECTIONS = {
  general: ["horses", "calendar", "tasks", "health", "feeding", "supplies", "locations", "contacts", "documents"],
  finance: ["finance", "clients", "bookings", "invoices", "catalog"],
  breeding: ["mares", "embryos", "foals"],
  team: ["staff"],
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
  myday: CheckSquare, horses: Home, calendar: Calendar, tasks: CheckSquare, health: Heart,
  feeding: Carrot, supplies: ShoppingCart, locations: MapPin, contacts: Contact, documents: FileText,
  finance: Wallet, clients: Users, bookings: BookOpen, invoices: Receipt, catalog: Package,
  mares: Heart, embryos: Sparkles, foals: Baby, sales: ShoppingCart,
  staff: Users,
  users: Users, settings: Settings, help: HelpCircle,
};
const ACCENT = {
  myday: C.amber, horses: C.mint, calendar: C.sky, tasks: C.amber, health: C.coral,
  feeding: C.amber, supplies: C.coral, locations: C.mint, contacts: C.sky, documents: C.lilac,
  finance: C.mint, clients: C.sky, bookings: C.sky, invoices: C.sky, catalog: C.sky,
  mares: C.pink, embryos: C.pink, foals: C.pink, sales: C.amber,
  staff: C.lilac,
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
export const useStore = () => useContext(Store);

const HORSE_TINTS = [C.mint, C.sky, C.coral, C.amber, C.pink, C.lilac];

function StoreProvider({ children }) {
  const [horses, setHorses] = useState([]);
  const [txns, setTxns] = useState([]);
  const [users, setUsers] = useState([]);
  const [feed, setFeed] = useState({});
  const [supplies, setSupplies] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [embryos, setEmbryos] = useState([]);
  const [foals, setFoals] = useState([]);
  const [stalls, setStalls] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);

  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchHorses(); fetchTxns(); fetchSupplies(); fetchUsers(); fetchFeed();
        fetchTasks(); fetchHealthRecords(); fetchEmbryos(); fetchFoals(); fetchStalls(); fetchStaff();
      } else {
        setHorses([]); setTxns([]); setSupplies([]); setUsers([]); setFeed({});
        setTasks([]); setHealthRecords([]); setEmbryos([]); setFoals([]); setStalls([]); setStaffMembers([]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const cleanObj = (obj) => {
    const o = { ...obj };
    Object.keys(o).forEach(k => { if (o[k] === "") o[k] = null; });
    delete o.id;
    delete o.created_at;
    return o;
  };

  const fetchHorses = async () => {
    const { data } = await supabase.from('horses').select('*').order('created_at', { ascending: false });
    if (data) setHorses(data.map(h => ({...h, tint: h.tint || HORSE_TINTS[Math.floor(Math.random() * HORSE_TINTS.length)]})));
  };
  const addHorse = async (h) => {
    const cleanH = cleanObj({ ...h, tint: HORSE_TINTS[horses.length % HORSE_TINTS.length] });
    const { data, error } = await supabase.from('horses').insert([cleanH]).select();
    if (error) { console.error(error); alert("Database Error: " + error.message); }
    if (data) setHorses(prev => [data[0], ...prev]);
  };
  const editHorse = async (id, h) => {
    const cleanH = cleanObj(h);
    const { data, error } = await supabase.from('horses').update(cleanH).eq('id', id).select();
    if (error) { console.error(error); alert("Database Error: " + error.message); }
    if (data) setHorses(prev => prev.map(x => x.id === id ? data[0] : x));
  };
  const deleteHorse = async (id) => {
    const { error } = await supabase.from('horses').delete().eq('id', id);
    if (error) { console.error(error); alert("Database Error: " + error.message); }
    else setHorses(prev => prev.filter(h => h.id !== id));
  };

  const fetchTxns = async () => {
    const { data } = await supabase.from('transactions').select('*').order('when', { ascending: false });
    if (data) setTxns(data);
  };
  const addTxn = async (tx) => {
    const { data, error } = await supabase.from('transactions').insert([cleanObj(tx)]).select();
    if (error) { console.error(error); alert("Database Error: " + error.message); }
    if (data) setTxns(prev => [data[0], ...prev]);
  };
  const deleteTxn = async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) { console.error(error); alert("Database Error: " + error.message); }
    else setTxns(prev => prev.filter(x => x.id !== id));
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('*');
    if (data) setUsers(data);
  };
  const addUser = async (u) => {
    const { data, error } = await supabase.from('profiles').insert([cleanObj(u)]).select();
    if (error) { console.error(error); alert("Database Error: " + error.message); }
    if (data) setUsers(prev => [data[0], ...prev]);
  };
  const deleteUser = async (id) => {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) { console.error(error); alert("Database Error: " + error.message); }
    else setUsers(prev => prev.filter(u => u.id !== id));
  };

  const fetchSupplies = async () => {
    const { data } = await supabase.from('supplies_needed').select('*').order('created_at', { ascending: false });
    if (data) setSupplies(data);
  };
  const addSupply = async (item) => {
    // amazon_link column does not exist in live supplies_needed table yet — strip it
    const { amazon_link: _a, ...safe } = item;
    const { data, error } = await supabase.from('supplies_needed').insert([cleanObj({...safe, status: 'pending'})]).select();
    if (error) { console.error(error); alert("Database Error: " + error.message); }
    if (data) setSupplies(prev => [data[0], ...prev]);
  };
  const toggleSupplyStatus = async (id) => {
    const s = supplies.find(x => x.id === id);
    if (!s) return;
    const newStatus = s.status === 'pending' ? 'purchased' : 'pending';
    const { error } = await supabase.from('supplies_needed').update({ status: newStatus }).eq('id', id);
    if (error) { console.error(error); alert("Database Error: " + error.message); }
    else setSupplies(prev => prev.map(x => x.id === id ? { ...x, status: newStatus } : x));
  };
  const deleteSupply = async (id) => {
    const { error } = await supabase.from('supplies_needed').delete().eq('id', id);
    if (error) { console.error(error); alert("Database Error: " + error.message); }
    else setSupplies(prev => prev.filter(s => s.id !== id));
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
    const { data, error } = await supabase.from('feed_schedules').insert([cleanObj({ horse_id: horseId, slot, product: item.product, qty: item.qty })]).select();
    if (error) { console.error("Error adding feed:", error); alert("Database Error: " + error.message); }
    if (data && data[0]) {
      setFeed(prev => {
        const h = prev[horseId] || { morning: [], noon: [], evening: [], night: [] };
        return { ...prev, [horseId]: { ...h, [slot]: [...(h[slot] || []), data[0]] } };
      });
    }
  };
  const deleteFeedItem = async (horseId, slot, itemId) => {
    const { error } = await supabase.from('feed_schedules').delete().eq('id', itemId);
    if (error) { console.error("Error deleting feed:", error); alert("Database Error: " + error.message); }
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
  const addTask = async (t) => {
    const { data, error } = await supabase.from('tasks').insert([cleanObj(t)]).select();
    if (error) { console.error("Error adding task:", error); alert("Database Error: " + error.message); }
    if (data) setTasks(prev => [data[0], ...prev]);
  };
  const editTask = async (id, t) => {
    const { data, error } = await supabase.from('tasks').update(cleanObj(t)).eq('id', id).select();
    if (error) { console.error("Error editing task:", error); alert("Database Error: " + error.message); }
    if (data) setTasks(prev => prev.map(x => x.id === id ? data[0] : x));
  };
  const toggleTask = async (id) => {
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    const done = !t.is_completed;
    const { error } = await supabase.from('tasks').update({ is_completed: done }).eq('id', id);
    if (error) { console.error("Error toggling task:", error); alert("Database Error: " + error.message); }
    else setTasks(prev => prev.map(x => x.id === id ? { ...x, is_completed: done } : x));
  };
  const deleteTask = async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) { console.error("Error deleting task:", error); alert("Database Error: " + error.message); }
    else setTasks(prev => prev.filter(x => x.id !== id));
  };

  /* --- Health Records CRUD --- */
  const fetchHealthRecords = async () => {
    const { data } = await supabase.from('health_records').select('*').order('scheduled_date', { ascending: false });
    if (data) setHealthRecords(data);
  };
  const addHealthRecord = async (rec) => {
    // photo_url column does not exist in live health_records table yet — strip it
    const { photo_url: _p, ...safe } = rec;
    const { data, error } = await supabase.from('health_records').insert([cleanObj(safe)]).select();
    if (error) { console.error("Error adding health record:", error); alert("Database Error: " + error.message); }
    if (data) setHealthRecords(prev => [data[0], ...prev]);
  };
  const editHealthRecord = async (id, rec) => {
    // photo_url column does not exist in live health_records table yet — strip it
    const { photo_url: _p, ...safe } = rec;
    const { data, error } = await supabase.from('health_records').update(cleanObj(safe)).eq('id', id).select();
    if (error) { console.error("Error editing health record:", error); alert("Database Error: " + error.message); }
    if (data) setHealthRecords(prev => prev.map(x => x.id === id ? data[0] : x));
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

  return (
    <Store.Provider value={{ horses, addHorse, editHorse, deleteHorse, txns, addTxn, deleteTxn,
      users, addUser, deleteUser, feed, addFeedItem, deleteFeedItem,
      supplies, addSupply, toggleSupplyStatus, deleteSupply,
      tasks, addTask, editTask, toggleTask, deleteTask,
      healthRecords, addHealthRecord, editHealthRecord, toggleHealthRecord, deleteHealthRecord }}>{children}</Store.Provider>
  );
}

/* ============================================================ */
function getDownloadUrl(url) {
  if (!url) return "";
  if (url.includes("/upload/")) {
    return url.replace("/upload/", "/upload/fl_attachment/");
  }
  return url;
}

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null, info: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error("Caught error:", error, info); this.setState({ info }); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'red', background: '#fee' }}>
          <h2>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error?.toString()}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 10 }}>{this.state.info?.componentStack}</pre>
        </div>
      );
    }
    return this.props.children; 
  }
}

export default function Equivesa() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <AppRoot />
      </StoreProvider>
    </ErrorBoundary>
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
  // Authentication screen has been bypassed per user request

  const go = (key) => {
    if (key === "menu") { setDrawer(true); return; }
    setActive(key);
    setRoute({ name: "list" });
    setDrawer(false);
  };

  const pickMode = (m) => {
    setMode(m);
    setActive(m === "groom" ? "myday" : "horses");
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
        @keyframes evRotate { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }
        input, select { font-family: inherit; }
        .ev-scroll::-webkit-scrollbar { width: 0; height: 0; }
        body.modal-open .ev-bottom { display: none !important; }
        
        .ev-modal-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(14, 21, 30, 0.5);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          animation: evFade .2s ease;
          display: flex; align-items: center; justify-content: center;
        }
        .ev-modal-content {
          position: absolute; inset: 0;
          background: #FFFFFF; display: flex; flex-direction: column;
        }
      `}</style>

      {mode === null ? (
        <ModeGate t={t} onPick={pickMode} lang={lang} setLang={setLang} />
      ) : (
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <DesktopNav t={t} active={active} go={go} lang={lang} setLang={setLang} mode={mode} setMode={setMode} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <TopBar t={t} active={active} route={route} setRoute={setRoute}
              onMenu={() => setDrawer(true)} lang={lang} setLang={setLang} mode={mode} />
            <main className="ev-scroll" style={{ flex: 1, overflowY: "auto", paddingBottom: 96, background: "#FFFFFF" }}>
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
const GROOM_KEYS = ["myday", "calendar", "feeding", "tasks", "health", "supplies", "horses"];
const GROOM_BOTTOM = ["myday", "feeding", "horses"];
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
        <div style={{ width: "100%", textAlign: "center" }}>
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
  const groom = mode === "groom";
  const color = groom ? C.amber : C.mint;
  const label = groom ? t.groomMode : t.managerMode;

  const onSwitch = () => {
    setMode(null);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 6px 4px",
      background: `${color}14`, borderRadius: 12, padding: "8px 10px" }}>
      <span style={{ width: 9, height: 9, borderRadius: "50%", background: color }} />
      <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color }}>{label}</span>
      <button onClick={onSwitch} className="ev-tap" title={t.switchMode} style={{
        border: "none", background: "transparent", cursor: "pointer", color, padding: 2,
        fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>{t.switchMode}</button>
    </div>
  );
}

/* PIN gate: each mode has its own code (manager 1111 / groom 2222) */
function PinModal({ t, target, onClose, onOk }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const accent = target === "groom" ? C.amber : C.mint;
  const check = () => { 
    if (pin.trim() === MODE_PIN[target]) {
      onOk(); 
    } else {
      setErr(true);
      alert(t.wrongPin);
    }
  };
  return (
    <ModalShell t={t} onClose={onClose} accent={accent}
      icon={target === "groom" ? <Carrot size={22} /> : <Sparkles size={22} />}
      title={target === "groom" ? t.groom : t.manager}
      footer={<ModalFooter t={t} onClose={onClose} onSave={check} accent={accent} saveLabel={t.enter} saveIcon={<Check size={20} />} />}>
      <p style={{ color: C.sub, fontSize: 14.5, margin: "0 0 16px" }}>{t.pinHint}</p>
      <input value={pin} onChange={(e) => { setPin(e.target.value); setErr(false); }}
        onKeyDown={(e) => e.key === "Enter" && check()}
        type="password" inputMode="numeric" placeholder="••••" autoFocus
        style={{ ...inputStyle(err), textAlign: "center", fontSize: 26, letterSpacing: 8, fontWeight: 700, color: accent }} />
      {err && <div style={{ color: C.coral, fontSize: 13, marginTop: 8 }}>{t.wrongPin}</div>}
    </ModalShell>
  );
}
function Brand() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "0 6px" }}>
      <img src="/logo.png" alt="Equiviesa Logo" style={{ width: 71, height: 71, objectFit: "contain", flexShrink: 0 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <div className="ev-display" style={{ fontSize: 21, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.1 }}>Equiviesa</div>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: C.sub, letterSpacing: 0.8, textTransform: "uppercase" }}>Stable Manager</div>
      </div>
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
  const FLAGS = { en: "🇬🇧", nl: "🇳🇱", es: "🇪🇸" };
  return (
    <div style={{ display: "flex", gap: 4, background: C.bg, borderRadius: 14, padding: 4,
      width: block ? "100%" : "auto", justifyContent: "center" }}>
      {["en", "nl", "es"].map((l) => (
        <button key={l} onClick={() => setLang(l)} className="ev-tap" style={{
          border: "none", cursor: "pointer", borderRadius: 10, padding: "8px 12px",
          fontSize: 14, fontWeight: 600, fontFamily: "inherit", flex: block ? 1 : "none",
          background: lang === l ? C.surface : "transparent",
          color: lang === l ? C.mint : C.sub,
          boxShadow: lang === l ? "0 2px 8px rgba(0,0,0,.10)" : "none",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          transition: "all .15s",
        }}>
          <span style={{ fontSize: 16 }}>{FLAGS[l]}</span>
          <span style={{ fontSize: 12 }}>{I18N[l].code}</span>
        </button>
      ))}
    </div>
  );
}

function LangMenu({ lang, setLang, t }) {
  const [open, setOpen] = useState(false);
  const LANGS = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "nl", label: "Nederlands", flag: "🇳🇱" },
    { code: "es", label: "Español", flag: "🇪🇸" },
  ];
  const current = LANGS.find(l => l.code === lang);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)} className="ev-tap" aria-label={t.language}
        style={{
          display: "flex", alignItems: "center", gap: 7, padding: "8px 14px",
          borderRadius: 12, border: `1px solid ${open ? C.mint : C.line}`,
          background: open ? `${C.mint}12` : C.surface,
          color: open ? C.mint : C.ink, cursor: "pointer",
          fontFamily: "inherit", transition: "all .15s",
          boxShadow: open ? `0 0 0 3px ${C.mint}22` : "none",
        }}>
        <span style={{ fontSize: 18 }}>{current?.flag}</span>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{current?.code.toUpperCase()}</span>
        <ChevronDown size={14} color={C.sub} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{ position: "absolute", top: 48, right: 0, zIndex: 41, background: C.surface,
            borderRadius: 16, border: `1px solid ${C.line}`, boxShadow: "0 16px 40px rgba(31,45,58,.16)",
            padding: 6, minWidth: 180, animation: "evUp .18s ease both" }}>
            {LANGS.map(({ code: l, label, flag }) => (
              <button key={l} onClick={() => { setLang(l); setOpen(false); }} className="ev-tap" style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", border: "none",
                background: lang === l ? `${C.mint}12` : "transparent",
                cursor: "pointer", borderRadius: 10,
                padding: "11px 14px", fontFamily: "inherit", fontSize: 15,
                fontWeight: lang === l ? 700 : 500, color: C.ink, textAlign: "left",
                transition: "background .1s",
              }}>
                <span style={{ fontSize: 20 }}>{flag}</span>
                <span style={{ flex: 1 }}>{label}</span>
                {lang === l && <Check size={16} color={C.mint} />}
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
          const Icon = k === "menu" ? Menu : (ICONS[k] || Home);
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
function HorseEditWrapper({ t, id, setRoute }) {
  const { horses } = useStore();
  const h = horses.find(x => x.id === id);
  if (!h) return null;
  return <HorseForm t={t} initialData={h} onDone={() => setRoute({ name: "detail", id })} />;
}

function Screen({ active, route, setRoute, t, go }) {
  const wrap = { width: "100%", margin: "0 auto", padding: "22px 18px" };
  if (active === "myday") return <div style={wrap}><MyDayScreen t={t} /></div>;
  if (active === "horses") {
    if (route.name === "add") return <div style={wrap}><HorseForm t={t} onDone={() => setRoute({ name: "list" })} /></div>;
    if (route.name === "edit") return <div style={wrap}><HorseEditWrapper t={t} id={route.id} setRoute={setRoute} /></div>;
    if (route.name === "detail") return <div style={wrap}><HorseDetail t={t} id={route.id} setRoute={setRoute} /></div>;
    return <div style={wrap}><HorsesList t={t} setRoute={setRoute} /></div>;
  }
  if (active === "calendar") return <div style={wrap}><CalendarScreen t={t} /></div>;
  if (active === "tasks") return <div style={wrap}><TasksScreen t={t} /></div>;
  if (active === "health") return <div style={wrap}><HealthScreen t={t} /></div>;
  if (active === "finance") return <div style={wrap}><FinanceScreen t={t} /></div>;
  if (active === "users") return <div style={wrap}><UsersScreen t={t} /></div>;
  if (active === "feeding") return <div style={wrap}><FeedingScreen t={t} go={go} setRoute={setRoute} /></div>;
  if (active === "supplies") return <div style={wrap}><SuppliesScreen t={t} /></div>;
  
  // Generic modules: route-based editor (same approach as HorseForm)
  if (route.name === "add" || route.name === "edit") {
    return <GenericEditorScreen active={active} route={route} setRoute={setRoute} t={t} />;
  }
  return <div style={wrap}><GenericModuleScreen t={t} active={active} setRoute={setRoute} /></div>;
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
const HORSE_COLORS = ["Bay", "Black", "Chestnut", "Grey", "Roan", "Palomino"];
function HorseForm({ t, initialData, onDone }) {
  const { addHorse, editHorse } = useStore();
  const [f, setF] = useState(initialData || { name: "", studbook: "", sex: "", color: "", birthdate: "", ueln: "", chip: "", feiid: "", location: "", photo_url: "" });
  const [err, setErr] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "equivesa_uploads");
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "daj1lyfgk";

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setF(prev => ({ ...prev, photo_url: data.secure_url }));
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const submit = () => {
    if (!f.name.trim()) { setErr(true); return; }
    if (initialData) {
      editHorse(initialData.id, f);
    } else {
      addHorse(f);
    }
    onDone();
  };

  return (
    <ModalShell t={t} onClose={onDone} accent={C.mint} icon={<Home size={22} />} title={initialData ? f.name : t.addHorse}
      footer={<ModalFooter t={t} onClose={onDone} onSave={submit} accent={C.mint} saveLabel={t.save} saveIcon={<Check size={20} />} />}>
      {/* photo upload placeholder */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <label style={{
          width: 96, height: 96, borderRadius: "30%", border: `2px dashed ${C.line}`,
          background: C.field, cursor: "pointer", display: "grid", placeItems: "center",
          color: C.sub, gap: 4, overflow: "hidden", position: "relative"
        }}>
          {f.photo_url ? (
            <img src={f.photo_url} alt="Horse" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : uploading ? (
            <span style={{ fontSize: 12 }}>Up...</span>
          ) : (
            <Camera size={26} />
          )}
          <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
        </label>
      </div>

      <Field label={t.name} required>
        <input value={f.name} onChange={(e) => { setF({...f, name: e.target.value}); setErr(false); }}
          placeholder={t.name + " *"} style={inputStyle(err)} />
      </Field>
      {err && <div style={{ color: C.coral, fontSize: 13, marginTop: -8, marginBottom: 10 }}>{t.nameRequired}</div>}

      <Field label={t.sex}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {SEX_OPTS.map((s) => (
            <button key={s} type="button" onClick={() => setF({...f, sex: s})} className="ev-tap"
              style={{
                flexShrink: 0, padding: "16px 24px", borderRadius: 16, border: `1.5px solid ${f.sex === s ? C.mint : C.line}`,
                background: f.sex === s ? C.mint : C.surface, color: f.sex === s ? "#fff" : C.sub,
                fontSize: 16, cursor: "pointer", fontFamily: "inherit", fontWeight: 600
              }}>
              {t[s]}
            </button>
          ))}
        </div>
      </Field>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Field label={t.birthdate}><input type="date" value={f.birthdate} onChange={(e) => setF({...f, birthdate: e.target.value})} style={inputStyle()} /></Field>
        <Field label={t.studbook}><input value={f.studbook} onChange={(e) => setF({...f, studbook: e.target.value})} placeholder={t.select} style={inputStyle()} /></Field>
      </div>

      <Field label={t.color}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {HORSE_COLORS.map((c) => (
            <button key={c} type="button" onClick={() => setF({...f, color: c})} className="ev-tap"
              style={{
                flexShrink: 0, padding: "16px 24px", borderRadius: 16, border: `1.5px solid ${f.color === c ? C.mint : C.line}`,
                background: f.color === c ? C.mint : C.surface, color: f.color === c ? "#fff" : C.sub,
                fontSize: 16, cursor: "pointer", fontFamily: "inherit", fontWeight: 600
              }}>
              {c}
            </button>
          ))}
        </div>
        <input value={f.color} onChange={(e) => setF({...f, color: e.target.value})} placeholder={t.color} style={inputStyle()} />
      </Field>

      <Divider label={t.optional} />

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Field label={t.ueln}><input value={f.ueln} onChange={(e) => setF({...f, ueln: e.target.value})} placeholder="UELN" style={inputStyle()} /></Field>
        <Field label={t.chip}><input value={f.chip} onChange={(e) => setF({...f, chip: e.target.value})} placeholder={t.chip} style={inputStyle()} /></Field>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Field label={t.feiid}><input value={f.feiid} onChange={(e) => setF({...f, feiid: e.target.value})} placeholder="FEI ID" style={inputStyle()} /></Field>
        <Field label={t.location}><input value={f.location} onChange={(e) => setF({...f, location: e.target.value})} placeholder={t.select} style={inputStyle()} /></Field>
      </div>
    </ModalShell>
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
  width: "100%", padding: "18px 20px", borderRadius: 16, fontSize: 17,
  border: `1.5px solid ${err ? C.coral : C.line}`, background: C.surface,
  color: C.ink, outline: "none", transition: "border-color .2s",
  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)", boxSizing: "border-box"
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
    <div className="ev-card" style={{ width: "100%", margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 24, position: "relative" }}>
        <button onClick={() => setRoute({ name: "edit", id })} className="ev-tap" style={{
          position: "absolute", top: 0, right: 0, border: `1px solid ${C.line}`, background: C.surface, color: C.ink,
          padding: "8px 12px", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, fontFamily: "inherit"
        }}><Edit2 size={15} /> Edit</button>
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

/* ---------- Premium Calendar ---------- */
const CAL_EVENT_TYPES = {
  task:    { label: "Task",        emoji: "✅", color: "#F2B441" },
  health:  { label: "Health",      emoji: "🩺", color: "#FF8A6B" },
  feeding: { label: "Feeding",     emoji: "🥕", color: "#2FB6A0" },
  booking: { label: "Booking",     emoji: "📅", color: "#5B9BD5" },
  finance: { label: "Finance",     emoji: "💰", color: "#8E7CE0" },
};

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function sendNotification(title, body, icon) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/logo.png' });
  }
}

function CalendarScreen({ t }) {
  const { tasks, healthRecords, horses, supplies } = useStore();
  const now = new Date();
  const [year, setYear] = React.useState(now.getFullYear());
  const [month, setMonth] = React.useState(now.getMonth());
  const [selDay, setSelDay] = React.useState(null);
  const [view, setView] = React.useState('month'); // 'month' | 'week'
  const [addModal, setAddModal] = React.useState(false);
  const [notifEnabled, setNotifEnabled] = React.useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );

  const pad = (n) => String(n).padStart(2, '0');
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  const dayStr = (d) => `${year}-${pad(month+1)}-${pad(d)}`;

  // ---- Build unified events map from ALL data sources ----
  const events = useMemo(() => {
    const map = {};
    const add = (key, ev) => { if (!map[key]) map[key] = []; map[key].push(ev); };

    // Tasks
    tasks.forEach(tk => {
      if (!tk.due_date) return;
      const key = tk.due_date.slice(0, 10);
      const horse = horses.find(h => h.id === tk.horse_id);
      add(key, {
        id: tk.id, type: 'task', done: tk.is_completed,
        title: tk.title || 'Task',
        subtitle: horse ? horse.name : (tk.category || ''),
        color: CAL_EVENT_TYPES.task.color,
        emoji: CAL_EVENT_TYPES.task.emoji,
        time: tk.start_time || null,
        location: tk.location || null,
        assignedTo: tk.assigned_to || null,
      });
    });

    // Health records
    healthRecords.forEach(hr => {
      if (!hr.scheduled_date) return;
      const key = hr.scheduled_date.slice(0, 10);
      const horse = horses.find(h => h.id === hr.horse_id);
      add(key, {
        id: hr.id, type: 'health', done: hr.completed,
        title: t[hr.category] || hr.category,
        subtitle: horse ? horse.name : '',
        color: CAL_EVENT_TYPES.health.color,
        emoji: CAL_EVENT_TYPES.health.emoji,
        time: null,
        location: null,
        performedBy: hr.performed_by || null,
      });
    });

    return map;
  }, [tasks, healthRecords, horses, t]);

  // ---- Check upcoming events & notify ----
  React.useEffect(() => {
    requestNotificationPermission();
    if (Notification.permission !== 'granted') return;

    const todayEvents = events[todayStr] || [];
    const upcoming = todayEvents.filter(ev => !ev.done);
    if (upcoming.length > 0) {
      const titles = upcoming.slice(0, 3).map(ev => `${ev.emoji} ${ev.title}${ev.subtitle ? ' · ' + ev.subtitle : ''}`).join('\n');
      sendNotification(
        `📅 ${upcoming.length} item${upcoming.length > 1 ? 's' : ''} vandaag`,
        titles
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayStr]);

  const enableNotifications = async () => {
    const perm = await Notification.requestPermission();
    setNotifEnabled(perm === 'granted');
    if (perm === 'granted') sendNotification('✅ Notificaties ingeschakeld', 'Je krijgt meldingen voor geplande activiteiten.');
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y-1); } else setMonth(m => m-1); setSelDay(null); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y+1); } else setMonth(m => m+1); setSelDay(null); };
  const goToday = () => { setYear(now.getFullYear()); setMonth(now.getMonth()); setSelDay(now.getDate()); };

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selEvents = selDay ? (events[dayStr(selDay)] || []) : [];
  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const monthName = (t.months && t.months[month]) ? cap(t.months[month]) : MONTH_NAMES[month];
  const wdays = t.weekdays || WEEKDAYS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: '0 4px 32px rgba(0,0,0,0.07)', minHeight: 'calc(100vh - 160px)' }}>

      {/* ---- Top Bar ---- */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 22px 14px', background: '#fff', borderBottom: `1px solid ${C.line}`, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <button onClick={prev} className="ev-tap" style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${C.line}`, background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            <ChevronLeft size={18} color={C.ink} />
          </button>
          <h2 className="ev-display" style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.ink }}>
            {monthName} <span style={{ color: C.sub, fontWeight: 500 }}>{year}</span>
          </h2>
          <button onClick={next} className="ev-tap" style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${C.line}`, background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
            <ChevronRight size={18} color={C.ink} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={goToday} className="ev-tap" style={{ padding: '8px 16px', borderRadius: 10, border: `1px solid ${C.line}`, background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: C.mint, fontFamily: 'inherit' }}>
            {t.today || 'Today'}
          </button>
          {!notifEnabled && 'Notification' in window && (
            <button onClick={enableNotifications} className="ev-tap" style={{ padding: '8px 14px', borderRadius: 10, border: `1px solid ${C.amber}`, background: `${C.amber}18`, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: C.amber, fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Bell size={14} /> {t.enableNotifications || 'Notify me'}
            </button>
          )}
          {notifEnabled && (
            <span style={{ fontSize: 12, color: C.mint, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Bell size={13} /> On
            </span>
          )}
        </div>
      </div>

      {/* ---- Legend ---- */}
      <div className="ev-scroll" style={{ display: 'flex', gap: 12, padding: '10px 22px', borderBottom: `1px solid ${C.line}`, overflowX: 'auto', background: '#fafbfc' }}>
        {Object.values(CAL_EVENT_TYPES).map(et => (
          <div key={et.label} style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: et.color }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: C.sub }}>{et.emoji} {et.label}</span>
          </div>
        ))}
      </div>

      {/* ---- Main Body: Grid + Detail ---- */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

        {/* ---- Month Grid ---- */}
        <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 4 }}>
            {wdays.map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: (i >= 5 ? C.coral : C.sub), textTransform: 'uppercase', letterSpacing: 0.6, padding: '4px 0' }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, flex: 1 }}>
            {cells.map((d, i) => {
              if (d === null) return <div key={`e${i}`} />;
              const ds = dayStr(d);
              const isToday = ds === todayStr;
              const isSel = selDay === d;
              const evs = events[ds] || [];
              const isDone = evs.length > 0 && evs.every(ev => ev.done);
              // Unique event type colors for density dots
              const uniqueColors = [...new Set(evs.map(ev => ev.color))].slice(0, 4);
              const isWeekend = (firstDow + d - 1) % 7 >= 5;
              return (
                <button key={d} onClick={() => setSelDay(d === selDay ? null : d)} className="ev-tap" style={{
                  border: isSel ? `2px solid ${C.mint}` : isToday ? `2px solid ${C.mint}55` : '1px solid transparent',
                  borderRadius: 14,
                  padding: '8px 4px 10px',
                  background: isSel ? `${C.mint}0f` : isToday ? `${C.mint}08` : 'transparent',
                  cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  minHeight: 72, position: 'relative',
                  transition: 'all .15s',
                }}>
                  {/* Date number */}
                  <span style={{
                    fontSize: 14, fontWeight: isToday ? 800 : 500,
                    width: 28, height: 28, lineHeight: '28px', borderRadius: '50%', display: 'inline-block',
                    background: isToday ? C.mint : 'transparent',
                    color: isToday ? '#fff' : isWeekend ? C.coral : C.ink,
                  }}>{d}</span>

                  {/* Event density bars */}
                  {evs.length > 0 && (
                    <div style={{ width: '100%', padding: '0 3px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {evs.slice(0, 3).map((ev, j) => (
                        <div key={j} style={{
                          height: 3, borderRadius: 2,
                          background: ev.done ? `${ev.color}55` : ev.color,
                          width: '100%'
                        }} />
                      ))}
                      {evs.length > 3 && (
                        <div style={{ fontSize: 9, color: C.sub, fontWeight: 700, textAlign: 'center' }}>+{evs.length - 3}</div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---- Day Detail Panel ---- */}
        {selDay && (
          <div style={{
            width: 300, flexShrink: 0, borderLeft: `1px solid ${C.line}`,
            display: 'flex', flexDirection: 'column', background: '#fff',
            animation: 'evFade .2s ease',
          }}>
            {/* Panel header */}
            <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${C.line}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{monthName}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: C.ink, lineHeight: 1 }}>{selDay}</div>
              <div style={{ fontSize: 13, color: C.sub, marginTop: 4 }}>
                {selEvents.length === 0 ? (t.nothingPlanned || 'Nothing planned') : `${selEvents.length} event${selEvents.length > 1 ? 's' : ''}`}
              </div>
            </div>

            {/* Event list */}
            <div className="ev-scroll" style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selEvents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
                  <div style={{ color: C.sub, fontSize: 14 }}>{t.nothingPlanned || 'Nothing planned'}</div>
                </div>
              ) : (
                selEvents.map((ev, i) => (
                  <div key={i} style={{
                    borderRadius: 14, padding: '12px 14px',
                    background: `${ev.color}12`,
                    border: `1.5px solid ${ev.color}33`,
                    opacity: ev.done ? 0.65 : 1,
                    position: 'relative',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{
                        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                        background: `${ev.color}22`, display: 'grid', placeItems: 'center',
                        fontSize: 16,
                      }}>{ev.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, textDecoration: ev.done ? 'line-through' : 'none' }}>
                          {ev.title}
                        </div>
                        {ev.subtitle && <div style={{ fontSize: 12, color: C.sub, marginTop: 1 }}>🐴 {ev.subtitle}</div>}
                        {ev.time && <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>🕐 {ev.time}</div>}
                        {ev.performedBy && <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>👤 {ev.performedBy}</div>}
                        {ev.assignedTo && <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>👤 {ev.assignedTo}</div>}
                        {ev.location && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location)}`}
                            target="_blank" rel="noreferrer"
                            style={{ fontSize: 12, color: ev.color, fontWeight: 700, textDecoration: 'none', marginTop: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <MapPin size={11} /> {ev.location}
                          </a>
                        )}
                      </div>
                      {ev.done && <span style={{ fontSize: 11, fontWeight: 700, color: ev.color, background: `${ev.color}20`, padding: '3px 8px', borderRadius: 8 }}>Done</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ---- Upcoming strip at bottom ---- */}
      <div style={{ borderTop: `1px solid ${C.line}`, padding: '14px 20px', background: '#fafbfc' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Upcoming</div>
        <div className="ev-scroll" style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {(() => {
            const upcoming = [];
            for (let offset = 0; offset < 14; offset++) {
              const d = new Date(now);
              d.setDate(d.getDate() + offset);
              const key = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
              const dayEvs = (events[key] || []).filter(ev => !ev.done);
              dayEvs.forEach(ev => upcoming.push({ ...ev, dateKey: key, dateLabel: offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0,3)}` }));
            }
            if (upcoming.length === 0) return <div style={{ fontSize: 13, color: C.sub }}>No upcoming events in the next 14 days 🎉</div>;
            return upcoming.slice(0, 8).map((ev, i) => (
              <div key={i} style={{ flexShrink: 0, background: `${ev.color}15`, border: `1.5px solid ${ev.color}40`, borderRadius: 14, padding: '10px 14px', minWidth: 160, maxWidth: 200 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: ev.color, marginBottom: 4 }}>{ev.emoji} {ev.dateLabel}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</div>
                {ev.subtitle && <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{ev.subtitle}</div>}
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}

/* ---------- Tasks ---------- */
function TasksScreen({ t }) {
  const { tasks, addTask, editTask, toggleTask, deleteTask, horses } = useStore();
  const [tab, setTab] = useState(0); // 0 = open, 1 = completed
  const [modal, setModal] = useState(false);
  const [editObj, setEditObj] = useState(null);

  const filtered = tasks.filter(tk => tab === 0 ? !tk.is_completed : tk.is_completed);

  return (
    <div className="ev-card">
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
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
        <button onClick={() => setModal(true)} className="ev-tap" style={{
          marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, border: "none", cursor: "pointer", fontFamily: "inherit",
          background: C.amber, color: "#fff", fontSize: 15, fontWeight: 600, padding: "11px 18px", borderRadius: 13,
          boxShadow: `0 6px 16px ${C.amber}66` }}>
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
                    {(tk.start_time || tk.end_time) && (
                      <span>⏱️ {tk.start_time?.slice(0,5) || "-"} {tk.end_time ? `- ${tk.end_time.slice(0,5)}` : ""}</span>
                    )}
                    {horse && <span>🐴 {horse.name}</span>}
                    {tk.category && <span style={{ padding: "2px 8px", borderRadius: 8, background: tk.category === "horse" ? C.mintSoft : C.bg,
                      fontSize: 11, fontWeight: 600 }}>{tk.category === "horse" ? t.horses : t.general}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, opacity: tk.is_completed ? 0.5 : 1 }}>
                  <button onClick={() => setEditObj(tk)} className="ev-tap" style={{
                    border: "none", background: "transparent", cursor: "pointer", color: C.sub, padding: 6 }}>
                    <Edit2 size={17} />
                  </button>
                  <button onClick={() => deleteTask(tk.id)} className="ev-tap" style={{
                    border: "none", background: "transparent", cursor: "pointer", color: C.sub, padding: 6 }}>
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <TaskEditor t={t} horses={horses} onClose={() => setModal(false)}
          onSave={(task) => { addTask(task); setModal(false); }} />
      )}
      {editObj && (
        <TaskEditor t={t} horses={horses} initialData={editObj} onClose={() => setEditObj(null)}
          onSave={(task) => { editTask(editObj.id, task); setEditObj(null); }}
          onDelete={() => { deleteTask(editObj.id); setEditObj(null); }} />
      )}
    </div>
  );
}

/* ---------- Health ---------- */
function HealthScreen({ t }) {
  const { healthRecords, addHealthRecord, editHealthRecord, toggleHealthRecord, deleteHealthRecord, horses } = useStore();
  const [activeCat, setActiveCat] = useState(null); // null = overview, string = category subpage
  const [modal, setModal] = useState(null); // null or category string
  const [editRecord, setEditRecord] = useState(null);

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
                  <div style={{ display: "flex", gap: 6, opacity: hr.completed ? 0.5 : 1 }}>
                    <button onClick={() => setEditRecord(hr)} className="ev-tap" style={{
                      border: "none", background: "transparent", cursor: "pointer", color: C.sub, padding: 6 }}>
                      <Edit2 size={17} />
                    </button>
                    <button onClick={() => deleteHealthRecord(hr.id)} className="ev-tap" style={{
                      border: "none", background: "transparent", cursor: "pointer", color: C.sub, padding: 6 }}>
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {modal && (
          <HealthEditor t={t} category={modal} horses={horses} onClose={() => setModal(null)}
            onSave={(rec) => { addHealthRecord(rec); setModal(null); }} />
        )}
        {editRecord && (
          <HealthEditor t={t} horses={horses} initialData={editRecord} onClose={() => setEditRecord(null)}
            onSave={(rec) => { editHealthRecord(editRecord.id, rec); setEditRecord(null); }}
            onDelete={() => { deleteHealthRecord(editRecord.id); setEditRecord(null); }} />
        )}
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

      {modal && (
        <HealthEditor t={t} category={modal} horses={horses} onClose={() => setModal(null)}
          onSave={(rec) => { addHealthRecord(rec); setModal(null); }} />
      )}
      {editRecord && (
        <HealthEditor t={t} horses={horses} initialData={editRecord} onClose={() => setEditRecord(null)}
          onSave={(rec) => { editHealthRecord(editRecord.id, rec); setEditRecord(null); }}
          onDelete={() => { deleteHealthRecord(editRecord.id); setEditRecord(null); }} />
      )}
    </div>
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

      {modal && (
        <FinanceEditor type={modal} t={t} onClose={() => setModal(null)} onSave={() => setModal(null)} />
      )}
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

      {modal && (
        <UserEditor t={t} onClose={() => setModal(false)} />
      )}
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

/* ---------- FEEDING ---------- */
const SLOTS = ["morning", "noon", "evening", "night"];
function FeedingScreen({ t, go, setRoute }) {
  const { horses, feed, addFeedItem, deleteFeedItem } = useStore();
  const [tab, setTab] = useState(0); // 0 feeding 1 order
  const [slot, setSlot] = useState("morning");
  const [horseFilter, setHorseFilter] = useState("");
  const [addFor, setAddFor] = useState(null); // horseId to add product for

  if (horses.length === 0) {
    return (
      <div className="ev-card">
        <EmptyHero accent={C.amber} icon={<Carrot size={46} strokeWidth={1.6} />}
          title={t.noFeed} sub={t.noFeedSub} cta={t.addHorse} onClick={() => { go("horses"); setRoute({ name: "add" }); }} />
      </div>
    );
  }

  const shown = horseFilter ? horses.filter((h) => h.id === Number(horseFilter)) : horses;

  return (
    <div className="ev-card">
      <Tabs tabs={[t.feedingTab, t.orderTab]} active={tab} onChange={setTab} />

      {tab === 0 ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
            {/* Slot selector */}
            <div style={{ display: "inline-flex", gap: 3, background: C.bg, borderRadius: 16, padding: 4, alignSelf: "flex-start" }}>
              {SLOTS.map((s) => (
                <button key={s} onClick={() => setSlot(s)} className="ev-tap" style={{
                  border: "none", cursor: "pointer", borderRadius: 14, padding: "16px 28px",
                  fontSize: 16, fontWeight: 600, fontFamily: "inherit",
                  background: slot === s ? C.sky : "transparent", color: slot === s ? "#fff" : C.sub }}>
                  {t[s]}
                </button>
              ))}
            </div>
            
            {/* Horse filter pill row */}
            <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 8, paddingBottom: 8 }}>
              <button type="button" onClick={() => setHorseFilter("")} className="ev-tap"
                style={{ flexShrink: 0, padding: "14px 22px", borderRadius: 16, border: `1.5px solid ${!horseFilter ? C.sky : C.line}`, background: !horseFilter ? C.sky : C.surface, color: !horseFilter ? "#fff" : C.sub, fontSize: 15, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                {t.allHorsesShort}
              </button>
              {horses.map(h => (
                <button key={h.id} type="button" onClick={() => setHorseFilter(String(h.id))} className="ev-tap"
                  style={{ flexShrink: 0, padding: "14px 22px", borderRadius: 16, border: `1.5px solid ${horseFilter === String(h.id) ? C.sky : C.line}`, background: horseFilter === String(h.id) ? C.sky : C.surface, color: horseFilter === String(h.id) ? "#fff" : C.sub, fontSize: 15, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                  {h.name}
                </button>
              ))}
            </div>
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
                    <button onClick={() => setAddFor(h.id)} className="ev-tap" style={{ 
                      display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 14,
                      border: `1.5px dashed ${C.amber}`, background: `${C.amber}11`, color: C.amber,
                      fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit"
                    }}>
                      <Plus size={18} strokeWidth={2.5} /> {t.add} {t.feedingTab}
                    </button>
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
        <OrderTab t={t} setTab={setTab} />
      )}

      {addFor != null && (
        <FeedingEditor t={t} slot={slot}
          onClose={() => setAddFor(null)}
          onSave={(item) => { addFeedItem(addFor, slot, item); setAddFor(null); }} />
      )}
    </div>
  );
}

function OrderTab({ t, setTab }) {
  const { feed } = useStore();
  // aggregate products across all horses & slots
  const totals = {};
  Object.values(feed).forEach((slots) => Object.values(slots).forEach((arr) =>
    arr.forEach((it) => { totals[it.product] = (totals[it.product] || 0) + 1; })));
  const entries = Object.entries(totals);

  if (entries.length === 0) {
    return <EmptyHero accent={C.sky} icon={<Package size={46} strokeWidth={1.6} />} title={t.empty} sub="" cta={t.feedingTab} onClick={() => setTab(0)} />;
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

/* ---------- reusable modal shell ---------- */
function ModalShell({ t, onClose, accent, icon, title, children, footer }) {
  React.useEffect(() => {
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);

  return (
    <div className="ev-modal-overlay" onClick={onClose}>
      <div className="ev-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header (Fixed) */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 24px",
          background: C.surface, borderBottom: `1px solid ${C.line}`, flexShrink: 0 }}>
          <span style={{ width: 48, height: 48, borderRadius: 16, display: "grid", placeItems: "center",
            background: `${accent}1c`, color: accent }}>{icon}</span>
          <h2 className="ev-display" style={{ flex: 1, margin: 0, fontSize: 26, fontWeight: 700, color: C.ink }}>{title}</h2>
          <button onClick={onClose} className="ev-tap" style={{ ...iconBtn, boxShadow: "none", background: C.bg, width: 44, height: 44 }}>
            <X size={26} />
          </button>
        </div>

      {/* Content (Scrollable) */}
      <div className="ev-scroll" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "28px 24px", width: "100%", display: "flex", flexDirection: "column", gap: 24, flex: 1 }}>
          {children}
        </div>
      </div>

      {/* Footer (Fixed at bottom) */}
      {footer && (
        <div style={{ padding: "20px 24px", background: C.surface, borderTop: `1px solid ${C.line}`, width: "100%", flexShrink: 0 }}>
          {footer}
        </div>
      )}
      </div>
    </div>
  );
}

function ModalFooter({ t, onClose, onSave, accent, saveLabel, saveIcon }) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <button onClick={onClose} className="ev-tap" style={{
        flex: 1, padding: "18px", borderRadius: 16, border: `1px solid ${C.line}`, background: C.surface,
        color: C.ink, fontSize: 17, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t.cancel}</button>
      <button onClick={onSave} className="ev-tap" style={{
        flex: 2, padding: "18px", borderRadius: 16, border: "none", background: accent, color: "#fff",
        fontSize: 17, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: `0 8px 22px ${accent}55` }}>
        {saveIcon} {saveLabel}
      </button>
    </div>
  );
}

const GENERIC_CONFIG = {
  locations: { table: "locations", fields: [{n:"name",l:"Name",r:true}, {n:"type",l:"Type",r:true}, {n:"capacity",l:"Capacity",t:"number"}, {n:"notes",l:"Notes"}] },
  contacts: { table: "contacts", fields: [{n:"name",l:"Name",r:true}, {n:"email",l:"Email"}, {n:"phone",l:"Phone"}, {n:"role",l:"Role",opts:["owner","client","vet","farrier","rider","supplier","other"]}, {n:"notes",l:"Notes"}] },
  documents: { table: "documents", fields: [{n:"name",l:"Name",r:true}, {n:"url",l:"File",t:"file",r:true}, {n:"file_type",l:"Type"}] },
  clients: { table: "contacts", defaultVals: { role: "client" }, fields: [{n:"name",l:"Name",r:true}, {n:"email",l:"Email"}, {n:"phone",l:"Phone"}, {n:"notes",l:"Notes"}] },
  bookings: { table: "bookings", fields: [{n:"date",l:"Date",t:"date",r:true}, {n:"status",l:"Status"}, {n:"notes",l:"Notes"}] },
  invoices: { table: "invoices", fields: [{n:"reference",l:"Reference",r:true}, {n:"date",l:"Date",t:"date",r:true}, {n:"amount",l:"Amount",t:"number",r:true}, {n:"status",l:"Status"}] },
  catalog: { table: "catalog", fields: [{n:"price",l:"Price",t:"number"}, {n:"description",l:"Description"}] },
  mares: { table: "mares_breeding", fields: [{n:"stallion_name",l:"Stallion",r:true}, {n:"service_date",l:"Service Date",t:"date"}, {n:"expected_foal_date",l:"Expected Foal Date",t:"date"}, {n:"status",l:"Status",opts:["inseminated", "confirmed_pregnant", "empty", "aborted", "foaled"],r:true}] },
  embryos: { table: "embryos", fields: [{n:"stallion_name",l:"Stallion",r:true}, {n:"flush_date",l:"Flush Date",t:"date",r:true}, {n:"status",l:"Status",opts:["frozen", "transferred", "pregnant", "failed"],r:true}] },
  foals: { table: "horses", defaultVals: { archived: false }, fields: [{n:"name",l:"Name",r:true}, {n:"birthdate",l:"Birthdate",t:"date"}] }
};

/* ---------- Full-page editor for generic modules (renders at Screen level) ---------- */
function GenericEditorScreen({ active, route, setRoute, t }) {
  const conf = GENERIC_CONFIG[active];
  const color = ACCENT[active] || C.mint;
  const Icon = ICONS[active] || Sparkles;
  const editObj = route.data || null;

  const [data, setData] = React.useState(editObj || (conf ? (conf.defaultVals || {}) : {}));
  const [err, setErr] = React.useState(false);
  const [uploadingField, setUploadingField] = React.useState(null);

  const goBack = () => setRoute({ name: "list" });

  const save = async (customData) => {
    let o;
    if (customData) {
      o = { ...customData };
    } else {
      if (conf) {
        const missing = conf.fields.some(field => field.r && !data[field.n]);
        if (missing) { setErr(true); return; }
      }
      o = { ...data };
      Object.keys(o).forEach(k => { if (o[k] === "") o[k] = null; });
    }
    const table = conf?.table;
    if (!table) { goBack(); return; }
    delete o.id;
    delete o.created_at;

    if (editObj?.id) {
      const { error } = await supabase.from(table).update(o).eq('id', editObj.id);
      if (error) { alert("Database Error: " + error.message); return; }
    } else {
      const { error } = await supabase.from(table).insert([o]);
      if (error) { alert("Database Error: " + error.message); return; }
    }
    goBack();
  };

  const del = async () => {
    if (!editObj?.id || !conf?.table) return;
    await supabase.from(conf.table).delete().eq('id', editObj.id);
    goBack();
  };

  // Pick the specialized premium editor if available
  const PremiumEditor = active === 'contacts' ? ContactEditor :
                        active === 'clients' ? ClientEditor :
                        active === 'locations' ? LocationEditor :
                        active === 'documents' ? DocumentEditor :
                        active === 'bookings' ? BookingEditor :
                        active === 'invoices' ? InvoiceEditor :
                        active === 'catalog' ? CatalogEditor :
                        active === 'mares' ? MareEditor :
                        active === 'embryos' ? EmbryoEditor :
                        active === 'foals' ? FoalEditor : null;

  const wrap = { width: "100%", margin: "0 auto", padding: "22px 18px" };

  if (PremiumEditor) {
    return (
      <div style={wrap}>
        <PremiumEditor
          t={t}
          initialData={editObj}
          onSave={save}
          onClose={goBack}
          onDelete={editObj ? del : null}
        />
      </div>
    );
  }

  // Fallback: generic field-based editor rendered as a full page (not modal)
  if (!conf) return null;
  return (
    <div style={wrap}>
      <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.07)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", borderBottom: `1px solid ${C.line}`, background: "#fff" }}>
          <span style={{ width: 48, height: 48, borderRadius: 16, display: "grid", placeItems: "center", background: `${color}1c`, color: color }}>
            <Icon size={22} />
          </span>
          <h2 style={{ flex: 1, margin: 0, fontSize: 24, fontWeight: 700, color: C.ink }}>
            {editObj ? (t.edit || "Edit") : `${t.add || "Add"} ${t[active] || active}`}
          </h2>
          <button onClick={goBack} style={{ width: 44, height: 44, borderRadius: 12, border: "none", background: `${C.line}44`, display: "grid", placeItems: "center", cursor: "pointer" }}>
            <ArrowLeft size={22} color={C.ink} />
          </button>
        </div>

        {/* Fields */}
        <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
          <PhotoUpload url={data.photo_url} onChange={(url) => setData(d => ({...d, photo_url: url}))}
            uploading={uploadingField === "photo_url"} setUploading={(u) => setUploadingField(u ? "photo_url" : null)} icon={Camera} />

          {conf.fields.map(field => (
            <GenericField key={field.n} field={field} value={data[field.n]} color={color} err={err} t={t}
              onChange={(v) => setData(d => ({...d, [field.n]: v}))} />
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "20px 24px", borderTop: `1px solid ${C.line}`, display: "flex", gap: 12, background: "#fff" }}>
          {editObj && (
            <button onClick={del} style={{ padding: "16px 20px", borderRadius: 16, border: `1.5px solid ${C.coral}`, background: "transparent", color: C.coral, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15 }}>
              <Trash2 size={18} /> {t.delete || "Delete"}
            </button>
          )}
          <button onClick={() => save()} style={{ flex: 1, padding: "18px", borderRadius: 16, border: "none", background: color, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 24px ${color}44` }}>
            <Check size={20} strokeWidth={2.5} /> {t.save || "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function GenericField({ field, value, color, err, t, onChange }) {
  const inputSt = (hasErr) => ({
    width: "100%", padding: "16px 20px", borderRadius: 16,
    border: `1.5px solid ${hasErr ? C.coral : C.line}`, background: hasErr ? "#fff" : C.field,
    fontSize: 16, color: C.ink, outline: "none", fontFamily: "inherit"
  });
  const label = t[field.n] || field.l || field.n;
  const hasErr = err && field.r && !value;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 4 }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: C.sub, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label} {field.r && <span style={{ color: C.coral }}>*</span>}
      </label>
      {field.opts ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {field.opts.map(opt => (
            <button key={opt} type="button" onClick={() => onChange(opt)}
              style={{ flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${value === opt ? color : C.line}`,
                background: value === opt ? color : C.surface, color: value === opt ? "#fff" : C.sub,
                fontSize: 15, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>
              {t[opt] || opt}
            </button>
          ))}
        </div>
      ) : field.t === "checkbox" ? (
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
      ) : field.t === "textarea" || field.n === "notes" || field.n === "description" ? (
        <textarea value={value || ""} onChange={(e) => onChange(e.target.value)}
          style={{ ...inputSt(hasErr), minHeight: 120, resize: "vertical" }} />
      ) : (
        <input type={field.t || "text"} value={value || ""} onChange={(e) => onChange(e.target.value)}
          style={inputSt(hasErr)} />
      )}
    </div>
  );
}

function GenericModuleScreen({ t, active, setRoute }) {
  const conf = GENERIC_CONFIG[active];
  const color = ACCENT[active] || C.mint;
  const Icon = ICONS[active] || Sparkles;
  
  const [data, setData] = useState([]);

  const del = async (id) => {
    if (!conf?.table) return;
    await supabase.from(conf.table).delete().eq('id', id);
    setData(prev => prev.filter(x => x.id !== id));
  };

  React.useEffect(() => {
    if (!conf) return;
    const fetch = async () => {
      const { data: res } = await supabase.from(conf.table).select('*').order('created_at', { ascending: false });
      if (res) {
        if (conf.defaultVals) {
          const keys = Object.keys(conf.defaultVals);
          setData(res.filter(x => keys.every(k => x[k] === conf.defaultVals[k])));
        } else {
          setData(res);
        }
      }
    };
    fetch();
  }, [active, conf]);

  if (!conf) {
    return (
      <div className="ev-card">
        <EmptyHero accent={color} icon={<Icon size={46} strokeWidth={1.6} />} title={t[active] || active} sub={t.comingSoon} cta={t.new} />
      </div>
    );
  }

  const displayName = (x) => x.name || x.reference || x.stallion_name || x.title || x.invoice_number || x.date || "—";

  return (
    <div className="ev-card">
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setRoute({ name: "add" })} className="ev-tap" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "15px 24px", borderRadius: 15, border: "none", cursor: "pointer", fontFamily: "inherit",
          background: color, color: "#fff", fontSize: 15.5, fontWeight: 600, boxShadow: `0 8px 20px ${color}50`,
        }}>
          <Plus size={20} /> {t.add} {t[active] || active}
        </button>
      </div>

      {data.length === 0 ? (
        <EmptyHero accent={color} icon={<Icon size={46} strokeWidth={1.6} />} title={t.empty} cta={t.add} onClick={() => setRoute({ name: "add" })} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.map((x) => (
            <div key={x.id} style={{ display: "flex", alignItems: "center", gap: 14, background: C.surface,
              border: `1px solid ${C.line}`, borderRadius: 16, padding: "16px", cursor: "pointer" }}
              onClick={() => setRoute({ name: "edit", data: x })}>
              <span style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center",
                background: `${color}1c`, color: color, flexShrink: 0 }}><Icon size={20} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 600, color: C.ink }}>{displayName(x)}</div>
                {x.status && <div style={{ fontSize: 13, color: C.sub, marginTop: 2 }}>{x.status}</div>}
              </div>
              <ChevronRight size={20} color={C.sub} />
            </div>
          ))}
        </div>
      )}
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
        <SupplyEditor t={t} lang={t.code.toLowerCase()} onClose={() => setModal(false)} onSave={(item) => { addSupply(item); setModal(false); }} />
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
    <ModalShell t={t} onClose={onClose} accent={C.coral} icon={<ShoppingCart size={22} />} title={t.addSupply}
      footer={<ModalFooter t={t} onClose={onClose} onSave={save} accent={C.coral} saveLabel={t.add} saveIcon={<Plus size={20} />} />}>
      <Field label={t.supplyItem} required>
        <div className="ev-scroll" style={{ display: "flex", overflowX: "auto", gap: 8, paddingBottom: 8, marginBottom: 4 }}>
          {suggestions.map(s => (
            <button key={s} type="button" onClick={() => { setF({...f, item_name: s}); setErr(false); }}
              className="ev-tap"
              style={{
                flexShrink: 0, padding: "14px 20px", borderRadius: 16, border: `1.5px solid ${f.item_name === s ? C.coral : C.line}`,
                background: f.item_name === s ? C.coral : C.surface,
                color: f.item_name === s ? "#fff" : C.sub,
                fontSize: 15, cursor: "pointer", fontFamily: "inherit", fontWeight: 600
              }}>
              {s}
            </button>
          ))}
        </div>
        <input value={f.item_name} onChange={(e) => { setF({ ...f, item_name: e.target.value }); setErr(false); }}
          placeholder="Other custom supply item..." style={inputStyle(err)} />
      </Field>
      {err && <div style={{ color: C.coral, fontSize: 13, marginTop: -8, marginBottom: 10 }}>{t.supplyItem} {t.required}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
          style={{ ...inputStyle(), resize: "vertical", minHeight: 140 }} placeholder={t.notesHint} />
      </Field>
    </ModalShell>
  );
}

/* ============================================================
   MILESTONE 1: GROOM "MY DAY" & QUICK REPORTS
   ============================================================ */

function MyDayScreen({ t }) {
  const { tasks, horses, toggleTask } = useStore();
  const todayStr = new Date().toISOString().split("T")[0];
  
  const myTasks = tasks
    .filter(tk => tk.due_date === todayStr || (!tk.due_date && !tk.is_completed))
    .sort((a, b) => {
      if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1;
      return (a.start_time || "23:59").localeCompare(b.start_time || "23:59");
    });

  const [reportModal, setReportModal] = useState(false);
  const { addSupply } = useStore();

  return (
    <div className="ev-card">
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="ev-display" style={{ margin: 0, fontSize: 26, fontWeight: 800, color: C.ink }}>{t.myDay}</h2>
          <button onClick={() => setReportModal(true)} className="ev-tap" style={{ display: "flex", alignItems: "center", gap: 6, background: C.coral, color: "#fff", border: "none", padding: "8px 14px", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: `0 4px 12px ${C.coral}40` }}>
            <AlertTriangle size={18} strokeWidth={2.5} /> Report Issue
          </button>
        </div>
        <p style={{ margin: 0, color: C.sub, fontSize: 15 }}>{t.myDaySub}</p>
      </div>

      {reportModal && <QuickReportEditor t={t} onClose={() => setReportModal(false)} onSave={(report) => { addSupply(report); setReportModal(false); }} />}

      {myTasks.length === 0 ? (
        <EmptyHero accent={C.amber} icon={<CheckSquare size={46} />} title={t.noTasksToday} sub="" cta="" onClick={() => {}} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {myTasks.map(tk => {
            const horse = horses.find(h => h.id === tk.horse_id);
            return (
              <button key={tk.id} onClick={() => toggleTask(tk.id)} className="ev-tap" style={{
                display: "flex", alignItems: "center", gap: 16, width: "100%", textAlign: "left",
                background: tk.is_completed ? C.bg : C.surface,
                border: `1.5px solid ${tk.is_completed ? C.line : C.amber + '44'}`,
                borderRadius: 20, padding: 18, cursor: "pointer",
                opacity: tk.is_completed ? 0.6 : 1, transition: "all .2s ease"
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  border: `2px solid ${tk.is_completed ? C.sub : C.amber}`,
                  background: tk.is_completed ? C.sub : "transparent",
                  display: "grid", placeItems: "center", color: "#fff"
                }}>
                  {tk.is_completed && <Check size={20} strokeWidth={3} />}
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: tk.is_completed ? C.sub : C.ink,
                    textDecoration: tk.is_completed ? "line-through" : "none" }}>{tk.title}</div>
                  
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                    {(tk.start_time || tk.end_time) && (
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.amber, background: `${C.amber}1f`, padding: "4px 10px", borderRadius: 8 }}>
                        {tk.start_time?.slice(0,5) || "-"} {tk.end_time ? `- ${tk.end_time.slice(0,5)}` : ""}
                      </span>
                    )}
                    {horse && (
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.mint, background: C.mintSoft, padding: "4px 10px", borderRadius: 8 }}>
                        🐴 {horse.name}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

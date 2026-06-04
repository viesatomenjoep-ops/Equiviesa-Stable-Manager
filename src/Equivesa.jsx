import React, { useState, useMemo, createContext, useContext } from "react";
import {
  Menu, X, Bell, Plus, Search, ChevronRight, ChevronLeft, Check, LayoutDashboard,
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
const globalStyle = `
@media (max-width: 768px) {
  .ev-cal-body { flex-direction: column !important; }
  .ev-cal-detail { width: 100% !important; border-right: none !important; border-bottom: 1px solid #E3E8EE !important; }
}
`;
if (typeof document !== 'undefined') {
  const s = document.createElement('style');
  s.innerHTML = globalStyle;
  document.head.appendChild(s);
}

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
    calWeek: "Week", calMonth: "Maand",
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
    myday: "Dashboard", mydaySub: "Jouw dagelijkse taken. Tik om af te vinken.",
    reportIssue: "Snel Melden", whatIsWrong: "Wat wil je doorgeven?", issueSupply: "Voorraad nodig", issueDefect: "Kapot / Defect", takePhoto: "Maak een foto (optioneel)", confirmDelete: "Weet je zeker dat je dit wilt verwijderen?", noTasksToday: "Geen taken voor jou vandaag!",
    // Dashboard
    greetingMorning: "🌅 Goedemorgen", greetingAfternoon: "☀️ Goedemiddag", greetingEvening: "🌙 Goedenavond",
    dashboardTitle: "Jouw dag vandaag", tasksDoneToday: "Taken voltooid", allDone: "🎉 Alles gedaan voor vandaag!",
    remaining: (n) => `Nog ${n} te gaan`,
    morningFeed: "🌅 Ochtendvoeding", todayTasks: "✅ Taken vandaag", allTasks: "Alle taken →",
    thisWeek: "📆 Deze week", weekPlan: "📆 Weekplanning",
    quickActions: "Snelle acties", stableOverview: "Stalbeheer overzicht",
    openTasks: "Open taken", activeHorses: "Actieve paarden",
    monthlyIncome: "Inkomsten (mnd)", toOrder: "Te bestellen",
    todayN: (n) => `📅 Vandaag — ${n} taken`,
    upcomingHealth: "🩺 Komende zorgafspraken", monthlyFinance: "💰 Financiën deze maand",
    noTasksScheduled: "Geen taken gepland voor vandaag.",
    daysLeftN: (n) => n === 0 ? "Vandaag" : `Over ${n}d`,
    addActivity: "Activiteit toevoegen", whatToAdd: "Wat wil je toevoegen?",
    seeAll: "Zie alles →", toFinance: "Naar financiën →",
    // Feeding UI
    noFeedSchedule: "Geen voedingsschema", quickSetup: "⚡ Schema instellen voor",
    addSlot: "Voedingsmoment toevoegen",
    // Common feed product names
    feedHay: "Hooi", feedConcentrate: "Biks", feedMuesli: "Muesli", feedWater: "Water",
    feedStraw: "Stro", feedBran: "Zemelen", feedCarrots: "Wortels", feedApples: "Appels",
    feedSalt: "Zoutblok", feedOil: "Olie",
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
    myday: "Dashboard", mydaySub: "Your daily tasks. Tap to complete.",
    reportIssue: "Quick Report", whatIsWrong: "What do you want to report?", issueSupply: "Supply needed", issueDefect: "Broken item / Defect", takePhoto: "Take a photo (optional)", noTasksToday: "No tasks for you today!",
    // Dashboard
    greetingMorning: "🌅 Good morning", greetingAfternoon: "☀️ Good afternoon", greetingEvening: "🌙 Good evening",
    dashboardTitle: "Your day today", tasksDoneToday: "Tasks completed", allDone: "🎉 Everything done for today!",
    remaining: (n) => `${n} more to go`,
    morningFeed: "🌅 Morning feeding", todayTasks: "✅ Today's tasks", allTasks: "All tasks →",
    thisWeek: "📆 This week", weekPlan: "📆 Week planning",
    quickActions: "Quick actions", stableOverview: "Stable management overview",
    openTasks: "Open tasks", activeHorses: "Active horses",
    monthlyIncome: "Income (month)", toOrder: "To order",
    todayN: (n) => `📅 Today — ${n} tasks`,
    upcomingHealth: "🩺 Upcoming health appointments", monthlyFinance: "💰 Finance this month",
    noTasksScheduled: "No tasks scheduled for today.",
    daysLeftN: (n) => n === 0 ? "Today" : `In ${n}d`,
    addActivity: "Add activity", whatToAdd: "What do you want to add?",
    seeAll: "See all →", toFinance: "Go to finance →",
    // Feeding UI
    noFeedSchedule: "No feeding schedule", quickSetup: "⚡ Set up schedule for",
    addSlot: "Add feeding slot",
    // Common feed product names
    feedHay: "Hay", feedConcentrate: "Concentrates", feedMuesli: "Muesli", feedWater: "Water",
    feedStraw: "Straw", feedBran: "Bran", feedCarrots: "Carrots", feedApples: "Apples",
    feedSalt: "Salt lick", feedOil: "Oil",
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
    fmtTodayDate: (d, mon) => `Hoy, ${d} ${mon}`, calWeek: "Semana", calMonth: "Mes",
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
    myday: "Dashboard", mydaySub: "Tus tareas diarias. Toca para completar.",
    reportIssue: "Reportar", whatIsWrong: "¿Qué quieres reportar?", issueSupply: "Suministro necesario", issueDefect: "Artículo roto / Defecto", takePhoto: "Hacer una foto (opcional)", noTasksToday: "¡No hay tareas para ti hoy!",
    // Dashboard
    greetingMorning: "🌅 Buenos días", greetingAfternoon: "☀️ Buenas tardes", greetingEvening: "🌙 Buenas noches",
    dashboardTitle: "Tu día hoy", tasksDoneToday: "Tareas completadas", allDone: "🎉 ¡Todo listo por hoy!",
    remaining: (n) => `${n} más por hacer`,
    morningFeed: "🌅 Alimentación matutina", todayTasks: "✅ Tareas de hoy", allTasks: "Todas las tareas →",
    thisWeek: "📆 Esta semana", weekPlan: "📆 Planificación semanal",
    quickActions: "Acciones rápidas", stableOverview: "Resumen de gestión",
    openTasks: "Tareas abiertas", activeHorses: "Caballos activos",
    monthlyIncome: "Ingresos (mes)", toOrder: "Por pedir",
    todayN: (n) => `📅 Hoy — ${n} tareas`,
    upcomingHealth: "🩺 Próximas citas de salud", monthlyFinance: "💰 Finanzas este mes",
    noTasksScheduled: "No hay tareas para hoy.",
    daysLeftN: (n) => n === 0 ? "Hoy" : `En ${n}d`,
    addActivity: "Añadir actividad", whatToAdd: "¿Qué quieres añadir?",
    seeAll: "Ver todo →", toFinance: "Ir a finanzas →",
    // Feeding UI
    noFeedSchedule: "Sin plan de alimentación", quickSetup: "⚡ Configurar plan para",
    addSlot: "Añadir momento de alimentación",
    // Common feed product names
    feedHay: "Heno", feedConcentrate: "Concentrado", feedMuesli: "Muesli", feedWater: "Agua",
    feedStraw: "Paja", feedBran: "Salvado", feedCarrots: "Zanahorias", feedApples: "Manzanas",
    feedSalt: "Bloque de sal", feedOil: "Aceite",
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
  general: ["myday", "horses", "calendar", "tasks", "health", "feeding", "supplies", "locations", "contacts", "documents"],
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
  myday: LayoutDashboard, horses: Home, calendar: Calendar, tasks: CheckSquare, health: Heart,
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
export const trFeed = (val, t) => {
  if (!val || !t) return val;
  const v = val.toLowerCase().trim();
  if (["hooi", "hoi", "hay", "heno"].includes(v)) return t.feedHay || val;
  if (["biks", "bix", "pellets", "concentrates", "concentrado"].includes(v)) return t.feedConcentrate || val;
  if (["muesli"].includes(v)) return t.feedMuesli || val;
  if (["water", "agua"].includes(v)) return t.feedWater || val;
  return val;
};

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
  const [temperatures, setTemperatures] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const fetchTemperatures = async () => {
    const { data } = await supabase.from('horse_temperatures').select('*').order('measured_at', { ascending: false });
    if (data) setTemperatures(data);
  };
  const addTemperature = async (t) => {
    const { data, error } = await supabase.from('horse_temperatures').insert([cleanObj(t)]).select();
    if (error) { console.error(error); alert("Database Error: " + error.message); }
    if (data) setTemperatures(p => [data[0], ...p]);
  };
  const deleteTemperature = async (id) => {
    const { error } = await supabase.from('horse_temperatures').delete().eq('id', id);
    if (error) { console.error(error); alert("Database Error: " + error.message); }
    else setTemperatures(p => p.filter(x => x.id !== id));
  };

  const fetchStalls = async () => {
    const { data } = await supabase.from('stalls').select('*');
    if (data) setStalls(data);
  };
  const addStall = async (s) => {
    const { data, error } = await supabase.from('stalls').insert([cleanObj(s)]).select();
    if (error) { console.error(error); alert("Database Error: " + error.message); }
    if (data) setStalls(p => [...p, data[0]]);
  };
  const editStall = async (id, upd) => {
    // Optimistic UI update for map builder responsiveness
    setStalls(p => p.map(x => x.id === id ? { ...x, ...upd } : x));
    const { error } = await supabase.from('stalls').update(cleanObj(upd)).eq('id', id);
    if (error) { console.error(error); alert("Database Error: " + error.message); fetchStalls(); }
  };
  const deleteStall = async (id) => {
    const { error } = await supabase.from('stalls').delete().eq('id', id);
    if (error) { console.error(error); alert("Database Error: " + error.message); }
    else setStalls(p => p.filter(x => x.id !== id));
  };

  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchHorses(); fetchTxns(); fetchSupplies(); fetchUsers(); fetchFeed();
        fetchTasks(); fetchHealthRecords(); fetchEmbryos(); fetchFoals(); fetchStalls(); fetchStaff(); fetchTemperatures();
      } else {
        setHorses([]); setTxns([]); setSupplies([]); setUsers([]); setFeed({});
        setTasks([]); setHealthRecords([]); setEmbryos([]); setFoals([]); setStalls([]); setStaffMembers([]); setTemperatures([]);
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
    const nextNumber = horses.length > 0 ? Math.max(...horses.map(x => x.horse_number || 0)) + 1 : 1;
    const cleanH = cleanObj({ ...h, horse_number: nextNumber, tint: HORSE_TINTS[horses.length % HORSE_TINTS.length] });
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
  const editUser = async (id, u) => {
    const { data, error } = await supabase.from('profiles').update(cleanObj(u)).eq('id', id).select();
    if (error) { console.error(error); alert("Database Error: " + error.message); }
    if (data) setUsers(prev => prev.map(x => x.id === id ? data[0] : x));
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
    // Strip columns that may not exist in all environments
    const { amazon_link: _a, photo_url, ...safe } = item;
    // Only include photo_url if it actually has a value
    const payload = photo_url ? { ...safe, photo_url, status: 'pending' } : { ...safe, status: 'pending' };
    const { data, error } = await supabase.from('supplies_needed').insert([cleanObj(payload)]).select();
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
  const addDefaultSchedule = async (horseId) => {
    // Standaard voedingsschema: ochtend, middag, avond
    const defaults = [
      { slot: 'morning', product: 'Hay',     qty: '3 kg' },
      { slot: 'morning', product: 'Pellets', qty: '1 kg' },
      { slot: 'noon',    product: 'Hay',     qty: '3 kg' },
      { slot: 'evening', product: 'Hay',     qty: '3 kg' },
      { slot: 'evening', product: 'Muesli',  qty: '500 g' },
      { slot: 'evening', product: 'Water',   qty: 'Ad lib' },
    ];
    const rows = defaults.map(d => ({ horse_id: horseId, slot: d.slot, product: d.product, qty: d.qty }));
    const { data, error } = await supabase.from('feed_schedules').insert(rows).select();
    if (error) { alert("Database Error: " + error.message); return; }
    if (data) {
      setFeed(prev => {
        const h = { morning: [], noon: [], evening: [], night: [] };
        data.forEach(item => { if (h[item.slot]) h[item.slot].push(item); });
        return { ...prev, [horseId]: h };
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
  const editFeedItem = async (horseId, slot, itemId, item) => {
    const { data, error } = await supabase.from('feed_schedules').update({ product: item.product, qty: item.qty }).eq('id', itemId).select();
    if (error) { console.error("Error editing feed:", error); alert("Database Error: " + error.message); }
    if (data) {
      setFeed(prev => {
        const h = prev[horseId]; if (!h) return prev;
        return { ...prev, [horseId]: { ...h, [slot]: h[slot].map(i => i.id === itemId ? data[0] : i) } };
      });
    }
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
      users, addUser, editUser, deleteUser, feed, addFeedItem, editFeedItem, addDefaultSchedule, deleteFeedItem,
      supplies, addSupply, toggleSupplyStatus, deleteSupply,
      tasks, addTask, editTask, toggleTask, deleteTask,
      stalls, addStall, editStall, deleteStall,
      staffMembers,
      temperatures, addTemperature, deleteTemperature,
      notifications, setNotifications,
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

/* ---------- Internal Notification Engine ---------- */
function NotificationEngine() {
  const { tasks, setNotifications } = useStore();
  const notified = useRef(new Set());

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
      const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

      tasks.forEach(tk => {
        if (!tk.is_completed && tk.due_date === todayStr && tk.start_time === timeStr) {
          const key = `task-${tk.id}-${todayStr}-${timeStr}`;
          if (!notified.current.has(key)) {
            notified.current.add(key);
            new Notification("Equivesa Task Reminder", {
              body: tk.title,
              icon: "/favicon.ico"
            });
            setNotifications(p => [{ id: Date.now(), text: `Reminder: ${tk.title}`, time: timeStr }, ...p]);
            // Optional: play a subtle beep using Audio
            try {
              const ctx = new (window.AudioContext || window.webkitAudioContext)();
              const osc = ctx.createOscillator();
              osc.type = "sine"; osc.frequency.setValueAtTime(440, ctx.currentTime);
              osc.connect(ctx.destination);
              osc.start(); osc.stop(ctx.currentTime + 0.2);
            } catch (e) {}
          }
        }
      });
    }, 15000); // Check every 15s

    return () => clearInterval(interval);
  }, [tasks]);

  return null;
}

function AppRoot() {
  const [lang, setLang] = useState("en");
  const [mode, setMode] = useState(null);
  const [active, setActive] = useState("myday");
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
      <NotificationEngine />
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
          {drawer && <Drawer t={t} active={active} go={go} close={() => setDrawer(false)} mode={mode} setMode={setMode} lang={lang} setLang={setLang} />}
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
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", display: "flex", flexDirection: "column", background: C.surface, zIndex: 100 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 22px" }}>
        <Brand />
        <LangMenu lang={lang} setLang={setLang} t={t} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", padding: "12vh 18px 0" }}>
        <div style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
          <h1 className="ev-display" style={{ fontSize: 34, fontWeight: 800, margin: "0 0 8px", letterSpacing: -0.6, color: C.ink }}>
            {t.chooseMode}
          </h1>
          <p style={{ color: C.sub, fontSize: 16, margin: "0 0 32px" }}>{t.chooseModeSub}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            <ModeCard t={t} onClick={() => setPending("manager")} color={C.mint} icon={<Sparkles size={34} />}
              title={t.manager} desc={t.managerDesc} />
            <ModeCard t={t} onClick={() => setPending("groom")} color={C.amber} icon={<Carrot size={34} />}
              title={t.groom} desc={t.groomDesc} />
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
        <div style={{ flex: 1 }} />
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
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0" }}>
      <img src="/logo.png" alt="Equiviesa Logo" style={{ width: 38, height: 38, objectFit: "contain", flexShrink: 0 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <div className="ev-display" style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.1 }}>Equiviesa</div>
        <div style={{ fontSize: 9, fontWeight: 600, color: C.sub, letterSpacing: 0.8, textTransform: "uppercase" }}>Stable Manager</div>
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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setRoute({ name: "list" })} className="ev-tap" style={iconBtn}>
            <ChevronLeft size={22} />
          </button>
          <div style={{ width: 1, height: 24, background: C.line, margin: "0 4px" }} />
          <h1 className="ev-display" style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: -0.4 }}>
            {route.name === "add" ? t.add : t.profile}
          </h1>
        </div>
      ) : (
        <Brand />
      )}

      <div style={{ flex: 1 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button className="ev-tap" style={iconBtn}><Bell size={20} /></button>
        {active === "horses" && route.name === "list" && (
          <button onClick={() => setRoute({ name: "add" })} className="ev-tap"
            style={{ ...iconBtn, background: C.mint, color: "#fff", boxShadow: "0 4px 12px rgba(47,182,160,.4)" }}>
            <Plus size={22} />
          </button>
        )}
        {!inSub && (
          <button onClick={onMenu} className="ev-tap ev-burger" style={{ ...iconBtn, display: "none" }}>
            <Menu size={22} />
          </button>
        )}
      </div>
      <style>{`@media (max-width: 860px){ .ev-burger{ display:grid !important; } }`}</style>
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
    <div style={{ display: "flex", gap: 4, background: C.bg, borderRadius: 12, padding: 4,
      width: block ? "100%" : "auto", justifyContent: "center" }}>
      {["en", "nl", "es"].map((l) => (
        <button key={l} onClick={() => setLang(l)} className="ev-tap" style={{
          flex: block ? 1 : "none", padding: "6px 10px", borderRadius: 8, border: "none",
          background: lang === l ? C.surface : "transparent",
          color: lang === l ? C.mint : C.sub,
          boxShadow: lang === l ? "0 2px 8px rgba(0,0,0,.10)" : "none",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          fontWeight: 600, fontFamily: "inherit", cursor: "pointer", transition: "all .15s",
        }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 16, lineHeight: 1, display: "block", transform: "scale(1.1)" }}>{FLAGS[l]}</span>
          </div>
          <span style={{ fontSize: 11 }}>{I18N[l].code}</span>
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
        <div style={{ width: 22, height: 22, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 18, lineHeight: 1, display: "block", transform: "scale(1.1)" }}>{current?.flag}</span>
        </div>
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
                <div style={{ width: 26, height: 26, borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 22, lineHeight: 1, display: "block", transform: "scale(1.1)" }}>{flag}</span>
                </div>
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

function Drawer({ t, active, go, close, mode, setMode, lang, setLang }) {
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
        background: C.surface, padding: 18, overflowY: "auto", overflowX: "hidden",
        animation: "evSlide .26s cubic-bezier(.2,.8,.2,1)", boxShadow: "12px 0 40px rgba(0,0,0,.18)",
      }}>
        <style>{`@keyframes evSlide{from{transform:translateX(-100%)}to{transform:none}}`}</style>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Brand />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LangMenu lang={lang} setLang={setLang} t={t} />
            <button onClick={close} className="ev-tap" style={{ ...iconBtn, boxShadow: "none", background: C.bg }}>
              <X size={22} />
            </button>
          </div>
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

function Screen({ active, route, setRoute, t, go, mode }) {
  const wrap = { width: "100%", margin: "0 auto", padding: "22px 18px" };
  if (active === "myday") return <div style={wrap}><MyDayScreen t={t} mode={mode} go={go} setRoute={setRoute} /></div>;
  if (active === "horses") {
    if (route.name === "add") return <div style={wrap}><HorseForm t={t} onDone={() => setRoute({ name: "list" })} /></div>;
    if (route.name === "edit") return <div style={wrap}><HorseEditWrapper t={t} id={route.id} setRoute={setRoute} /></div>;
    if (route.name === "detail") return <div style={wrap}><HorseDetail t={t} id={route.id} setRoute={setRoute} /></div>;
    return <div style={wrap}><HorsesList t={t} setRoute={setRoute} /></div>;
  }
  if (active === "feeding") return <div style={wrap}><FeedingScreen t={t} route={route} setRoute={setRoute} /></div>;
  if (active === "calendar") return <div style={wrap}><CalendarScreen t={t} go={go} /></div>;
  if (active === "tasks") return <div style={wrap}><TasksScreen t={t} /></div>;
  if (active === "health") return <HealthScreenRouter t={t} route={route} setRoute={setRoute} />;
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
      <MediaThumb url={h.photo_url} alt={h.name} style={{ width: size, height: size, borderRadius: "32%", objectFit: "cover", flexShrink: 0 }} />
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

function MediaThumb({ url, alt, style }) {
  if (!url) return null;
  const isVideo = url.match(/\.(mp4|mov|webm)$/i);
  if (isVideo) return <video src={url} style={style} muted loop playsInline autoPlay />;
  return <img src={url} alt={alt} style={style} />;
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
        <div style={{ fontSize: 17, fontWeight: 600, color: C.ink }}>
          {h.horse_number && <span style={{ color: C.sub, marginRight: 6 }}>#{h.horse_number}</span>}
          {h.name}
        </div>
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
            <MediaThumb url={f.photo_url} alt="Horse" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
  const { horses, deleteHorse, stalls, temperatures } = useStore();
  const h = horses.find((x) => x.id === id);
  if (!h) { setRoute({ name: "list" }); return null; }

  const stall = stalls?.find(s => s.horse_id === id);

  const rows = [
    [t.studbook, h.studbook], [t.sex, h.sex && t[h.sex]], [t.color, h.color],
    [t.birthdate, h.birthdate], [t.ueln, h.ueln], [t.chip, h.chip],
    [t.feiid, h.feiid], ["Box / Stall", stall ? stall.name : null], [t.location, h.location],
  ].filter(([, v]) => v);

  const del = () => { if (window.confirm(t.confirmDelete || "Delete?")) { deleteHorse(id); setRoute({ name: "list" }); } };

  const horseTemps = temperatures?.filter(temp => temp.horse_id === id).sort((a,b) => new Date(b.measured_at) - new Date(a.measured_at)) || [];
  const latestTemp = horseTemps[0];
  const [showTempModal, setShowTempModal] = useState(false);

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

      {/* Vitals Widget */}
      <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 18, overflow: "hidden", marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", borderBottom: `1px solid ${C.line}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: C.ink }}>
            <Activity size={18} color={C.coral} /> Vitals / Temperature
          </div>
          <button onClick={() => setShowTempModal(true)} className="ev-tap" style={{ background: `${C.coral}1a`, color: C.coral, border: "none", padding: "6px 12px", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>Log Temp</button>
        </div>
        <div style={{ padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", background: C.field }}>
          <div>
            <div style={{ fontSize: 13, color: C.sub, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Current Status</div>
            {latestTemp ? (
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: Number(latestTemp.temperature) > 38.5 ? C.coral : C.mint }}>{latestTemp.temperature}°C</span>
                <span style={{ fontSize: 13, color: C.sub }}>{new Date(latestTemp.measured_at).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
              </div>
            ) : (
              <div style={{ color: C.sub, fontStyle: "italic", fontSize: 15 }}>No data</div>
            )}
          </div>
        </div>
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

      {showTempModal && <TemperatureLogModal horse={h} temps={horseTemps} onClose={() => setShowTempModal(false)} />}
    </div>
  );
}

/* ---------- Temperature Modal ---------- */
function TemperatureLogModal({ horse, temps, onClose }) {
  const { addTemperature } = useStore();
  const [f, setF] = useState({ temperature: "", notes: "", time: new Date().toISOString().slice(0,16) });

  const submit = () => {
    if (!f.temperature) return;
    addTemperature({ horse_id: horse.id, temperature: parseFloat(f.temperature), measured_at: new Date(f.time).toISOString(), notes: f.notes });
    setF({ temperature: "", notes: "", time: new Date().toISOString().slice(0,16) });
  };

  return (
    <ModalShell onClose={onClose} title={`Vitals: ${horse.name}`} icon={<Activity size={20} />} accent={C.coral}>
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.sub, marginBottom: 6 }}>Temperature (°C)</label>
            <input type="number" step="0.1" value={f.temperature} onChange={e => setF({...f, temperature: e.target.value})} placeholder="37.5" style={{ width: "100%", padding: 12, borderRadius: 12, border: `1.5px solid ${C.line}`, fontSize: 16, outline: "none" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.sub, marginBottom: 6 }}>Date & Time</label>
            <input type="datetime-local" value={f.time} onChange={e => setF({...f, time: e.target.value})} style={{ width: "100%", padding: 12, borderRadius: 12, border: `1.5px solid ${C.line}`, fontSize: 16, outline: "none" }} />
          </div>
        </div>
        <button onClick={submit} className="ev-tap" disabled={!f.temperature} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: f.temperature ? C.coral : C.line, color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer", marginBottom: 24 }}>Add Reading</button>

        <h4 style={{ margin: "0 0 12px", color: C.ink }}>History</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto" }}>
          {temps.map(t => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, background: C.field, borderRadius: 10 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: Number(t.temperature) > 38.5 ? C.coral : C.ink }}>{t.temperature}°C</div>
                {t.notes && <div style={{ fontSize: 12, color: C.sub }}>{t.notes}</div>}
              </div>
              <div style={{ fontSize: 13, color: C.sub }}>{new Date(t.measured_at).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</div>
            </div>
          ))}
          {temps.length === 0 && <div style={{ color: C.sub, fontStyle: "italic", fontSize: 14 }}>No history recorded.</div>}
        </div>
      </div>
    </ModalShell>
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

function CalendarScreen({ t, go }) {
  const { tasks, healthRecords, horses, supplies } = useStore();
  const now = new Date();
  const [year, setYear] = React.useState(now.getFullYear());
  const [month, setMonth] = React.useState(now.getMonth());
  const [selDay, setSelDay] = React.useState(now.getDate());
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

    const applyRecurrence = (baseDateStr, rule, callback) => {
      if (!rule || rule === 'none') {
        callback(baseDateStr);
        return;
      }
      const baseDate = new Date(baseDateStr);
      // Generate instances within a reasonable window (e.g., current year/month context)
      const start = new Date(year, month - 2, 1);
      const end = new Date(year, month + 3, 0); 
      
      let cur = new Date(baseDate);
      if (cur > end) return; // Starts in the future

      while (cur <= end) {
        if (cur >= start) {
          callback(cur.toISOString().slice(0, 10));
        }
        if (rule === 'daily') {
          cur.setDate(cur.getDate() + 1);
        } else if (rule === 'weekly') {
          cur.setDate(cur.getDate() + 7);
        } else if (rule === 'monthly') {
          cur.setMonth(cur.getMonth() + 1);
        } else if (rule === 'yearly') {
          cur.setFullYear(cur.getFullYear() + 1);
        } else {
          break; // unknown or complex rule not supported yet
        }
      }
    };

    // Tasks
    tasks.forEach(tk => {
      if (!tk.due_date) return;
      applyRecurrence(tk.due_date, tk.recurrence_rule, (key) => {
        const horse = horses.find(h => h.id === tk.horse_id);
        add(key, {
          id: tk.id, type: 'task', done: tk.is_completed,
          title: tk.title || 'Task',
          subtitle: horse ? horse.name : (tk.category || ''),
          color: CAL_EVENT_TYPES.task.color,
          emoji: CAL_EVENT_TYPES.task.emoji,
          time: tk.start_time || null,
          location: tk.location || null,
          assignedTo: tk.staff_id || tk.assigned_to || null,
        });
      });
    });

    // Supplies
    supplies.forEach(s => {
      if (!s.created_at) return;
      const key = s.created_at.slice(0, 10);
      add(key, {
        id: s.id, type: "supply", done: s.status === "received",
        title: s.item_name || s.name || "Supply",
        subtitle: `Status: ${s.status}`,
        color: C.coral,
        emoji: "📦",
        time: null,
        location: null,
      });
    });

    // Health records
    healthRecords.forEach(hr => {
      if (!hr.scheduled_date) return;
      applyRecurrence(hr.scheduled_date, hr.recurrence_rule, (key) => {
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
    });

    return map;
  }, [tasks, healthRecords, horses, t]);

  // ---- Check upcoming events & notify ----
  React.useEffect(() => {
    requestNotificationPermission();
    // iOS Safari heeft geen Notification API — altijd checken voor gebruik
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

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
    // iOS Safari ondersteunt geen Notification API
    if (typeof Notification === 'undefined') return;
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

  // ---- EventPickerSheet: opent als je op een datum klikt ----
  const [pickerDate, setPickerDate] = React.useState(null); // date string YYYY-MM-DD

  const EVENT_OPTIONS = [
    { id: 'task',    emoji: '✅', label: t.addTask     || 'Task',         color: CAL_EVENT_TYPES.task?.color   || C.amber,  action: (ds) => { go('tasks');   setPickerDate(null); } },
    { id: 'health',  emoji: '🩺', label: t.addRecord   || 'Health',       color: CAL_EVENT_TYPES.health?.color || C.coral,  action: (ds) => { go('health');  setPickerDate(null); } },
    { id: 'booking', emoji: '📅', label: t.add         || 'Booking',      color: C.sky,   action: (ds) => { go('bookings'); setPickerDate(null); } },
    { id: 'supply',  emoji: '📦', label: t.addSupply   || 'Supply',       color: C.mint,  action: (ds) => { go('supplies'); setPickerDate(null); } },
    { id: 'finance', emoji: '💰', label: t.addTxn      || 'Finance',      color: C.amber, action: (ds) => { go('finance');  setPickerDate(null); } },
    { id: 'contact', emoji: '👤', label: t.addContact  || 'Contact',      color: C.lilac || '#9B7FD4', action: (ds) => { go('contacts'); setPickerDate(null); } },
  ];

  // When a day cell is clicked: if already selected open picker, else just select
  const handleDayClick = (d) => {
    const ds = dayStr(d);
    if (selDay === d) {
      setPickerDate(ds); // open picker on second click or direct
    } else {
      setSelDay(d);
    }
  };

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
          <div style={{ display: 'flex', background: C.surface, borderRadius: 10, border: `1px solid ${C.line}`, padding: 2 }}>
            <button onClick={() => setView('week')} className="ev-tap" style={{ background: view === 'week' ? '#fff' : 'transparent', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 700, color: view === 'week' ? C.ink : C.sub, cursor: 'pointer', boxShadow: view === 'week' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}>{t.calWeek || 'Week'}</button>
            <button onClick={() => setView('month')} className="ev-tap" style={{ background: view === 'month' ? '#fff' : 'transparent', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 700, color: view === 'month' ? C.ink : C.sub, cursor: 'pointer', boxShadow: view === 'month' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none' }}>{t.calMonth || 'Month'}</button>
          </div>
          <button onClick={goToday} className="ev-tap" style={{ padding: '8px 16px', borderRadius: 10, border: `1px solid ${C.line}`, background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: C.mint, fontFamily: 'inherit' }}>
            {t.today || 'Today'}
          </button>
          {/* ADD EVENT BUTTON */}
          <button onClick={() => { if (selDay) setPickerDate(dayStr(selDay)); else setPickerDate(todayStr); }} className="ev-tap"
            style={{ width: 38, height: 38, borderRadius: 10, border: "none", background: C.mint, color: "#fff", cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(47,182,160,.4)" }}>
            <Plus size={20} />
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
      <div className="ev-cal-body" style={{ display: 'flex', flex: 1, minHeight: 0 }}>

        {/* ---- Day Detail Panel ---- */}
        {selDay && (
          <div className="ev-cal-detail" style={{
            width: 300, flexShrink: 0, borderRight: `1px solid ${C.line}`,
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

            {/* ADD button in panel */}
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.line}` }}>
              <button onClick={() => setPickerDate(dayStr(selDay))} className="ev-tap"
                style={{ width: '100%', padding: '12px', borderRadius: 14, border: `1.5px dashed ${C.mint}`, background: `${C.mint}08`, color: C.mint, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Plus size={18} /> {t.addActivity}
              </button>
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
                        {ev.location && (
                          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location)}`}
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
        {/* ---- Calendar Grid (Scrollable horizontally on mobile) ---- */}
        <div className="ev-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'auto' }}>
          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4, minWidth: view === 'month' ? 600 : '100%', flex: 1 }}>
            
            {/* Weekday headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 4 }}>
              {wdays.map((d, i) => (
                <div key={i} style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: (i >= 5 ? C.coral : C.sub), textTransform: 'uppercase', letterSpacing: 0.6, padding: '4px 0' }}>{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, flex: 1 }}>
              {(() => {
                if (view === 'month') {
                  return cells.map((d, i) => {
                    if (d === null) return <div key={`e${i}`} />;
                    const ds = dayStr(d);
                    const isToday = ds === todayStr;
                    const isSel = selDay === d;
                    const evs = events[ds] || [];
                    const isWeekend = (firstDow + d - 1) % 7 >= 5;
                    return (
                      <button key={d} onClick={() => handleDayClick(d)} className="ev-tap" style={{
                        border: isSel ? `2px solid ${C.mint}` : isToday ? `2px solid ${C.mint}55` : '1px solid transparent',
                        borderRadius: 14, padding: '8px 4px 10px',
                        background: isSel ? `${C.mint}0f` : isToday ? `${C.mint}08` : 'transparent',
                        cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                        minHeight: 72, position: 'relative', transition: 'all .15s',
                      }}>
                        <span style={{ fontSize: 14, fontWeight: isToday ? 800 : 500, width: 28, height: 28, lineHeight: '28px', borderRadius: '50%', display: 'inline-block', background: isToday ? C.mint : 'transparent', color: isToday ? '#fff' : isWeekend ? C.coral : C.ink }}>{d}</span>
                        {evs.length > 0 && (
                          <div style={{ width: '100%', padding: '0 3px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {evs.slice(0, 3).map((ev, j) => (<div key={j} style={{ height: 3, borderRadius: 2, background: ev.done ? `${ev.color}55` : ev.color, width: '100%' }} />))}
                            {evs.length > 3 && <div style={{ fontSize: 9, color: C.sub, fontWeight: 700, textAlign: 'center' }}>+{evs.length - 3}</div>}
                          </div>
                        )}
                        {isSel && <div style={{ fontSize: 9, color: C.mint, fontWeight: 700, marginTop: 2 }}>+ voeg toe</div>}
                      </button>
                    );
                  });
                } else {
                  // WEEK VIEW
                  const weekStart = new Date(year, month, selDay || now.getDate());
                  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
                  return Array.from({length: 7}, (_, i) => {
                    const dt = new Date(weekStart);
                    dt.setDate(dt.getDate() + i);
                    const ds = `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}`;
                    const isToday = ds === todayStr;
                    const isSel = ds === (selDay ? dayStr(selDay) : null);
                    const evs = events[ds] || [];
                    return (
                      <button key={ds} onClick={() => { setYear(dt.getFullYear()); setMonth(dt.getMonth()); handleDayClick(dt.getDate()); }} className="ev-tap" style={{
                        border: isSel ? `2px solid ${C.mint}` : isToday ? `2px solid ${C.mint}55` : '1px solid transparent',
                        borderRadius: 14, padding: '8px 4px 10px',
                        background: isSel ? `${C.mint}0f` : isToday ? `${C.mint}08` : 'transparent',
                        cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                        minHeight: 120, position: 'relative', transition: 'all .15s',
                      }}>
                        <span style={{ fontSize: 14, fontWeight: isToday ? 800 : 500, width: 28, height: 28, lineHeight: '28px', borderRadius: '50%', display: 'inline-block', background: isToday ? C.mint : 'transparent', color: isToday ? '#fff' : (i>=5 ? C.coral : C.ink) }}>{dt.getDate()}</span>
                        {evs.length > 0 && (
                          <div style={{ width: '100%', padding: '0 3px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {evs.slice(0, 5).map((ev, j) => (
                              <div key={j} style={{ padding: '4px', borderRadius: 4, background: ev.done ? `${ev.color}22` : ev.color, color: ev.done ? ev.color : '#fff', fontSize: 10, fontWeight: 700, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                {ev.emoji} {ev.title}
                              </div>
                            ))}
                            {evs.length > 5 && <div style={{ fontSize: 9, color: C.sub, fontWeight: 700, textAlign: 'center' }}>+{evs.length - 5} meer</div>}
                          </div>
                        )}
                        {isSel && <div style={{ fontSize: 9, color: C.mint, fontWeight: 700, marginTop: 'auto' }}>+ voeg toe</div>}
                      </button>
                    );
                  });
                }
              })()}
            </div>
          </div>
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

      {/* ---- EVENT PICKER SHEET ---- */}
      {pickerDate && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(14,21,30,0.55)', zIndex: 1000,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          animation: 'evFade .15s ease'
        }} onClick={() => setPickerDate(null)}>
          <div style={{
            width: '100%', maxWidth: 520, background: '#fff', borderRadius: '28px 28px 0 0',
            padding: '28px 24px 40px', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
            animation: 'evSlideUp .22s cubic-bezier(.4,0,.2,1)'
          }} onClick={e => e.stopPropagation()}>
            {/* Handle */}
            <div style={{ width: 40, height: 5, borderRadius: 3, background: C.line, margin: '0 auto 20px' }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
              {pickerDate}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.ink, marginBottom: 20 }}>
              {t.whatToAdd || 'Wat wil je toevoegen?'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {EVENT_OPTIONS.map(opt => (
                <button key={opt.id} onClick={() => opt.action(pickerDate)} className="ev-tap"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
                    borderRadius: 18, border: `1.5px solid ${opt.color}33`,
                    background: `${opt.color}0e`, cursor: 'pointer', fontFamily: 'inherit',
                    textAlign: 'left', transition: 'all .15s',
                  }}>
                  <span style={{ fontSize: 28, flexShrink: 0 }}>{opt.emoji}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: opt.color }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Tasks ---------- */
function TasksScreen({ t }) {
  const { tasks, addTask, editTask, toggleTask, deleteTask, horses, staffMembers } = useStore();
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
                  <button onClick={() => { if(window.confirm(t.confirmDelete || "Delete?")) deleteTask(tk.id); }} className="ev-tap" style={{
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
        <TaskEditor t={t} horses={horses} staffMembers={staffMembers} onClose={() => setModal(false)}
          onSave={(task) => { addTask(task); setModal(false); }} />
      )}
      {editObj && (
        <TaskEditor t={t} horses={horses} staffMembers={staffMembers} initialData={editObj} onClose={() => setEditObj(null)}
          onSave={(task) => { editTask(editObj.id, task); setEditObj(null); }}
          onDelete={() => { if (window.confirm(t.confirmDelete || "Delete?")) { deleteTask(editObj.id); setEditObj(null); } }} />
      )}
    </div>
  );
}

/* ---------- Health Router (full-page editor routing) ---------- */
function HealthScreenRouter({ t, route, setRoute }) {
  const { addHealthRecord, editHealthRecord, deleteHealthRecord, horses } = useStore();
  const wrap = { width: "100%", margin: "0 auto", padding: "22px 18px" };

  if (route.name === "add") {
    return (
      <div style={wrap}>
        <HealthEditor t={t} horses={horses} staffMembers={staffMembers}
          onClose={() => setRoute({ name: "list" })}
          onSave={async (rec) => { await addHealthRecord(rec); setRoute({ name: "list" }); }} />
      </div>
    );
  }
  if (route.name === "edit") {
    return (
      <div style={wrap}>
        <HealthEditor t={t} horses={horses} staffMembers={staffMembers} initialData={route.data}
          onClose={() => setRoute({ name: "list" })}
          onSave={async (rec) => { await editHealthRecord(route.data.id, rec); setRoute({ name: "list" }); }}
          onDelete={async () => { if (window.confirm(t.confirmDelete || "Delete?")) { await deleteHealthRecord(route.data.id); setRoute({ name: "list" }); } }} />
      </div>
    );
  }
  return <div style={wrap}><HealthScreen t={t} setRoute={setRoute} /></div>;
}

/* ---------- Health ---------- */
function HealthScreen({ t, setRoute }) {
  const { healthRecords, addHealthRecord, editHealthRecord, toggleHealthRecord, deleteHealthRecord, horses } = useStore();
  const [activeCat, setActiveCat] = useState(null); // null = overview, string = category subpage
  const [modal, setModal] = useState(null); // keep for backward compat, but route takes priority
  const [editRecord, setEditRecord] = useState(null);
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);


  // If setRoute available, always use full-page editor
  const openAdd = (cat) => {
    if (setRoute) {
      setRoute({ name: "add", data: { category: cat } });
    } else {
      setModal(cat);
    }
  };
  const openEdit = (rec) => {
    if (setRoute) {
      setRoute({ name: "edit", data: rec });
    } else {
      setEditRecord(rec);
    }
  };

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
          <button onClick={() => openAdd(activeCat)} className="ev-tap" style={{
            display: "flex", alignItems: "center", gap: 8, border: "none", cursor: "pointer", fontFamily: "inherit",
            background: catColor, color: "#fff", fontSize: 14, fontWeight: 600, padding: "10px 16px", borderRadius: 13,
            boxShadow: `0 6px 16px ${catColor}55` }}>
            <Plus size={18} /> {t.addRecord}
          </button>
        </div>

        {catRecords.length === 0 ? (
          <EmptyHero accent={catColor} icon={<CatIcon size={46} strokeWidth={1.6} />}
            title={t.noRecords} sub={t.noRecordsSub} cta={t.addRecord} onClick={() => openAdd(activeCat)} />
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
                    <button onClick={() => openEdit(hr)} className="ev-tap" style={{
                      border: "none", background: "transparent", cursor: "pointer", color: C.sub, padding: 6 }}>
                      <Edit2 size={17} />
                    </button>
                    <button onClick={() => { if(window.confirm(t.confirmDelete || "Delete?")) deleteHealthRecord(hr.id); }} className="ev-tap" style={{
                      border: "none", background: "transparent", cursor: "pointer", color: C.sub, padding: 6 }}>
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
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
        <HealthEditor t={t} category={modal} horses={horses} staffMembers={staffMembers} onClose={() => setModal(null)}
          onSave={(rec) => { addHealthRecord(rec); setModal(null); }} />
      )}
      {editRecord && (
        <HealthEditor t={t} horses={horses} staffMembers={staffMembers} initialData={editRecord} onClose={() => setEditRecord(null)}
          onSave={(rec) => { editHealthRecord(editRecord.id, rec); setEditRecord(null); }}
          onDelete={() => { if (window.confirm(t.confirmDelete || "Delete?")) { deleteHealthRecord(editRecord.id); setEditRecord(null); } }} />
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
          {txns.map((x) => <TxnRow key={x.id} x={x} t={t} onDelete={() => { if(window.confirm(t.confirmDelete || "Delete?")) deleteTxn(x.id); }} />)}
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
  const { users, addUser, editUser, deleteUser } = useStore();
  const [modal, setModal] = useState(false);
  const [editFor, setEditFor] = useState(null);

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
          {users.map((u) => <UserRow key={u.id} u={u} t={t} onEdit={() => setEditFor(u)} onDelete={() => { if(window.confirm(t.confirmDelete || "Delete?")) deleteUser(u.id); }} />)}
        </div>
      )}

      {modal && (
        <UserEditor t={t} onClose={() => setModal(false)} onSave={(u) => { addUser(u); setModal(false); }} />
      )}
      
      {editFor && (
        <UserEditor t={t} initialData={editFor} onClose={() => setEditFor(null)} onSave={(u) => { editUser(editFor.id, u); setEditFor(null); }} />
      )}
    </div>
  );
}

function UserRow({ u, t, onEdit, onDelete }) {
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
        <button onClick={onEdit} className="ev-tap" style={{ border: "none", background: "transparent",
          cursor: "pointer", color: C.sky, padding: 6 }}><Edit2 size={17} /></button>
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
const SLOT_EMOJIS = { morning: "🌅", noon: "☀️", evening: "🌆", night: "🌙" };
const SLOT_TIMES  = { morning: "07:00", noon: "12:00", evening: "18:00", night: "21:00" };
const DEFAULT_SCHEDULE = [
  { slot: "morning", product: "Hooi",    qty: "3 kg" },
  { slot: "morning", product: "Biks",    qty: "1 kg" },
  { slot: "noon",    product: "Hooi",    qty: "3 kg" },
  { slot: "evening", product: "Hooi",    qty: "3 kg" },
  { slot: "evening", product: "Muesli",  qty: "500 g" },
  { slot: "evening", product: "Water",   qty: "Ad lib" },
];

function FeedingScreen({ t, route, setRoute }) {
  const { horses, feed, addFeedItem, editFeedItem, addDefaultSchedule, deleteFeedItem } = useStore();
  const [tab, setTab] = useState(0); // 0 feeding 1 order
  const [horseFilter, setHorseFilter] = useState("");
  const [settingUp, setSettingUp] = useState(null); // horseId being quick-setup

  if (route?.name === "feed_edit") {
    const { horseId, slot, item } = route;
    return <FeedingEditor t={t} slot={slot} initialData={item}
      onClose={() => setRoute({ name: "list" })}
      onSave={(newItem) => {
        if (item) editFeedItem(horseId, slot, item.id, newItem);
        else addFeedItem(horseId, slot, newItem);
        setRoute({ name: "list" });
      }}
      onDelete={item ? () => {
        if(window.confirm(t.confirmDelete || "Delete?")) {
          deleteFeedItem(horseId, slot, item.id);
          setRoute({ name: "list" });
        }
      } : null}
    />;
  }

  if (horses.length === 0) {
    return (
      <div className="ev-card">
        <EmptyHero accent={C.amber} icon={<Carrot size={46} strokeWidth={1.6} />}
          title={t.noFeed} sub={t.noFeedSub} cta={t.addHorse} onClick={() => { go("horses"); setRoute({ name: "add" }); }} />
      </div>
    );
  }

  const shown = horseFilter ? horses.filter((h) => String(h.id) === horseFilter) : horses;

  return (
    <div className="ev-card">
      <Tabs tabs={[t.feedingTab, t.orderTab]} active={tab} onChange={setTab} />

      {tab === 0 ? (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
            {/* Horse filter pill row */}
            <div className="ev-scroll" style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingBottom: 8 }}>
              <button type="button" onClick={() => setHorseFilter("")} className="ev-tap"
                style={{ flexShrink: 0, padding: "10px 18px", borderRadius: 16, border: `1.5px solid ${!horseFilter ? C.sky : C.line}`, background: !horseFilter ? C.sky : C.surface, color: !horseFilter ? "#fff" : C.sub, fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                {t.allHorsesShort}
              </button>
              {horses.map(h => (
                <button key={h.id} type="button" onClick={() => setHorseFilter(String(h.id))} className="ev-tap"
                  style={{ flexShrink: 0, padding: "10px 18px", borderRadius: 16, border: `1.5px solid ${horseFilter === String(h.id) ? C.sky : C.line}`, background: horseFilter === String(h.id) ? C.sky : C.surface, color: horseFilter === String(h.id) ? "#fff" : C.sub, fontSize: 14, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                  {h.name}
                </button>
              ))}
            </div>
          </div>

          {/* per-horse feed rows for all slots vertically */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {shown.map((h) => {
              const horseHasFeed = feed[h.id] && (SLOTS.some(s => (feed[h.id][s] || []).length > 0));
              
              return (
                <div key={h.id} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 20, overflow: "hidden" }}>
                  {/* Horse header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderBottom: `1px solid ${C.line}`, background: "#fff" }}>
                    <HorseAvatar h={h} size={42} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{h.name}</div>
                      <div style={{ fontSize: 12, color: C.sub }}>
                        {horseHasFeed ? "Actief schema" : "⚠️ Geen schema"}
                      </div>
                    </div>
                  </div>

                  {/* Quick-setup banner wanneer helemaal geen schema */}
                  {!horseHasFeed && (
                    <div style={{ padding: "16px 18px", background: `${C.amber}08`, borderBottom: `1px solid ${C.amber}22` }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.amber, marginBottom: 10 }}>
                        🥕 Geen voedingsschema — zet er snel één op!
                      </div>
                      <button
                        disabled={settingUp === h.id}
                        onClick={async () => { setSettingUp(h.id); await addDefaultSchedule(h.id); setSettingUp(null); }}
                        className="ev-tap"
                        style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none",
                          background: settingUp === h.id ? C.sub : C.amber, color: "#fff",
                          fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        {settingUp === h.id ? "Bezig..." : `⚡ Schema instellen voor ${h.name}`}
                      </button>
                    </div>
                  )}

                  {/* Items voor slots: morning, noon, evening */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {["morning", "noon", "evening"].map(sl => {
                      const items = (feed[h.id] && feed[h.id][sl]) || [];
                      return (
                        <div key={sl} style={{ borderBottom: sl === "evening" ? "none" : `1px solid ${C.line}`, padding: "16px 18px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>
                              {SLOT_EMOJIS[sl]} {t[sl] || sl}
                            </div>
                            <button onClick={() => setRoute({ name: 'feed_edit', horseId: h.id, slot: sl })} className="ev-tap" style={{
                              background: `${C.amber}1f`, color: C.amber, border: "none", borderRadius: 10, padding: "6px 12px",
                              fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                            }}>
                              <Plus size={14} strokeWidth={2.5} /> {t.add}
                            </button>
                          </div>
                          
                          {items.length === 0 ? (
                            <div style={{ fontSize: 13, color: C.sub }}>{t.noFeedHorse || "Niets gepland"}</div>
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              {items.map((it) => (
                                <div key={it.id} onClick={() => setRoute({ name: 'feed_edit', horseId: h.id, slot: sl, item: it })} className="ev-tap"
                                  style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                                  background: C.field, borderRadius: 12, padding: "10px 14px", border: `1px solid transparent` }}>
                                  <Carrot size={16} color={C.amber} />
                                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{trFeed(it.product, t)}</span>
                                  <span style={{ fontSize: 13, color: C.sub, fontWeight: 600 }}>{it.qty}</span>
                                  <button onClick={(e) => { e.stopPropagation(); if(window.confirm(t.confirmDelete || "Delete?")) deleteFeedItem(h.id, sl, it.id); }} className="ev-tap"
                                    style={{ border: "none", background: "transparent", cursor: "pointer", color: C.sub, padding: 4 }}>
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <OrderTab t={t} setTab={setTab} />
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
      try {
        const { data: res, error } = await supabase.from(conf.table).select('*').order('created_at', { ascending: false });
        if (error) { console.warn(`Table ${conf.table} not found:`, error.message); return; }
        if (res) {
          if (conf.defaultVals) {
            const keys = Object.keys(conf.defaultVals);
            setData(res.filter(x => keys.every(k => x[k] === conf.defaultVals[k])));
          } else {
            setData(res);
          }
        }
      } catch (e) { console.warn('GenericModuleScreen fetch error:', e); }
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
              {x.photo_url ? (
                <img src={x.photo_url} alt="" style={{ width: 44, height: 44, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
              ) : (
                <span style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center",
                  background: `${color}1c`, color: color, flexShrink: 0 }}><Icon size={20} /></span>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 600, color: C.ink }}>{displayName(x)}</div>
                {x.status && <div style={{ fontSize: 13, color: C.sub, marginTop: 2 }}>{x.status}</div>}
                {x.category && !x.status && <div style={{ fontSize: 13, color: C.sub, marginTop: 2, textTransform: "capitalize" }}>{x.category.replace("_", " ")}</div>}
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

              <button onClick={() => { if(window.confirm(t.confirmDelete || "Delete?")) deleteSupply(s.id); }} className="ev-tap" style={{
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

/* ================================================================
   DASHBOARDS — Groom & Manager
   ================================================================ */
function MyDayScreen({ t, mode, go, setRoute }) {
  if (mode === 'manager') return <ManagerDashboard t={t} go={go} setRoute={setRoute} />;
  return <GroomDashboard t={t} go={go} setRoute={setRoute} />;
}

/* ---- GROOM DASHBOARD ---- */
function GroomDashboard({ t, go }) {
  const { tasks, horses, healthRecords, feed, toggleTask, addSupply } = useStore();
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  const hour = now.getHours();
  const greeting = hour < 12 ? t.greetingMorning : hour < 18 ? t.greetingAfternoon : t.greetingEvening;
  const [reportModal, setReportModal] = useState(false);

  const todayTasks = tasks
    .filter(tk => tk.due_date === todayStr || (!tk.due_date && !tk.is_completed))
    .sort((a,b) => (a.start_time||'23:59').localeCompare(b.start_time||'23:59'));
  const done = todayTasks.filter(t => t.is_completed).length;
  const pct = todayTasks.length ? Math.round(done / todayTasks.length * 100) : 0;

  // Today health records
  const todayHealth = healthRecords.filter(hr => hr.scheduled_date?.slice(0,10) === todayStr);

  // Morning feed (quick snapshot)
  const morningFeed = horses.flatMap(h => (feed[h.id]?.morning || []).map(it => ({ ...it, horseName: h.name, color: h.color_hex })));

  // This week (Mon–Sun)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const weekTasks = tasks.filter(tk => {
    if (!tk.due_date) return false;
    const d = new Date(tk.due_date);
    const end = new Date(startOfWeek); end.setDate(end.getDate() + 7);
    return d >= startOfWeek && d < end;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ---- Greeting + Progress ---- */}
      <div style={{ background: 'linear-gradient(135deg, #FFB03A 0%, #FF8C70 100%)', borderRadius: 24, padding: '24px 22px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.85, marginBottom: 4 }}>{greeting}</div>
        <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>{t.dashboardTitle}</div>
        {/* Progress bar */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 8, opacity: 0.9 }}>
            <span>{t.tasksDoneToday}</span>
            <span>{done}/{todayTasks.length}</span>
          </div>
          <div style={{ height: 10, borderRadius: 8, background: 'rgba(255,255,255,0.3)' }}>
            <div style={{ height: '100%', borderRadius: 8, background: '#fff', width: `${pct}%`, transition: 'width .6s ease' }} />
          </div>
        </div>
        <div style={{ fontSize: 13, opacity: 0.85 }}>{pct === 100 ? t.allDone : t.remaining(todayTasks.length - done)}</div>
      </div>

      {/* Top actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <button onClick={() => setRoute({ name: 'tasks', active: 'tasks' })} className="ev-tap" style={{
          background: C.amber, border: "none", borderRadius: 20, padding: 18, color: "#fff",
          display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
          boxShadow: `0 12px 28px ${C.amber}4d`
        }}>
          <div style={{ background: "rgba(255,255,255,0.2)", width: 44, height: 44, borderRadius: 14, display: "grid", placeItems: "center" }}>
            <Plus size={24} />
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{t.addTask || "Add task"}</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>{t.tapToCreate || "Tap to create"}</div>
          </div>
        </button>
        <button onClick={() => go('calendar')} className="ev-tap" style={{
          background: C.sky, border: "none", borderRadius: 20, padding: 18, color: "#fff",
          display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
          boxShadow: `0 12px 28px ${C.sky}4d`
        }}>
          <div style={{ background: "rgba(255,255,255,0.2)", width: 44, height: 44, borderRadius: 14, display: "grid", placeItems: "center" }}>
            <Calendar size={24} />
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{t.calendar}</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>{t.viewSchedule || "View schedule"}</div>
          </div>
        </button>
      </div>

      {/* Quick Report Button positioned nicely */}
      <button onClick={() => setReportModal(true)} className="ev-tap" style={{
        display: "flex", alignItems: "center", gap: 14, width: "100%",
        background: C.surface, border: `1.5px dashed ${C.amber}80`, borderRadius: 20, padding: 18,
        color: C.ink, fontSize: 16, fontWeight: 700, cursor: "pointer", justifyContent: "flex-start",
      }}>
        <div style={{ background: `${C.amber}15`, width: 44, height: 44, borderRadius: 14, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <AlertTriangle size={24} color={C.amber} strokeWidth={2.5} />
        </div>
        <div style={{ textAlign: "left" }}>
          <div>{t.quickReport || "Quick Report"}</div>
          <div style={{ fontSize: 13, color: C.sub, fontWeight: 500, marginTop: 2 }}>{t.reportIssue || "Report an issue or missing item"}</div>
        </div>
      </button>

      {reportModal && <QuickReportEditor t={t} onClose={() => setReportModal(false)} onSave={(r) => { addSupply(r); setReportModal(false); }} />}

      {/* ---- Ochtendvoeding snapshot ---- */}
      {morningFeed.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 20, border: `1px solid ${C.line}`, overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{t.morningFeed}</div>
            <button onClick={() => go('feeding')} style={{ fontSize: 12, color: C.amber, background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{t.seeAll}</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {morningFeed.slice(0, 4).map((it, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px', borderTop: `1px solid ${C.line}` }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: it.color || C.amber, display: 'grid', placeItems: 'center', fontSize: 16, flexShrink: 0 }}>🥕</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{it.horseName}</div>
                  <div style={{ fontSize: 12, color: C.sub }}>{trFeed(it.product, t)}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.amber }}>{it.qty}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---- Taken vandaag ---- */}
      <div style={{ background: '#fff', borderRadius: 20, border: `1px solid ${C.line}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{t.todayTasks}</div>
          <button onClick={() => go('tasks')} style={{ fontSize: 12, color: C.amber, background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{t.allTasks} →</button>
        </div>
        {todayTasks.length === 0 ? (
          <div style={{ padding: '24px 18px', textAlign: 'center', color: C.sub, fontSize: 14 }}>{t.noTasksToday}</div>
        ) : (
          todayTasks.map(tk => {
            const horse = horses.find(h => h.id === tk.horse_id);
            return (
              <button key={tk.id} onClick={() => go('tasks')} className="ev-tap" style={{
                display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
                padding: '13px 18px', borderTop: `1px solid ${C.line}`,
                background: tk.is_completed ? C.bg : '#fff', cursor: 'pointer',
                opacity: tk.is_completed ? 0.6 : 1,
              }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, border: `2px solid ${tk.is_completed ? C.mint : C.amber}`, background: tk.is_completed ? C.mintSoft : 'transparent', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  {tk.is_completed && <Check size={14} strokeWidth={3} color={C.mint} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: tk.is_completed ? C.sub : C.ink, textDecoration: tk.is_completed ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tk.title}</div>
                  <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>
                    {tk.start_time && <span style={{ marginRight: 8 }}>🕐 {tk.start_time.slice(0,5)}{tk.end_time ? `–${tk.end_time.slice(0,5)}` : ''}</span>}
                    {horse && <span>🐴 {horse.name}</span>}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* ---- Gezondheid vandaag ---- */}
      {todayHealth.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 20, border: `1px solid ${C.line}`, overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{t.upcomingHealth}</div>
            <button onClick={() => go('health')} style={{ fontSize: 12, color: C.coral, background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{t.seeAll}</button>
          </div>
          {todayHealth.map(hr => {
            const horse = horses.find(h => h.id === hr.horse_id);
            return (
              <div key={hr.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderTop: `1px solid ${C.line}` }}>
                <span style={{ width: 34, height: 34, borderRadius: 10, background: `${C.coral}18`, display: 'grid', placeItems: 'center', fontSize: 18 }}>🩺</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{t[hr.category] || hr.category}</div>
                  {horse && <div style={{ fontSize: 12, color: C.sub }}>🐴 {horse.name}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---- Week overzicht ---- */}
      <div style={{ background: '#fff', borderRadius: 20, border: `1px solid ${C.line}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{t.thisWeek}</div>
          <button onClick={() => go('calendar')} style={{ fontSize: 12, color: C.sky, background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{t.calendar} →</button>
        </div>
        <div className="ev-scroll" style={{ display: 'flex', overflowX: 'auto', gap: 10, padding: '8px 18px 16px' }}>
          {Array.from({ length: 7 }, (_, i) => {
            const d = new Date(startOfWeek); d.setDate(d.getDate() + i);
            const ds = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
            const isToday = ds === todayStr;
            const dayTasks = weekTasks.filter(tk => tk.due_date === ds);
            return (
              <div key={i} style={{ flexShrink: 0, width: 70, textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.sub, textTransform: 'uppercase', marginBottom: 4 }}>
                  {(t.weekdays || ['Mo','Tu','We','Th','Fr','Sa','Su'])[i]}
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, margin: '0 auto 6px',
                  background: isToday ? C.amber : dayTasks.length ? `${C.sky}20` : C.bg,
                  border: isToday ? 'none' : `1.5px solid ${dayTasks.length ? C.sky : C.line}`,
                  display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 800,
                  color: isToday ? '#fff' : dayTasks.length ? C.sky : C.sub,
                }}>{d.getDate()}</div>
                <div style={{ fontSize: 11, color: C.sub }}>{dayTasks.length ? `${dayTasks.length} ${t.tasks?.toLowerCase() || 'tasks'}` : '–'}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- Snelle acties ---- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { emoji: '✅', label: t.addTask,    color: C.amber, action: () => go('tasks') },
          { emoji: '📅', label: t.calendar,   color: C.sky,   action: () => go('calendar') },
          { emoji: '🩺', label: t.health,     color: C.coral, action: () => go('health') },
          { emoji: '🥕', label: t.feeding,    color: C.mint,  action: () => go('feeding') },
        ].map(a => (
          <button key={a.label} onClick={a.action} className="ev-tap" style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px',
            borderRadius: 18, border: `1.5px solid ${a.color}33`, background: `${a.color}0d`,
            cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
          }}>
            <span style={{ fontSize: 26 }}>{a.emoji}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: a.color }}>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---- MANAGER DASHBOARD ---- */
function ManagerDashboard({ t, go }) {
  const { tasks, horses, healthRecords, txns, supplies } = useStore();
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
  const hour = now.getHours();
  const greeting = hour < 12 ? t.greetingMorning : hour < 18 ? t.greetingAfternoon : t.greetingEvening;

  // KPIs
  const openTasks = tasks.filter(t => !t.is_completed);
  const todayTasks = tasks.filter(tk => tk.due_date === todayStr);
  const activeHorses = horses.filter(h => !h.archived);
  const monthIncome = txns.filter(tx => tx.type === 'income' && tx.date?.startsWith(todayStr.slice(0,7))).reduce((s,tx) => s + Number(tx.amount||0), 0);
  const monthExpense = txns.filter(tx => tx.type === 'expense' && tx.date?.startsWith(todayStr.slice(0,7))).reduce((s,tx) => s + Number(tx.amount||0), 0);
  const pendingSupplies = supplies.filter(s => s.status === 'needed').length;

  // Health upcoming 7 days
  const upcoming7 = healthRecords.filter(hr => {
    if (!hr.scheduled_date) return false;
    const d = new Date(hr.scheduled_date);
    const diff = (d - now) / 86400000;
    return diff >= 0 && diff < 7 && !hr.completed;
  });

  // This week tasks
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const weekTasks = tasks.filter(tk => {
    if (!tk.due_date) return false;
    const d = new Date(tk.due_date);
    const end = new Date(startOfWeek); end.setDate(end.getDate() + 7);
    return d >= startOfWeek && d < end;
  });

  const KPI = ({ emoji, label, value, color, onClick }) => (
    <button onClick={onClick} className="ev-tap" style={{
      display: 'flex', flexDirection: 'column', gap: 8, padding: '18px 16px',
      borderRadius: 18, border: `1.5px solid ${color}22`, background: `${color}0a`,
      cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
    }}>
      <span style={{ fontSize: 24 }}>{emoji}</span>
      <span style={{ fontSize: 26, fontWeight: 800, color }}>{value}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: C.sub }}>{label}</span>
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ---- Header ---- */}
      <div style={{ background: 'linear-gradient(135deg, #2FB6A0 0%, #5AB2FF 100%)', borderRadius: 24, padding: '24px 22px', color: '#fff' }}>
        <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.85, marginBottom: 4 }}>{greeting}, {t.manager}</div>
        <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2, marginBottom: 8 }}>{t.stableOverview}</div>
        <div style={{ fontSize: 14, opacity: 0.85 }}>
          {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* ---- KPI Grid ---- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        <KPI emoji="🐴" label={t.activeHorses} value={activeHorses.length} color={C.mint} onClick={() => go('horses')} />
        <KPI emoji="✅" label={t.openTasks} value={openTasks.length} color={C.amber} onClick={() => go('tasks')} />
        <KPI emoji="💰" label={t.monthlyIncome} value={`€${monthIncome.toFixed(0)}`} color={C.sky} onClick={() => go('finance')} />
        <KPI emoji="📦" label={t.toOrder} value={pendingSupplies} color={C.coral} onClick={() => go('supplies')} />
      </div>

      {/* ---- Vandaag ---- */}
      <div style={{ background: '#fff', borderRadius: 20, border: `1px solid ${C.line}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{t.todayN(todayTasks.length)}</div>
          <button onClick={() => go('tasks')} style={{ fontSize: 12, color: C.amber, background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{t.allTasks}</button>
        </div>
        {todayTasks.length === 0 ? (
          <div style={{ padding: '20px 18px', color: C.sub, fontSize: 14 }}>{t.noTasksScheduled}</div>
        ) : (
          todayTasks.slice(0, 5).map(tk => {
            const horse = horses.find(h => h.id === tk.horse_id);
            return (
              <div key={tk.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderTop: `1px solid ${C.line}`, opacity: tk.is_completed ? 0.5 : 1 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: tk.is_completed ? C.mint : C.amber, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: tk.is_completed ? 'line-through' : 'none' }}>{tk.title}</div>
                  {horse && <div style={{ fontSize: 12, color: C.sub }}>🐴 {horse.name}</div>}
                </div>
                {tk.start_time && <span style={{ fontSize: 12, color: C.sub, fontWeight: 600, flexShrink: 0 }}>{tk.start_time.slice(0,5)}</span>}
              </div>
            );
          })
        )}
      </div>

      {/* ---- Pending Supplies ---- */}
      {pendingSupplies > 0 && (
        <div style={{ background: '#fff', borderRadius: 20, border: `1px solid ${C.coral}40`, overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.coral }}>📦 Supplies to Order ({pendingSupplies})</div>
            <button onClick={() => go('supplies')} style={{ fontSize: 12, color: C.coral, background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}>View All</button>
          </div>
          {supplies.filter(s => s.status === 'needed').slice(0,3).map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderTop: `1px solid ${C.line}` }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{s.item_name || s.name}</div>
                <div style={{ fontSize: 12, color: C.sub }}>Qty: {s.qty || s.quantity || 1}</div>
              </div>
              <button onClick={() => go('supplies')} style={{ padding: '6px 12px', borderRadius: 10, background: `${C.coral}14`, color: C.coral, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Order</button>
            </div>
          ))}
        </div>
      )}

      {/* ---- Week planning ---- */}
      <div style={{ background: '#fff', borderRadius: 20, border: `1px solid ${C.line}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{t.weekPlan}</div>
          <button onClick={() => go('calendar')} style={{ fontSize: 12, color: C.sky, background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{t.calendar} →</button>
        </div>
        <div className="ev-scroll" style={{ display: 'flex', overflowX: 'auto', gap: 10, padding: '8px 18px 16px' }}>
          {Array.from({ length: 7 }, (_, i) => {
            const d = new Date(startOfWeek); d.setDate(d.getDate() + i);
            const ds = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
            const isToday = ds === todayStr;
            const dayTasks = weekTasks.filter(tk => tk.due_date === ds);
            const dayHealth = healthRecords.filter(hr => hr.scheduled_date?.slice(0,10) === ds);
            return (
              <div key={i} style={{ flexShrink: 0, width: 76, textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.sub, textTransform: 'uppercase', marginBottom: 4 }}>
                  {(t.weekdays || ['Mo','Tu','We','Th','Fr','Sa','Su'])[i]}
                </div>
                <div style={{
                  width: 44, height: 44, borderRadius: 13, margin: '0 auto 6px',
                  background: isToday ? C.mint : (dayTasks.length || dayHealth.length) ? `${C.sky}18` : C.bg,
                  border: isToday ? 'none' : `1.5px solid ${(dayTasks.length||dayHealth.length) ? C.sky : C.line}`,
                  display: 'grid', placeItems: 'center', fontSize: 15, fontWeight: 800,
                  color: isToday ? '#fff' : (dayTasks.length||dayHealth.length) ? C.sky : C.sub,
                }}>{d.getDate()}</div>
                {dayTasks.length > 0 && <div style={{ fontSize: 10, color: C.amber, fontWeight: 700 }}>{dayTasks.length} {t.tasks?.toLowerCase()}</div>}
                {dayHealth.length > 0 && <div style={{ fontSize: 10, color: C.coral, fontWeight: 700 }}>{dayHealth.length} {t.health?.toLowerCase()}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ---- Komende gezondheidsafspraken ---- */}
      {upcoming7.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 20, border: `1px solid ${C.line}`, overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{t.upcomingHealth}</div>
            <button onClick={() => go('health')} style={{ fontSize: 12, color: C.coral, background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}>{t.seeAll}</button>
          </div>
          {upcoming7.slice(0, 4).map(hr => {
            const horse = horses.find(h => h.id === hr.horse_id);
            const daysLeft = Math.ceil((new Date(hr.scheduled_date) - now) / 86400000);
            return (
              <div key={hr.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderTop: `1px solid ${C.line}` }}>
                <span style={{ width: 34, height: 34, borderRadius: 10, background: `${C.coral}18`, display: 'grid', placeItems: 'center', fontSize: 18 }}>🩺</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>{t[hr.category] || hr.category}</div>
                  {horse && <div style={{ fontSize: 12, color: C.sub }}>🐴 {horse.name}</div>}
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: daysLeft === 0 ? C.coral : C.sub, background: daysLeft === 0 ? `${C.coral}18` : C.bg, padding: '4px 10px', borderRadius: 8 }}>
                  {t.daysLeftN(daysLeft)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ---- Financieel samenvatting ---- */}
      <div style={{ background: '#fff', borderRadius: 20, border: `1px solid ${C.line}`, padding: '18px' }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.ink, marginBottom: 14 }}>{t.monthlyFinance}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: `${C.mint}0d`, borderRadius: 14, padding: '14px', border: `1px solid ${C.mint}22` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.sub, marginBottom: 6 }}>{t.income?.toUpperCase()}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.mint }}>€{monthIncome.toFixed(2)}</div>
          </div>
          <div style={{ background: `${C.coral}0d`, borderRadius: 14, padding: '14px', border: `1px solid ${C.coral}22` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.sub, marginBottom: 6 }}>{t.expenses?.toUpperCase()}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.coral }}>€{monthExpense.toFixed(2)}</div>
          </div>
        </div>
        <button onClick={() => go('finance')} style={{ width: '100%', marginTop: 12, padding: '12px', borderRadius: 12, border: 'none', background: C.bg, color: C.sub, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
          {t.toFinance}
        </button>
      </div>

      {/* ---- Snelle acties Manager ---- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[
          { emoji: '🐴', label: t.horses,    color: C.mint,  action: () => go('horses') },
          { emoji: '📅', label: t.calendar,  color: C.sky,   action: () => go('calendar') },
          { emoji: '💼', label: t.finance,   color: C.amber, action: () => go('finance') },
          { emoji: '🩺', label: t.health,    color: C.coral, action: () => go('health') },
          { emoji: '👤', label: t.contacts,  color: '#9B7FD4', action: () => go('contacts') },
          { emoji: '📦', label: t.supplies,  color: C.mint,  action: () => go('supplies') },
        ].map(a => (
          <button key={a.label} onClick={a.action} className="ev-tap" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 8px',
            borderRadius: 16, border: `1.5px solid ${a.color}22`, background: `${a.color}0a`,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <span style={{ fontSize: 24 }}>{a.emoji}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: a.color }}>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

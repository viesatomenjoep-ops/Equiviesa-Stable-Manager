import React, { useState, useMemo, createContext, useContext } from "react";
import {
  Menu, X, Bell, Plus, Search, ChevronRight, ChevronLeft, Check,
  Home, Calendar, CheckSquare, Heart, Carrot, MapPin, Contact,
  FileText, Users, Settings, HelpCircle, Receipt, BookOpen,
  Package, Baby, ShoppingCart, Sparkles, Trash2, Camera, MoreHorizontal, Globe, Wallet, ArrowUpRight, ArrowDownRight, Paperclip, ChevronDown
} from "lucide-react";

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
  const addHorse = (h) =>
    setHorses((prev) => [
      ...prev,
      { id: Date.now(), tint: HORSE_TINTS[prev.length % HORSE_TINTS.length], archived: false, ...h },
    ]);
  const deleteHorse = (id) => setHorses((prev) => prev.filter((h) => h.id !== id));

  const [txns, setTxns] = useState([]); // {id, type:'income'|'expense', when, category, who, reference, description, amount, horseId}
  const addTxn = (tx) => setTxns((prev) => [{ id: Date.now(), ...tx }, ...prev]);
  const deleteTxn = (id) => setTxns((prev) => prev.filter((x) => x.id !== id));

  const [users, setUsers] = useState([]); // {id, name, email, role, perms:[]}
  const addUser = (u) => setUsers((prev) => [...prev, { id: Date.now(), ...u }]);
  const deleteUser = (id) => setUsers((prev) => prev.filter((u) => u.id !== id));

  const [feed, setFeed] = useState({}); // { [horseId]: { morning:[{product,qty}], noon:[], evening:[], night:[] } }
  const addFeedItem = (horseId, slot, item) => setFeed((prev) => {
    const h = prev[horseId] || { morning: [], noon: [], evening: [], night: [] };
    return { ...prev, [horseId]: { ...h, [slot]: [...(h[slot] || []), { id: Date.now(), ...item }] } };
  });
  const deleteFeedItem = (horseId, slot, itemId) => setFeed((prev) => {
    const h = prev[horseId]; if (!h) return prev;
    return { ...prev, [horseId]: { ...h, [slot]: h[slot].filter((i) => i.id !== itemId) } };
  });

  const [supplies, setSupplies] = useState([
    { id: 1, item_name: "Strobalen", quantity: "20 stuks", requested_by: "Kyara", status: "pending", notes: "Graag voor het weekend leveren" },
    { id: 2, item_name: "Vliegenspray", quantity: "4 flessen", requested_by: "Christina", status: "pending", notes: "De vliegen zijn erg actief op de wei" }
  ]);
  const addSupply = (item) => setSupplies((prev) => [{ id: Date.now(), status: "pending", ...item }, ...prev]);
  const toggleSupplyStatus = (id) => setSupplies((prev) => prev.map((s) => s.id === id ? { ...s, status: s.status === "pending" ? "purchased" : "pending" } : s));
  const deleteSupply = (id) => setSupplies((prev) => prev.filter((s) => s.id !== id));

  return (
    <Store.Provider value={{ horses, addHorse, deleteHorse, txns, addTxn, deleteTxn,
      users, addUser, deleteUser, feed, addFeedItem, deleteFeedItem,
      supplies, addSupply, toggleSupplyStatus, deleteSupply }}>{children}</Store.Provider>
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
  const [mode, setMode] = useState(null); // null = chooser, 'groom', 'manager'
  const [active, setActive] = useState("horses");
  const [drawer, setDrawer] = useState(false);
  const [route, setRoute] = useState({ name: "list" }); // list | add | detail
  const t = I18N[lang];

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
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: "'Nunito', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Nunito:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .ev-display { font-family: 'Playfair Display', serif; }
        .ev-tap { transition: transform .12s ease, background .15s ease, box-shadow .15s ease; }
        .ev-tap:active { transform: scale(.97); }
        .ev-card { animation: evUp .4s ease both; }
        @keyframes evUp { from { opacity:0; transform: translateY(12px);} to {opacity:1; transform:none;} }
        @keyframes evFade { from {opacity:0;} to {opacity:1;} }
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
const GROOM_KEYS = ["feeding", "tasks", "health", "supplies", "horses"];
const GROOM_BOTTOM = ["feeding", "tasks", "health", "supplies", "horses"];
const MODE_PIN = { manager: "1111", groom: "2222" };

/* ---------- Mode chooser (first screen) ---------- */
function ModeGate({ t, onPick, lang, setLang }) {
  const [pending, setPending] = useState(null); // 'groom' | 'manager' awaiting PIN
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column",
      background: `radial-gradient(120% 80% at 50% -10%, ${C.mintSoft}, ${C.bg})` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 22px" }}>
        <Brand />
        <LangMenu lang={lang} setLang={setLang} t={t} />
      </div>
      <div style={{ flex: 1, display: "grid", placeItems: "center", padding: "20px 18px 60px" }}>
        <div style={{ width: "100%", maxWidth: 560, textAlign: "center" }}>
          <h1 className="ev-display ev-card" style={{ fontSize: 38, fontWeight: 700, margin: "0 0 8px", letterSpacing: -0.6 }}>
            {t.chooseMode}
          </h1>
          <p className="ev-card" style={{ color: C.sub, fontSize: 16, margin: "0 0 32px" }}>{t.chooseModeSub}</p>
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
    <button onClick={onClick} className="ev-tap ev-card" style={{
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
  const langs = [["en","English", "🇬🇧"],["nl","Nederlands", "🇳🇱"],["es","Español", "🇪🇸"]];
  const activeLang = langs.find(x => x[0] === lang) || langs[0];
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((o) => !o)} className="ev-tap" aria-label={t.language}
        style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 20,
          background: open ? C.line : "rgba(31,45,58,.04)", color: C.ink, border: "none", cursor: "pointer",
          transition: "background .15s ease", fontFamily: "inherit" }}>
        <span style={{ fontSize: 16 }}>{activeLang[2]}</span>
        <span style={{ fontSize: 13, fontWeight: 700 }}>{activeLang[0].toUpperCase()}</span>
        <ChevronDown size={14} color={C.sub} style={{ marginLeft: 2 }} />
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{ position: "absolute", top: 44, right: 0, zIndex: 41, background: C.surface,
            borderRadius: 14, border: `1px solid ${C.line}`, boxShadow: "0 12px 34px rgba(31,45,58,.12)",
            padding: 6, minWidth: 160, animation: "evUp .18s ease both" }}>
            {langs.map(([l, label, flag]) => (
              <button key={l} onClick={() => { setLang(l); setOpen(false); }} className="ev-tap" style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", border: "none",
                background: lang === l ? "rgba(31,45,58,.04)" : "transparent", cursor: "pointer", borderRadius: 10,
                padding: "10px 12px", fontFamily: "inherit", fontSize: 14,
                fontWeight: lang === l ? 700 : 500, color: C.ink, textAlign: "left",
              }}>
                <span style={{ fontSize: 16 }}>{flag}</span>
                <span style={{ flex: 1 }}>{label}</span>
                {lang === l && <Check size={16} color={C.ink} />}
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
  if (active === "feeding") return <div style={wrap}><FeedingScreen t={t} /></div>;
  if (active === "supplies") return <div style={wrap}><SuppliesScreen t={t} /></div>;
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
  return (
    <span style={{
      width: size, height: size, borderRadius: "32%", flexShrink: 0,
      background: `linear-gradient(135deg, ${h.tint}, ${h.tint}99)`,
      display: "grid", placeItems: "center", color: "#fff",
      fontWeight: 700, fontSize: size * 0.42, fontFamily: "'Playfair Display',serif",
    }}>{h.name.charAt(0).toUpperCase()}</span>
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
function HorseForm({ t, onDone }) {
  const { addHorse } = useStore();
  const [f, setF] = useState({ name: "", studbook: "", sex: "", color: "", birthdate: "", ueln: "", chip: "", feiid: "", location: "" });
  const [err, setErr] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = () => {
    if (!f.name.trim()) { setErr(true); return; }
    addHorse(f);
    onDone();
  };

  return (
    <div className="ev-card" style={{ maxWidth: 560, margin: "0 auto" }}>
      {/* photo placeholder */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <button className="ev-tap" style={{
          width: 96, height: 96, borderRadius: "30%", border: `2px dashed ${C.line}`,
          background: C.field, cursor: "pointer", display: "grid", placeItems: "center",
          color: C.sub, gap: 4,
        }}>
          <Camera size={26} />
        </button>
      </div>

      <Field label={t.name} required>
        <input value={f.name} onChange={(e) => { set("name")(e); setErr(false); }}
          placeholder={t.name + " *"} style={inputStyle(err)} />
      </Field>
      {err && <div style={{ color: C.coral, fontSize: 13, marginTop: -8, marginBottom: 10 }}>{t.nameRequired}</div>}

      <Divider label={t.optional} />

      <Field label={t.studbook}><input value={f.studbook} onChange={set("studbook")} placeholder={t.select} style={inputStyle()} /></Field>
      <Field label={t.sex}>
        <select value={f.sex} onChange={set("sex")} style={{ ...inputStyle(), color: f.sex ? C.ink : C.sub, appearance: "none" }}>
          <option value="">{t.select}</option>
          {SEX_OPTS.map((s) => <option key={s} value={s}>{t[s]}</option>)}
        </select>
      </Field>
      <Field label={t.color}><input value={f.color} onChange={set("color")} placeholder={t.select} style={inputStyle()} /></Field>
      <Field label={t.birthdate}><input type="date" value={f.birthdate} onChange={set("birthdate")} style={inputStyle()} /></Field>
      <Field label={t.ueln}><input value={f.ueln} onChange={set("ueln")} placeholder="UELN" style={inputStyle()} /></Field>
      <Field label={t.chip}><input value={f.chip} onChange={set("chip")} placeholder={t.chip} style={inputStyle()} /></Field>
      <Field label={t.feiid}><input value={f.feiid} onChange={set("feiid")} placeholder="FEI ID" style={inputStyle()} /></Field>
      <Field label={t.location}><input value={f.location} onChange={set("location")} placeholder={t.select} style={inputStyle()} /></Field>

      <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
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
  width: "100%", padding: "15px 16px", borderRadius: 14, fontSize: 16,
  border: `1.5px solid ${err ? C.coral : "transparent"}`, background: C.field,
  color: C.ink, outline: "none",
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
  const MAY = 4;
  const days = [[0, 19, true], [1, 20], [2, 21], [3, 22], [4, 23], [5, 24], [6, 25], [1, 26]];
  return (
    <div className="ev-card">
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <Pill active>{t.today} · 19</Pill><Pill>{cap(t.months[MAY])} 2026</Pill>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {days.map(([wd, n, today], i) => (
          <div key={i} style={{ display: "flex", gap: 16, alignItems: "center", background: C.surface,
            borderRadius: 16, padding: "16px 18px", border: `1px solid ${C.line}` }}>
            <div style={{ textAlign: "center", width: 46 }}>
              <div style={{ fontSize: 12, color: C.sub, textTransform: "uppercase", fontWeight: 600 }}>{t.weekdays[wd]}</div>
              <div style={{ fontSize: 22, fontWeight: 700, width: 38, height: 38, lineHeight: "38px",
                borderRadius: "50%", margin: "2px auto 0", background: today ? C.coral : "transparent",
                color: today ? "#fff" : C.ink }}>{n}</div>
            </div>
            <div style={{ color: C.sub, fontSize: 15, fontStyle: "italic" }}>{t.nothingPlanned}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Tasks ---------- */
function TasksScreen({ t }) {
  const [tab, setTab] = useState(0);
  return (
    <div className="ev-card">
      <Tabs tabs={[t.horses, t.general]} active={tab} onChange={setTab} />
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}><Pill active>{t.fmtTodayDate(19, t.months[4])}</Pill></div>
      <div style={{ height: 30 }} />
      <EmptyHero accent={C.amber} icon={<CheckSquare size={46} strokeWidth={1.6} />} title={t.empty} sub="" cta={t.new} />
    </div>
  );
}

/* ---------- Health ---------- */
function HealthScreen({ t }) {
  const [tab, setTab] = useState(0);
  return (
    <div className="ev-card">
      <Tabs tabs={[t.planned, t.history]} active={tab} onChange={setTab} />
      <div style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.line}`, padding: 18, marginBottom: 16 }}>
        <div className="ev-display" style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
          {cap(t.months[4])} <span style={{ color: C.sub }}>2026</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, textAlign: "center" }}>
          {t.weekdays.map((d) => (
            <div key={d} style={{ fontSize: 12, color: C.sub, fontWeight: 600, padding: "4px 0" }}>{d}</div>
          ))}
          {[18,19,20,21,22,23,24].map((n) => (
            <div key={n} style={{ padding: "8px 0", fontSize: 15, fontWeight: 600, color: n === 19 ? "#fff" : C.ink }}>
              <span style={{ display: "inline-grid", placeItems: "center", width: 34, height: 34, borderRadius: "50%",
                background: n === 19 ? C.mint : "transparent" }}>{n}</span>
            </div>
          ))}
        </div>
        <div style={{ color: C.sub, fontStyle: "italic", marginTop: 12, fontSize: 14 }}>{t.nothingPlanned}</div>
      </div>
      <h3 className="ev-display" style={{ fontSize: 19, fontWeight: 700, margin: "20px 4px 12px" }}>{t.careOverview}</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 12 }}>
        {HEALTH_CATS.map(([key, Icon, color]) => (
          <button key={key} className="ev-tap" style={{
            display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start",
            background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: 16,
            cursor: "pointer", textAlign: "left", fontFamily: "inherit",
          }}>
            <span style={{ width: 44, height: 44, borderRadius: 13, display: "grid", placeItems: "center",
              background: `${color}1f`, color }}><Icon size={22} strokeWidth={2.1} /></span>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{t[key]}</span>
            <span style={{ fontSize: 13, color: C.sub }}>0</span>
          </button>
        ))}
      </div>
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
                style={{ ...inputStyle(), fontSize: 28, fontWeight: 700, fontFamily: "'Playfair Display',serif",
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
function FeedingScreen({ t }) {
  const { horses, feed, addFeedItem, deleteFeedItem } = useStore();
  const [tab, setTab] = useState(0); // 0 feeding 1 order
  const [slot, setSlot] = useState("morning");
  const [horseFilter, setHorseFilter] = useState("");
  const [addFor, setAddFor] = useState(null); // horseId to add product for

  if (horses.length === 0) {
    return (
      <div className="ev-card">
        <EmptyHero accent={C.amber} icon={<Carrot size={46} strokeWidth={1.6} />}
          title={t.noFeed} sub={t.noFeedSub} cta={t.addHorse} onClick={() => {}} />
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

function FeedModal({ t, slot, onClose, onSave }) {
  const [f, setF] = useState({ product: "", qty: "" });
  const [err, setErr] = useState(false);
  const save = () => { if (!f.product.trim()) { setErr(true); return; } onSave(f); };
  return (
    <ModalShell t={t} onClose={onClose} accent={C.amber} icon={<Carrot size={22} />}
      title={`${t.addProduct} · ${t[slot]}`}>
      <Field label={t.product} required>
        <input value={f.product} onChange={(e) => { setF({ ...f, product: e.target.value }); setErr(false); }}
          autoFocus style={inputStyle(err)} />
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
    <div style={{ position: "fixed", inset: 0, zIndex: 60, animation: "evFade .2s ease",
      display: "grid", placeItems: "center", padding: 16 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(31,45,58,.45)" }} />
      <div className="ev-scroll" style={{ position: "relative", width: "100%", maxWidth: 560, maxHeight: "90vh",
        overflowY: "auto", background: C.surface, borderRadius: 24, padding: 24,
        animation: "evUp .25s ease both", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <span style={{ width: 44, height: 44, borderRadius: 13, display: "grid", placeItems: "center",
            background: `${accent}1c`, color: accent }}>{icon}</span>
          <h2 className="ev-display" style={{ flex: 1, margin: 0, fontSize: 23, fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} className="ev-tap" style={{ ...iconBtn, boxShadow: "none", background: C.bg }}>
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
    <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
      <button onClick={onClose} className="ev-tap" style={{
        flex: 1, padding: "15px", borderRadius: 14, border: `1px solid ${C.line}`, background: C.surface,
        color: C.ink, fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{t.cancel}</button>
      <button onClick={onSave} className="ev-tap" style={{
        flex: 2, padding: "15px", borderRadius: 14, border: "none", background: accent, color: "#fff",
        fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: `0 8px 22px ${accent}55` }}>
        {saveIcon} {saveLabel}
      </button>
    </div>
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
        <SupplyModal t={t} onClose={() => setModal(false)} onSave={(item) => { addSupply(item); setModal(false); }} />
      )}
    </div>
  );
}

function SupplyModal({ t, onClose, onSave }) {
  const [f, setF] = useState({ item_name: "", quantity: "", requested_by: "", notes: "" });
  const [err, setErr] = useState(false);
  const save = () => {
    if (!f.item_name.trim()) { setErr(true); return; }
    onSave(f);
  };

  return (
    <ModalShell t={t} onClose={onClose} accent={C.coral} icon={<ShoppingCart size={22} />} title={t.addSupply}>
      <Field label={t.supplyItem} required>
        <input value={f.item_name} onChange={(e) => { setF({ ...f, item_name: e.target.value }); setErr(false); }}
          placeholder={t.supplyItem} autoFocus style={inputStyle(err)} />
      </Field>
      {err && <div style={{ color: C.coral, fontSize: 13, marginTop: -8, marginBottom: 10 }}>{t.supplyItem} is verplicht</div>}

      <Field label={t.qty}>
        <input value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })}
          placeholder="bijv. 5 zakken, 2 stuks" style={inputStyle()} />
      </Field>

      <Field label={t.requestedBy}>
        <input value={f.requested_by} onChange={(e) => setF({ ...f, requested_by: e.target.value })}
          placeholder="bijv. Kyara, Christina" style={inputStyle()} />
      </Field>

      <Field label="Opmerkingen">
        <textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })}
          rows={2} style={{ ...inputStyle(), resize: "none" }} placeholder="Optionele details..." />
      </Field>

      <ModalFooter t={t} onClose={onClose} onSave={save} accent={C.coral} saveLabel={t.add} saveIcon={<Plus size={20} />} />
    </ModalShell>
  );
}

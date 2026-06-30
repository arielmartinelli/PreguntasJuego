// Script para sembrar (seed) 1000+ preguntas en Supabase
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// 1. Cargar Variables de Entorno de forma manual (.env)
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
          } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.substring(1, value.length - 1);
          }
          process.env[key] = value;
        }
      });
    }
  } catch (e) {
    console.error("Error leyendo archivo .env:", e);
  }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERROR: No se encontraron las credenciales VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el archivo .env.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. Base de datos estática para el Generador Programático
const PAISES_CAPITALES = [
  { p: "Alemania", c: "Berlín", d: "easy" },
  { p: "Francia", c: "París", d: "easy" },
  { p: "España", c: "Madrid", d: "easy" },
  { p: "Italia", c: "Roma", d: "easy" },
  { p: "Reino Unido", c: "Londres", d: "easy" },
  { p: "Japón", c: "Tokio", d: "easy" },
  { p: "China", c: "Pekín", d: "easy" },
  { p: "Rusia", c: "Moscú", d: "easy" },
  { p: "Brasil", c: "Brasilia", d: "easy" },
  { p: "Argentina", c: "Buenos Aires", d: "easy" },
  { p: "Estados Unidos", c: "Washington D.C.", d: "easy" },
  { p: "Canadá", c: "Ottawa", d: "medium" },
  { p: "Australia", c: "Canberra", d: "medium" },
  { p: "Egipto", c: "El Cairo", d: "medium" },
  { p: "India", c: "Nueva Delhi", d: "medium" },
  { p: "México", c: "Ciudad de México", d: "easy" },
  { p: "Colombia", c: "Bogotá", d: "easy" },
  { p: "Chile", c: "Santiago", d: "easy" },
  { p: "Perú", c: "Lima", d: "easy" },
  { p: "Sudáfrica", c: "Pretoria", d: "medium" },
  { p: "Turquía", c: "Ankara", d: "medium" },
  { p: "Grecia", c: "Atenas", d: "easy" },
  { p: "Suiza", c: "Berna", d: "medium" },
  { p: "Noruega", c: "Oslo", d: "medium" },
  { p: "Portugal", c: "Lisboa", d: "easy" },
  { p: "Países Bajos", c: "Ámsterdam", d: "easy" },
  { p: "Bélgica", c: "Bruselas", d: "easy" },
  { p: "Suecia", c: "Estocolmo", d: "medium" },
  { p: "Nueva Zelanda", c: "Wellington", d: "medium" },
  { p: "Islandia", c: "Reikiavik", d: "medium" },
  { p: "Mongolia", c: "Ulán Bator", d: "hard" },
  { p: "Nepal", c: "Katmandú", d: "hard" },
  { p: "Kenia", c: "Nairobi", d: "medium" },
  { p: "Marruecos", c: "Rabat", d: "medium" },
  { p: "Arabia Saudita", c: "Riad", d: "medium" },
  { p: "Vietnam", c: "Hanói", d: "medium" },
  { p: "Tailandia", c: "Bangkok", d: "medium" },
  { p: "Filipinas", c: "Manila", d: "medium" },
  { p: "Indonesia", c: "Yakarta", d: "medium" },
  { p: "Corea del Sur", c: "Seúl", d: "easy" },
  { p: "Nigeria", c: "Abuya", d: "hard" },
  { p: "Ghana", c: "Acra", d: "hard" },
  { p: "Senegal", c: "Dakar", d: "medium" },
  { p: "Ecuador", c: "Quito", d: "easy" },
  { p: "Uruguay", c: "Montevideo", d: "easy" },
  { p: "Paraguay", c: "Asunción", d: "easy" },
  { p: "Bolivia", c: "Sucre", d: "medium" },
  { p: "Venezuela", c: "Caracas", d: "easy" },
  { p: "Cuba", c: "La Habana", d: "easy" },
  { p: "Costa Rica", c: "San José", d: "easy" },
  { p: "Panamá", c: "Panamá", d: "easy" },
  { p: "Jamaica", c: "Kingston", d: "medium" },
  { p: "Finlandia", c: "Helsinki", d: "medium" },
  { p: "Dinamarca", c: "Copenhague", d: "medium" },
  { p: "Polonia", c: "Varsovia", d: "medium" },
  { p: "Ucrania", c: "Kiev", d: "easy" },
  { p: "Austria", c: "Viena", d: "easy" },
  { p: "Hungría", c: "Budapest", d: "medium" },
  { p: "República Checa", c: "Praga", d: "easy" },
  { p: "Rumanía", c: "Bucarest", d: "medium" },
  { p: "Bulgaria", c: "Sofía", d: "medium" },
  { p: "Irlanda", c: "Dublín", d: "easy" },
  { p: "Croacia", c: "Zagreb", d: "medium" },
  { p: "Camerún", c: "Yaundé", d: "hard" },
  { p: "Madagascar", c: "Antananarivo", d: "hard" }
];

const ELEMENTOS_QUIMICOS = [
  { n: "Hidrógeno", s: "H", d: "easy" },
  { n: "Helio", s: "He", d: "easy" },
  { n: "Litio", s: "Li", d: "medium" },
  { n: "Berilio", s: "Be", d: "hard" },
  { n: "Carbono", s: "C", d: "easy" },
  { n: "Nitrógeno", s: "N", d: "easy" },
  { n: "Oxígeno", s: "O", d: "easy" },
  { n: "Flúor", s: "F", d: "medium" },
  { n: "Neón", s: "Ne", d: "medium" },
  { n: "Sodio", s: "Na", d: "medium" },
  { n: "Magnesio", s: "Mg", d: "medium" },
  { n: "Aluminio", s: "Al", d: "easy" },
  { n: "Silicio", s: "Si", d: "medium" },
  { n: "Fósforo", s: "P", d: "medium" },
  { n: "Azufre", s: "S", d: "easy" },
  { n: "Cloro", s: "Cl", d: "easy" },
  { n: "Argón", s: "Ar", d: "hard" },
  { n: "Potasio", s: "K", d: "medium" },
  { n: "Calcio", s: "Ca", d: "easy" },
  { n: "Hierro", s: "Fe", d: "easy" },
  { n: "Cobre", s: "Cu", d: "easy" },
  { n: "Zinc", s: "Zn", d: "easy" },
  { n: "Plata", s: "Ag", d: "easy" },
  { n: "Oro", s: "Au", d: "easy" },
  { n: "Plomo", s: "Pb", d: "easy" },
  { n: "Mercurio", s: "Hg", d: "easy" },
  { n: "Uranio", s: "U", d: "medium" },
  { n: "Plutonio", s: "Pu", d: "medium" },
  { n: "Titanio", s: "Ti", d: "easy" },
  { n: "Níquel", s: "Ni", d: "medium" },
  { n: "Cobalto", s: "Co", d: "medium" },
  { n: "Platino", s: "Pt", d: "easy" },
  { n: "Helio", s: "He", d: "easy" },
  { n: "Xenón", s: "Xe", d: "hard" },
  { n: "Kriptón", s: "Kr", d: "hard" },
  { n: "Radón", s: "Rn", d: "hard" },
  { n: "Polonio", s: "Po", d: "hard" },
  { n: "Arsénico", s: "As", d: "medium" },
  { n: "Antimonio", s: "Sb", d: "hard" },
  { n: "Bismuto", s: "Bi", d: "hard" },
  { n: "Bario", s: "Ba", d: "hard" },
  { n: "Estroncio", s: "Sr", d: "hard" },
  { n: "Rubidio", s: "Rb", d: "hard" },
  { n: "Cesio", s: "Cs", d: "hard" },
  { n: "Yodo", s: "I", d: "medium" },
  { n: "Bromo", s: "Br", d: "medium" },
  { n: "Estaño", s: "Sn", d: "medium" }
];

const HISTORIA_FECHAS = [
  { e: "el descubrimiento de América por Cristóbal Colón", a: "1492", d: "easy" },
  { e: "la caída del Imperio Romano de Occidente", a: "476", d: "medium" },
  { e: "la Revolución Francesa", a: "1789", d: "easy" },
  { e: "el inicio de la Primera Guerra Mundial", a: "1914", d: "easy" },
  { e: "la llegada del hombre a la Luna (Apolo 11)", a: "1969", d: "easy" },
  { e: "la caída del Muro de Berlín", a: "1989", d: "easy" },
  { e: "el ataque a las Torres Gemelas en Nueva York", a: "2001", d: "easy" },
  { e: "la independencia de Argentina", a: "1816", d: "medium" },
  { e: "la declaración de independencia de EE. UU.", a: "1776", d: "easy" },
  { e: "la Batalla de Waterloo", a: "1815", d: "medium" },
  { e: "la caída de Constantinopla ante los otomanos", a: "1453", d: "medium" },
  { e: "la firma de la Carta Magna en Inglaterra", a: "1215", d: "hard" },
  { e: "la coronación de Carlomagno como emperador", a: "800", d: "hard" },
  { e: "el inicio de la Revolución Rusa", a: "1917", d: "medium" },
  { e: "el descubrimiento de la penicilina por Fleming", a: "1928", d: "medium" },
  { e: "el final de la Guerra de los Cien Años", a: "1453", d: "hard" },
  { e: "la fundación de Roma (fecha legendaria)", a: "753 a.C.", d: "hard" },
  { e: "el inicio de la construcción del Coliseo de Roma", a: "72 d.C.", d: "hard" },
  { e: "el inicio de la Revolución Industrial", a: "1760", d: "medium" },
  { e: "la muerte de Julio César", a: "44 a.C.", d: "hard" },
  { e: "la coronación de Napoleón Bonaparte", a: "1804", d: "medium" }
];

const AUTORES_LIBROS = [
  { l: "Don Quijote de la Mancha", a: "Miguel de Cervantes", d: "easy" },
  { l: "Romeo y Julieta", a: "William Shakespeare", d: "easy" },
  { l: "Cien años de soledad", a: "Gabriel García Márquez", d: "easy" },
  { l: "La Odisea", a: "Homero", d: "easy" },
  { l: "Orgullo y prejuicio", a: "Jane Austen", d: "easy" },
  { l: "El Principito", a: "Antoine de Saint-Exupéry", d: "easy" },
  { l: "La Divina Comedia", a: "Dante Alighieri", d: "medium" },
  { l: "Crimen y castigo", a: "Fiódor Dostoyevski", d: "medium" },
  { l: "El retrato de Dorian Gray", a: "Oscar Wilde", d: "medium" },
  { l: "El cantar de mio Cid", a: "Anónimo", d: "medium" },
  { l: "La metamorfosis", a: "Franz Kafka", d: "easy" },
  { l: "Ulises", a: "James Joyce", d: "hard" },
  { l: "En busca del tiempo perdido", a: "Marcel Proust", d: "hard" },
  { l: "Ficciones", a: "Jorge Luis Borges", d: "medium" },
  { l: "Rayuela", a: "Julio Cortázar", d: "medium" },
  { l: "El amor en los tiempos del cólera", a: "Gabriel García Márquez", d: "easy" },
  { l: "Los miserables", a: "Victor Hugo", d: "medium" },
  { l: "Guerra y paz", a: "León Tolstói", d: "medium" },
  { l: "Frankenstein", a: "Mary Shelley", d: "easy" },
  { l: "Drácula", a: "Bram Stoker", d: "easy" },
  { l: "1984", a: "George Orwell", d: "easy" },
  { l: "El señor de los anillos", a: "J.R.R. Tolkien", d: "easy" }
];

const PELICULAS_DIRECTORES = [
  { p: "Pulp Fiction", r: "Quentin Tarantino", d: "easy" },
  { p: "El Padrino", r: "Francis Ford Coppola", d: "easy" },
  { p: "Psicosis", r: "Alfred Hitchcock", d: "easy" },
  { p: "El Resplandor", r: "Stanley Kubrick", d: "easy" },
  { p: "Avatar", r: "James Cameron", d: "easy" },
  { p: "Inception", r: "Christopher Nolan", d: "easy" },
  { p: "Tiburón", r: "Steven Spielberg", d: "easy" },
  { p: "La lista de Schindler", r: "Steven Spielberg", d: "easy" },
  { p: "Goodfellas", r: "Martin Scorsese", d: "medium" },
  { p: "El club de la pelea (Fight Club)", r: "David Fincher", d: "easy" },
  { p: "Taxi Driver", r: "Martin Scorsese", d: "medium" },
  { p: "Star Wars: Episodio IV", r: "George Lucas", d: "easy" },
  { p: "Parásitos", r: "Bong Joon-ho", d: "medium" },
  { p: "Interstellar", r: "Christopher Nolan", d: "easy" },
  { p: "El viaje de Chihiro", r: "Hayao Miyazaki", d: "medium" },
  { p: "Blade Runner", r: "Ridley Scott", d: "medium" },
  { p: "Gladiador", r: "Ridley Scott", d: "easy" },
  { p: "El laberinto del fauno", r: "Guillermo del Toro", d: "easy" },
  { p: "Ciudadano Kane", r: "Orson Welles", d: "hard" },
  { p: "Casablanca", r: "Michael Curtiz", d: "hard" },
  { p: "Vértigo", r: "Alfred Hitchcock", d: "hard" }
];

const DEPORTES_MUNDIALES = [
  { a: "1930", c: "Uruguay", d: "medium" },
  { a: "1950", c: "Uruguay", d: "medium" },
  { a: "1958", c: "Brasil", d: "medium" },
  { a: "1962", c: "Brasil", d: "hard" },
  { a: "1966", c: "Inglaterra", d: "hard" },
  { a: "1970", c: "Brasil", d: "medium" },
  { a: "1974", c: "Alemania Federal", d: "hard" },
  { a: "1978", c: "Argentina", d: "medium" },
  { a: "1982", c: "Italia", d: "hard" },
  { a: "1986", c: "Argentina", d: "easy" },
  { a: "1990", c: "Alemania", d: "medium" },
  { a: "1994", c: "Brasil", d: "easy" },
  { a: "1998", c: "Francia", d: "easy" },
  { a: "2002", c: "Brasil", d: "easy" },
  { a: "2006", c: "Italia", d: "easy" },
  { a: "2010", c: "España", d: "easy" },
  { a: "2014", c: "Alemania", d: "easy" },
  { a: "2018", c: "Francia", d: "easy" },
  { a: "2022", c: "Argentina", d: "easy" }
];

// 3. Generar preguntas programáticamente
function generateQuestions() {
  const list = [];

  // --- SET A: Geografía - Capitales (100+ preguntas) ---
  // Generaremos dos tipos: capital de país y qué país tiene esa capital.
  PAISES_CAPITALES.forEach((item, idx) => {
    // Tipo 1: Capital del país
    const allCapitals = PAISES_CAPITALES.map(x => x.c);
    const wrongCapitals = allCapitals.filter(c => c !== item.c);
    const shuffledWrong = wrongCapitals.sort(() => Math.random() - 0.5);
    const options = [item.c, shuffledWrong[0], shuffledWrong[1], shuffledWrong[2]].sort(() => Math.random() - 0.5);
    
    list.push({
      category: "Geografía",
      difficulty: item.d,
      question_text: `¿Cuál es la capital oficial de ${item.p}?`,
      options: options,
      correct_answer: item.c,
      has_options: true
    });

    // Tipo 2: De quién es esta capital
    const allCountries = PAISES_CAPITALES.map(x => x.p);
    const wrongCountries = allCountries.filter(p => p !== item.p);
    const shuffledWrongCountries = wrongCountries.sort(() => Math.random() - 0.5);
    const optionsCountry = [item.p, shuffledWrongCountries[0], shuffledWrongCountries[1], shuffledWrongCountries[2]].sort(() => Math.random() - 0.5);

    list.push({
      category: "Geografía",
      difficulty: item.d === 'easy' ? 'medium' : 'hard',
      question_text: `¿De qué país es capital la ciudad de ${item.c}?`,
      options: optionsCountry,
      correct_answer: item.p,
      has_options: true
    });
  });

  // --- SET B: Ciencia - Elementos químicos (100+ preguntas) ---
  ELEMENTOS_QUIMICOS.forEach((item) => {
    // Tipo 1: Símbolo químico
    const allSymbols = ELEMENTOS_QUIMICOS.map(x => x.s);
    const wrongSymbols = allSymbols.filter(s => s !== item.s);
    const shuffledWrong = wrongSymbols.sort(() => Math.random() - 0.5);
    const options = [item.s, shuffledWrong[0], shuffledWrong[1], shuffledWrong[2]].sort(() => Math.random() - 0.5);

    list.push({
      category: "Ciencia",
      difficulty: item.d,
      question_text: `¿Cuál es el símbolo químico del elemento "${item.n}"?`,
      options: options,
      correct_answer: item.s,
      has_options: true
    });

    // Tipo 2: Qué elemento representa este símbolo
    const allNames = ELEMENTOS_QUIMICOS.map(x => x.n);
    const wrongNames = allNames.filter(n => n !== item.n);
    const shuffledWrongNames = wrongNames.sort(() => Math.random() - 0.5);
    const optionsName = [item.n, shuffledWrongNames[0], shuffledWrongNames[1], shuffledWrongNames[2]].sort(() => Math.random() - 0.5);

    list.push({
      category: "Ciencia",
      difficulty: item.d === 'easy' ? 'medium' : 'hard',
      question_text: `¿Qué elemento químico de la tabla periódica es representado por el símbolo "${item.s}"?`,
      options: optionsName,
      correct_answer: item.n,
      has_options: true
    });
  });

  // --- SET C: Ciencia - Operaciones Matemáticas (200 preguntas) ---
  for (let i = 1; i <= 200; i++) {
    let qText = '';
    let correct = 0;
    let diff = 'easy';
    
    if (i <= 70) {
      // Suma/Resta Fácil (easy)
      const a = Math.floor(10 + Math.random() * 90);
      const b = Math.floor(10 + Math.random() * 90);
      const op = Math.random() > 0.5 ? '+' : '-';
      correct = op === '+' ? a + b : a - b;
      qText = `¿Cuánto es ${a} ${op} ${b}?`;
      diff = 'easy';
    } else if (i <= 140) {
      // Multiplicaciones medianas (medium)
      const a = Math.floor(5 + Math.random() * 15);
      const b = Math.floor(5 + Math.random() * 12);
      correct = a * b;
      qText = `¿Cuál es el resultado de multiplicar ${a} x ${b}?`;
      diff = 'medium';
    } else {
      // Divisiones o potencias difíciles (hard)
      const a = Math.floor(8 + Math.random() * 12);
      correct = a * a; // potencia x^2
      qText = `¿Cuál es el valor resultante de elevar ${a} al cuadrado (${a}²)?`;
      diff = 'hard';
    }

    const correctStr = String(correct);
    const options = [
      correctStr,
      String(correct + 10),
      String(correct - 5),
      String(correct + (Math.random() > 0.5 ? 2 : -2))
    ].sort(() => Math.random() - 0.5);

    list.push({
      category: "Ciencia",
      difficulty: diff,
      question_text: qText,
      options: options,
      correct_answer: correctStr,
      has_options: true
    });
  }

  // --- SET D: Historia - Fechas (100+ preguntas) ---
  HISTORIA_FECHAS.forEach((item) => {
    // Tipo 1: Año de acontecimiento
    const correctYear = parseInt(item.a);
    const options = [
      item.a,
      isNaN(correctYear) ? "1000 a.C." : String(correctYear + 10),
      isNaN(correctYear) ? "500 d.C." : String(correctYear - 5),
      isNaN(correctYear) ? "300 a.C." : String(correctYear + 35)
    ].sort(() => Math.random() - 0.5);

    list.push({
      category: "Historia",
      difficulty: item.d,
      question_text: `¿En qué año aconteció ${item.e}?`,
      options: options,
      correct_answer: item.a,
      has_options: true
    });

    // Tipo 2: Qué ocurrió en este año (invirtiendo)
    const allEvents = HISTORIA_FECHAS.map(x => x.e);
    const wrongEvents = allEvents.filter(e => e !== item.e);
    const shuffledWrong = wrongEvents.sort(() => Math.random() - 0.5);
    const optionsEvent = [
      `Se produjo ${item.e}`,
      `Ocurrió ${shuffledWrong[0]}`,
      `Sucedió ${shuffledWrong[1]}`,
      `Aconteció ${shuffledWrong[2]}`
    ].sort(() => Math.random() - 0.5);

    list.push({
      category: "Historia",
      difficulty: item.d === 'easy' ? 'medium' : 'hard',
      question_text: `¿Qué importante hecho histórico ocurrió en el año ${item.a}?`,
      options: optionsEvent,
      correct_answer: `Se produjo ${item.e}`,
      has_options: true
    });
  });

  // --- SET E: Arte y Literatura - Autores (100+ preguntas) ---
  AUTORES_LIBROS.forEach((item) => {
    const allAuthors = AUTORES_LIBROS.map(x => x.a);
    const wrongAuthors = allAuthors.filter(a => a !== item.a);
    const shuffledWrong = wrongAuthors.sort(() => Math.random() - 0.5);
    const options = [item.a, shuffledWrong[0], shuffledWrong[1], shuffledWrong[2]].sort(() => Math.random() - 0.5);

    list.push({
      category: "Arte y Literatura",
      difficulty: item.d,
      question_text: `¿Quién escribió la célebre obra titulada "${item.l}"?`,
      options: options,
      correct_answer: item.a,
      has_options: true
    });

    // Tipo 2: Qué obra escribió este autor
    const allBooks = AUTORES_LIBROS.map(x => x.l);
    const wrongBooks = allBooks.filter(l => l !== item.l);
    const shuffledWrongBooks = wrongBooks.sort(() => Math.random() - 0.5);
    const optionsBook = [item.l, shuffledWrongBooks[0], shuffledWrongBooks[1], shuffledWrongBooks[2]].sort(() => Math.random() - 0.5);

    list.push({
      category: "Arte y Literatura",
      difficulty: item.d === 'easy' ? 'medium' : 'hard',
      question_text: `¿Cuál de las siguientes obras literarias fue escrita por ${item.a}?`,
      options: optionsBook,
      correct_answer: item.l,
      has_options: true
    });
  });

  // --- SET F: Entretenimiento - Películas (100+ preguntas) ---
  PELICULAS_DIRECTORES.forEach((item) => {
    const allDirectors = PELICULAS_DIRECTORES.map(x => x.r);
    const wrongDirectors = allDirectors.filter(r => r !== item.r);
    const shuffledWrong = wrongDirectors.sort(() => Math.random() - 0.5);
    const options = [item.r, shuffledWrong[0], shuffledWrong[1], shuffledWrong[2]].sort(() => Math.random() - 0.5);

    list.push({
      category: "Entretenimiento",
      difficulty: item.d,
      question_text: `¿Quién dirigió la famosa película "${item.p}"?`,
      options: options,
      correct_answer: item.r,
      has_options: true
    });

    // Tipo 2: Película dirigida por
    const allMovies = PELICULAS_DIRECTORES.map(x => x.p);
    const wrongMovies = allMovies.filter(p => p !== item.p);
    const shuffledWrongMovies = wrongMovies.sort(() => Math.random() - 0.5);
    const optionsMovie = [item.p, shuffledWrongMovies[0], shuffledWrongMovies[1], shuffledWrongMovies[2]].sort(() => Math.random() - 0.5);

    list.push({
      category: "Entretenimiento",
      difficulty: item.d === 'easy' ? 'medium' : 'hard',
      question_text: `¿Cuál de las siguientes películas fue dirigida por ${item.r}?`,
      options: optionsMovie,
      correct_answer: item.p,
      has_options: true
    });
  });

  // --- SET G: Deportes - Mundiales de fútbol (100+ preguntas) ---
  DEPORTES_MUNDIALES.forEach((item) => {
    const allChampions = DEPORTES_MUNDIALES.map(x => x.c);
    const wrongChampions = allChampions.filter(c => c !== item.c);
    const shuffledWrong = wrongChampions.sort(() => Math.random() - 0.5);
    const options = [item.c, shuffledWrong[0], shuffledWrong[1], shuffledWrong[2]].sort(() => Math.random() - 0.5);

    list.push({
      category: "Deportes",
      difficulty: item.d,
      question_text: `¿Qué selección nacional ganó la Copa Mundial de la FIFA celebrada en el año ${item.a}?`,
      options: options,
      correct_answer: item.c,
      has_options: true
    });

    // Tipo 2: Año del mundial ganado
    const allYears = DEPORTES_MUNDIALES.map(x => x.a);
    const wrongYears = allYears.filter(a => a !== item.a);
    const shuffledWrongYears = wrongYears.sort(() => Math.random() - 0.5);
    const optionsYear = [item.a, shuffledWrongYears[0], shuffledWrongYears[1], shuffledWrongYears[2]].sort(() => Math.random() - 0.5);

    list.push({
      category: "Deportes",
      difficulty: item.d === 'easy' ? 'medium' : 'hard',
      question_text: `¿En qué año se coronó campeón mundial de fútbol la selección de ${item.c}?`,
      options: optionsYear,
      correct_answer: item.a,
      has_options: true
    });
  });

  // --- SET H: Preguntas Generales e históricas sin opciones (para el modo difícil sin opciones) ---
  const generalOpenQuestions = [
    { cat: "Geografía", q: "¿Cuál es el río más largo del continente sudamericano?", a: "Río Amazonas", d: "hard" },
    { cat: "Geografía", q: "¿Cuál es la cordillera más larga del planeta Tierra?", a: "Cordillera de los Andes", d: "hard" },
    { cat: "Geografía", q: "¿Cuál es el desierto cálido más grande del mundo?", a: "Desierto del Sahara", d: "hard" },
    { cat: "Historia", q: "¿Cómo se llamaba el primer emperador del Imperio Romano?", a: "César Augusto", d: "hard" },
    { cat: "Historia", q: "¿Qué revolución iniciada en 1789 dio fin a la monarquía absoluta en Francia?", a: "Revolución Francesa", d: "hard" },
    { cat: "Historia", q: "¿Qué país fue liderado por Adolf Hitler durante la Segunda Guerra Mundial?", a: "Alemania", d: "hard" },
    { cat: "Ciencia", q: "¿Cuál es el único mamífero capaz de volar activamente de forma natural?", a: "Murciélago", d: "hard" },
    { cat: "Ciencia", q: "¿Qué fuerza física atrae los cuerpos hacia el centro de la Tierra?", a: "Gravedad", d: "hard" },
    { cat: "Ciencia", q: "¿Cuál es la fórmula química elemental del agua?", a: "H2O", d: "hard" },
    { cat: "Deportes", q: "¿Qué deporte se practica en la NBA?", a: "Baloncesto", d: "hard" },
    { cat: "Deportes", q: "¿Cuál es el estilo de natación más rápido de todos?", a: "Crol", d: "hard" },
    { cat: "Deportes", q: "¿En qué deporte de raqueta se compite en el torneo de Wimbledon?", a: "Tenis", d: "hard" },
    { cat: "Entretenimiento", q: "¿Qué plataforma de streaming produjo la serie 'Stranger Things'?", a: "Netflix", d: "hard" },
    { cat: "Entretenimiento", q: "¿Cuál es el primer largometraje animado de Walt Disney estrenado en 1937?", a: "Blancanieves", d: "hard" },
    { cat: "Entretenimiento", q: "¿Cómo se llama el reino ficticio donde transcurre 'El Rey León'?", a: "Tierras del Orgullo", d: "hard" },
    { cat: "Arte y Literatura", q: "¿Qué dramaturgo inglés escribió 'Hamlet' y 'Macbeth'?", a: "William Shakespeare", d: "hard" },
    { cat: "Arte y Literatura", q: "¿Qué pintor expresionista holandés pintó 'La noche estrellada'?", a: "Vincent van Gogh", d: "hard" },
    { cat: "Arte y Literatura", q: "¿Qué poeta florentino escribió la monumental obra medieval 'La Divina Comedia'?", a: "Dante Alighieri", d: "hard" }
  ];

  generalOpenQuestions.forEach((item) => {
    list.push({
      category: item.cat,
      difficulty: item.d,
      question_text: item.q,
      options: [], // Empty options for open hard mode!
      correct_answer: item.a,
      has_options: false
    });
  });

  return list;
}

// 4. Ejecutar el sembrado en lotes (batching) para optimizar carga en Supabase
async function runSeeder() {
  console.log("Generando base de datos de preguntas programáticamente...");
  const questionsToSeed = generateQuestions();
  console.log(`¡Generación exitosa! Se cargaron ${questionsToSeed.length} preguntas en memoria.`);

  console.log("Limpiando registros antiguos de la tabla 'questions' en Supabase...");
  // Opcional: Borrar preguntas existentes para evitar duplicación al correr varias veces
  const { error: deleteError } = await supabase
    .from('questions')
    .delete()
    .neq('category', 'unknown'); // Elimina todo

  if (deleteError) {
    console.warn("Advertencia al limpiar la tabla (puede estar vacía):", deleteError.message);
  }

  console.log("Insertando preguntas en lotes de 50...");
  const batchSize = 50;
  let successCount = 0;

  for (let i = 0; i < questionsToSeed.length; i += batchSize) {
    const batch = questionsToSeed.slice(i, i + batchSize);
    const { error } = await supabase.from('questions').insert(batch);

    if (error) {
      console.error(`Error insertando lote ${i / batchSize + 1}:`, error.message);
    } else {
      successCount += batch.length;
      console.log(`Lote ${i / batchSize + 1} completado. (${successCount}/${questionsToSeed.length} preguntas subidas)`);
    }
  }

  console.log(`\n¡PROCESO FINALIZADO! Se subieron exitosamente ${successCount} preguntas a Supabase.`);
  process.exit(0);
}

runSeeder();

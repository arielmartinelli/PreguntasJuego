// Banco de preguntas mock para desarrollo local
// Categorías: Geografía, Historia, Ciencia, Arte y Literatura, Deportes, Entretenimiento
// Dificultades: easy (Fácil), medium (Normal), hard (Difícil)

export const mockQuestions = [
  // --- FÁCIL (easy) ---
  {
    id: "f1",
    category: "Geografía",
    difficulty: "easy",
    question_text: "¿Cuál es el océano más grande del mundo?",
    options: ["Océano Pacífico", "Océano Atlántico", "Océano Índico", "Océano Ártico"],
    correct_answer: "Océano Pacífico"
  },
  {
    id: "f2",
    category: "Historia",
    difficulty: "easy",
    question_text: "¿Quién fue el primer presidente de Estados Unidos?",
    options: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "Franklin D. Roosevelt"],
    correct_answer: "George Washington"
  },
  {
    id: "f3",
    category: "Ciencia",
    difficulty: "easy",
    question_text: "¿Cuál es el planeta más cercano al Sol?",
    options: ["Mercurio", "Venus", "Tierra", "Marte"],
    correct_answer: "Mercurio"
  },
  {
    id: "f4",
    category: "Arte y Literatura",
    difficulty: "easy",
    question_text: "¿Quién pintó la famosa 'Mona Lisa'?",
    options: ["Leonardo da Vinci", "Miguel Ángel", "Pablo Picasso", "Vincent van Gogh"],
    correct_answer: "Leonardo da Vinci"
  },
  {
    id: "f5",
    category: "Deportes",
    difficulty: "easy",
    question_text: "¿Cuántos jugadores de fútbol de un equipo juegan en el campo a la vez?",
    options: ["11 jugadores", "10 jugadores", "9 jugadores", "12 jugadores"],
    correct_answer: "11 jugadores"
  },
  {
    id: "f6",
    category: "Entretenimiento",
    difficulty: "easy",
    question_text: "¿Cuál es el nombre del ratón más famoso de Disney?",
    options: ["Mickey Mouse", "Donald Duck", "Bugs Bunny", "Jerry"],
    correct_answer: "Mickey Mouse"
  },

  // --- NORMAL (medium) ---
  {
    id: "n1",
    category: "Geografía",
    difficulty: "medium",
    question_text: "¿Cuál es el río más largo del mundo?",
    options: ["Río Amazonas", "Río Nilo", "Río Misisipi", "Río Yangtsé"],
    correct_answer: "Río Amazonas"
  },
  {
    id: "n2",
    category: "Historia",
    difficulty: "medium",
    question_text: "¿En qué año comenzó la Segunda Guerra Mundial?",
    options: ["1939", "1914", "1945", "1929"],
    correct_answer: "1939"
  },
  {
    id: "n3",
    category: "Ciencia",
    difficulty: "medium",
    question_text: "¿Qué gas representa la mayor parte de la atmósfera de la Tierra?",
    options: ["Nitrógeno", "Oxígeno", "Dióxido de Carbono", "Argón"],
    correct_answer: "Nitrógeno"
  },
  {
    id: "n4",
    category: "Arte y Literatura",
    difficulty: "medium",
    question_text: "¿Quién escribió la obra trágica 'Romeo y Julieta'?",
    options: ["William Shakespeare", "Miguel de Cervantes", "Edgar Allan Poe", "Oscar Wilde"],
    correct_answer: "William Shakespeare"
  },
  {
    id: "n5",
    category: "Deportes",
    difficulty: "medium",
    question_text: "¿Cada cuántos años se celebran los Juegos Olímpicos?",
    options: ["Cada 4 años", "Cada 2 años", "Cada 5 años", "Cada 3 años"],
    correct_answer: "Cada 4 años"
  },
  {
    id: "n6",
    category: "Entretenimiento",
    difficulty: "medium",
    question_text: "¿Qué película de 1997 dirigida por James Cameron ganó 11 premios Óscar?",
    options: ["Titanic", "Avatar", "Terminator 2", "El Padrino"],
    correct_answer: "Titanic"
  },

  // --- DIFÍCIL (hard) ---
  {
    id: "d1",
    category: "Geografía",
    difficulty: "hard",
    question_text: "¿Cuál es el país más pequeño del mundo por superficie?",
    options: ["Ciudad del Vaticano", "Mónaco", "Nauru", "San Marino"],
    correct_answer: "Ciudad del Vaticano"
  },
  {
    id: "d2",
    category: "Historia",
    difficulty: "hard",
    question_text: "¿Qué imperio gobernaba Justiniano I el Grande?",
    options: ["Imperio Bizantino", "Imperio Romano", "Imperio Otomano", "Sacro Imperio Romano Germánico"],
    correct_answer: "Imperio Bizantino"
  },
  {
    id: "d3",
    category: "Ciencia",
    difficulty: "hard",
    question_text: "¿Cuál es la velocidad de la luz en el vacío aproximadamente?",
    options: ["300.000 km/s", "150.000 km/s", "500.000 km/s", "1.000.000 km/s"],
    correct_answer: "300.000 km/s"
  },
  {
    id: "d4",
    category: "Arte y Literatura",
    difficulty: "hard",
    question_text: "¿Cómo se llama el hidalgo protagonista de la mayor novela de Miguel de Cervantes?",
    options: ["Don Quijote de la Mancha", "Sancho Panza", "El Lazarillo de Tormes", "Rocinante"],
    correct_answer: "Don Quijote de la Mancha"
  },
  {
    id: "d5",
    category: "Deportes",
    difficulty: "hard",
    question_text: "¿Qué tenista masculino ostenta el récord de más títulos de Roland Garros?",
    options: ["Rafael Nadal", "Roger Federer", "Novak Djokovic", "Pete Sampras"],
    correct_answer: "Rafael Nadal"
  },
  {
    id: "d6",
    category: "Entretenimiento",
    difficulty: "hard",
    question_text: "¿Quién dirigió la trilogía de películas de 'El Señor de los Anillos'?",
    options: ["Peter Jackson", "Steven Spielberg", "Christopher Nolan", "George Lucas"],
    correct_answer: "Peter Jackson"
  },
  {
    id: "d7",
    category: "Ciencia",
    difficulty: "hard",
    question_text: "¿Cuál es el elemento químico con el símbolo 'Au' en la tabla periódica?",
    options: ["Oro", "Plata", "Cobre", "Aluminio"],
    correct_answer: "Oro"
  },
  {
    id: "d8",
    category: "Geografía",
    difficulty: "hard",
    question_text: "¿Cuál es la capital de Australia?",
    options: ["Canberra", "Sídney", "Melbourne", "Brisbane"],
    correct_answer: "Canberra"
  }
];

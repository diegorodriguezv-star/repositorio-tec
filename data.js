// Datos de ejemplo del repositorio (simulan lo que vendría de una base de datos real)
// Cada recurso sigue los campos de Dublin Core que se documentan en el trabajo escrito.

const COLLECTIONS = [
  { id: "electronica", name: "Electrónica básica", icon: "chip" },
  { id: "tinkercad", name: "Tinkercad circuitos", icon: "circuit" },
  { id: "scratch", name: "Scratch", icon: "puzzle" },
  { id: "codeorg", name: "Code.org", icon: "code" },
];

const SEED_RESOURCES = [
  {
    id: "r1",
    title: "Circuito LED con pulsador",
    description:
      "Simulación interactiva para introducir el concepto de resistencia en un circuito serie usando un LED, una resistencia y un pulsador.",
    collection: "tinkercad",
    grade: "9°",
    type: "Simulación",
    format: "Tinkercad",
    creator: "Diego Rodríguez",
    license: "CC BY-NC",
    link: "https://www.tinkercad.com/",
    status: "publicado",
  },
  {
    id: "r2",
    title: "Ley de Ohm interactiva",
    description:
      "Circuito simulado que permite variar voltaje y resistencia para observar el cambio en la corriente en tiempo real.",
    collection: "tinkercad",
    grade: "8°",
    type: "Simulación",
    format: "Tinkercad",
    creator: "Diego Rodríguez",
    license: "CC BY-NC",
    link: "https://www.educaplus.org/game/ley-de-ohm",
    status: "publicado",
  },
  {
    id: "r3",
    title: "Semáforo con Arduino simulado",
    description:
      "Proyecto integrador que combina lógica de programación y circuitos para controlar tres LEDs como un semáforo real.",
    collection: "tinkercad",
    grade: "9°",
    type: "Proyecto",
    format: "Tinkercad",
    creator: "Diego Rodríguez",
    license: "CC BY-NC",
    link: "https://www.tinkercad.com/",
    status: "publicado",
  },
  {
    id: "r4",
    title: "Reto de laberinto",
    description:
      "Secuencia de bloques para guiar un personaje a través de un laberinto, introduciendo condicionales y ciclos.",
    collection: "scratch",
    grade: "6°",
    type: "Proyecto",
    format: "Scratch",
    creator: "Diego Rodríguez",
    license: "CC BY-NC",
    link: "https://scratch.mit.edu/",
    status: "publicado",
  },
  {
    id: "r5",
    title: "Historia interactiva: el circuito eléctrico",
    description:
      "Narrativa animada que explica de forma sencilla cómo fluye la corriente eléctrica en un circuito cerrado.",
    collection: "scratch",
    grade: "7°",
    type: "Video",
    format: "Scratch",
    creator: "Diego Rodríguez",
    license: "CC BY-NC",
    link: "https://scratch.mit.edu/",
    status: "publicado",
  },
  {
    id: "r6",
    title: "Curso: ciclos y condicionales",
    description:
      "Módulo de Code.org enfocado en pensamiento computacional a través de retos progresivos de dificultad.",
    collection: "codeorg",
    grade: "7°",
    type: "Guía",
    format: "Code.org",
    creator: "Diego Rodríguez",
    license: "CC BY-NC",
    link: "https://code.org/",
    status: "publicado",
  },
  {
    id: "r7",
    title: "Introducción a sensores",
    description:
      "Guía en PDF sobre tipos de sensores usados en proyectos escolares de robótica educativa y sus aplicaciones.",
    collection: "electronica",
    grade: "10°",
    type: "Guía",
    format: "PDF",
    creator: "Diego Rodríguez",
    license: "CC BY-NC",
    link: "#",
    status: "publicado",
  },
];


import { Exercise } from '@/types/reformer';

export const exerciseDatabase: Exercise[] = [
  {
    id: "1",
    name: "Footwork - Parallel",
    category: "supine",
    duration: 3,
    springs: "heavy",
    difficulty: "beginner",
    muscleGroups: ["legs", "core"],
    equipment: ["none"],
    description: "Basic footwork in parallel position to strengthen legs and establish proper alignment.",
    cues: [
      "Keep feet parallel and hip-width apart",
      "Press out with control, return with resistance",
      "Maintain neutral pelvis throughout",
      "Keep knees tracking over toes"
    ],
    isPregnancySafe: true,
    image: "/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png"
  },
  {
    id: "2", 
    name: "Hundred",
    category: "supine",
    duration: 2,
    springs: "light",
    difficulty: "intermediate",
    muscleGroups: ["core", "arms"],
    equipment: ["straps"],
    description: "Classic Pilates exercise focusing on breathing coordination and core stability.",
    cues: [
      "Pump arms vigorously in small controlled movements",
      "Breathe in for 5 counts, out for 5 counts",
      "Keep shoulders away from ears",
      "Maintain strong core connection"
    ],
    isPregnancySafe: false,
    image: "/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png"
  },
  {
    id: "3",
    name: "Short Box - Round Back",
    category: "sitting",
    duration: 4,
    springs: "medium",
    difficulty: "intermediate", 
    muscleGroups: ["core", "back"],
    equipment: ["none"],
    description: "Spinal articulation exercise performed sitting on the short box.",
    cues: [
      "Sit tall with feet secured",
      "Round spine one vertebra at a time",
      "Use deep abdominals to return to sitting",
      "Keep shoulders over hips"
    ],
    isPregnancySafe: true,
    image: "/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png"
  },
  {
    id: "4",
    name: "Long Stretch",
    category: "prone",
    duration: 3,
    springs: "medium",
    difficulty: "advanced",
    muscleGroups: ["core", "arms", "shoulders"],
    equipment: ["none"],
    description: "Advanced exercise challenging full body integration and control.",
    cues: [
      "Maintain plank position throughout",
      "Press carriage out with control",
      "Use deep core to return carriage",
      "Keep shoulders stable and strong"
    ],
    isPregnancySafe: false,
    image: "/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png"
  },
  {
    id: "5",
    name: "Arms in Straps - Chest Expansion",
    category: "sitting",
    duration: 3,
    springs: "light",
    difficulty: "beginner",
    muscleGroups: ["arms", "back", "shoulders"],
    equipment: ["straps"],
    description: "Upper body strengthening with focus on posture and shoulder blade stability.",
    cues: [
      "Sit tall with arms reaching long",
      "Pull straps back engaging back muscles",
      "Keep chest open and shoulders down",
      "Return with control maintaining posture"
    ],
    isPregnancySafe: true,
    image: "/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png"
  },
  {
    id: "6",
    name: "Side Splits",
    category: "standing",
    duration: 4,
    springs: "heavy",
    difficulty: "intermediate",
    muscleGroups: ["legs", "glutes", "core"],
    equipment: ["none"],
    description: "Standing exercise targeting inner thighs and hip stability.",
    cues: [
      "Stand with one foot on carriage, one on platform",
      "Keep standing leg strong and stable", 
      "Control the carriage with inner thigh engagement",
      "Maintain upright posture throughout"
    ],
    isPregnancySafe: false,
    image: "/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png"
  },
  {
    id: "7",
    name: "Arm Circles",
    category: "supine",
    duration: 2,
    springs: "light",
    difficulty: "beginner",
    muscleGroups: ["arms", "shoulders"],
    equipment: ["straps"],
    description: "Gentle shoulder mobility and strengthening exercise.",
    cues: [
      "Keep arms long and reaching",
      "Circle arms smoothly in both directions",
      "Maintain stable core throughout",
      "Keep shoulders away from ears"
    ],
    isPregnancySafe: true,
    image: "/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png"
  },
  {
    id: "8",
    name: "Coordination",
    category: "supine", 
    duration: 3,
    springs: "light",
    difficulty: "advanced",
    muscleGroups: ["core", "arms", "legs"],
    equipment: ["straps"],
    description: "Complex coordination exercise challenging full body control.",
    cues: [
      "Coordinate arm and leg movements precisely",
      "Maintain table top leg position", 
      "Keep deep core connection throughout",
      "Move with control and precision"
    ],
    isPregnancySafe: false,
    image: "/lovable-uploads/58262717-b6a8-4556-9428-71532ab70286.png"
  }
];

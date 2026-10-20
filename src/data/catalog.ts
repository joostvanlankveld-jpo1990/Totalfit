// Voorbeelddata. Lessen, prijzen en abonnementen zijn placeholders:
// pas ze hier aan of vervang ze door data uit de backend (zie src/data/api.ts).
import { ClassType, MembershipPlan, Product } from './types';

export const GYM = {
  name: 'Total Fit Vlijmen',
  address: 'Vlijmen',
  phone: '',
  email: '',
  website: 'https://totalfitvlijmen.opencontrolplus.com',
  cancelHoursBefore: 2,
};

export const CLASS_TYPES: ClassType[] = [
  {
    id: 'spinning',
    name: 'Spinning',
    category: 'cardio',
    description:
      'Een gezamenlijke training op een speciale spinningfiets. Een sessie duurt 45 minuten, wordt begeleid door een instructeur en ondersteund door muziek.',
    intensity: 3,
    durationMin: 45,
    color: '#7C3AED',
  },
  {
    id: 'vitaalfit',
    name: 'VitaalFit 60+',
    category: 'senioren',
    description:
      'Rustige, veilige groepsles voor 60-plussers. Werken aan balans, kracht en mobiliteit in een gezellige sfeer.',
    intensity: 1,
    durationMin: 50,
    color: '#0EA5E9',
  },
  {
    id: 'bodyshape',
    name: 'BodyShape',
    category: 'kracht',
    description:
      'Krachttraining met halters, elastieken en eigen lichaamsgewicht. Ideaal om sterker en strakker te worden.',
    intensity: 2,
    durationMin: 50,
    color: '#DC2626',
  },
  {
    id: 'bootcamp',
    name: 'Bootcamp',
    category: 'cardio',
    description:
      'Intensieve circuittraining binnen en buiten. Je werkt aan conditie, kracht en doorzettingsvermogen.',
    intensity: 3,
    durationMin: 60,
    color: '#EA580C',
  },
  {
    id: 'yoga',
    name: 'Yoga',
    category: 'mind-body',
    description:
      'Flowende yogales voor flexibiliteit, ademhaling en ontspanning. Geschikt voor alle niveaus.',
    intensity: 1,
    durationMin: 60,
    color: '#16A34A',
  },
  {
    id: 'pilates',
    name: 'Pilates',
    category: 'mind-body',
    description:
      'Versterk je core en verbeter je houding met gecontroleerde bewegingen op de mat.',
    intensity: 2,
    durationMin: 50,
    color: '#DB2777',
  },
  {
    id: 'zumba',
    name: 'Zumba',
    category: 'dans',
    description: 'Dansen op Latijns-Amerikaanse muziek. Vet verbranden zonder dat het voelt als sporten!',
    intensity: 2,
    durationMin: 50,
    color: '#CA8A04',
  },
  {
    id: 'hiit',
    name: 'HIIT',
    category: 'cardio',
    description: 'Korte, explosieve intervallen met korte rust. In 30 minuten maximaal resultaat.',
    intensity: 3,
    durationMin: 30,
    color: '#1B2A7B',
  },
];

/** Weekrooster: dag 0 = zondag ... 6 = zaterdag. */
export const WEEKLY_SCHEDULE: {
  day: number;
  time: string;
  classTypeId: string;
  room: string;
  instructor: string;
  capacity: number;
}[] = [
  { day: 1, time: '09:00', classTypeId: 'vitaalfit', room: 'Zaal beneden', instructor: 'Marja', capacity: 15 },
  { day: 1, time: '19:00', classTypeId: 'spinning', room: 'Spinningzaal', instructor: 'Imke Vullinghs', capacity: 20 },
  { day: 1, time: '20:00', classTypeId: 'bodyshape', room: 'Zaal boven', instructor: 'Kevin', capacity: 18 },
  { day: 2, time: '09:00', classTypeId: 'spinning', room: 'Spinningzaal', instructor: 'Imke Vullinghs', capacity: 20 },
  { day: 2, time: '10:00', classTypeId: 'vitaalfit', room: 'Zaal beneden', instructor: 'Marja', capacity: 15 },
  { day: 2, time: '19:30', classTypeId: 'zumba', room: 'Zaal boven', instructor: 'Sanne', capacity: 25 },
  { day: 3, time: '07:00', classTypeId: 'hiit', room: 'Zaal boven', instructor: 'Kevin', capacity: 16 },
  { day: 3, time: '18:30', classTypeId: 'pilates', room: 'Zaal beneden', instructor: 'Lotte', capacity: 15 },
  { day: 3, time: '19:30', classTypeId: 'spinning', room: 'Spinningzaal', instructor: 'Imke Vullinghs', capacity: 20 },
  { day: 4, time: '09:00', classTypeId: 'yoga', room: 'Zaal beneden', instructor: 'Lotte', capacity: 15 },
  { day: 4, time: '19:00', classTypeId: 'bootcamp', room: 'Buiten / Zaal boven', instructor: 'Kevin', capacity: 20 },
  { day: 4, time: '20:15', classTypeId: 'bodyshape', room: 'Zaal boven', instructor: 'Sanne', capacity: 18 },
  { day: 5, time: '09:30', classTypeId: 'vitaalfit', room: 'Zaal beneden', instructor: 'Marja', capacity: 15 },
  { day: 5, time: '18:00', classTypeId: 'spinning', room: 'Spinningzaal', instructor: 'Imke Vullinghs', capacity: 20 },
  { day: 6, time: '09:00', classTypeId: 'bootcamp', room: 'Buiten / Zaal boven', instructor: 'Kevin', capacity: 20 },
  { day: 6, time: '10:30', classTypeId: 'yoga', room: 'Zaal beneden', instructor: 'Lotte', capacity: 15 },
  { day: 0, time: '10:00', classTypeId: 'spinning', room: 'Spinningzaal', instructor: 'Imke Vullinghs', capacity: 20 },
];

export const PRODUCTS: Product[] = [
  {
    id: 'smartrope-rookie',
    name: 'Smartrope Rookie',
    category: 'materiaal',
    priceCents: 4990,
    emoji: '🪢',
    inStock: true,
    description:
      'Snel, leuk en effectief. Slim springtouw dat je sprongen telt en via de app je voortgang bijhoudt. Wil jij fit worden, afvallen of werken aan je conditie? Begin vandaag.',
  },
  {
    id: 'sporthanddoek',
    name: 'Sporthanddoek Total Fit',
    category: 'kleding',
    priceCents: 1495,
    emoji: '🧺',
    inStock: true,
    description: 'Sneldrogende microvezel handdoek met Total Fit logo. Verplicht in de fitnesszaal.',
  },
  {
    id: 'bidon',
    name: 'Bidon 750 ml',
    category: 'materiaal',
    priceCents: 995,
    emoji: '🥤',
    inStock: true,
    description: 'BPA-vrije bidon met Total Fit logo. Vaatwasserbestendig.',
  },
  {
    id: 'shirt',
    name: 'Total Fit sportshirt',
    category: 'kleding',
    priceCents: 2495,
    emoji: '👕',
    inStock: true,
    description: 'Ademend dry-fit sportshirt in limoengroen. Verkrijgbaar in S t/m XXL (maat kies je bij de balie).',
  },
  {
    id: 'proteine',
    name: 'Proteïneshake (10 stuks)',
    category: 'voeding',
    priceCents: 2250,
    emoji: '🥛',
    inStock: true,
    description: 'Tienrittenkaart voor een proteïneshake na je training aan de bar.',
  },
  {
    id: 'rittenkaart-10',
    name: '10-rittenkaart groepslessen',
    category: 'tegoed',
    priceCents: 8500,
    emoji: '🎟️',
    inStock: true,
    description: 'Ideaal als je (nog) geen abonnement hebt: 10 groepslessen naar keuze, 6 maanden geldig.',
  },
  {
    id: 'weerstandsbanden',
    name: 'Set weerstandsbanden',
    category: 'materiaal',
    priceCents: 1995,
    emoji: '🎗️',
    inStock: false,
    description: 'Set van 5 banden met oplopende weerstand. Perfect voor thuis.',
  },
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'flex',
    name: 'Flex',
    monthlyCents: 2995,
    signupFeeCents: 1995,
    perks: ['Onbeperkt fitness', '2 groepslessen per week', 'Maandelijks opzegbaar'],
  },
  {
    id: 'all-in',
    name: 'All-in',
    monthlyCents: 3995,
    signupFeeCents: 1995,
    perks: ['Onbeperkt fitness', 'Onbeperkt groepslessen', 'Gratis intake & trainingsschema', 'Maandelijks opzegbaar'],
    highlight: true,
  },
  {
    id: 'vitaal',
    name: 'VitaalFit 60+',
    monthlyCents: 2495,
    signupFeeCents: 0,
    perks: ['Fitness overdag (tot 16:00)', 'Onbeperkt VitaalFit lessen', 'Geen inschrijfkosten'],
  },
];

export const classTypeById = (id: string) => CLASS_TYPES.find((c) => c.id === id)!;
export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);
export const planById = (id: string) => MEMBERSHIP_PLANS.find((p) => p.id === id);

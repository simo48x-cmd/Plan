export type PodcastLevel = 'A1' | 'A2' | 'B1' | 'B2';

export interface RankInfo {
  id: number;
  titleAr: string;
  titleDe: string;
  minDay: number;
  maxDay: number;
  minXp: number;
  badgeText: string;
  description: string;
}

export interface DailyMissionDetails {
  day: number;
  phaseNumber: 1 | 2 | 3 | 4;
  phaseTitle: string;
  phaseSubtitle: string;
  rank: RankInfo;
  muendlichMorning: {
    title: string;
    topicDe: string;
    details: string;
    redemittelFocus: string;
  };
  lesenTarget: {
    title: string;
    examPackageDe: string;
    details: string;
    modeFlags: string[];
  };
  hoerenSchreibenTarget: {
    title: string;
    hoerenFocusDe: string;
    schreibenFocusDe: string;
    details: string;
  };
  muendlichEvening: {
    title: string;
    simulationDe: string;
    details: string;
  };
  immersionTarget: {
    recommendedPodcastLevel: PodcastLevel;
    podcastShowDe: string;
    seriesTitleDe: string;
    details: string;
  };
  quickTip: {
    category: string;
    germanPhrase: string;
    arabicExplanation: string;
    commonMistakeWarning: string;
  };
}

export interface SelfEvalScores {
  fluency: number; // 1..5: الطلاقة وعدم التوقف
  connectors: number; // 1..5: استعمال روابط B2
  pronunciation: number; // 1..5: وضوح النطق
  timeRespect: number; // 1..5: احترام الوقت
}

export interface VoiceRecordingMeta {
  id: string;
  day: number;
  timestamp: string;
  durationSec: number;
  taskLabel: string;
  scores: SelfEvalScores;
}

export interface DayProgressState {
  completedTasks: Record<string, boolean>;
  ankiNewCards: number;
  podcastLevel: PodcastLevel;
  waterGlasses: number; // 0..8
  notes: string;
  selfEval: SelfEvalScores;
}

export interface BootcampStoreState {
  selectedDay: number;
  days: Record<number, DayProgressState>;
  recordings: VoiceRecordingMeta[];
  pomodoroSessionsCompleted: number;
}

export interface ChecklistTaskDef {
  id: string;
  section: 'core' | 'immersion' | 'life';
  timeSlot?: string;
  title: string;
  subtitle: string;
  xp: number;
  studyHours: number;
  externalLinks?: { label: string; url: string }[];
  hasVoiceRecorder?: boolean;
  hasExaminerGenerator?: boolean;
  hasAnkiCounter?: boolean;
  hasPodcastSelector?: boolean;
  hasWaterTracker?: boolean;
}

export const FOUR_PLATFORMS = [
  {
    id: 'lesen',
    nameAr: 'موقع Lesen & Prüfungen',
    nameDe: 'Lesen & Sprachbausteine (34 Prüfungen)',
    description: 'جميع امتحانات القراءة والـ 210 نصوص مع ميزة التخربق والمعدل 1 و 2',
    url: 'https://telclesen1.vercel.app/',
    tag: 'Lesen & Prüfungen',
  },
  {
    id: 'hoeren',
    nameAr: 'موقع Hören',
    nameDe: 'Hören Code-Familien & 154 Themen',
    description: 'عائلات الكودات الـ 11 وقاعدة الـ 15 ثانية وجميع مواضيع الاستماع',
    url: 'https://telchr.vercel.app/',
    tag: 'Hören Radar',
  },
  {
    id: 'schreiben',
    nameAr: 'موقع Schreiben',
    nameDe: 'Beschwerde & Bitte um Information',
    description: 'قوالب الرسائل الرسمية الجاهزة، الروابط الذهبية، وتصحيح الأخطاء الشائعة',
    url: 'https://telchr.vercel.app/#schreiben',
    tag: 'Schreiben B2',
  },
  {
    id: 'sprechen',
    nameAr: 'موقع Sprechen',
    nameDe: 'Mündlich Teil 1, Teil 2 & Teil 3',
    description: 'العروض السبعة، مواضيع المناقشة الـ 20، وسيناريوهات التخطيط المشترك الـ 25',
    url: 'https://telclesen1.vercel.app/#sprechen',
    tag: 'Mündlich Pro',
  },
] as const;

export const RANKS: RankInfo[] = [
  {
    id: 1,
    titleAr: 'الرتبة 1: منطلق بقوة',
    titleDe: 'A1/A2 Starter',
    minDay: 1,
    maxDay: 7,
    minXp: 0,
    badgeText: 'المستوى التأسيسي الأول',
    description: 'بناء العادة اليومية، كسر حاجز الخوف الصوتي، وحفظ العروض السبعة الأساسية.',
  },
  {
    id: 2,
    titleAr: 'الرتبة 2: مقاتل الكلمات المفتاحية',
    titleDe: 'Mot-Clé Hunter',
    minDay: 8,
    maxDay: 15,
    minXp: 8500,
    badgeText: 'صياد المفاتيح الدلالية',
    description: 'إتقان عائلات الكودات الـ 11 في الاستماع وحل الحزم الأولى من امتحانات القراءة.',
  },
  {
    id: 3,
    titleAr: 'الرتبة 3: متحدث واثق',
    titleDe: 'Mündlich Challenger',
    minDay: 16,
    maxDay: 25,
    minXp: 20000,
    badgeText: 'مناظر المرحلة الثانية',
    description: 'تلخيص المقالات في 3 جمل وتقديم الحجج المؤيدة والمعارضة بطلاقة.',
  },
  {
    id: 4,
    titleAr: 'الرتبة 4: قناص الكودات',
    titleDe: 'Code Radar Master',
    minDay: 26,
    maxDay: 35,
    minXp: 35000,
    badgeText: 'رادار الاستماع والقراءة',
    description: 'التقاط الإجابات الصحيحة في أقل من 3 ثوانٍ وتطبيق قاعدة الـ 15 بمهارة.',
  },
  {
    id: 5,
    titleAr: 'الرتبة 5: محاور بارع',
    titleDe: 'Diskussion Pro B2',
    minDay: 36,
    maxDay: 45,
    minXp: 52000,
    badgeText: 'خبير التفاوض والتخطيط',
    description: 'إدارة حوارات التخطيط المشترك (Teil 3) والرد التلقائي السريع بدون ورق.',
  },
  {
    id: 6,
    titleAr: 'الرتبة 6: بطل المحاكاة الكاملة',
    titleDe: 'Prüfung Gladiator',
    minDay: 46,
    maxDay: 55,
    minXp: 72000,
    badgeText: 'مقاتل الامتحان الشامل',
    description: 'خوض محاكاة امتحانية كاملة يومياً تحت ضغط الوقت الحقيقي وتصفير بنك الأخطاء.',
  },
  {
    id: 7,
    titleAr: 'الرتبة 7: أسطورة TELC B2 — جاهزية 200%',
    titleDe: 'B2 Legend',
    minDay: 56,
    maxDay: 60,
    minXp: 90000,
    badgeText: 'القمة النهائية 200%',
    description: 'ثقة مطلقة في الشفوي والكتابي واستعداد كامل ليوم الامتحان الرسمي.',
  },
];

const TEIL_1_TOPICS = [
  { de: '1. Ein Buch, das ich gelesen habe', ar: 'كتاب قرأته وأثر في تفكيري' },
  { de: '2. Ein Film, den ich gesehen habe', ar: 'فيلم شاهدته وأنصح به' },
  { de: '3. Eine Reise, die ich gemacht habe', ar: 'رحلة قمت بها ولا تنسى' },
  { de: '4. Eine wichtige persönliche Erfahrung', ar: 'تجربة شخصية مهمة غيرت مساري' },
  { de: '5. Eine wichtige Person in meinem Leben', ar: 'شخصية مهمة في حياتي وقدوتي' },
  { de: '6. Ein besonderes Sportereignis', ar: 'حدث رياضي مميز تابعته أو شاركت فيه' },
  { de: '7. Eine Stadt, die mir besonders gefällt', ar: 'مدينة تعجبني كثيراً وتاريخها' },
];

const TEIL_2_DEBATE_TOPICS = [
  'Homeoffice vs. Büroarbeit (العمل من المنزل مقابل المكتب)',
  'Soziale Medien: Fluch oder Segen? (وسائل التواصل الاجتماعي: نعمة أم نقمة؟)',
  'lebenslanges Lernen im Beruf (التعلم المستمر طوال الحياة المهنية)',
  'Autofreie Innenstädte (مراكز المدن الخالية من السيارات)',
  'Fertiggerichte vs. frisch kochen (الوجبات السريعة مقابل الطبخ المنزلي)',
  'Extremsportarten und Risiko (الرياضات الخطرة والمغامرة)',
  'Künstliche Intelligenz im Alltag (الذكاء الاصطناعي في الحياة اليومية)',
  'Ehrenamtliche Arbeit für Jugendliche (العمل التطوعي للشباب)',
  'Konsumgesellschaft und Werbung (مجتمع الاستهلاك وتأثير الإعلانات)',
  'Fremdsprachenlernen im Kindergarten (تعلم اللغات الأجنبية منذ الصغر)',
  'Bargeld abschaffen oder behalten? (إلغاء الدفع النقدي أم الحفاظ عليه؟)',
  'Schönheitsoperationen bei jungen Menschen (عمليات التجميل لدى الشباب)',
  'Umweltschutz im Alltag (حماية البيئة في الممارسات اليومية)',
  'Digitalisierung in der Schule (الرقمنة والأجهزة اللوحية في المدارس)',
  'Work-Life-Balance und Viertagewoche (التوازن المهني وأسبوع العمل من 4 أيام)',
];

const TEIL_3_PLANNING_SCENARIOS = [
  'Abschiedsparty für einen Kollegen organisieren (تنظيم حفل وداع لزميل في العمل)',
  'Gesundheitstag in der Firma planen (التخطيط ليوم صحي داخل الشركة)',
  'Wochenendausflug mit dem Sprachkurs (تنظيم رحلة نهاية أسبوع مع زملاء القسم)',
  'Kranken Kollegen im Krankenhaus besuchen (زيارة زميل مريض في المستشفى واختيار هدية)',
  'Nachbarschaftsfest im Sommer vorbereiten (التحضير لمهرجان الحي في الصيف)',
  'Flohmarkt für einen guten Zweck organisieren (تنظيم سوق خيري لجمع التبرعات)',
  'Willkommensfest für neue Mitarbeiter (حفل ترحيب بالموظفين الجدد)',
  'Sportturnier am Wochenende planen (التخطيط لبطولة رياضية في عطلة نهاية الأسبوع)',
  'Gemeinsamen Kochabend organisieren (تنظيم أمسية طبخ مشترك متعددة الثقافات)',
  'Umzug eines Freundes unterstützen (مساعدة صديق في الانتقال إلى شقة جديدة)',
  'Informationsabend zum Thema Umweltschutz (أمسية توعوية حول حماية البيئة)',
  'Kinderfest im Stadtteil planen (التخطيط لمهرجان أطفال في الحي)',
  'Sprachtandem-Treffen im Café organisieren (تنظيم لقاء تبادل لغوي في مقهى)',
  'Firmenjubiläum mit kleinem Budget feiern (الاحتفال بذكرى تأسيس الشركة بميزانية محدودة)',
  'Spendenaktion für eine Schule in Marokko (حملة تبرعات لدعم مدرسة في المغرب)',
];

export const EXAMINER_QUESTIONS: {
  id: number;
  category: 'Teil 1 Follow-up' | 'Teil 2 Diskussion' | 'Teil 3 Planung';
  questionDe: string;
  questionAr: string;
  suggestedRedemittel: string;
}[] = [
  {
    id: 1,
    category: 'Teil 1 Follow-up',
    questionDe: 'Warum haben Sie sich genau für dieses Thema entschieden, und was hat Sie daran am meisten beeindruckt?',
    questionAr: 'لماذا اخترت هذا الموضوع تحديداً، وما الذي أثر فيك أكثر من غيره؟',
    suggestedRedemittel: 'Ich habe mich für dieses Thema entschieden, weil es mich persönlich stark geprägt hat. Besonders beeindruckend fand ich...',
  },
  {
    id: 2,
    category: 'Teil 1 Follow-up',
    questionDe: 'Würden Sie dieses Buch oder diesen Film auch Ihren Freunden in Marokko empfehlen? Warum?',
    questionAr: 'هل تنصح أصدقاءك في المغرب بهذا الكتاب أو الفيلم؟ ولماذا؟',
    suggestedRedemittel: 'Auf jeden Fall! Ich würde es jedem empfehlen, der sich für ... interessiert, da man daraus viel für den Alltag lernen kann.',
  },
  {
    id: 3,
    category: 'Teil 2 Diskussion',
    questionDe: 'Wie sieht die Situation in Ihrem Heimatland Marokko aus? Gibt es dort ähnliche Tendenzen?',
    questionAr: 'كيف يبدو الوضع في بلدك المغرب؟ هل توجد توجهات مشابهة هناك؟',
    suggestedRedemittel: 'In meinem Heimatland Marokko gewinnt dieses Thema ebenfalls immer mehr an Bedeutung. Vor allem in den großen Städten...',
  },
  {
    id: 4,
    category: 'Teil 2 Diskussion',
    questionDe: 'Welche Nachteile sehen Sie, wenn man sich ausschließlich auf digitale Lösungen verlässt?',
    questionAr: 'ما هي السلبيات التي تراها عندما يعتمد الإنسان كلياً على الحلول الرقمية؟',
    suggestedRedemittel: 'Ein gravierender Nachteil besteht darin, dass der persönliche Kontakt verloren geht. Darüber hinaus muss man bedenken, dass...',
  },
  {
    id: 5,
    category: 'Teil 2 Diskussion',
    questionDe: 'Glauben Sie, dass der Staat hier strengere Regeln einführen sollte, oder liegt die Verantwortung beim Einzelnen?',
    questionAr: 'هل تعتقد أن الدولة يجب أن تفرض قوانين أشد هنا، أم أن المسؤولية تقع على الفرد؟',
    suggestedRedemittel: 'Meines Erachtens liegt die Verantwortung auf beiden Seiten. Einerseits sollte der Staat..., andererseits muss jeder Einzelne...',
  },
  {
    id: 6,
    category: 'Teil 3 Planung',
    questionDe: 'Was machen wir, wenn das Wetter am Veranstaltungstag plötzlich sehr schlecht wird?',
    questionAr: 'ماذا سنفعل إذا أصبح الطقس سيئاً جداً بشكل مفاجئ يوم الفعالية؟',
    suggestedRedemittel: 'Das ist ein sehr wichtiger Punkt! Für den Fall, dass es regnet, sollten wir unbedingt einen Plan B in einem geschlossenen Raum reservieren.',
  },
  {
    id: 7,
    category: 'Teil 3 Planung',
    questionDe: 'Wie können wir die Kosten so niedrig wie möglich halten, ohne dass die Qualität leidet?',
    questionAr: 'كيف يمكننا إبقاء التكاليف منخفضة قدر الإمكان دون أن تتأثر الجودة؟',
    suggestedRedemittel: 'Ich schlage vor, dass jeder Teilnehmer eine Kleinigkeit zu essen mitbringt. Auf diese Weise sparen wir viel Geld beim Catering.',
  },
  {
    id: 8,
    category: 'Teil 3 Planung',
    questionDe: 'Wer kümmert sich um die Einladungen und wie erreichen wir am besten alle Teilnehmer rechtzeitig?',
    questionAr: 'من سيتكفل بالدعوات وكيف نصل إلى جميع المشاركين في الوقت المناسب؟',
    suggestedRedemittel: 'Ich kann gerne die Gestaltung der Einladungen übernehmen. Am schnellsten erreichen wir alle über eine gemeinsame WhatsApp-Gruppe und per E-Mail.',
  },
  {
    id: 9,
    category: 'Teil 2 Diskussion',
    questionDe: 'Können Sie ein konkretes Beispiel aus Ihrer eigenen Erfahrung nennen, das Ihre Meinung unterstützt?',
    questionAr: 'هل يمكنك ذكر مثال ملموس من تجربتك الشخصية يدعم رأيك؟',
    suggestedRedemittel: 'Aus meiner eigenen Erfahrung kann ich sagen, dass... Als ich letztes Jahr..., habe ich selbst erlebt, wie wichtig...',
  },
  {
    id: 10,
    category: 'Teil 1 Follow-up',
    questionDe: 'Wenn Sie diese Reise noch einmal machen könnten, was würden Sie beim nächsten Mal anders planen?',
    questionAr: 'لو أتيحت لك فرصة القيام بهذه الرحلة مرة أخرى، ما الذي ستخطط له بشكل مختلف؟',
    suggestedRedemittel: 'Wenn ich noch einmal dorthin reisen würde, würde ich mir definitiv mehr Zeit für die kleinen Dörfer nehmen, anstatt nur...',
  },
];

const DAILY_QUICK_TIPS = [
  {
    category: 'قاعدة ذهبية في القواعد (B2 Grammatik)',
    germanPhrase: 'Obwohl es stark geregnet hat, sind wir spazieren gegangen. / Trotz des starken Regens...',
    arabicExplanation: 'انتبه: بعد Obwohl يأتي الفعل في آخر الجملة، بينما بعد Trotz يأتي الاسم في حالة المضاف إليه (Genitiv).',
    commonMistakeWarning: 'خطأ شائع: قول "Trotz es regnet" — الصحيح دائماً استخدام Obwohl مع الجملة الفعلية.',
  },
  {
    category: 'روابط المناقشة الذكية (Teil 2 Redemittel)',
    germanPhrase: 'Einerseits lässt sich nicht leugnen, dass..., andererseits muss man berücksichtigen, dass...',
    arabicExplanation: 'عبارة B2 فخمة جداً لتقديم وجهتي نظر متوازنتين أمام الممتحن وكسب نقاط المعجم المتقدم.',
    commonMistakeWarning: 'تجنب تكرار "Ich denke, dass" في كل جملة؛ نوّع بـ "Meiner Ansicht nach" أو "Ich vertrete den Standpunkt, dass".',
  },
  {
    category: 'أسرار الرسالة الرسمية (Schreiben Beschwerde)',
    germanPhrase: 'Zu meinem großen Bedauern musste ich feststellen, dass die Angaben in Ihrer Anzeige nicht der Realität entsprachen.',
    arabicExplanation: 'جملة افتتاحية قوية جداً لرسالة الشكوى تضمن لك علامة كاملة في الأسلوب الرسمي.',
    commonMistakeWarning: 'لا تنسَ أبداً مطابقة التحية الافتتاحية مع الختامية: Sehr geehrte Damen und Herren -> Mit freundlichen Grüßen.',
  },
  {
    category: 'رادار الاستماع (Hören Code-Familien)',
    germanPhrase: 'kaum / fast nie / selten = Negation (نفي مقنّع)',
    arabicExplanation: 'في امتحان الاستماع TELC B2، كلمة "kaum" تعني "بالكاد / لا تقريباً"، وهي تغير معنى الجملة إلى النفي الكامل!',
    commonMistakeWarning: 'لا تنخدع بسماع نفس الكلمة الموجودة في السؤال؛ ركز على المرادف أو النفي المقنّع.',
  },
  {
    category: 'التفاوض في التخطيط المشترك (Teil 3 Planung)',
    germanPhrase: 'Das klingt zwar nach einer guten Idee, aber wäre es nicht sinnvoller, wenn wir zuerst...?',
    arabicExplanation: 'أفضل طريقة للاعتراض المؤدب واقتراح بديل ذكي في الجزء الثالث من الامتحان الشفوي.',
    commonMistakeWarning: 'لا توافق على كل شيء بكلمة "Ja, gut" فقط؛ الممتحن يريد سماعك تناقش وتقترح بدائل.',
  },
  {
    category: 'الروابط المزدوجة (Zweiteilige Konnektoren)',
    germanPhrase: 'Sowohl die Kosten als auch der Zeitaufwand müssen genau geplant werden.',
    arabicExplanation: 'استخدام (sowohl... als auch / nicht nur... sondern auch / weder... noch) يرفع تقييمك في الكتابي والشفوي فوراً.',
    commonMistakeWarning: 'مع "weder ... noch" الفعل يكون مثبتاً لأن النفي موجود أصلاً في الرابط.',
  },
  {
    category: 'عبارات الإنقاذ الطارئة (Notfall-Redemittel)',
    germanPhrase: 'Darüber habe ich mir ehrlich gesagt noch keine genauen Gedanken gemacht, aber spontan würde ich sagen, dass...',
    arabicExplanation: 'عبارة إنقاذ ذهبية عندما يفاجئك الممتحن بسؤال صعب؛ تمنحك 5 ثوانٍ للتفكير دون صمت محرج!',
    commonMistakeWarning: 'إياك والصمت التام في الشفوي؛ تحدث ببطء واستخدم عبارات كسب الوقت الألمانية.',
  },
];

export function getRankForDay(day: number, totalXp = 0): RankInfo {
  const clampedDay = Math.max(1, Math.min(60, day));
  const byDay = RANKS.find((r) => clampedDay >= r.minDay && clampedDay <= r.maxDay) || RANKS[0];
  // Also allow XP progression to reflect rank if user has earned higher rank XP
  const byXp = [...RANKS].reverse().find((r) => totalXp >= r.minXp) || RANKS[0];
  return byXp.id > byDay.id ? byXp : byDay;
}

export function generateDayCurriculum(day: number): DailyMissionDetails {
  const clampedDay = Math.max(1, Math.min(60, day));
  const rank = getRankForDay(clampedDay, 0);
  const tip = DAILY_QUICK_TIPS[(clampedDay - 1) % DAILY_QUICK_TIPS.length];

  if (clampedDay <= 15) {
    // Phase 1 (Days 1-15)
    const teil1Item = TEIL_1_TOPICS[(clampedDay - 1) % TEIL_1_TOPICS.length];
    const pruefungStart = Math.min(17, Math.floor(((clampedDay - 1) * 17) / 15) + 1);
    const pruefungEnd = Math.min(17, Math.floor((clampedDay * 17) / 15));
    const pruefungLabel =
      pruefungEnd > pruefungStart
        ? `Prüfung ${pruefungStart} & Prüfung ${pruefungEnd}`
        : `Prüfung ${pruefungStart}`;
    const codeFamilyNum = ((clampedDay - 1) % 11) + 1;
    const isBeschwerde = clampedDay % 2 === 1;

    return {
      day: clampedDay,
      phaseNumber: 1,
      phaseTitle: 'المرحلة 1 (الأيام 1–15): مرحلة التأسيس وكسر حاجز الخوف في الشفوي',
      phaseSubtitle: 'إتقان العروض السبعة (Teil 1) + 30 رابطاً ذهبياً + الحزم 1 إلى 17 في القراءة + عائلات الكودات الـ 11',
      rank,
      muendlichMorning: {
        title: `تثبيت العرض الشفوي بصوت مرتفع: ${teil1Item.ar}`,
        topicDe: `${teil1Item.de} + 2 Redemittel (Teil 2/3)`,
        details: 'قراءة العرض 5 مرات بصوت جهوري ثم تسجيله في المسجل الصوتي المدمج لمدة دقيقتين دون النظر إلى الورقة.',
        redemittelFocus: `حفظ وتطبيق رابطين جديدين من الـ 30 رابطاً الذهبية (المجموعة ${clampedDay} من 15).`,
      },
      lesenTarget: {
        title: `إنجاز حزمة القراءة والقواعد (${pruefungLabel})`,
        examPackageDe: `${pruefungLabel} (Lesen Teil 1, 2, 3 + Sprachbausteine 1 & 2)`,
        details: 'التركيز على استخراج الكلمات المفتاحية (Mots-Clés) ومطابقتها بدقة على منصة القراءة.',
        modeFlags: ['الترتيب العادي (Standard)', 'تثبيت المفاتيح الدلالية'],
      },
      hoerenSchreibenTarget: {
        title: `عائلة الكودات رقم ${codeFamilyNum} + قالب ${isBeschwerde ? 'الشكوى (Beschwerde)' : 'طلب المعلومات (Bitte um Information)'}`,
        hoerenFocusDe: `Code-Familie #${codeFamilyNum} von 11 (Hören Teil 1 & 3)`,
        schreibenFocusDe: isBeschwerde
          ? 'Beschwerdebrief-Vorlage (مقدمة + 4 نقاط + خاتمة)'
          : 'Bitte um Information (مقدمة + 4 أسئلة مباشرة وغير مباشرة)',
        details: 'دراسة الكودات الصوتية على موقع الاستماع ثم كتابة فقرتين كاملتين من القالب الرسمي غيباً.',
      },
      muendlichEvening: {
        title: 'تدريب الروابط الذهبية وأسئلة المتابعة للجزء الأول',
        simulationDe: `Kurzfragen zu "${teil1Item.de}" + Redemittel-Drill`,
        details: 'استخدام مولد أسئلة الممتحن العشوائي للإجابة في 60 ثانية بصوت مسموع وبثقة عالية.',
      },
      immersionTarget: {
        recommendedPodcastLevel: clampedDay <= 7 ? 'A1' : 'A2',
        podcastShowDe: clampedDay <= 7 ? 'Deutsch lernen durch Hören (A1)' : 'Slow German / DW Audio (A2)',
        seriesTitleDe: clampedDay % 2 === 1 ? 'Nicos Weg (2 Episoden)' : 'Extra auf Deutsch (2 Episoden)',
        details: 'ترديد الجمل بصوت عالٍ (Shadowing) + مراجعة Anki لمدة ساعة + ساعة Duolingo + حلقتين من المسلسل.',
      },
      quickTip: tip,
    };
  }

  if (clampedDay <= 30) {
    // Phase 2 (Days 16-30)
    const dayInPhase = clampedDay - 15; // 1..15
    const topic1 = TEIL_2_DEBATE_TOPICS[((dayInPhase - 1) * 2) % TEIL_2_DEBATE_TOPICS.length];
    const topic2 = TEIL_2_DEBATE_TOPICS[((dayInPhase - 1) * 2 + 1) % TEIL_2_DEBATE_TOPICS.length];
    const pruefungNum = Math.min(34, 17 + dayInPhase);
    const standaloneTeil1 = (dayInPhase - 1) * 3 + 1;
    const standaloneTeil2 = (dayInPhase - 1) * 2 + 1;
    const hoerenStart = (dayInPhase - 1) * 4 + 1;
    const hoerenEnd = Math.min(56, dayInPhase * 4);

    return {
      day: clampedDay,
      phaseNumber: 2,
      phaseTitle: 'المرحلة 2 (الأيام 16–30): مرحلة التوسع والطلاقة في المناقشة (Teil 2)',
      phaseSubtitle: 'إتقان 20 موضوع نقاش (Teil 2) + الحزم 18 إلى 34 والنصوص المستقلة + 56 موضوع استماع بقاعدة الـ 15 + 15 رسالة غيباً',
      rank,
      muendlichMorning: {
        title: `تلخيص ومناقشة موضوعي اليوم (3 جمل تلخيص + حجتان مع + حجتان ضد + تجربة بالمغرب)`,
        topicDe: `Thema A: ${topic1}`,
        details: `تطبيق خطة المناقشة الكاملة: تلخيص النص في 3 جمل واضحة، ذكر إيجابيتين وسلبيتين، وربط الموضوع بالواقع في المغرب.`,
        redemittelFocus: `الموضوع الثاني للمقارنة: ${topic2}`,
      },
      lesenTarget: {
        title: `إنجاز الحزمة الشاملة (Prüfung ${pruefungNum}) + نصوص إضافية مستقلة`,
        examPackageDe: `Prüfung ${pruefungNum} + Standalone Teil 1 (#${standaloneTeil1}–${standaloneTeil1 + 2}) & Teil 2 (#${standaloneTeil2}–${standaloneTeil2 + 1})`,
        details: 'التركيز على السرعة في مطابقة العناوين (Teil 1) وفهم التفاصيل الدقيقة في المقالات العلمية (Teil 2).',
        modeFlags: ['توقيت رسمي مضبوط', 'توسيع المعجم الامتحاني'],
      },
      hoerenSchreibenTarget: {
        title: `تطبيق قاعدة الـ 15 على مواضيع الاستماع (${hoerenStart}–${hoerenEnd}) + كتابة الرسالة #${dayInPhase} غيباً`,
        hoerenFocusDe: `Hören Teil 2 Themen #${hoerenStart} bis #${hoerenEnd} (von 56) mit der 15er-Regel`,
        schreibenFocusDe: `Vollständiger Brief #${dayInPhase} von 15 aus dem Gedächtnis (بدون النظر للقالب)`,
        details: 'قراءة الجمل بسرعة قبل بدء التسجيل وتطبيق قاعدة الـ 15، ثم كتابة رسالة كاملة من الذاكرة في دفتر التدريب.',
      },
      muendlichEvening: {
        title: 'مناظرة شفوية حية: الدفاع عن الرأي والرد على الحجج المعاكسة',
        simulationDe: `Teil 2 Debatte: ${topic1}`,
        details: 'تشغيل مؤقت الـ 60 ثانية والرد الفوري على أسئلة الممتحن العشوائية مع تسجيل الصوت وتقييم الأداء.',
      },
      immersionTarget: {
        recommendedPodcastLevel: 'B1',
        podcastShowDe: dayInPhase % 2 === 1 ? 'Easy German Podcast (B1)' : 'Slow German B1 Spezial',
        seriesTitleDe: 'Nicos Weg B1 / Dark (مع الترجمة الألمانية واستخراج 5 عبارات)',
        details: 'استماع نشط لمستوى B1 مع ترديد الجمل + ساعة Anki + ساعة Duolingo + حلقتين بالترجمة الألمانية.',
      },
      quickTip: tip,
    };
  }

  if (clampedDay <= 45) {
    // Phase 3 (Days 31-45)
    const dayInPhase = clampedDay - 30; // 1..15
    const scenario1 = TEIL_3_PLANNING_SCENARIOS[((dayInPhase - 1) * 2) % TEIL_3_PLANNING_SCENARIOS.length];
    const scenario2 = TEIL_3_PLANNING_SCENARIOS[((dayInPhase - 1) * 2 + 1) % TEIL_3_PLANNING_SCENARIOS.length];
    const moduleStart = (dayInPhase - 1) * 14 + 1;
    const moduleEnd = Math.min(210, dayInPhase * 14);
    const hoerenDrillStart = (dayInPhase - 1) * 10 + 1;
    const hoerenDrillEnd = Math.min(154, dayInPhase * 10 + 4);

    return {
      day: clampedDay,
      phaseNumber: 3,
      phaseTitle: 'المرحلة 3 (الأيام 31–45): مرحلة الاحتراف والرد التلقائي السريع (Teil 3 & المعدل)',
      phaseSubtitle: 'إتقان 25 سيناريو تخطيط (Teil 3) + الدورة الثانية الكاملة مع التخربق (Shuffle) والمعدل 1 و 2 + الرد في أقل من 3 ثوانٍ',
      rank,
      muendlichMorning: {
        title: 'إتقان التخطيط المشترك (Teil 3) + تسجيل صوتي ارتجالي لمدة 5 دقائق',
        topicDe: `Planungsszenario: ${scenario1}`,
        details: 'اقتراح فكرة، الاعتراض بأدب، والتفاوض حول الزمان والميزانية وتوزيع المهام في 4 دقائق + تسجيل 5 دقائق بدون نص مكتوب.',
        redemittelFocus: `السيناريو الإضافي: ${scenario2}`,
      },
      lesenTarget: {
        title: `الدورة الثانية المكثفة: الوحدات ${moduleStart} إلى ${moduleEnd} من أصل 210`,
        examPackageDe: `Module #${moduleStart}–#${moduleEnd} (von 210) mit Shuffle & المعدل 1 & 2`,
        details: 'تفعيل زر "🔀 تخربق الترتيب (Shuffle)" وزر "⚠️ المعدل 1 & 2" على الموقع لضمان الفهم الحقيقي وليس حفظ أماكن الإجابات!',
        modeFlags: ['🔀 تخربق الترتيب (Shuffle)', '⚠️ المعدل 1 & 2 مفعل'],
      },
      hoerenSchreibenTarget: {
        title: `تدريب السرعة الخاطفة: مواضيع الاستماع (${hoerenDrillStart}–${hoerenDrillEnd}) في أقل من 3 ثوانٍ + رسالة في 18 دقيقة`,
        hoerenFocusDe: `Speed-Drill: Themen #${hoerenDrillStart}–#${hoerenDrillEnd} (von 154) in < 3 Sekunden`,
        schreibenFocusDe: `1 Brief unter Zeitdruck (< 18 Minuten) mit B2-Konnektoren`,
        details: 'اقتناص الكودات المفتاحية في أقل من 3 ثوانٍ لكل سؤال وكتابة رسالة كاملة خالية من الأخطاء في أقل من 18 دقيقة.',
      },
      muendlichEvening: {
        title: 'محاكاة حوار التخطيط المشترك والرد التلقائي السريع (Teil 2 & Teil 3)',
        simulationDe: `Live-Verhandlung (4 Min.): ${scenario1}`,
        details: 'الرد الفوري على اعتراضات الشريك الافتراضي وأسئلة الممتحن دون أي توقف أو تردد.',
      },
      immersionTarget: {
        recommendedPodcastLevel: 'B2',
        podcastShowDe: 'Top-Thema mit Vokabeln — Deutsche Welle (B1/B2)',
        seriesTitleDe: 'Serie auf Deutsch (2 Episoden + 5 Dialog-Redemittel)',
        details: 'الاستماع لبودكاست DW بمستوى B1/B2 مع الترديد الصوتي + ساعة Anki + ساعة Duolingo + حلقتين من المسلسل.',
      },
      quickTip: tip,
    };
  }

  // Phase 4 (Days 46-60)
  const dayInPhase = clampedDay - 45; // 1..15
  const teil1Review = TEIL_1_TOPICS[(dayInPhase - 1) % TEIL_1_TOPICS.length];
  const teil2Review = TEIL_2_DEBATE_TOPICS[(dayInPhase - 1) % TEIL_2_DEBATE_TOPICS.length];
  const teil3Review = TEIL_3_PLANNING_SCENARIOS[(dayInPhase - 1) % TEIL_3_PLANNING_SCENARIOS.length];

  return {
    day: clampedDay,
    phaseNumber: 4,
    phaseTitle: 'المرحلة 4 (الأيام 46–60): مرحلة المحاكاة النهائية والجاهزية 200%',
    phaseSubtitle: 'امتحان شفوي تجريبي كامل يومياً (15 دقيقة) + محاكاة كتابية كاملة بالوقت + تصفية بنك الأخطاء (بنك أخطائي)',
    rank,
    muendlichMorning: {
      title: `امتحان شفوي تجريبي كامل بالوقت (#${dayInPhase} من 15): 3د Teil 1 + 6د Teil 2 + 6د Teil 3`,
      topicDe: `Mock-Prüfung #${dayInPhase}: ${teil1Review.de}`,
      details: 'محاكاة رسمية كاملة لمدة 15 دقيقة متواصلة مع تدريب عبارات الإنقاذ الطارئة (Notfall-Redemittel) عند المفاجآت.',
      redemittelFocus: `مراجعة عبارات الإنقاذ الطارئة والربط السلس بين الأجزاء الثلاثة.`,
    },
    lesenTarget: {
      title: `محاكاة الامتحان الكتابي الكامل #${dayInPhase} + تصفية "بنك أخطائي"`,
      examPackageDe: `Vollständige Simulation #${dayInPhase} (Lesen + Sprachbausteine unter Prüfungsbedingungen)`,
      details: 'حل امتحان كامل تحت شروط الوقت الرسمي ثم مراجعة وتصفير جميع الأسئلة المسجلة في قسم "بنك أخطائي".',
      modeFlags: ['⏱️ محاكاة رسمية بالوقت', '🧹 تصفية بنك أخطائي', '🔀 Shuffle + ⚠️ المعدل 1 & 2'],
    },
    hoerenSchreibenTarget: {
      title: `محاكاة الاستماع والكتابة الكاملة #${dayInPhase} + مراجعة الكودات الذهبية`,
      hoerenFocusDe: `Hören Komplett-Simulation #${dayInPhase} (Teil 1 + Teil 2 + Teil 3)`,
      schreibenFocusDe: `Prüfungsbrief #${dayInPhase} in 15–18 Min. + Selbstkorrektur-Checkliste`,
      details: 'إنجاز قسم الاستماع والكتابة دفعة واحدة كما في يوم الامتحان الحقيقي مع فحص قائمة المراجعة الذاتية.',
    },
    muendlichEvening: {
      title: 'اختبار الضغط العالي الشفوي (Teil 2 & Teil 3 بدون تحضير مسبق)',
      simulationDe: `Spontan-Simulation: ${teil2Review} + ${teil3Review}`,
      details: 'سحب سؤال ممتحن عشوائي والرد الفوري لمدة دقيقة كاملة مع تسجيل وتقييم الأداء للوصول إلى جاهزية 200%.',
    },
    immersionTarget: {
      recommendedPodcastLevel: 'B2',
      podcastShowDe: 'DW Wort der Woche / Nachrichten B2 (Normaltempo)',
      seriesTitleDe: 'Deutsche Originalserie (2 Episoden zur Entspannung & Ohr-Gewöhnung)',
      details: 'بودكاست بمستوى B2 الطبيعي + ساعة Anki لتثبيت آخر البطاقات + ساعة Duolingo + حلقتين من المسلسل الألماني.',
    },
    quickTip: tip,
  };
}

export function getChecklistTasksForDay(mission: DailyMissionDetails): ChecklistTaskDef[] {
  return [
    // Section 1: 8 Hours Core Exam Mastery
    {
      id: 'core_1',
      section: 'core',
      timeSlot: '09:00 – 11:00 | ساعتان',
      title: 'الفترة 1: Mündlich صباحي بصوت مرتفع (Teil 1 + Redemittel)',
      subtitle: `${mission.muendlichMorning.title} — [${mission.muendlichMorning.topicDe}]`,
      xp: 200,
      studyHours: 2,
      externalLinks: [{ label: 'فتح موقع Sprechen', url: 'https://telclesen1.vercel.app/#sprechen' }],
      hasVoiceRecorder: true,
    },
    {
      id: 'core_2',
      section: 'core',
      timeSlot: '11:30 – 13:30 | ساعتان',
      title: 'الفترة 2: Lesen & Sprachbausteine',
      subtitle: `${mission.lesenTarget.title} — [${mission.lesenTarget.examPackageDe}]`,
      xp: 200,
      studyHours: 2,
      externalLinks: [{ label: 'فتح موقع Lesen & Prüfungen', url: 'https://telclesen1.vercel.app/' }],
    },
    {
      id: 'core_3',
      section: 'core',
      timeSlot: '15:30 – 17:30 | ساعتان',
      title: 'الفترة 3: Hören + Schreiben',
      subtitle: `${mission.hoerenSchreibenTarget.title} — [${mission.hoerenSchreibenTarget.hoerenFocusDe}]`,
      xp: 200,
      studyHours: 2,
      externalLinks: [
        { label: 'فتح موقع Hören', url: 'https://telchr.vercel.app/' },
        { label: 'فتح موقع Schreiben', url: 'https://telchr.vercel.app/#schreiben' },
      ],
    },
    {
      id: 'core_4',
      section: 'core',
      timeSlot: '18:00 – 20:00 | ساعتان',
      title: 'الفترة 4: Mündlich تفاعلي ومحاكاة الحوار (Teil 2 & Teil 3)',
      subtitle: `${mission.muendlichEvening.title} — [${mission.muendlichEvening.simulationDe}]`,
      xp: 200,
      studyHours: 2,
      externalLinks: [{ label: 'فتح موقع Sprechen', url: 'https://telclesen1.vercel.app/#sprechen' }],
      hasExaminerGenerator: true,
    },

    // Section 2: 4 Hours Immersion & Apps
    {
      id: 'imm_1',
      section: 'immersion',
      timeSlot: '60 دقيقة | ساعة واحدة',
      title: 'تطبيق Anki (مراجعة البطاقات اليومية بصوت مسموع داخل جمل كاملة)',
      subtitle: 'تثبيت الكلمات المفتاحية والروابط داخل سياق جمل حقيقية بصوت واضح.',
      xp: 100,
      studyHours: 1,
      hasAnkiCounter: true,
    },
    {
      id: 'imm_2',
      section: 'immersion',
      timeSlot: '60 دقيقة | ساعة واحدة',
      title: 'تطبيق Duolingo (الحفاظ على الـ Streak وتنشيط السرعة البديهية)',
      subtitle: 'تنشيط البديهة اللغوية السريعة والتراكيب النحوية اليومية دون انقطاع.',
      xp: 100,
      studyHours: 1,
    },
    {
      id: 'imm_3',
      section: 'immersion',
      timeSlot: '60 دقيقة | ساعة واحدة',
      title: 'الاستماع للبودكاست الألماني (مع ترديد الجمل بصوت عالٍ - Shadowing)',
      subtitle: `المقترح اليوم: ${mission.immersionTarget.podcastShowDe} — تقليد نبرة وسرعة المتحدث الأصلي.`,
      xp: 100,
      studyHours: 1,
      hasPodcastSelector: true,
    },
    {
      id: 'imm_4',
      section: 'immersion',
      timeSlot: '60 دقيقة | ساعة واحدة',
      title: 'مشاهدة حلقتين من المسلسل الألماني (بالترجمة الألمانية + استخراج 5 عبارات حوارية)',
      subtitle: `${mission.immersionTarget.seriesTitleDe} — تدوين 5 تعابير يومية حية لاستعمالها في الشفوي.`,
      xp: 100,
      studyHours: 1,
    },

    // Section 3: 12 Hours Life, Health & Sleep Balance
    {
      id: 'life_1',
      section: 'life',
      timeSlot: 'طوال اليوم | السكينة الروحية',
      title: '🕌 الصلوات الخمس في وقتها وأذكار الصباح والمساء',
      subtitle: 'البركة في الوقت، الطمأنينة النفسية، والثبات الذهني طوال رحلة الـ 60 يوماً.',
      xp: 50,
      studyHours: 0,
    },
    {
      id: 'life_2',
      section: 'life',
      timeSlot: '60 دقيقة | تجديد النشاط',
      title: '🏃‍♂️ ساعة رياضة أو مشي في الهواء الطلق (لتفريغ الضغط وتجديد طاقة الدماغ)',
      subtitle: 'تنشيط الدورة الدموية ورفع التركيز قبل أو بعد الفترات الدراسية المكثفة.',
      xp: 50,
      studyHours: 0,
    },
    {
      id: 'life_3',
      section: 'life',
      timeSlot: 'طوال اليوم | التغذية والترطيب',
      title: '🥗 الوجبات الثلاث الصحية + شرب 2 لتر ماء (مع متتبع كؤوس الماء 💧 1..8)',
      subtitle: 'الترطيب الكامل للدماغ يحميك من الإرهاق الذهني والصداع أثناء الحفظ.',
      xp: 50,
      studyHours: 0,
      hasWaterTracker: true,
    },
    {
      id: 'life_4',
      section: 'life',
      timeSlot: '90 دقيقة | راحة واستجمام',
      title: '😊 وقت الراحة الحرة والجلوس مع العائلة والأصدقاء (ساعة ونصف بدون شاشات دراسة)',
      subtitle: 'فصل إيجابي عن جو الدراسة لشحن المعنويات والحفاظ على الحماس.',
      xp: 50,
      studyHours: 0,
    },
    {
      id: 'life_5',
      section: 'life',
      timeSlot: '8 ساعات ليلاً | تثبيت الذاكرة',
      title: '😴 8 ساعات نوم عميق ليلاً (لتثبيت الكلمات والكودات في الذاكرة طويلة المدى)',
      subtitle: 'أثناء النوم العميق ينقل الدماغ جميع الكودات والروابط إلى الذاكرة الدائمة.',
      xp: 50,
      studyHours: 0,
    },
  ];
}

export function createDefaultDayProgress(day: number): DayProgressState {
  const recommendedLevel: PodcastLevel =
    day <= 7 ? 'A1' : day <= 15 ? 'A2' : day <= 30 ? 'B1' : 'B2';
  return {
    completedTasks: {},
    ankiNewCards: 20,
    podcastLevel: recommendedLevel,
    waterGlasses: 0,
    notes: '',
    selfEval: {
      fluency: 4,
      connectors: 4,
      pronunciation: 4,
      timeRespect: 4,
    },
  };
}

export function isStudyDayComplete(dayProgress: DayProgressState | undefined): boolean {
  if (!dayProgress) return false;
  const studyIds = ['core_1', 'core_2', 'core_3', 'core_4', 'imm_1', 'imm_2', 'imm_3', 'imm_4'];
  return studyIds.every((id) => Boolean(dayProgress.completedTasks[id]));
}

export function isFullDayChecklistComplete(dayProgress: DayProgressState | undefined): boolean {
  if (!dayProgress) return false;
  const allIds = [
    'core_1',
    'core_2',
    'core_3',
    'core_4',
    'imm_1',
    'imm_2',
    'imm_3',
    'imm_4',
    'life_1',
    'life_2',
    'life_3',
    'life_4',
    'life_5',
  ];
  return allIds.every((id) => Boolean(dayProgress.completedTasks[id]));
}

export function isEveningEntertainmentUnlocked(dayProgress: DayProgressState | undefined): boolean {
  if (!dayProgress) return false;
  // Morning & afternoon blocks: core_1 (09:00-11:00), core_2 (11:30-13:30), core_3 (15:30-17:30)
  return Boolean(
    dayProgress.completedTasks['core_1'] &&
      dayProgress.completedTasks['core_2'] &&
      dayProgress.completedTasks['core_3']
  );
}

export function calculateDayXp(dayProgress: DayProgressState | undefined): number {
  if (!dayProgress) return 0;
  const taskXpMap: Record<string, number> = {
    core_1: 200,
    core_2: 200,
    core_3: 200,
    core_4: 200,
    imm_1: 100,
    imm_2: 100,
    imm_3: 100,
    imm_4: 100,
    life_1: 50,
    life_2: 50,
    life_3: 50,
    life_4: 50,
    life_5: 50,
  };
  let xp = 0;
  for (const [taskId, done] of Object.entries(dayProgress.completedTasks)) {
    if (done && taskXpMap[taskId]) {
      xp += taskXpMap[taskId];
    }
  }
  // Completing a full 12-hour study day grants +1000 XP bonus
  if (isStudyDayComplete(dayProgress)) {
    xp += 1000;
  }
  return xp;
}

export function calculateDayStudyHours(dayProgress: DayProgressState | undefined): number {
  if (!dayProgress) return 0;
  const taskHoursMap: Record<string, number> = {
    core_1: 2,
    core_2: 2,
    core_3: 2,
    core_4: 2,
    imm_1: 1,
    imm_2: 1,
    imm_3: 1,
    imm_4: 1,
  };
  let hours = 0;
  for (const [taskId, done] of Object.entries(dayProgress.completedTasks)) {
    if (done && taskHoursMap[taskId]) {
      hours += taskHoursMap[taskId];
    }
  }
  return hours;
}

export interface BootcampMetrics {
  totalXp: number;
  totalStudyHours: number;
  completedStudyDaysCount: number;
  currentStreak: number;
  longestStreak: number;
  weeklyCrownUnlocked: boolean;
  muendlichConfidencePercent: number; // 0% to 200%
  currentRank: RankInfo;
  nextRank: RankInfo | null;
  rankProgressPercent: number;
}

export function calculateBootcampMetrics(
  days: Record<number, DayProgressState>,
  selectedDay: number,
  recordingsCount = 0
): BootcampMetrics {
  let totalXp = 0;
  let totalStudyHours = 0;
  let completedStudyDaysCount = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let runningStreak = 0;
  let muendlichTasksCompleted = 0;
  let evalScoreSum = 0;
  let evalDaysCount = 0;

  for (let d = 1; d <= 60; d++) {
    const dp = days[d];
    totalXp += calculateDayXp(dp);
    totalStudyHours += calculateDayStudyHours(dp);

    if (dp) {
      if (dp.completedTasks['core_1']) muendlichTasksCompleted++;
      if (dp.completedTasks['core_4']) muendlichTasksCompleted++;
      if (dp.completedTasks['imm_3']) muendlichTasksCompleted++;
      const avgSelfEval =
        (dp.selfEval.fluency +
          dp.selfEval.connectors +
          dp.selfEval.pronunciation +
          dp.selfEval.timeRespect) /
        4;
      if (dp.completedTasks['core_1'] || dp.completedTasks['core_4']) {
        evalScoreSum += avgSelfEval;
        evalDaysCount++;
      }
    }

    if (isStudyDayComplete(dp)) {
      completedStudyDaysCount++;
      runningStreak++;
      if (runningStreak > longestStreak) {
        longestStreak = runningStreak;
      }
    } else {
      runningStreak = 0;
    }
  }

  // Calculate active streak ending at the latest completed day (or consecutive run)
  let tailStreak = 0;
  for (let d = 60; d >= 1; d--) {
    if (isStudyDayComplete(days[d])) {
      tailStreak++;
    } else if (tailStreak > 0) {
      break;
    }
  }
  currentStreak = tailStreak;

  const weeklyCrownUnlocked = longestStreak >= 6;

  // Mündlich Confidence Meter from 0% to 200%
  // Combines Mündlich task completion across the 60 days (up to 160%), self-eval quality (up to 25%), and voice recordings (up to 15%)
  const taskRatio = Math.min(1, muendlichTasksCompleted / (60 * 3));
  const evalBonus = evalDaysCount > 0 ? (evalScoreSum / evalDaysCount / 5) * 25 : 15;
  const recordingBonus = Math.min(15, recordingsCount * 3);
  const rawConfidence = Math.round(taskRatio * 160 + (muendlichTasksCompleted > 0 ? evalBonus : 0) + recordingBonus);
  const muendlichConfidencePercent = Math.max(0, Math.min(200, rawConfidence));

  const currentRank = getRankForDay(selectedDay, totalXp);
  const nextRank = RANKS.find((r) => r.id === currentRank.id + 1) || null;

  let rankProgressPercent = 100;
  if (nextRank) {
    const span = Math.max(1, nextRank.minXp - currentRank.minXp);
    rankProgressPercent = Math.max(
      5,
      Math.min(100, Math.round(((totalXp - currentRank.minXp) / span) * 100))
    );
  }

  return {
    totalXp,
    totalStudyHours,
    completedStudyDaysCount,
    currentStreak,
    longestStreak,
    weeklyCrownUnlocked,
    muendlichConfidencePercent,
    currentRank,
    nextRank,
    rankProgressPercent,
  };
}

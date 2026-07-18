import { allGalleryImages } from "./gallery.generated";

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  focalPoint?: string;
};

export type GalleryLayout = "full" | "wide" | "portrait" | "standard" | "quiet" | "film";

export type GalleryImage = ImageAsset & {
  id: string;
  chapter: string;
  layout: GalleryLayout;
};

export type Witness = {
  name: string;
  role: string;
  salutation: string;
  paragraphs: readonly string[];
  image: ImageAsset;
};

export type WeddingContent = {
  couple: {
    firstNameOne: string;
    firstNameTwo: string;
    displayName: string;
    monogram: string;
  };
  wedding: {
    dateLabel: string;
    dateNumeric: string;
    dateTime: string;
    timeLabel: string;
    location: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    memory: string;
    image: ImageAsset;
  };
  transition: {
    openingLine: string;
    revealLine: string;
    closingLine: string;
    background: ImageAsset;
    revealImage: ImageAsset;
  };
  counter: {
    title: string;
    intro: string;
    body: string;
  };
  gallery: {
    title: string;
    eyebrow: string;
    intro: string;
    body: string;
    images: readonly GalleryImage[];
  };
  witnesses: {
    title: string;
    eyebrow: string;
    intro: string;
    people: readonly [Witness, Witness];
    closing: string;
    signature: string;
  };
  guests: {
    title: string;
    eyebrow: string;
    paragraphs: readonly string[];
    highlight: string;
  };
  final: {
    lead: string;
    quote: string;
    signature: string;
    date: string;
    image: ImageAsset;
  };
  audio: {
    title: string;
    artist: string;
    songSrc: string | null;
    loop: boolean;
  };
  seo: {
    title: string;
    description: string;
    openGraphTitle: string;
    openGraphDescription: string;
    openGraphImage: string;
  };
};

export const wedding = {
  couple: {
    firstNameOne: "Lea",
    firstNameTwo: "Christoph",
    displayName: "Lea & Christoph",
    monogram: "L & C",
  },
  wedding: {
    dateLabel: "18. Juli 2025",
    dateNumeric: "18 · 07 · 2025",
    dateTime: "2025-07-18T10:00:00+02:00",
    timeLabel: "10:00 Uhr",
    location: "Schloss Bückeburg",
  },
  hero: {
    eyebrow: "L & C",
    title: "Lea & Christoph",
    subtitle: "Unser Ja. Für immer.",
    memory: "Ein Tag, der vergangen ist – und doch für immer bei uns bleibt.",
    image: {
      src: "/media/hero/hero-couple.webp",
      alt: "Lea und Christoph vor dem goldverzierten Tor von Schloss Bückeburg",
      width: 2800,
      height: 1729,
      focalPoint: "40% center",
    },
  },
  transition: {
    openingLine: "Hinter diesem Tor begann unser Für immer.",
    revealLine: "Und plötzlich war alles andere ganz still.",
    closingLine: "Da war nur noch dieser Moment. Und wir.",
    background: {
      src: "/media/transition/castle-background.webp",
      alt: "Lea und Christoph gemeinsam im historischen Trauzimmer",
      width: 2200,
      height: 1467,
      focalPoint: "center 50%",
    },
    revealImage: {
      src: "/media/transition/bride-reveal.webp",
      alt: "Lea strahlt nach der Trauung vor dem Schloss",
      width: 2400,
      height: 1600,
      focalPoint: "70% center",
    },
  },
  counter: {
    title: "Seit unserem Ja-Wort",
    intro: "Am 18. Juli 2025 um 10:00 Uhr haben wir uns im Schloss Bückeburg das Ja-Wort gegeben.",
    body: "Seitdem wächst nicht nur diese Zeit – sondern auch all das, was uns verbindet.",
  },
  gallery: {
    eyebrow: "In Bildern bewahrt",
    title: "Unser Tag in Bildern",
    intro: "Manche Erinnerungen verblassen. Diese nicht.",
    body: "Jeder Blick, jede Berührung, jedes Lachen und jede kleine Aufregung vor dem großen Moment ist in diesen Bildern geblieben. Sie erzählen unseren Tag so, wie er sich angefühlt hat: nah, warm, überwältigend und voller Liebe.",
    images: [
      { id: "schloss", src: "/media/gallery/01-schloss.webp", alt: "Schloss Bückeburg an einem stillen Sommermorgen", width: 2200, height: 3300, chapter: "Die leisen Momente davor", layout: "portrait" },
      { id: "trausaal", src: "/media/gallery/02-trausaal.webp", alt: "Der festlich vorbereitete Trausaal im Schloss Bückeburg", width: 2200, height: 3300, chapter: "Die leisen Momente davor", layout: "portrait", caption: "Noch war alles ganz still." },
      { id: "ankunft", src: "/media/gallery/03-ankunft.webp", alt: "Lea und ihre Begleitung betreten den Trausaal", width: 2000, height: 3000, chapter: "Die leisen Momente davor", layout: "quiet" },
      { id: "aufregung", src: "/media/gallery/04-aufregung.webp", alt: "Christoph steckt Lea während der Trauung den Ring an", width: 2000, height: 1333, chapter: "Unser Ja-Wort", layout: "wide" },
      { id: "erster-kuss", src: "/media/gallery/05-erster-kuss.webp", alt: "Lea und Christoph küssen sich im historischen Schloss", width: 2200, height: 3300, chapter: "Unser Ja-Wort", layout: "portrait" },
      { id: "regen", src: "/media/gallery/06-regen.webp", alt: "Lea und Christoph gehen unter einem transparenten Regenschirm zum Schloss", width: 2200, height: 3300, chapter: "Unser Ja-Wort", layout: "portrait", focalPoint: "56% 66%" },
      { id: "ja-wort", src: "/media/gallery/07-ja-wort.webp", alt: "Lea betritt in Begleitung das Trauzimmer, während Christoph auf sie wartet", width: 2200, height: 1371, chapter: "Unser Ja-Wort", layout: "full", focalPoint: "48% 54%" },
      { id: "kuss", src: "/media/gallery/08-kuss.webp", alt: "Lea und Christoph küssen sich nach dem Ja-Wort", width: 2000, height: 1333, chapter: "Unser Ja-Wort", layout: "wide", focalPoint: "46% 48%" },
      { id: "unterschrift-lea", src: "/media/gallery/09-unterschrift-lea.webp", alt: "Lea unterschreibt die Heiratsurkunde", width: 2200, height: 1359, chapter: "Unser Ja-Wort", layout: "standard" },
      { id: "unterschrift-christoph", src: "/media/gallery/10-unterschrift-christoph.webp", alt: "Christoph unterschreibt die Heiratsurkunde", width: 2200, height: 1467, chapter: "Unser Ja-Wort", layout: "standard" },
      { id: "applaus", src: "/media/gallery/11-applaus.webp", alt: "Gäste stoßen im historischen Trauzimmer auf Lea und Christoph an", width: 2200, height: 1467, chapter: "Unser Ja-Wort", layout: "wide", focalPoint: "46% 48%" },
      { id: "ring", src: "/media/gallery/12-ring.webp", alt: "Christoph zeigt lächelnd seinen Ehering", width: 2200, height: 1602, chapter: "Unser Ja-Wort", layout: "quiet", caption: "Ein kleiner Ring. Ein großes Versprechen." },
      { id: "endlich-wir", src: "/media/gallery/13-endlich-wir.webp", alt: "Lea und Christoph gehen nach dem Ringtausch gemeinsam durch das Trauzimmer", width: 2000, height: 3000, chapter: "Endlich wir", layout: "portrait" },
      { id: "spalier", src: "/media/gallery/14-spalier.webp", alt: "Lea und Christoph gehen unter Seifenblasen durch ein Spalier vor dem Schlosstor", width: 2200, height: 1467, chapter: "Endlich wir", layout: "full" },
      { id: "freude", src: "/media/gallery/15-freude.webp", alt: "Lea lacht glücklich zwischen Seifenblasen", width: 2400, height: 1600, chapter: "Endlich wir", layout: "wide" },
      { id: "sommerregen", src: "/media/gallery/16-sommerregen.webp", alt: "Lea dreht sich im Sommerregen lächelnd zu Christoph um", width: 2000, height: 1333, chapter: "Endlich wir", layout: "standard" },
      { id: "paar-beim-empfang", src: "/media/gallery/17-paar-beim-empfang.webp", alt: "Lea und Christoph lächeln beim Empfang gemeinsam in die Kamera", width: 2200, height: 1467, chapter: "Zwischen Lachen und Freudentränen", layout: "wide" },
      { id: "umarmung", src: "/media/gallery/18-umarmung.webp", alt: "Lea wird von einem lieben Gast herzlich umarmt", width: 2000, height: 1333, chapter: "Zwischen Lachen und Freudentränen", layout: "standard" },
      { id: "sekt", src: "/media/gallery/19-sekt.webp", alt: "Das Brautpaar feiert gemeinsam mit seinen Gästen", width: 2200, height: 1467, chapter: "Zwischen Lachen und Freudentränen", layout: "full", caption: "Aus Aufregung wurde Leichtigkeit." },
      { id: "festsaal", src: "/media/gallery/20-festsaal.webp", alt: "Lea und Christoph küssen sich im prächtigen Festsaal", width: 2000, height: 3000, chapter: "Für immer festgehalten", layout: "film" },
      { id: "schlossgarten", src: "/media/gallery/21-schlossgarten.webp", alt: "Lea und Christoph vor der Fassade von Schloss Bückeburg", width: 2200, height: 3300, chapter: "Für immer festgehalten", layout: "film" },
      { id: "schlosstor", src: "/media/gallery/22-schlosstor.webp", alt: "Lea und Christoph stehen vor dem historischen Schlosstor", width: 2400, height: 1482, chapter: "Für immer festgehalten", layout: "film" },
      { id: "ganz-nah", src: "/media/gallery/23-ganz-nah.webp", alt: "Lea und Christoph küssen sich innig vor dem goldverzierten Tor", width: 2200, height: 1467, chapter: "Für immer festgehalten", layout: "film" },
      { id: "brautstrauss", src: "/media/gallery/24-brautstrauss.webp", alt: "Leas Hände halten den weißen Brautstrauß", width: 2000, height: 3000, chapter: "Für immer festgehalten", layout: "film" },
      ...allGalleryImages,
    ],
  },
  witnesses: {
    eyebrow: "Von Herzen",
    title: "Für immer an unserer Seite",
    intro: "Eva und Benni, ihr wart an diesem Tag weit mehr als unsere Trauzeugen. Ihr wart zwei der wichtigsten Menschen an unserer Seite – jeder auf seine ganz eigene Weise.",
    people: [
      {
        name: "Eva Rusche",
        role: "Trauzeugin von Lea",
        salutation: "Liebe Eva,",
        paragraphs: [
          "danke, dass du mir immer zur Seite stehst und mich mit so viel Wärme, Ruhe und Herz begleitet hast. Du hast alles mit so viel Liebe vorbereitet und meinen Junggesellinnenabschied zu etwas ganz Besonderem gemacht.",
          "An unserem Hochzeitstag warst du bei jedem Schritt an meiner Seite: Du hast immer wieder mein Kleid gerichtet, meinen Brautstrauß gehalten und mit all den kleinen Gesten dafür gesorgt, dass ich mich ganz auf diesen besonderen Moment einlassen konnte.",
          "Für deine Nähe, deine Freundschaft und all die Zeit und Liebe, die du in diesen Tag gesteckt hast, bin ich dir von Herzen dankbar.",
        ],
        image: { src: "/media/witnesses/eva.webp", alt: "Porträt von Leas Trauzeugin Eva in einem schwarzen Kleid", width: 1023, height: 1537, focalPoint: "center 35%" },
      },
      {
        name: "Benjamin Pfad",
        role: "Trauzeuge und großer Bruder von Christoph",
        salutation: "Lieber Benni,",
        paragraphs: [
          "danke, dass du an diesem besonderen Tag als mein großer Bruder an meiner Seite warst. Gerade in den aufgeregten und emotionalen Momenten hat es mir unglaublich viel bedeutet, dich bei mir zu wissen.",
          "Deine Rede wird mir für immer in Erinnerung bleiben – persönlich, herzlich und voller Gefühl. Du hast uns zum Lachen gebracht und zugleich tief berührt.",
          "Auch für den großartigen Junggesellenabschied und die vielen Erinnerungen, die wir dabei geschaffen haben, möchte ich dir noch einmal von Herzen danken.",
        ],
        image: { src: "/media/witnesses/benjamin.webp", alt: "Porträt von Christophs Trauzeugen und großem Bruder Benjamin im Schlossgarten", width: 1023, height: 1537, focalPoint: "center 28%" },
      },
    ],
    closing: "Dass ihr unser Ja bezeugt habt, wird uns für immer mit euch verbinden.",
    signature: "Von Herzen: Danke.",
  },
  guests: {
    eyebrow: "Unsere Menschen",
    title: "An unsere Familien und Freunde",
    paragraphs: [
      "Dieser Tag wäre ohne euch nur ein Datum gewesen.",
      "Viele von euch haben eine weite Anreise auf sich genommen, Urlaub eingeplant und ihren Alltag für diesen Tag umorganisiert. Allein das war für uns alles andere als selbstverständlich.",
      "Ihr habt beim Planen, Tragen, Organisieren und an unzähligen kleinen Stellen mit angepackt. Mit eurer Zeit, eurer Hilfsbereitschaft und eurer guten Laune habt ihr entscheidend dazu beigetragen, dass dieser Tag für uns genauso schön und vollkommen wurde, wie wir ihn in Erinnerung behalten.",
      "Für eure Liebe, eure Zeit, eure Freudentränen, eure Glückwünsche und all die kleinen Gesten, die unseren Hochzeitstag vollkommen gemacht haben, danken wir euch von ganzem Herzen.",
      "Schön, dass ihr Teil unseres Anfangs wart. Und noch schöner, dass ihr Teil unseres Lebens seid.",
    ],
    highlight: "Diese Erinnerungen gehören nicht nur uns. Sie gehören auch euch.",
  },
  final: {
    lead: "Was an diesem Morgen im Schloss Bückeburg begann, tragen wir seitdem jeden Tag weiter.",
    quote: "Unser Ja war ein Moment.\nUnser Für immer ist alles, was danach kommt.",
    signature: "In Liebe,\nLea & Christoph",
    date: "18 · 07 · 2025",
    image: { src: "/media/final/final-couple.webp", alt: "Lea und Christoph küssen sich unter den Kronleuchtern des Festsaals", width: 2400, height: 3600, focalPoint: "center 58%" },
  },
  audio: {
    title: "Unser Lied",
    artist: "Give Me Everything · Archer Marsh",
    songSrc: "/media/audio/unser-lied.mp3",
    loop: true,
  },
  seo: {
    title: "Lea & Christoph – Unser Ja für immer",
    description: "Die Erinnerungen an unsere Hochzeit am 18. Juli 2025 im Schloss Bückeburg.",
    openGraphTitle: "Lea & Christoph – 18. Juli 2025",
    openGraphDescription: "Ein Tag, der vergangen ist – und doch für immer bei uns bleibt.",
    openGraphImage: "/media/social/og-lea-christoph.jpg",
  },
} as const satisfies WeddingContent;

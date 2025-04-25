'use client';

import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Info, Lightbulb } from "lucide-react";
import { ProcessFlowDiagram } from './diagrams/process-flow';
import { SchedulerAlgorithmDiagram } from './diagrams/scheduler-algorithm';
import { ContextMapDiagram } from './diagrams/context-map';

interface IconProps {
  children: React.ReactNode;
}

function Icon({ children }: IconProps) {
  return <span className="inline-block align-middle">{children}</span>;
}

interface HeadingWithIconProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  icon?: React.ReactNode;
  text: string;
  className?: string;
}

function HeadingWithIcon({ level, icon, text, className = '' }: HeadingWithIconProps) {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  // Generate a clean ID from the text content
  const headingId = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return (
    // @ts-expect-error - TypeScript doesn't handle dynamic JSX elements well
    <Component id={headingId} className={className}>
      {icon && <Icon>{icon}</Icon>} {text}
    </Component>
  );
}

export function DocumentationContent() {
  useEffect(() => {
    // Component initialization
  }, []);

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <HeadingWithIcon 
        level={1} 
        icon="📝" 
        text="Wstępna Analiza i Plan Działania" 
      />
      
      <HeadingWithIcon 
        level={2} 
        icon="📝" 
        text="Cel Dokumentu" 
      />
      
      <p>Cześć! 👋</p>

      <p>
        To moja analiza zadania rekrutacyjnego dotyczącego systemu do układania grafików w Call Center. 
        Zanim zabrałem się za pisanie, postanowiłem najpierw dobrze poznać problemy branży - w końcu lepiej wiedzieć, w co się pakujemy, prawda? 😉
      </p>

      <p>W tym celu przeszukałem internet używając różnych narzędzi (Google, Perplexity, OpenAI, Gemini), żeby:</p>
      <ul>
        <li>Zrozumieć, z jakimi problemami zmaga się branża i konsumenci</li>
        <li>Znaleźć ciekawe case studies i raporty</li>
        <li>Sprawdzić, co może nas zaskoczyć lub zablokować</li>
        <li>Dowiedzieć się, jak inni rozwiązują podobne problemy</li>
      </ul>

      <p>
        Dzięki temu researchowi, mogłem spojrzeć na zadanie z szerszej perspektywy i przygotować tę analizę, która:
      </p>
      <ul>
        <li>Opiera się na dostarczonych wymaganiach</li>
        <li>Uwzględnia znalezione dobre praktyki</li>
        <li>Bierze pod uwagę potencjalne pułapki</li>
        <li>Pokazuje, jak można podejść do problemu</li>
      </ul>

      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Zasada ograniczonego zaufania</AlertTitle>
        <AlertDescription>
          Nie tylko na motocyklu czy w aucie, zawsze stosuje zasadę ograniczonego zaufania. 
          Dlatego zawsze weryfikuje źródła i treści z sieci oraz wygenerowane przez AI. 
          W dobie AI musimy liczyć się z faktem, że modele dalej potrafią halucynować lub mieszać kontekst.
        </AlertDescription>
      </Alert>

      <HeadingWithIcon 
        level={2} 
        icon="📋" 
        text="Wprowadzenie" 
      />

      <p>
        Układanie grafików w Call Center to złożony proces, zależny od założeń biznesowych, podejścia do pracowników oraz oczekiwań klientów. Efektywne rozwiązanie musi uwzględniać nie tylko docelowy czas odpowiedzi, ale również rozwój kadry, koszty operacyjne, zadowolenie klienta końcowego oraz szereg innych czynników. Niniejsza notatka podsumowuje wstępne wymagania i identyfikuje kluczowe obszary do dalszej analizy i dyskusji.
      </p>

      <HeadingWithIcon 
        level={2} 
        icon="📊" 
        text="Dane i Wymagania od Klienta (Wstępne)" 
      />

      <ul>
        <li>Call Center obsługuje kilka kolejek tematycznych np. Sprzedaż, Wsparcie Techniczne, Reklamacje itd.</li>
        <li>Kadra pracownicza wynosi od 20-99 osób (kilkadziesiąt)</li>
        <li>Grafiki układane są 1-4 tygodniowym wyprzedzeniem</li>
        <li>Zapotrzebowanie na pracowników powinno być ułożone w optymalny sposób, aby nie tworzyć overbookingu na grafiku</li>
        <li>Kadra pracownicza może, ale nie musi być wyspecjalizowana w kilku ścieżkach tematycznych</li>
        <li>Każdy pracownik posiada swoją efektywność</li>
        <li>Posiadamy historię połączeń w minionych tygodniach na każdej kolejce, w każdej godzinie w celu tworzenia predykcji</li>
      </ul>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Wydarzenia</AlertTitle>
        <AlertDescription>
          Planowanie grafików powinno nie tylko bazować na backtestingu (analizie wstecznej), ale również uwzględniać wydarzenia planowane. Np. W sytuacji wprowadzenia nowej szaty graficznej do naszego oprogramowania powinniśmy uwzględnić większy przydział dla Wsparcia Technicznego, a przypadku zwiększenia budżetu reklamowego, bądź reklamy w TV, dział sprzedaży.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Lokalizacja działania</AlertTitle>
        <AlertDescription>
          Nie podano, w jakiej lokalizacji działa Call Center, dlatego przyjęto, że mowa o rynku 
          Europejskim. Wymaga to potwierdzenia, gdyż ma kluczowy wpływ na planowanie i przepisy 
          prawa pracy.
        </AlertDescription>
      </Alert>

      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Forma zatrudnienia</AlertTitle>
        <AlertDescription>
            Nie wspominano o formie zatrudnienia kadry, co może być istotne przy planowaniu grafiku dla pracowników zatrudnionych na formie Umowy o Prace. Według <a href="https://kadry.infor.pl/kadry/hrm/zarzadzanie/695658,Praca-w-dzialach-CallContact-Center.html">badania Nowoczesnej Firmy z 2014 roku</a>, aż 58% pracowników zatrudnianych w Call Center pracuję na podstawię klasycznej umowy o pracę, a w krajach skandynawskich ta grupa stanowi aż 2/3 wszystkich zatrudnionych.
        </AlertDescription>
      </Alert>

      <Alert variant="tip">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Szkolenie kadry</AlertTitle>
        <AlertDescription>
          Według <a href="https://scholarworks.waldenu.edu/cgi/viewcontent.cgi?article=13520&context=dissertations">raportu/strategii Walden University z Marca 2022</a>, Europejscy liderzy call center 
          w ramach strategii rozwoju pracowników, stosują rotacje stanowisk na nowe ścieżki 
          tematyczne, co może być istotne przy planowaniu grafiku oraz architekturze oprogramowania.
        </AlertDescription>
      </Alert>

      <Alert variant="tip">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Mierzenie efektywności pracowników</AlertTitle>
        <AlertDescription>
          Podstawowa analiza efektywności pracowników prawdopodobnie będzie obarczona błędem 
          statystycznym, niektóre tematy są bardziej skomplikowane i wymagają większego 
          zagłębienia się w sprawę, dlatego mierzenia efektywności pracowników powinno być 
          mierzone poprzez wpływ różnych czynników takich jak: ścieżka, temat (tagi), 
          doświadczenie, ocena przełożonego, zadowolenie klienta, pewność siebie oraz wiedza. 
          Taka statystyka usprawni dalsze usprawnianie procesu call center oraz procesu ewaluacji.
        </AlertDescription>
      </Alert>

      <HeadingWithIcon 
        level={2} 
        icon="🎯" 
        text="Kluczowe Cele i Priorytetyzacja" 
      />

      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Definicja &quot;Optymalnego&quot; Grafiku</AlertTitle>
        <AlertDescription>
          <p>Należy wspólnie zdefiniować priorytety. Czy głównym celem jest:</p>
          <ul>
            <li>Minimalizacja kosztów</li>
            <li>Maksymalizacja Service Level (np. % połączeń odebranych w X sekund, szybkość rozwiązywania spraw)</li>
            <li>Równomierne obciążenie agentów</li>
            <li>Maksymalizacja satysfakcji pracowników (elastyczność, preferencje)</li>
          </ul>
          <p>
            Konieczne jest ustalenie mierzalnych wskaźników efektywności (KPI), które będą 
            podstawą oceny jakości grafików i działania systemu.
          </p>
        </AlertDescription>
      </Alert>

      <HeadingWithIcon 
        level={2} 
        icon="🛠️" 
        text="Wstępne Założenia Funkcjonalne i Techniczne" 
      />

      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Użytkownicy Systemu</AlertTitle>
        <AlertDescription>
          <ul>
            <li>Planista</li>
            <li>Manager Zespołu</li>
            <li>Agent</li>
          </ul>
          <p>Każda rola wymaga specyficznych funkcjonalności i uprawnień.</p>
        </AlertDescription>
      </Alert>

      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Funkcjonalności Systemu</AlertTitle>
        <AlertDescription>
          <ul>
            <li>Zarządzanie profilami pracowników</li>
            <li>Definiowanie umiejętności i kompetencji</li>
            <li>Planowanie dostępności (dyspozycyjność, urlopy, L4)</li>
            <li>Uwzględnianie preferencji zmianowych</li>
            <li>Generowanie i edycja grafików</li>
            <li>Publikacja grafików dla pracowników</li>
            <li>Raportowanie i analiza</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Integracje</AlertTitle>
        <AlertDescription>
          <p>Potencjalna potrzeba integracji z:</p>
          <ul>
            <li>Systemem HR</li>
            <li>Systemem ACD</li>
            <li>Systemem telefonicznym</li>
            <li>Innymi systemami operacyjnymi</li>
          </ul>
        </AlertDescription>
      </Alert>

      <HeadingWithIcon 
        level={2} 
        icon="📋" 
        text="Proponowane Następne Kroki" 
      />

      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Plan Działania (W warunkach rzeczywistego projektu)</AlertTitle>
        <AlertDescription>
          <p>W rzeczywistym projekcie, idealny scenariusz obejmowałby:</p>
          <ol>
            <li>Warsztaty z Interesariuszami w celu dogłębnego zrozumienia procesów</li>
            <li>Szczegółowa analiza danych historycznych</li>
            <li>Definicja architektury systemu</li>
            <li>Projektowanie UI/UX</li>
            <li>Iteracyjne wdrażanie</li>
          </ol>
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Brakujące Informacje</AlertTitle>
        <AlertDescription>
          <p>W kontekście zadania rekrutacyjnego, brakuje nam następujących kluczowych informacji:</p>
          <ul>
            <li>Dokładne wymagania biznesowe i priorytety (np. czy ważniejszy jest koszt czy jakość obsługi)</li>
            <li>Szczegóły dotyczące form zatrudnienia i przepisów prawa pracy</li>
            <li>Dokładna lokalizacja i strefa czasowa działania</li>
            <li>Szczegóły dotyczące istniejących systemów i potencjalnych integracji</li>
            <li>Preferencje technologiczne i ograniczenia</li>
            <li>Budżet i ramy czasowe projektu</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Alert variant="tip">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Sugerowane Podejście</AlertTitle>
        <AlertDescription>
          <p>W ramach zadania rekrutacyjnego, proponuję:</p>
          <ol>
            <li>Przyjęcie rozsądnych założeń dla brakujących informacji</li>
            <li>Skupienie się na architekturze i algorytmach optymalizacji</li>
            <li>Zaprezentowanie elastycznego rozwiązania, które można dostosować do różnych scenariuszy</li>
            <li>Uwzględnienie potencjalnych rozszerzeń i integracji</li>
          </ol>
        </AlertDescription>
      </Alert>

      <HeadingWithIcon 
        level={1} 
        icon="🔧" 
        text="Technologia" 
      />

      <HeadingWithIcon 
        level={2} 
        icon="⚙️" 
        text="Backend" 
      />

      <p>
        <strong>🏗️ Symfony API</strong><br />
        Wybór Symfony jako frameworka backendowego pozwoli nam na:
      </p>
      <ul>
        <li>Szybkie prototypowanie dzięki gotowym komponentom</li>
        <li>Bezpieczną implementację dzięki wbudowanym mechanizmom bezpieczeństwa</li>
        <li>Łatwą integrację z różnymi systemami dzięki modularnej architekturze</li>
        <li>Efektywne zarządzanie zależnościami przez Composer</li>
        <li>Proste tworzenie dokumentacji API dzięki automatycznym generatorom</li>
      </ul>

      <p>
        <strong>📐 Zasady i Wzorce</strong>
      </p>
      <p>W projekcie będziemy stosować:</p>
      <ul>
        <li>DRY, KISS, SOLID</li>
        <li>DDD (Domain-Driven Design) - skupienie na logice biznesowej</li>
      </ul>

      <HeadingWithIcon 
        level={2} 
        icon="🎨" 
        text="Frontend" 
      />

      <p>
        <strong>🎨 React (Next.js)</strong><br />
        Next.js jako framework Reactowy oferuje:
      </p>
      <ul>
        <li>Automatyczne code splitting</li>
        <li>Wbudowane routing i API routes</li>
        <li>Optymalizację obrazów i statycznych assetów</li>
        <li>Łatwą integrację z backendem</li>
      </ul>

      <HeadingWithIcon 
        level={2} 
        icon="💾" 
        text="Database" 
      />

      <p>
        <strong>💾 MySQL</strong><br />
        MySQL jako baza danych zapewni:
      </p>
      <ul>
        <li>Sprawdzoną i stabilną platformę</li>
        <li>Dobrą wydajność dla typowych operacji CRUD</li>
        <li>Łatwą integrację z Symfony</li>
        <li>Proste zarządzanie relacjami</li>
        <li>Dobrą dokumentację i wsparcie społeczności</li>
      </ul>

      <Alert variant="info">
        <Info className="h-4 w-4" />
        <AlertTitle>Alternatywy</AlertTitle>
        <AlertDescription>
          <p>W przyszłości, przy większej skali projektu, warto rozważyć:</p>
          <ul>
            <li>PostgreSQL dla zaawansowanych funkcji analitycznych</li>
            <li>TimescaleDB dla danych czasowych (przydatne w analizie ruchu)</li>
            <li>Redis dla cache'owania i obsługi sesji</li>
          </ul>
        </AlertDescription>
      </Alert>

      <HeadingWithIcon 
        level={2} 
        icon="🛠️" 
        text="IDE i Narzędzia" 
      />

      <p>
        <strong>🛠️ Środowisko Programistyczne</strong>
      </p>
      <ul>
        <li>Cursor jako główne IDE</li>
        <li>Cloud 3.7 Sonnet dla podstawowego programowania</li>
        <li>Gemini 2.5 pro max dla zaawansowanych zadań</li>
        <li>Git dla kontroli wersji</li>
        <li>Docker dla spójnego środowiska deweloperskiego</li>
      </ul>

      <p>
        <strong>🚀 Optymalizacja Pracy</strong>
      </p>
      <ul>
        <li>Automatyczne formatowanie kodu</li>
        <li>Linting dla utrzymania jakości</li>
        <li>Pre-commit hooks dla sprawdzania kodu</li>
      </ul>

      <HeadingWithIcon 
        level={1} 
        icon="📊" 
        text="Diagramy" 
      />

      <HeadingWithIcon 
        level={2} 
        icon="🔄" 
        text="Przepływ Komunikacji" 
      />

      <ProcessFlowDiagram />

      <HeadingWithIcon 
        level={2} 
        icon="⚙️" 
        text="Algorytm Planowania" 
      />

      <SchedulerAlgorithmDiagram />

      <HeadingWithIcon 
        level={2} 
        icon="🗺️" 
        text="Strategiczna Mapa Kontekstów DDD" 
      />

      <ContextMapDiagram />
    </div>
  );
} 
# Wnioski: przegląd notatek pod kątem przerostu formy nad treścią

Data: 2026-07-06. Ocena szczera i obiektywna (na prośbę).

## Krótka odpowiedź

Notatki **nie są** drogą na skróty — i to jest właśnie problem. Przerost jest
realny, ale w dwóch różnych miejscach, i tylko jedno z nich to „forma nad
treścią" w potocznym sensie.

## Liczby

- **~29 000 słów** treści na 18 notatek. To nie ściąga — to podręcznik.
- Egzamin (spec. Modelowanie i analiza danych) = **13 wspólnych + 7
  specjalnościowych ≈ 20 tematów**. Pokrycie ~18, zakres trafny (słusznie brak
  eksploracji danych i analityki biznesowej — to nie moje specjalności).
- **36 plików wizualizacji, osobny dev-server z live-reload, pipeline KaTeX,
  favicon z progress-ring, tri-state tracker postępu, 3.1 MB archiwum.**

## Dwa różne przerosty

### 1. Przerost treści w środku notatek (przykład: Big Data)

Zagadnienie: *„Porównanie klasycznej analizy danych z analizą Big Data"* — na
obronie ~5-8 minut. Twardy rdzeń: 5V, paradygmat klasyczny (próba +
wnioskowanie, ACID, scale-up, ETL/schema-on-write), paradygmat Big Data (N≈all,
predykcja, scale-out, BASE, ELT/schema-on-read), zdanie o MapReduce, zdanie o
CAP, tabela synteza. Koniec.

Nadmiar w notatce: złożoność HyperLogLog `O(log log n)`, Count-Min Sketch, Bloom
filter, reservoir sampling, Big Data paradox Menga (2018), two cultures
Breimana, formalizacja Gilbert-Lynch 2002, matematyka curse of dimensionality,
poprawka Benjamini–Hochberg. To ~30-40% objętości, której na obronie nie
powiem — a jeśli powiem, otwieram pytania pogłębiające, których nie obronię.
**To nie atut, to zobowiązanie.**

Kontrast: `00_schematy_losowania` jest gęsta, ale każde zdanie jest
egzaminowalne (DEFF, alokacja Neymana, FPC, ρ wewnątrzklasowa) — to właściwy
poziom. Big Data odjechało w stronę seminarium doktoranckiego.

### 2. Przerost formy (groźniejszy)

Ostatnie commity: *„Externalize interactive viz", „client-side KaTeX
rendering", „uv live-reload dev server", „Add favicon", „progress tracker"* —
to inżynieria, nie nauka. Budowanie pięknego systemu do nauki *czuje się* jak
produktywność, ale nie wkłada do głowy ani jednego twierdzenia.

## Czy szukam drogi na skróty?

Raczej odwrotności — i to uspokaja fałszywie. „Skoro notatki są tak dokładne i
ładne, to znaczy, że się przygotowuję." Nie. Obrona to test **aktywnego
przypominania pod presją pytań**, a nie rozpoznawania ładnie ułożonej treści.
Można przeczytać 29k słów pięć razy i zaciąć się na *„proszę porównać ACID i
BASE"*, jeśli nigdy nie powiedziało się tego na głos z zamkniętym ekranem.
Piękno notatek buduje **fałszywą pewność**.

## Plan działania

1. **Zamroź formę.** Zero commitów do toolingu/viz/CSS do egzaminu. Już działa.
2. **Do każdej notatki dopisz na górze 5-6 zdaniowe „to powiem na obronie"** —
   twardy rdzeń. Reszta zostaje jako appendix „gdyby dopytali".
3. **Big Data: przenieś sekcje 6-7 (pułapki teoretyczne, algorytmy
   aproksymacyjne) do zwijanego „ciekawostki".** Nie kasować — odciąć od
   głównego nurtu.
4. **Mów na głos.** Losuj zagadnienie, timer 6 min, bez patrzenia. To jedyna
   brakująca czynność, która realnie liczy się na obronie.

## Werdykt

Treść jest dobra — momentami za dobra. Problem nie w oszukiwaniu nauki, tylko w
tym, że polerowanie (treści i systemu) stało się substytutem powtarzania na
głos.

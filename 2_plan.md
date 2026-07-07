# Plan ciecia notatek pod odpowiedz ustna

Data: 2026-07-06.

Cel tego dokumentu: ocena kazdej notatki jako materialu do odpowiedzi ustnej, nie jako kompendium. "Obciac" nie znaczy usunac z repo. Najrozsadniej: zostawic pelna notatke jako appendix, ale na gorze kazdego pliku dopisac blok "Odpowiedz ustna 5-7 min" i tylko ten blok traktowac jako material pierwszego kontaktu.

## Zasada ogolna

Kazda odpowiedz ustna powinna miec:

1. Definicje problemu w 1-2 zdaniach.
2. 4-6 glownych punktow.
3. Jeden przyklad praktyczny.
4. Jedna pulapke/ograniczenie.
5. Zdanie zamykajace, ktore laczy temat z innym zagadnieniem.

Wszystko, co jest dowodem, historia, wzorem drugiego rzedu, lista narzedzi albo rzadkim edge-case'em, powinno isc do sekcji "Dopytki".

## Priorytety

Najpilniej przyciac: `12_modele_wielowymiarowe`, `14_optymalizacja_wielokryterialna`, `11_sieci_neuronowe`, `10_klasyczne_ml`, `03_regresja_liniowa`, `06_big_data_vs_klasyczna`.

Najblizej dobrego formatu ustnego: `04_wizualizacja`, `05_raportowanie`, `15_cpm_pert`, `17_autoryzacja_podpis`.

## 00_schematy_losowania.html

Ocena: dobra i w wiekszosci egzaminowalna. To jest jedna z notatek, gdzie formalizm ma sens, bo temat dotyczy schematow losowania i precyzji estymacji.

Rdzen odpowiedzi: populacja, proba, operat losowania, prawdopodobienstwo inkluzji, SRS ze zwracaniem/bez, warstwowe, systematyczne, grupowe, wielostopniowe. Koniecznie powiedziec, kiedy ktory schemat ma sens i jaki ma wplyw na wariancje.

Co obciac do dopytek: szczegolowa tabela wariancji, dokladne warianty FPC, wzor na optymalna podprobe w losowaniu wielostopniowym, rozbudowane rozroznienia kosztowe. Zostawic DEFF i alokacje Neymana, ale bez dlugiego rozwijania wzorow.

Co dopisac: krotki blok o "parametrach i rodzajach badan populacji generalnej", bo PDF ma osobny punkt o parametrach i rodzajach badan populacji, a obecna notatka mocno skupia sie na schematach losowania.

## 01_estymatory_wartosci_sredniej.html

Ocena: merytorycznie dobra, ale w odpowiedzi ustnej trzeba ja uproscic. Najwazniejsza jest intuicja: estymator musi odpowiadac schematowi losowania.

Rdzen odpowiedzi: obciazenie, wariancja, MSE, estymator prosty, estymator wazony, Horvitz-Thompson jako wazenie przez `1/pi_i`, estymator ilorazowy/regresyjny jako wykorzystanie zmiennej pomocniczej.

Co obciac do dopytek: pelny dowod nieobciazonosci HT, RRMSE, szczegoly PPS/Hansen-Hurwitz, rzad obciazenia `O(1/n)`, rozbudowane wariancje. Przyklad z dwiema warstwami zostawic, bo jest bardzo dobry ustnie.

Co dopisac: jedno zdanie startowe: "Jesli prawdopodobienstwa wlaczenia sa rowne, zwykla srednia wystarcza; jesli nie, trzeba uzyc wag".

## 02_preprocessing.html

Ocena: dobra, ale miejscami robi sie podrecznik ML. Do ustnego potrzeba mniej wzorow, wiecej procesu.

Rdzen odpowiedzi: etapy preprocessingu, braki danych MCAR/MAR/MNAR, imputacja, outliery, skalowanie, kodowanie kategorii, PCA jako redukcja wymiarow, data leakage jako najwazniejsza pulapka.

Co obciac do dopytek: wzory Rubina przy wielokrotnej imputacji, stala `0.6745` w modified z-score, szczegoly binary/hash encoding, algebra PCA, pelna lista wrazliwosci modeli. W rdzeniu wystarczy regule: drzewa nie wymagaja skalowania, metody odleglosciowe/gradientowe/PCA wymagaja.

Co dopisac: jeden praktyczny pipeline: split danych -> fit preprocessingu na treningu -> transform train/test -> model -> walidacja.

## 03_regresja_liniowa.html

Ocena: bardzo dobra jako kompendium, za ciezka jako odpowiedz ustna. To ma najwieksze ryzyko, ze odpowiedz rozleje sie w diagnostyke zamiast trzymac pytanie z PDF-a.

Rdzen odpowiedzi: model regresji prostej i wielorakiej, OLS jako minimalizacja sumy kwadratow reszt, zalozenia Gaussa-Markowa, analiza modelu przez `R^2`, metryki bledu i wykresy reszt, roznica `statsmodels` vs `sklearn`, interpretacja wspolczynnikow, korelacja vs przyczynowosc.

Co obciac do dopytek: wzor normalny, VIF jako szczegol, Cook/leverage, AIC/BIC, forward/backward selection, robust SE, Newey-West, Durbin-Watson poza krotka wzmianka, wiekszosc wizualnych wariantow. Ridge/Lasso zostawic w jednym akapicie jako regularyzacje, nie jako osobna wycieczke.

Co dopisac: gotowa odpowiedz w kolejnosci "budowa -> dopasowanie -> analiza -> wizualizacja w Pythonie -> ograniczenia".

## 04_wizualizacja.html

Ocena: jedna z najlepszych notatek pod ustny. Jest zwiezla i dobrze trafia w pytanie.

Rdzen odpowiedzi: wizualizacja jako EDA i komunikacja, typ zmiennych determinuje wykres, tabela doboru wykresu, Cleveland-McGill, pulapki typu obcieta os, overplotting, zle palety, biblioteki Python.

Co obciac do dopytek: dystrybuanta/gestosc, formalne kwantyle, reguly doboru liczby binow histogramu, Lie Factor ze wzorem. Te rzeczy sa dobre, ale nie powinny otwierac odpowiedzi.

Co dopisac: jedno zdanie-klucz: "Dobry wykres minimalizuje wysilek poznawczy i maksymalizuje zgodnosc formy z typem danych".

## 05_raportowanie.html

Ocena: dobra, tylko trzeba bardziej skupic ja na "technikach raportowania z uzyciem narzedzi programowania wyzszego rzedu", a mniej na teorii agregacji.

Rdzen odpowiedzi: czym jest raport, typy raportow, Jupyter/R Markdown/Quarto jako literate programming, parametryzacja i automatyzacja, dashboardy, raporty PDF/pixel-perfect, reproducibility i single source of truth.

Co obciac do dopytek: formalizacja funkcji agregujacej na multizbiorach, taksonomia Graya w pelnej wersji, XBRL, dluga lista silnikow raportowych, szczegoly row-level security. Gray zostawic tylko intuicyjnie: SUM sie preagreguje, MEDIAN trudniej.

Co dopisac: przyklad procesu: dane -> analiza w Pythonie/R -> raport Quarto/Jupyter -> parametry -> automatyczne generowanie i dystrybucja.

## 06_big_data_vs_klasyczna.html

Ocena: dobra tresciowo, ale w obecnej formie ma za duzo amunicji na dopytki. To klasyczny przypadek "to nie atut, to zobowiazanie".

Rdzen odpowiedzi: 5V, klasyczna analiza jako proba + inferencja + scale-up + ACID + ETL/schema-on-write, Big Data jako duzy/roznorodny/szybki strumien + scale-out + predykcja + BASE + ELT/schema-on-read. Do tego jedno zdanie o CAP, jedno o MapReduce, jedna tabela syntezy.

Co obciac do dopytek: prawie cala sekcja "Pulapki teoretyczne duzej skali" i "Algorytmy aproksymacyjne": p-value przy `n -> infinity`, paradoks Menga, curse of dimensionality, Benjamini-Hochberg, Breiman, HyperLogLog, Count-Min Sketch, Bloom filter, reservoir sampling. To sa dobre dopytki, ale nie rdzen.

Co dopisac: gotowe 6-minutowe porownanie w osiach: cel, dane, architektura, spojnosc, przetwarzanie, narzedzia, ryzyka.

## 07_mapreduce.html

Ocena: dobra, ale zbyt formalna na start odpowiedzi. Temat z PDF-a pyta o cel, zasade dzialania i zastosowania, nie o pelny model algebraiczny.

Rdzen odpowiedzi: MapReduce jako model rozproszonego przetwarzania par klucz-wartosc, fazy split -> map -> shuffle/sort -> reduce -> output, WordCount jako przyklad, combiner, data locality, fault tolerance, ograniczenia i relacja do Spark.

Co obciac do dopytek: multizbior, monoid, formalna funkcja partycjonujaca, gamma grupowania, subtelnosc sortowania jako decyzji Hadoop, dokladne typy joinow, tuning reducerow, small files problem. W rdzeniu wystarczy powiedziec, ze shuffle jest waskim gardlem.

Co dopisac: prosty pseudoprzyklad WordCount w trzech liniach, bo to najlepiej niesie odpowiedz ustna.

## 08_porownanie_narzedzi.html

Ocena: uzyteczna notatka, ale lista narzedzi moze latwo zamienic sie w wyliczanke bez struktury. Odpowiedz musi byc kryterialna, nie katalogowa.

Rdzen odpowiedzi: porownujemy po skali, latencji, modelu danych, schemacie, trybie batch/stream, gwarancjach, koszcie i kompetencjach zespolu. Potem kilka klas: pandas/DuckDB, Spark, Flink/Kafka, hurtownie MPP, lakehouse, NoSQL/NewSQL, Airflow/dbt.

Co obciac do dopytek: formalne definicje batch/stream jako funkcji, PACELC, exactly-once wewnetrznie, lambda/kappa w detalach, zbyt dlugie listy reprezentantow. Nie trzeba recytowac 30 nazw.

Co dopisac: "heurystyke wyboru" jako glowna odpowiedz: male dane -> pandas/DuckDB; TB/PB batch -> Spark/hurtownia; streaming -> Flink/Kafka; BI -> hurtownia + dbt.

## 09_porownanie_modelowania.html

Ocena: bardzo sensowny temat porownawczy, ale obecnie zbyt akademicki. Dobra odpowiedz ustna powinna byc mapa paradygmatow, nie miniwyklad ze statystyki matematycznej.

Rdzen odpowiedzi: po co modelujemy dane wielowymiarowe; statystyka klasyczna vs ML; nadzorowane vs nienadzorowane; eksploracyjne vs konfirmacyjne; parametryczne vs nieparametryczne; frequentist vs Bayesian; liniowe vs nieliniowe; generatywne vs dyskryminacyjne; bias-variance jako wspolny jezyk.

Co obciac do dopytek: SEM/CFA wskazniki dopasowania, ICA, pelny kernel theorem, Ng-Jordan, double descent, No Free Lunch w pelnej formie, AIC/BIC ze wzorami, SHAP i szczegoly narzedzi.

Co dopisac: odpowiedz zaczynaj od celu: wyjasnienie, predykcja, redukcja wymiaru, klasyfikacja, segmentacja. Dopiero potem dobieraj paradygmat.

## 10_klasyczne_ml.html

Ocena: za obszerna do ustnego. Jest dobra jako atlas modeli, ale potrzebuje bardzo mocnej tabeli syntezy.

Rdzen odpowiedzi: typy uczenia, train/test/CV, metryki klasyfikacji i regresji, bias-variance, najwazniejsze modele: k-NN, drzewa, random forest, gradient boosting, SVM, regresja logistyczna, naive Bayes, k-means, DBSCAN, hierarchiczna. Regularyzacja i pipeline jako zasady praktyczne.

Co obciac do dopytek: RF variance formula, pelny soft-margin SVM, szczegoly kernel trick, wzory NB/LDA/QDA, Optuna/BayesSearch, SMOTE w szczegolach, SHAP/permutation importance, duze fragmenty o implementacjach.

Co dopisac: tabela "model - intuicja - zaleta - wada - kiedy uzyc". To jest bardziej ustne niz obecna narracja.

## 11_sieci_neuronowe.html

Ocena: bardzo dobra technicznie, ale zdecydowanie za szeroka. To jedna z notatek, ktora najbardziej wymaga warstwy "mowie tylko to".

Rdzen odpowiedzi: siec jako kompozycja warstw liniowych i nieliniowosci, perceptron/MLP, funkcje aktywacji, funkcje straty, backprop jako liczenie gradientu, SGD/Adam bardzo krotko, problem znikajacego/eksplodujacego gradientu, CNN/RNN/Transformer jako trzy rodziny architektur, regularyzacja i klasyczne ML vs DL.

Co obciac do dopytek: pelne rownania backprop, Adam momenty, warunki Robbinsa-Monro, twierdzenie uniwersalnej aproksymacji w detalach, Telgarsky, pelne CNN/RNN/Transformer complexity, PyTorch/TensorFlow/JAX/HuggingFace, PEFT/FSDP/ZeRO, double descent, distribution shift.

Co dopisac: odpowiedz w 6 blokach: definicja, uczenie, problemy uczenia, architektury, regularyzacja, kiedy uzyc/nie uzyc.

## 12_modele_wielowymiarowe.html

Ocena: najbardziej przerośnieta notatka. To material na osobny rozdzial statystyki wielowymiarowej, nie jedna odpowiedz ustna.

Rdzen odpowiedzi: dane wielowymiarowe jako wektor cech, macierz kowariancji/korelacji, PCA jako redukcja wymiaru, FA jako czynniki ukryte, LDA/QDA jako klasyfikacja wielowymiarowa, klasteryzacja jako segmentacja, zastosowania w prognozowaniu i decyzjach.

Co obciac do dopytek: MANOVA, CCA, MDS, GMM/EM w szczegolach, Hotelling, Wilks/Pillai/Roy, Bartlett/KMO ze wzorami, Ledoit-Wolf, RDA, BIC/AIC dla GMM, gap statistic, scoring kredytowy w detalach. To sa dobre elementy dla specjalisty, ale za duzo na egzamin ustny.

Co dopisac: rozdzielic mentalnie na dwa pytania z PDF-a: "rola modeli wielowymiarowych" oraz "podobienstwa i roznice koncepcji modelowania". Obecna notatka miesza oba.

## 13_text_mining.html

Ocena: dobra, ale za gesta terminologicznie. Temat z PDF-a jest praktyczny: techniki i metody wydobywania informacji z plikow tekstowych.

Rdzen odpowiedzi: text mining vs NLP, korpus/dokument/token, tokenizacja i lematyzacja, BoW/TF-IDF/embeddingi, podobienstwo kosinusowe, klasyfikacja tekstu, LSA/LDA jako tematy, IE vs IR, pipeline ekstrakcji z HTML/PDF/CSV/JSON, narzedzia Python.

Co obciac do dopytek: Levenshtein DP, metryczne niuanse kosinusa, perplexity i entropie w pelnych wzorach, Dirichlet w LDA, CRF z funkcja partycji, HerBERT/KLEJ, dluga lista narzedzi. W rdzeniu nie trzeba mowic o wszystkim naraz.

Co dopisac: jeden konkretny pipeline: PDF/HTML -> ekstrakcja tekstu -> czyszczenie -> tokenizacja/lematyzacja -> TF-IDF/embedding -> klasyfikacja/NER/wyszukiwanie.

## 14_optymalizacja_wielokryterialna.html

Ocena: mocno przerośnieta. Rdzen jest bardzo dobry, ale obecna notatka wchodzi w poziom zaawansowanej optymalizacji.

Rdzen odpowiedzi: problem wielu kryteriow, brak naturalnego porzadku liniowego w `R^k`, dominacja Pareto, front Pareto, punkt idealny/nadir intuicyjnie, metody: suma wazona, epsilon-ograniczenia, goal programming, MCDA dla wariantow dyskretnych, AHP/TOPSIS jako przyklady, zastosowania.

Co obciac do dopytek: Geoffrion, wlasnosci frontu dla MILP, pelna taksonomia Hwang-Masud, MAUT z aksjomatami, KKT/Fritz-John, Vector LP, ELECTRE/PROMETHEE ze wzorami, NSGA-II/SPEA2/MOEA/D/NSGA-III, hypervolume/GD/IGD, Bayesian MOO. To jest za duze ryzyko otwarcia pytan.

Co dopisac: odpowiedz powinna byc w jezyku badan operacyjnych: "nie ma jednego optimum, jest zbior kompromisow, a preferencje decydenta wybieraja punkt".

## 15_cpm_pert.html

Ocena: dobra notatka, relatywnie bliska formatowi ustnemu. Wymaga tylko przesuniecia kilku zaawansowanych caveatow do dopytek.

Rdzen odpowiedzi: projekt jako DAG, CPM dla deterministycznych czasow, forward pass/backward pass, zapas calkowity i sciezka krytyczna, PERT dla niepewnych czasow z trzema oszacowaniami `a,m,b`, crashing jako kompromis czas-koszt, ograniczenia zasobowe.

Co obciac do dopytek: beta-rozklad w detalach, CTG z warunkami, merge bias/Jensen, LP sformulowanie crashingu, RCPSP/CCPM/GERT, szczegoly typow zaleznosci SS/FF/SF. Zostawic je jako "gdy komisja pyta glebiej".

Co dopisac: mini-przyklad liczbowy z 4 czynnosciami albo przynajmniej opis, jak z tabeli czasow obliczyc sciezke krytyczna.

## 16_bezpieczenstwo_it.html

Ocena: szeroka, ale temat tez jest szeroki. Najwieksze ryzyko to recytowanie list zamiast pokazania warstw obrony.

Rdzen odpowiedzi: model zagrozenia, triada CIA, kryptografia jako fundament, szyfrowanie at rest/in transit/in use tylko haslowo, bezpieczenstwo OS: uprawnienia, izolacja, hardening, bezpieczenstwo aplikacji: OWASP i klasyczne ataki, malware/phishing/DDoS, backup/DR, narzedzia obronne.

Co obciac do dopytek: dokladne koszty atakow na funkcje skrotu, rings -1/-2/-3, SGX/MPC/FHE, CFI/ROP w detalach, SUID/capabilities jako szczegol, pelna taksonomia malware, CVSS/MITRE/SIEM/EDR jako lista narzedzi. OWASP lepiej przedstawic jako kategorie ryzyk, a nie przywiazanie do jednej numeracji.

Co poprawic/sprawdzic: w sekcji narzedzi jest `IC11 - blokowanie IP...`; wyglada jak literowka albo placeholder. Najpewniej chodzilo o `fail2ban` albo podobny mechanizm.

## 17_autoryzacja_podpis.html

Ocena: dobra i logiczna. Do ustnego trzeba ograniczyc kryptografie formalna i skupic sie na rozroznieniach.

Rdzen odpowiedzi: identyfikacja vs uwierzytelnianie vs autoryzacja vs accounting, MFA, modele DAC/MAC/RBAC/ABAC, podpis cyfrowy jako hash + klucz prywatny + weryfikacja kluczem publicznym, PKI i certyfikaty, podpis elektroniczny vs cyfrowy, eIDAS SES/AdES/QES, OAuth vs OIDC, JWT vs sesja.

Co obciac do dopytek: macierz Lampsona formalnie z `2^R`, krata bezpieczenstwa MAC, EUF-CMA, wzor RSA modulo, ECDSA `k`, OCSP/CRL/stapling w detalach, PAdES/XAdES/CAdES profile B/T/LT/LTA, Kerberos/SAML/LDAP/HSM jako dluga lista.

Co dopisac: trzy kontrasty, ktore powinny pasc na glos: AuthN != AuthZ, podpis elektroniczny != podpis cyfrowy, OAuth != logowanie/OIDC.

## Kolejnosc pracy

1. Nie edytowac juz CSS, wizualizacji ani toolingu przed egzaminem.
2. Do kazdej notatki dopisac na gorze sekcje "Odpowiedz ustna 5-7 min".
3. Dla notatek z priorytetu wysokiego przeniesc ciezkie sekcje do "Dopytki".
4. Cwiczyc losowo: pytanie -> 6 minut mowy bez patrzenia -> 2 minuty poprawki.
5. Po kazdej probie dopisac maksymalnie 3 zdania do bloku ustnego, nie przebudowywac calej notatki.

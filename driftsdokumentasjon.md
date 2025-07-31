Jaså? Du har blitt teknisk ansvarlig? Gratulerer!

Hva man gjør som teknisk ansvarlig er litt fritt fram så lenge det er et forsøk på å forbedre livet til foreningen eller styret. Det er derimot mye som er på plass allerede som man på godt og vondt kanskje bør vite hvordan fungerer.

Dette er et forsøk på å dokumentere det en teknisk ansvarlig (forhåpentligvis) kommer til å lure på. Dokumentasjon av noe som helst er aldri komplett, men vi prøver :). Google, eller en nålevende teknisk pamp, er din beste venn om du ikke finner det du leter etter her.

Som teknisk ansvarlig bør man ha brukt et Linux-basert operativsystem før, men jeg har likevel prøvd å rette det mot de som ikke er så kjent med dette.

Det har noen sikkerhetsimplikasjoner å dele detaljer med hele internett, men jeg liker å tro at det enkelt og greit er et "skill issue" om dette får konsekvenser for oss. Ja, det hadde vært vanskeligere for en med onde intensjoner om dette dokumentet ikke eksisterte offentlig, men samtidig ville rotproblemet fortsatt eksistert. Derfor ligger det her. Git gud!

# Zyzz - Servermaskin

_Zyzz_ er vår egen servermaskin som står på PC-rommet vårt. Denne prøver vi å kjøre flest mulig tjenester på, sånn at vi er minst mulig avhengig av tredjeparter.

Serveren kjører operativsystemet [Ubuntu 22.04](https://www.releases.ubuntu.com/22.04/) (Desktop-versjon). Grunnen til at man ikke har gått for server-versjon er at man ønsker et grafisk grensesnitt, da dette er lettere å håndtere for folk flest. I tillegg brukes serveren til å vise [infoskjermen](#Infoskjerm). Her er også grafisk grensesnitt nødvendig.

Serveren er koblet til en dedikert port på nettverksswitchen som står på kontoret. Denne switchen eies av [UiO nettdrift](https://www.usit.uio.no/om/organisasjon/iti/nettdrift/). EDB-gjengen har derimot i skrivende stund mulighet til å konfigurere denne. Konklusjonen er: ikke tukle med nettverksutstyr uten å spørre [EDB-gjengen](https://edb.neuf.no) først.

## SSH - Fjernstyring av servermaskinen

Det er mulig å nå denne maskinen fjernstyrt gjennom SSH. Det kan gjøres ved å skrive inn følgende kommando i en terminal:

```
ssh uiogaming@uiogaming.no
```

Du blir så bedt om å skrive inn passordet. Dette finner du sammen med alle andre passord.

> [!TIP]
> Når man kopierer passordet og limer inn i terminalen må man som regel bruker `Ctrl+Shift+V` for å lime inn. Passordfeltet vil ikke vise noen ting når man skriver eller limer inn tekst.

Vi har valgt å bruke passordautentisering i stedet for å håndtere SSH-nøkler for å gjøre det lettere for andre styremedlemmer med mindre teknisk kompetanse å nå serveren om det skulle være nødvendig. Ja, det har sikkert sikkerhetsimplikasjoner, men you win some you lose some.

> [!NOTE]
> I fremtiden bør man nok gå over til SSH-nøkler samt ha unike brukere for alle som skal ha tilgang til serveren (Gjerne bare teknisk ansvarlig + styreleder). Dette betyr også at alle kjørende applikasjoner må flyttes til en felles mappe på maskinen.

## Nginx - Ruting av nettrafikk

[Nginx](https://nginx.org/en/) er en applikasjon som ruter trafikk. I dette tilfellet referer vi dette til som vår "webserver". Skal du peke en nettaddresse et sted må du gjerne konfigurere noe her.

Her foretrekker jeg å peke deg mot dokumentasjonen til nginx om man er usikker på noe.

Men i korte trekk så er dette viktig å vite:

- Ruting for domenet _uiogaming.no_ ligger i filen `/etc/nginx/sites-available/uiogaming.no`
- Alle rutinger bruker en global konfigurasjonsfil. Denne ligger på `/etc/nginx/global/global.conf`. Sørg for at denne brukes når en ny rute lages.
- Ved endring av konfigurasjonsfil. Sørg for å kjøre kommandoen `sudo nginx -t`, og hvis den ikke klager på noe, kjør så `sudo systemctl restart nginx`

> [!NOTE]
> Nginx sine Konfigurasjonsfiler må redigeres som superbruker. Du må med andre ord skrive `sudo` foran kommandoen.

> [!TIP]
> Om du vil sette opp en ny "rute", se på hva som har blitt gjort for et subdomene med lignende funksjonalitet. Det er gjerne bare å klippe og lime med minimale endringer.

## Brannmur

Vi bruker [ufw](https://en.wikipedia.org/wiki/Uncomplicated_Firewall) til å håndtere brannmurregler. I prinsippet blokkerer vi all trafikk som ikke er nødvendig og må derfor åpne opp hvis vi skal ha noe tilgjengelig for omverdenen.

Det skal derimot nevnes at det meste som trengs rutes gjennom [Nginx](#nginx---ruting-av-nettrafikk). Med andre ord trenger man bare portene for Nginx, altså 80 og 443, åpne. Det er lett å eksponere noe man ikke ønsker på denne måten så det er viktig å passe seg for denne fallgruven.

[Docker](#docker---programvare-for-å-kjøre-applikasjoner) gjør også noe tull med brannmuren som gjør at ting åpnes selv om det tilsynelatende ikke ser sånn ut. Dette bør gjøres noe med. Jeg (Leander Furumo) har ordnet dette på min egen server hjemme så jeg kan eventuelt spørres om dette hvis jeg fortsatt er tilstede. Om ikke er Google og EDB-gjengen din venn.

Les gjerne om _ufw_ på egenhånd.

## Docker - Programvare for å kjøre applikasjoner

[Docker](https://www.docker.com/) er programvare for å lage såkalte virtuelle "containere". Du kan tenke på dette som en egen datamaskin som kjører på datamaskinen. Vi bruker dette til å kjøre så mange applikasjoner som mulig. Grunnen til dette er at de er lette å håndtere. Man kan definere hvordan denne applikasjonen skal være satt opp samt enkelt endre gjennom [docker compose](https://docs.docker.com/compose/) filer. Med Docker unngår vi å skitne til hovedsystemet med mye _dependencies_ og annen programvare som kan komme i konflikt med hverandre.

Hver applikasjon har gjerne en `docker-compose.yml` fil i sin mappe. Denne definerer hvordan containeren skal settes opp. Man kan bruke:

- `docker compose up` for å starte
- `docker compose down` for å stoppe

> [!TIP]
> Legg til `-d` på slutten av `docker compose up` for å unngå at programmet stopper når du lukker terminalen

Greit å lese seg opp mer på egenhånd om man er usikker her.

Følgende applikasjoner kjører ikke som en Docker-container i skrivende stund:

- [Nginx](#nginx---ruting-av-nettrafikk)
- [Spillservere](#Spillservere)

## Postgresql - Databasen

Mange applikasjoner har behov for en database, og til det kjører vi en sentral [Postgres](https://www.postgresql.org/)-instans gjennom [Docker](#docker---programvare-for-å-kjøre-applikasjoner). Denne bør passes godt på da det ligger mye data her. Man kan administrere den gjennom et kommandolinjeverktøy som f.eks [psql](https://www.postgresql.org/docs/current/app-psql.html) eller gjennom grafisk grensesnitt med f.eks [pgAdmin](https://www.pgadmin.org/). Disse er begge installert på servermaskinen.

Når en ny tjeneste skal gis tilgang til databasen anbefaler jeg å lage en ny bruker som bare har tilgang til databasen den skal ha, samt minimale tilganger til denne.

Backup av denne kjøres hver natt i cron job til mappa `/home/uiogaming/Documents/backups/postgres`. Denne mappa tas så backup av med _rsync_ til Leander Furumo sin personlige server off site. Dette gjøres gjennom brukeren `rsync`.

## uiogaming.no - Nettsiden

[Nettsiden](https://github.com/UiO-Gaming/uiogaming.no) består av 2 deler. Det er:

- Frontend
- Backend

Sistnevnte står det mer om [her](#Sanity).

Nettsiden inkluderer et webhook API som gjør at nettsiden holder seg oppdatert med siste info når ting endrer seg i backend. Dette blir cachet derimot så det kan ta litt tid før det dukker opp.

## Umami - Statistikk for nettsiden

[Umami](https://github.com/umami-software/umami) er et alternativ til Google Analytics, som samler inn litt metadata om besøknde på [nettsiden](#uiogamingno---nettsiden). Er det noe vi trenger? Absolutt ikke! Men det er jo litt kult og interessant. Denne hoster vi selv i en [Docker](#docker---programvare-for-å-kjøre-applikasjoner) container så det er litt mer uskyldig enn å sende overvåkningsinfo til O' store Google.

Denne instansen bor på [umami.uiogaming.no](https://umami.uiogaming.no)

## Mustafa - Discord Bot

[Mustafa](https://github.com/UiO-Gaming/mustafa) er vår Discordbot som gjør alt mellom himmel og jord. Mest fjas og kjas. Den har derimot noen viktige funksjoner som er verdt å nevne.

Mustafa har f.eks en "cog", som tar seg av sykronisering av arrangementer lagt ut på Discord over til nettsiden. Dette gjør at styret har en mindre plattform av de 100 som finnes å forholde seg til.

Når foreningen får ny teknisk ansvarlig bør de inviteres til UiO Gaming sin organisasjon på [discord.com/developers](https://discord.com/developers)

## Infoskjerm

Infoskjermen finner man på [infoskjerm.uiogaming.no](https://infoskjerm.uiogaming.no). Dette er en instans av [infoscreen3](https://github.com/reaby/infoscreen3/). Her kan man logge på som _admin_ eller som _viewer_. Passord for begge disse ligger der man finner passord.

![Pasted image 20241022210001](https://github.com/user-attachments/assets/8be188d1-cdfb-4310-82bc-5199f21344e9)

Infoskjermen kan administreres gjennom grensesnittet på samme nettaddresse. Den støtter bilde/video og visning av nettsider.

> [!WARNING]
> Det er i skrivende stund problemer med å logge seg på som "viewer". Man kan derimot også se infoskjermen som adminbruker.

Infoskjermen kjører i et fullskjerms netleservindu som er flyttet til skjermen stående på hovedkontoret. Det går en megalang HDMI-kabel fra serveren på PC-rommet til skjermen på hovedkontoret. Her er det nyttig med trådløst tastatur og mus om man vil flytte på ting.

### Mustaboard

[Mustaboard](https://github.com/UiO-Gaming/mustaboard) er vår egenutviklede infoskjerm og finnes på [mustaboard.uiogaming.no](https://mustaboard.uiogaming.no). Det er en webapplikasjon som samler mest mulig informasjon på en side. Dette er en av nettsidene som vises i infoskjermapplikasjonen vår.

### Entur Tavla

Entur sin _Tavla_ viser informasjon om kollektivtrafikktilbudet i nærheten. Denne kan endres på hos [tavla.entur.no](https://tavla.entur.no/). FIKS ENTURBRUKER TIL FORENINGEN. Dette er også en av nettsidene som vises i infoskjermapplikasjonen vår.

## bebbes - Pizzakalkulator

Her er det ikke så mye å si. Det er vår egenutviklede pizza- og bruskalkulator. Mest laget for moroskyld og bør kanskje ikke tas kjempeseriøst. Den sikter seg egentlig inn på at alle skal få 3 pizzastykker og 0.5 liter brus hver.

[bebbes.uiogaming.no](https://bebbes.uiogaming.no)

[Kode](https://github.com/UiO-Gaming/bebbes)

## Home Assistant

TBD

## stripe-webhook-api

Denne tjenesten sender melding på discord når man har mottatt en betaling i [Stripe](https://stripe.com). Vi bruker Stripe til å motta betaling fra folk som ikke har Vipps.

[Kode](https://github.com/UiO-Gaming/stripe-webhook-api)

> [!WARNING]
> De siste årene har man heller oppfordret til betaling i fysiske sedler/mynter. Man kan i praksis ta ned denne og avvikle bruken av stripe helt sånn det er i dag.

## Uptime-kuma - Statusnettside

UiO Gaming hoster en instans av [uptime-kuma](https://github.com/louislam/uptime-kuma) som er en statussjekker. Den viser hvilke tjenester man kan få kontakt med fra oververdenen og sender melding på Discord om ting går ned.

Det viktige å nevne her er at UiO Gaming hoster status nettside for meg (Leander Furumo) og mine private tjenester som ligger på [furumo.eu](https://furumo.eu). I midlertid hoster jeg UiO Gaming sin statusnettside fra min private server. Grunnen til dette er at det er lite vits å ha en statusside som sjekker seg selv. Om hele serveren plugges ut eller går ned, vil også statussiden gå ned. Da har man kommet like langt.

[status.uiogaming.no](https://status.uiogaming.no) peker altså til [kuma.furumo.eu](https://kuma.furumo.eu)

## Spillservere

Spillservere setter man opp litt etter behov. Vi har som regel en minecraftserver liggende til enhver tid som _ikke_ kjører på Docker pga. problemer med ustabilitet. Det er også satt opp en Counter-Strike 2 server, men denne er kronglete å bruker per nå.

## name-100-uio-gamers

Et web-spill hvor man skal prøve å gjette seg fram til et satt antall UiO Gamere så fort som mulig. Den krever at brukeren er logget inn med Discordbrukeren sin og har rollen for betalende medlemmer. Man kan bare gjette Discordbruker- og kallenavn, og den godtar bare andre betalende medlemmer.

[name100.uiogaming.no](https://name100.uiogaming.no)

[Kode](https://github.com/UiO-Gaming/name-100-uio-gamers)

# Domeneshop

[Domeneshop](https://domene.shop) er der vi har registrert domenet vårt, _uiogaming.no_, hos. Det er også her vi administrerer domenet samt videresending av e-post som går dit.

Standard framgangsmåte for å lage et nytt subdomene er å lage en CNAME-record som peker til uiogaming.no. [Se guide](Hvordan%20%22lage%22%20et%20subdomene%2C%20f.eks%20yeet.uiogaming.no%3F)

# Sanity

[Sanity](https://www.sanity.io/) er et CMS (Content management system) som vi bruker til å redigere utvalgt innhold på nettsiden. Det gir først og fremst et brukervennlig grensesnitt for non-tech nerds til å for eksempel endre bilde og beskrivelse på styremedlemmer osv.

Hosting av denne tjeneste gjøres ikke av oss, men man kan bli omdirigert til den gjennom [admin.uiogaming.no](https://admin.uiogaming.no)

[Kode](https://github.com/UiO-Gaming/uiogaming.no-backend)

# Google Scripts

Vi kjører et par "[Google Scripts](https://script.google.com/home/)", altså små programmer som integrerer med google-tjenester og kjører ved spesielle tilfeller. [Se egen dokumentasjon for de vi har kjørende](https://github.com/UiO-Gaming/drift/tree/main/google%20apps%20script).

Google Scripts sin syntaks er eldgammel Javascript med noen ymse tillegg.

> [!IMPORTANT]
> Disse kjører **ikke** på vår maskinen. Vi er avhengig av Google for denne tjenesten.

# Git og GitHub

[Git](https://git-scm.com/) er et "versjonskontrollsystem". Dette bør du lese deg opp på egenhånd om.

[GitHub](https://github.com/UiO-Gaming) er plattformen vi legger koden til all egenutviklet programvare på. Dette skal også gjøres i fremtiden med mindre det er et særskilt behov for å ikke gjøre det. Jeg kan ikke se for meg noen tilfeller.

I tillegg ligger det ymse andre ting som sakspapirer fra generalforsamlinger og vedtekter. Dette er på eget insj fra meg (Leander Furumo) da jeg ønsker at slike dokumenter skal ligge offentlig og være versjonskontrollert. Jeg stoler heller ikke på at dette er en oppgave styret klarer selv så da har jeg tatt saken i egne hender. Håper på at noen vil føre tradisjonen videre dersom jeg ikke er til stede lenger. Derfor bør jeg legge instruksjoner om detaljer rundt det her en eller annen gang. Men det blir ikke nå :)

# Automatisk deployment

Det er satt opp automatisk deployment for enkelte applikasjoner. Hver gang det pushes til _main_ branch på GitHub vil det kjøres en GitHub Action som logger seg på gjennom SSH og utfører kommandoene den trenger for å oppdatere tjenesten. Dette gjøres gjennom brukeren `github_deploy`.

I skrivende stund fungerer dette for følgende tjenester:

- [uiogaming.no](#uiogamingno---nettsiden)
- [Bebbes](#bebbes---pizzakalkulator)
- [Mustafa](#mustafa---discord-bot)
- [Mustaboard](#mustaboard)
- [name-100-uio-gamers](#name-100-uio-gamers)

# Nyttige guider

## Hvordan "lage" et subdomene, f.eks yeet.uiogaming.no?

### 1. Registrer domenet hos domeneshop

Logg deg inn på domeneshop og naviger til administrasjonssiden for DNS-pekere. Tykke så på "Vis avanserte instillinger".

![Pasted image 20241022203038](https://github.com/user-attachments/assets/eb3d7996-c498-440f-9a8f-7fbb3977913c)

Bla så nederst til du finner et blankt felt. Der vil du skrive inn subdomenet, i dette tilfellet _yeet_, velge CNAME som type og peke mot _uiogaming.no_

![Pasted image 20241022203314](https://github.com/user-attachments/assets/d77cd5a5-1b93-4f6c-8fb0-6e31bd8aa7e3)

Trykk så på `+`-ikonet.

### 2. Rut trafikken riktig sted i Nginx-konfigurasjonen

Åpne filen `/etc/nginx/sites-available/uiogaming.no` i ønsket tekstredigeringsprogram **som superbruker**.

Så kan du kopiere en serverblokk fra ønsket format. Dette kommer an på hva du ønsker å gjøre. Jeg anbefaler å kopiere fra:

- bebbes.uiogaming.no om du skal rute til en applikasjon som kjører på en spesifikk port
- instagram.uiogaming.no om du skal omdirigere en adresse til en annen.
- vedtekter.uiogaming.no om du skal vise returnere et dokument som f.eks en PDF

I dette eksemplet tar vi utgangspunkt i det første

![Pasted image 20241022204155](https://github.com/user-attachments/assets/30814c66-fec3-4305-a56b-f34562aa29da)

Her er det viktig å **ikke** kopiere med delen som er merket med kommentaren _managed by Certbot_ da dette vil automatisk genereres senere.

Legg merke til at `server_name` samt port i `proxy_pass` er endret.

Du kan så lagre filen og teste om du har konfigurrert riktig ved å skrive kommandoen

```
sudo nginx -t
```

Om den ikke klager så har du vært flink!

### 3. Generer SSL-sertifikater

For å få HTTPS og den fine padlocken i nettleseren må vi generere sertifikater. Certbot gjør dette for oss.

Skriv kommandoen:

```
sudo certbot --nginx
```

Du vil så få opp et vindu med mange subdomener. Finn tallet som korresponderer med `yeet.uiogaming.no` og trykk enter.
Om alt gikk fint da kan du så resette nginx-serveren

```
sudo systemctl restart nginx
```

Og vipps så var du ferdig!

## Overføring av filer til servermaskinen

Har du behov for å overføre filer til servermaskinen kan du gjøre det gjennom SSH med programmet [FileZilla](https://filezilla-project.org/).

> [!IMPORTANT]
> Ikke bruk FileZilla til å endre kode for applikasjoner vi kjører! Vennligst gjør dette gjennom git i stedet!

Her er et eksempel på hvordan du kobler deg til.

![Pasted image 20241022205050](https://github.com/user-attachments/assets/68713f57-c1a7-4cd0-98ac-c59a9a25bf24)

## Vedlikehold av servermaskinen

### Programvare

Vedlikehold av servermaskinen går stort sett ut på å sørge for at ting holder oppdatert. Det er satt opp automatiske sikkerhetsoppdateringer gjennom det som heter [unattended-upgrades](https://wiki.debian.org/UnattendedUpgrades), men dette gjelder bare operativsystemet og pakkene som kjører direkte på den.

Derfor er det viktig å også oppdatere [Docker](#docker---programvare-for-å-kjøre-applikasjoner)-bildene som kjører på maskinen. Det kan gjøres slik:

1. Beveg deg inn i mappen til applikasjonen som skal oppdateres
2. Kjør `docker compose pull`
3. Kjør `docker compose restart`

Selv om automatiske sikkerhetsoppdateringer er på så kan det være lurt å kjøre `sudo apt update && sudo apt upgrade` til ymse tider. Merk deg at om Docker er en av pakkene som oppdateres her, så vil alle containere stoppe automatisk. Det bør fikses på slik at disse starter opp igjen automatisk.

### Fysisk

Kan være lurt å børste støv av maskinen en gang i blant :) (både inni og utpå)

## Oppdatere vedtekter

TODO

# Rutiner

- Endre passord for alle tjenester ved styrebytte
- Sjekke tilganger til f.eks GitHub, Google drive og Discord ved styrebytte
- Laste opp og oppdatere sakspapirer samt vedtekter ved generalforsamling. [Se guide](#oppdatere-vedtekter)
- [Vedlikehold av servermaskinen](#vedlikehold-av-servermaskinen)
- Holde denne dokumentasjonen oppdatert? :)

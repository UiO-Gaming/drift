Jaså? Du har blitt teknisk ansvarlig? Gratulerer!

Hva man gjør som teknisk ansvarlig er litt fritt fram så lenge det er et forsøk på å forbedre livet til foreningen eller styret. Det er derimot mye som er på plass allerede som man på godt og vondt kanskje bør vite hvordan fungerer.

Dette er et forsøk på å dokumentere det en teknisk ansvarlig (forhåpentligvis) kommer til å lure på. Dokumentasjon av noe som helst er aldri komplett, men vi prøver :). Google, eller en nålevende teknisk pamp, er din beste venn om du ikke finner det du leter etter her.

Som teknisk ansvarlig bør man ha brukt et Linux-basert operativsystem før, men jeg har likevel prøvd å rette det mot de som ikke er så kjent med dette.

Det har noen sikkerhetsimplikasjoner å dele detaljer med hele internett, men jeg liker å tro at det enkelt og greit er et "skill issue" om dette får konsekvenser for oss. Ja, det hadde vært vanskeligere for en med onde intensjoner om dette dokumentet ikke eksisterte offentlig, men samtidig ville rotproblemet fortsatt eksistert. Derfor ligger det her. Git gud!

# Zyzz - Servermaskin

_Zyzz_ er vår egen servermaskin som står på PC-rommet vårt. Denne prøver vi å kjøre flest mulig tjenester på, sånn at vi er minst mulig avhengig av tredjeparter.

Serveren kjører operativsystemet [Ubuntu 22.04](https://www.releases.ubuntu.com/22.04/) (Desktop-versjon). Grunnen til at man ikke har gått for server-versjon er at man ønsker et grafisk grensesnitt, da dette er lettere å håndtere for folk flest. I tillegg brukes serveren til å vise [infoskjermen](#infoskjerm). Her er også grafisk grensesnitt nødvendig.

Serveren er koblet til en dedikert port på nettverksswitchen som står på kontoret. Denne switchen eies av [UiO nettdrift](https://www.usit.uio.no/om/organisasjon/iti/nettdrift/). EDB-gjengen har derimot i skrivende stund mulighet til å konfigurere denne. Konklusjonen er: ikke tukle med nettverksutstyr uten å spørre [EDB-gjengen](https://edb.neuf.no) først.

## SSH - Fjernstyring av servermaskinen

Det er mulig å nå denne maskinen fjernstyrt gjennom SSH. Det kan gjøres ved å skrive inn følgende kommando i en terminal:

```
ssh uiogaming@uiogaming.no
```

Du blir så bedt om å skrive inn passordet. Dette finner du sammen med alle andre passord.

> [!TIP]
> Når man kopierer passordet og limer inn i terminalen må man som regel bruke `Ctrl+Shift+V` for å lime inn. Passordfeltet vil ikke vise noen ting når man skriver eller limer inn tekst.

Vi har valgt å bruke passordautentisering i stedet for å håndtere SSH-nøkler for å gjøre det lettere for andre styremedlemmer med mindre teknisk kompetanse å nå serveren om det skulle være nødvendig. Ja, det har sikkert sikkerhetsimplikasjoner, men you win some you lose some.

> [!NOTE]
> I fremtiden bør man nok gå over til SSH-nøkler samt ha unike brukere for alle som skal ha tilgang til serveren (Gjerne bare teknisk ansvarlig + styreleder). Dette betyr også at alle kjørende applikasjoner må flyttes til en felles mappe på maskinen.

## Nginx - Ruting av nettrafikk

[Nginx](https://nginx.org/en/) er en applikasjon som ruter trafikk. I dette tilfellet refererer vi til dette som vår "webserver". Skal du peke en nettadresse et sted må du gjerne konfigurere noe her.

Her foretrekker jeg å peke deg mot dokumentasjonen til nginx om man er usikker på noe.

Men i korte trekk så er dette viktig å vite:

- Ruting for domenet _uiogaming.no_ ligger i filen `/etc/nginx/sites-available/uiogaming.no`
- Alle rutinger bruker en global konfigurasjonsfil. Denne ligger på `/etc/nginx/global/global.conf`. Sørg for at denne brukes når en ny rute lages.
- Ved endring av konfigurasjonsfil, sørg for å kjøre kommandoen `sudo nginx -t`, og hvis den ikke klager på noe, kjør så `sudo systemctl restart nginx`

> [!NOTE]
> Nginx sine konfigurasjonsfiler må redigeres som superbruker. Du må med andre ord skrive `sudo` foran kommandoen.

> [!TIP]
> Om du vil sette opp en ny "rute", se på hva som har blitt gjort for et subdomene med lignende funksjonalitet. Det er gjerne bare å klippe og lime med minimale endringer.

## Brannmur

Vi bruker [ufw](https://en.wikipedia.org/wiki/Uncomplicated_Firewall) til å håndtere brannmurregler. I prinsippet blokkerer vi all trafikk som ikke er nødvendig og må derfor åpne opp hvis vi skal ha noe tilgjengelig for omverdenen.

Det skal derimot nevnes at det meste som trengs rutes gjennom [Nginx](#nginx---ruting-av-nettrafikk). Med andre ord trenger man bare portene for Nginx, altså 80 og 443, åpne. Det er lett å eksponere noe man ikke ønsker på denne måten så det er viktig å passe seg for denne fallgruven.

Eksempelvis kjører minecraft på port `25565` og må dermed eksplisitt åpnes
`sudo ufw allow 25565`

[Docker](#docker---programvare-for-å-kjøre-applikasjoner) gjør også noe tull med brannmuren som gjør at ting åpnes selv om det tilsynelatende ikke ser sånn ut. Dette bør gjøres noe med. Jeg (Leander Furumo) har ordnet dette på min egen server hjemme så jeg kan eventuelt spørres om dette hvis jeg fortsatt er tilstede. Om ikke er Google og EDB-gjengen din venn.

Du kan kjøre
`sudo ufw status numbered` for å se hvilke porter vi lar komme gjennom
`sudo ufw allow <PORTNUMMER>` for å åpne en port

Les gjerne mer om _ufw_ på egenhånd da jeg ikke gidder å skrive noe mer :)

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
- [Spillservere](#spillservere)

## Postgresql - Databasen

Mange applikasjoner har behov for en database, og til det kjører vi en sentral [Postgres](https://www.postgresql.org/)-instans gjennom [Docker](#docker---programvare-for-å-kjøre-applikasjoner). Denne bør passes godt på da det ligger mye data her. Man kan administrere den gjennom et kommandolinjeverktøy som f.eks [psql](https://www.postgresql.org/docs/current/app-psql.html) eller gjennom grafisk grensesnitt med f.eks [pgAdmin](https://www.pgadmin.org/). Disse er begge installert på servermaskinen.

Når en ny tjeneste skal gis tilgang til databasen anbefaler jeg å lage en ny bruker som bare har tilgang til databasen den skal ha, samt minimale tilganger til denne.

Backup av alle databasene kjøres hver natt kl. 02:00 som en cron job. Scriptet som kjører er ([`backup/backup_db.sh`](backup/backup_db.sh) som ligger i `/srv/uiogaming/.backups/backup_db.sh` på maskinen. Backups havner i `/srv/uiogaming/.backups/postgres`. Backupene komprimeres og slettes fra servermaskinen etter 14 dager. Denne mappa tas så backup av med _rsync_ til Leander Furumo sin personlige server off site kl. 03:00. Dette gjøres gjennom brukeren `rsync`, som bare har lesetilgang til backupmappa.

## uiogaming.no - Nettsiden

[Nettsiden](https://github.com/UiO-Gaming/uiogaming.no) består av 2 deler. Det er:

- Frontend
- Backend

Sistnevnte står det mer om [her](#sanity).

Nettsiden inkluderer et webhook API som gjør at nettsiden holder seg oppdatert med siste info når ting endrer seg i backend. Dette blir cachet derimot så det kan ta litt tid før det dukker opp.

### Webhook fra Sanity

Nettsiden cacher innhold fra Sanity i 30-60 minutter. For at endringer skal dukke opp med en gang, sender Sanity en melding til nettsiden hver gang noe publiseres. Dette er satt opp som et webhook i [Sanity sitt dashbord](https://www.sanity.io/manage) under _API → Webhooks_.

Verdien til `secret` på slutten av _URL_-feltet til webhooket (`?secret=...`) må være lik `SANITY_REVALIDATE_SECRET` i `.env`-filen til nettsiden på servermaskinen. Om disse ikke stemmer overens svarer nettsiden med `401`, og endringer dukker først opp når cachen går ut. Du kan se om webhooket feiler under _Attempts log_ på samme side i Sanity.

Webhooket oppdaterer blogginnlegg og arrangementer med en gang. Annet innhold, f.eks styremedlemmene på forsiden, kan bruke opptil en time på å dukke opp.

## Umami - Statistikk for nettsiden

[Umami](https://github.com/umami-software/umami) er et alternativ til Google Analytics, som samler inn litt metadata om besøkende på [nettsiden](#uiogamingno---nettsiden). Er det noe vi trenger? Absolutt ikke! Men det er jo litt kult og interessant. Denne hoster vi selv i en [Docker](#docker---programvare-for-å-kjøre-applikasjoner) container så det er litt mer uskyldig enn å sende overvåkningsinfo til O' store Google.

Denne instansen bor på [umami.uiogaming.no](https://umami.uiogaming.no)

## Mustafa - Discord Bot

[Mustafa](https://github.com/UiO-Gaming/mustafa) er vår Discordbot som gjør alt mellom himmel og jord. Mest fjas og kjas. Den har derimot noen viktige funksjoner som er verdt å nevne.

Mustafa har f.eks en "cog", som tar seg av synkronisering av arrangementer lagt ut på Discord over til nettsiden. Dette gjør at styret har en mindre plattform av de 100 som finnes å forholde seg til.

### Hva Mustafa er avhengig av

Mustafa kjører i Docker med `network_mode: host`, altså på samme nettverk som servermaskinen. Det gjør at den når databasen og Minecraft-serveren på `localhost`. Den trenger følgende for å fungere fullt ut:

- **[Postgres](#postgresql---databasen)** - Bursdager, gullkorn, Minecraft-whitelist, stjernetavla, streaks og en del annet lagres her. Botten lager tabellene selv så lenge brukeren den får har tilgang til databasen.
- **Minecraft RCON** - Whitelist-kommandoene kobler til [Minecraft-serveren](#spillservere) på `127.0.0.1:25575`. Minecraft-serveren må derfor kjøre på samme maskin. Denne porten skal **ikke** åpnes i [brannmuren](#brannmur), da RCON gir full kontroll over serveren.
- **Sanity API-token** - Brukes til å synkronisere arrangementer til [nettsiden](#sanity).
- **Galtinn API-token** - Brukes av `/galtinn medlemskap` for å sjekke medlemskap i DNS.

Alt dette fylles inn i `src/config/config.yaml`. Mangler noe av det, skrus funksjonene som trenger det av når botten starter, mens resten fungerer som normalt. Merk at konfigurasjonsfilen kopieres inn i bildet når det bygges, så etter en endring må du kjøre `docker compose up -d --build`.

Når foreningen får ny teknisk ansvarlig bør de inviteres til UiO Gaming sin organisasjon på [discord.com/developers](https://discord.com/developers)

## Infoskjerm

Infoskjermen finner man på [infoskjerm.uiogaming.no](https://infoskjerm.uiogaming.no). Dette er en instans av [infoscreen3](https://github.com/reaby/infoscreen3/). Her kan man logge på som _admin_ eller som _viewer_. Passord for begge disse ligger der man finner passord.

![Pasted image 20241022210001](https://github.com/user-attachments/assets/8be188d1-cdfb-4310-82bc-5199f21344e9)

Infoskjermen kan administreres gjennom grensesnittet på samme nettadresse. Den støtter bilde/video og visning av nettsider.

> [!WARNING]
> Det er i skrivende stund problemer med å logge seg på som "viewer". Man kan derimot også se infoskjermen som adminbruker.

Infoskjermen kjører i et fullskjerms nettleservindu som er flyttet til skjermen stående på hovedkontoret. Det går en megalang HDMI-kabel fra serveren på PC-rommet til skjermen på hovedkontoret. Her er det nyttig med trådløst tastatur og mus om man vil flytte på ting.

### Mustaboard

[Mustaboard](https://github.com/UiO-Gaming/mustaboard) er vår egenutviklede infoskjerm og finnes på [mustaboard.uiogaming.no](https://mustaboard.uiogaming.no). Det er en webapplikasjon som samler mest mulig informasjon på en side. Dette er en av nettsidene som vises i infoskjermapplikasjonen vår.

### Entur Tavla

Entur sin _Tavla_ viser informasjon om kollektivtrafikktilbudet i nærheten. Denne kan endres på hos [tavla.entur.no](https://tavla.entur.no/). FIKS ENTURBRUKER TIL FORENINGEN. Dette er også en av nettsidene som vises i infoskjermapplikasjonen vår.

## bebbes - Pizzakalkulator

Her er det ikke så mye å si. Det er vår egenutviklede pizza- og bruskalkulator. Mest laget for moroskyld og bør kanskje ikke tas kjempeseriøst. Den sikter seg egentlig inn på at alle skal få 3 pizzastykker og 0.5 liter brus hver.

[bebbes.uiogaming.no](https://bebbes.uiogaming.no)

[Kode](https://github.com/UiO-Gaming/bebbes)

## Home Assistant

Ligger på [ha.uiogaming.no](https://ha.uiogaming.no) og er en instans vi bruker for å koble til døråpnerene våre. Her kan du styre de manuelt.

## sesame

Discordbot laget av Mathias Morsund. Den tar seg om åpning og lukking av dørene. Siden dette er hans greie har jeg ikke noe mer å dokumentere per nå. Det er heller ikke open source

## stripe-webhook-api (Deprecated)

Denne tjenesten sender melding på discord når man har mottatt en betaling i [Stripe](https://stripe.com). Vi brukte dette for et par tilfeller i fortiden, men nå har vi en kortterminal man kan ta imot betaling på. Derfor er denne deprecated

[Kode](https://github.com/UiO-Gaming/stripe-webhook-api)

## Uptime-kuma - Statusnettside

UiO Gaming hoster en instans av [uptime-kuma](https://github.com/louislam/uptime-kuma) som er en statussjekker. Den viser hvilke tjenester man kan få kontakt med fra omverdenen og sender melding på Discord om ting går ned.

Det viktige å nevne her er at UiO Gaming hoster statusnettside for meg (Leander Furumo) og mine private tjenester som ligger på [furumo.eu](https://furumo.eu). Imidlertid hoster jeg UiO Gaming sin statusnettside fra min private server. Grunnen til dette er at det er lite vits å ha en statusside som sjekker seg selv. Om hele serveren plugges ut eller går ned, vil også statussiden gå ned. Da har man kommet like langt.

[status.uiogaming.no](https://status.uiogaming.no) peker altså til [kuma.furumo.eu](https://kuma.furumo.eu)

## Spillservere

Spillservere setter man opp litt etter behov. Vi har som regel en minecraftserver liggende til enhver tid som _ikke_ kjører på Docker pga. problemer med ustabilitet. Det er verdt å prøve dockerløsning igjen i fremtiden.

## name-100-uio-gamers

Et web-spill hvor man skal prøve å gjette seg fram til et satt antall UiO Gamere så fort som mulig. Den krever at brukeren er logget inn med Discordbrukeren sin og har rollen for betalende medlemmer. Man kan bare gjette Discordbruker- og kallenavn, og den godtar bare andre betalende medlemmer.

[name100.uiogaming.no](https://name100.uiogaming.no)

[Kode](https://github.com/UiO-Gaming/name-100-uio-gamers)

## Tidligere og uferdige prosjekter

Det ligger noen repoer på [GitHub](https://github.com/UiO-Gaming) som ikke er i bruk. Disse kjører **ikke** på servermaskinen, men er nevnt her så du ikke lurer på hva de er.

### ShiteMusicBot

Musikkbot for Discord som vi brukte så lenge Discord tillot det. Kjører ikke lenger.

[Kode](https://github.com/UiO-Gaming/ShiteMusicBot)

### mus

Et system for registrering og betaling av medlemskap i UiO Gaming og DNS på samme sted, som også skulle holde medlemslisten i Galtinn oppdatert automatisk. Prosjektet ble aldri ferdig, og repoet er arkivert.

[Kode](https://github.com/UiO-Gaming/mus)

### stripe-webhook-api

Se [hva som ble skrevet tidligere](#stripe-webhook-api-deprecated)

# Domeneshop

[Domeneshop](https://domene.shop) er der vi har registrert domenet vårt, _uiogaming.no_, hos. Det er også her vi administrerer domenet samt videresending av e-post som går dit.

Standard framgangsmåte for å lage et nytt subdomene er å lage en CNAME-record som peker til uiogaming.no. [Se guide](#hvordan-lage-et-subdomene-feks-yeetuiogamingno)

# Sanity

[Sanity](https://www.sanity.io/) er et CMS (Content management system) som vi bruker til å redigere utvalgt innhold på nettsiden. Det gir først og fremst et brukervennlig grensesnitt for non-tech nerds til å for eksempel endre bilde og beskrivelse på styremedlemmer osv.

Hosting av denne tjenesten gjøres ikke av oss, men man kan bli omdirigert til den gjennom [admin.uiogaming.no](https://admin.uiogaming.no)

[Kode](https://github.com/UiO-Gaming/uiogaming.no-backend)

## Deploye endringer i Sanity Studio

Sanity Studio, altså redigeringsgrensesnittet, hostes av Sanity på [uiogaming.sanity.studio](https://uiogaming.sanity.studio). I motsetning til de fleste andre tjenestene våre er det **ikke** satt opp [automatisk deployment](#automatisk-deployment) for denne. Endrer du noe i koden, f.eks legger til et nytt felt eller en ny innholdstype, må du deploye manuelt fra din egen maskin:

```
npm install
npx sanity login
npx sanity deploy
```

Siden vi bruker gratisversjonen av Sanity må du logge inn med UiO Gaming sin Google-konto når `npx sanity login` spør. Hvilket prosjekt og hvilken studio som deployes til er allerede satt i `sanity.cli.js`, så du blir ikke spurt om det.

Merk at dette bare gjelder selve grensesnittet. Innhold som publiseres i Sanity trenger ingen deploy, da det hentes av nettsiden direkte. Se [Webhook fra Sanity](#webhook-fra-sanity).

# Google Scripts

Vi kjører et par "[Google Scripts](https://script.google.com/home/)", altså små programmer som integrerer med google-tjenester og kjører ved spesielle tilfeller. [Se egen dokumentasjon for de vi har kjørende](https://github.com/UiO-Gaming/drift/tree/main/google%20apps%20script).

Google Scripts sin syntaks er eldgammel Javascript med noen ymse tillegg.

> [!IMPORTANT]
> Disse kjører **ikke** på vår maskin. Vi er avhengig av Google for denne tjenesten.

# Git og GitHub

[Git](https://git-scm.com/) er et "versjonskontrollsystem". Dette bør du lese deg opp på egenhånd om.

[GitHub](https://github.com/UiO-Gaming) er plattformen vi legger koden til all egenutviklet programvare på. Dette skal også gjøres i fremtiden med mindre det er et særskilt behov for å ikke gjøre det. Jeg kan ikke se for meg noen tilfeller.

I tillegg ligger det ymse andre ting som sakspapirer fra generalforsamlinger og vedtekter. Dette er på eget initiativ fra meg (Leander Furumo) da jeg ønsker at slike dokumenter skal ligge offentlig og være versjonskontrollert. Jeg stoler heller ikke på at dette er en oppgave styret klarer selv så da har jeg tatt saken i egne hender. Håper på at noen vil føre tradisjonen videre dersom jeg ikke er til stede lenger. Derfor bør jeg legge instruksjoner om detaljer rundt det her en eller annen gang. Men det blir ikke nå :)

# Automatisk deployment

Det er satt opp automatisk deployment for enkelte applikasjoner. Hver gang det pushes til _main_ branch på GitHub vil det kjøres en GitHub Action som logger seg på gjennom SSH som brukeren `github_deploy` og kjører `ssh github_deploy@uiogaming.no <tjeneste>`.

SSH-nøkkelen til `github_deploy` har bare lov til å kjøre scriptet [`deploy/uiogaming-deploy`](deploy/uiogaming-deploy), som ligger på servermaskinen som `/usr/local/bin/uiogaming-deploy`. Scriptet oppdaterer repoet til `origin/main` og bygger tjenesten på nytt med `docker compose up -d --build <tjeneste>` fra `/srv/uiogaming/docker-compose.yml`. Det er denne felles compose-fila som eier alle containerne, så `docker-compose.yml` i hvert enkelt repo brukes ikke av deploy. Deploy kan også kjøres manuelt fra _Actions_-fanen i repoet (_Run workflow_).

I skrivende stund fungerer dette for følgende tjenester:

- [uiogaming.no](#uiogamingno---nettsiden)
- [Bebbes](#bebbes---pizzakalkulator)
- [Mustafa](#mustafa---discord-bot)
- [Mustaboard](#mustaboard)
- [name-100-uio-gamers](#name-100-uio-gamers)

## Secrets og variabler

Workflowen (`.github/workflows/deploy.yml`) er lik i alle repoene bortsett fra tjenestenavnet på slutten av `ssh`-kommandoen. Innloggingsinfo hentes fra GitHub sine _secrets_ og _variables_ på organisasjonsnivå, under _Settings → Secrets and variables → Actions_ for [UiO-Gaming](https://github.com/UiO-Gaming), og deles av alle repoene:

| Navn              | Type     | Nivå         | Innhold                               |
| ----------------- | -------- | ------------ | ------------------------------------- |
| `SSH_PRIVATE_KEY` | Secret   | Organisasjon | Privat SSH-nøkkel for `github_deploy` |
| `SSH_USER`        | Secret   | Organisasjon | Brukernavnet, altså `github_deploy`   |
| `SSH_HOST`        | Variable | Organisasjon | `uiogaming.no`                        |

Den offentlige delen av SSH-nøkkelen ligger i `~/.ssh/authorized_keys` til `github_deploy` på servermaskinen, med `restrict,command="/usr/local/bin/uiogaming-deploy"` foran. Byttes nøkkelen må begge stedene oppdateres, men bare én gang siden den deles av alle repoene.

Vil du sette opp automatisk deployment for et nytt repo:

1. Legg til tjenesten i `/srv/uiogaming/docker-compose.yml` og klon repoet til `/srv/uiogaming/<repo>`
2. Legg til tjenesten i `REPO`-lista i [`deploy/uiogaming-deploy`](deploy/uiogaming-deploy), og kopier scriptet til `/usr/local/bin/uiogaming-deploy` på servermaskinen
3. Kopier `deploy.yml` fra et av repoene over og bytt ut tjenestenavnet
4. Sjekk at organisasjonens secrets og variables er tilgjengelige for det nye repoet. De kan være begrenset til utvalgte repoer
5. Kjør `git config --global --add safe.directory /srv/uiogaming/<repo>` som `github_deploy`

# Nyttige guider

## Hvordan "lage" et subdomene, f.eks yeet.uiogaming.no?

### 1. Registrer domenet hos domeneshop

Logg deg inn på domeneshop og naviger til administrasjonssiden for DNS-pekere. Trykk så på "Vis avanserte innstillinger".

![Pasted image 20241022203038](https://github.com/user-attachments/assets/eb3d7996-c498-440f-9a8f-7fbb3977913c)

Bla så nederst til du finner et blankt felt. Der vil du skrive inn subdomenet, i dette tilfellet _yeet_, velge CNAME som type og peke mot _uiogaming.no_

![Pasted image 20241022203314](https://github.com/user-attachments/assets/d77cd5a5-1b93-4f6c-8fb0-6e31bd8aa7e3)

Trykk så på `+`-ikonet.

### 2. Rut trafikken riktig sted i Nginx-konfigurasjonen

Åpne filen `/etc/nginx/sites-available/uiogaming.no` i ønsket tekstredigeringsprogram **som superbruker**.

Så kan du kopiere en serverblokk fra ønsket format. Dette kommer an på hva du ønsker å gjøre. Jeg anbefaler å kopiere fra:

- bebbes.uiogaming.no om du skal rute til en applikasjon som kjører på en spesifikk port
- instagram.uiogaming.no om du skal omdirigere en adresse til en annen.
- vedtekter.uiogaming.no om du skal returnere et dokument som f.eks en PDF

I dette eksemplet tar vi utgangspunkt i det første

![Pasted image 20241022204155](https://github.com/user-attachments/assets/30814c66-fec3-4305-a56b-f34562aa29da)

Her er det viktig å **ikke** kopiere med delen som er merket med kommentaren _managed by Certbot_ da dette vil automatisk genereres senere.

Legg merke til at `server_name` samt port i `proxy_pass` er endret.

Du kan så lagre filen og teste om du har konfigurert riktig ved å skrive kommandoen

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

Vedlikehold av servermaskinen går stort sett ut på å sørge for at ting holdes oppdatert. Det er satt opp automatiske sikkerhetsoppdateringer gjennom det som heter [unattended-upgrades](https://wiki.debian.org/UnattendedUpgrades), men dette gjelder bare operativsystemet og pakkene som kjører direkte på den.

Derfor er det viktig å også oppdatere [Docker](#docker---programvare-for-å-kjøre-applikasjoner)-containerne som kjører på maskinen. Hvordan det gjøres kommer an på om applikasjonen er laget av oss eller av noen andre.

**Applikasjoner andre har laget** (f.eks Umami, Postgres og Home Assistant) bruker ferdige bilder som lastes ned. Disse oppdateres slik:

1. Beveg deg inn i mappen til applikasjonen som skal oppdateres
2. Kjør `docker compose pull`
3. Kjør `docker compose up -d`. Dette lager containerne på nytt med de nye bildene.

**Applikasjoner vi har laget selv** (f.eks uiogaming.no, Mustafa og bebbes) bygges fra kildekoden med `build: .` i `docker-compose.yml`. Her gjør `docker compose pull` ingenting. De fleste av disse oppdateres av seg selv gjennom [automatisk deployment](#automatisk-deployment) hver gang noe pushes til _main_. Må du gjøre det manuelt kan du kjøre `git pull && docker compose up -d --build` i mappen til applikasjonen.

Selv om automatiske sikkerhetsoppdateringer er på så kan det være lurt å kjøre `sudo apt update && sudo apt upgrade && sudo apt autoremove` samt `sudo snap refresh` til ymse tider. Merk deg at om Docker er en av pakkene som oppdateres her, så vil alle containere stoppe automatisk. Det bør fikses på slik at disse starter opp igjen automatisk

### Fysisk

Kan være lurt å børste støv av maskinen en gang i blant :) (både inni og utpå)

## Oppdatere vedtekter

Vedtektsdokumentene er laget med LaTeX og finnes [her](https://github.com/UiO-Gaming/dokumenter/tree/main/styrende%20dokumenter/vedtekter). Jeg liker ikke helt filstrukturen her, men det er et forsøk på å skille mellom norsk og engelsk, samt hva som er gamle og gjeldende vedtekter.

Fordi jeg er veldig nøye på metadata, som ingen egentlig bryr seg om, så foretrekker jeg å gjøre denne prosessen på egenhånd. Så lenge filnavnene som legges ut på GitHub er konsekvente derimot så er jeg fornøyd. Husk også å bruke datoen til den relevante generalforsamlingen på både forsiden samt filnavnene.

Jeg hadde tenkt til å lage et script som automatiserer denne prosessen, men per d.d har ikke dette skjedd.

Vedtektsfilene som man finner på [vedtekter.uiogaming.no](https://vedtekter.uiogaming.no) og [statutes.uiogaming.no](https://statutes.uiogaming.no) ligger i `/var/www/uiogaming.no/vedtekter`. Merk at filene må hete `vedtekter.pdf` og `statutes.pdf` for å fungere.

# Rutiner

- Endre passord for alle tjenester ved styrebytte
- Sjekke tilganger til f.eks GitHub, Google drive og Discord ved styrebytte
- Laste opp og oppdatere sakspapirer samt vedtekter ved generalforsamling. [Se guide](#oppdatere-vedtekter)
- [Vedlikehold av servermaskinen](#vedlikehold-av-servermaskinen)
- Holde denne dokumentasjonen oppdatert? :)

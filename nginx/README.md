# Nginx config

## Ruting

### Nettsider & Tjenester

`uiogaming.no` & `www.uiogaming.no` -> [UiO Gaming frontend](https://github.com/UiO-Gaming/uiogaming.no)

`dev.uiogaming.no` -> UiO Gaming frontend for evt. testing. Ikke alltid i bruk.

`admin.uiogaming.no` -> Omdirigerer til [UiO Gaming backend](https://github.com/UiO-Gaming/uiogaming.no-backend)

`api.uiogaming.no` -> Gatsby rebuild trigger endpoint

`webhooks.uiogaming.no` -> Webhook endpoint for mottagelse av Stripnotifikasjoner

`bebbes.uiogaming.no` -> UiO Gaming sin hjemmesnekra [brus- og pizzakalkulator](https://github.com/UiO-Gaming/bebbes)

`inforskjerm.uiogaming.no` -> Vår instans av [Infoscreen3](https://github.com/reaby/infoscreen3/). Brukes som presentasjonsverktøy.

`mustaboard.uiogaming.no` -> Vår egenutviklede infoskjerm. Er en av tingene som vises på overnevnte `infoskjerm.uiogaming.no`.

`umami.uiogaming.no` -> Vår instans av [Umami](https://github.com/umami-software/umami).

### Dokumenter

`vedtekter.uiogaming.no` -> Returnerer UiO Gaming sine nåværende vedtekter

`lov.uiogaming.no` -> Omdirigerer til `vedtekter.uiogaming.no`

`statutes.uiogaming.no` -> Returnerer UiO Gaming sine nåværende vedtekter (engelsk oversettelse)

`laws.uiogaming.no` -> Omdirigerer til `statutes.uiogaming.no`

`rules.uiogaming.no` -> Omdirigerer til `statutes.uiogaming.no`

### Skjemaer

`innmelding.uiogaming.no` -> Omdirigerer til innmeldingsskjema for UiO Gaming

`join.uiogaming.no` -> Omdirigerer til `innmelding.uiogaming.no`

`klage.uiogaming.no` -> Omdirigerer til klageskjema

`complaint.uiogaming.no` -> Omdirigerer til `klage.uiogaming.no`

`refusjon.uiogaming.no` -> UiO Gaming internt refusjonsskjema

### Spillservere

`mc.uiogaming.no` -> UiO Gaming sin Minecraft-server

`kart.uiogaming.no` -> Dynmap (Minecraft world map på nett) for UiO Gaming sin Minecraft-server

`cs.uiogaming.no` -> UiO Gaming sin Counter-Strike 2 server

`cs-admin.uiogaming.no` -> Web-GUI adminpanel for Counter-Strik 2 serven. Instans av [WebRcon](https://github.com/forewing/webrcon-server)

### Sosiale medier

`discord.uiogaming.no` -> Omdirigerer til invitasjonslenke for UiO Gaming sin Discordserver

`instagram.uiogaming.no` -> Omdirigerer til UiO Gaming sin Instagramkonto

`github.uiogaming.no` -> Omdirigerer til UiO Gaming sin GitHub

`twitch.uiogaming.no` -> Omdirigerer til UiO Gaming sin Twitchkanal

`youtube.uiogaming.no` -> Omdirigerer til UiO Gaming sin YouTubekanal

`facebook.uiogaming.no` -> Omdirigerer til UiO Gaming sin Facebookside

`tiktok.uiogaming.no` -> Omdirigerer til UiO Gaming sin TikTok

### Annet

`pay.uiogaming.no` -> Omdirigerer til betalingstjenesten stripe for betaling av medlemsavgift

`status.uiogaming.no` ligger ikke i nginx-konfigurasjonen da denne rutes til `kuma.furumo.eu` gjennom DNS. Det er fortsatt verdt å nevne at dette subdomenet eksisterer. Siden det ikke er vits å ha en uptime montior på samme server som tjenesten den monitorerer ligger på har vi lagt den her.

`kuma.uiogaming.no` -> [Uptime Kuma](https://github.com/louislam/uptime-kuma) som overvåker tjenester som ligger på `furumo.eu`. Det vil si at disse to serverene monitorerer hverandre.

`liveleak.uiogaming.no` -> Fordi inside jokes er morsomme. Returnerer en GIF.

## Andre ting å merke seg

Alle domener og subdomener knyttet til UiO Gaming støtter og skal støtte HTTPS. Certbot brukes for øyeblikket til å utgi og fornye SSL-sertifikater.

Leander Furumo sin server på `furumo.eu` håndterer sertifikatet for `status.uiogaming.no`

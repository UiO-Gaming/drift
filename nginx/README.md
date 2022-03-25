# Nginx config

## Ruting

`uiogaming.no` & `www.uiogaming.no` -> [UiO Gaming frontend](https://github.com/UiO-Gaming/uiogaming.no)

`dev.uiogaming.no` -> UiO Gaming frontend for evt. testing

`admin.uiogaming.no` -> Omdirigerer til [UiO Gaming backend](https://github.com/UiO-Gaming/uiogaming.no-backend)

`api.uiogaming.no` -> Gatsby rebuild trigger endpoint

`webhooks.uiogaming.no` -> Webhook endpoint for mottagelse av Stripnotifikasjoner

`vedtekter.uiogaming.no` -> Returnerer UiO Gaming sine nåværende vedtekter

`bebbes.uiogaming.no` -> UiO Gaming sin hjemmesnekra brus- og pizzakalkulator

`innmelding.uiogaming.no` -> Omdirigerer til innmeldingsskjema for UiO Gaming

`pay.uiogaming.no` -> Omdirigerer til betalingstjenesten stripe for betaling av medlemsavgift

`discord.uiogaming.no` -> Omdirigerer til invitasjonslenke for UiO Gaming sin Discord-server

`instagram.uiogaming.no` -> Omdirigerer til UiO Gaming sin Instagramkonto

`github.uiogaming.no` -> Omdirigerer til UiO Gaming sin GitHub

`twitch.uiogaming.no` -> Omdirigerer til UiO Gaming sin Twitchkanal

`youtube.uiogaming.no` -> Omdirigerer til UiO Gaming sin YouTubekanal

`facebook.uiogaming.no` -> Omdirigerer til UiO Gaming sin Facebookside

`mc.uiogaming.no` -> UiO Gaming sin Minecraft-server

~~`kart.uiogaming.no` -> Dynmap (Minecraft world map på nett) for UiO Gaming sin Minecraft-server~~ (ikke i bruk lenger)

`cs.uiogaming.no` -> UiO Gaming sin Counter-Strike: Global Offensive scrim server

## Andre ting å merke seg

Alle domener og subdomener knyttet til UiO Gaming støtter og skal støtte HTTPS. Certbot brukes for øyeblikket til å utgi og fornye SSL-sertifikater.

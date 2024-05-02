# Nginx config

## Ruting

`uiogaming.no` & `www.uiogaming.no` -> [UiO Gaming frontend](https://github.com/UiO-Gaming/uiogaming.no)

`dev.uiogaming.no` -> UiO Gaming frontend for evt. testing

`admin.uiogaming.no` -> Omdirigerer til [UiO Gaming backend](https://github.com/UiO-Gaming/uiogaming.no-backend)

`api.uiogaming.no` -> Gatsby rebuild trigger endpoint

`webhooks.uiogaming.no` -> Webhook endpoint for mottagelse av Stripnotifikasjoner

`vedtekter.uiogaming.no` -> Returnerer UiO Gaming sine nåværende vedtekter

`statutes.uiogaming.no` -> Returnerer UiO Gaming sine nåværende vedtekter (engelsk overseettelser)

`laws.uiogaming.no` -> Omdirigerer til `statutes.uiogaming.no`

`rules.uiogaming.no` -> Omdirigerer til `statutes.uiogaming.no`

`bebbes.uiogaming.no` -> UiO Gaming sin hjemmesnekra brus- og pizzakalkulator

`innmelding.uiogaming.no` -> Omdirigerer til innmeldingsskjema for UiO Gaming

`join.uiogaming.no` -> Omdirigerer til innmeldingsskjema for UiO Gaming

`klage.uiogaming.no` -> Omdirigerer til klageskjema

`complaint.uiogaming.no` -> Omdirigerer til klageskjema

`pay.uiogaming.no` -> Omdirigerer til betalingstjenesten stripe for betaling av medlemsavgift

`discord.uiogaming.no` -> Omdirigerer til invitasjonslenke for UiO Gaming sin Discordserver

`instagram.uiogaming.no` -> Omdirigerer til UiO Gaming sin Instagramkonto

`github.uiogaming.no` -> Omdirigerer til UiO Gaming sin GitHub

`twitch.uiogaming.no` -> Omdirigerer til UiO Gaming sin Twitchkanal

`youtube.uiogaming.no` -> Omdirigerer til UiO Gaming sin YouTubekanal

`facebook.uiogaming.no` -> Omdirigerer til UiO Gaming sin Facebookside

`mc.uiogaming.no` -> UiO Gaming sin Minecraft-server

`refusjon.uiogaming.no` -> UiO Gaming internt refusjonsskjema

## Andre ting å merke seg

Alle domener og subdomener knyttet til UiO Gaming støtter og skal støtte HTTPS. Certbot brukes for øyeblikket til å utgi og fornye SSL-sertifikater.

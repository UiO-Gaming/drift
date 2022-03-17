# Google Apps Script

## Triggers

### `processEmails()`

Utløses: 1 gang per time.

Oppgave: Sende melding på Discord hver gang en ny e-post kommer inn i inboks. Den finner disse e-postene ved at alle nye e-poster merkes med en label som fjernes når scriptet har sendt melding til discord om den.

![image](https://user-images.githubusercontent.com/24893890/114754194-98224e00-9d58-11eb-9deb-d27cfe05a38f.png)

_Dette skriptet belager seg på at nye e-poster blir merket med en label. Dette kan enkelt gjøres inni gmail ved å sette opp et e-postfilter_

### `onSubmit()`

Utløses: Ved skjemainnsending.

Oppgaeve: Sende melding til Discord hver gang noen sender inn et innmeldingsskjema. Da kan vi fortest mulig verifisere om personen har betalt medlemskontigent og legge dem inn i medlemsregisteret.

![image](https://user-images.githubusercontent.com/24893890/122639348-a3e41500-d0f9-11eb-8a9f-c1ad4c7d829a.png)

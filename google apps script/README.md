# Google Apps Script

## Triggers

### `processEmails()`

Utløses: 1 gang per time.

Oppgave: Sende melding på Discord hver gang en ny e-post kommer inn i inboks. Den finner disse e-postene ved at alle nye e-poster merkes med en label som fjernes når scriptet har sendt melding til discord om den.

![image](https://user-images.githubusercontent.com/24893890/114754194-98224e00-9d58-11eb-9deb-d27cfe05a38f.png)


### `onSubmit()`

Utløses: Ved skjemainnsending.

Oppgaeve: Sende melding til Discord hver gang noen sender inn et innmeldingsskjema. Da kan vi fortest mulig verifisere om personen har betalt medlemskontigent og legge dem inn i medlemsregisteret.

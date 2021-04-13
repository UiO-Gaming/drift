/*
Sends a message to discord whenever a form is submitted.
*/

var webhookUrl = 'yeet'; // Insert your webhook url here

function onSubmit(e) {
  var discordPayload = {
    content: 'Nytt betalende medlem! <@267415183931080715> <@280753175340908546> <@170506717140877312>'
  }
  UrlFetchApp.fetch(webhookUrl, {
    method: 'post',
    payload: JSON.stringify(discordPayload),
    contentType: 'application/json'
  })
}

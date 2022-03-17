/*
Sends a message to discord whenever a form is submitted.
*/

var webhookUrl = "yeet"; // Insert your webhook url here

function onSubmit(e) {
  var discordPayload = {
    content: "Nytt betalende medlem!",
  };
  UrlFetchApp.fetch(webhookUrl, {
    method: "post",
    payload: JSON.stringify(discordPayload),
    contentType: "application/json",
  });
}

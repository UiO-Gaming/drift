/* 
Goes through all emails labeled with "Send til Discord" and sends a message to discord through discord webhooks
*/

var webhookUrl = 'yeet'; // Insert your webhook url here

function processEmails() {
  var label = GmailApp.getUserLabelByName("Send til Discord");
  var threads = label.getThreads();

  for (var i = threads.length - 1; i >= 0; i--) {
    var messages = threads[i].getMessages();
    var sender = messages[messages.length-1].getFrom();
    sendToDiscord(sender);
    threads[i].removeLabel(label).refresh();
  }
}

function sendToDiscord(sender) {
  var discordPayload = {
    content: '<@267415183931080715> <@170506717140877312> Ny e-post fra: ' + sender
  }
  UrlFetchApp.fetch(webhookUrl', {
    method: 'post',
    payload: JSON.stringify(discordPayload),
    contentType: 'application/json'
  })
}

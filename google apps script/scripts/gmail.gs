/* 
Iterates through all emails labeled with "Send til Discord" and sends a message to discord through discord webhooks
*/

var webhookUrl = "yeet"; // Insert your webhook url here

function processEmails() {
  var label = GmailApp.getUserLabelByName("Send til Discord");
  var threads = label.getThreads();

  for (var i = threads.length - 1; i >= 0; i--) {
    var messages = threads[i].getMessages();
    var sender = messages[messages.length - 1].getFrom();
    sendToDiscord(sender);
    threads[i].removeLabel(label).refresh();
  }
}

function sendToDiscord(sender) {
  var discordPayload = {
    content:
      "<@&761538649786417152> <@&761538899289833472> Ny e-post fra: " + sender,
  };
  UrlFetchApp.fetch(webhookUrl, {
    method: "post",
    payload: JSON.stringify(discordPayload),
    contentType: "application/json",
  });
}

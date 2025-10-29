function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // New fields
    var fullName = data.fullName || 'Non fourni';
    var email = data.email || 'Non fourni';
    var phone = data.phone || 'Non fourni';
    var pickup = data.pickup || 'Non fourni';
    var destination = data.destination || 'Non fourni';
    var appointment = data.appointment || 'Non fourni';
    var message = data.message || 'Aucun';

    var recipient = "sboudour02@gmail.com";
    var subject = "Nouvelle demande de réservation de " + fullName;
    var body = "Vous avez reçu une nouvelle demande de réservation via votre site web.\n\n" +
               "Voici les détails:\n\n" +
               "Nom et prénom : " + fullName + "\n" +
               "Email : " + email + "\n" +
               "Téléphone : " + phone + "\n" +
               "Point de départ : " + pickup + "\n" +
               "Point d'arrivée : " + destination + "\n" +
               "Date et heure : " + appointment + "\n\n" +
               "Message supplémentaire:\n" + message;

    MailApp.sendEmail(recipient, subject, body);

    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success'
    })).setMimeType(ContentService.MimeType.JSON)
      .withHeaders({'Access-Control-Allow-Origin': '*'});

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'error': error.toString()
    })).setMimeType(ContentService.MimeType.JSON)
      .withHeaders({'Access-Control-Allow-Origin': '*'});
  }
}

function doGet(e) {
  try {
    var properties = PropertiesService.getScriptProperties();
    var count = properties.getProperty('visitCount');
    
    count = (count === null) ? 1 : parseInt(count) + 1;
    
    properties.setProperty('visitCount', count);

    return ContentService.createTextOutput(JSON.stringify({ count: count }))
      .setMimeType(ContentService.MimeType.JSON)
      .withHeaders({'Access-Control-Allow-Origin': '*'});

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .withHeaders({'Access-Control-Allow-Origin': '*'});
  }
}
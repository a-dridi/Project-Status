export class TextLanguages {
   public language: string;
   public key: string;
   public value: string;

   constructor(language, key, value) {
      this.language = language;
      this.key = key;
      this.value = value;
   }

   //Email and SMS template text for several languages
   public static getTextLanguages() {
      let textLanguagesMap = new Map();
      //English
      textLanguagesMap.set("enemailProjectStartedSubject", new TextLanguages('en', 'emailProjectStartedSubject', 'Work started - Project: '));
      textLanguagesMap.set("enemailProjectStartedTextGreeting", new TextLanguages('en', 'emailProjectStartedTextGreeting', 'Thank you for choosing me for your project.' + '<br><br>' + 'Work on your project has started. '));
      textLanguagesMap.set("enemailProjectStartedTextProjectlink", new TextLanguages('en', 'emailProjectStartedTextProjectlink', 'This is the link to your project: '));
      textLanguagesMap.set("enemailProjectStartedTextProjectstatuslink", new TextLanguages('en', 'emailProjectStartedTextProjectstatuslink', 'You can check the project status at this url: '));
      textLanguagesMap.set("enemailProjectStartedTextProjectEnd", new TextLanguages('en', 'emailProjectStartedTextProjectEnd', 'This is the date (approximately) when this project will be completed: '));
      textLanguagesMap.set("enemailProjectStartedTextFooter", new TextLanguages('en', 'emailProjectStartedTextFooter', 'If you have any questions, then feel free to contact me.' + '<br><br>' + 'Kind regards, '));
      textLanguagesMap.set("enemailProjectStageFinishedTextGreeting", new TextLanguages('en', 'emailProjectStageFinishedTextGreeting', 'This project step was completed: '));
      textLanguagesMap.set("enemailProjectStepProjectStepTitle", new TextLanguages('en', 'emailProjectStepProjectStepTitle', 'Project Step'));
      textLanguagesMap.set("enemailProjectStepFinishedTitle", new TextLanguages('en', 'emailProjectStepFinishedTitle', 'finished'));
      textLanguagesMap.set("enemailProjectFinishedSubject", new TextLanguages('en', 'emailProjectFinishedSubject', 'Project completed - Project: '));
      textLanguagesMap.set("enemailProjectFinishedText", new TextLanguages('en', 'emailProjectFinishedText', 'Your project was completed. '));
      textLanguagesMap.set("enemailProjectFinishedFooter", new TextLanguages('en', 'emailProjectFinishedFooter', 'For more information please refer to our other emails or documentation.' + '<br><br>' + 'Kind regards, '));
      textLanguagesMap.set("enemailAppWebsiteURL", new TextLanguages('en', 'emailAppWebsiteURL', 'http://myapp.com/status/')); //change "myapp.com" to the domain name of your app

      textLanguagesMap.set("ensmsProjectStartedSubject", new TextLanguages('en', 'smsProjectStartedSubject', 'Work started - Project: '));
      textLanguagesMap.set("ensmsProjectStartedTextGreeting", new TextLanguages('en', 'smsProjectStartedTextGreeting', 'Thank you for choosing me for your project.' + '\n' + 'Work on your project has started. '));
      textLanguagesMap.set("ensmsProjectStartedTextProjectlink", new TextLanguages('en', 'smsProjectStartedTextProjectlink', 'This is the link to your project: '));
      textLanguagesMap.set("ensmsProjectStartedTextProjectstatuslink", new TextLanguages('en', 'smsProjectStartedTextProjectstatuslink', 'You can check the project status at this url: '));
      textLanguagesMap.set("ensmsProjectStartedTextProjectEnd", new TextLanguages('en', 'smsProjectStartedTextProjectEnd', 'This is the date (approximately) when this project will be completed: '));
      textLanguagesMap.set("ensmsProjectStartedTextFooter", new TextLanguages('en', 'smsProjectStartedTextFooter', 'If you have any questions, then feel free to contact me.' + '\n' + 'Kind regards, '));
      textLanguagesMap.set("ensmsProjectStageFinishedTextGreeting", new TextLanguages('en', 'smsProjectStageFinishedTextGreeting', 'This project step was completed: '));
      textLanguagesMap.set("ensmsProjectFinishedSubject", new TextLanguages('en', 'smsProjectFinishedSubject', 'Project completed - Project: '));
      textLanguagesMap.set("ensmsProjectFinishedText", new TextLanguages('en', 'smsProjectFinishedText', 'Your project was completed. '));
      textLanguagesMap.set("ensmsProjectFinishedFooter", new TextLanguages('en', 'smsProjectFinishedFooter', 'For more information please refer to our other emails or documentation.' + '\n' + 'Kind regards, '));
      textLanguagesMap.set("ensmsAppWebsiteURL", new TextLanguages('en', 'smsAppWebsiteURL', 'http://myapp.com/status/')); //change "myapp.com" to the domain name of your app

      //Deutsch
      textLanguagesMap.set("deemailProjectStartedSubject", new TextLanguages('de', 'emailProjectStartedSubject', 'Projekt gestartet - Projekt: '));
      textLanguagesMap.set("deemailProjectStartedTextGreeting", new TextLanguages('de', 'emailProjectStartedTextGreeting', 'Danke, dass Sie mich für das Projekt ausgewählt haben. ' + '<br><br>' + 'Die Arbeit an Ihrem Projet hat begonnen. '));
      textLanguagesMap.set("deemailProjectStartedTextProjectlink", new TextLanguages('de', 'emailProjectStartedTextProjectlink', 'Das ist der Link zu Ihrem Projekt: '));
      textLanguagesMap.set("deemailProjectStartedTextProjectstatuslink", new TextLanguages('de', 'emailProjectStartedTextProjectstatuslink', 'Sie können den Status Ihres Projekts unter dieser Website überprüfen: '));
      textLanguagesMap.set("deemailProjectStartedTextProjectEnd", new TextLanguages('de', 'emailProjectStartedTextProjectEnd', 'Das ist das Datum an dem das Projekt (ungefähr) abgeschlossen sein wird: '));
      textLanguagesMap.set("deemailProjectStartedTextFooter", new TextLanguages('de', 'emailProjectStartedTextFooter', 'Wenn Sie Fragen haben, dann können Sie mich gerne kontaktieren. ' + '<br><br>' + 'Mit freundlichen Grüßen, '));
      textLanguagesMap.set("deemailProjectStageFinishedTextGreeting", new TextLanguages('de', 'emailProjectStageFinishedTextGreeting', 'Dieser Projektschritt wurde abgeschlossen: '));
      textLanguagesMap.set("deemailProjectStepProjectStepTitle", new TextLanguages('de', 'emailProjectStepProjectStepTitle', 'Projektschritt'));
      textLanguagesMap.set("deemailProjectStepFinishedTitle", new TextLanguages('de', 'emailProjectStepFinishedTitle', 'abgeschlossen'));
      textLanguagesMap.set("deemailProjectFinishedSubject", new TextLanguages('de', 'emailProjectFinishedSubject', 'Projekt abgeschlossen - Projekt: '));
      textLanguagesMap.set("deemailProjectFinishedText", new TextLanguages('de', 'emailProjectFinishedText', 'Ihr Projekt wurde abgeschlossen. '));
      textLanguagesMap.set("deemailProjectFinishedFooter", new TextLanguages('de', 'emailProjectFinishedFooter', 'Weitere Informationen finden Sie in unseren anderen E-Mails oder Dokumentationen.' + '<br><br>' + 'Kind regards, '));
      textLanguagesMap.set("deemailAppWebsiteURL", new TextLanguages('de', 'emailAppWebsiteURL', 'http://myapp.com/status/')); //change "myapp.com" to the domain name of your app

      textLanguagesMap.set("desmsProjectStartedSubject", new TextLanguages('de', 'smsProjectStartedSubject', 'Projekt gestartet - Projekt: '));
      textLanguagesMap.set("desmsProjectStartedTextGreeting", new TextLanguages('de', 'smsProjectStartedTextGreeting', 'Danke, dass Sie mich für das Projekt ausgewählt haben. ' + '\n' + 'Die Arbeit an Ihrem Projet hat begonnen. '));
      textLanguagesMap.set("desmsProjectStartedTextProjectlink", new TextLanguages('de', 'smsProjectStartedTextProjectlink', 'Das ist der Link zu Ihrem Projekt: '));
      textLanguagesMap.set("desmsProjectStartedTextProjectstatuslink", new TextLanguages('de', 'smsProjectStartedTextProjectstatuslink', 'Sie können den Status Ihres Projekts unter dieser Website überprüfen: '));
      textLanguagesMap.set("desmsProjectStartedTextProjectEnd", new TextLanguages('de', 'smsProjectStartedTextProjectEnd', 'Das ist das Datum an dem das Projekt (ungefähr) abgeschlossen sein wird: '));
      textLanguagesMap.set("desmsProjectStartedTextFooter", new TextLanguages('de', 'smsProjectStartedTextFooter', 'Wenn Sie Fragen haben, dann können Sie mich gerne kontaktieren.' + '\n' + 'Mit freundlichen Grüßen, '));
      textLanguagesMap.set("desmsProjectStageFinishedTextGreeting", new TextLanguages('de', 'smsProjectStageFinishedTextGreeting', 'Dieser Projektschritt wurde abgeschlossen: '));
      textLanguagesMap.set("desmsProjectFinishedSubject", new TextLanguages('de', 'smsProjectFinishedSubject', 'Projekt abgeschlossen - Projekt: '));
      textLanguagesMap.set("desmsProjectFinishedText", new TextLanguages('de', 'smsProjectFinishedText', 'Ihr Projekt wurde abgeschlossen. '));
      textLanguagesMap.set("desmsProjectFinishedFooter", new TextLanguages('de', 'smsProjectFinishedFooter', 'Weitere Informationen finden Sie in unseren anderen E-Mails oder Dokumentationen.' + '\n' + 'Mit freundlichen Grüßen, '));
      textLanguagesMap.set("desmsAppWebsiteURL", new TextLanguages('de', 'smsAppWebsiteURL', 'http://myapp.com/status/')); //change "myapp.com" to the domain name of your app

      return textLanguagesMap;
   }
}
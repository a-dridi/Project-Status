/**
 * Available languages for email and SMS templates 
 */
export class Languages {

   public static getLanguages() {
      let languages = [
         { code: "en", name: "English" },
         { code: "de", name: "Deutsch" }
      ];

      return languages;
   }
}
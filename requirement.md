Please analyze @data.json and create a simple web application that will display each chapter of the Quran with the following information:

- Surah name
- Surah number
- Surah ayahs

The idea is that there's an index page that displays all the surahs and when you click on a surah, you are redirected to a page that displays the entire surah.

The entire surah should have a title and all the verses. There should be a multi-select dropdown at the top that allows you to select what languages you want to see the surah in. The user can choose multiple languages (by default, it should select only Bosnian; German, Arabi and English should be deselected).

The background of the page should be dark and the text should be light, preferably white.

Each verse should be "selectable" in a sense that it has an #id, so that when I open the page, let's say: localhost:3000/surah/2#36, it will load the entire surah and automatically scroll to the verse 36.

There should be a "Previous" and "Next" button that allows you to navigate through the surah (at the top and bottom of the page).

On the index page, there should be a "Continue reading" button that will take you to the last verse you were reading. The user should be able to mark the last verse they were reading and have that saved in local storage.

Additionally, there should be an option to "bookmark" a verse. When you bookmark a verse, it should be saved in the browser's local storage with an optional text input for a note. Bookmarks should be searchable in their own section in the web application.


The application should be responsive and should work on all devices.
The application should be built using Tailwind CSS.
You can consider using TypeScript.


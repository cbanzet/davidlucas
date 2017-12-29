// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    firebaseConfig: {
		    apiKey: "AIzaSyCbQJksrhQ8kBZCDGlmyzxoGAIXMmCbMic",
		    authDomain: "david-lucas-paris-dev.firebaseapp.com",
		    databaseURL: "https://david-lucas-paris-dev.firebaseio.com",
		    projectId: "david-lucas-paris-dev",
		    storageBucket: "david-lucas-paris-dev.appspot.com",
		    messagingSenderId: "618080544800"
    }
};
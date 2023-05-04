// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    kontent: {
        azureFunctionUrl:
            'https://kontent-ai-api-reference-dev.azurewebsites.net/api/buildApiReferenceJson/{{apiReferenceCodename}}?code=4A205xrXtIEJlTC8LA1cYn-1hb6lTEmelXF07S35C7UmAzFuo2rzNQ==',
        defaultCourseCodename: 'management_api_v2'
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

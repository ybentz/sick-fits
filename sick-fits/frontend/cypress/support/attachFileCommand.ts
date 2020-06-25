// Add custom command for using <input type="file" />
// https://github.com/cypress-io/cypress/issues/170#issuecomment-616851405
Cypress.Commands.add(
  'attachFile',
  {
    prevSubject: 'element',
  },
  (
    input: HTMLInputElement,
    fileName: string,
    fileType: string
  ): Cypress.Chainable<HTMLInputElement> => {
    return cy
      .fixture(fileName)
      .then((content) => Cypress.Blob.base64StringToBlob(content, fileType))
      .then((blob) => {
        const testFile = new File([blob], fileName, { type: fileType })
        const dataTransfer = new DataTransfer()

        dataTransfer.items.add(testFile)
        input[0].files = dataTransfer.files
        return input
      })
  }
)

// Reference: https://github.com/cypress-io/add-cypress-custom-command-in-typescript/blob/master/cypress/support/commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * @memberof Chainable
       * @param input
       * @param fileName
       * @param fileType
       */
      attachFile: (
        input: HTMLInputElement,
        fileName: string,
        fileType: string
      ) => Cypress.Chainable<HTMLInputElement>
    }
  }
}

// Removes an error for declaring `global`
// https://stackoverflow.com/a/59499895/2278329
export {}

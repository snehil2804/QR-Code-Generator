// Import necessary npm packages
import inquirer from 'inquirer'; // Inquirer package for getting user input
import qr from 'qr-image'; // QR-image package for converting URL to QR code image
import fs from 'fs'; // Native Node.js filesystem module for creating a text file

// Prompt user to enter a URL and file name using Inquirer
inquirer
  .prompt([
      // Ask the user for a URL
      {
          type: 'input', // Input field type
          name: 'url', // Name of the input field
          message: 'Enter the URL:', // Message displayed to the user
          validate: function(value) { // Validate URL input
              const urlRegExp = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[:\/]{0,1}[a-zA-Z0-9\.\&\?\/\=\-_%]*/;
              if (!urlRegExp.test(value)) {
                  return 'Please enter a valid URL.';
              }
              return true;
          }
      },
      // Ask the user for a file name
      {
          type: 'input', // Input field type
          name: 'outputFile', // Name of the input field
          message: 'Enter the output file name (without extension):', // Message displayed to the user
          validate: function(value) { // Validate file name input
              if (!value) {
                  return 'Please enter a file name.';
              }
              return true;
          }
      },
  ])
  .then((answers) => { // Process the user input upon receiving it
      const url = answers.url; // Assign the user-entered URL to a variable
      const outputFile = answers.outputFile + '.png'; // Add file extension to user-entered file name

      // Generate a QR code image from the URL
      try {
          const qrCode = qr.image(url); // Create a QR code image from the URL

          // Save the QR code image to a file
          qrCode.pipe(fs.createWriteStream(outputFile)); // Save the QR code image to the specified file

          console.log(`QR code image saved to ${outputFile}`); // Display success message
      } catch (error) {
          console.error('Error generating QR code image:', error); // Display error message
      }
  })
  .catch((error) => { // Handle any errors that occur during the process
      console.error(error);
  });
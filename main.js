 
let usedNumbers = [];

function generateNumber() {
    // Get the user's name
    const name = document.getElementById('name').value;
    
    // Check if the user has entered a name
    if (name.length === 0) {
      // The user has not entered a name, display an error message
      alert('Please enter your name.');
    } else {
      // Check if the user has already generated a number
      const database = firebase.database();
      database.ref('records').once('value', snapshot => {
        const data = snapshot.val();
        let found = false;
        for (const key in data) {
          const record = data[key];
          if (record.name === name) {
            found = true;
            break;
          }
        }
        
        if (found) {
          // The user has already generated a number, display an error message
          alert('You have already generated a number.');
        } else {
          // The user has not generated a number, generate a new number
          let number;
          do {
            number = Math.floor(Math.random() * 9) + 1;
          } while (usedNumbers.includes(number));
          usedNumbers.push(number);
          
          // Add the user's name and number to the database
          database.ref('records').push({
            name: name,
            number: number
          });
          
          // Display the results in the table
          const table = document.getElementById('results-table');
          const row = table.insertRow();
          const nameCell = row.insertCell(0);
          const numberCell = row.insertCell(1);
          nameCell.innerHTML = name;
          numberCell.innerHTML = number;
          
          // Disable the generate button
          document.getElementById('generate-button').disabled = true;
        }
      });
    }
  }
// On page load, reset the usedNumbers array and retrieve the records from the database
window.addEventListener('load', () => {
    usedNumbers = [];
    
    // Get a reference to the Firebase database
    const database = firebase.database();
    
    // Retrieve the records from the database
    database.ref('records').once('value', snapshot => {
      // Clear the table
      const table = document.getElementById('results-table');
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
      
      // Insert the new records into the table
      const data = snapshot.val();
      for (const key in data) {
        const record = data[key];
        const row = table.insertRow();
        const nameCell = row.insertCell(0);
        const numberCell = row.insertCell(1);
        nameCell.innerHTML = record.name;
        numberCell.innerHTML = record.number;
        
        // Add the used numbers to the usedNumbers array
        usedNumbers.push(record.number);
      }
    });
  });
  
  
    
const fs = require('fs');
const bcrypt = require('bcrypt');


dataPath = "user.json" ;
// Callback version

// the main function 
function logInCheck(username, password, data)
{
    if (!data)
    {
        console.log(`data isn't empty file  data base`);
        return 0;
    }
    // const dataArray = JSON.parse(data);
    // for (let i = 0; i < dataArray.length; i++) {
    //     let helper = dataArray[i];
    //     console.log(`This is the arr: ${JSON.stringify(helper)}`);

    // }
    const dataArray = JSON.parse(data);
    for (let i = 0; i < dataArray.length; i++) {
        let helper = dataArray[i];
        console.log(`This is the array item: ${JSON.stringify(helper)}`);

        if (helper.username === username && helper.password === password) {
            console.log("✅ User logged in successfully!");
            return 1;
        }
    }

}

function loginUser(username, password, logInCheck)
{
    if (!username || !password)
    {
        console.log(`can't pass in empty username or passwprd`);
        return 1;
    }
    const data = fs.readFile(dataPath, 'utf8', (err, data)=>
    {
        if (err)
        {
            console.error('Error reading file:', err);
            return;
        }
        console.log("data base file is exist");
        logInCheck(username, password, data);
    });
}



function main() {

   loginUser("rayane", "3", logInCheck);
}

main();


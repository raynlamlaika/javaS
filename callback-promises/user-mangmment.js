// const fs = require('fs');
// const bcrypt = require('bcrypt');


// dataPath = "user.json" ;
// // Callback version

// // the main function 
// function logInCheck(username, password, data)
// {
//     let flag = true;
//     if (!data || !data.trim())
//     {
//         console.log(`data isn't empty file  data base`);
//         return;
//     }
//     else
//     {
//         const dataArray = JSON.parse(data);
//         for (let i = 0; i < dataArray.length; i++) {
//             let helper = dataArray[i];
//             console.log(`This is the array item: ${JSON.stringify(helper)}`);
    
//             // if (helper.username === username && helper.password === password) {
//             //     console.log("✅ User logged in successfully!");
//             // }
//             // next is compirte with bcrypt 
//             bcrypt.compare(password, helper.password, (err, isMatch) => {
//                 if (err) {
//                     console.error("❌ Error comparing passwords:", err);
//                     return;
//                 }

//                 if (isMatch)
//                 {
//                     console.log("✅ User logged in successfully!");
//                     return ;
//                 }
//                 else {
//                     console.log("❌ Incorrect password.");
//                     return ;

//                 }
//             });
//         }
//         console.log(`the ${username} not fond`);
//     }

// }

// async function loginUser_Callback(username, password, logInCheck)
// {
//     if (!username || !password)
//         console.log(`can't pass in empty username or passwprd`);
//     else
//     {
//         const data =  fs.readFile(dataPath, 'utf8', (err, data)=>
//         {
//             if (err)
//             {
//                 console.error('Error reading file:', err);
//                 return;
//             }
//             console.log("data base file is exist");
//             logInCheck(username, password, data);
//         });
//     }
// }

// function main()
// {
//     //login check
//     loginUser_Callback("rayane", "3", logInCheck);
// }



// main();

















const fs = require('fs').promises;
const bcrypt = require('bcrypt');

const dataPath = "user.json";

// Main login check
function logInCheck(username, password, data)
{
    if (!data || !data.trim()) {
        console.log("❌ Database is empty or file missing");
        return;
    }

    let dataArray;
    try {
        dataArray = JSON.parse(data);
    } catch (err) {
        console.error("❌ Error parsing JSON:", err);
        return;
    }

    // Find the user by username
    const user = dataArray.find(u => u.username === username);

    if (!user) {
        console.log("❌ User not found");
        return;
    }

    // Compare password
    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
            console.error("❌ Error comparing passwords:", err);
            return;
        }

        if (isMatch) {
            console.log("✅ User logged in successfully!");
        } else {
            console.log("❌ Incorrect password.");
        }
    });
}

// Login function using callback

function readUserData(callback) {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('❌ Error reading file:', err);
            return;
        }
        console.log("✅ Database file loaded");
        callback(data); // Pass the data to the next step
    });
}

function loginUser_Callback(username, password, logInCheck) {
    if (!username || !password) {
        console.log("❌ Can't pass empty username or password");
        return;
    }

    readUserData((data) => {
        logInCheck(username, password, data);
    });
}

// sign-in with the app

function usercheck(data, username)
{
    if (!data || !data.trim()) {
        console.log("❌ Database is empty or file missing");
        return;
    }

    let dataArray;
    try {
        dataArray = JSON.parse(data);
    } catch (err) {
        console.error("❌ Error parsing JSON:", err);
        return;
    }

    // Find the user by username
    const user = dataArray.find(u => u.username === username);

    if (!user) {
        return 0;
    }
    return 1;
}



async function TakeUserData(user, hashedPassword) {
    try {
        // 1️⃣ Read existing users
        let users = [];
        try {
            const data = await fs.readFile(dataPath, 'utf8');
            if (data && data.trim()) {
                users = JSON.parse(data);
            }
        } catch (err) {
            // If file does not exist, start with empty array
            if (err.code !== 'ENOENT') throw err;
        }

        // 2️⃣ Add the new user
        users.push({ username: user, password: hashedPassword });

        // 3️⃣ Write back the full array
        await fs.writeFile(dataPath, JSON.stringify(users, null, 2));
        console.log('✅ User written successfully!');
    } catch (err) {
        console.error('❌ Error writing file:', err);
    }
}

// async function sign(username, password, confirmpassword,data)
// {
//     let hashedpassword;
//     if (!username || !password || !confirmpassword)
//         return;
    
//     if (password !== confirmpassword)
//     {
//         console.log(`the pass word isn't the same `);
//         return;
//     }
//     const exists = usercheck(data, username)
//     if (exists)
//     {
//         console.log(`user-name is all ready exist ${username} u can't sing-in`);
//         return;
//     }
//     hashedpassword = await bcrypt.hash(password, 10);
//     await TakeUserData(username, hashedpassword);

// }

async function sign(username, password, confirmpassword, data)
{
    let hashedpassword;

    // FIX: Throw errors instead of returning
    if (!username || !password || !confirmpassword)
        throw new Error("All fields are required.");
    
    if (password !== confirmpassword)
    {
        throw new Error("The passwords are not the same.");
    }

    const exists = usercheck(data, username)
    if (exists)
    {
        throw new Error(`user-name is all ready exist ${username} u can't sing-in`);
    }

    hashedpassword = await bcrypt.hash(password, 10);
    await TakeUserData(username, hashedpassword);

    // Add a success log
    console.log(`✅ User signed up successfully: ${username}`);
}

// This function RETURNS a Promise that holds the data.
function readUserDataAsync() {
    
    return new Promise((resolve, reject) => {
        
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                console.error('❌ Error reading file:', err);
                reject(err); // Fails the promise
                return;
            }
            console.log("✅ Database file loaded");
            resolve(data); // Completes the promise with the data
        });
    });
}
// function singin_Callback(username, password, confirmpassword, sign)
// {
//     readUserDataAsync(async (data) => {
//         try{
//             console.error("--- SIGN UP FAILED ---");

//             await sign(username, password, confirmpassword, data);
//         }
//         catch (error) {
//             console.error("--- SIGN UP FAILED ---");
//             console.error(error.message);
//         }
//     });
// }
async function signUp_Async(username, password, confirmpassword, sign)
{
    try {
        // FIX: Call fs.readFile directly and await it.
        // This replaces readUserData and readUserDataAsync
        const data = await fs.readFile(dataPath, 'utf8');

        // Now call sign, which is also awaited
        await sign(username, password, confirmpassword, data);
    
    } catch (error) {
        // This will now catch errors from fs.readFile OR sign
        console.error("--- SIGN UP FAILED ---");
        console.error(error.message);
    }
}

function main()
{
    
    // loginUser_Callback("rayane", "1234", logInCheck);
    signUp_Async("rr", "1234", "1234", sign)

}

main();



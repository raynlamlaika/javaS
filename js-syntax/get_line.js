const fs = require('fs').promises;





var data ="";
async function  openFile(filepath)
{
    try{
        data = await fs.readFile(filepath, 'utf8');
    }catch(err)
    {
        console.log(`errorr in  opening the file`);
        process.exit(1)
    }
    console.log(`file opeined all good`);

}


async function readlines(data, lines){
    let buffer = '';
    let i = 0;
    if (!data || data.length == 0 || lines <= 0)
    {
        console.log(`what that ur trynna do func wont work`);
    }
    for (const char of data)
    {
        if (char === '\n')
        {
        
            console.log(`this is buffer :${buffer.trim()}`);
            buffer = '';
            i++;
            if (i >= lines)
                break ;
        }else
            buffer += char;
        
    }
    if (buffer && i < lines) {
             console.log(`this is buffer: ${buffer.trim()}`);
    }

}



async function main() {
    const argv = process.argv[2];
    const lines = parseInt(process.argv[3]);

    if (!argv || isNaN(lines)) {
        console.log("Usage: node script.js <filepath> <number_of_lines>");
        process.exit(1);
    }

    await openFile(argv);          // wait for the file to be read
    await readlines(data, lines);  // now data is ready
}

main();

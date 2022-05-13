#! /usr/bin/env node
const yargs = require('yargs')
const chalk = require('chalk')
const fs = require('fs')

//Configure CLI commands and options
const {file,priceDb} = yargs.options(
    {'f':{
        alias:'file',
        describe:'Specify a journal file',
        demandOption: true,
        requiresArg: true,
        nargs:1,
        type: 'string'},
    's':{
        alias:'sort',
        describe:'Sort entries by specified criteria',
        demandOption: false,
        requiresArg: true,
        nargs:1,
        type: 'string'},
    'p':{
        alias:'price-db',
        describe:'Translate commodities prices to main currency',
        demandOption: false,
        requiresArg: true,
        nargs:1,
        type: 'string'},
    }).command({
        command: ['balance','bal'],
        describe: 'Performs balance',
        handler(argv) {
            console.log("Printing the balance for:", 
                (argv._.slice(1)))
        }
    }).command({
        command: ['register','reg'],
        describe: 'Returns register',
        handler(argv) {
            register(argv.file)
        }
    }).command({
        command: 'print',
        describe: 'Prints journal file',
        handler(argv) {
           printJournal(argv.file)
    }
}).argv

function readJournal(file){
    const entries = [];
    fs.readFileSync(file,'utf-8')
        .split("\n")
        .map(line=>{
            if(line.includes("!include")){ //Include specified files
                entries.push(...readJournal(line.split(' ')[1]))
            } else{
                if(!    /^\s*;/ .test(line) //Ignore ledger comments ";"
                &&line.length>0             //Ignore empty lines
                &&  /^\d|^\s+\w/   .test(line)){    //Only accept lines beginning with a number or a whitespace followed by a character
                    entries.push(line)
                }
            }
        })
    return entries
}

function groupEntries(arr){//group entries by post of the journal
    const result = []
    let counter = -1
    arr.forEach(element => {
        if(Boolean(parseInt(element[0]))){
            counter++
            result.push([])
        }
        result[counter].push(element)
    })
    return result
}

function printJournal(file){
    groupEntries(readJournal(file)).forEach(entry=>{
        entry.forEach(line=>console.log(line))
        console.log("")
    })
}

function register(file){
    let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] //for easy date conversion

    groupEntries(readJournal(file)).forEach(entry=>{
        let [date,description] = ["",""];
        let transactions = [];
        entry.forEach(line=>{
            if(Boolean(parseInt(line[0]))){//if line starts with a number, it is the start of a post

                //Get date and format "YY-Month-DD"
                date = line.match(/^\d+\/\d+\/\d+/)[0].split("/")
                date[0]-=2000
                date[1] = months[date[1]-1]
                date = date.join("-")

                //Get description
                description = line.split(/ \**/).slice(1).join(' ')

            } else{

                let match = line.match(/\$\s*[^\s]+|\s+[^\s]+\s+BTC/) //Search amount (TODO:support different currencies)

                if (match!=null){ //If there was a match, convert it to a number
                    match = parseFloat(match[0].replace(/\$|,/g,""))
                }

                transactions.push([ //Push the transaction info: concept and amount
                    line.match(/^\s*[^\t]+/)[0],
                    match
                ])
            }
        })

        if(transactions.length==2&&transactions[1][1]==null){ //If an amount is not specified for a concept, ledger assumes a negative amount to balance it
            transactions[1][1]=transactions[0][1]*-1
        }

        
        let sum = 0; //Keep track of the amount sum (TO DO: Support multiple currencies)

        //Print the register report
        for(let i=0;i<transactions.length;i++){
            sum+=transactions[i][1]
            let number = transactions[i][1]

            //format amount and sum
            number = number>=0?number.toLocaleString():chalk.red(number.toLocaleString());
            let sumStr = sum>=0?sum.toLocaleString():chalk.red(sum.toLocaleString());

            if(i==0){ //First line of each post must have date and description
                console.log(date,description,"\t",chalk.blue(transactions[i][0].trim()),number,sumStr)
            }
            else{ //(TO DO: Figure out how to align output)
                console.log("\t\t\t\t",chalk.blue(transactions[i][0].trim()),number,sumStr)
            }
        }
    })
}
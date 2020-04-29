const inquirer = require('inquirer') //import inquirer
const fs = require('fs').promises //fs promises API
const axios = require('axios') //get requests and use callbacks using axios
let avatarURL

const questions = [
    {
        message: 'Enter the title of your project: ',
        name: 'title',
        type: 'input',
        default: 'Default Project Title'
    },
    
    {
        message: 'Enter a description for your project: ',
        name: 'description',
        type: 'input',
        default: 'This is adefault description...'
    },
    
    {
        message: 'Enter the installation procedure(s): ',
        name: 'installation',
        type: 'input',
        default: 'Default installation process...'
    },
    
    {
        message: 'Provide instructions for the usage: ',
        name: 'usage',
        type: 'input',
        default: 'Default usage instructions...'
    },
    
    {
        message: 'Select your license: ',
        name: 'license',
        type: 'list',
        choices: ['MIT', 'EPL', 'Apache']
    },
    
    {
        message: 'How can this be contributed to: ',
        name: 'contributing',
        type: 'input',
        default: 'Default contributing procedure...',
    },
    
    {
        message: 'Testing procedures:',
        name: 'tests',
        type: 'input',
        default: 'Default tests...'
    }
]

promptUsername()
    .then(githubAPI)
    .then(promptQuestions)
    .then(generateReadMe)
    .then(writeReadMe)


//prompt user for their github username
function promptUsername(){
    return inquirer.prompt({
        message: 'Enter your github username: ',
        name: 'username'
    })
}

async function githubAPI({username}){
    try{
        const githubUser = await axios.get(`https://api.github.com/users/${username}`)
        avatarURL = githubUser.data.avatar_url
    } catch(err){
        console.log(err)
    }
}

function promptQuestions(){
    return inquirer.prompt(questions)
}

function generateReadMe(answers){
    let badgeURL
    if (answers.license === 'MIT'){
        badgeURL = 'https://img.shields.io/apm/l/vim-mode'
    }
    else if (answers.license === 'EPL') {
        badgeURL = 'https://img.shields.io/eclipse-marketplace/l/notepad4e'
    }
    else if (answers.license === '') {
        badgeURL = 'https://img.shields.io/aur/license/android-studio'
    }

     // Return the string to be used to generate the readme.md
    return `\n# ${answers.title}
            \n![](${badgeURL})
            \n## Description
            \n${answers.description}
            \n## Table of Contents
            \n1. [Installation](#Installation)
            \n2. [Usage](#Usage)
            \n3. [License](#License)
            \n4. [Contributing](#Contributing)
            \n5. [Tests](#Tests)
            \n6. [Questions](#Questions)
            \n## Installation
            \n${answers.installation}
            \n## Usage
            \n${answers.usage}
            \n## License
            \nLicensed under ${answers.license}
            \n## Contributing\n${answers.contributing}
            \n## Tests\n${answers.tests}
            \n## Questions
            \nEmail: 'hidden'
            \n\n\n![Profile Image](${avatarURL})`
}

async function writeReadMe(content) {
    try{
        await fs.writeFile('generateREADME.md', content)

    } catch (err) {
        console.log(err)
    }
}
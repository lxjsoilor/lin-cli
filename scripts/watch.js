const fs = require('fs')
const filePath = './packages/**/*'
fs.watch(filePath, (event,filename)=> {
    console.log(filename);
    
    if(filename){
        require('./build')
    }
})
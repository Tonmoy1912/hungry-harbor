const jwt=require('jsonwebtoken');

const token=jwt.sign({name:"Tonmoy biswas"},"secret");
// console.log(token);

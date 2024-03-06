const bcrypt=require('bcrypt');

async function test(){
    const salt=await bcrypt.genSalt(10);
    console.log(salt);
}

test();
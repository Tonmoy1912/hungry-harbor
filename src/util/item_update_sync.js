
export function itemUpdateSync(userId){
    try{
        fetch(`${process.env.SS_HOST}/api/items/item-update`, {
            cache: "no-store",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Pass-Code": process.env.PASS_CODE
            }
        });
    }
    catch(err){
        console.log("Faild to sync item update",err.message);
    }
}
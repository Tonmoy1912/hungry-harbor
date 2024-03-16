const curDate=new Date();
// console.log(curDate.toDateString());
// console.log(curDate.toLocaleDateString());

function getFormatedDate(date){
    let str=date.toDateString();
    let arr=str.split(" ");
    return arr[2]+" "+arr[1];
}
console.log(getFormatedDate(new Date()));
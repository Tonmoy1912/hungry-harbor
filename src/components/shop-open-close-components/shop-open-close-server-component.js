"use server"
import { mongoConnect } from '@/config/moongose';
import OpeningTimes from '@/models/opening-time/openingTimeSchema';

export async function getOpeningTime() {
    try {
        await mongoConnect();
        const data = await OpeningTimes.find({});
        if (data.length == 0) {
            return null;
        }
        return data[0];
    }
    catch(err){
        // console.log(err.message);
        return null;
    }
}

export async function OpenShop(){
    try{
        await mongoConnect();
        await OpeningTimes.deleteMany({});
        return true;
    }
    catch(err){
        return false;
    }
}

export async function CloseShop(){
    try{
        await mongoConnect();
        await OpeningTimes.create({});
        return true;
    }
    catch(err){
        return false;
    }
}
import { db } from "../database/database.js";
import { ObjectId } from "mongodb";

export const getPoll = async(req, res) =>{
    try {
        const polls = await db.collection("poll").find().toArray();
        return res.status(200).send(polls);
    } catch (error) {
        return res.sendStatus(500);
    }

}

export const getChoice = async(req, res) =>{
    const pollId = req.params.id;
    try {
        const exists = await db.collection("poll").findOne({_id: new ObjectId(pollId)});
        if(!exists){
            return res.sendStatus(404);
        } else{
            const choices = await db.collection("choice").find({pollId: pollId}).toArray();
            return res.status(200).send(choices);
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export const getResult = async(req, res) =>{
    const pollId = req.params.id;
    try {
        const exists = await db.collection("poll").findOne({_id: new ObjectId(pollId)});
        if(!exists){
            return res.sendStatus(404);
        } else{
            const options = await db.collection("choice").find({pollId: pollId}).toArray();
            let counter = 0;
            let options_id = [];
            let options_title = [];
            while(counter < options.length){
                options_id.push(options[counter]._id);
                options_title.push(options[counter].title);
                counter++;
            }
            const votes = await db.collection("vote").find().toArray();
            let quant = [];
            for(let i = 0; i < options_id.length; i++){
                let k = 0;
                for(let j = 0; j < votes.length; j++){
                    if(votes[j].vote_id === options_id[i].toString()){
                        k++;
                    }
                }
                quant.push(k);
            }
            let max = 0;
            for(let i = 0; i < quant.length; i++){
                if(max < quant[i]){
                    max = quant[i];
                }
            }
            let index = quant.indexOf(max);
            const send = {
                _id: pollId,
                title: exists.title,
                expireAt: exists.expireAt,
                result: {
                    title: options[index].title,
                    votes: max
                }
            }
            return res.status(200).send(send);
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
}
import { db } from "../database/database.js";
import { pollSchema, choiceSchema } from "../schemas/schemas.js";
import { ObjectId } from "mongodb";


export const postPoll = async(req, res) =>{
    const today = new Date();
    const expire = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);
    const formattedDate = expire.toISOString().slice(0, 16).replace('T', ' ');
    const {title, expireAt = formattedDate} = req.body;
    const validation = pollSchema.validate(req.body);
    if(validation.error){
        return res.sendStatus(422);
    }
    try{
        const intoDB = {
            title: title,
            expireAt: expireAt
        }
        await db.collection("poll").insertOne(intoDB);
        return res.status(200).send('passou do schema');
    } catch{
        return res.sendStatus(500);
    }
}

export const postChoice = async(req, res) => {
    const {title, pollId} = req.body;
    const validation = choiceSchema.validate(req.body);
    if(validation.error){
        console.log(title);
        console.log(pollId);
        return res.sendStatus(422);
    }

    try {
        const exists = await db.collection("poll").findOne({_id: new ObjectId(pollId)});
        if(!exists){
            console.log(exists);
            return res.sendStatus(404);
        } else{
            const now = new Date();
            const compare = new Date(exists.expireAt);
            if(now.getTime() > compare.getTime()){
                return res.sendStatus(403)
            }
            const find = await db.collection("choice").findOne({pollId: pollId, title: title});
            if(find){
                return res.sendStatus(409);
            }
            const intoDB = {
                title: title,
                pollId: pollId
            }
            await db.collection("choice").insertOne(intoDB);
            return res.sendStatus(201);
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export const postVote = async (req, res) =>{
    const vote_id = req.params.id;
    const exists = await db.collection("choice").findOne({_id: new ObjectId(vote_id)});
    if(!exists){
        return res.sendStatus(404);
    } else{
        const pollId = exists.pollId;
        const findTime = await db.collection("poll").findOne({_id: new ObjectId(pollId)});
        const time = new Date(findTime.expireAt);
        const now = new Date();
        if(now.getTime() > time.getTime()){
            return res.sendStatus(403)
        }
        const year = now.getUTCFullYear();
        const month = now.getUTCMonth() + 1;
        const day = now.getUTCDate();
        const hour = now.getUTCHours();
        const minute = now.getUTCMinutes();
        const final = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const intoDB = {
            vote_id: vote_id,
            time: final
        }
        await db.collection("vote").insertOne(intoDB);
        return res.sendStatus(201);
    }
}
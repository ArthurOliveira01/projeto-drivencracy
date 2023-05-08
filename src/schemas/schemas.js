import Joi from "joi";

export const pollSchema = Joi.object({
    title: Joi.string().required().min(1),
    expireAt: Joi.string().pattern(new RegExp(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)).optional().custom((value) => {
        let expire;
        if(value === undefined){
            const today = new Date();
            expire = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);
            value = expire;
            return value;
        }
        return value;
    })
})

export const choiceSchema = Joi.object({
    title: Joi.string().required().min(1),
    pollId: Joi.string().required()
})
import Event from "../models/events.model.js";

//CREATE
const create = async (req, res) => {
    try{
        const event = new Event({
            ...req.body,
            createdBy:req.auth._id // call user who created it
        });
        await event.save();
        return res.status(201).json({
            success:true,
            message:"Event created successfull",
            data:event,
        });
    }
    catch (err){
        return res.status(400).json({
            success:false,
            message:err.message
        });
    }
};

// LIST ALL

const list = async (req,res) =>{
    try{
        const events = await Event.find().sort({createdAt:-1})
        res.json(events);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};
//list one

const read = async (req, res) => {
    return res.json(req.event);
};

// UPDATE
const update = async (req, res) => {
    try{
        let event = req.event;
        event = Object.assign(event,req.body);
        await event.save();

        return res.json({
            success:true,
            message:"Event updated",
            data:event,
        });
    } catch (err){
        res.status(400).json({ error: err.message });
    }
};

//DELETE

const remove = async (req, res) => {
    try{
        const event = req.event;
        await event.deleteOne();

        return res.json({
            success:true,
            message:"event removed"
        });
    } catch (err){
         res.status(400).json({ error: err.message });
    }
};

//param  MIDDLEWARE (loads events from mongodb)

const eventByID = async (req, res, next, id) => {
    try{
        const event = await Event.findById(id);

        if (!event)
            return res.status(404).json({ error: "Event not found" });

        req.event = event;
        next();

    }catch(err){
        return res.status(400).json({ error: "Invalid ID" });
    };
};

export default  {create,list,read,update,remove,eventByID};

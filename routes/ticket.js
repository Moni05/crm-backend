const express = require("express");
const router = express.Router();

const Ticket = require("../models/ticket");
const verifyToken = require("../middleWare/verifyAccessToken");
const { createNewTicketReqValidation, replyTicketReqValidation } = require("../middleWare/dataValidation");

router.post("/", createNewTicketReqValidation, verifyToken, async(req, res) => {

    try{
        
        const _id = req.user.id;

        const newTicket = new Ticket({
            clientId: _id,
            subject: req.body.subject,
            conversations: [{
                sender: req.body.sender,
                message: req.body.message,
            },]
        })
    
        const savedTicket = await newTicket.save();

        res.status(200).send("New ticket has been created");
    } 
    catch(err){
        res.status(500).send(err);
    }

})

router.get("/", verifyToken, async(req, res) => {
    
    try{
        const _id = req.user.id;

        const tickets = await Ticket.find({clientId: _id});

        res.status(200).send(tickets);
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.get("/:ticketId", verifyToken, async(req, res) => {
    
    try{
        const _id = req.params.ticketId;
        
        const userId = req.user.id;

        const ticket = await Ticket.find({_id}).find({clientId: userId});

        res.status(200).send(ticket);
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.put("/:ticketId", replyTicketReqValidation, verifyToken, async(req, res) => {
    
    try{

        const { message, sender } = req.body;

        const _id = req.params.ticketId;
        
        const userId = req.user.id;

        const updateTicket = await Ticket.findOneAndUpdate( {_id}, 
            { status: "Pending operator response" , $push: { conversations: { message, sender } }, },
            { new: true }
        )

        res.status(200).send("Ticket has been updated");


    }
    catch(err){
        res.status(500).send(err);
    }
})

router.patch("/close-ticket/:ticketId", verifyToken, async(req, res)=>{

    try{

        const _id = req.params.ticketId;
        
        const clientId = req.user.id;

        const closedTicket = await Ticket.findOneAndUpdate( { _id , clientId }, 
            { status: "Closed" },
            { new: true }
        )

        res.status(200).send("Ticket has been closed");

    }
    catch(err){
        res.status(500).send(err);
    }
})

router.delete("/:ticketId", verifyToken, async(req, res)=>{

    try{

        const _id = req.params.ticketId;
        
        const clientId = req.user.id;

        await Ticket.findOneAndDelete( { _id , clientId })

        res.status(200).send("Ticket has been deleted");
        
    }
    catch(err){
        res.status(500).send(err);
    }
})

module.exports = router;
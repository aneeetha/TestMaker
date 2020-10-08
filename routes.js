const express = require("express");
const router = express.Router();
const Question = require("./models/Question");
var check = 0;
var score = 0;
//get all questions
router.get("/questions", async(req, res) => {
    try{
        const questions = await Question.find();
        if(questions){
            check = 0
            score = 0
            console.log(questions[0]._id)
            return res.redirect("/question")
        }else{
            return res.status(404).json({});
        }
    }catch(error){
        return res.status(500).json({"error": error} );
    }
});

router.get("/question", async(req, res)=>{
    const questions = await Question.find();
    if(check<questions.length){
        res.render("test", {question: questions[check]})
    }
});



router.post("/score", async(req, res) => {
    try{        
        
        const questions = await Question.find()
        const id = req.body.btn
        for(var i=0; i<4; i++){
            if(questions[check].alternatives[i]._id == id){
                if(questions[check].alternatives[i].isCorrect){
                    score++;
                }
                break;
            }
        }
        console.log(score)
        ++check;
        if(check==questions.length){
            res.send("<h1>your score is {%- score %}</h2>");
        }else{
            res.redirect("/question")
        }
    }catch(error){
        return res.status(500).json({"error":error})        
    }
    

})






//get one question
router.get("/questions/:id", async(req, res) => {
    try{
        const _id = req.params.id;
        const question = await Question.findById({_id});
        if(question){
            return res.status(200).json(question);
        }else{
            return res.status(404).json({});
        }
    }catch(error){
        return res.status(500).json({"error": error});
    }
});

//create one question
router.post("/questions", async(req, res) => {
    try{
    const { description } = req.body;
    const { alternatives } = req.body;

    const question = await Question.create({
        description,
        alternatives
    });
    
    return res.status(201).json(question);
    }catch(error){
        return res.status(500).json({"error":error});
    }
});

// update one question
router.put("/questions/:id", async(req, res) => {
    try{
        const _id = req.params.id;
        const { description, alternatives} = req.body;
        const question = await Question.findById({_id});
        if(question){
            question.description = description
            question.alternatives = alternatives
            await question.save();
            return res.status(200).json(question);
        }else{
            const question = await Question.create({
                description,
                alternatives
            });
            return res.status(201).json(question);
        }
    }catch(error){
        return res.status(500).json({"error": error})
    }
    
});

//delete one question
router.delete("/questions/:id", async(req, res) => {
    try{
        const _id = req.params.id;
        const question = await Question.deleteOne({_id});
        if(question.deletedCount === 0){
            return res.status(200).json(question)
        }else{
            return res.status(204).json()
        }
    }catch(error){
        return res.status(500).json({"error":error})
    } 
});





module.exports = router;

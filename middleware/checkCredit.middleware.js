import creditModel from "../model/User/credit.model.js";

export const checkCredits = async (req, res, next) => {
    try {
        // few changes are needed to be done after the testing is complete
        const {creatorId: userId} = req.body;
        // commented out for testing purposes
        // if(!accountType || !userId){
        //     res.status(404).json({
        //         message: "UnAuthorized User"
        //     })
        // }
        // if(accountType !== 'lite'){
        //     return next();
        // }
        console.log("User Id", userId)
    
        const userCredits = await creditModel.findOne({userId});
        if (!userCredits) {
            return res.status(404).json({
                message: "Credit information not found"
            });
        }

        const currentDate = new Date();
        if(currentDate > userCredits.expirationDate){
            // expired? reset the tokens
            userCredits.credits = 30;
            userCredits.expirationDate = new Date();
            userCredits.expirationDate.setMonth(userCredits.expirationDate.getMonth() + 1);
            await userCredits.save();
        }
    
        if(userCredits.credits <= 0){
            return res.status(400).json({
                message: "Insufficient Credits"
            })
        }
    
        userCredits.credits -= 1;
        await userCredits.save();
    
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

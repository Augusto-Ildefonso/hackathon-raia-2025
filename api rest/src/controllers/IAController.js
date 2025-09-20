import axios from "axios";

export const IAVerification = async (req, res) => {
    const link = req.body.url;
    
    if (link){
        const response = await axios.post("http://172.16.21.149:5000/ask", {
            prompt: link
        }) 


        const answer = response.body.lineuzinho;
        const veridico = response.body.veridico;

        

        if (!veridico){
            res.status(200).send({"message": answer});
        } else{
            res.status(200).send({"message": req.body.message});
        }
    } else {
        
    }

    
}
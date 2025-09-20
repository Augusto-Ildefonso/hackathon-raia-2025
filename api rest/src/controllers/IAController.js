import axios from "axios";

export const IAVerification = async (req, res) => {
    const link = req.body.url;

    const response = await axios.post("", {
        url: link
    })

    const answer = response.body.lineuzinho;
    const veridico = response.body.veridico;

    res.status(200).send({"answer": answer});

    if (veridico){
        // Lógica de salvar o dado do user
    }
}
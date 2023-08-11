import { Cert } from "../models/index.js";

export async function getAllCert(req, res) {
    try {
        let certs = await Cert.find({});
        return res.status(200).json({
            message: 'get certs success',
            certs
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'get certs failed'
        })
    }
}
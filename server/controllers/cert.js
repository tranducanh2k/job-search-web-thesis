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

export async function create(req, res) {
    const cert = req.body;
    try {
        const createCert = await Cert.create(cert);
        return res.status(200).json({
            message: 'Create successfully',
            createCert: createCert
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'Create failed'
        })
    }
}

export async function deleteCert(req, res) {
    const id = req.params.id;
    try {
        const deleteCert = await Cert.findByIdAndDelete(id);
        return res.status(200).json({
            message: 'Delete successfully',
            deleteCert
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'Delete cert failed'
        })
    }
}
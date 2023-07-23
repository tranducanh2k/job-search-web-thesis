import {Company} from '../models/index.js'

export async function createOrUpdateCompany(req, res) {
    const company = req.body;
    try {
        const existCompany = await Company.findOne({accountId: company.accountId});
        if(!existCompany) {
            const newCompany = await Company.create(company);
            if(newCompany) {
                return res.status(200).json({
                    message: 'Create Company successfully',
                    company: newCompany
                })
            } else {
                return res.status(404).json({
                    message: 'Create Company failed'
                })
            }
        } else {
            const updatedCompany = await Company.findOneAndUpdate({accountId: company.accountId}, company);
            if(updatedCompany) {
                return res.status(200).json({
                    message: 'Update Company successfully',
                    company: updatedCompany
                })
            } else {
                return res.status(404).json({
                    message: 'Update Company failed'
                })
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: err
        })
    }
}
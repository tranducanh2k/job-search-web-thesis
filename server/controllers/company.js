import {Account, Application, ChatMessage, Company, Interview, InterviewInvitation, Job, Notification} from '../models/index.js'

export async function getAll(req, res) {

    try {
        const company = await Company.find({})
                                    .populate('candidatesFollowing')
                                    .populate({
                                        path: 'candidatesFollowing',
                                        populate: {
                                            path: 'skill'
                                        }
                                    })
                                    .populate('tech');
        return res.status(200).json({
            message: 'get company successfully',
            company
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: err
        })
    }
}

export async function getById(req, res) {
    const id = req.params.id;
    const populateTech = req.query.populateTech;

    try {
        let company = await Company.findById(id)
                                    .populate('candidatesFollowing')
                                    .populate({
                                        path: 'candidatesFollowing',
                                        populate: {
                                            path: 'skill'
                                        }
                                    });
        if(populateTech) {
            company = await Company.findById(id)
                                    .populate('candidatesFollowing')
                                    .populate({
                                        path: 'candidatesFollowing',
                                        populate: {
                                            path: 'skill'
                                        }
                                    }).populate('tech');
        }
        return res.status(200).json({
            message: 'get company successfully',
            company
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: err
        })
    }
}

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

export async function search(req, res) {
    const {searchText} = req.body;
    
    try {
        let companies = await Company.find({$text: { $search: searchText }}, {score: {$meta: 'textScore'}})
                                .sort({score: {$meta: 'textScore'}}).populate('tech');

        if(!companies.length) {
            companies = await Company.find({ name: {$regex: searchText, $options: 'i' } })
                            .populate('tech');
        }

        return res.status(200).json({
            message: 'search companies successfully',
            companies
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'search companies failed'
        })
    }
}

export async function adminDelete(req, res) {
    let id = req.params.id;

    try {
        let deleteCompany = await Company.findByIdAndDelete(id);
        await Account.findByIdAndDelete(deleteCompany.accountId)
        await Application.deleteMany({ companyId: id })
        await InterviewInvitation.deleteMany({ companyId: id })
        await Interview.deleteMany({companyId: id})
        await ChatMessage.deleteMany({senderId: id})
        await Notification.deleteMany({accountId: deleteCompany.accountId })
        await Job.deleteMany({companyId: id})
        return res.status(200).json({
            message: 'Delete company successfully'
        })
    } catch(err) {
        console.log(err)
        return res.status(404).json({
            message: 'Delete company failed'
        })
    }
}
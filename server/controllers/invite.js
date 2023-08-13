import {InterviewInvitation} from "../models/index.js";

export async function getByCompanyId(req, res) {
    const id = req.params.id;

    try {
        let invites = await InterviewInvitation.find({companyId: id})
                                                .populate('companyId')
                                                .populate('employeeId')
                                                .populate('jobId')
        return res.status(200).json({
            message: 'success',
            invites
        })
    } catch(err) {
        console.log(err)
        return res.status(404).json({
            message: 'get by company id failed'
        })
    }
}

export async function getByEmployeeId(req, res) {
    const id = req.params.id;

    try {
        let invites = await InterviewInvitation.find({employeeId: id})
                                                .populate('companyId')
                                                .populate('jobId')
                                                .populate('employeeId');
        return res.status(200).json({
            message: 'success',
            invites
        })
    } catch(err) {
        console.log(err)
        return res.status(404).json({
            message: 'get by employee id failed'
        })
    }
}

export async function create(req, res) {
    const invite = req.body;

    try {
        let existInvite = await InterviewInvitation.findOne({
            employeeId: invite.employeeId,
            jobId: invite.jobId
        })
        if(existInvite) {
            return res.status(404).json({
                message: 'Already invited employee for this job'
            })
        } else {
            let createInvite = await InterviewInvitation.create(invite);
            return res.status(200).json({
                message: 'Invite successfully',
                createInvite
            })
        }
    } catch(err) {
        console.log(err)
        return res.status(404).json({
            message: 'create invite failed'
        })
    }
}

export async function update(req, res) {
    const invite = req.body;

    try {
        let existInvite = await InterviewInvitation.findOne({
            employeeId: invite.employeeId,
            jobId: invite.jobId
        })
        if(existInvite) {
            let updateInvite = await InterviewInvitation.findOneAndUpdate({
                employeeId: invite.employeeId,
                jobId: invite.jobId
            }, invite);
            return res.status(200).json({
                message: 'Update invite successfully',
                updateInvite
            })
        } else {
            return res.status(404).json({
                message: 'Invite not found'
            })
        }
    } catch(err) {
        console.log(err)
        return res.status(404).json({
            message: ' update invite failed'
        })
    }
}
import { Interview, ChatMessage } from "../models/index.js";

export async function getByCompanyEmployee(req, res) {
    const companyId = req.body.companyId;
    const employeeId = req.body.employeeId;

    try {
        let interview = await Interview.findOne({
            companyId, employeeId
        })
        if(interview) {
            return res.status(200).json({
                message: 'getByCompanyEmployee success',
                interview
            })
        } else {
            return res.status(404).json({
                message: 'getByCompanyEmployee failed',
                interview
            })
        }
    } catch(err) {
        console.log(err)
        return res.status(404).json({
            message: err
        })
    }
}

export async function createOrUpdateInterview(req, res) {
    let interview = req.body;

    try {
        let existInterview = await Interview.findOne({
            employeeId: interview.employeeId,
            companyId: interview.companyId
        });
        if(existInterview) {
            let updatedInterview = await Interview.findOneAndUpdate({
                employeeId: existInterview.employeeId,
                companyId: existInterview.companyId
            } ,interview);
            if(updatedInterview) {
                return res.status(200).json({
                    message: 'Update interview successfully',
                    interview
                })
            } else {
                return res.status(404).json({
                    message: 'Update interview failed'
                })
            }
        } else {
            let createdInterview = await Interview.create(interview);
            if(createdInterview) {
                return res.status(200).json({
                    message: 'Create interview successfully',
                    interview
                })
            } else {
                return res.status(404).json({
                    message: 'Create interview failed'
                })
            }
        }
    } catch(err) {
        console.log(err)
        return res.status(404).json({
            message: err
        })
    }
}

export async function addMessage(req, res) {
    let message = req.body;

    try {
        let createdMessage = await ChatMessage(message);
        if(createdMessage) {
            return res.status(200).json({
                message: 'create message successfully',
                createdMessage
            })
        } else {
            return res.status(404).json({
                message: 'create message failed'
            })
        }
    } catch(err) {
        console.log(err)
        return res.status(404).json({
            message: err
        })
    }
}

export async function getInterviewById(req, res) {
    let id = req.params.id;

    try {
        let interview = await Interview.findById(id)
                                        .populate("employeeId")
                                        .populate("companyId")
                                        // .populate("acceptedJobsList")
                                        .populate({
                                            path: 'acceptedJobsList',
                                            populate: {
                                                path: 'requiredSkill'
                                            }
                                        });
        let messages = await ChatMessage.find({interviewId: interview._id})
                                        .sort({timestamp: 1});
        return res.status(200).json({
            message: 'Get interview by id successfully',
            interview, messages
        })

    } catch(err) {
        console.log(err)
        return res.status(404).json({
            message: err
        })
    }
}
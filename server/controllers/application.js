import {Application} from "../models/index.js";

export const getApplicationbyEmployee = async (req, res) => {
    const id = req.params.id;
    try {
        const applications = await Application.find({ employeeId: id })
                                                .populate('jobId')
                                                .populate('companyId');
        return res.status(200).json({
            message: "Get applications successfully",
            applications
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error
        })
    }
}

export const getApplicationbyCompany = async (req, res) => {
    const id = req.params.id;
    try {
        const applications = await Application.find({ companyId: id })
                                                .populate('jobId')
                                                .populate('employeeId');
        return res.status(200).json({
            message: "Get applications successfully",
            applications
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error
        })
    }
}

export const createApplication = async (req, res) => {
    const {employeeId, jobId, companyId, cv, coverLetter} = req.body;
    try {
        const existAp = await Application.findOne({
            employeeId, jobId
        })
        if(existAp) {
            return res.status(404).json({
                message: 'You applied this job before'
            });
        } else {
            const application = await Application.create({
                employeeId, jobId, companyId, cv, coverLetter, status: 'pending'
            });
            return res.status(200).json({
                message: 'You have applied this job successfully',
                application
            });
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error
        })
    }
}

export const updateApplicationById = async (req, res) => {
    const updateFields = req.body;
    const id = req.params.id;

    try {
        const update = await Application.findByIdAndUpdate(id, updateFields);
        return res.status(200).json({
            message: 'Update application by id success',
            update
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error
        })
    }
}
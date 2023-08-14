import { Account, Application, ChatMessage, Employee, Interview, InterviewInvitation, Notification } from "../models/index.js"

export const getAll = async (req, res) => {

    try {
        const employeeList = await Employee.find({}).populate('skill');
        return res.status(200).json({
            message: 'Get all employee successfully',
            employeeList
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error
        })
    }
}

//[GET] /employee/get-by-account-id
export const getByAccountId = async (req, res) => {
    const accountId = req.query.id;

    try {
        const employee = await Employee.findOne({accountId})
                                        .populate({
                                            path: 'jobsFollowing',
                                            populate: {
                                                path: 'requiredSkill',
                                            }
                                        })
                                        .populate({
                                            path: 'jobsFollowing',
                                            populate: {
                                                path: 'companyId'
                                            }
                                        })
        return res.status(200).json({
            message: 'Get employee info by account id successfully',
            employee: employee
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error
        })
    }
}

//[POST] /employee/create-or-update-employee
export const createOrUpdateEmployee = async (req, res) => {
    const employee = req.body;

    try {
        const existEmployee = await Employee.findOne({accountId: employee.accountId});
        if(!existEmployee) {
            const newEmployee = await Employee.create(employee);
            if(newEmployee) {
                return res.status(200).json({
                    message: 'Create employee successfully',
                    employee: newEmployee
                })
            } else {
                return res.status(404).json({
                    message: 'Create employee failed'
                })
            }
        } else {
            const updatedEmployee = await Employee.findOneAndUpdate({accountId: employee.accountId}, employee);
            if(updatedEmployee) {
                return res.status(200).json({
                    message: 'Update employee successfully',
                    employee: updatedEmployee
                })
            } else {
                return res.status(404).json({
                    message: 'Update employee failed'
                })
            }
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error
        })
    }
}

//[GET] /employee/get-by-employee-id
export const getByEmployeeId = async (req, res) => {
    const employeeId = req.params.id;

    try {
        const employee = await Employee.findById(employeeId)
                                        .populate('skill')
                                        .populate({
                                            path: 'jobsFollowing',
                                            populate: {
                                                path: 'requiredSkill',
                                            }
                                        })
                                        .populate({
                                            path: 'jobsFollowing',
                                            populate: {
                                                path: 'companyId'
                                            }
                                        })
        return res.status(200).json({
            message: 'Get employee successfully',
            employee: employee
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: error
        })
    }
}

export async function search(req, res) {
    const {searchText} = req.body;
    
    try {
        let employees = await Employee.find({$text: { $search: searchText }}, {score: {$meta: 'textScore'}})
                                .sort({score: {$meta: 'textScore'}})
                                .populate('skill');

        if(!employees.length) {
            employees = await Employee.find({ name: {$regex: searchText, $options: 'i' } })
                            .populate('skill');
        }

        return res.status(200).json({
            message: 'search emp successfully',
            employees
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'search emp failed'
        })
    }
}

export async function adminDelete(req, res) {
    let id = req.params.id;

    try {
        let deleteEmployee = await Employee.findByIdAndDelete(id);
        await Account.findByIdAndDelete(deleteEmployee.accountId)
        await Application.deleteMany({ employeeId: id })
        await InterviewInvitation.deleteMany({ employeeId: id })
        await Interview.deleteMany({employeeId: id})
        await ChatMessage.deleteMany({senderId: id})
        await Notification.deleteMany({accountId: deleteEmployee.accountId })
        return res.status(200).json({
            message: 'Delete employee successfully'
        })
    } catch(err) {
        console.log(err)
        return res.status(404).json({
            message: 'Delete employee failed'
        })
    }
}
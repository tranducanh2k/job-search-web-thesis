import { Employee } from "../models/index.js"

//[GET] /employee/get-by-account-id
export const getById = async (req, res) => {
    const accountId = req.query.id;

    try {
        const employee = await Employee.findOne({accountId});
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
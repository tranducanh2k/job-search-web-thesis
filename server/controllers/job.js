import {Job} from '../models/index.js';

export async function getJobById(req, res) {
    const id = req.params.id;

    try {
        let job = await Job.findById(id)
                            .populate('companyId')
                            .populate('requiredSkill')
                            .populate({
                                path: 'companyId',
                                populate: 'tech'
                            });
        return res.status(200).json({
            message: 'get job by id successfully', job
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'Get job by id failed'
        })
    }
}

export async function getJobsByPage(req, res) {
    const pageNumb = req.query.page;

    try {
        const jobsPerPage = 10;
        let allJobs = await Job.find({}).populate('companyId').populate('requiredSkill');
        if(allJobs.length) {
            let numberOfPage = Math.floor(allJobs.length / jobsPerPage) + 1;
            let jobsList = allJobs.slice((pageNumb-1)*jobsPerPage, pageNumb*jobsPerPage);
            return res.status(200).json({
                jobsList,
                numberOfPage
            })
        } else {
            return res.status(404).json({
                message: 'No jobs available'
            })
        }

    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'Get jobs by page failed'
        })
    }
}


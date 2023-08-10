import {Company, Job} from '../models/index.js';

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

export async function getJobsByCompanyId(req, res) {
    const id = req.params.id;

    try {
        let jobs = await Job.find({ companyId: id }).populate('requiredSkill');
        return res.status(200).json({
            message: 'get jobs by company id successfully',
            jobs
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'Get jobs by page failed'
        })
    }
}

export async function createOrUpdateJob(req, res) {
    const id = req.params.id;
    let jobData = req.body;

    try {
        if(id === 'add') {
            const newJob = await Job.create(jobData);
            if(newJob) {
                return res.status(200).json({
                    message: 'Create job successfully',
                    job: newJob
                })
            } else {
                return res.status(404).json({
                    message: 'Create job failed'
                })
            }
        } else {
            const existJob = await Job.findById(id);
            if(!existJob) {
                const newJob = await Job.create(existJob);
                if(newJob) {
                    return res.status(200).json({
                        message: 'Create job successfully',
                        job: newJob
                    })
                } else {
                    return res.status(404).json({
                        message: 'Create job failed'
                    })
                }
            } else {
                const updatedJob = await Job.findByIdAndUpdate(id, jobData);
                if(updatedJob) {
                    return res.status(200).json({
                        message: 'Update job successfully',
                        job: updatedJob
                    })
                } else {
                    return res.status(404).json({
                        message: 'Update job failed'
                    })
                }
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'create or update job failed'
        })
    }
}

export async function deleteJob(req, res) {
    const id = req.params.id;

    try {
        let deletedJob = await Job.findByIdAndDelete(id);
        if(deleteJob) {
            return res.status(200).json({
                message: 'Delete job successfully',
                deletedJob
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'delete job failed'
        })
    }
}

export async function getAllJob(req, res) {
    try {
        let jobs = await Job.find({}).populate('companyId').populate('requiredSkill');
        return res.status(200).json({
            message: 'get all jobs successfully',
            jobs
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'get all job failed'
        })
    }
}

export async function search(req, res) {
    const {searchText} = req.body;
    
    try {
        let jobs = await Job.find({$text: { $search: searchText }}, {score: {$meta: 'textScore'}})
                                .sort({score: {$meta: 'textScore'}})
                                .populate('companyId')
                                .populate('requiredSkill');

        if(!jobs.length) {
            jobs = await Job.find({ title: {$regex: searchText, $options: 'i' } })
                            .populate('companyId')
                            .populate('requiredSkill');
        }

        return res.status(200).json({
            message: 'search jobs successfully',
            jobs
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'search job failed'
        })
    }
}
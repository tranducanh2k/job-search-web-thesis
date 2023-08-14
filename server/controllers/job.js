import {Application, Company, Employee, Job, RecommendData} from '../models/index.js';
import { calcSimilarities, createVectorsFromDocs, formatData } from '../utils/recommend.js';

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
    const populate = req.query.populate;

    try {
        let jobs = await Job.find({ companyId: id }).populate('requiredSkill');
        if(populate) {
            jobs = await Job.find({ companyId: id }).populate('requiredSkill')
                                                    .populate('companyId');
        }
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

export async function calculateRecommend(req, res) {
    
    try {
        let jobData = await Job.find({});

        if(jobData) {
            const formattedData = formatData(jobData);
            const docVectors = createVectorsFromDocs(formattedData)
            const trainedData = calcSimilarities(docVectors)
            let trainedJobData = await RecommendData.findOne({ name: 'job' })
            if(!trainedJobData) {
                await RecommendData.create({ name: 'job', data: JSON.stringify(trainedData) })
            } else {
                await RecommendData.findOneAndUpdate({ name: 'job' }, {data: JSON.stringify(trainedData)})
            }

            return res.status(200).json({
                message: 'calculate recommend successfully'
            })
        } else {
            return res.status(404).json({
                message: 'no job created'
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'calculate recommend failed'
        })
    }
}

export async function getRecommend(req, res) {
    const id = req.params.id;
    try {
        let favoriteJobs = [];
        let employee = await Employee.findById(id);
        favoriteJobs.push(employee.jobsFollowing?? []);
        let application = await Application.find({employeeId: id});
        application.map(i => {
            favoriteJobs.push(i.jobId);
        })
        favoriteJobs = favoriteJobs.flat();
        favoriteJobs = favoriteJobs.filter((item, index) => favoriteJobs.indexOf(item) === index);
        
        let recommendData = await RecommendData.findOne({name: 'job'});
        let recommendDataObj = JSON.parse(recommendData.data);
        let returnJobs = [];
        favoriteJobs.map(i => {
            returnJobs.push(recommendDataObj[i])
        })
        returnJobs = returnJobs.flat();
        returnJobs = returnJobs.filter((item, index) => returnJobs.indexOf(item) === index);
        returnJobs = returnJobs.map(i => i.id);

        let result = await Job.find({ _id: { $in: returnJobs } })
                                .populate('requiredSkill')
                                .populate('companyId');
        return res.status(200).json({
            message: 'get recommend successfully',
            result
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'get recommend failed'
        })
    }
}
import { Skill } from "../models/index.js";

export async function getSkills(req, res) {
    try {
        const skills = await Skill.find({});
        return res.status(200).json({
            message: 'Get skills successfully',
            skills
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'Get skills failed'
        })
    }
}

export async function create(req, res) {
    const skill = req.body;
    try {
        const createSkill = await Skill.create(skill);
        return res.status(200).json({
            message: 'Create successfully',
            createSkill: createSkill
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'Create skills failed'
        })
    }
}

export async function deleteSkill(req, res) {
    const id = req.params.id;
    try {
        const deleteSkill = await Skill.findByIdAndDelete(id);
        return res.status(200).json({
            message: 'Delete successfully',
            deleteSkill
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({
            message: 'Delete skills failed'
        })
    }
}
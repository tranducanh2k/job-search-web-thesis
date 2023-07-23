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
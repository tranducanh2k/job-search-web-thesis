export const handleDisplaySalary = (jobData) => {
    if(!jobData.minSalary) {
        return <h4>Up to {jobData.maxSalary} $</h4>
    } else if(!jobData.maxSalary) {
        return <h4>Over {jobData.maxSalary} $</h4>
    } else if(!jobData.maxSalary & !jobData.minSalary) {
        return <h4>$ Negotiable</h4>
    } else {
        return <h4>{jobData.minSalary} - {jobData.maxSalary} $</h4>
    }
}

export const getExperience = (months) => {
    if(months == 0) {
        return `No experience required`
    } else if(months < 12 ) {
        return `${months} months`;
    } else if(months >= 12) {
        if(months % 12 == 0) {
            return `${Math.floor(months/12)} years`
        } else {
            return `${Math.floor(months/12)} years ${months % 12} months`
        }
    }
}

export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function formatDate(date) {
    let d = new Date(date)
    let dateString = d.toLocaleString()
    return dateString
}
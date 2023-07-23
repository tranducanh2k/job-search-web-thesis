const ACCOUNT_TYPE = {
    EMPLOYEE: 'employee',
    COMPANY: 'company'
}
const COMPANY_SIZE = {
    SIZE1: '<100',
    SIZE2: '100-499',
    SIZE3: '500-999',
    SIZE4: '1000+',
    SIZE5: '5000-9999',
    SIZE6: '10.000-19.999',
    SIZE7: '20.000+',
}
const APPLICATION_STATUS = {
    ACCEPTED: 'accepted',
    DECLINED: 'declined',
    PENDING: 'pending'
}
const JOB_LEVEL = {
    INTERN: 'intern',
    FRESHER: 'fresher',
    JUNIOR: 'junior',
    MIDDLE: 'middle',
    SENIOR: 'senior',
    LEADER: 'leader',
    MANAGER: 'manager',
    ALL: 'all' 
}
const JOB_TYPE = {
    IN_OFFICE: 'In-Office',
    HYBRID: 'Hybrid',
    REMOTE: 'Remote',
    OVERSEA: 'Oversea'
}

export {
    ACCOUNT_TYPE, COMPANY_SIZE, APPLICATION_STATUS, JOB_LEVEL, JOB_TYPE
}
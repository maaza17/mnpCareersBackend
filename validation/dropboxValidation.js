const validator = require('validator')
const isEmpty = require('is-empty')

const validateDropboxInput = (data) => {

    let errors =[]

    data.CNIC = !isEmpty(data.CNIC) ? data.CNIC : ''
    data.name = !isEmpty(data.name) ? data.name : ''
    data.email = !isEmpty(data.email) ? data.email : ''
    data.phone = !isEmpty(data.phone) ? data.phone : ''
    data.resume = !isEmpty(data.resume) ? data.resume : ''
    // data.message = !isEmpty(data.message) ? data.message : ''

    // Check CNIC
    if(validator.isEmpty(data.CNIC)){
        errors.push('CNIC number is required!')
    }
    
    
    // Check name
    if(validator.isEmpty(data.name)){
        errors.push('Name is required!')
    }

    // check Email
    if (validator.isEmpty(data.email)) {
        errors.push("Email field is required")
    } else if (!validator.isEmail(data.email)) {
        errors.push('Email is invalid')
    }

    // Phone check
    if (validator.isEmpty(data.phone)) {
        errors.push("Mobile number is required")
    } else if (!validator.isMobilePhone(data.phone)) {
        errors.push('Mobile number is invalid')
    }

    // check resume
    if (validator.isEmpty(data.resume)) {
        errors.push("Resume is required")
    } else if(!validator.isURL(data.resume)){
        errors.push("Resume link error")
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }

}

module.exports = validateDropboxInput
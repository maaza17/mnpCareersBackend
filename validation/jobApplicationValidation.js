const validator = require('validator')
const isEmpty = require('is-empty')

const validateJobApplication = (data) => {

    let errors =[]

    data.CNIC = !isEmpty(data.CNIC) ? data.CNIC : ''
    data.firstName = !isEmpty(data.firstName) ? data.firstName : ''
    data.middleName = !isEmpty(data.middleName) ? data.middleName : ''
    data.lastName = !isEmpty(data.lastName) ? data.lastName : ''
    data.email = !isEmpty(data.email) ? data.email : ''
    data.phone = !isEmpty(data.phone) ? data.phone : ''
    data.address = !isEmpty(data.address) ? data.address : ''
    data.city = !isEmpty(data.city) ? data.city : ''
    data.province = !isEmpty(data.province) ? data.province : ''
    data.postCode = !isEmpty(data.postCode) ? data.postCode : ''
    data.country = !isEmpty(data.country) ? data.country : ''
    data.resume = !isEmpty(data.resume) ? data.resume : ''
    data.motivationStatement = !isEmpty(data.motivationStatement) ? data.motivationStatement : ''

    // Check CNIC
    if(validator.isEmpty(data.CNIC)){
        errors.push('CNIC number is required!')
    }
    
    
    // Check firstName
    if(validator.isEmpty(data.firstName)){
        errors.push('First name is required!')
    }

    // Check lastName
    if(validator.isEmpty(data.lastName)){
        errors.push('Last name is required!')
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

    // check address
    if (validator.isEmpty(data.address)) {
        errors.push("Address is required")
    }

    // check city
    if (validator.isEmpty(data.city)) {
        errors.push("City is required")
    }

    // check province
    if (validator.isEmpty(data.province)) {
        errors.push("Province is required")
    }

    // check postCode
    if (validator.isEmpty(data.postCode)) {
        errors.push("Post code is required")
    }

    // check country
    if (validator.isEmpty(data.country)) {
        errors.push("Country is required")
    }

    // check resume
    if (validator.isEmpty(data.resume)) {
        errors.push("Resume is required")
    } else if(!validator.isURL(data.resume)){
        errors.push("Resume link error")
    }

}

module.exports = validateJobApplication
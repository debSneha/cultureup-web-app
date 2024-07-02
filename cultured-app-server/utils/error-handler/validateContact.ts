const validateContact = (phoneNumber:string) => {
  let contactRegex = /^(\+61|0)[4](?:\s*\d){8}$/;
  if (!contactRegex.test(phoneNumber.replace(/\s/g, ""))){
    return false;
  }
  return true
}

export default validateContact
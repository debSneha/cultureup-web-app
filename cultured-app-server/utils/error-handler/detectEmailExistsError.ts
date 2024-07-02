const detectEmailExistsError = (error: any) => {
    if (error.code == 'P2002' && error.meta.target.includes('email'))
      return true
    return false
  }
  
export default detectEmailExistsError
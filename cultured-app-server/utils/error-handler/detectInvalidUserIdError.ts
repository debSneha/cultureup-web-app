const detectInvalidUserIdError = (error: any) => {
    if (error.code == 'P2003')
      return true
    return false
  }
  
export default detectInvalidUserIdError;
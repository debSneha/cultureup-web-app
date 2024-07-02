const detectIncorrectUIDError = (error: any) => {
    if (error.code == 'P2002' && error.meta.target.includes('firebaseUid'))
      return true
    return false
  }
  
export default detectIncorrectUIDError
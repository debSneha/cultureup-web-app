
const detectUsernameExistsError = (error: any) => {
  if (error.code == 'P2002' && error.meta.target.includes('username'))
    return true
  return false
}

export default detectUsernameExistsError
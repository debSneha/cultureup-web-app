const useFormValidator = () => {
    const checkEmptyFields = (fields: string[]) => {
        for (let i = 0; i < fields.length; i++) {
            if(fields[i].trim() === "") return false
        }
        return true
    }

    const checkMatchingFields = (field1: string, field2: string) => {
        if (field1 !== field2) {
            return false
        }
        return true
    }

    return {
        checkEmptyFields,
        checkMatchingFields
    }
}

export default useFormValidator
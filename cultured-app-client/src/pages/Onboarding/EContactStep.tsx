import { useEffect, useState } from "react";
import { Input, Button, Spinner } from "../../components";

type Props = {
  setPageNum: React.Dispatch<React.SetStateAction<number>>
  nameState: {
    name: string,
    setName: React.Dispatch<React.SetStateAction<string>>
  },
  phoneNumberState: {
    phoneNumber: string,
    setPhoneNumber: React.Dispatch<React.SetStateAction<string>>
  },
}

const EContactStep = ({setPageNum, nameState, phoneNumberState}: Props) => {
  
  const {name, setName} = nameState
  const {phoneNumber, setPhoneNumber} = phoneNumberState

  return ( 
      <div className="px-5 pb-7">
        <div className="text-center font-cormorant italic text-5xl font-bold text-gray-900">
          A loved one's number
        </div>
        <div className="text-center font-sans text-sm font-light text-gray-600 mt-2 mb-5">
          Who can we contact in a time of need?
        </div>
        <Input
          type="text"
          label="Name"
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          value={name}
        />
        <Input
          type="text"
          label="Contact Number"
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="0412346789"
          value={phoneNumber}
        />
        <Button
          onClick={() => setPageNum((pageNum) => pageNum + 1)}
          styles="mt-5 text-lg w-full"
        >
          Next
        </Button>
      </div>
  );
}
 
export default EContactStep;
import Input from "./Input";
import Button from "../Button/Button";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface Props {
  createdTags: {
    inputFields: string[];
    setInputFields: React.Dispatch<React.SetStateAction<string[]>>;
  };
}

const MultipleInput = ({ createdTags }: Props) => {
  const { inputFields, setInputFields } = createdTags;

  const removeInputFields = (index: number) => {
    const rows = [...inputFields];
    rows.splice(index, 1);
    setInputFields(rows);
  };

  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const list = [...inputFields];
    list[index] = value;
    setInputFields(list);
  };

  return (
    <div className="w-full py-4 px-4">
      {inputFields.map((data, index) => (
        <div key={index} className="flex gap-1">
          <div>
            <Input
              type="text"
              label=""
              placeholder="Add a tag"
              value={data}
              onChange={(e) => handleChange(index, e)}
              styles="flex-grow h-3/4"
            />
          </div>
          <div>
            {inputFields.length !== 1 && (
              <Button
                styles="mt-2 h-3/4"
                onClick={() => removeInputFields(index)}
              >
                <XMarkIcon className="h-6 w-6" />
              </Button>
            )}
          </div>
          <div>
            <Button
              styles="mt-2 h-3/4"
              onClick={() => setInputFields([...inputFields, ""])}
            >
              <PlusIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MultipleInput;

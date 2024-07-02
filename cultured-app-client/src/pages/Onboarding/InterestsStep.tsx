import { useEffect, useState } from "react";
import { Button, Spinner } from "../../components";
import Select, { MultiValue } from "react-select";
import { useSearchTags } from "../../api/tag";
import { Tag } from "../../types/Tag";

export type SelectOption = {
  value: number;
  label: string;
}

interface Props {
  handleSubmit: () => void;
  loading: boolean;
  selectedTagsState: {
    selectedTags: SelectOption[],
    setSelectedTags: React.Dispatch<React.SetStateAction<SelectOption[]>>
  }
}

const InterestsStep = ({ handleSubmit, loading, selectedTagsState }: Props) => {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [options, setOptions] = useState<SelectOption[]>([]);
  const {selectedTags, setSelectedTags} = selectedTagsState;
  const { data, refetch, isLoading } = useSearchTags(searchKeyword);

  useEffect(() => {
    if (!isLoading && data) {
      const tags = data as Tag[];
      setOptions(
        tags.map((tag) => ({
          value: tag.id,
          label: tag.name,
        }))
      )
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [searchKeyword]);

  const onChange = (selectedOptions: MultiValue<{
    value: number;
    label: string;
}>) => {
    setSelectedTags([...selectedOptions])
  }

  return (
    <div>
      Interests
      <Select
        isMulti
        options={options}
        value={[...selectedTags]}
        onInputChange={(keyword) => setSearchKeyword(keyword as string)}
        onChange={(selected) => onChange(selected)} 
      />
      <Button onClick={handleSubmit} styles="mt-5 text-lg w-full">
        {loading ? <Spinner /> : "Get Started"}
      </Button>
    </div>
  );
};

export default InterestsStep;

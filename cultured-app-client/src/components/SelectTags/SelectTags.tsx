import { useEffect, useState } from "react";
import Select, { ClassNamesConfig, GroupBase, MultiValue } from "react-select";
import { useSearchTags } from "../../api/tag";
import { Tag } from "../../types/Tag";

export type SelectOption = {
  value: number;
  label: string;
}

export type Props = {
  styles?:  ClassNamesConfig<SelectOption, true, GroupBase<SelectOption>>
  selectedTagsState: {
    selectedTags: Tag[],
    setSelectedTags: React.Dispatch<React.SetStateAction<Tag[]>>
  }
}

const SelectTags = ({styles, selectedTagsState} : Props) => {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [options, setOptions] = useState<SelectOption[]>([]);
  const {selectedTags, setSelectedTags} = selectedTagsState

  const { data, refetch, isLoading } = useSearchTags(searchKeyword);

  useEffect(() => {
    refetch();
  }, [searchKeyword]);

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

  const onChange = (selectedOptions: MultiValue<{
    value: number;
    label: string;
  }>) => {
    const selectedTags: Tag[] = selectedOptions.map(option => ({
      id: option.value,
      name: option.label
    }))
    setSelectedTags(selectedTags)
  }

  return ( 
    <Select
      isMulti
      options={options}
      value={selectedTags.map((tag) => ({
        value: tag.id,
        label: tag.name,
      }))}
      onInputChange={(keyword) => setSearchKeyword(keyword as string)}
      onChange={(selected) => onChange(selected)} 
      classNames={styles}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: 'umeed-tangerine-700',
          primary: 'umeed-tangerine-300',
        },
      })}
    />
  );
}
 
export default SelectTags;
import { useRef, useState } from "react";
import { Chip, Input, Button } from "@nextui-org/react";

const Tags = ({ tags, setTags }) => {
  const [tagValue, setTagValue] = useState("");
  //   const inputRef = useRef(null);
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  const handleAddTag = (e) => {
    // NOTE: Using ref:
    // const tagValue = inputRef.current.value;
    // if (tags.includes(tagValue)) return;
    // setTags((prevTags) => [...prevTags, inputRef.current.value]);
    // inputRef.current.value = "";
    // NOTE: Using useState:
    if (tags.includes(tagValue)) return;
    setTags((prev) => [...prev, tagValue]);
    setTagValue("");
  };
  console.log(tags);

  return (
    <>
      <div className="flex gap-2 justify-center">
        {tags?.map((tag, index) => (
          <Chip key={index} onClose={() => handleRemoveTag(tag)} variant="flat">
            {tag}
          </Chip>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <Input
          size="sm"
          type="text"
          placeholder="Add tags"
          required
          className="basis-1/2"
          value={tagValue}
          onChange={(e) => setTagValue(e.target.value)}
          //   ref={inputRef}
        />
        <Button size="sm" type="button" onClick={handleAddTag}>
          Add Tag
        </Button>
      </div>
    </>
  );
};

export default Tags;

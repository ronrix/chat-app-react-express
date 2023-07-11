import { Input } from "@material-tailwind/react";

export default function InputField({
  handleOnChangeFields,
  label,
  note,
  name,
  type,
  defaultValue,
  placeholder,
}: any) {
  return (
    <label>
      <span className='font-bold capitalize'>{label}</span>
      <Input
        type={type}
        placeholder={placeholder}
        name={name}
        onChange={handleOnChangeFields}
        defaultValue={defaultValue}
        containerProps={{ className: "max-w-[300px] mt-1" }}
      />
      <p className='text-[11px] text-gray-600 mt-1'>{note}</p>
    </label>
  );
}

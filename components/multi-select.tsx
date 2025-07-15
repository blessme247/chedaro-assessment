
// import { SelectEmptyOption } from "./SelectEmptyOption";
import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "./ui/label";

type dataType = {
    label: string;
    value: string;
}

interface Props {
    values: string[];
    setValues: React.Dispatch<React.SetStateAction<string[]>> ;
    data: dataType[];
    label?: string
    maximum?: number
    disableField?: boolean
}

const MultiSelect = ({ values, setValues, data, label, maximum = 20, disableField = false }: Props) => {
    function remove(val: string) {
        if (values.includes(val)) {
            const newVal = values.filter((item) => item !== val)
            setValues(newVal)
        }
    }

    const isDisabled = (val: string) => values.length === maximum && !values.includes(val);

    function handleChange(val: string) {
        if(isDisabled(val)){
            return
        }
        if (!values.includes(val)) {
            setValues((old) => [...old, val])
        } else {
            remove(val)
        }
    }

    return (
        <div className="grid gap-1">
            <Label>{label}</Label>
            <DropdownMenu>
                <DropdownMenuTrigger disabled={disableField}>
                    <div className="flex h-10 w-full relative rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50" >
                        <div className="flex gap-3">
                            <div className="flex items-center gap-3">
                                <span className="bg-primary-50 px-2 rounded-lg text-primary-700 font-semibold flex items-center gap-1">
                                    {data?.find((item) => item?.value === values[0])?.label}
                                </span>
                                {values.length > 1 && <span className="text-primary-700">+{values.length - 1}</span>}
                            </div>
                        </div>
                       <div className="absolute top-[50%] right-[4%] translate-y-[-50%]"> <ChevronDown className="opacity-50" size={15} /></div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white min-w-[var(--radix-dropdown-menu-trigger-width)] p-3 ">
                    <div className="grid gap-1">
                        {
                          data.length > 0 ?   data.map((item, idx) => {
                            const disabled = isDisabled(item.value)
                            return (

                                <div key={idx} onClick={() => handleChange(item?.value)}
                                className={`flex items-center gap-2 w-full cursor-pointer ${
                                    disabled ? "opacity-50 cursor-not-allowed" : ""
                                  }`}
                                // className="flex items-center gap-2  w-full cursor-pointer"
                                >
                                    <input type="checkbox" onChange={() => { }} className="bg-primary" checked={values.includes(item?.value)} disabled={disabled} />
                                    <span className="ml-2" >

                                        {item?.label}
                                    </span>
                                </div>
    )}) :  <div className="px-4  text-center text-gray-500">No options </div>
                        }
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default MultiSelect
import { Input, Space } from "@arco-design/web-react";
import { IconUser } from "@arco-design/web-react/icon";
import { FC, useState } from "react";
import _ from "lodash";
import useLocale from "@/utils/useLocale";

interface IInput {
  val: string;
  setVal: React.Dispatch<React.SetStateAction<string>>;
}

const Search: FC<IInput> = ({ val, setVal }: IInput) => {
  const t = useLocale();
  return (
    <Space style={{ margin: "25px 0 20px 0" }}>
      <div style={{ marginRight: "10px" }}>{t["search.title"]}</div>
      <Input.Search
        value={val}
        searchButton
        prefix={<IconUser />}
        placeholder={t["search.placeholder"]}
        style={{ width: 250 }}
        onChange={(e) => setVal(e)}
      />
    </Space>
  );
};

export default Search;

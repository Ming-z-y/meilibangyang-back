import { useState, useEffect } from "react";
import _ from 'lodash';

interface IData {
  username: string;
  create_time: string;
}

function useSeek<T extends IData>(val: string, sourceData: T[]): [string, T[]] {
  const filterSource = () => {
    if (val !== "") {
      const res: T[] = [];
      if (val !== "") {
        sourceData.map((item) => {
          for (const key in item) {
            if (String(item[key]) === val) {
              res.push(item);
              break;
            }
          }
        });
      }
      return res;
    } else return sourceData;
  }

  const [data, setData] = useState<T[]>(sourceData);

  useEffect(() => {
    const res = filterSource();
    setData(res);
  }, [val]);

  return [val, data];
}

export default useSeek;

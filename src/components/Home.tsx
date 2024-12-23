import { useEffect, useState } from "react";
import axios from "axios";

type DummyData = {
  name: string;
  data: { time: string; value: string }[];
};

type DummyData2 = {
  [key: string]: {
    [key: string]: string;
  };
};

const Home = () => {
  const [originalData, setOriginalData] = useState<DummyData[]>([]);
  const [convertedData, setConvertedData] = useState<DummyData2>({});

  const convertDummyData = (dummyData: DummyData[]): DummyData2 => {
    const result: DummyData2 = {};

    dummyData.forEach((item) => {
      item.data.forEach(({ time, value }) => {
        if (!result[time]) {
          result[time] = {};
        }
        result[time][item.name] = value;
      });
    });

    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/dummy_data.json");
        const data: DummyData[] = response.data;

        setOriginalData(data);

        const converted = convertDummyData(data);
        setConvertedData(converted);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Original Data Table</h2>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Parameter</th>
              {originalData[0]?.data.map((entry) => (
                <th key={entry.time} className="border border-gray-300 p-2">
                  {entry.time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {originalData.map((item) => (
              <tr key={item.name}>
                <td className="border border-gray-300 p-2">{item.name}</td>
                {item.data.map((entry) => (
                  <td key={entry.time} className="border border-gray-300 p-2">
                    {entry.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2 className="text-xl font-bold mt-8 mb-4">Converted Data Table</h2>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Time</th>
              {Object.keys(
                convertedData[Object.keys(convertedData)[0]] || {}
              ).map((item) => (
                <th key={item} className="border border-gray-300 p-2">
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(convertedData).map(([date, values]) => (
              <tr key={date}>
                <td className="border border-gray-300 p-2">{date}</td>
                {Object.values(values).map((value, index) => (
                  <td key={index} className="border border-gray-300 p-2">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;

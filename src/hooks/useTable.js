import { useState, useMemo } from "react";

function useTable(data, sortableKeys) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState(null);

  const sortedData = useMemo(() => {
    let filteredData = data;

    // Search filter
    if (searchQuery) {
      filteredData = data.filter((item) =>
        sortableKeys.some((key) => {
          const value = key.split(".").reduce((obj, prop) => obj?.[prop], item);
          return value
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        })
      );
    }

    // Sort data
    if (sortConfig) {
      filteredData.sort((a, b) => {
        // Retrieve the value for sorting, using nested keys
        const getValue = (obj, key) => {
          return key.split(".").reduce((obj, prop) => obj?.[prop], obj);
        };

        const aValue = getValue(a, sortConfig.key);
        const bValue = getValue(b, sortConfig.key);

        // Handle sorting for numeric fields (like amount)
        if (sortConfig.key === "amount") {
          const amountA = parseFloat(aValue.replace(/[^0-9.-]+/g, "")) || 0;
          const amountB = parseFloat(bValue.replace(/[^0-9.-]+/g, "")) || 0;
          return sortConfig.direction === "asc"
            ? amountA - amountB
            : amountB - amountA;
        }

        // Handle sorting for other types
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        // Handle string sorting (case-insensitive)
        const stringA = aValue ? aValue.toString().toLowerCase() : "";
        const stringB = bValue ? bValue.toString().toLowerCase() : "";
        return sortConfig.direction === "asc"
          ? stringA.localeCompare(stringB)
          : stringB.localeCompare(stringA);
      });
    }

    return filteredData;
  }, [data, searchQuery, sortConfig, sortableKeys]);

  const handleSort = (key) => {
    setSortConfig((prevState) =>
      prevState?.key === key && prevState?.direction === "asc"
        ? { key, direction: "desc" }
        : { key, direction: "asc" }
    );
  };

  return { sortedData, handleSort, searchQuery, setSearchQuery, sortConfig };
}

export default useTable;

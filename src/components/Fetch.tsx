import React, { useState } from "react";
import { useQuery, QueryFunctionContext } from "react-query";
import "../index.css";
import IconButton from "@mui/material/IconButton";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import CloseIcon from "@mui/icons-material/Close";

const Test = () => {
  const [page, setPage] = useState(1);
  const [searching, setSearching] = useState("");
  const pageSize = 10;
  const [sorting, setSorting] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<"rating" | "title">("rating");
  const { isLoading, data, error } = useQuery(
    ["products", page, searching, sorting, sortBy],
    apiCall,
    {
      keepPreviousData: true,
    }
  );

  async function apiCall({
    queryKey,
  }: QueryFunctionContext<
    [string, number, string, "asc" | "desc", "rating" | "title"]
  >) {
    const page = queryKey[1];
    const searching = queryKey[2];
    const sorting = queryKey[3];
    const sortBy = queryKey[4];
    const url = `https://dummyjson.com/products?limit=${pageSize}&skip=${
      (page - 1) * pageSize
    }`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      const filteredData = searching
        ? data.products.filter((product: any) =>
            product.title.toLowerCase().includes(searching.toLowerCase())
          )
        : data.products;
      const sortedData = filteredData.sort((a: any, b: any) => {
        if (sortBy === "rating") {
          return sorting === "asc" ? a.rating - b.rating : b.rating - a.rating;
        } else {
          return sorting === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        }
      });

      const formattedData = sortedData.map((product: any) => ({
        id: product.id,
        title: product.title,
        category: product.category,
        rating: product.rating,
      }));
      return formattedData;
    } catch (err) {
      throw new Error("Failed to fetch data");
    }
  }

  const toggleSort = (field: "rating" | "title") => {
    if (sortBy === field) {
      setSorting((prevSort) => (prevSort === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSorting("asc");
    }
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearching(e.target.value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearching("");
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h2>Error occurred</h2>;
  }

  return (
    <div>
      <h1>Products List</h1>
      <div style={{ position: "relative", display: "inline-block" }}>
        <input
          type="text"
          value={searching}
          onChange={handleSearchChange}
          placeholder="searching products..."
          style={{ paddingRight: "30px" }}
        />
        {searching && (
          <IconButton
            onClick={clearSearch}
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </div>
      {!data || data.length === 0 ? (
        <h1>Data not found</h1>
      ) : (
        <table className="table-container">
          <thead>
            <tr>
              <th>ID</th>
              <th>
                TITLE
                <IconButton onClick={() => toggleSort("title")}>
                  {sortBy === "title" && sorting === "asc" ? (
                    <ArrowUpward />
                  ) : (
                    <ArrowDownward />
                  )}
                </IconButton>
              </th>
              <th>CATEGORY</th>
              <th>
                RATING
                <IconButton onClick={() => toggleSort("rating")}>
                  {sortBy === "rating" && sorting === "asc" ? (
                    <ArrowUpward />
                  ) : (
                    <ArrowDownward />
                  )}
                </IconButton>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((product: any) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>{product.category}</td>
                <td>{product.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <Stack spacing={2} alignItems="center">
          <Pagination
            count={20}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Stack>
      </div>
    </div>
  );
};

export default Test;

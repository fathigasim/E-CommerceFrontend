import React from "react";
import { Pagination as BSPagination, Container } from 'react-bootstrap'

//import {type URLSearchParamsInit } from "react-router-dom";

// interface PaginationbootstrapProps {
//   page: number;
//   totalPages: number;
//   searchParams: URLSearchParams;
//   setSearchParams: (nextInit: URLSearchParamsInit) => void;
// }

const Paginationbootstrap = ({
  page,
  totalPages,
  searchParams,
  setSearchParams,
}) => {

const handlePageChange = (num) => {
  const params = new URLSearchParams(searchParams);
  params.set("pageNumber", num.toString()); // Cleaner way to update params
  setSearchParams(params);
};
  return (
    <Container className="d-flex justify-content-center mt-4">
      {totalPages > 1 && (
        <BSPagination>
          {/* Previous */}
          <BSPagination.Prev
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
          />

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => {
            const num = i + 1;
            return (
              <BSPagination.Item
                key={num}
                active={num === page}
                onClick={() => handlePageChange(num)}
              >
                {num}
              </BSPagination.Item>
            );
          })}

          {/* Next */}
          <BSPagination.Next
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
          />
        </BSPagination>
      )}
    </Container>
  );
};

export default Paginationbootstrap;

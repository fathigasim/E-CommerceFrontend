import React from "react";
import { Pagination as BSPagination, Container } from 'react-bootstrap'
const PaginationbootstrapElipsed = ({ page, totalPages, searchParams, setSearchParams }) => {
  const handlePageChange = (num) => {
    const params = new URLSearchParams(searchParams);
    params.set("pageNumber", num.toString());
    setSearchParams(params);
  };

  if (totalPages <= 1) return null;

  // Configuration: How many pages to show around the current page
  const siblings = 1; 

  const getPageRange = () => {
    const range = [];
    
    for (let i = 1; i <= totalPages; i++) {
      // Logic: Include 1st page, last page, and current page +/- siblings
      if (
        i === 1 || 
        i === totalPages || 
        (i >= page - siblings && i <= page + siblings)
      ) {
        range.push(i);
      } else if (
        i === page - siblings - 1 || 
        i === page + siblings + 1
      ) {
        range.push("..."); // Add ellipsis marker
      }
    }
    // Remove duplicate dots
    return range.filter((item, index) => range.indexOf(item) === index);
  };

  const pages = getPageRange();

  return (
    <Container className="d-flex justify-content-center mt-4">
      <BSPagination>
        <BSPagination.Prev
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
        />

        {pages.map((item, index) => (
          item === "..." ? (
            <BSPagination.Ellipsis key={`ellipsis-${index}`} disabled />
          ) : (
            <BSPagination.Item
              key={item}
              active={item === page}
              onClick={() => handlePageChange(item)}
            >
              {item}
            </BSPagination.Item>
          )
        ))}

        <BSPagination.Next
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
        />
      </BSPagination>
    </Container>
  );
};

export default PaginationbootstrapElipsed;
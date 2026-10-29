package com.gamepulse.dto;

import java.util.List;

public class PageDTO<T> {
    private List<T> content;
    private int pageNumber;
    // Alias for pageNumber expected by some tests
    private int number;
    private int pageSize;
    private long totalElements;
    private int totalPages;

    public PageDTO() {}

    // Constructor with alias handling
    public PageDTO(List<T> content, int pageNumber, int pageSize, long totalElements, int totalPages) {
        this.content = content;
        this.pageNumber = pageNumber;
        this.number = pageNumber; // sync alias
        this.pageSize = pageSize;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
    }



    public List<T> getContent() { return content; }
    public void setContent(List<T> content) { this.content = content; }

    public int getPageNumber() { return pageNumber; }
    // Alias getter for test compatibility
    public int getNumber() { return number; }
    public void setPageNumber(int pageNumber) { this.pageNumber = pageNumber; this.number = pageNumber; }

    public int getPageSize() { return pageSize; }
    public void setPageSize(int pageSize) { this.pageSize = pageSize; }

    public long getTotalElements() { return totalElements; }
    public void setTotalElements(long totalElements) { this.totalElements = totalElements; }

    public int getTotalPages() { return totalPages; }
    // Alias setter (optional)
    public void setNumber(int number) { this.number = number; this.pageNumber = number; }
    public int getSize() { return pageSize; }
}

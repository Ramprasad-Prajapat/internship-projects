package com.gamepulse.controller;

import com.gamepulse.dto.SearchResponseDTO;
import com.gamepulse.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping
    public ResponseEntity<SearchResponseDTO> search(
            @RequestParam(name = "q", required = false, defaultValue = "") String query,
            @RequestParam(name = "filter", required = false) String filter,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        // Basic validation
        if (page < 0 || size <= 0) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(searchService.search(query, filter, page, size));
    }
}

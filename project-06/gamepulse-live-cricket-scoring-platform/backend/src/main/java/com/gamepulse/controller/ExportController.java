package com.gamepulse.controller;

import com.gamepulse.service.ExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;

@RestController
@RequestMapping("/api/exports")
public class ExportController {

    @Autowired
    private ExportService exportService;

    @GetMapping("/matches/{matchId}/summary")
    public ResponseEntity<String> exportMatchSummary(@PathVariable Long matchId) {
        String report = exportService.generateMatchSummaryText(matchId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"match_" + matchId + "_summary.txt\"")
                .contentType(MediaType.TEXT_PLAIN)
                .body(report);
    }

    @GetMapping("/matches/{matchId}/summary/pdf")
    public ResponseEntity<byte[]> exportMatchSummaryPdf(@PathVariable Long matchId) {
        try {
            byte[] pdf = exportService.generateMatchSummaryPdf(matchId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"match_" + matchId + "_summary.pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/matches/{matchId}/scorecard/pdf")
    public ResponseEntity<byte[]> exportScorecardPdf(@PathVariable Long matchId) {
        try {
            byte[] pdf = exportService.generateScorecardPdf(matchId);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"match_" + matchId + "_scorecard.pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }

}

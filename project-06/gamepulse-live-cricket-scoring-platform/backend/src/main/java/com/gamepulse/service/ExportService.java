package com.gamepulse.service;

import com.gamepulse.entity.Innings;
import com.gamepulse.entity.Match;
import com.gamepulse.entity.TournamentTeamStatistics;
import com.gamepulse.repository.InningsRepository;
import com.gamepulse.repository.MatchRepository;
import com.gamepulse.repository.TournamentTeamStatisticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import java.util.List;

@Service
public class ExportService {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private InningsRepository inningsRepository;

    @Autowired
    private TournamentTeamStatisticsRepository standingsRepository;

    @Transactional(readOnly = true)
    public String generateMatchSummaryText(Long matchId) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + matchId));

        StringBuilder sb = new StringBuilder();
        sb.append("=========================================\n");
        sb.append("       GAMEPULSE LIVE MATCH REPORT       \n");
        sb.append("=========================================\n\n");
        sb.append("Match: ").append(match.getTeamA().getName()).append(" vs ").append(match.getTeamB().getName()).append("\n");
        sb.append("Format: ").append(match.getFormat()).append("\n");
        sb.append("Venue: ").append(match.getVenue() != null ? match.getVenue() : "Main Ground").append("\n");
        sb.append("Status: ").append(match.getStatus()).append("\n\n");

        List<Innings> inningsList = inningsRepository.findByMatch(match);
        for (Innings inn : inningsList) {
            sb.append("Innings ").append(inn.getInningsNumber()).append(": ")
              .append(inn.getBattingTeam() != null ? inn.getBattingTeam().getName() : "Team")
              .append(" - ").append(inn.getTotalRuns()).append("/").append(inn.getTotalWickets())
              .append(" (").append(inn.getTotalOversDisplay()).append(" overs)\n");
        }

        sb.append("\nResult: ").append(match.getResultSummary() != null ? match.getResultSummary() : "N/A").append("\n");
        sb.append("=========================================\n");
        return sb.toString();
    }

    @Transactional(readOnly = true)
    public String generateStandingsCSV(Long tournamentId) {
        List<TournamentTeamStatistics> stats = standingsRepository.findByTournamentId(tournamentId);

        StringBuilder sb = new StringBuilder();
        sb.append("Team,Played,Won,Lost,Tied,NoResult,Points,NRR,RunsFor,OversFor,RunsAgainst,OversAgainst\n");
        for (TournamentTeamStatistics st : stats) {
            sb.append(st.getTeam().getName()).append(",")
              .append(st.getPlayed()).append(",")
              .append(st.getWon()).append(",")
              .append(st.getLost()).append(",")
              .append(st.getTied()).append(",")
              .append(st.getNoResult()).append(",")
              .append(st.getPoints()).append(",")
              .append(st.getNrr()).append(",")
              .append(st.getRunsFor()).append(",")
              .append(st.getOversFor()).append(",")
              .append(st.getRunsAgainst()).append(",")
              .append(st.getOversAgainst()).append("\n");
        }
        return sb.toString();
    }

    @Transactional(readOnly = true)
    public byte[] generateMatchSummaryPdf(Long matchId) throws IOException {
        String text = generateMatchSummaryText(matchId);
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);
            PDPageContentStream contentStream = new PDPageContentStream(document, page);
            // Use default font settings; PDFBox will apply a basic font.
            contentStream.beginText();
            float leading = 14.5f;
            contentStream.setLeading(leading);
            float margin = 50;
            float yStart = page.getMediaBox().getHeight() - margin;
            contentStream.newLineAtOffset(margin, yStart);

            String[] lines = text.split("\n");
            for (String line : lines) {
                contentStream.showText(line);
                contentStream.newLineAtOffset(0, -leading);
            }
            contentStream.endText();
            contentStream.close();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return out.toByteArray();
        }
    }

    @Transactional(readOnly = true)
    public byte[] generateScorecardPdf(Long matchId) throws IOException {
        // Placeholder: reuse match summary PDF for scorecard
        return generateMatchSummaryPdf(matchId);
    }
}



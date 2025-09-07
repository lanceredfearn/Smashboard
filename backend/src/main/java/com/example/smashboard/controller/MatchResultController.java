package com.example.smashboard.controller;

import com.example.smashboard.model.MatchResult;
import com.example.smashboard.repository.MatchResultRepository;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin
public class MatchResultController {
    private final MatchResultRepository repo;

    public MatchResultController(MatchResultRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/export/{tournamentId}")
    public ResponseEntity<Resource> export(@PathVariable String tournamentId) throws IOException {
        List<MatchResult> matches = repo.findByTournamentId(tournamentId);
        ClassPathResource template = new ClassPathResource("club_match_csv_template.csv");
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(template.getInputStream(), StandardCharsets.UTF_8))) {
            for (int i = 0; i < 10; i++) {
                String line = reader.readLine();
                if (line == null) break;
                sb.append(line).append("\n");
            }
        }

        DateTimeFormatter df = DateTimeFormatter.ISO_DATE;
        for (MatchResult m : matches) {
            String[] cols = new String[29];
            Arrays.fill(cols, "");
            cols[3] = "D"; // doubles
            cols[4] = tournamentId;
            cols[5] = m.getPlayedOn() != null ? m.getPlayedOn().format(df) : "";
            cols[6] = m.getPlayerA1();
            cols[7] = m.getPlayerA1DuprId();
            cols[9] = m.getPlayerA2();
            cols[10] = m.getPlayerA2DuprId();
            cols[12] = m.getPlayerB1();
            cols[13] = m.getPlayerB1DuprId();
            cols[15] = m.getPlayerB2();
            cols[16] = m.getPlayerB2DuprId();
            cols[19] = Integer.toString(m.getScoreA());
            cols[20] = Integer.toString(m.getScoreB());
            sb.append(Arrays.stream(cols).map(c -> c == null ? "" : c).collect(Collectors.joining(","))).append("\n");
        }

        ByteArrayResource resource = new ByteArrayResource(sb.toString().getBytes(StandardCharsets.UTF_8));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=dupr_matches.csv")
                .contentType(MediaType.TEXT_PLAIN)
                .body(resource);
    }
}

package com.example.smashboard.service;

import com.example.smashboard.model.MatchResult;
import com.example.smashboard.model.TournamentState;
import com.example.smashboard.repository.MatchResultRepository;
import com.example.smashboard.repository.PlayerRepository;
import com.example.smashboard.repository.TournamentStateRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TournamentStateServiceImpl implements TournamentStateService {
    private final TournamentStateRepository repo;
    private final MatchResultRepository matchRepo;
    private final PlayerRepository playerRepo;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public TournamentStateServiceImpl(TournamentStateRepository repo,
                                      MatchResultRepository matchRepo,
                                      PlayerRepository playerRepo) {
        this.repo = repo;
        this.matchRepo = matchRepo;
        this.playerRepo = playerRepo;
    }

    @Override
    public void saveState(String id, String data) {
        repo.save(new TournamentState(id, data));
        try {
            JsonNode root = objectMapper.readTree(data);
            JsonNode matches = root.get("matches");
            if (matches == null || !matches.isArray()) return;

            Map<String, String> idToName = new HashMap<>();
            JsonNode players = root.get("players");
            if (players != null && players.isArray()) {
                for (JsonNode p : players) {
                    idToName.put(p.get("id").asText(), p.get("name").asText());
                }
            }

            for (JsonNode m : matches) {
                int round = m.get("round").asInt();
                int court = m.get("court").asInt();
                int game = m.get("game").asInt();
                if (matchRepo.existsByTournamentIdAndRoundAndCourtAndGame(id, round, court, game)) continue;

                MatchResult result = new MatchResult();
                result.setTournamentId(id);
                result.setRound(round);
                result.setCourt(court);
                result.setGame(game);
                result.setScoreA(m.get("scoreA").asInt());
                result.setScoreB(m.get("scoreB").asInt());
                result.setPlayedOn(LocalDate.now());

                List<String> teamA = objectMapper.convertValue(m.get("teamA"), new TypeReference<List<String>>(){});
                List<String> teamB = objectMapper.convertValue(m.get("teamB"), new TypeReference<List<String>>(){});

                if (teamA.size() > 0) {
                    String name = idToName.get(teamA.get(0));
                    result.setPlayerA1(name);
                    playerRepo.findByName(name).ifPresent(p -> result.setPlayerA1DuprId(p.getDuprId()));
                }
                if (teamA.size() > 1) {
                    String name = idToName.get(teamA.get(1));
                    result.setPlayerA2(name);
                    playerRepo.findByName(name).ifPresent(p -> result.setPlayerA2DuprId(p.getDuprId()));
                }
                if (teamB.size() > 0) {
                    String name = idToName.get(teamB.get(0));
                    result.setPlayerB1(name);
                    playerRepo.findByName(name).ifPresent(p -> result.setPlayerB1DuprId(p.getDuprId()));
                }
                if (teamB.size() > 1) {
                    String name = idToName.get(teamB.get(1));
                    result.setPlayerB2(name);
                    playerRepo.findByName(name).ifPresent(p -> result.setPlayerB2DuprId(p.getDuprId()));
                }

                matchRepo.save(result);
            }
        } catch (Exception ignored) {
        }
    }

    @Override
    public String getState(String id) {
        return repo.findById(id).map(TournamentState::getData).orElse(null);
    }
}


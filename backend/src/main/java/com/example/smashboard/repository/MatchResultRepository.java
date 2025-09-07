package com.example.smashboard.repository;

import com.example.smashboard.model.MatchResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchResultRepository extends JpaRepository<MatchResult, Long> {
    boolean existsByTournamentIdAndRoundAndCourtAndGame(String tournamentId, int round, int court, int game);
    List<MatchResult> findByTournamentId(String tournamentId);
}

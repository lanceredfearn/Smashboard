package com.example.smashboard.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"tournamentId", "round", "court", "game"}))
public class MatchResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tournamentId;
    private int round;
    private int court;
    private int game;

    private String playerA1;
    private String playerA1DuprId;
    private String playerA2;
    private String playerA2DuprId;
    private String playerB1;
    private String playerB1DuprId;
    private String playerB2;
    private String playerB2DuprId;

    private int scoreA;
    private int scoreB;

    private LocalDate playedOn;

    public MatchResult() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTournamentId() {
        return tournamentId;
    }

    public void setTournamentId(String tournamentId) {
        this.tournamentId = tournamentId;
    }

    public int getRound() {
        return round;
    }

    public void setRound(int round) {
        this.round = round;
    }

    public int getCourt() {
        return court;
    }

    public void setCourt(int court) {
        this.court = court;
    }

    public int getGame() {
        return game;
    }

    public void setGame(int game) {
        this.game = game;
    }

    public String getPlayerA1() {
        return playerA1;
    }

    public void setPlayerA1(String playerA1) {
        this.playerA1 = playerA1;
    }

    public String getPlayerA1DuprId() {
        return playerA1DuprId;
    }

    public void setPlayerA1DuprId(String playerA1DuprId) {
        this.playerA1DuprId = playerA1DuprId;
    }

    public String getPlayerA2() {
        return playerA2;
    }

    public void setPlayerA2(String playerA2) {
        this.playerA2 = playerA2;
    }

    public String getPlayerA2DuprId() {
        return playerA2DuprId;
    }

    public void setPlayerA2DuprId(String playerA2DuprId) {
        this.playerA2DuprId = playerA2DuprId;
    }

    public String getPlayerB1() {
        return playerB1;
    }

    public void setPlayerB1(String playerB1) {
        this.playerB1 = playerB1;
    }

    public String getPlayerB1DuprId() {
        return playerB1DuprId;
    }

    public void setPlayerB1DuprId(String playerB1DuprId) {
        this.playerB1DuprId = playerB1DuprId;
    }

    public String getPlayerB2() {
        return playerB2;
    }

    public void setPlayerB2(String playerB2) {
        this.playerB2 = playerB2;
    }

    public String getPlayerB2DuprId() {
        return playerB2DuprId;
    }

    public void setPlayerB2DuprId(String playerB2DuprId) {
        this.playerB2DuprId = playerB2DuprId;
    }

    public int getScoreA() {
        return scoreA;
    }

    public void setScoreA(int scoreA) {
        this.scoreA = scoreA;
    }

    public int getScoreB() {
        return scoreB;
    }

    public void setScoreB(int scoreB) {
        this.scoreB = scoreB;
    }

    public LocalDate getPlayedOn() {
        return playedOn;
    }

    public void setPlayedOn(LocalDate playedOn) {
        this.playedOn = playedOn;
    }
}


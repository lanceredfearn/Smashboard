package com.example.smashboard.service;

public interface TournamentStateService {
    void saveState(String id, String data);
    String getState(String id);
}


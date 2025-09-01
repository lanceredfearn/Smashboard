package com.example.smashboard.service;

import com.example.smashboard.model.TournamentState;
import com.example.smashboard.repository.TournamentStateRepository;
import org.springframework.stereotype.Service;

@Service
public class TournamentStateServiceImpl implements TournamentStateService {
    private final TournamentStateRepository repo;

    public TournamentStateServiceImpl(TournamentStateRepository repo) {
        this.repo = repo;
    }

    @Override
    public void saveState(String id, String data) {
        repo.save(new TournamentState(id, data));
    }

    @Override
    public String getState(String id) {
        return repo.findById(id).map(TournamentState::getData).orElse(null);
    }
}


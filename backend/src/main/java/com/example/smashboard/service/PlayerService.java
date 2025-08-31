package com.example.smashboard.service;

import com.example.smashboard.model.Player;
import com.example.smashboard.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {
    private final PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public Player savePlayer(Player player) {
        return playerRepository.save(player);
    }

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public Optional<Player> getPlayerByInternalId(Long internalId) {
        return playerRepository.findById(internalId);
    }

    public Optional<Player> getPlayerByDuprId(String duprId) {
        return playerRepository.findById(duprId);
    }

    public Optional<Player> getPlayerByName(String name) {
        return playerRepository.findByName(name);
    }

    public List<Player> searchPlayersByName(String name) {
        return playerRepository.findByNameContainingIgnoreCase(name);
    }

    public void deletePlayer(Long internalId) {
        playerRepository.deleteById(internalId);
    }
}

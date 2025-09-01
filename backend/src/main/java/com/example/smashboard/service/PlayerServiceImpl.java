package com.example.smashboard.service;

import com.example.smashboard.model.Player;
import com.example.smashboard.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerServiceImpl implements PlayerService {
    private final PlayerRepository playerRepository;

    public PlayerServiceImpl(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @Override
    public Player savePlayer(Player player) {
        return playerRepository.save(player);
    }

    @Override
    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    @Override
    public Optional<Player> getPlayerByInternalId(Long internalId) {
        return playerRepository.findById(internalId);
    }

    @Override
    public Optional<Player> getPlayerByDuprId(String duprId) {
        return playerRepository.findByDuprId(duprId);
    }

    @Override
    public Optional<Player> getPlayerByName(String name) {
        return playerRepository.findByName(name);
    }

    @Override
    public List<Player> searchPlayersByName(String name) {
        return playerRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public void deletePlayer(Long internalId) {
        playerRepository.deleteById(internalId);
    }
}

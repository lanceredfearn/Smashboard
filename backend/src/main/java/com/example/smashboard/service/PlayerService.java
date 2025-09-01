package com.example.smashboard.service;

import com.example.smashboard.model.Player;

import java.util.List;
import java.util.Optional;

public interface PlayerService {
    Player savePlayer(Player player);
    List<Player> getAllPlayers();
    Optional<Player> getPlayerByInternalId(Long internalId);
    Optional<Player> getPlayerByDuprId(String duprId);
    Optional<Player> getPlayerByName(String name);
    List<Player> searchPlayersByName(String name);
    void deletePlayer(Long internalId);
}

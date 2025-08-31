package com.example.smashboard.controller;

import com.example.smashboard.model.Player;
import com.example.smashboard.service.PlayerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
@CrossOrigin
public class PlayerController {
    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping
    public List<Player> getAll() {
        return playerService.getAllPlayers();
    }

    @GetMapping("/search")
    public List<Player> searchByName(@RequestParam("q") String query) {
        return playerService.searchPlayersByName(query);
    }

    @PostMapping
    public Player create(@RequestBody Player player) {
        return playerService.savePlayer(player);
    }
}

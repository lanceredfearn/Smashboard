package com.example.smashboard.service;

import com.example.smashboard.model.Player;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class DatabaseSeeder {
    private final DuprAuthService duprAuthService;
    private final DuprClubService duprClubService;
    private final PlayerService playerService;

    public DatabaseSeeder(DuprAuthService duprAuthService, DuprClubService duprClubService, PlayerService playerService) {
        this.duprAuthService = duprAuthService;
        this.duprClubService = duprClubService;
        this.playerService = playerService;
    }

    public void seed() {
        String token = duprAuthService.loginAndGetToken(); // now pulls from env
        List<Map<String, Object>> members = duprClubService.getClubMembers(token, "6217578194");

        for (Map<String, Object> member : members) {
            Player player = new Player();
            player.setId(member.get("id").toString());
            player.setName((String) member.get("name"));
            player.setRating(member.get("rating") != null
                    ? Double.parseDouble(member.get("rating").toString())
                    : null);
            playerService.savePlayer(player);
        }
    }
}

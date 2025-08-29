package com.example.smashboard.repository;

import com.example.smashboard.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    Optional<Player> findById(String id);       // DUPR ID

    Optional<Player> findByName(String name);   // by player name
}

package com.example.smashboard.controller;

import com.example.smashboard.service.TournamentStateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/state")
@CrossOrigin
public class TournamentStateController {
    private final TournamentStateService service;

    public TournamentStateController(TournamentStateService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ResponseEntity<String> get(@PathVariable String id) {
        String data = service.getState(id);
        if (data == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(data);
    }

    @PostMapping("/{id}")
    public ResponseEntity<Void> save(@PathVariable String id, @RequestBody String data) {
        service.saveState(id, data);
        return ResponseEntity.ok().build();
    }
}

